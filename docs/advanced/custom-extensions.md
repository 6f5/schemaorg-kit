---
title: Custom Extensions
parent: Advanced Topics
nav_order: 5
---

# Custom Schema Extensions

{: .no_toc }

You can extend any built-in schema with additional fields using `extendThing` or by directly calling `.extend()` on any Zod schema.

## Table of contents

{: .no_toc .text-delta }

1. TOC
   {:toc}

---

## extendThing

`extendThing` creates a new schema that inherits all `ThingSchema` fields (id, name, url, description, image, sameAs, etc.):

```ts
import { z } from "zod";
import { extendThing, makeFactory } from "schemaorg-kit";

const PodcastEpisodeSchema = extendThing({
  "@type": z.literal("PodcastEpisode").default("PodcastEpisode"),
  episodeNumber: z.number().int().positive(),
  duration: z.string().optional(), // ISO 8601
  partOfSeries: z
    .object({
      "@type": z.literal("PodcastSeries"),
      name: z.string(),
      url: z.url().optional(),
    })
    .optional(),
  audio: z
    .object({
      "@type": z.literal("AudioObject"),
      contentUrl: z.url(),
      encodingFormat: z.string().optional(),
      duration: z.string().optional(),
    })
    .optional(),
});

export type PodcastEpisode = z.infer<typeof PodcastEpisodeSchema>;
export const createPodcastEpisode = makeFactory(PodcastEpisodeSchema);

// Usage:
const episode = createPodcastEpisode({
  name: "Episode 42: TypeScript Deep Dive",
  url: "https://podcast.example/ep/42",
  episodeNumber: 42,
  duration: "PT1H12M",
  partOfSeries: {
    "@type": "PodcastSeries",
    name: "Dev Conversations",
    url: "https://podcast.example",
  },
  audio: {
    "@type": "AudioObject",
    contentUrl: "https://cdn.podcast.example/ep42.mp3",
    encodingFormat: "audio/mpeg",
    duration: "PT1H12M",
  },
});
```

---

## Extending an Existing Schema

Extend a specific type using `.extend()` on the Zod schema:

```ts
import { z } from "zod";
import { ArticleSchema, makeFactory } from "schemaorg-kit";

// Extend Article with a custom field
const TechnicalArticleSchema = ArticleSchema.extend({
  // Override @type to be more specific
  "@type": z.literal("TechArticle").default("TechArticle"),
  // Add custom fields
  proficiencyLevel: z.enum(["Beginner", "Intermediate", "Expert"]).optional(),
  dependencies: z.array(z.string()).optional(),
  codeRepository: z.url().optional(),
});

export type TechnicalArticle = z.infer<typeof TechnicalArticleSchema>;
export const createTechnicalArticle = makeFactory(TechnicalArticleSchema);

const article = createTechnicalArticle({
  headline: "Advanced TypeScript Patterns",
  image: "https://example.com/ts-patterns.jpg",
  datePublished: "2025-01-01",
  author: { "@type": "Person", name: "Dev Expert" },
  proficiencyLevel: "Expert",
  codeRepository: "https://github.com/example/ts-patterns",
});
```

---

## Registering Custom Types

Register your custom schema in the registry to use it with `schema()`:

```ts
import { z } from "zod";
import { extendThing, makeFactory, schema } from "schemaorg-kit";
import { REGISTRY } from "schemaorg-kit/registry"; // internal export

const PodcastEpisodeSchema = extendThing({
  "@type": z.literal("PodcastEpisode").default("PodcastEpisode"),
  episodeNumber: z.number().int(),
});

// Add to registry (mutates — do this once at app startup)
(REGISTRY as any)["PodcastEpisode"] = PodcastEpisodeSchema;

// Now usable with schema():
const ep = schema("PodcastEpisode", { name: "Ep 1", episodeNumber: 1 });
```

{: .note }

> Modifying the registry is optional — using `makeFactory` directly is sufficient for most use cases.

---

## Adding to @graph

Custom schema nodes work seamlessly with `createGraph`:

```ts
import { createGraph, createOrganization } from "schemaorg-kit";
import { createPodcastEpisode } from "./your-schemas";

const graph = createGraph([
  createOrganization({
    name: "Dev Conversations",
    url: "https://podcast.example",
  }),
  createPodcastEpisode({
    name: "Episode 42",
    episodeNumber: 42,
    duration: "PT1H12M",
  }),
]);

console.log(graph.toScript());
```

---

## Schema Composition

Compose reusable sub-schemas:

```ts
import { z } from "zod";
import { makeFactory, extendThing } from "schemaorg-kit";

// Reusable sub-schema
const SocialLinksSchema = z.object({
  twitter: z.url().optional(),
  linkedin: z.url().optional(),
  github: z.url().optional(),
  website: z.url().optional(),
});

// Use it in a custom schema
const TeamMemberSchema = extendThing({
  "@type": z.literal("Person").default("Person"),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  socialLinks: SocialLinksSchema.optional(),
  headshot: z.url().optional(),
});

export const createTeamMember = makeFactory(TeamMemberSchema);

const member = createTeamMember({
  name: "Alice Chen",
  jobTitle: "Senior Engineer",
  department: "Platform",
  socialLinks: {
    twitter: "https://twitter.com/alicechen",
    github: "https://github.com/alicechen",
  },
  headshot: "https://company.example/team/alice.jpg",
});
```

Note: `socialLinks` is a non-standard field — it will appear in the JSON-LD output but Google ignores unknown properties.

---

## Adding Unsupported schema.org Properties

This library focuses on properties that Google actively uses for rich results. Some valid schema.org properties — like `areaServed`, `serviceArea`, or `knowsAbout` — are **not** used by Google and therefore not included in the built-in schemas.

If you need these properties, extend the existing schema with `.extend()`:

### Adding `areaServed` to Organization

```ts
import { z } from 'zod';
import { OrganizationSchema, makeFactory } from 'schemaorg-kit';

// AdministrativeArea / City / State — common areaServed values
const AreaServedRef = z.union([
  z.string(),
  z.object({
    '@type': z.enum(['AdministrativeArea', 'City', 'State', 'Country', 'GeoShape']),
    name: z.string(),
  }),
]);

const OrganizationWithAreaSchema = OrganizationSchema.extend({
  areaServed: z.union([AreaServedRef, z.array(AreaServedRef)]).optional(),
});

export const createOrganizationWithArea = makeFactory(OrganizationWithAreaSchema);

const org = createOrganizationWithArea({
  name: 'Metro Elite Transfer',
  url: 'https://metroelitetransfer.com',
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Seattle Metropolitan Area' },
    { '@type': 'City', name: 'Bellevue' },
    { '@type': 'State', name: 'Washington' },
  ],
});
```

### Adding `areaServed` to LocalBusiness

```ts
import { z } from 'zod';
import { LocalBusinessSchema, makeFactory } from 'schemaorg-kit';

const LocalBusinessWithAreaSchema = LocalBusinessSchema.extend({
  areaServed: z.union([
    z.string(),
    z.object({ '@type': z.string(), name: z.string() }),
    z.array(z.union([
      z.string(),
      z.object({ '@type': z.string(), name: z.string() }),
    ])),
  ]).optional(),
});

export const createLocalBusinessWithArea = makeFactory(LocalBusinessWithAreaSchema);

const biz = createLocalBusinessWithArea({
  '@type': ['LocalBusiness', 'LimousineService'],
  name: 'Metro Elite Transfer',
  areaServed: [
    { '@type': 'City', name: 'Seattle' },
    { '@type': 'City', name: 'Tacoma' },
  ],
});
```

### Creating a Service type

Google does not support `Service` for rich results, but you may want it for other search engines or knowledge graphs:

```ts
import { z } from 'zod';
import { extendThing, makeFactory } from 'schemaorg-kit';

const ServiceSchema = extendThing('Service', {
  serviceType: z.string().optional(),
  provider: z.union([
    z.string(),
    z.object({ '@type': z.string(), name: z.string() }).catchall(z.unknown()),
  ]).optional(),
  areaServed: z.union([
    z.string(),
    z.object({ '@type': z.string(), name: z.string() }),
    z.array(z.union([
      z.string(),
      z.object({ '@type': z.string(), name: z.string() }),
    ])),
  ]).optional(),
  offers: z.lazy(() => z.object({ '@type': z.string() }).catchall(z.unknown())).optional(),
  category: z.string().optional(),
  termsOfService: z.url().optional(),
});

export const createService = makeFactory(ServiceSchema);
```

{: .warning }
> Properties not listed in [Google's structured data documentation](https://developers.google.com/search/docs/appearance/structured-data) are ignored by Google. They are still valid JSON-LD and may be consumed by other search engines, AI assistants, or knowledge graph systems.

### Creating a RealEstateListing

Google does not support `RealEstateListing` for rich results. The only property-related type Google supports is `VacationRental` (short-term rentals), which is already built in. However, `RealEstateListing` is a valid schema.org type and may be useful for other search engines, AI assistants, or MLS integrations.

```ts
import { z } from 'zod';
import { extendThing, makeFactory, createGraph, SchemaIds } from 'schemaorg-kit';

// ── Reusable sub-schemas ─────────────────────────────────────────────

const AccommodationSchema = z.object({
  '@type': z.enum([
    'Accommodation',
    'Apartment',
    'House',
    'SingleFamilyResidence',
  ]).default('SingleFamilyResidence'),
  numberOfRooms: z.number().int().positive().optional(),
  numberOfBedrooms: z.number().int().nonnegative().optional(),
  numberOfBathroomsTotal: z.number().int().nonnegative().optional(),
  floorSize: z.object({
    '@type': z.literal('QuantitativeValue').default('QuantitativeValue'),
    value: z.number().positive(),
    unitCode: z.enum(['SQF', 'SQM']),       // sq ft or sq m
    unitText: z.string().optional(),
  }).optional(),
  yearBuilt: z.number().int().optional(),
  numberOfFullBathrooms: z.number().int().nonnegative().optional(),
  numberOfPartialBathrooms: z.number().int().nonnegative().optional(),
  petsAllowed: z.union([z.boolean(), z.string()]).optional(),
  amenityFeature: z.array(z.object({
    '@type': z.literal('LocationFeatureSpecification').default('LocationFeatureSpecification'),
    name: z.string(),
    value: z.union([z.boolean(), z.string(), z.number()]).optional(),
  })).optional(),
  permittedUsage: z.string().optional(),
});

// ── RealEstateListing ────────────────────────────────────────────────

const RealEstateListingSchema = extendThing('RealEstateListing', {
  datePosted: z.string().optional(),          // ISO 8601 date
  leaseLength: z.union([
    z.string(),                                // ISO 8601 duration, e.g. "P1Y"
    z.object({
      '@type': z.literal('QuantitativeValue').default('QuantitativeValue'),
      value: z.number(),
      unitCode: z.string(),                    // "MON", "ANN", etc.
    }),
  ]).optional(),
  containsPlace: AccommodationSchema.optional(),
  offers: z.object({
    '@type': z.literal('Offer').default('Offer'),
    price: z.number().nonnegative(),
    priceCurrency: z.string(),
    availability: z.string().optional(),
    validFrom: z.string().optional(),
  }).optional(),
});

export const createRealEstateListing = makeFactory(RealEstateListingSchema);

// ── Usage: Single-family home for sale ───────────────────────────────

const listing = createRealEstateListing({
  name: '4BR Modern Farmhouse in Bellevue',
  url: 'https://realty.example/listings/bellevue-farmhouse',
  image: [
    'https://realty.example/photos/bellevue-1.jpg',
    'https://realty.example/photos/bellevue-2.jpg',
  ],
  description: 'Stunning 4-bedroom modern farmhouse with open floor plan, gourmet kitchen, and mountain views.',
  datePosted: '2025-06-15',
  containsPlace: {
    '@type': 'SingleFamilyResidence',
    numberOfBedrooms: 4,
    numberOfBathroomsTotal: 3,
    floorSize: { value: 2800, unitCode: 'SQF' },
    yearBuilt: 2022,
    amenityFeature: [
      { name: 'Garage', value: true },
      { name: 'Central Air', value: true },
      { name: 'Lot Size', value: '0.35 acres' },
    ],
  },
  offers: {
    price: 1250000,
    priceCurrency: 'USD',
    availability: 'InStock',
  },
});

// ── Usage: Apartment for rent ────────────────────────────────────────

const rental = createRealEstateListing({
  name: '2BR Apartment in Capitol Hill',
  url: 'https://realty.example/listings/capitol-hill-apt',
  image: 'https://realty.example/photos/capitol-hill.jpg',
  datePosted: '2025-07-01',
  leaseLength: { value: 12, unitCode: 'MON' },
  containsPlace: {
    '@type': 'Apartment',
    numberOfBedrooms: 2,
    numberOfBathroomsTotal: 1,
    floorSize: { value: 950, unitCode: 'SQF' },
    petsAllowed: 'Cats only',
    amenityFeature: [
      { name: 'In-Unit Laundry', value: true },
      { name: 'Parking', value: 'Street' },
    ],
  },
  offers: {
    price: 2400,
    priceCurrency: 'USD',
  },
});
```

#### Combining with @graph

Pair the listing with a `RealEstateAgent` (a built-in `LocalBusiness` subtype) and breadcrumbs:

```ts
import { createGraph, createLocalBusiness, createBreadcrumbList, SchemaIds } from 'schemaorg-kit';
import { createRealEstateListing } from './your-schemas';

const ids = new SchemaIds('https://realty.example');

const graph = createGraph([
  createLocalBusiness({
    '@type': 'RealEstateAgent',
    '@id': ids.localBusiness(),
    name: 'Cascade Realty Group',
    url: 'https://realty.example',
    telephone: '+1-425-555-0199',
    address: {
      addressLocality: 'Bellevue',
      addressRegion: 'WA',
      addressCountry: 'US',
    },
  }),
  createRealEstateListing({
    name: '4BR Modern Farmhouse in Bellevue',
    url: 'https://realty.example/listings/bellevue-farmhouse',
    datePosted: '2025-06-15',
    image: 'https://realty.example/photos/bellevue-1.jpg',
    containsPlace: {
      '@type': 'SingleFamilyResidence',
      numberOfBedrooms: 4,
      numberOfBathroomsTotal: 3,
      floorSize: { value: 2800, unitCode: 'SQF' },
      yearBuilt: 2022,
    },
    offers: {
      price: 1250000,
      priceCurrency: 'USD',
      availability: 'InStock',
    },
  }),
  createBreadcrumbList([
    { name: 'Home', url: 'https://realty.example' },
    { name: 'Listings', url: 'https://realty.example/listings' },
    { name: 'Bellevue Farmhouse' },
  ]),
]);
```

{: .note }
> `RealEstateAgent` is a valid `@type` value for `createLocalBusiness()` — no custom schema needed. Google supports `LocalBusiness` rich results for real estate agencies.

---

## Validating Custom Fields

Custom fields use the full Zod API — enum, regex, min/max, refine, etc.:

```ts
import { z } from "zod";
import { extendThing, makeFactory } from "schemaorg-kit";

const ProductSchema = extendThing({
  "@type": z.literal("Product").default("Product"),
  name: z.string().min(1).max(200),
  sku: z.string().regex(/^[A-Z]{2}-\d{4}$/, "SKU must be XX-0000 format"),
  weight: z.number().positive().optional(),
  internalCategory: z
    .enum(["electronics", "clothing", "food", "other"])
    .optional(),
  discontinued: z.boolean().default(false),
});
```
