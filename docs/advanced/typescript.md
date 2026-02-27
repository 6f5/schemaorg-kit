---
title: TypeScript Integration
parent: Advanced Topics
nav_order: 1
---

# TypeScript Integration
{: .no_toc }

`schemaorg-kit` is built from the ground up in TypeScript with full type inference. This page covers patterns for getting the most out of the type system.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Exported Types

Every schema has a corresponding TypeScript type with the same name (without `Schema`):

```ts
import type {
  // Things
  Person, Organization, Product, ProductGroup, Event, Place, LocalBusiness, Movie,

  // Creative Works
  Article, WebPage, WebSite, Dataset, Recipe, Course, SoftwareApplication, VideoObject,

  // Intangibles
  JobPosting, VacationRental, ProfilePage,

  // Shared Building Blocks
  PostalAddress, GeoCoordinates, ImageObject, ContactPoint,
  MonetaryAmount, PriceSpecification, Rating, AggregateRating,
  Review, Offer, MerchantReturnPolicy, OpeningHoursSpecification,
  HowToStep, HowToSection,
} from 'schemaorg-kit';
```

---

## Type Inference from Schemas

You can derive types directly from the Zod schemas using `z.infer`:

```ts
import { z } from 'zod';
import { ArticleSchema } from 'schemaorg-kit';

// Infer the output type (what .parse() returns)
type ArticleOutput = z.infer<typeof ArticleSchema>;

// Infer the input type (what .parse() accepts — .default() fields are optional)
type ArticleInput = z.input<typeof ArticleSchema>;
```

The exported `Article` type is equivalent to `z.infer<typeof ArticleSchema>`.

---

## SchemaNode<T>

`SchemaNode<T>` is the generic class returned by all factory functions:

```ts
import { createArticle, SchemaNode } from 'schemaorg-kit';

const article = createArticle({ headline: 'Hello', image: '...', datePublished: '2025-01-01', author: { ... } });
//    ^--- SchemaNode<typeof ArticleSchema['shape']>

// Type-safe methods:
const obj: Record<string, unknown> = article.toObject();
const json: { "@context": string; "@type": string } = article.toJsonLd();
const html: string = article.toScript();
```

---

## Type-Safe Factory Inputs

Factory functions accept the Zod **input** type — this means:
- Fields with `.default()` (like `@type`) are optional
- Required fields without defaults must be provided

```ts
import type { z } from 'zod';
import { ArticleSchema, createArticle } from 'schemaorg-kit';

// Type of what createArticle() accepts:
type CreateArticleInput = Omit<z.input<typeof ArticleSchema>, '@context'>;

// This means @type is optional (has a default), but
// properties without defaults are typed accordingly.
```

---

## Narrowing @type for Subtypes

For types with union `@type` values (like `LocalBusiness`), TypeScript infers the union:

```ts
import { createLocalBusiness } from 'schemaorg-kit';

const salon = createLocalBusiness({
  '@type': 'HairSalon',  // narrows @type
  name: 'Studio Cuts',
});

// salon.toObject()["@type"] is "LocalBusiness" | "Restaurant" | "Hotel" | ...
// (the full union — not narrowed after roundtripping through Zod)
```

For precise narrowing, assert the type after creation:

```ts
const obj = salon.toObject();
if (obj['@type'] === 'HairSalon') {
  // TypeScript now knows it's HairSalon
}
```

---

## Using Types in Your Own Functions

```ts
import type { Article, Person, Organization } from 'schemaorg-kit';

function formatAuthorByline(author: Person | Organization): string {
  if (author['@type'] === 'Person') {
    return `By ${author.name ?? 'Unknown'}`;
  }
  return author.name ?? 'Unknown Organization';
}

function buildArticleMeta(article: Article) {
  return {
    title: article.headline,
    description: article.description,
    publishedAt: article.datePublished,
    author: article.author ? formatAuthorByline(article.author as any) : undefined,
  };
}
```

---

## PersonOrOrgRefType

Fields like `author`, `publisher`, `creator` accept `PersonOrOrgRefType` — a union of:
- A URL string (reference by ID)
- A `Person` object
- An `Organization` object

```ts
import type { PersonOrOrgRefType } from 'schemaorg-kit';

function getAuthorName(author: PersonOrOrgRefType): string {
  if (typeof author === 'string') {
    return author;  // URL — just return it
  }
  return author.name ?? 'Unknown';
}
```

---

## Extending Schemas

Use `extendThing` to create a custom schema that inherits all `Thing` fields:

```ts
import { z } from 'zod';
import { extendThing, makeFactory } from 'schemaorg-kit';

// Create a custom schema
const CustomProductSchema = extendThing({
  '@type': z.literal('Product').default('Product'),
  name: z.string(),
  sku: z.string(),
  internalCategory: z.string().optional(),  // Your custom field
  warehouseLocation: z.string().optional(), // Not in schema.org — that's fine
});

export type CustomProduct = z.infer<typeof CustomProductSchema>;
export const createCustomProduct = makeFactory(CustomProductSchema);

// Usage:
const product = createCustomProduct({
  name: 'Widget',
  sku: 'WGT-001',
  internalCategory: 'hardware',
  warehouseLocation: 'A-12-B',
});
// Output: { "@type": "Product", name: "Widget", sku: "WGT-001", internalCategory: "hardware", ... }
```

Note: Custom fields that aren't in schema.org will be included in the output JSON-LD. Google ignores unknown properties, so this is safe.

---

## Strict Mode and Optional Fields

All optional fields use `z.xxx().optional()` — they produce `undefined` when absent, and are omitted from the JSON output (not serialized as `null`).

```ts
const article = createArticle({
  headline: 'Test',
  image: 'https://example.com/img.jpg',
  datePublished: '2025-01-01',
  author: { '@type': 'Person', name: 'Alice' },
});

const obj = article.toObject();
console.log('description' in obj);  // false — undefined fields are stripped
```

---

## TypeScript strict mode

The library is compiled with `strict: true`. All types are non-nullable by default. You should configure your `tsconfig.json` similarly for the best type-checking experience:

```json
{
  "compilerOptions": {
    "strict": true,
    "exactOptionalPropertyTypes": true
  }
}
```
