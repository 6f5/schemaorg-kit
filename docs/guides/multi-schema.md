---
title: Multi-Schema Pages
parent: Guides
nav_order: 15
---

# Multi-Schema Pages with @graph
{: .no_toc }

Most real-world pages need more than one schema type. The `@graph` pattern lets you combine them into a single JSON-LD block with cross-references, avoiding duplicate `@context` declarations.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Why @graph?

Without `@graph`, you'd need multiple `<script>` tags:
```html
<!-- Don't do this — multiple separate blocks -->
<script type="application/ld+json">{ "@context": "...", "@type": "Article", ... }</script>
<script type="application/ld+json">{ "@context": "...", "@type": "BreadcrumbList", ... }</script>
<script type="application/ld+json">{ "@context": "...", "@type": "Organization", ... }</script>
```

With `@graph`, one block covers everything:
```html
<!-- Do this instead -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Article", ... },
    { "@type": "BreadcrumbList", ... },
    { "@type": "Organization", ... }
  ]
}
</script>
```

This also enables **cross-referencing** between entities via `@id`.

---

## Common Page Patterns

### Blog / Article Page

```ts
import { createGraph, createArticle, createOrganization, createBreadcrumbList } from 'schemaorg-kit';

const graph = createGraph([
  createArticle({
    headline: 'Mastering TypeScript Generics',
    author: { '@type': 'Person', name: 'Alex Chen', url: 'https://techblog.example/authors/alex' },
    datePublished: '2025-03-20',
    image: 'https://techblog.example/articles/generics-1200x630.jpg',
    publisher: { '@type': 'Organization', name: 'Tech Blog', logo: { '@type': 'ImageObject', url: 'https://techblog.example/logo.png' } },
    mainEntityOfPage: 'https://techblog.example/articles/typescript-generics',
  }),
  createBreadcrumbList([
    { name: 'Home',          url: 'https://techblog.example' },
    { name: 'TypeScript',    url: 'https://techblog.example/typescript' },
    { name: 'Mastering TypeScript Generics' },
  ]),
]);
```

### E-Commerce Product Page

```ts
import { createGraph, createProduct, createBreadcrumbList, createOrganization } from 'schemaorg-kit';

const graph = createGraph([
  createProduct({
    name: 'Trail Runner Pro',
    image: ['https://store.example/products/tr-pro-1.jpg'],
    offers: {
      '@type': 'Offer',
      price: 129.99,
      priceCurrency: 'USD',
      availability: 'InStock',
      seller: { '@type': 'Organization', name: 'TrailGear Store' },
    },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: 4.8, ratingCount: 2340, bestRating: 5 },
  }),
  createBreadcrumbList([
    { name: 'Home',     url: 'https://store.example' },
    { name: 'Running',  url: 'https://store.example/running' },
    { name: 'Shoes',    url: 'https://store.example/running/shoes' },
    { name: 'Trail Runner Pro' },
  ]),
  createOrganization({
    name: 'TrailGear Store',
    url: 'https://store.example',
    logo: 'https://store.example/logo.png',
    sameAs: ['https://instagram.com/trailgear', 'https://facebook.com/trailgear'],
  }),
]);
```

### Local Business Page

```ts
import { createGraph, createRestaurant, createWebSite, createBreadcrumbList } from 'schemaorg-kit';

const graph = createGraph([
  createRestaurant({
    name: 'The Golden Fork',
    address: {
      streetAddress: '450 Market Street',
      addressLocality: 'San Francisco',
      addressRegion: 'CA',
      postalCode: '94105',
      addressCountry: 'US',
    },
    geo: { latitude: 37.7955, longitude: -122.3976 },
    telephone: '+1-415-555-0192',
    servesCuisine: 'Italian',
    aggregateRating: { '@type': 'AggregateRating', ratingValue: 4.6, reviewCount: 1240, bestRating: 5 },
  }),
  createWebSite({
    name: 'The Golden Fork',
    url: 'https://goldenfork.com',
  }),
  createBreadcrumbList([
    { name: 'Home',   url: 'https://goldenfork.com' },
    { name: 'Reservations', url: 'https://goldenfork.com/reservations' },
  ]),
]);
```

### Article + FAQ

```ts
import { createGraph, createArticle, createFAQPage, createBreadcrumbList } from 'schemaorg-kit';

const graph = createGraph([
  createArticle({
    headline: '10 Tips for Better Sleep',
    author: { '@type': 'Person', name: 'Dr. Sleep' },
    datePublished: '2025-02-01',
    image: 'https://healthblog.example/sleep-tips.jpg',
  }),
  createFAQPage([
    { question: 'How many hours of sleep do adults need?', answer: '7–9 hours per night is recommended for most adults.' },
    { question: 'What is sleep hygiene?', answer: 'Sleep hygiene refers to habits and practices that support consistent, quality sleep.' },
    { question: 'Can naps replace lost nighttime sleep?', answer: 'Short naps (20–30 min) can improve alertness, but they don\'t fully compensate for poor nighttime sleep.' },
  ]),
  createBreadcrumbList([
    { name: 'Home',   url: 'https://healthblog.example' },
    { name: 'Sleep',  url: 'https://healthblog.example/sleep' },
    { name: '10 Tips for Better Sleep' },
  ]),
]);
```

---

## Cross-Referencing with @id

Use `@id` to reference the same entity in multiple places without repeating all its fields. The `SchemaIds` helper generates consistent IDs and `{ "@id": "..." }` reference objects:

```ts
import { SchemaIds, createGraph, createArticle, createOrganization } from 'schemaorg-kit';

const ids = new SchemaIds('https://example.com');

// Define Organization once with @id
const org = createOrganization({
  '@id': ids.organization(),
  name: 'Example Corp',
  url: 'https://example.com',
  logo: 'https://example.com/logo.png',
});

// Reference it by @id in the Article — no "as any" needed
const article = createArticle({
  headline: 'Our Latest Innovation',
  datePublished: '2025-05-01',
  image: 'https://example.com/innovation.jpg',
  author: ids.ref('organization'),
  publisher: ids.ref('organization'),
});

const graph = createGraph([org, article]);
```

The `@graph` output will have the full organization definition once, and references to it by `@id` in the article.

### SchemaIds API

```ts
const ids = new SchemaIds('https://example.com');

// Well-known IDs
ids.organization()  // "https://example.com/#organization"
ids.website()       // "https://example.com/#website"
ids.webpage()       // "https://example.com/#webpage"
ids.article()       // "https://example.com/#article"
ids.person()        // "https://example.com/#person"
// ... and more for all entity types

// Custom fragments
ids.custom('logo')           // "https://example.com/#logo"
ids.custom('contactpoint')   // "https://example.com/#contactpoint"

// Page-scoped IDs
ids.forPath('/about', 'webpage')  // "https://example.com/about#webpage"

// Cross-reference objects for publisher, author, organizer, etc.
ids.ref('organization')  // { "@id": "https://example.com/#organization" }
```

See the [Core API docs]({{ site.baseurl }}/api/core/#schemaids) for the full list of methods.

---

## Output

```ts
const graph = createGraph([org, article]);

// Single <script> tag:
graph.toScript();

// JSON-LD object (for React, etc.):
graph.toJsonLd();
// → { "@context": "https://schema.org", "@graph": [...] }

// Plain array of schema objects:
graph.toArray();
// → [{ "@type": "Organization", ... }, { "@type": "Article", ... }]
```

---

## Fluent API

Build a graph incrementally:

```ts
import { createGraph, createOrganization, createWebSite } from 'schemaorg-kit';

const graph = createGraph([])
  .add(createOrganization({ name: 'Acme', url: 'https://acme.tech' }))
  .add(createWebSite({ name: 'Acme', url: 'https://acme.tech' }))
  .add({ '@type': 'WebPage', name: 'Home', url: 'https://acme.tech' });  // plain objects work too
```
