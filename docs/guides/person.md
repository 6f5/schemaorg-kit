---
title: Person
parent: Guides
nav_order: 21
---

# Person Structured Data
{: .no_toc }

Person structured data helps Google understand who people are across the web — connecting authors to their articles, linking social profiles, and powering Knowledge Panel signals.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## When to Use

- Author attribution on articles and blog posts
- Team member pages on company sites
- Speaker profiles on event pages
- Creator credits on recipes, courses, videos

---

## Quick Start

```ts
import { createPerson } from 'schemaorg-kit';

const author = createPerson({
  name: 'Dr. Sarah Kim',
  url: 'https://example.com/authors/sarah',
  image: 'https://example.com/photos/sarah.jpg',
  jobTitle: 'Machine Learning Engineer',
  worksFor: { '@type': 'Organization', name: 'Acme AI' },
  sameAs: [
    'https://github.com/sarahkim',
    'https://www.linkedin.com/in/sarahkim',
    'https://twitter.com/sarahkim_ml',
    'https://en.wikipedia.org/wiki/Sarah_Kim_(engineer)',
  ],
});
```

---

## As Article Author

The most common use of Person is as an `author` on Article, BlogPosting, or NewsArticle:

```ts
import { createArticle, createPerson } from 'schemaorg-kit';

const article = createArticle({
  headline: 'Understanding Transformer Architecture',
  datePublished: '2025-05-20',
  image: 'https://example.com/img/transformers.jpg',
  author: createPerson({
    name: 'Dr. Sarah Kim',
    url: 'https://example.com/authors/sarah',
  }).toObject(),
});
```

Or inline as a plain object:

```ts
const article = createArticle({
  headline: 'Understanding Transformer Architecture',
  datePublished: '2025-05-20',
  image: 'https://example.com/img/transformers.jpg',
  author: { '@type': 'Person', name: 'Dr. Sarah Kim' },
});
```

---

## Cross-Referencing with @graph

Use `@id` to reference the same Person across multiple schemas on a page:

```ts
import { createGraph, createPerson, createArticle, createProfilePage } from 'schemaorg-kit';

const graph = createGraph([
  createPerson({
    '@id': 'https://example.com/#sarah',
    name: 'Dr. Sarah Kim',
    image: 'https://example.com/photos/sarah.jpg',
    sameAs: ['https://twitter.com/sarahkim_ml'],
  }),
  createArticle({
    headline: 'Understanding Transformer Architecture',
    datePublished: '2025-05-20',
    image: 'https://example.com/img/transformers.jpg',
    author: { '@id': 'https://example.com/#sarah' },
  }),
]);
```

---

## Interaction Statistics

Track a person's engagement metrics for ProfilePage or Discussion Forum contexts:

```ts
import { createPerson, InteractionCounterSchema } from 'schemaorg-kit';

const creator = createPerson({
  name: 'Alex Rivera',
  url: 'https://forum.example.com/u/alexr',
  interactionStatistic: [
    InteractionCounterSchema.parse({
      interactionType: 'https://schema.org/WriteAction',
      userInteractionCount: 342,
    }),
    InteractionCounterSchema.parse({
      interactionType: 'https://schema.org/LikeAction',
      userInteractionCount: 1580,
    }),
  ],
  agentInteractionStatistic: InteractionCounterSchema.parse({
    interactionType: 'https://schema.org/WriteAction',
    userInteractionCount: 342,
  }),
});
```

---

## Key Fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string` | Full name |
| `jobTitle` | `string?` | Job title or role |
| `url` | `string?` | Profile/bio page URL |
| `image` | `string \| ImageObject?` | Profile photo |
| `sameAs` | `string \| string[]?` | Social profiles — critical for Knowledge Panel |
| `worksFor` | `Organization?` | Current employer |
| `knowsAbout` | `string \| string[]?` | Topics of expertise |
| `honorificPrefix` | `string?` | Dr., Prof., Mr., etc. |
| `email` | `string?` | Contact email |

---

## Best Practices

- **Always include `sameAs`** — Google uses it to verify identity and connect profiles across platforms
- **Link to Wikipedia** when available — strongest signal for Knowledge Panel eligibility
- **Use consistent `name` values** across all your structured data — don't alternate between "Sarah Kim" and "S. Kim"
- **Include `image`** — Google may use it in author byline features

---

## Common Mistakes

{: .warning }
> **Don't create a Person node without connecting it to something.** A standalone Person has limited value. Use it as `author`, `director`, `performer`, `mainEntity`, etc.

{: .tip }
> For maximum Google coverage, pair Person with a `ProfilePage` on author bio pages, and reference the same `@id` in all articles by that author.
