---
title: Profile Page
parent: Guides
nav_order: 20
---

# Profile Page Rich Results
{: .no_toc }

Profile Page structured data helps Google understand creator profile pages and can enhance how they appear in search results. It links a page to its subject (a Person or Organization) using the [ProfilePage](https://developers.google.com/search/docs/appearance/structured-data/profile-page) type.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## When to Use

- Author bio pages on blogs / news sites
- Social media profile pages
- Company team member pages
- Creator or contributor profiles
- Portfolio pages

---

## Quick Start

```ts
import { createProfilePage } from 'schemaorg-kit';

const profile = createProfilePage({
  '@id': 'https://example.com/authors/alice#profilepage',
  name: 'Alice Chen — Software Engineer',
  url: 'https://example.com/authors/alice',
  datePublished: '2023-06-01',
  dateModified: '2025-08-15',
  mainEntity: {
    '@type': 'Person',
    '@id': 'https://example.com/authors/alice#person',
    name: 'Alice Chen',
    image: 'https://example.com/photos/alice.jpg',
    jobTitle: 'Staff Software Engineer',
    sameAs: [
      'https://github.com/alicechen',
      'https://www.linkedin.com/in/alice-chen',
      'https://twitter.com/alicedev',
    ],
  },
});

document.head.innerHTML += profile.toScript();
```

---

## Google Recommended Fields

| Field | Description |
|-------|-------------|
| `mainEntity` | The Person or Organization the profile is about |
| `dateModified` | When the profile was last updated |

`mainEntity` should include `name`, `image`, and `sameAs` (social links) for best results.

---

## Organization Profile

```ts
const orgProfile = createProfilePage({
  name: 'Acme Corporation',
  url: 'https://example.com/companies/acme',
  datePublished: '2020-01-15',
  dateModified: '2025-10-01',
  mainEntity: {
    '@type': 'Organization',
    name: 'Acme Corporation',
    logo: 'https://acme.com/logo.png',
    url: 'https://acme.com',
    sameAs: [
      'https://en.wikipedia.org/wiki/Acme_Corporation',
      'https://www.linkedin.com/company/acme',
    ],
  },
});
```

---

## Profile + Article in @graph

Link a profile page to the author's articles using `@graph` with `@id` cross-references:

```ts
import { createGraph, createProfilePage, createArticle, createPerson } from 'schemaorg-kit';

const graph = createGraph([
  createProfilePage({
    '@id': 'https://example.com/authors/bob#profilepage',
    name: 'Bob Martinez — Tech Writer',
    url: 'https://example.com/authors/bob',
    mainEntity: {
      '@type': 'Person',
      '@id': 'https://example.com/authors/bob#person',
      name: 'Bob Martinez',
      image: 'https://example.com/photos/bob.jpg',
      sameAs: ['https://twitter.com/bobwrites'],
    },
  }),
]);
```

---

## Best Practices

- **Include `sameAs` links** — social profiles help Google verify identity
- **Use `@id`** on both the ProfilePage and its mainEntity for cross-referencing in `@graph`
- **Set `dateModified`** — Google uses it to determine freshness
- **Add an `image`** on the Person or Organization for visual results

---

## Common Mistakes

{: .warning }
> **Don't use ProfilePage for every page on your site.** It's specifically for pages whose primary purpose is to describe a person or organization.

{: .tip }
> If your site has author pages that link to their articles, ProfilePage is the right choice. For the articles themselves, use `Article` with the `author` field.
