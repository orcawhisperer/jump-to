// src/services/url.ts

export class UrlService {
   static sanitizeUrl(url: string): string {
      let cleanUrl = url.trim()

      // Add protocol if missing
      if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
         cleanUrl = "https://" + cleanUrl
      }

      try {
         const urlObj = new URL(cleanUrl)
         return urlObj.toString()
      } catch (error) {
         throw new Error("Invalid URL")
      }
   }

   static isValidUrl(url: string): boolean {
      try {
         this.sanitizeUrl(url)
         return true
      } catch {
         return false
      }
   }

   static isValidShortcut(shortcut: string): boolean {
      const shortcutRegex = /^[a-zA-Z0-9-]+$/
      return shortcutRegex.test(shortcut)
   }

   static validateAndSanitize(
      shortcut: string,
      url: string
   ): { shortcut: string; url: string } {
      if (!this.isValidShortcut(shortcut)) {
         throw new Error(
            "Invalid shortcut format. Use only letters, numbers, and hyphens."
         )
      }

      const sanitizedUrl = this.sanitizeUrl(url)
      const cleanShortcut = shortcut.toLowerCase()

      return {
         shortcut: cleanShortcut,
         url: sanitizedUrl,
      }
   }

   static extractDomain(url: string): string {
      try {
         const urlObj = new URL(this.sanitizeUrl(url))
         return urlObj.hostname
      } catch {
         return url
      }
   }

   static suggestShortcut(url: string): string {
      try {
         const domain = this.extractDomain(url)
         const parts = domain.split(".")

         // Remove common TLDs and 'www'
         const relevantParts = parts.filter(
            (part) => !["com", "org", "net", "edu", "gov", "www"].includes(part)
         )

         if (relevantParts.length > 0) {
            return relevantParts[0].toLowerCase()
         }

         return domain.split(".")[0].toLowerCase()
      } catch {
         return ""
      }
   }

   static async validateSafety(
      url: string
   ): Promise<{ safe: boolean; reason?: string }> {
      try {
         // You could integrate with Google Safe Browsing API or similar service here
         // For now, we'll just do basic validation
         const urlObj = new URL(this.sanitizeUrl(url))

         // Check for common red flags
         const suspicious = ["example.com", "localhost", "127.0.0.1", "[::1]"]

         if (suspicious.some((domain) => urlObj.hostname.includes(domain))) {
            return {
               safe: false,
               reason: "Suspicious domain detected",
            }
         }

         return { safe: true }
      } catch (error) {
         return {
            safe: false,
            reason: "Invalid URL format",
         }
      }
   }
}
