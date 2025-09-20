import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const host = process.env.NEXT_PUBLIC_APP_URL || "https://pinstack.app"
  const now = new Date().toISOString()
  return [
    { url: `${host}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${host}/boards`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${host}/reels`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
  ]
}
