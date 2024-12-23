// src/services/analytics.ts
import { Analytics, AnalyticsEvent } from "@/types"
import { StorageService } from "./storage"

export class AnalyticsService {
   private static readonly MAX_STORED_EVENTS = 1000
   private static readonly SYNC_INTERVAL = 60 * 60 * 1000 // 1 hour

   static async trackEvent(eventName: string, data: any): Promise<void> {
      const settings = await StorageService.getSettings()
      if (!settings.analyticsEnabled) return

      const event: AnalyticsEvent = {
         eventName,
         timestamp: Date.now(),
         data,
      }

      const analytics = await StorageService.getAnalytics()
      analytics.events.push(event)

      // Trim old events if we exceed the maximum
      if (analytics.events.length > this.MAX_STORED_EVENTS) {
         analytics.events = analytics.events.slice(-this.MAX_STORED_EVENTS)
      }

      await StorageService.setAnalytics(analytics)

      // Try to sync if we're online
      if (navigator.onLine) {
         await this.syncEvents()
      }
   }

   static async syncEvents(): Promise<void> {
      try {
         const analytics = await StorageService.getAnalytics()
         if (analytics.events.length === 0) return

         // Here you would normally send the events to your analytics endpoint
         // For now, we'll just log them
         console.log("Syncing analytics events:", analytics.events)

         // Clear synced events
         analytics.events = []
         await StorageService.setAnalytics(analytics)
      } catch (error) {
         console.error("Error syncing analytics:", error)
      }
   }

   static startPeriodicSync(): void {
      setInterval(() => {
         if (navigator.onLine) {
            this.syncEvents()
         }
      }, this.SYNC_INTERVAL)
   }

   static async getEventCounts(): Promise<Record<string, number>> {
      const analytics = await StorageService.getAnalytics()
      return analytics.events.reduce(
         (acc, event) => {
            acc[event.eventName] = (acc[event.eventName] || 0) + 1
            return acc
         },
         {} as Record<string, number>
      )
   }
}
