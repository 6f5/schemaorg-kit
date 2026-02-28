---
title: Things
parent: API Reference
nav_order: 2
---

# Things
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## ThingSchema — Base Type

All `Thing` subtypes extend this base schema. These fields are available on every type.

| Field | Type | Description |
|-------|------|-------------|
| `@type` | `string` | Schema.org type identifier |
| `@id` | `string?` | JSON-LD node identifier for @graph cross-referencing |
| `name` | `string?` | Name of the thing |
| `description` | `string?` | Short description |
| `url` | `string?` (URL) | Canonical URL |
| `identifier` | `string \| number?` | Unique identifier (ISBN, GTIN, etc.) |
| `image` | `string \| ImageObject \| (string \| ImageObject)[]?` | Representative image(s) |
| `sameAs` | `string \| string[]?` | Other URLs for the same entity (Wikipedia, social profiles) |
| `alternateName` | `string?` | Alternate names/aliases |
| `subjectOf` | `Thing?` | A subject of this thing |
| `mainEntityOfPage` | `string \| Thing?` | The page this is the main entity of |

---

## createPerson

```ts
import { createPerson } from 'schemaorg-kit';
```

Represents a real person. Used as `author`, `director`, `instructor`, etc.

### Fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string?` | Person's full name |
| `email` | `string?` | Must be valid email format |
| `telephone` | `string?` | E.164 recommended |
| `jobTitle` | `string?` | Job title or role |
| `url` | `string?` | Profile page URL |
| `image` | `string \| ImageObject \| []?` | Profile photo |
| `sameAs` | `string \| string[]?` | Social profiles, Wikipedia |
| `worksFor` | `Organization?` | Employer |
| `address` | `PostalAddress?` | Mailing address |
| `nationality` | `string?` | Country name |
| `birthDate` | `string?` | ISO 8601 date |
| `alumniOf` | `string \| object?` | Schools attended |
| `knowsAbout` | `string \| string[]?` | Topics of expertise |
| `knowsLanguage` | `string \| string[]?` | Languages spoken |
| `award` | `string \| string[]?` | Awards received |
| `honorificPrefix` | `string?` | Dr., Prof., etc. |
| `honorificSuffix` | `string?` | PhD, Esq., etc. |
| `interactionStatistic` | `InteractionCounter \| []?` | Engagement stats |
| `agentInteractionStatistic` | `InteractionCounter \| []?` | Creator activity stats |

### Example

```ts
const person = createPerson({
  name: 'Dr. Sarah Kim',
  email: 'sarah@example.com',
  jobTitle: 'Machine Learning Engineer',
  url: 'https://example.com/authors/sarah',
  image: 'https://example.com/photos/sarah.jpg',
  sameAs: [
    'https://github.com/sarahkim',
    'https://www.linkedin.com/in/sarahkim',
    'https://twitter.com/sarahkim_ml',
  ],
  worksFor: { '@type': 'Organization', name: 'Acme AI' },
  knowsAbout: ['Machine Learning', 'Python', 'Distributed Systems'],
});
```

---

## createOrganization / createNGO / createCorporation / createOnlineStore / createOnlineBusiness

```ts
import {
  createOrganization,
  createNGO,
  createCorporation,
  createOnlineStore,
  createOnlineBusiness,
} from 'schemaorg-kit';
```

| Factory | `@type` | Use for |
|---------|---------|---------|
| `createOrganization` | `"Organization"` | Generic organizations |
| `createNGO` | `"NGO"` | Nonprofits, charities |
| `createCorporation` | `"Corporation"` | For-profit companies |
| `createOnlineStore` | `"OnlineStore"` | Pure e-commerce retailers |
| `createOnlineBusiness` | `"OnlineBusiness"` | Online-only businesses |

All share the same field set. `createOnlineStore` and `createOnlineBusiness` improve Knowledge Panel accuracy for brands that operate exclusively online.

### Fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string?` | Legal or common name |
| `legalName` | `string?` | Full legal name |
| `url` | `string?` | Homepage URL |
| `logo` | `string \| ImageObject?` | Logo image |
| `description` | `string?` | About the organization |
| `foundingDate` | `string?` | ISO 8601 date |
| `address` | `PostalAddress?` | Physical address |
| `telephone` | `string?` | Main phone number |
| `email` | `string?` | Contact email |
| `contactPoint` | `ContactPoint \| ContactPoint[]?` | Specific contact channels |
| `vatID` | `string?` | VAT number (trust signal) |
| `iso6523Code` | `string?` | e.g. DUNS number (trust signal) |
| `sameAs` | `string \| string[]?` | Wikipedia, social profiles, Crunchbase |
| `globalLocationNumber` | `string?` | GS1 GLN |
| `naics` | `string?` | NAICS industry code |
| `hasMerchantReturnPolicy` | `MerchantReturnPolicy?` | Return policy (helps Product eligibility) |
| `hasShippingService` | `ShippingService \| []?` | Org-level shipping service |
| `hasMemberProgram` | `MemberProgram \| []?` | Loyalty/membership program |
| `interactionStatistic` | `InteractionCounter \| []?` | Engagement stats |
| `agentInteractionStatistic` | `InteractionCounter \| []?` | Activity stats |
| `numberOfEmployees` | `QuantitativeValue?` | `{ "@type": "QuantitativeValue", value: 500 }` |
| `subOrganization` | `Organization?` | A subsidiary |
| `parentOrganization` | `Organization?` | Parent company |

### Example

```ts
const org = createOrganization({
  name: 'Acme Corporation',
  legalName: 'Acme Corporation, Inc.',
  url: 'https://acme.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://acme.com/logo.png',
    width: 512,
    height: 512,
  },
  vatID: 'US123456789',
  sameAs: [
    'https://en.wikipedia.org/wiki/Acme_Corporation',
    'https://www.linkedin.com/company/acme',
    'https://twitter.com/AcmeCorp',
  ],
  contactPoint: [
    ContactPointSchema.parse({
      contactType: 'customer support',
      telephone: '+1-800-226-3872',
      email: 'support@acme.com',
      availableLanguage: ['English', 'Spanish'],
    }),
  ],
});
```

---

## createProduct / createProductGroup

```ts
import { createProduct, createProductGroup, createOffer } from 'schemaorg-kit';
```

### createProduct fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string?` | Product name |
| `description` | `string?` | Product description |
| `image` | `string \| ImageObject \| []?` | Product images |
| `brand` | `Brand?` | `{ "@type": "Brand", name: "..." }` |
| `sku` | `string?` | Stock-keeping unit |
| `gtin` | `string?` | Global Trade Item Number |
| `gtin8/12/13/14` | `string?` | Specific GTIN format |
| `mpn` | `string?` | Manufacturer Part Number |
| `color` | `string?` | Color |
| `material` | `string?` | Material |
| `offers` | `Offer \| AggregateOffer \| []?` | Pricing (single, aggregate, or multi-seller) |
| `aggregateRating` | `AggregateRating?` | Average rating |
| `review` | `Review \| Review[]?` | Individual reviews |
| `hasMerchantReturnPolicy` | `MerchantReturnPolicy?` | Return policy |
| `hasCertification` | `Certification \| Certification[]?` | Safety/quality certifications |
| `subjectOf` | `3DModel \| 3DModel[]?` | 3D model for Google Images/Shopping |
| `isVariantOf` | `ProductGroup?` | Parent product group |
| `inProductGroupWithID` | `string?` | ID of the parent ProductGroup |
| `additionalProperty` | `PropertyValue \| PropertyValue[]?` | Custom attributes |
| `pattern` | `string?` | Design pattern, e.g. "Stripes" |
| `size` | `string \| SizeSpecification?` | Size value or structured spec |
| `audience` | `PeopleAudience?` | Target audience (gender, age) |
| `positiveNotes` | `ItemList?` | Pros (editorial) |
| `negativeNotes` | `ItemList?` | Cons (editorial) |

### CertificationSchema

Use `hasCertification` to mark third-party certifications on products (CE, UL, Energy Star, etc.):

```ts
import { createProduct, CertificationSchema } from 'schemaorg-kit';

const product = createProduct({
  name: 'Solar Panel X200',
  hasCertification: CertificationSchema.parse({
    name: 'IEC 61215',
    issuedBy: { '@type': 'Organization', name: 'TÜV Rheinland' },
    validFrom: '2024-01-01',
    validThrough: '2027-01-01',
    url: 'https://www.tuv.com/cert/X200',
  }),
});
```

### ThreeDModelSchema

Use `subjectOf` to attach a 3D model — enables 3D product views in Google Images and Shopping:

```ts
import { createProduct, ThreeDModelSchema } from 'schemaorg-kit';

const product = createProduct({
  name: 'Trail Runner Pro',
  subjectOf: ThreeDModelSchema.parse({
    contentUrl: 'https://example.com/models/trail-runner.glb',
    encodingFormat: 'model/gltf-binary',
    name: 'Trail Runner Pro 3D Model',
  }),
});
```

### SizeSpecificationSchema

```ts
import { SizeSpecificationSchema } from 'schemaorg-kit';
```

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string?` | Size label, e.g. "10" |
| `sizeSystem` | `string?` | `"US"`, `"EU"`, `"UK"`, `"JP"` |
| `sizeGroup` | `string \| string[]?` | `"Petite"`, `"Plus"`, `"Regular"`, etc. |

### PeopleAudienceSchema

```ts
import { PeopleAudienceSchema } from 'schemaorg-kit';
```

| Field | Type | Notes |
|-------|------|-------|
| `suggestedGender` | `string?` | `"Male"`, `"Female"`, `"Unknown"` |
| `suggestedMinAge` | `number?` | Minimum age |
| `suggestedMaxAge` | `number?` | Maximum age |

### createProductGroup fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string?` | Product group name |
| `productGroupID` | `string` | Unique group identifier |
| `variesBy` | `string \| string[]?` | Varying attributes: "color", "size", etc. |
| `hasVariant` | `Product \| Product[]?` | Individual variants |

### Example

```ts
import { createProduct, createProductGroup, createOffer, ReviewSchema } from 'schemaorg-kit';

const product = createProduct({
  name: 'Trail Runner Pro — Men\'s, Size 10',
  description: 'Lightweight trail running shoe for technical terrain.',
  image: [
    'https://example.com/shoes/trail-runner-1200x900.jpg',
    'https://example.com/shoes/trail-runner-side.jpg',
  ],
  brand: { '@type': 'Brand', name: 'TrailTech' },
  sku: 'TR-PRO-M-10',
  gtin13: '0123456789012',
  color: 'Midnight Blue',
  material: 'Mesh / Rubber',
  offers: {
    '@type': 'Offer',
    price: 129.99,
    priceCurrency: 'USD',
    availability: 'InStock',
    url: 'https://example.com/shop/trail-runner-pro',
    priceValidUntil: '2025-12-31',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.7,
    reviewCount: 892,
    bestRating: 5,
  },
  review: ReviewSchema.parse({
    author: { '@type': 'Person', name: 'Marcus J.' },
    reviewRating: { '@type': 'Rating', ratingValue: 5, bestRating: 5 },
    reviewBody: 'Excellent grip on wet rocks. Very comfortable for long runs.',
    datePublished: '2025-02-10',
  }),
});
```

---

## createEvent

```ts
import { createEvent, EventStatusType, EventAttendanceMode } from 'schemaorg-kit';
```

### Fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string` | **Required by Google** |
| `startDate` | `string` | **Required** — ISO 8601 |
| `endDate` | `string?` | ISO 8601 |
| `location` | `Place \| VirtualLocation \| PostalAddress?` | Physical or virtual location |
| `eventStatus` | `EventStatusType?` | See below |
| `eventAttendanceMode` | `EventAttendanceMode?` | See below |
| `organizer` | `Person \| Organization?` | Event organizer |
| `performer` | `Person \| Organization?` | Performer(s) |
| `offers` | `Offer \| Offer[]?` | Ticket pricing |
| `image` | `string \| ImageObject \| []?` | Event images |
| `description` | `string?` | Event description |
| `aggregateRating` | `AggregateRating?` | Ratings |
| `duration` | `string?` | ISO 8601 duration |
| `inLanguage` | `string?` | BCP 47 language code |

### EventStatusType enum

| Value | Full URL |
|-------|---------|
| `"EventScheduled"` | `https://schema.org/EventScheduled` |
| `"EventCancelled"` | `https://schema.org/EventCancelled` |
| `"EventMovedOnline"` | `https://schema.org/EventMovedOnline` |
| `"EventPostponed"` | `https://schema.org/EventPostponed` |
| `"EventRescheduled"` | `https://schema.org/EventRescheduled` |

Values are automatically transformed to full schema.org URLs.

### EventAttendanceMode enum

| Value | Full URL |
|-------|---------|
| `"OfflineEventAttendanceMode"` | `https://schema.org/OfflineEventAttendanceMode` |
| `"OnlineEventAttendanceMode"` | `https://schema.org/OnlineEventAttendanceMode` |
| `"MixedEventAttendanceMode"` | `https://schema.org/MixedEventAttendanceMode` |

---

## createPlace

```ts
import { createPlace } from 'schemaorg-kit';
```

A physical location. Often nested inside `Event.location` or used as a base for `LocalBusiness`.

### Fields

Inherits all `ThingSchema` fields, plus:

| Field | Type | Notes |
|-------|------|-------|
| `address` | `PostalAddress \| string?` | Structured address |
| `geo` | `GeoCoordinates?` | Lat/long coordinates |
| `telephone` | `string?` | Phone number |
| `openingHoursSpecification` | `OpeningHoursSpecification \| []?` | When open |
| `specialOpeningHoursSpecification` | `OpeningHoursSpecification \| []?` | Holiday hours |
| `amenityFeature` | `LocationFeatureSpecification \| []?` | Features/amenities |
| `hasMap` | `string?` | URL to a map |
| `maximumAttendeeCapacity` | `number?` | Capacity |

---

## createLocalBusiness / createRestaurant / createHotel

```ts
import { createLocalBusiness, createRestaurant, createHotel } from 'schemaorg-kit';
```

`LocalBusiness` extends `Place` with business-specific fields.

| Factory | `@type` default |
|---------|-----------------|
| `createLocalBusiness` | `"LocalBusiness"` (overridable) |
| `createRestaurant` | `"Restaurant"` |
| `createHotel` | `"Hotel"` |

**Overriding `@type`** for specific subtypes:
```ts
// These are all valid @type values for createLocalBusiness:
createLocalBusiness({ '@type': 'HairSalon', name: 'Cuts & Co.' })
createLocalBusiness({ '@type': 'DaySpa', name: 'Zen Spa' })
createLocalBusiness({ '@type': 'GroceryStore', name: 'Fresh Mart' })
```

### Additional LocalBusiness fields

| Field | Type | Notes |
|-------|------|-------|
| `legalName` | `string?` | Full legal name |
| `email` | `string?` | Business email |
| `logo` | `string \| ImageObject?` | Business logo |
| `aggregateRating` | `AggregateRating?` | Rating from reviews |
| `review` | `Review \| Review[]?` | Individual reviews |
| `priceRange` | `string?` | e.g. `"$"`, `"$$"`, `"$$$"`, `"$$$$"` |
| `servesCuisine` | `string \| string[]?` | Restaurant only — cuisine types |
| `hasMenu` | `string?` | URL to menu |
| `acceptsReservations` | `boolean \| string?` | Whether reservations are accepted |
| `vatID` | `string?` | VAT number |
| `hasMerchantReturnPolicy` | `MerchantReturnPolicy?` | Return policy |
| `department` | `LocalBusiness?` | A department within the business |
| `openingHours` | `string \| string[]?` | Alternative to `openingHoursSpecification` |

---

## createMovie

```ts
import { createMovie } from 'schemaorg-kit';
```

### Fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string?` | Movie title |
| `description` | `string?` | Plot summary |
| `image` | `string \| ImageObject \| []?` | Poster images |
| `director` | `Person?` | Director |
| `actor` | `Person \| Person[]?` | Cast members |
| `datePublished` | `string?` | Release date |
| `duration` | `string?` | ISO 8601 duration |
| `genre` | `string \| string[]?` | Genre(s) |
| `contentRating` | `string?` | e.g. "PG-13", "R" |
| `aggregateRating` | `AggregateRating?` | Critical/audience rating |
| `review` | `Review \| Review[]?` | Reviews |
| `trailer` | `VideoObject?` | Trailer video |
| `productionCompany` | `Organization?` | Studio |
| `countryOfOrigin` | `string?` | Country of production |
| `inLanguage` | `string?` | Original language |

### Example

```ts
const movie = createMovie({
  name: 'The Last Algorithm',
  description: 'A thriller about an AI that becomes self-aware.',
  director: { '@type': 'Person', name: 'Maria Santos' },
  actor: [
    { '@type': 'Person', name: 'James Park' },
    { '@type': 'Person', name: 'Elena Kovacs' },
  ],
  datePublished: '2025-07-04',
  duration: 'PT2H18M',
  genre: ['Thriller', 'Science Fiction'],
  contentRating: 'PG-13',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 8.2,
    ratingCount: 45000,
    bestRating: 10,
  },
});
```
