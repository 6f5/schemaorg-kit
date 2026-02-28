# schemaorg-kit

[![npm](https://img.shields.io/npm/v/schemaorg-kit)](https://www.npmjs.com/package/schemaorg-kit)
[![CI](https://github.com/6f5/schemaorg-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/6f5/schemaorg-kit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Type-safe schema.org structured data for every Google rich result type — Zod validation, JSON-LD `@graph`, full TypeScript inference.

## Features

- **40+ factory functions** covering all Google-supported rich result types
- **Zod v4 validation** with descriptive error messages at runtime
- **Full TypeScript autocomplete** — every field, every enum value
- **`@graph` support** for multi-entity pages with cross-references
- **Two APIs** — named factories (`createProduct`) or unified `schema("Product", {...})`
- **Dual ESM + CJS build** — works in Next.js, Remix, Astro, Node.js, and beyond
- **Zero dependencies** at runtime — Zod is a peer dependency you already have

## Installation

```bash
npm install schemaorg-kit zod
```

Requires **Node.js ≥ 18** and **Zod ≥ 4.3**.

## Quick Start

```typescript
import { createProduct, createOffer, createBreadcrumbList } from "schemaorg-kit";

const product = createProduct({
  name: "Running Shoes",
  sku: "RS-001",
  offers: createOffer({
    price: 99.99,
    priceCurrency: "USD",
    availability: "InStock",
  }).toObject(),
});

// Inject directly into HTML
document.head.innerHTML += product.toScript();

// Or get the plain object
const jsonLd = product.toJsonLd(); // includes @context
```

## Output Methods

Every node returned by a factory exposes these methods:

| Method | Returns | Description |
|--------|---------|-------------|
| `.toObject()` | `T` | Raw validated object — use this when nesting inside another schema |
| `.toJsonLd()` | `Record<string, unknown>` | Object with `@context: "https://schema.org"` added |
| `.toScript()` | `string` | Full `<script type="application/ld+json">` tag, ready for HTML |
| `.toString()` | `string` | Pretty-printed JSON string |
| `.validate()` | `this` | Throws a `ZodError` if data is invalid (chainable) |
| `.safeParse()` | Zod result | Returns `{ success, data, error }` without throwing |

## Composing Schemas

Call `.toObject()` when embedding one schema inside another:

```typescript
import { createPerson, createOrganization, createArticle } from "schemaorg-kit";

const author = createPerson({ name: "Jane Doe", url: "https://janedoe.com" });

const article = createArticle({
  headline: "Hello World",
  author: author.toObject(),       // <-- nest with .toObject()
  publisher: createOrganization({
    name: "Acme Blog",
    url: "https://acmeblog.com",
    logo: "https://acmeblog.com/logo.png",
  }).toObject(),
});

console.log(article.toScript());
```

## `@graph` Support

Use `createGraph` to output multiple schema nodes in a single `<script>` tag with `@id` cross-references:

```typescript
import { createGraph, createWebPage, createArticle, createPerson } from "schemaorg-kit";

const graph = createGraph([
  createWebPage({ "@id": "https://example.com/post#webpage", url: "https://example.com/post" }),
  createArticle({
    "@id": "https://example.com/post#article",
    headline: "Hello World",
    isPartOf: { "@id": "https://example.com/post#webpage" },
    author: { "@id": "https://example.com/about#person" },
  }),
  createPerson({ "@id": "https://example.com/about#person", name: "Jane Doe" }),
]);

console.log(graph.toScript());
```

## Unified Factory

As an alternative to named imports, use the `schema()` factory with any registered type name:

```typescript
import { schema } from "schemaorg-kit";

const product = schema("Product", { name: "Shoes", sku: "SH-001" });
const event   = schema("Event",   { name: "Conference", startDate: "2025-09-01" });
```

## Supported Types

### Things

| Factory | Schema.org Type |
|---------|----------------|
| `createPerson` | `Person` |
| `createOrganization` | `Organization` |
| `createCorporation` | `Corporation` |
| `createNGO` | `NGO` |
| `createOnlineStore` | `OnlineStore` |
| `createOnlineBusiness` | `OnlineBusiness` |
| `createProduct` | `Product` |
| `createProductGroup` | `ProductGroup` |
| `createEvent` | `Event` |
| `createPlace` | `Place` |
| `createLocalBusiness` | `LocalBusiness` |
| `createRestaurant` | `Restaurant` |
| `createHotel` | `Hotel` |
| `createMovie` | `Movie` |

### Creative Works

| Factory | Schema.org Type |
|---------|----------------|
| `createBook` | `Book` (with ReadAction / BorrowAction) |
| `createArticle` | `Article` |
| `createNewsArticle` | `NewsArticle` |
| `createBlogPosting` | `BlogPosting` |
| `createWebPage` | `WebPage` |
| `createWebSite` | `WebSite` |
| `createDataset` | `Dataset` |
| `createRecipe` | `Recipe` |
| `createCourse` | `Course` |
| `createSoftwareApplication` | `SoftwareApplication` |
| `createMobileApplication` | `MobileApplication` |
| `createWebApplication` | `WebApplication` |
| `createMathSolver` | `MathSolver` |
| `createClaimReview` | `ClaimReview` (Fact Check) |

### Intangibles & Other

| Factory | Schema.org Type |
|---------|----------------|
| `createOffer` | `Offer` |
| `createImageObject` | `ImageObject` |
| `createVideoObject` | `VideoObject` |
| `createJobPosting` | `JobPosting` |
| `createQAPage` / `createQuiz` / `createQuestion` | `QAPage` / `Quiz` / `Question` |
| `createDiscussionForumPosting` | `DiscussionForumPosting` |
| `createProfilePage` | `ProfilePage` |
| `createVacationRental` | `VacationRental` |
| `createLanguage` | `Language` |

### Helpers

| Helper | What it does |
|--------|-------------|
| `createBreadcrumbList([...])` | Builds a `BreadcrumbList` from a plain array |
| `createFAQPage([...])` | Builds a `FAQPage` from `{question, answer}` pairs |
| `createCarousel([...])` | Wraps schema nodes in an `ItemList` carousel |
| `createPaywalledArticle(...)` | Article with `isAccessibleForFree: false` paywalled sections |

## Common Patterns

### Product with Price Range and Shipping

```typescript
import {
  createProduct,
  AggregateOfferSchema,
  OfferShippingDetailsSchema,
  DefinedRegionSchema,
} from "schemaorg-kit";

const product = createProduct({
  name: "Premium Headphones",
  offers: AggregateOfferSchema.parse({
    lowPrice: 79,
    highPrice: 129,
    priceCurrency: "USD",
    offerCount: 4,
    offers: {
      price: 79,
      priceCurrency: "USD",
      availability: "InStock",
      shippingDetails: OfferShippingDetailsSchema.parse({
        shippingRate: { value: 0, currency: "USD" },
        shippingDestination: DefinedRegionSchema.parse({ addressCountry: "US" }),
        deliveryTime: {
          handlingTime: { minValue: 0, maxValue: 1, unitCode: "DAY" },
          transitTime: { minValue: 3, maxValue: 5, unitCode: "DAY" },
        },
      }),
    },
  }),
});
```

### FAQ Page

```typescript
import { createFAQPage } from "schemaorg-kit";

const faq = createFAQPage([
  { question: "What is schemaorg-kit?", answer: "A type-safe schema.org builder." },
  { question: "Does it support @graph?",  answer: "Yes, via createGraph()." },
]);

document.head.innerHTML += faq.toScript();
```

### BreadcrumbList

```typescript
import { createBreadcrumbList } from "schemaorg-kit";

const breadcrumb = createBreadcrumbList([
  { name: "Home",     url: "https://example.com" },
  { name: "Products", url: "https://example.com/products" },
  { name: "Shoes" },   // last item — url is optional
]);
```

### Extending with Custom Types

```typescript
import { extendThing, makeFactory } from "schemaorg-kit";
import { z } from "zod";

const PodcastSchema = extendThing("PodcastSeries", {
  webFeed: z.string().url(),
  numberOfEpisodes: z.number().int().optional(),
});

const createPodcast = makeFactory(PodcastSchema);

const podcast = createPodcast({
  name: "My Show",
  webFeed: "https://example.com/feed.rss",
});
```

## Project Structure

```
src/
├── core/
│   ├── base.ts              # SchemaNode<T> class + makeFactory()
│   ├── registry.ts          # Unified schema() factory + REGISTRY
│   └── graph.ts             # SchemaGraph + createGraph()
├── types/
│   ├── shared/              # Reusable building blocks
│   │   ├── Offer.ts         # Offer, AggregateOffer, MerchantReturnPolicy, UnitPriceSpecification, ItemCondition
│   │   ├── ShippingDetails.ts # OfferShippingDetails, DefinedRegion, ShippingDeliveryTime
│   │   ├── Rating.ts        # Rating, AggregateRating, Review, EmployerAggregateRating
│   │   ├── VideoObject.ts   # VideoObject, Clip, BroadcastEvent, SeekToAction
│   │   ├── InteractionCounter.ts # InteractionCounter (likes, shares, views)
│   │   ├── MemberProgram.ts # MemberProgram, MemberProgramTier (loyalty)
│   │   ├── ShippingService.ts # ShippingService, ShippingConditions, ServicePeriod
│   │   └── ...
│   ├── things/              # Person, Organization, Product, Place, Event, ...
│   ├── creative-works/      # Article, WebPage, WebSite, Recipe, Book, ...
│   ├── intangibles/         # JobPosting, FAQPage, ItemList, ProfilePage, ...
│   └── lodging/             # VacationRental, Accommodation
├── helpers/                 # Ergonomic wrappers (breadcrumb, faq, carousel, paywalled)
└── index.ts                 # Public API
```

## Links

- **Docs**: https://6f5.github.io/schemaorg-kit/
- **npm**: https://www.npmjs.com/package/schemaorg-kit
- **Issues**: https://github.com/6f5/schemaorg-kit/issues

## License

MIT
