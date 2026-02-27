---
title: Validation & Errors
parent: Advanced Topics
nav_order: 4
---

# Validation & Error Handling
{: .no_toc }

`schemaorg-kit` uses [Zod v4](https://zod.dev) for runtime validation. Understanding how validation works helps you write more defensive code and surface errors clearly to your team.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## How Validation Works

Every factory function (`createArticle`, `createProduct`, etc.) internally calls `schema.parse(data)`. This **throws a `ZodError`** if the data doesn't match the schema.

```ts
import { createArticle } from 'schemaorg-kit';

// This will throw ZodError because datePublished is missing
createArticle({ headline: 'Hello' });
// ZodError: [{ path: ['datePublished'], message: 'Required' }]
```

---

## Safe Parsing (No Throw)

Use `safeParse()` on the Zod schema directly when you don't want exceptions:

```ts
import { ArticleSchema } from 'schemaorg-kit';

const result = ArticleSchema.safeParse({
  headline: 'Hello',
  // missing required fields
});

if (!result.success) {
  console.error('Validation failed:', result.error.issues);
  // Handle gracefully — don't crash
} else {
  const article = result.data;
}
```

---

## Validation on SchemaNode

`SchemaNode` exposes a `validate()` method:

```ts
import { createArticle } from 'schemaorg-kit';

const article = createArticle({
  headline: 'Test',
  image: 'https://example.com/img.jpg',
  datePublished: '2025-01-01',
  author: { '@type': 'Person', name: 'Alice' },
});

const result = article.validate();
// result: z.SafeParseReturnType — always succeeds for a properly created node
```

---

## Common Validation Errors

### Missing required field

```
ZodError: [
  { path: ['headline'], message: 'Required', code: 'invalid_type' }
]
```

**Fix:** Supply the required field.

### Invalid email

```
ZodError: [
  { path: ['email'], message: 'Invalid email', code: 'invalid_string' }
]
```

**Fix:** Use a valid email address (`user@example.com`).

### Invalid URL

```
ZodError: [
  { path: ['url'], message: 'Invalid url', code: 'invalid_string' }
]
```

**Fix:** Include the protocol (`https://example.com` not `example.com`).

### Wrong type

```
ZodError: [
  { path: ['price'], message: 'Expected number, received string', code: 'invalid_type' }
]
```

**Fix:** `price: 9.99` (number) not `price: '9.99'` (string).

### Union mismatch

```
ZodError: [
  { path: ['author'], message: 'Invalid input', code: 'invalid_union' }
]
```

**Fix:** The `author` field expects a `Person`, `Organization`, or URL string. Make sure `'@type'` is one of these.

---

## Pretty-Printing ZodError

```ts
import { z } from 'zod';
import { ArticleSchema } from 'schemaorg-kit';

try {
  ArticleSchema.parse({ headline: 'Test' });
} catch (err) {
  if (err instanceof z.ZodError) {
    console.error('Validation errors:');
    for (const issue of err.issues) {
      console.error(`  ${issue.path.join('.')}: ${issue.message}`);
    }
  }
}
```

---

## Validating at Runtime (User Input)

If you're accepting schema data from an API, CMS, or form, validate before using:

```ts
import { ArticleSchema } from 'schemaorg-kit';

async function handleCMSWebhook(payload: unknown) {
  const result = ArticleSchema.safeParse(payload);
  if (!result.success) {
    return {
      error: 'Invalid article data',
      issues: result.error.issues,
    };
  }

  // result.data is fully typed Article
  const article = result.data;
  return { ok: true, article };
}
```

---

## Partial Validation

For validating partial updates (e.g., PATCH requests), use `.partial()`:

```ts
import { ArticleSchema } from 'schemaorg-kit';

const PartialArticleSchema = ArticleSchema.partial();

const result = PartialArticleSchema.safeParse({
  dateModified: '2025-06-01',
  // Only updating one field — all others optional
});
```

---

## Zod Error Formatting

Zod v4 provides `z.prettifyError()` for human-readable error messages:

```ts
import { z } from 'zod';
import { ArticleSchema } from 'schemaorg-kit';

try {
  ArticleSchema.parse({});
} catch (err) {
  if (err instanceof z.ZodError) {
    console.error(z.prettifyError(err));
    // Prints a nicely formatted multi-line error message
  }
}
```

---

## Testing with Validation

In tests, assert that invalid data throws and valid data doesn't:

```ts
import { describe, it, expect } from 'vitest';
import { createProduct, OfferSchema } from 'schemaorg-kit';

describe('Product validation', () => {
  it('accepts valid product', () => {
    expect(() => createProduct({ name: 'Widget' })).not.toThrow();
  });

  it('rejects invalid offer price type', () => {
    expect(() =>
      OfferSchema.parse({ price: 'free', priceCurrency: 'USD' })
    ).toThrow();
  });

  it('transforms availability string to URL', () => {
    const offer = OfferSchema.parse({ availability: 'InStock' });
    expect(offer.availability).toBe('https://schema.org/InStock');
  });
});
```
