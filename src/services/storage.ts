// src/services/storage.ts
import {
   ShortcutMap,
   Settings,
   UsageStats,
   RecentItem,
   Analytics,
} from "@/types"

export class StorageService {
   static async getShortcuts(): Promise<ShortcutMap> {
      const { shortcuts = {} } = await chrome.storage.local.get("shortcuts")
      return shortcuts
   }

   static async setShortcuts(shortcuts: ShortcutMap): Promise<void> {
      await chrome.storage.local.set({ shortcuts })
   }

   static async getSettings(): Promise<Settings> {
      const { settings = this.getDefaultSettings() } =
         await chrome.storage.local.get("settings")
      return settings
   }

   static async setSettings(settings: Settings): Promise<void> {
      await chrome.storage.local.set({ settings })
   }

   static async getStats(): Promise<UsageStats> {
      const { stats = this.getDefaultStats() } =
         await chrome.storage.local.get("stats")
      return stats
   }

   static async setStats(stats: UsageStats): Promise<void> {
      await chrome.storage.local.set({ stats })
   }

   static async getRecentlyUsed(): Promise<RecentItem[]> {
      const { recentlyUsed = [] } =
         await chrome.storage.local.get("recentlyUsed")
      return recentlyUsed
   }

   static async setRecentlyUsed(items: RecentItem[]): Promise<void> {
      await chrome.storage.local.set({ recentlyUsed: items })
   }

   static async getAnalytics(): Promise<Analytics> {
      const { analytics = { events: [] } } =
         await chrome.storage.local.get("analytics")
      return analytics
   }

   static async setAnalytics(analytics: Analytics): Promise<void> {
      await chrome.storage.local.set({ analytics })
   }

   private static getDefaultSettings(): Settings {
      return {
         analyticsEnabled: true,
         darkMode: false,
         keyboardShortcutsEnabled: true,
         autoBackupEnabled: true,
         backupFrequency: 7 * 24 * 60 * 60 * 1000, // 7 days
         defaultCategory: "uncategorized",
      }
   }

   private static getDefaultStats(): UsageStats {
      return {
         totalShortcuts: 0,
         mostUsed: null,
         lastUsed: null,
         dailyUsage: [],
         version: "1.0.0",
         usageCounts: {},
      }
   }

   static async clearAll(): Promise<void> {
      await chrome.storage.local.clear()
   }

   static async export(): Promise<string> {
      const data = await chrome.storage.local.get(null)
      return JSON.stringify(data, null, 2)
   }

   static async import(data: string): Promise<void> {
      try {
         const parsed = JSON.parse(data)
         await chrome.storage.local.clear()
         await chrome.storage.local.set(parsed)
      } catch (error) {
         throw new Error("Invalid import data")
      }
   }
}
