---
title: Helpers
parent: API Reference
nav_order: 6
---

# Ergonomic Helpers
{: .no_toc }

High-level utility functions that generate common JSON-LD patterns with minimal boilerplate.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## createBreadcrumbList

```ts
import { createBreadcrumbList } from 'schemaorg-kit';
```

Generates a `BreadcrumbList` with automatically-assigned positions. This is the canonical way to add breadcrumb structured data — Google uses it for the breadcrumb trail in search results.

### Signature

```ts
function createBreadcrumbList(
  items: Array<{ name: string; url?: string }>
): SchemaNode
```

### Behavior

- Positions are auto-assigned starting at `1`
- If `url` is omitted on the **last** item, `item` is excluded (indicating the current page)
- Every `ListItem` gets `"@type": "ListItem"` automatically

### Example

```ts
const breadcrumbs = createBreadcrumbList([
  { name: 'Home',     url: 'https://example.com' },
  { name: 'Recipes',  url: 'https://example.com/recipes' },
  { name: 'Tiramisu' },   // current page — no url needed
]);

document.head.innerHTML += breadcrumbs.toScript();
```

**Output:**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home",     "item": "https://example.com" },
    { "@type": "ListItem", "position": 2, "name": "Recipes",  "item": "https://example.com/recipes" },
    { "@type": "ListItem", "position": 3, "name": "Tiramisu" }
  ]
}
```

{: .tip }
> Google requires breadcrumb lists to have at least 2 items. The first item should be your homepage.

---

## createFAQPage

```ts
import { createFAQPage } from 'schemaorg-kit';
```

Generates a `FAQPage` with `Question`/`Answer` pairs. The ergonomic version takes a flat array of `{ question, answer }` pairs — no need to manually construct nested objects.

### Signature

```ts
function createFAQPage(
  items: Array<{ question: string; answer: string }>
): SchemaNode
```

### Behavior

- Each pair becomes a `Question` entity with an embedded `Answer`
- `answer` may include **limited HTML** (`<p>`, `<ul>`, `<ol>`, `<li>`, `<b>`, `<strong>`, `<i>`, `<em>`, `<br>`, `<h2>`–`<h6>`, `<a>`)
- Answers must be ≤ 300 words for Google to display the full text in search results

### Example

```ts
const faq = createFAQPage([
  {
    question: 'What is your return policy?',
    answer: 'We accept returns within 30 days of purchase for a full refund.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship to over 50 countries. <a href="/shipping">See shipping details</a>.',
  },
  {
    question: 'How long does shipping take?',
    answer: '<ul><li>Standard: 5–7 business days</li><li>Express: 2–3 business days</li></ul>',
  },
]);
```

**Output:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is your return policy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We accept returns within 30 days of purchase for a full refund."
      }
    },
    ...
  ]
}
```

{: .note }
> For a full `FAQPage` with additional metadata fields, use `createFAQPage` from `QAPage.ts` directly and build `Question`/`Answer` objects manually.

---

## createCarousel

```ts
import { createCarousel } from 'schemaorg-kit';
```

Generates an `ItemList` where each item wraps an existing schema node. Used for **carousel rich results** — a horizontally-scrollable list of cards that Google displays for recipes, movies, courses, restaurants, etc.

### Signature

```ts
function createCarousel(
  items: SchemaNode[]
): SchemaNode
```

### Behavior

- Each item becomes a `ListItem` with `position` and `item` fields
- Positions are auto-assigned starting at `1`
- The nested `item` field contains the full schema object
- Google requires **at least 3 items** for a carousel, but the helper works with any count

### Example

```ts
import { createCarousel, createRecipe, createProduct, createCourse } from 'schemaorg-kit';

// Recipe carousel
const recipeCarousel = createCarousel([
  createRecipe({ name: 'Pasta Carbonara', image: 'https://example.com/carbonara.jpg', ... }),
  createRecipe({ name: 'Chicken Tikka',   image: 'https://example.com/tikka.jpg', ... }),
  createRecipe({ name: 'Beef Wellington', image: 'https://example.com/wellington.jpg', ... }),
]);

// Product carousel
const productCarousel = createCarousel([
  createProduct({ name: 'Trail Runner Pro', offers: { '@type': 'Offer', price: 129.99, priceCurrency: 'USD' } }),
  createProduct({ name: 'Summit Boots',     offers: { '@type': 'Offer', price: 199.99, priceCurrency: 'USD' } }),
]);
```

**Output:**
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": { "@type": "Recipe", "name": "Pasta Carbonara", ... }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": { "@type": "Recipe", "name": "Chicken Tikka", ... }
    }
  ]
}
```

{: .note }
> Types eligible for carousel: `Recipe`, `Course`, `Restaurant`, `Movie`. For other content types, you can still create an `ItemList`, but Google may not display it as a visual carousel.

---

## createPaywalledArticle

```ts
import { createPaywalledArticle } from 'schemaorg-kit';
```

Creates an `Article` schema node pre-configured with paywalled content markup. Signals to Google that part of the content is behind a subscription, preventing penalties from the [subscription and paywalled content policy](https://developers.google.com/search/docs/appearance/structured-data/paywalled-content).

### Signature

```ts
function createPaywalledArticle(
  articleData: ArticleInput,
  paywallOptions: { cssSelector: string }
): SchemaNode
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `articleData` | `ArticleInput` | Same fields as `createArticle` |
| `paywallOptions.cssSelector` | `string` | CSS selector identifying the paywalled section |

### Behavior

- Sets `isAccessibleForFree: false` on the article
- Adds a `hasPart` array with one entry: a `WebPageElement` with `isAccessibleForFree: false` and `cssSelector` pointing to the paywalled content

### Example

```ts
const article = createPaywalledArticle(
  {
    headline: 'The Future of Quantum Computing',
    author: { '@type': 'Person', name: 'Dr. Jane Smith' },
    datePublished: '2025-03-01',
    image: 'https://example.com/quantum.jpg',
    description: 'An in-depth look at quantum supremacy...',
  },
  { cssSelector: '.article-body' }
);
```

**Output:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "The Future of Quantum Computing",
  "isAccessibleForFree": false,
  "hasPart": [
    {
      "@type": "WebPageElement",
      "isAccessibleForFree": false,
      "cssSelector": ".article-body"
    }
  ],
  ...
}
```

---

## createPaywalledWebPage

```ts
import { createPaywalledWebPage } from 'schemaorg-kit';
```

Same as `createPaywalledArticle` but produces a `WebPage` instead of an `Article`. Use this for non-editorial paywalled content (account dashboards, member-only tools, etc.).

### Signature

```ts
function createPaywalledWebPage(
  pageData: WebPageInput,
  paywallOptions: { cssSelector: string }
): SchemaNode
```

### Example

```ts
const page = createPaywalledWebPage(
  { name: 'Member Dashboard', url: 'https://example.com/dashboard' },
  { cssSelector: '#member-content' }
);
```

---

## createGraph

```ts
import { createGraph } from 'schemaorg-kit';
```

Creates a `SchemaGraph` — a container for multiple schema nodes that outputs a single JSON-LD `@graph` block. See [SchemaGraph](core#schemagraph--creategraph) in the core API reference.

### Example

```ts
import { createGraph, createOrganization, createWebSite, createBreadcrumbList } from 'schemaorg-kit';

const graph = createGraph([
  createOrganization({ name: 'Acme Corp', url: 'https://acme.com' }),
  createWebSite({ name: 'Acme Corp', url: 'https://acme.com' }),
  createBreadcrumbList([
    { name: 'Home', url: 'https://acme.com' },
    { name: 'Products', url: 'https://acme.com/products' },
  ]),
]);

document.head.innerHTML += graph.toScript();
```
