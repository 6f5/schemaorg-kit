---
title: Product
parent: Guides
nav_order: 2
---

# Product Rich Results
{: .no_toc }

Product structured data enables price, availability, and review information directly in Google Search results — the most impactful rich result for e-commerce.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## When to Use

Add `Product` schema to every product detail page. Google displays it as:
- Price and currency
- In-stock / out-of-stock badge
- Star rating and review count
- "Buy on [site]" deep links in Shopping

---

## Required Fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string` | Product name |

For **Shopping rich results**, Google additionally requires one of:
- `offers` with `price` + `priceCurrency`
- `aggregateRating`
- `review`

---

## Recommended Fields

| Field | Type | Notes |
|-------|------|-------|
| `image` | `string \| string[]` | Product images (multiple angles recommended) |
| `description` | `string` | Full product description |
| `sku` | `string` | Your internal SKU |
| `mpn` | `string` | Manufacturer part number |
| `brand` | `Organization` | Brand entity |
| `gtin13` | `string` | EAN/UPC barcode |
| `aggregateRating` | `AggregateRating` | Average rating |
| `review` | `Review[]` | Individual reviews |
| `offers` | `Offer` | Pricing info |
| `hasMerchantReturnPolicy` | `MerchantReturnPolicy` | Return policy |

---

## Basic Product

```ts
import { createProduct } from 'schemaorg-kit';

const product = createProduct({
  name: 'Trail Runner Pro',
  description: 'Lightweight trail running shoe with Vibram® outsole.',
  image: [
    'https://example.com/shoes/trail-runner-1200x1200.jpg',
    'https://example.com/shoes/trail-runner-side.jpg',
    'https://example.com/shoes/trail-runner-sole.jpg',
  ],
  sku: 'TR-PRO-42-BLK',
  gtin13: '0123456789012',
  brand: { '@type': 'Organization', name: 'TrailGear' },
  offers: {
    '@type': 'Offer',
    price: 129.99,
    priceCurrency: 'USD',
    availability: 'InStock',         // → https://schema.org/InStock
    priceValidUntil: '2025-12-31',
    url: 'https://example.com/buy/trail-runner-pro',
    seller: { '@type': 'Organization', name: 'TrailGear Store' },
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.8,
    ratingCount: 2340,
    bestRating: 5,
    worstRating: 1,
  },
});
```

---

## Product with Reviews

```ts
import { createProduct } from 'schemaorg-kit';

const product = createProduct({
  name: 'Trail Runner Pro',
  offers: { '@type': 'Offer', price: 129.99, priceCurrency: 'USD', availability: 'InStock' },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.8,
    reviewCount: 890,
    bestRating: 5,
  },
  review: [
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Maria Garcia' },
      reviewRating: { '@type': 'Rating', ratingValue: 5, bestRating: 5 },
      reviewBody: 'Best trail shoes I have owned. Grip is incredible on wet rocks.',
      datePublished: '2025-02-14',
    },
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'David Kim' },
      reviewRating: { '@type': 'Rating', ratingValue: 4, bestRating: 5 },
      reviewBody: 'Comfortable right out of the box. Runs slightly narrow.',
      datePublished: '2025-01-29',
    },
  ],
});
```

---

## Return Policy

Add return policy to increase trust signals and unlock additional Google Shopping features:

```ts
import { createProduct, MerchantReturnPolicySchema } from 'schemaorg-kit';

const product = createProduct({
  name: 'Trail Runner Pro',
  offers: { '@type': 'Offer', price: 129.99, priceCurrency: 'USD', availability: 'InStock' },
  hasMerchantReturnPolicy: {
    '@type': 'MerchantReturnPolicy',
    applicableCountry: ['US', 'CA', 'GB'],
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: 30,
    returnMethod: 'https://schema.org/ReturnByMail',
    returnFees: 'https://schema.org/FreeReturn',
  },
});
```

---

## Product Variants (ProductGroup)

For products with variants (size, color, etc.) use `createProductGroup`:

```ts
import { createProductGroup, createProduct } from 'schemaorg-kit';

const group = createProductGroup({
  name: 'Trail Runner Pro',
  description: 'Available in 3 colors and sizes 36–47.',
  variesBy: ['https://schema.org/color', 'https://schema.org/size'],
  hasVariant: [
    {
      '@type': 'Product',
      name: 'Trail Runner Pro — Black, Size 42',
      sku: 'TR-PRO-42-BLK',
      color: 'Black',
      size: '42',
      offers: { '@type': 'Offer', price: 129.99, priceCurrency: 'USD', availability: 'InStock' },
    },
    {
      '@type': 'Product',
      name: 'Trail Runner Pro — Forest Green, Size 42',
      sku: 'TR-PRO-42-GRN',
      color: 'Forest Green',
      size: '42',
      offers: { '@type': 'Offer', price: 129.99, priceCurrency: 'USD', availability: 'InStock' },
    },
  ],
});
```

---

## Offer Availability Values

| Value | Meaning |
|-------|---------|
| `"InStock"` | Item is available now |
| `"OutOfStock"` | Temporarily unavailable |
| `"PreOrder"` | Available in the future |
| `"BackOrder"` | Available but ships later |
| `"LimitedAvailability"` | Low stock |
| `"SoldOut"` | Permanently gone |
| `"OnlineOnly"` | Only available online |
| `"InStoreOnly"` | Only available in store |

These values are automatically transformed to full `https://schema.org/` URLs.

---

## Product Carousel

Display a list of products as a carousel in search:

```ts
import { createCarousel, createProduct } from 'schemaorg-kit';

const carousel = createCarousel([
  createProduct({ name: 'Trail Runner Pro', offers: { '@type': 'Offer', price: 129.99, priceCurrency: 'USD' } }),
  createProduct({ name: 'Summit Boots',     offers: { '@type': 'Offer', price: 199.99, priceCurrency: 'USD' } }),
  createProduct({ name: 'Alpine Sneakers',  offers: { '@type': 'Offer', price: 89.99,  priceCurrency: 'USD' } }),
]);
```

---

## Price Range (AggregateOffer)

When a product is sold by multiple third-party sellers at different prices, use `AggregateOfferSchema` instead of a single `Offer`:

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

Google displays `lowPrice` as the "starting from" price in results.

---

## Shipping Details

Add `shippingDetails` to your `Offer` to qualify for Google's enhanced Merchant Listing shipping display:

```ts
import {
  createProduct,
  OfferShippingDetailsSchema,
  DefinedRegionSchema,
  ShippingDeliveryTimeSchema,
} from 'schemaorg-kit';

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

{: .tip }
> To indicate free shipping, set `shippingRate.value: 0`. To mark a region as no-ship, set `doesNotShip: true`.

---

## Certifications

Add third-party certifications (CE, UL, Energy Star, ISO, etc.) using `hasCertification`:

```ts
import { createProduct, CertificationSchema } from 'schemaorg-kit';

const product = createProduct({
  name: 'Solar Panel X200',
  hasCertification: [
    CertificationSchema.parse({
      name: 'IEC 61215',
      issuedBy: { '@type': 'Organization', name: 'TÜV Rheinland' },
      validFrom: '2024-01-01',
      validThrough: '2027-01-01',
    }),
    CertificationSchema.parse({
      name: 'Energy Star',
      issuedBy: { '@type': 'Organization', name: 'U.S. EPA' },
    }),
  ],
});
```

---

## 3D Model

Attach a `.glb` / glTF 3D model using `subjectOf` to enable 3D product views in Google Images and Shopping:

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

---

## Common Mistakes

{: .warning }
> **Price must be a number, not a string.** `price: '129.99'` will fail Zod validation. Use `price: 129.99`.

{: .warning }
> **Don't use fake reviews.** Google's guidelines prohibit self-serving reviews. Include only authentic user reviews.

{: .tip }
> Include multiple product images with different aspect ratios (landscape 16:9, square 1:1) to qualify for more Google surfaces.
