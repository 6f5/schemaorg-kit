---
title: Paywalled Content
parent: Advanced Topics
nav_order: 3
---

# Paywalled & Subscription Content
{: .no_toc }

If your site has a paywall or subscription system, you must properly mark up gated content to avoid Google's cloaking policies. `schemaorg-kit` provides helpers that make this easy.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Google's Policy

Google's [subscription and paywalled content guidelines](https://developers.google.com/search/docs/appearance/structured-data/paywalled-content) require:

1. **Structured data must match the visible content.** If you show Google content that users can't see without paying, it's cloaking.
2. **Use `isAccessibleForFree: false` + `hasPart`** to tell Google which part of the page is behind the paywall.
3. **Don't block Googlebot with `robots.txt` or `noindex`.** Let Google crawl and index the page.

---

## For Articles

```ts
import { createPaywalledArticle } from 'schemaorg-kit';

const article = createPaywalledArticle(
  {
    headline: 'The Hidden Cost of Low Interest Rates',
    author: { '@type': 'Person', name: 'Finance Desk' },
    datePublished: '2025-05-15',
    image: 'https://financepost.example/interest-rates.jpg',
    publisher: {
      '@type': 'Organization',
      name: 'Finance Post',
      logo: { '@type': 'ImageObject', url: 'https://financepost.example/logo.png' },
    },
  },
  { cssSelector: '.article-body' }  // CSS selector for the gated content
);
```

**Output:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "The Hidden Cost of Low Interest Rates",
  "isAccessibleForFree": false,
  "hasPart": [
    {
      "@type": "WebPageElement",
      "isAccessibleForFree": false,
      "cssSelector": ".article-body"
    }
  ],
  ...
}
```

---

## For Web Pages

```ts
import { createPaywalledWebPage } from 'schemaorg-kit';

const page = createPaywalledWebPage(
  {
    name: 'Member Dashboard',
    url: 'https://app.example.com/dashboard',
    description: 'Your personalized account dashboard.',
  },
  { cssSelector: '#dashboard-content' }
);
```

---

## Multiple Gated Sections

If multiple sections are behind the paywall, use `createArticle` directly and customize `hasPart`:

```ts
import { createArticle } from 'schemaorg-kit';

const article = createArticle({
  headline: 'Premium Market Analysis',
  author: { '@type': 'Person', name: 'Analyst' },
  datePublished: '2025-06-01',
  image: 'https://example.com/analysis.jpg',
  isAccessibleForFree: false,
  hasPart: [
    {
      '@type': 'WebPageElement',
      isAccessibleForFree: false,
      cssSelector: '.data-tables',
    },
    {
      '@type': 'WebPageElement',
      isAccessibleForFree: false,
      cssSelector: '.chart-section',
    },
    {
      '@type': 'WebPageElement',
      isAccessibleForFree: false,
      cssSelector: '.conclusions',
    },
  ],
});
```

---

## Free Preview Pattern

If some content is free (lead paragraph, abstract) but the rest is gated:

```ts
import { createArticle } from 'schemaorg-kit';

const article = createArticle({
  headline: 'Exclusive: Inside the Fed's Next Move',
  author: { '@type': 'Person', name: 'Reporter' },
  datePublished: '2025-07-01',
  image: 'https://example.com/fed.jpg',
  // The article IS accessible for free (the preview part)
  // Only the specific element is behind the paywall
  isAccessibleForFree: false,
  hasPart: [
    {
      '@type': 'WebPageElement',
      isAccessibleForFree: false,
      cssSelector: '.premium-content',  // Only this section is gated
    },
  ],
});
```

---

## HTML Implementation

Your page must visually separate free vs. gated content with CSS classes that match your `cssSelector`:

```html
<article>
  <h1>The Hidden Cost of Low Interest Rates</h1>

  <!-- Free preview — visible to all -->
  <p class="article-intro">
    Interest rates have stayed near historic lows for over a decade...
  </p>

  <!-- Gated content — matches cssSelector: ".article-body" -->
  <div class="article-body">
    <p>The full analysis reveals that...</p>
    <!-- Paywall overlay should appear here for non-subscribers -->
  </div>
</article>
```

---

## Common Mistakes

{: .warning }
> **Don't use `isAccessibleForFree: false` without `hasPart`.** Without `hasPart`, Google doesn't know which element is gated and may treat it as cloaking.

{: .warning }
> **Don't use `noindex` on paywalled pages.** This defeats the purpose — the page needs to be indexed for Google to apply the subscription content treatment.

{: .tip }
> Test with [Google's Rich Results Test](https://search.google.com/test/rich-results) after implementing. The tool shows whether your paywalled markup is recognized correctly.
