/**
 * article.ts — Article, NewsArticle, BlogPosting, and @graph for editorial pages
 *
 * Demonstrates: author nesting, speakable, paywalled content, @graph composition.
 */

import {
  createPerson,
  createOrganization,
  createArticle,
  createNewsArticle,
  createBlogPosting,
  createBreadcrumbList,
  createWebPage,
  createGraph,
  createPaywalledArticle,
} from "../src/index";

const publisher = createOrganization({
  name: "The Daily Tribune",
  url: "https://dailytribune.com",
  logo: "https://dailytribune.com/logo.png",
});

const author = createPerson({
  name: "Jane Doe",
  url: "https://dailytribune.com/authors/jane-doe",
  jobTitle: "Senior Reporter",
  email: "jane@dailytribune.com",
});

// ─── Standard Article ─────────────────────────────────────────────────────────

const article = createArticle({
  headline: "Scientists Discover New Species in the Amazon",
  author: author.toObject(),
  publisher: publisher.toObject(),
  datePublished: "2025-06-01T08:00:00Z",
  dateModified: "2025-06-01T10:30:00Z",
  image: [
    "https://dailytribune.com/img/amazon-1200x900.jpg",
    "https://dailytribune.com/img/amazon-1200x675.jpg",
    "https://dailytribune.com/img/amazon-900x900.jpg",
  ],
  description: "Researchers have identified 12 previously unknown species deep in the Amazon rainforest.",
  inLanguage: "en-US",
  keywords: ["amazon", "biodiversity", "science", "wildlife"],
  // Speakable for Google Assistant
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: [".article-headline", ".article-summary"],
  },
});

console.log("=== Article ===");
console.log(article.toScript());

// ─── NewsArticle ──────────────────────────────────────────────────────────────

const newsArticle = createNewsArticle({
  headline: "Election Results: Full Coverage",
  author: { "@type": "Person", name: "Political Desk" },
  publisher: publisher.toObject(),
  datePublished: "2025-11-04T23:00:00Z",
  dateModified: "2025-11-05T06:00:00Z",
  image: "https://dailytribune.com/img/election-night.jpg",
  dateline: "Washington, DC",
  printSection: "A",
  printPage: "1",
  description: "Live updates from election night as results come in from across the country.",
  inLanguage: "en-US",
});

console.log("\n=== NewsArticle ===");
console.log(newsArticle.toJsonLd());

// ─── BlogPosting ──────────────────────────────────────────────────────────────

const blogPost = createBlogPosting({
  headline: "My Week in the Amazon: A Reporter's Journal",
  author: author.toObject(),
  publisher: publisher.toObject(),
  datePublished: "2025-06-07",
  image: "https://dailytribune.com/img/jane-amazon.jpg",
  description: "A personal account of the expedition to discover new species.",
  keywords: ["travel", "amazon", "journalism"],
  inLanguage: "en-US",
});

console.log("\n=== BlogPosting ===");
console.log(blogPost.toJsonLd());

// ─── Paywalled Article ────────────────────────────────────────────────────────
// Tells Google this is subscription content — NOT cloaking.

const paywalled = createPaywalledArticle(
  {
    headline: "Exclusive: The Full Expedition Report",
    author: author.toObject(),
    publisher: publisher.toObject(),
    datePublished: "2025-06-15",
    image: "https://dailytribune.com/img/report.jpg",
    description: "Subscriber-only deep-dive into the discovery.",
    inLanguage: "en-US",
  },
  { cssSelector: ".article-body" }
);

console.log("\n=== Paywalled Article ===");
console.log(paywalled.toJsonLd());

// ─── @graph for a full article page ──────────────────────────────────────────

const breadcrumb = createBreadcrumbList([
  { name: "Home", url: "https://dailytribune.com" },
  { name: "Science", url: "https://dailytribune.com/science" },
  { name: "Scientists Discover New Species" },
]);

const webPage = createWebPage({
  name: "Scientists Discover New Species — Daily Tribune",
  url: "https://dailytribune.com/science/amazon-new-species",
  breadcrumb: breadcrumb.toObject(),
  inLanguage: "en-US",
});

const graph = createGraph([publisher, webPage, breadcrumb, article]);

console.log("\n=== Full page @graph ===");
console.log(graph.toScript());
