---
title: Home
layout: home
nav_order: 1
---

# schemaorg-kit

**Type-safe schema.org structured data — every Google rich result type, Zod-validated, @graph-ready.**

```bash
npm install schemaorg-kit zod
```

---

## What is it?

`schemaorg-kit` is a TypeScript library that makes it easy to generate correct, validated [schema.org](https://schema.org) JSON-LD — the structured data format Google uses to power rich results in search.

Instead of hand-crafting JSON-LD and guessing at field names, you get:

- **Full TypeScript types** — autocomplete for every field, compile-time errors for invalid data
- **Zod validation** — runtime schema enforcement before your JSON-LD ever reaches the page
- **Every Google rich result type** — Article, Product, Recipe, Event, LocalBusiness, JobPosting, FAQ, Video, Course, and 20+ more
- **`@graph` support** — combine multiple schemas into a single optimized `<script>` tag
- **Ergonomic helpers** — `createBreadcrumbList`, `createFAQPage`, `createCarousel`, and more

---

## Quick Example

```ts
import { createArticle, createPerson, createOrganization, createGraph } from 'schemaorg-kit';

const author = createPerson({
  name: 'Alice Chen',
  url: 'https://example.com/authors/alice',
});

const publisher = createOrganization({
  name: 'Tech Blog',
  logo: 'https://example.com/logo.png',
});

const article = createArticle({
  headline: 'How to Build Type-Safe JSON-LD with TypeScript',
  author: author.toObject(),
  publisher: publisher.toObject(),
  datePublished: '2025-03-15',
  image: [
    'https://example.com/img/hero-1200x900.jpg',
    'https://example.com/img/hero-1200x675.jpg',
  ],
});

// Outputs a <script type="application/ld+json"> tag
console.log(article.toScript());

// Or combine into an @graph for the full page
const graph = createGraph([publisher, article]);
console.log(graph.toScript());
```

**Output:**
```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "name": "Tech Blog", ... },
    { "@type": "Article", "headline": "How to Build...", ... }
  ]
}
</script>
```

---

## Supported Rich Result Types

| Category | Types |
|----------|-------|
| **Things** | Person, Organization, NGO, Corporation, Product, ProductGroup, Event, Place, LocalBusiness, Restaurant, Hotel, Movie |
| **Creative Works** | Article, NewsArticle, BlogPosting, WebPage, WebSite, Dataset, Recipe, Course, SoftwareApplication, MobileApplication, WebApplication, MathSolver, VideoObject |
| **Intangibles** | FAQPage, QAPage, Quiz, JobPosting, DiscussionForumPosting, ItemList, ProfilePage, Language |
| **Lodging** | VacationRental |
| **Helpers** | createBreadcrumbList, createFAQPage, createCarousel, createPaywalledArticle |

---

## Why Not Just Write JSON?

```ts
// ❌ Error-prone hand-written JSON-LD
const json = {
  "@context": "https://schema.org",
  "@type": "Recipe",          // typo? wrong type? no feedback
  name: "Pasta",
  // forgot 'image' — Google won't show this as a rich result
  recipeIngredient: "200g pasta",  // should be an array
};

// ✅ schemaorg-kit catches this at compile time
const recipe = createRecipe({
  name: "Pasta",
  image: "https://example.com/pasta.jpg",  // required — TypeScript enforces it
  recipeIngredient: ["200g pasta", "tomato sauce"],  // typed as string[]
});
```

---

## Installation

```bash
# npm
npm install schemaorg-kit zod

# yarn
yarn add schemaorg-kit zod

# pnpm
pnpm add schemaorg-kit zod
```

> `zod` is a peer dependency. You need `zod@^4.3.6`.

---

## Quicklinks

- [Getting Started](getting-started) — Installation, your first schema, output formats
- [API Reference](api/) — Complete reference for every export
- [Guides](guides/) — Use-case walkthroughs for each rich result type
- [Advanced: @graph](advanced/graph) — Combine multiple schemas on one page
- [Advanced: TypeScript](advanced/typescript) — Types, inference, and custom extensions
