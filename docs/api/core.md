---
title: Core
parent: API Reference
nav_order: 1
---

# Core API
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## SchemaNode

Every factory function returns a `SchemaNode<T>`. It wraps your validated data and provides output methods.

```ts
class SchemaNode<T extends ZodRawShape> {
  toObject(): z.infer<ZodObject<T>>
  toJsonLd(): Record<string, unknown>
  toScript(): string
  toString(): string
  validate(): this
  safeParse(): SafeParseReturnType
}
```

### `.toObject()`

Returns the validated data as a plain object **without** `@context`. Use this when nesting one schema inside another.

```ts
const person = createPerson({ name: 'Alice' });
person.toObject();
// { "@type": "Person", "name": "Alice" }
```

### `.toJsonLd()`

Returns the data as a plain object **with** `"@context": "https://schema.org"` added. Ready to pass to `JSON.stringify()`.

```ts
person.toJsonLd();
// { "@context": "https://schema.org", "@type": "Person", "name": "Alice" }
```

### `.toScript()`

Returns a complete `<script type="application/ld+json">` HTML string. Inject directly into `<head>`.

```ts
person.toScript();
// <script type="application/ld+json">
// { "@context": "https://schema.org", "@type": "Person", ... }
// </script>
```

### `.toString()`

Returns prettified JSON string with `@context` included. Equivalent to `JSON.stringify(this.toJsonLd(), null, 2)`.

### `.validate()`

Re-runs Zod parsing and throws a `ZodError` if invalid. Returns `this` if valid, so it's chainable:

```ts
const product = createProduct({ name: 'Widget', ... }).validate();
```

Use this in CI/build pipelines to catch schema issues before deployment.

### `.safeParse()`

Validates without throwing. Returns `{ success: true, data }` or `{ success: false, error: ZodError }`.

```ts
const result = product.safeParse();
if (!result.success) {
  result.error.issues.forEach(i => console.error(i.message));
}
```

---

## makeFactory

```ts
function makeFactory<T extends ZodRawShape>(
  schema: ZodObject<T>
): (data: Omit<z.input<ZodObject<T>>, '@context'>) => SchemaNode<T>
```

Internal factory builder used by all type modules. You can use it to create custom schema types:

```ts
import { z } from 'zod';
import { makeFactory, ThingSchema } from 'schemaorg-kit';

const CustomSchema = ThingSchema.extend({
  '@type': z.literal('CustomType').default('CustomType'),
  myField: z.string(),
});

export const createCustom = makeFactory(CustomSchema);

const node = createCustom({ myField: 'hello' });
node.toScript(); // "@type": "CustomType"
```

**Key behavior:** `@type` fields with `.default()` are **optional** in the input — the default is applied automatically. You can still override `@type` when the schema uses a union (e.g., `createLocalBusiness({ '@type': 'HairSalon', ... })`).

---

## SchemaGraph / createGraph

`SchemaGraph` holds multiple schema nodes and serializes them as a JSON-LD `@graph`.

```ts
function createGraph(
  nodes: Array<SchemaNode<any> | Record<string, unknown>>
): SchemaGraph
```

```ts
class SchemaGraph {
  add(node: SchemaNode<any> | Record<string, unknown>): this
  toArray(): Record<string, unknown>[]
  toJsonLd(): { '@context': 'https://schema.org'; '@graph': unknown[] }
  toScript(): string
  toString(): string
}
```

### `createGraph(nodes)`

Creates a `SchemaGraph` from an array of nodes. Accepts both `SchemaNode` instances and plain objects.

```ts
import { createGraph, createOrganization, createWebPage } from 'schemaorg-kit';

const graph = createGraph([
  createOrganization({ name: 'Acme', url: 'https://acme.com' }),
  createWebPage({ name: 'Home', url: 'https://acme.com' }),
]);

graph.toScript();
// <script type="application/ld+json">
// { "@context": "https://schema.org", "@graph": [...] }
// </script>
```

### `.add(node)`

Fluent API to append a node after construction:

```ts
const graph = createGraph([org]);
graph.add(page).add(breadcrumb);
```

### `.toArray()`

Returns the array of plain objects (without `@context`):

```ts
graph.toArray();
// [{ "@type": "Organization", ... }, { "@type": "WebPage", ... }]
```

### `.toJsonLd()`

Returns `{ "@context": "https://schema.org", "@graph": [...] }`.

### Cross-referencing with `@id`

Use `@id` fields to cross-reference nodes within the same graph:

```ts
const org = createOrganization({
  '@id': 'https://acme.com/#organization',
  name: 'Acme',
});

const page = createWebPage({
  name: 'Home',
  url: 'https://acme.com',
  publisher: { '@id': 'https://acme.com/#organization' }, // reference by ID
});

createGraph([org, page]).toScript();
```

---

## schema() — Unified Factory

```ts
function schema<T extends SchemaType>(
  type: T,
  data: Omit<z.infer<(typeof REGISTRY)[T]>, '@type'>
): SchemaNode<...>
```

Creates any supported schema type by name string. Useful for dynamic/CMS-driven code:

```ts
import { schema } from 'schemaorg-kit';

// Type is determined at runtime
const contentType = getContentTypeFromCMS(); // 'Article' | 'Product' | 'Recipe'
const data = getDataFromCMS();

const node = schema(contentType, data);
document.head.innerHTML += node.toScript();
```

**Supported type names:**

`Person`, `Organization`, `Product`, `ProductGroup`, `Event`, `Place`, `LocalBusiness`, `Movie`, `Article`, `NewsArticle`, `BlogPosting`, `WebPage`, `WebSite`, `Dataset`, `Recipe`, `Course`, `SoftwareApplication`, `MathSolver`, `Language`, `PronounceableText`, `JobPosting`, `FAQPage`, `QAPage`, `Quiz`, `Question`, `DiscussionForumPosting`, `ItemList`, `ProfilePage`, `VacationRental`, `ImageObject`, `Offer`, `Review`, `VideoObject`

---

## extendThing

```ts
function extendThing<TType extends string, T extends ZodRawShape>(
  type: TType,
  shape: T
): ZodObject<...>
```

Helper used internally to build all Thing subtypes. Takes a string type literal and a Zod shape, and returns a Zod object that extends `ThingSchema` with `@type` defaulted to the given string.

```ts
import { extendThing } from 'schemaorg-kit';
import { z } from 'zod';

const MyTypeSchema = extendThing('MyType', {
  specialField: z.string(),
});
// MyTypeSchema includes all ThingSchema fields + '@type': 'MyType' default + specialField
```
