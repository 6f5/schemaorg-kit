/**
 * video.ts — VideoObject structured data for video rich results
 *
 * Demonstrates: standard video, livestream, video with key moments (Clips),
 * and video within an Article @graph.
 */

import {
  createVideoObject,
  createArticle,
  createOrganization,
  createPerson,
  createGraph,
  ClipSchema,
  BroadcastEventSchema,
} from "../src/index";

const publisher = createOrganization({
  name: "Tech Talks",
  url: "https://techtalks.example.com",
  logo: "https://techtalks.example.com/logo.png",
});

// ─── Standard Video ───────────────────────────────────────────────────────────

const video = createVideoObject({
  name: "TypeScript 5.0: What's New — Full Tutorial",
  description: "A comprehensive walkthrough of every new feature in TypeScript 5.0, with live code examples.",
  thumbnailUrl: [
    "https://techtalks.example.com/thumb/ts5-1200x900.jpg",
    "https://techtalks.example.com/thumb/ts5-1200x675.jpg",
    "https://techtalks.example.com/thumb/ts5-900x900.jpg",
  ],
  uploadDate: "2025-03-15",
  duration: "PT1H12M30S",
  contentUrl: "https://techtalks.example.com/videos/ts5-full.mp4",
  embedUrl: "https://www.youtube.com/embed/XyZ_abc123",
  interactionStatistic: {
    "@type": "InteractionCounter",
    interactionType: "https://schema.org/WatchAction",
    userInteractionCount: 48200,
  },
  // Key moments — appear as chapters in Google Search
  hasPart: [
    ClipSchema.parse({
      name: "Introduction",
      startOffset: 0,
      endOffset: 120,
      url: "https://techtalks.example.com/videos/ts5-full.mp4#t=0",
    }),
    ClipSchema.parse({
      name: "Decorators",
      startOffset: 120,
      endOffset: 840,
      url: "https://techtalks.example.com/videos/ts5-full.mp4#t=120",
    }),
    ClipSchema.parse({
      name: "const Type Parameters",
      startOffset: 840,
      endOffset: 1560,
      url: "https://techtalks.example.com/videos/ts5-full.mp4#t=840",
    }),
    ClipSchema.parse({
      name: "Multiple Config Files",
      startOffset: 1560,
      endOffset: 2280,
      url: "https://techtalks.example.com/videos/ts5-full.mp4#t=1560",
    }),
    ClipSchema.parse({
      name: "Performance Improvements",
      startOffset: 2280,
      endOffset: 4350,
      url: "https://techtalks.example.com/videos/ts5-full.mp4#t=2280",
    }),
  ],
  regionsAllowed: ["US", "GB", "CA", "AU"],
  requiresSubscription: false,
});

console.log("=== Video with key moments ===");
console.log(video.toScript());

// ─── Livestream video ─────────────────────────────────────────────────────────

const livestream = createVideoObject({
  name: "LIVE: React Conf 2025 — Keynote",
  description: "Watch the React Conf 2025 opening keynote live. New React features announced.",
  thumbnailUrl: "https://techtalks.example.com/thumb/react-conf-live.jpg",
  uploadDate: "2025-05-22",
  contentUrl: "https://techtalks.example.com/live/react-conf-keynote",
  embedUrl: "https://www.youtube.com/embed/live_abc456",
  isLiveBroadcast: true,
  publication: BroadcastEventSchema.parse({
    isLiveBroadcast: true,
    startDate: "2025-05-22T09:00:00-07:00",
    endDate: "2025-05-22T11:00:00-07:00",
  }),
  interactionStatistic: {
    "@type": "InteractionCounter",
    interactionType: "https://schema.org/WatchAction",
    userInteractionCount: 12500,
  },
});

console.log("\n=== Livestream Video ===");
console.log(livestream.toJsonLd());

// ─── Video embedded in Article (@graph) ───────────────────────────────────────
// Google can index the video AND the article as separate rich results.

const article = createArticle({
  headline: "TypeScript 5.0 Is Here: Everything You Need to Know",
  author: createPerson({ name: "Sam Chen", url: "https://techtalks.example.com/authors/sam" }).toObject(),
  publisher: publisher.toObject(),
  datePublished: "2025-03-15",
  dateModified: "2025-03-20",
  image: "https://techtalks.example.com/img/ts5-hero.jpg",
  description: "Our full guide to every TypeScript 5.0 feature with code examples and the companion video.",
  inLanguage: "en-US",
  video: video.toObject(),
  keywords: ["TypeScript", "programming", "JavaScript", "tutorial"],
});

const graph = createGraph([publisher, article, video]);

console.log("\n=== Article + Video @graph ===");
console.log(graph.toScript());
