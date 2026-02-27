---
title: Article
parent: Guides
nav_order: 1
---

# Article Rich Results
{: .no_toc }

Article structured data helps Google display enhanced article cards with author name, publication date, and a larger thumbnail in Top Stories.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## When to Use

Use `Article` (or its subtypes) on:
- Blog posts
- News articles
- Editorial / opinion pieces
- How-to articles (without step-by-step instructions)

For step-by-step instructions, use `HowTo`. For question-and-answer pages, use `FAQPage`.

## Article vs NewsArticle vs BlogPosting

| Type | Best for |
|------|----------|
| `Article` | General editorial content |
| `NewsArticle` | Journalism, breaking news, news sites |
| `BlogPosting` | Personal blogs, informal posts |

All three share the same fields. `NewsArticle` signals that the content is news-oriented; Google may include it in "Top Stories".

---

## Required Fields

| Field | Type | Notes |
|-------|------|-------|
| `headline` | `string` | Max 110 characters |
| `image` | `string \| ImageObject \| string[]` | At least one image required |
| `datePublished` | `string` | ISO 8601 (`YYYY-MM-DD` or with time) |
| `author` | `Person \| Organization` | Author entity — not just a string |

## Recommended Fields

| Field | Type | Notes |
|-------|------|-------|
| `dateModified` | `string` | When the article was last updated |
| `description` | `string` | Short summary |
| `publisher` | `Organization` | Publishing organization with logo |
| `mainEntityOfPage` | `string` | Canonical URL of this article |
| `url` | `string` | Article URL |
| `wordCount` | `number` | Approximate word count |
| `keywords` | `string[]` | Topic tags |

---

## Full Example

```ts
import { createArticle, createGraph, createBreadcrumbList } from 'schemaorg-kit';

const article = createArticle({
  headline: 'How TypeScript Improves Developer Productivity',
  description: 'A deep dive into TypeScript features that reduce bugs and speed up development.',
  datePublished: '2025-03-15',
  dateModified: '2025-03-20',
  image: [
    'https://example.com/article/ts-productivity-1200x630.jpg',
    'https://example.com/article/ts-productivity-square.jpg',
  ],
  author: {
    '@type': 'Person',
    name: 'Alex Chen',
    url: 'https://example.com/authors/alex-chen',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Dev Insights',
    logo: {
      '@type': 'ImageObject',
      url: 'https://example.com/logo.png',
      width: 200,
      height: 60,
    },
  },
  mainEntityOfPage: 'https://example.com/blog/typescript-productivity',
  url: 'https://example.com/blog/typescript-productivity',
  keywords: ['TypeScript', 'JavaScript', 'Developer Experience'],
  wordCount: 1850,
});

// Add breadcrumbs for bonus SEO
const breadcrumbs = createBreadcrumbList([
  { name: 'Home',  url: 'https://example.com' },
  { name: 'Blog',  url: 'https://example.com/blog' },
  { name: 'How TypeScript Improves Developer Productivity' },
]);

const graph = createGraph([article, breadcrumbs]);
```

**In Next.js (App Router):**
```tsx
// app/blog/[slug]/page.tsx
export default function BlogPost() {
  const graph = createGraph([article, breadcrumbs]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph.toJsonLd()) }}
      />
      {/* ... page content ... */}
    </>
  );
}
```

---

## NewsArticle Example

```ts
import { createNewsArticle } from 'schemaorg-kit';

const news = createNewsArticle({
  headline: 'City Council Approves New Transit Plan',
  image: 'https://citygazette.com/images/transit-plan.jpg',
  datePublished: '2025-06-10T08:00:00-07:00',
  dateModified: '2025-06-10T14:30:00-07:00',
  author: { '@type': 'Person', name: 'Sarah Park' },
  publisher: {
    '@type': 'Organization',
    name: 'City Gazette',
    logo: { '@type': 'ImageObject', url: 'https://citygazette.com/logo.png' },
  },
  articleSection: 'Local Government',
  dateline: 'Springfield, IL',
});
```

---

## Paywalled Articles

If your article is behind a paywall, use `createPaywalledArticle` so Google doesn't penalize you:

```ts
import { createPaywalledArticle } from 'schemaorg-kit';

const article = createPaywalledArticle(
  {
    headline: 'Exclusive: Inside the Tech Giant Acquisition',
    author: { '@type': 'Person', name: 'Reporter Name' },
    image: 'https://example.com/article.jpg',
    datePublished: '2025-05-01',
  },
  { cssSelector: '.article-body' }
);
```

This adds `isAccessibleForFree: false` and `hasPart` with the CSS selector identifying the gated content. See the [Paywalled Content guide](../advanced/paywalled-content) for details.

---

## Common Mistakes

{: .warning }
> **Don't put the author's name as a plain string.** Google requires an author entity:
> ```ts
> // ✗ Wrong
> author: 'Alice'
> // ✓ Correct
> author: { '@type': 'Person', name: 'Alice' }
> ```

{: .warning }
> **Headline must match the `<h1>` on the page.** It doesn't need to be identical, but should be clearly related.

{: .warning }
> **Dates must be ISO 8601.** `'March 15 2025'` will fail. Use `'2025-03-15'` or `'2025-03-15T10:00:00Z'`.

---

## Validation

```bash
# Build and test
npm run build
npm test

# Check output manually
node -e "
const { createArticle } = require('./dist/index.js');
const a = createArticle({
  headline: 'Test',
  image: 'https://example.com/img.jpg',
  datePublished: '2025-01-01',
  author: { '@type': 'Person', name: 'Alice' },
});
console.log(JSON.stringify(a.toJsonLd(), null, 2));
"
```

Then paste the JSON into [Google's Rich Results Test](https://search.google.com/test/rich-results).
