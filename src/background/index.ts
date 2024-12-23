// src/background/index.ts
import { StorageService } from "@/services/storage"
import { UrlService } from "@/services/url"
import { AnalyticsService } from "@/services/analytics"
import { ShortcutMap } from "@/types"
// Initialize analytics periodic sync
AnalyticsService.startPeriodicSync()

// Handle URL interception
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
   try {
      const url = new URL(details.url)

      if (url.hostname === "go") {
         const shortcut = url.pathname.substring(1) // Remove leading slash
         if (shortcut) {
            const shortcuts = await StorageService.getShortcuts()
            await handleShortcut(shortcut, shortcuts, details.tabId)
         }
      }
   } catch (error) {
      console.error("Navigation error:", error)
   }
})

// Handle omnibox suggestions
chrome.omnibox.onInputChanged.addListener(
   debounce(
      async (
         text: string,
         suggest: (suggestResults: chrome.omnibox.SuggestResult[]) => void
      ) => {
         try {
            const shortcuts = await StorageService.getShortcuts()
            const suggestions = getSuggestions(text, shortcuts)
            suggest(suggestions)
         } catch (error) {
            console.error("Suggestion error:", error)
         }
      },
      300
   )
)

// Handle omnibox shortcut selection
chrome.omnibox.onInputEntered.addListener(async (text: string) => {
   try {
      const shortcuts = await StorageService.getShortcuts()
      await handleShortcut(text, shortcuts)
   } catch (error) {
      console.error("Shortcut error:", error)
   }
})

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command: string) => {
   if (command === "open-popup") {
      try {
         await chrome.action.openPopup()
      } catch (error) {
         console.error("Failed to open popup:", error)
      }
   }
})

// Utility functions
async function handleShortcut(
   shortcut: string,
   shortcuts: ShortcutMap,
   tabId: number | null = null
) {
   if (shortcuts[shortcut]) {
      const url = UrlService.sanitizeUrl(shortcuts[shortcut].url)

      // Track usage
      await updateShortcutUsage(shortcut)

      if (tabId) {
         await chrome.tabs.update(tabId, { url })
      } else {
         await chrome.tabs.create({ url })
      }
   } else {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(shortcut)}`
      if (tabId) {
         await chrome.tabs.update(tabId, { url: searchUrl })
      } else {
         await chrome.tabs.create({ url: searchUrl })
      }
   }
}

async function updateShortcutUsage(shortcut: string) {
   try {
      const shortcuts = await StorageService.getShortcuts()
      const stats = await StorageService.getStats()

      // Update shortcut usage count
      if (shortcuts[shortcut]) {
         shortcuts[shortcut].usageCount =
            (shortcuts[shortcut].usageCount || 0) + 1
         shortcuts[shortcut].lastUsed = Date.now()
      }

      // Update stats
      stats.lastUsed = shortcut
      stats.usageCounts[shortcut] = (stats.usageCounts[shortcut] || 0) + 1

      // Update recently used
      const recentlyUsed = await StorageService.getRecentlyUsed()
      recentlyUsed.unshift({ shortcut, timestamp: Date.now() })
      if (recentlyUsed.length > 10) {
         recentlyUsed.pop()
      }

      // Save updates
      await Promise.all([
         StorageService.setShortcuts(shortcuts),
         StorageService.setStats(stats),
         StorageService.setRecentlyUsed(recentlyUsed),
      ])

      // Track analytics
      await AnalyticsService.trackEvent("shortcut_used", { shortcut })
   } catch (error) {
      console.error("Failed to update usage:", error)
   }
}

function getSuggestions(
   text: string,
   shortcuts: ShortcutMap
): chrome.omnibox.SuggestResult[] {
   return Object.entries(shortcuts)
      .filter(([shortcut]) =>
         shortcut.toLowerCase().includes(text.toLowerCase())
      )
      .map(([shortcut, data]) => ({
         content: shortcut,
         description: `<match>${shortcut}</match> - ${data.url}${
            data.category !== "uncategorized" ? ` (${data.category})` : ""
         }`,
      }))
}

function debounce<T extends (...args: any[]) => any>(
   func: T,
   wait: number
): (...args: Parameters<T>) => void {
   let timeout: NodeJS.Timeout
   return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
   }
}
