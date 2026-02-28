---
title: Claim Review
parent: Guides
nav_order: 16
---

# Claim Review (Fact Check) Rich Results
{: .no_toc }

ClaimReview structured data enables Google's [Fact Check](https://developers.google.com/search/docs/appearance/structured-data/factcheck) rich result — a special label in search showing the claim, the verdict, and who reviewed it.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## When to Use

- Fact-checking articles that evaluate a specific claim
- News outlets with dedicated fact-check sections
- Independent fact-checking organizations (IFCN-certified or similar)

{: .warning }
> Google only shows Fact Check rich results for pages that follow [Google's Fact Check guidelines](https://developers.google.com/search/docs/appearance/structured-data/factcheck). The page must be a legitimate fact-check article, not an opinion piece.

---

## Quick Start

```ts
import { createClaimReview } from 'schemaorg-kit';

const factCheck = createClaimReview({
  url: 'https://factcheck.example.com/2025/sea-level-claim',
  claimReviewed: 'Sea levels have risen by 3 feet in the last decade.',
  reviewRating: {
    '@type': 'Rating',
    alternateName: 'Mostly False',
    ratingValue: 2,
    bestRating: 5,
    worstRating: 1,
  },
  author: { '@type': 'Organization', name: 'FactCheck.org' },
  datePublished: '2025-06-15',
});

document.head.innerHTML += factCheck.toScript();
```

---

## Google Required Fields

| Field | Description |
|-------|-------------|
| `url` | URL of the fact-check article |
| `claimReviewed` | The exact text of the claim being evaluated |
| `reviewRating.alternateName` | Human-readable verdict (e.g. "False", "Mostly True", "Misleading") |

---

## Adding Claim Details

Use `itemReviewed` to provide structured information about the claim itself — who made it, when, and where it first appeared:

```ts
import { createClaimReview, ClaimSchema } from 'schemaorg-kit';

const factCheck = createClaimReview({
  url: 'https://factcheck.example.com/2025/vaccine-claim',
  claimReviewed: 'Vaccines cause autism in children.',
  reviewRating: {
    '@type': 'Rating',
    alternateName: 'False',
    ratingValue: 1,
    bestRating: 5,
    worstRating: 1,
    name: '5-point truthfulness scale',
  },
  author: {
    '@type': 'Organization',
    name: 'Health Facts Initiative',
    url: 'https://healthfacts.example.com',
  },
  datePublished: '2025-03-20',
  dateModified: '2025-04-01',
  inLanguage: 'en',
  itemReviewed: ClaimSchema.parse({
    author: { '@type': 'Person', name: 'Social Media User' },
    datePublished: '2025-03-15',
    firstAppearance: 'https://socialmedia.example.com/post/12345',
    appearance: [
      'https://blog.example.com/repost-of-claim',
      'https://forum.example.com/thread/67890',
    ],
  }),
});
```

---

## Rating Scale

The `reviewRating` can use any textual label in `alternateName`. Common scales:

| alternateName | Meaning |
|---------------|---------|
| `"True"` | Claim is accurate |
| `"Mostly True"` | Claim is largely accurate with minor caveats |
| `"Half True"` | Claim is partially accurate |
| `"Mostly False"` | Claim is largely inaccurate |
| `"False"` | Claim is inaccurate |
| `"Pants on Fire"` | Claim is ridiculously inaccurate |

You can optionally provide numeric `ratingValue`, `bestRating`, and `worstRating` for a numeric scale alongside the text label.

---

## Best Practices

- **One ClaimReview per claim per page.** If your article checks multiple claims, use separate ClaimReview entries in a `@graph`.
- **Match the visible content.** The `claimReviewed` text must appear on the page.
- **Use a recognized organization as `author`.** Google may prioritize IFCN-certified organizations.
- **Keep `alternateName` consistent** across your site. Use the same rating scale for all reviews.

---

## Multiple Fact Checks on One Page

```ts
import { createGraph, createClaimReview } from 'schemaorg-kit';

const graph = createGraph([
  createClaimReview({
    url: 'https://factcheck.example.com/2025/debate-claims',
    claimReviewed: 'Unemployment is at an all-time low.',
    reviewRating: { '@type': 'Rating', alternateName: 'Half True' },
    author: { '@type': 'Organization', name: 'FactCheck.org' },
    datePublished: '2025-07-01',
  }),
  createClaimReview({
    url: 'https://factcheck.example.com/2025/debate-claims',
    claimReviewed: 'Crime rates have doubled in the last year.',
    reviewRating: { '@type': 'Rating', alternateName: 'False' },
    author: { '@type': 'Organization', name: 'FactCheck.org' },
    datePublished: '2025-07-01',
  }),
]);
```

---

## Common Mistakes

{: .warning }
> **Don't use ClaimReview for opinion pieces or editorials.** It's strictly for structured fact-checking with a clear verdict.

{: .tip }
> The `alternateName` on the rating is what Google displays as the verdict label. Make sure it's concise and meaningful.
