---
title: Getting Started
nav_order: 2
---

# Getting Started
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Installation

`schemaorg-kit` requires **Node.js ≥ 18** and **Zod v4**.

```bash
npm install schemaorg-kit zod
```

Zod is a peer dependency — you manage the version in your project so it stays in sync with any other Zod usage you have.

---

## Your First Schema

Every type has a dedicated factory function. Call it with your data; get back a `SchemaNode` with output methods.

```ts
import { createProduct, createOffer } from 'schemaorg-kit';

const product = createProduct({
  name: 'Wireless Keyboard',
  description: 'Compact Bluetooth keyboard with 6-month battery life.',
  image: 'https://example.com/keyboard.jpg',
  offers: {
    '@type': 'Offer',
    price: 79.99,
    priceCurrency: 'USD',
    availability: 'InStock',  // → "https://schema.org/InStock"
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.6,
    reviewCount: 1240,
    bestRating: 5,
  },
});
```

---

## Output Formats

Every `SchemaNode` exposes four output methods:

### `toScript()` — for `<head>` injection *(most common)*

```ts
product.toScript();
// → <script type="application/ld+json">
//   { "@context": "https://schema.org", "@type": "Product", ... }
//   </script>
```

Paste the output directly into your HTML `<head>`. Works with React, Vue, Next.js, or any templating engine.

### `toJsonLd()` — plain object with `@context`

```ts
product.toJsonLd();
// → { "@context": "https://schema.org", "@type": "Product", ... }
```

Use this when you need to pass the data to a serializer or framework helper.

### `toObject()` — raw data without `@context`

```ts
product.toObject();
// → { "@type": "Product", "name": "Wireless Keyboard", ... }
```

Use `toObject()` when embedding one schema inside another:

```ts
import { createPerson, createArticle } from 'schemaorg-kit';

const author = createPerson({ name: 'Alice' });

const article = createArticle({
  headline: 'My Article',
  author: author.toObject(),  // ← nest the person inside the article
});
```

### `toString()` — pretty-printed JSON string

```ts
product.toString();
// → prettified JSON with "@context" included
```

---

## Validation

Schemas are validated with Zod at creation time. Invalid data throws a `ZodError` with a detailed message.

```ts
// ❌ Throws ZodError — email format is invalid
createPerson({ name: 'Alice', email: 'not-an-email' });

// ❌ Throws ZodError — Recipe requires 'image' (Google mandatory field)
createRecipe({ name: 'Pasta' });  // missing required 'image'

// ✅ Ok
createRecipe({ name: 'Pasta', image: 'https://example.com/pasta.jpg' });
```

### Safe validation

If you want to validate without throwing, use `safeParse()`:

```ts
const result = product.safeParse();

if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error.issues);
}
```

### Validate in CI/build

Call `validate()` in your build step to catch schema issues before shipping:

```ts
product.validate();  // throws if invalid, returns `this` if valid (chainable)
```

---

## The `@graph` — Multiple Schemas, One Script Tag

Google recommends combining related schemas into a single `@graph` rather than emitting multiple `<script>` tags:

```ts
import {
  createOrganization,
  createWebPage,
  createBreadcrumbList,
  createGraph,
} from 'schemaorg-kit';

const org = createOrganization({
  '@id': 'https://example.com/#organization',
  name: 'Example Corp',
  url: 'https://example.com',
  logo: 'https://example.com/logo.png',
});

const page = createWebPage({
  '@id': 'https://example.com/about#webpage',
  name: 'About Us — Example Corp',
  url: 'https://example.com/about',
  isPartOf: { '@id': 'https://example.com/#website' },
});

const breadcrumb = createBreadcrumbList([
  { name: 'Home', url: 'https://example.com' },
  { name: 'About' },
]);

const graph = createGraph([org, page, breadcrumb]);
console.log(graph.toScript());
```

Output:
```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": "https://example.com/#organization", ... },
    { "@type": "WebPage", "@id": "https://example.com/about#webpage", ... },
    { "@type": "BreadcrumbList", ... }
  ]
}
</script>
```

---

## The Unified `schema()` Factory

For dynamic use cases, `schema()` lets you create any supported type by name:

```ts
import { schema } from 'schemaorg-kit';

const product = schema('Product', { name: 'Widget' });
const event   = schema('Event', { name: 'Conference', startDate: '2025-09-01' });
const recipe  = schema('Recipe', { name: 'Pasta', image: 'https://...' });
```

This is useful when the type is determined at runtime (e.g., from a CMS content type field).

---

## Framework Integration

### Next.js (App Router)

```tsx
// app/products/[id]/page.tsx
import { createProduct } from 'schemaorg-kit';

export default function ProductPage({ product }) {
  const schema = createProduct({
    name: product.name,
    description: product.description,
    image: product.images,
    offers: { '@type': 'Offer', price: product.price, priceCurrency: 'USD' },
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema.toJsonLd()) }}
      />
      <h1>{product.name}</h1>
    </>
  );
}
```

### Next.js (Pages Router)

```tsx
// pages/products/[id].tsx
import Head from 'next/head';
import { createProduct } from 'schemaorg-kit';

export default function ProductPage({ product }) {
  const schema = createProduct({ name: product.name, ... });

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema.toJsonLd()) }}
      />
    </Head>
  );
}
```

### Astro

```astro
---
import { createArticle } from 'schemaorg-kit';

const schema = createArticle({
  headline: frontmatter.title,
  datePublished: frontmatter.date,
  author: { '@type': 'Person', name: frontmatter.author },
});
---

<head>
  <Fragment set:html={schema.toScript()} />
</head>
```

### SvelteKit

```svelte
<script>
  import { createEvent } from 'schemaorg-kit';
  const schema = createEvent({ name: data.event.name, startDate: data.event.date });
</script>

<svelte:head>
  {@html schema.toScript()}
</svelte:head>
```

### Remix

```tsx
// app/routes/article.$slug.tsx
import { createArticle } from 'schemaorg-kit';

export function meta({ data }) {
  const schema = createArticle({ headline: data.title, ... });
  return [
    { 'script:ld+json': schema.toJsonLd() },
  ];
}
```

---

## Testing Your Structured Data

After adding JSON-LD to your pages, validate the output with Google's tools:

1. **[Rich Results Test](https://search.google.com/test/rich-results)** — checks eligibility for rich results
2. **[Schema Markup Validator](https://validator.schema.org/)** — checks schema.org conformance
3. **[Google Search Console](https://search.google.com/search-console)** — monitors rich result impressions in production

---

## What's Next?

- Browse the [API Reference](api/) for all available types and their fields
- Jump into [Guides](guides/) for complete working examples for each rich result type
- Read [Advanced: @graph](advanced/graph) to learn how to structure a complete site knowledge graph
