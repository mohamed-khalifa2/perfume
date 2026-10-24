import type { MetadataRoute } from "next";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

const STATIC_ROUTES = [
  "",
  "/shop",
  "/about",
  "/contact",
  "/orders/track",
  "/privacy",
  "/terms",
  "/shipping-returns",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
