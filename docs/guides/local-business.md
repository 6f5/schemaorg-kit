---
title: Local Business
parent: Guides
nav_order: 3
---

# Local Business Rich Results
{: .no_toc }

`LocalBusiness` structured data powers the Knowledge Panel, Google Maps cards, and local search pack results with business hours, ratings, and contact info.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## When to Use

Add `LocalBusiness` (or a subtype) to:
- Restaurant, café, bar pages
- Retail store pages
- Service business pages (doctors, lawyers, plumbers, etc.)
- Hotel / lodging pages

---

## Built-in Subtypes

`createLocalBusiness` accepts a `"@type"` override for any schema.org `LocalBusiness` subtype:

| Input | Use for |
|-------|---------|
| `"LocalBusiness"` (default) | Generic businesses |
| `"Restaurant"` | Restaurants, cafés, food trucks |
| `"Hotel"` | Hotels, motels, B&Bs |
| `"MedicalBusiness"` | Clinics, dental offices |
| `"LegalService"` | Law firms |
| `"FinancialService"` | Banks, insurance |
| `"HomeAndConstructionBusiness"` | Contractors, plumbers |
| `"SportsActivityLocation"` | Gyms, sports clubs |
| `"HairSalon"`, `"NailSalon"`, `"DaySpa"` | Beauty & wellness |

Or use `createRestaurant()` as a shorthand.

---

## Required Fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string` | Business name |

## Recommended Fields

| Field | Type | Notes |
|-------|------|-------|
| `address` | `PostalAddress` | Physical address |
| `telephone` | `string` | E.164 format recommended |
| `url` | `string` | Business website |
| `image` | `string \| string[]` | Business photos |
| `openingHoursSpecification` | `OpeningHoursSpecification[]` | Regular hours |
| `aggregateRating` | `AggregateRating` | Star rating |
| `geo` | `GeoCoordinates` | For map placement |
| `priceRange` | `string` | e.g. `"$"`, `"$$"`, `"$$$"` |
| `servesCuisine` | `string \| string[]` | For restaurants |

---

## Full Restaurant Example

```ts
import { createRestaurant, createGraph } from 'schemaorg-kit';

const restaurant = createRestaurant({
  name: 'The Golden Fork',
  description: 'Modern Italian cuisine in the heart of downtown.',
  url: 'https://goldenfork.com',
  telephone: '+1-415-555-0192',
  image: [
    'https://goldenfork.com/photos/interior.jpg',
    'https://goldenfork.com/photos/pasta.jpg',
  ],
  address: {
    streetAddress: '450 Market Street',
    addressLocality: 'San Francisco',
    addressRegion: 'CA',
    postalCode: '94105',
    addressCountry: 'US',
  },
  geo: {
    latitude: 37.7955,
    longitude: -122.3976,
  },
  priceRange: '$$',
  servesCuisine: ['Italian', 'Mediterranean'],
  hasMenu: 'https://goldenfork.com/menu',
  acceptsReservations: 'https://resy.com/cities/sf/golden-fork',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.6,
    reviewCount: 1240,
    bestRating: 5,
    worstRating: 1,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '11:30:00',
      closes: '22:00:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Friday', 'Saturday'],
      opens: '11:30:00',
      closes: '23:00:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Sunday',
      opens: '12:00:00',
      closes: '21:00:00',
    },
  ],
  sameAs: [
    'https://www.yelp.com/biz/golden-fork-sf',
    'https://maps.app.goo.gl/abc123',
    'https://www.instagram.com/goldenfork_sf',
  ],
});
```

---

## Generic Local Business

```ts
import { createLocalBusiness } from 'schemaorg-kit';

const salon = createLocalBusiness({
  '@type': 'HairSalon',
  name: 'Studio Cuts',
  telephone: '+1-212-555-0147',
  url: 'https://studiocuts.com',
  address: {
    streetAddress: '88 Fifth Avenue',
    addressLocality: 'New York',
    addressRegion: 'NY',
    postalCode: '10011',
    addressCountry: 'US',
  },
  priceRange: '$$',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '10:00:00',
      closes: '19:00:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday', 'Sunday'],
      opens: '09:00:00',
      closes: '17:00:00',
    },
  ],
});
```

---

## Special Holiday Hours

```ts
import { OpeningHoursSpecificationSchema } from 'schemaorg-kit';

// Add to specialOpeningHoursSpecification
const christmasClosed = OpeningHoursSpecificationSchema.parse({
  dayOfWeek: 'Thursday',
  opens: '00:00:00',
  closes: '00:00:00',   // midnight–midnight = closed all day
  validFrom: '2025-12-25',
  validThrough: '2025-12-25',
});
```

---

## Contact Points

For businesses with multiple contact channels:

```ts
import { createLocalBusiness } from 'schemaorg-kit';

const business = createLocalBusiness({
  name: 'Acme Insurance',
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      telephone: '+1-800-555-0100',
      availableLanguage: ['English', 'Spanish'],
      hoursAvailable: 'Mo-Fr 08:00-20:00',
      contactOption: 'TollFree',
    },
    {
      '@type': 'ContactPoint',
      contactType: 'claims',
      telephone: '+1-800-555-0199',
      contactOption: 'TollFree',
    },
  ],
});
```

---

## Combining with @graph

Pair your `LocalBusiness` with `WebSite` and `BreadcrumbList` in a single `@graph` block:

```ts
import { createGraph, createRestaurant, createWebSite, createBreadcrumbList } from 'schemaorg-kit';

const graph = createGraph([
  createRestaurant({ name: 'The Golden Fork', ... }),
  createWebSite({ name: 'The Golden Fork', url: 'https://goldenfork.com' }),
  createBreadcrumbList([
    { name: 'Home', url: 'https://goldenfork.com' },
    { name: 'Menu', url: 'https://goldenfork.com/menu' },
  ]),
]);
```

---

## Common Mistakes

{: .warning }
> **Don't omit `addressCountry`.** Google requires it for local search placement.

{: .tip }
> Use `sameAs` to link to your Google Business Profile, Yelp, TripAdvisor, etc. This helps Google verify your business identity across the web.

{: .tip }
> `geo` coordinates are crucial for "near me" search results. Include both `latitude` and `longitude`.
