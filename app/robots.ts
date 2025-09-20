import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const host = process.env.NEXT_PUBLIC_APP_URL || "https://pinstack.example.com"
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${host}/sitemap.xml`,
  }
}
