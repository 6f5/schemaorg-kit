/**
 * software-app.ts — SoftwareApplication, MobileApplication, WebApplication
 *
 * Demonstrates: all three app types, review requirements, and
 * a free vs. paid app.
 */

import {
  createSoftwareApplication,
  createMobileApplication,
  createWebApplication,
  createGraph,
  ReviewSchema,
  AggregateRatingSchema,
} from "../src/index";

// ─── Mobile App (iOS/Android) ─────────────────────────────────────────────────
// Google required: name, offers.price, and aggregateRating or review

const mobileApp = createMobileApplication({
  name: "Acme Finance Tracker",
  description: "Track expenses, set budgets, and visualize your spending — all in one place.",
  applicationCategory: "FinanceApplication",
  operatingSystem: ["ANDROID 8.0+", "iOS 14.0+"],
  offers: {
    "@type": "Offer",
    price: 0,
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.7,
    ratingCount: 28400,
    bestRating: 5,
    worstRating: 1,
  },
  review: ReviewSchema.parse({
    author: { "@type": "Person", name: "TechReviewDaily" },
    reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5 },
    reviewBody: "The best personal finance app I've used. Clean interface, great insights.",
    datePublished: "2025-02-14",
  }),
  screenshot: [
    "https://acme.com/app/screenshot-1.png",
    "https://acme.com/app/screenshot-2.png",
  ],
  softwareVersion: "3.2.1",
  downloadUrl: "https://play.google.com/store/apps/details?id=com.acme.finance",
  installUrl: "https://apps.apple.com/app/acme-finance-tracker/id123456789",
  countriesSupported: ["US", "GB", "CA", "AU"],
  featureList: [
    "Expense tracking",
    "Budget templates",
    "Bank sync",
    "Monthly reports",
    "Dark mode",
  ],
});

console.log("=== Mobile App (free) ===");
console.log(mobileApp.toScript());

// ─── Paid desktop app ─────────────────────────────────────────────────────────

const desktopApp = createSoftwareApplication({
  name: "Acme Design Studio Pro",
  description: "Professional vector design software for macOS and Windows.",
  applicationCategory: "DesignApplication",
  operatingSystem: ["Windows 10+", "macOS 12+"],
  offers: {
    "@type": "Offer",
    price: 99.99,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.5,
    reviewCount: 1840,
    bestRating: 5,
  },
  softwareVersion: "12.0",
  fileSize: "450 MB",
  downloadUrl: "https://acme.com/design-studio/download",
  featureList: [
    "Vector illustration",
    "Photo editing",
    "Typography tools",
    "Cloud sync",
    "Plugin ecosystem",
  ],
  screenshot: "https://acme.com/design-studio/screenshot.png",
});

console.log("\n=== Desktop App (paid) ===");
console.log(desktopApp.toJsonLd());

// ─── Web Application ──────────────────────────────────────────────────────────

const webApp = createWebApplication({
  name: "Acme Project Manager",
  description: "Collaborative project management for remote teams. No install required.",
  applicationCategory: "BusinessApplication",
  browserRequirements: "Requires Chrome 90+, Firefox 88+, or Safari 14+",
  offers: {
    "@type": "Offer",
    price: 12,
    priceCurrency: "USD",
    description: "Per user/month",
    availability: "https://schema.org/InStock",
    url: "https://acme.com/project-manager/pricing",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.6,
    reviewCount: 5240,
    bestRating: 5,
  },
  url: "https://app.acme.com",
  featureList: [
    "Kanban boards",
    "Gantt charts",
    "Time tracking",
    "Integrations with Slack, GitHub",
    "99.9% uptime SLA",
  ],
});

console.log("\n=== Web Application ===");
console.log(webApp.toJsonLd());

// ─── @graph (multiple apps on one page) ──────────────────────────────────────

const graph = createGraph([mobileApp, webApp]);

console.log("\n=== Apps @graph ===");
console.log(graph.toScript());
