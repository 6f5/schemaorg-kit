# schemaorg-kit

> Type-safe schema.org structured data builder with Zod validation, built for great DX.

## Features

- ✅ Full TypeScript autocomplete for all schema.org types
- ✅ Runtime validation via Zod with clear error messages  
- ✅ Inheritance mirrors schema.org hierarchy
- ✅ `toJsonLd()`, `toScript()`, `toString()` output helpers
- ✅ Ergonomic helpers for complex types like BreadcrumbList
- ✅ Two APIs: named factories **or** unified `schema()` factory

## Installation

```bash
npm install schemaorg-kit zod
```

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

// Output to <script> tag (ready for HTML injection)
console.log(product.toScript());

// Output plain JSON-LD object
console.log(product.toJsonLd());
```

## API

### Named factories (recommended)

```typescript
import { createPerson, createOrganization, createProduct, createArticle } from "schemaorg-kit";

const person = createPerson({ name: "Jane Doe", email: "jane@example.com" });
const org = createOrganization({ name: "Acme Corp", url: "https://acme.com" });
```

### Unified factory

```typescript
import { schema } from "schemaorg-kit";

const product = schema("Product", { name: "Shoes" });
```

### Output methods

Every node returned by a factory has these methods:

| Method | Returns | Description |
|--------|---------|-------------|
| `.toObject()` | `T` | Raw validated object (no @context) |
| `.toJsonLd()` | `Record<string, unknown>` | Object with `@context` added |
| `.toScript()` | `string` | Full `<script type="application/ld+json">` tag |
| `.toString()` | `string` | Pretty JSON string |
| `.validate()` | `this` | Throws on invalid data (chainable) |
| `.safeParse()` | Zod safe parse result | Returns errors without throwing |

### BreadcrumbList helper

```typescript
import { createBreadcrumbList } from "schemaorg-kit";

const breadcrumb = createBreadcrumbList([
  { name: "Home", url: "https://example.com" },
  { name: "Products", url: "https://example.com/products" },
  { name: "Running Shoes" }, // last item — url is optional
]);
```

### PronounceableText — Text vs Language object

```typescript
import { createPronounceableText, createLanguage } from "schemaorg-kit";

// Simple: BCP 47 string
const simple = createPronounceableText({
  textValue: "Bonjour tout le monde",
  inLanguage: "fr",
});

// Rich: full Language object
const rich = createPronounceableText({
  textValue: "Bonjour tout le monde",
  inLanguage: createLanguage({
    name: "French",
    alternateName: "fr",
  }).toObject(),
});
```

## Composing nested schemas

Call `.toObject()` when nesting one schema inside another:

```typescript
const author = createPerson({ name: "Jane Doe" });
const article = createArticle({
  headline: "My Article",
  author: author.toObject(), // <-- nest with .toObject()
});
```

## Project Structure

```
src/
├── core/
│   ├── base.ts          # SchemaNode class + makeFactory
│   └── registry.ts      # Unified schema() factory
├── types/
│   ├── things/          # Thing, Person, Organization, Product, Place, Event
│   ├── actions/         # Action, BuyAction, SearchAction
│   ├── intangibles/     # Offer, Rating, Language, PronounceableText
│   └── creative-works/  # CreativeWork, Article, WebPage, BreadcrumbList
├── helpers/
│   └── breadcrumb.ts    # Ergonomic BreadcrumbList builder
└── index.ts             # Public API
```

## Extending with custom types

```typescript
import { extendThing } from "schemaorg-kit/internal";
import { makeFactory } from "schemaorg-kit/internal";
import { z } from "zod";

const MyCustomSchema = extendThing("MyCustomType", {
  customField: z.string(),
});

const createMyCustom = makeFactory(MyCustomSchema);
```
