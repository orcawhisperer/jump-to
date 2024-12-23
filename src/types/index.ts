// src/types/index.ts

export interface Shortcut {
   url: string
   category: string
   created: number
   lastUsed?: number
   usageCount?: number
   tags?: string[]
}

export interface ShortcutMap {
   [key: string]: Shortcut
}

export interface UsageStats {
   totalShortcuts: number
   mostUsed: string | null
   lastUsed: string | null
   dailyUsage: DailyUsage[]
   version: string
   usageCounts: {
      [key: string]: number
   }
}

export interface DailyUsage {
   date: number
   shortcuts: {
      [key: string]: number
   }
}

export interface Settings {
   analyticsEnabled: boolean
   darkMode: boolean
   keyboardShortcutsEnabled: boolean
   autoBackupEnabled: boolean
   backupFrequency: number
   defaultCategory: string
}

export interface RecentItem {
   shortcut: string
   timestamp: number
}

export interface Analytics {
   events: AnalyticsEvent[]
}

export interface AnalyticsEvent {
   eventName: string
   timestamp: number
   data: any
}
