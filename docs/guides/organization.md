---
title: Organization
parent: Guides
nav_order: 8
---

# Organization & Knowledge Panel
{: .no_toc }

`Organization` structured data provides the signals Google uses to populate your brand's Knowledge Panel — the info card that appears to the right of branded search results.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## When to Use

Add `Organization` schema to your:
- Homepage
- About page
- Contact page

Only the homepage usually qualifies for a Knowledge Panel, but all pages benefit from organization identity signals.

---

## Organization Subtypes

| Factory | `@type` | Use for |
|---------|---------|---------|
| `createOrganization` | `"Organization"` | Generic organizations |
| `createCorporation` | `"Corporation"` | For-profit companies |
| `createNGO` | `"NGO"` | Nonprofits, charities |
| `createOnlineStore` | `"OnlineStore"` | Pure e-commerce retailers |
| `createOnlineBusiness` | `"OnlineBusiness"` | Online-only businesses |
| — (pass `@type` manually) | `"EducationalOrganization"` | Schools, universities |
| — (pass `@type` manually) | `"GovernmentOrganization"` | Government bodies |
| — (pass `@type` manually) | `"MedicalOrganization"` | Hospitals, clinics |
| — (pass `@type` manually) | `"SportsTeam"` | Sports clubs |

Use `createCorporation(...)`, `createNGO(...)`, `createOnlineStore(...)`, or pass `"@type"` directly to `createOrganization({ "@type": "EducationalOrganization", ... })`.

---

## Key Fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string` | Legal organization name |
| `url` | `string` | Official website |
| `logo` | `ImageObject` | Square logo, min 112×112px |
| `sameAs` | `string[]` | Social profiles + Wikipedia |
| `contactPoint` | `ContactPoint[]` | Customer service channels |
| `address` | `PostalAddress` | Registered address |
| `foundingDate` | `string` | Year founded |
| `numberOfEmployees` | `QuantitativeValue` | Headcount range |
| `legalName` | `string` | Full registered legal name |
| `vatID` | `string` | EU VAT number |

---

## Homepage Knowledge Panel

```ts
import { createGraph, createOrganization, createWebSite } from 'schemaorg-kit';

const org = createOrganization({
  name: 'Acme Technologies',
  legalName: 'Acme Technologies, Inc.',
  url: 'https://acme.tech',
  logo: {
    '@type': 'ImageObject',
    url: 'https://acme.tech/logo-512.png',
    width: 512,
    height: 512,
  },
  description: 'Acme Technologies builds developer tools for the modern web.',
  foundingDate: '2018',
  numberOfEmployees: {
    '@type': 'QuantitativeValue',
    minValue: 50,
    maxValue: 200,
  },
  address: {
    streetAddress: '500 Market Street, Suite 800',
    addressLocality: 'San Francisco',
    addressRegion: 'CA',
    postalCode: '94105',
    addressCountry: 'US',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      telephone: '+1-800-555-0100',
      email: 'support@acme.tech',
      availableLanguage: ['English'],
      hoursAvailable: 'Mo-Fr 09:00-18:00',
      contactOption: 'TollFree',
    },
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'sales@acme.tech',
    },
  ],
  sameAs: [
    'https://twitter.com/acmetech',
    'https://linkedin.com/company/acme-technologies',
    'https://github.com/acme-technologies',
    'https://www.wikidata.org/wiki/Q12345',
    'https://en.wikipedia.org/wiki/Acme_Technologies',
  ],
});

// Add WebSite for sitelinks search box (if eligible)
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

const graph = createGraph([org, website]);
```

---

## Online Store / Online Business

For e-commerce brands that operate exclusively online, use the more specific subtypes:

```ts
import { createOnlineStore, createOnlineBusiness } from 'schemaorg-kit';

// Pure e-commerce retailer (e.g. Amazon, Shopify store)
const store = createOnlineStore({
  name: 'Acme Shop',
  url: 'https://shop.acme.com',
  logo: 'https://shop.acme.com/logo.png',
  sameAs: [
    'https://twitter.com/acmeshop',
    'https://www.instagram.com/acmeshop',
  ],
});

// Online-only service/business
const biz = createOnlineBusiness({
  name: 'Acme SaaS',
  url: 'https://acme.io',
  description: 'Cloud-based project management for engineering teams.',
});
```

Using `OnlineStore` or `OnlineBusiness` instead of the generic `Organization` type gives search engines a more precise signal about your entity's nature, which can improve Knowledge Panel accuracy.

---

## NGO / Nonprofit

```ts
import { createNGO } from 'schemaorg-kit';

const nonprofit = createNGO({
  name: 'Ocean Conservancy Alliance',
  url: 'https://oceanconservancy.org',
  description: 'Protecting marine ecosystems through science, policy, and community action.',
  foundingDate: '2003',
  logo: {
    '@type': 'ImageObject',
    url: 'https://oceanconservancy.org/logo.png',
    width: 400,
    height: 400,
  },
  sameAs: [
    'https://twitter.com/oceanconservancy',
    'https://www.guidestar.org/profile/12-3456789',
    'https://en.wikipedia.org/wiki/Ocean_Conservancy_Alliance',
  ],
});
```

---

## Employer Branding (for Job Postings)

When you post jobs, Google shows your organization info in the job listing. Include a complete Organization on your careers page:

```ts
import { createOrganization } from 'schemaorg-kit';

const employer = createOrganization({
  name: 'Acme Technologies',
  url: 'https://acme.tech',
  logo: 'https://acme.tech/logo.png',
  sameAs: ['https://linkedin.com/company/acme-technologies'],
  aggregateRating: {   // Glassdoor-style employer rating
    '@type': 'EmployerAggregateRating',
    ratingValue: 4.3,
    ratingCount: 580,
    bestRating: 5,
    worstRating: 1,
    itemReviewed: { '@type': 'Organization', name: 'Acme Technologies' },
  },
});
```

---

## Common Mistakes

{: .warning }
> **`sameAs` is the single most impactful field** for Knowledge Panel eligibility. Link to your Wikipedia article, Wikidata entity, and major social profiles.

{: .tip }
> Your logo should be square (or close to it) and at least 112×112 pixels. Google uses it in the Knowledge Panel and in news articles.

{: .tip }
> `legalName` should match your official registered business name — this helps Google match your entity across data sources.
