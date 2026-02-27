---
title: Website & Sitelinks
parent: Guides
nav_order: 14
---

# WebSite & Sitelinks Search Box
{: .no_toc }

`WebSite` structured data provides Google with canonical information about your site and — if you implement a site search — can add a search box directly in your branded search result.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## When to Use

Add `WebSite` schema to your **homepage only**. It signals:
1. Your site's canonical name and URL (helps Knowledge Panel)
2. Optional: a **Sitelinks Search Box** — a search field Google shows directly in your organic listing for branded searches

{: .note }
> The Sitelinks Search Box is **not guaranteed**. Google decides whether to show it based on site authority, query volume, and other signals. The `potentialAction` simply tells Google where to send the search if it chooses to show the box.

---

## Basic WebSite

```ts
import { createWebSite } from 'schemaorg-kit';

const website = createWebSite({
  name: 'Acme Technologies',
  url: 'https://acme.tech',
  description: 'Developer tools for the modern web.',
  publisher: {
    '@type': 'Organization',
    name: 'Acme Technologies, Inc.',
  },
  inLanguage: 'en-US',
});
```

---

## With Sitelinks Search Box

{: .warning }
> **Deprecated — November 2024.** Google [retired the Sitelinks Searchbox](https://developers.google.com/search/blog/2024/11/retiring-sitelinks-searchbox) in November 2024. The `potentialAction` field is still valid JSON-LD and harmless to include, but Google no longer renders a search box in branded search results. You can safely remove this field from new implementations.

```ts
import { createWebSite } from 'schemaorg-kit';

const website = createWebSite({
  name: 'Acme Technologies',
  url: 'https://acme.tech',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://acme.tech/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
});
```

The `{search_term_string}` placeholder in the URL template is replaced with the user's search query.

**Your search endpoint must:**
- Return actual search results
- Be publicly accessible (no login required)
- Work with GET parameters
- Return a web page (not JSON)

---

## Full Homepage @graph

The most effective setup combines `Organization`, `WebSite`, and optionally `BreadcrumbList` in a single `@graph`:

```ts
import { createGraph, createOrganization, createWebSite, createBreadcrumbList } from 'schemaorg-kit';

// On your homepage:
const homepageGraph = createGraph([
  createOrganization({
    name: 'Acme Technologies',
    url: 'https://acme.tech',
    logo: {
      '@type': 'ImageObject',
      url: 'https://acme.tech/logo-512.png',
      width: 512,
      height: 512,
    },
    sameAs: [
      'https://twitter.com/acmetech',
      'https://linkedin.com/company/acme-technologies',
      'https://github.com/acme-technologies',
    ],
  }),
  createWebSite({
    name: 'Acme Technologies',
    url: 'https://acme.tech',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://acme.tech/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }),
]);

// On every other page, add breadcrumbs:
const pageGraph = createGraph([
  createWebSite({ name: 'Acme Technologies', url: 'https://acme.tech' }),
  createBreadcrumbList([
    { name: 'Home',     url: 'https://acme.tech' },
    { name: 'Products', url: 'https://acme.tech/products' },
    { name: 'Trail Runner Pro' },
  ]),
]);
```

---

## Multilingual Sites

For sites in multiple languages:

```ts
const website = createWebSite({
  name: 'Global Store',
  url: 'https://globalstore.example',
  inLanguage: ['en', 'fr', 'de', 'es', 'ja'],
  publisher: {
    '@type': 'Organization',
    name: 'Global Store Inc.',
  },
});
```

---

## Common Mistakes

{: .warning }
> **Only add `WebSite` schema to the homepage** (or one page per site). Adding it to every page will not help and may confuse Google.

{: .tip }
> The `name` in `WebSite` should match your `<title>` tag on the homepage and your `Organization.name`. Consistency across all three strengthens your Knowledge Panel eligibility.
