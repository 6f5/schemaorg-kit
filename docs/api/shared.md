---
title: Shared Types
parent: API Reference
nav_order: 5
---

# Shared Types
{: .no_toc }

Shared building blocks used across multiple schema types. Import them to compose rich nested schemas.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## PostalAddressSchema

```ts
import { PostalAddressSchema, type PostalAddress } from 'schemaorg-kit';
```

Physical mailing address. Use with `Organization.address`, `LocalBusiness.address`, `JobPosting.jobLocation`, etc.

```ts
const address = PostalAddressSchema.parse({
  streetAddress: '123 Main Street',
  addressLocality: 'San Francisco',   // city
  addressRegion: 'CA',                 // state/province
  postalCode: '94105',
  addressCountry: 'US',               // ISO 3166-1 alpha-2
  postOfficeBoxNumber: 'PO Box 123',  // optional
});
// { "@type": "PostalAddress", ... }
```

You can also pass a plain object literal directly — any field accepting `PostalAddress` also accepts the raw object shape.

---

## GeoCoordinatesSchema

```ts
import { GeoCoordinatesSchema, type GeoCoordinates } from 'schemaorg-kit';
```

GPS coordinates. Used with `LocalBusiness.geo`, `Place.geo`, `VacationRental.geo`.

```ts
const geo = GeoCoordinatesSchema.parse({
  latitude: 37.78825,
  longitude: -122.4324,
});
// { "@type": "GeoCoordinates", "latitude": 37.78825, "longitude": -122.4324 }
```

---

## ImageObjectSchema / ImageOrUrl / createImageObject

```ts
import {
  ImageObjectSchema,
  ImageOrUrl,
  createImageObject,
  type ImageObject,
} from 'schemaorg-kit';
```

A detailed image object with Google image metadata fields.

### ImageObject fields

| Field | Type | Notes |
|-------|------|-------|
| `url` | `string` | **Required** — image URL |
| `contentUrl` | `string?` | Direct file URL (if different from page URL) |
| `width` | `number \| QuantitativeValue?` | Pixel width |
| `height` | `number \| QuantitativeValue?` | Pixel height |
| `caption` | `string?` | Image caption |
| `description` | `string?` | Image description |
| `name` | `string?` | Image name/title |
| `creator` | `Person \| Organization?` | Who created the image |
| `creditText` | `string?` | Credit line to display |
| `copyrightNotice` | `string?` | Copyright notice |
| `license` | `string?` | License URL |
| `acquireLicensePage` | `string?` | Where to get a license |
| `representativeOfPage` | `boolean?` | Primary image of its page |
| `encodingFormat` | `string?` | MIME type, e.g. `"image/jpeg"` |
| `uploadDate` | `string?` | ISO 8601 upload date |
| `thumbnailUrl` | `string?` | Thumbnail URL |

```ts
const image = createImageObject({
  url: 'https://example.com/photo.jpg',
  width: 1200,
  height: 675,
  caption: 'Team at the annual conference',
  creator: { '@type': 'Person', name: 'Bob Chen' },
  creditText: 'Photo by Bob Chen / Acme Corp',
  license: 'https://creativecommons.org/licenses/by/4.0/',
});
```

### ImageOrUrl

`ImageOrUrl` accepts either a URL string or a full `ImageObject`. It's used on fields like `Thing.image`, `Organization.logo`, `Article.image`, etc.:

```ts
// Both are valid:
{ image: 'https://example.com/photo.jpg' }
{ image: { '@type': 'ImageObject', url: 'https://example.com/photo.jpg', width: 1200 } }

// Arrays are also accepted on most types:
{ image: ['https://example.com/1.jpg', 'https://example.com/2.jpg'] }
```

---

## ContactPointSchema

```ts
import { ContactPointSchema, type ContactPoint } from 'schemaorg-kit';
```

A specific contact channel. Used in `Organization.contactPoint`.

```ts
const contact = ContactPointSchema.parse({
  contactType: 'customer support',   // required
  telephone: '+1-800-555-0100',
  email: 'support@example.com',      // must be valid email
  availableLanguage: ['English', 'Spanish'],
  hoursAvailable: 'Mo-Fr 09:00-18:00',
  contactOption: 'TollFree',
  areaServed: 'US',
});
```

---

## MonetaryAmountSchema / PriceSpecificationSchema

```ts
import { MonetaryAmountSchema, PriceSpecificationSchema } from 'schemaorg-kit';
```

Used for `JobPosting.baseSalary` and `VacationRental` pricing.

```ts
// Salary range
const salary = MonetaryAmountSchema.parse({
  currency: 'USD',
  value: {
    '@type': 'QuantitativeValue',
    minValue: 80000,
    maxValue: 120000,
    unitText: 'YEAR',   // or 'HOUR', 'MONTH', 'WEEK'
  },
});

// Single price
const price = PriceSpecificationSchema.parse({
  price: 9.99,
  priceCurrency: 'USD',
  valueAddedTaxIncluded: true,
  validFrom: '2025-01-01',
  validThrough: '2025-12-31',
});
```

---

## RatingSchema / AggregateRatingSchema / ReviewSchema

```ts
import {
  RatingSchema,
  AggregateRatingSchema,
  ReviewSchema,
  EmployerAggregateRatingSchema,
  type Rating,
  type AggregateRating,
  type Review,
} from 'schemaorg-kit';
```

### RatingSchema

A single rating value.

```ts
const rating = RatingSchema.parse({
  ratingValue: 4.5,
  bestRating: 5,      // default if omitted
  worstRating: 1,     // default if omitted
  ratingExplanation: 'Great product, fast shipping.',
  reviewAspect: 'quality',
});
```

### AggregateRatingSchema

Average across many ratings. Either `ratingCount` or `reviewCount` is required.

```ts
const aggregateRating = AggregateRatingSchema.parse({
  ratingValue: 4.7,
  ratingCount: 12400,  // total number of ratings
  reviewCount: 890,    // total number of written reviews
  bestRating: 5,
  worstRating: 1,
});
```

### ReviewSchema

An individual user review.

```ts
const review = ReviewSchema.parse({
  author: { '@type': 'Person', name: 'Jane Smith' },
  reviewRating: { '@type': 'Rating', ratingValue: 5, bestRating: 5 },
  reviewBody: 'Exceptional product. Well worth the price.',
  datePublished: '2025-02-14',
  publisher: { '@type': 'Organization', name: 'Trustpilot' },
  itemReviewed: { '@type': 'Product', name: 'Trail Runner Pro' },
});
```

### EmployerAggregateRatingSchema

For employer ratings (Glassdoor-style).

```ts
const rating = EmployerAggregateRatingSchema.parse({
  ratingValue: 4.1,
  ratingCount: 2340,
  bestRating: 5,
  worstRating: 1,
  itemReviewed: { '@type': 'Organization', name: 'Acme Corp' },
});
```

---

## OfferSchema / createOffer / ItemAvailability

```ts
import { OfferSchema, createOffer, ItemAvailability, type Offer } from 'schemaorg-kit';
```

Pricing information for products, apps, courses, events, etc.

### Offer fields

| Field | Type | Notes |
|-------|------|-------|
| `price` | `number?` | Price (use `0` for free) |
| `priceCurrency` | `string?` | ISO 4217 code, e.g. `"USD"` |
| `availability` | `ItemAvailability?` | Auto-transforms to schema.org URL |
| `url` | `string?` | Purchase URL |
| `priceValidUntil` | `string?` | ISO 8601 expiry date |
| `validFrom` | `string?` | Offer start date |
| `description` | `string?` | Offer description |
| `seller` | `Person \| Organization?` | Who is selling |
| `itemCondition` | `string?` | New, Used, Refurbished |
| `hasMerchantReturnPolicy` | `MerchantReturnPolicy?` | Return policy |
| `shippingDetails` | `OfferShippingDetails \| OfferShippingDetails[]?` | Shipping info (see below) |

### ItemAvailability values

| Input | Transformed output |
|-------|-------------------|
| `"InStock"` | `https://schema.org/InStock` |
| `"OutOfStock"` | `https://schema.org/OutOfStock` |
| `"PreOrder"` | `https://schema.org/PreOrder` |
| `"SoldOut"` | `https://schema.org/SoldOut` |
| `"LimitedAvailability"` | `https://schema.org/LimitedAvailability` |
| `"OnlineOnly"` | `https://schema.org/OnlineOnly` |
| `"InStoreOnly"` | `https://schema.org/InStoreOnly` |
| `"BackOrder"` | `https://schema.org/BackOrder` |
| `"Discontinued"` | `https://schema.org/Discontinued` |

```ts
// Using createOffer factory (returns SchemaNode)
const offer = createOffer({
  price: 29.99,
  priceCurrency: 'USD',
  availability: 'InStock',  // → "https://schema.org/InStock"
  priceValidUntil: '2025-12-31',
  url: 'https://example.com/buy',
});

// Using OfferSchema directly (returns plain object)
const offerObj = OfferSchema.parse({
  price: 0,
  priceCurrency: 'USD',
  availability: 'InStock',
});
```

---

## AggregateOfferSchema

```ts
import { AggregateOfferSchema, type AggregateOffer } from 'schemaorg-kit';
```

For products sold by multiple sellers at different prices. Use in place of (or alongside) `OfferSchema` on `Product.offers`.

### Fields

| Field | Type | Notes |
|-------|------|-------|
| `lowPrice` | `number?` | Lowest available price |
| `highPrice` | `number?` | Highest available price |
| `priceCurrency` | `string?` | ISO 4217 currency code (3 chars) |
| `offerCount` | `number?` | Number of sellers |
| `offers` | `Offer \| Offer[]?` | Individual seller offers |
| `availability` | `ItemAvailability?` | Overall availability |
| `url` | `string?` | Canonical product URL |

```ts
import { createProduct, AggregateOfferSchema } from 'schemaorg-kit';

const product = createProduct({
  name: 'Trail Runner Pro',
  offers: AggregateOfferSchema.parse({
    lowPrice: 89.99,
    highPrice: 149.99,
    priceCurrency: 'USD',
    offerCount: 12,
    availability: 'InStock',
  }),
});
```

---

## OfferShippingDetailsSchema / DefinedRegionSchema / ShippingDeliveryTimeSchema

```ts
import {
  OfferShippingDetailsSchema,
  DefinedRegionSchema,
  ShippingDeliveryTimeSchema,
  type OfferShippingDetails,
  type DefinedRegion,
  type ShippingDeliveryTime,
} from 'schemaorg-kit';
```

Required for Google's [Merchant Listing](https://developers.google.com/search/docs/appearance/structured-data/product) shipping eligibility. Add `shippingDetails` to `Offer` on a product page.

### OfferShippingDetailsSchema fields

| Field | Type | Notes |
|-------|------|-------|
| `shippingRate` | `{ value, currency }?` | Shipping cost (use `value: 0` for free) |
| `shippingDestination` | `DefinedRegion \| DefinedRegion[]?` | Where it ships |
| `deliveryTime` | `ShippingDeliveryTime?` | How long it takes |
| `doesNotShip` | `boolean?` | Explicitly mark no-ship regions |
| `shippingLabel` | `string?` | Display label, e.g. `"Free shipping"` |

### DefinedRegionSchema fields

| Field | Type | Notes |
|-------|------|-------|
| `addressCountry` | `string?` | ISO 3166-1 alpha-2 country code |
| `addressRegion` | `string \| string[]?` | State/province codes |
| `postalCodePrefix` | `string \| string[]?` | Zip code prefix(es) |
| `postalCodeRange` | `{ postalCodeBegin, postalCodeEnd }?` | Zip range |

### ShippingDeliveryTimeSchema fields

| Field | Type | Notes |
|-------|------|-------|
| `handlingTime` | `{ minValue, maxValue, unitCode: "DAY" }?` | Days to process order |
| `transitTime` | `{ minValue, maxValue, unitCode: "DAY" }?` | Days in transit |
| `cutoffTime` | `string?` | Order cutoff, e.g. `"14:00:00"` |

### Example — Free US shipping

```ts
import { createProduct, OfferShippingDetailsSchema, DefinedRegionSchema, ShippingDeliveryTimeSchema } from 'schemaorg-kit';

const product = createProduct({
  name: 'Trail Runner Pro',
  offers: {
    '@type': 'Offer',
    price: 129.99,
    priceCurrency: 'USD',
    availability: 'InStock',
    shippingDetails: OfferShippingDetailsSchema.parse({
      shippingLabel: 'Free Standard Shipping',
      shippingRate: { value: 0, currency: 'USD' },
      shippingDestination: DefinedRegionSchema.parse({ addressCountry: 'US' }),
      deliveryTime: ShippingDeliveryTimeSchema.parse({
        handlingTime: { minValue: 0, maxValue: 1 },
        transitTime: { minValue: 3, maxValue: 7 },
        cutoffTime: '14:00:00',
      }),
    }),
  },
});
```

---

## MerchantReturnPolicySchema

```ts
import { MerchantReturnPolicySchema, type MerchantReturnPolicy } from 'schemaorg-kit';
```

Used on `Organization.hasMerchantReturnPolicy` and `Product.hasMerchantReturnPolicy` to improve Product rich result eligibility.

```ts
const returnPolicy = MerchantReturnPolicySchema.parse({
  applicableCountry: ['US', 'CA', 'GB'],
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
  merchantReturnDays: 30,
  returnMethod: 'https://schema.org/ReturnByMail',
  returnFees: 'https://schema.org/FreeReturn',
  returnPolicySeasonalOverride: {
    startDate: '2025-11-15',
    endDate: '2026-01-31',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: 60,
  },
});
```

---

## OpeningHoursSpecificationSchema

```ts
import { OpeningHoursSpecificationSchema, type OpeningHoursSpecification } from 'schemaorg-kit';
```

Used with `LocalBusiness.openingHoursSpecification` and `LocalBusiness.specialOpeningHoursSpecification`.

```ts
import { OpeningHoursSpecificationSchema } from 'schemaorg-kit';

// Regular hours
const weekdays = OpeningHoursSpecificationSchema.parse({
  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  opens: '09:00:00',
  closes: '17:00:00',
});

// Special holiday hours (use specialOpeningHoursSpecification)
const holiday = OpeningHoursSpecificationSchema.parse({
  dayOfWeek: 'Thursday',
  opens: '00:00:00',   // midnight to midnight = closed
  closes: '00:00:00',
  validFrom: '2025-12-25',
  validThrough: '2025-12-25',
});
```

Valid `dayOfWeek` values: `"Monday"`, `"Tuesday"`, `"Wednesday"`, `"Thursday"`, `"Friday"`, `"Saturday"`, `"Sunday"`, `"PublicHolidays"`

---

## HowToStepSchema / HowToSectionSchema

```ts
import { HowToStepSchema, HowToSectionSchema } from 'schemaorg-kit';
```

For `Recipe.recipeInstructions` and `HowTo` types.

```ts
// Simple step
const step = HowToStepSchema.parse({
  name: 'Preheat',
  text: 'Preheat oven to 350°F (175°C).',
  url: 'https://example.com/recipe#step-1',
  image: 'https://example.com/recipe/step-1.jpg',
});

// Section with sub-steps
const section = HowToSectionSchema.parse({
  name: 'Prepare the sauce',
  itemListElement: [
    { '@type': 'HowToStep', text: 'Dice the tomatoes.' },
    { '@type': 'HowToStep', text: 'Sauté garlic in olive oil.' },
    { '@type': 'HowToStep', text: 'Add tomatoes and simmer for 20 minutes.' },
  ],
});
```

---

## PersonOrOrgRef

```ts
import { PersonOrOrgRef, type PersonOrOrgRefType } from 'schemaorg-kit';
```

A union type used for fields that accept either a Person or an Organization. Accepts:
- A URL string (reference by URL)
- A `{ "@type": "Person", ... }` object
- A `{ "@type": "Organization", ... }` object

Used on: `author`, `publisher`, `creator`, `contributor`, `copyrightHolder`, `hiringOrganization`, etc.

```ts
// All of these are valid:
{ author: 'https://example.com/authors/alice' }          // URL reference
{ author: { '@type': 'Person', name: 'Alice' } }          // Person object
{ author: { '@type': 'Organization', name: 'Acme' } }     // Org object
{ author: createPerson({ name: 'Alice' }).toObject() }     // From factory
```

---

## ClipSchema / BroadcastEventSchema / VideoObjectSchema

See [Creative Works → createVideoObject](creative-works#createvideoobject).
