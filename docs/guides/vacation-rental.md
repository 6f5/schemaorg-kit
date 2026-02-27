---
title: Vacation Rental
parent: Guides
nav_order: 13
---

# Vacation Rental Rich Results
{: .no_toc }

`VacationRental` structured data helps your property listings surface in Google's vacation rental search experience with amenities, ratings, pricing, and photos.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Required Fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string` | Property name |
| `address` | `PostalAddress` | Property address |
| `url` | `string` | Listing page URL |

## Recommended Fields

| Field | Type | Notes |
|-------|------|-------|
| `description` | `string` | Property description |
| `image` | `string[]` | Property photos |
| `numberOfRooms` | `number` | Total rooms |
| `petsAllowed` | `boolean` | Pets allowed? |
| `starRating` | `Rating` | Property star class (1–5) |
| `checkinTime` | `string` | e.g. `"15:00"` |
| `checkoutTime` | `string` | e.g. `"11:00"` |
| `amenityFeature` | `LocationFeatureSpecification[]` | List of amenities |
| `occupancy` | `QuantitativeValue` | Max occupancy |
| `aggregateRating` | `AggregateRating` | Guest ratings |
| `geo` | `GeoCoordinates` | Exact coordinates |

---

## Full Example

```ts
import { createVacationRental } from 'schemaorg-kit';

const rental = createVacationRental({
  name: 'Oceanfront Villa — Malibu',
  description: 'Stunning 4-bedroom oceanfront villa with private beach access, heated pool, and panoramic Pacific views. Perfect for family retreats or corporate getaways.',
  url: 'https://rentals.example.com/malibu-villa',
  image: [
    'https://rentals.example.com/photos/malibu-villa-exterior.jpg',
    'https://rentals.example.com/photos/malibu-villa-pool.jpg',
    'https://rentals.example.com/photos/malibu-villa-living-room.jpg',
    'https://rentals.example.com/photos/malibu-villa-beach.jpg',
  ],
  address: {
    streetAddress: '24100 Pacific Coast Highway',
    addressLocality: 'Malibu',
    addressRegion: 'CA',
    postalCode: '90265',
    addressCountry: 'US',
  },
  geo: {
    latitude: 34.0259,
    longitude: -118.7798,
  },
  numberOfRooms: 4,
  petsAllowed: true,
  checkinTime: '15:00',
  checkoutTime: '11:00',
  starRating: {
    '@type': 'Rating',
    ratingValue: 5,
  },
  occupancy: {
    '@type': 'QuantitativeValue',
    minValue: 1,
    maxValue: 10,
  },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Private Beach Access', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Heated Pool', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Hot Tub', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'WiFi', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Air Conditioning', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Fully Equipped Kitchen', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'BBQ Grill', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Ocean View', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Parking', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Pet Friendly', value: true },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.9,
    reviewCount: 87,
    bestRating: 5,
    worstRating: 1,
  },
  telephone: '+1-310-555-0142',
  email: 'booking@rentals.example.com',
});
```

---

## Adding Pricing

Combine with an `Offer` for nightly pricing:

```ts
const rental = createVacationRental({
  name: 'Downtown Loft',
  address: { addressLocality: 'Chicago', addressRegion: 'IL', addressCountry: 'US' },
  url: 'https://rentals.example.com/chicago-loft',
  offers: {
    '@type': 'Offer',
    price: 189,
    priceCurrency: 'USD',
    description: 'Per night, minimum 2 nights',
    availability: 'InStock',
    url: 'https://rentals.example.com/chicago-loft/book',
  },
});
```

---

## containsPlace — Room-Level Markup (Required by Google)

Google's vacation rental guidelines require `containsPlace` with at least one `Accommodation` object describing the sleeping arrangements. Without it your listing may not qualify for the rich result.

```ts
import { createVacationRental, AccommodationSchema, BedDetailsSchema } from 'schemaorg-kit';

const rental = createVacationRental({
  name: 'Oceanfront Villa — Malibu',
  address: { addressLocality: 'Malibu', addressRegion: 'CA', addressCountry: 'US' },
  containsPlace: [
    AccommodationSchema.parse({
      name: 'Master Suite',
      numberOfBedrooms: 1,
      numberOfBathroomsTotal: 1,
      floorSize: { '@type': 'QuantitativeValue', value: 45, unitCode: 'MTK' },
      bed: BedDetailsSchema.parse({ numberOfBeds: 1, typeOfBed: 'King bed' }),
      occupancy: { '@type': 'QuantitativeValue', maxValue: 2 },
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Ocean View', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Private Balcony', value: true },
      ],
    }),
    AccommodationSchema.parse({
      name: 'Guest Room 1',
      numberOfBedrooms: 1,
      numberOfBathroomsTotal: 1,
      bed: [
        BedDetailsSchema.parse({ numberOfBeds: 1, typeOfBed: 'Queen bed' }),
      ],
      occupancy: { '@type': 'QuantitativeValue', maxValue: 2 },
    }),
    AccommodationSchema.parse({
      name: 'Bunk Room',
      numberOfBedrooms: 1,
      bed: [
        BedDetailsSchema.parse({ numberOfBeds: 2, typeOfBed: 'Bunk bed' }),
      ],
      occupancy: { '@type': 'QuantitativeValue', maxValue: 4 },
    }),
  ],
});
```

### Accommodation fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string?` | Room name / label |
| `numberOfBedrooms` | `number?` | Bedroom count |
| `numberOfBathroomsTotal` | `number?` | Bathroom count |
| `bed` | `BedDetails \| BedDetails[]?` | Bed configuration |
| `occupancy` | `QuantitativeValue?` | `{ maxValue: 2 }` |
| `floorSize` | `QuantitativeValue?` | `{ value: 45, unitCode: "MTK" }` (MTK = m², FTK = ft²) |
| `amenityFeature` | `LocationFeatureSpecification \| []?` | Room amenities |
| `petsAllowed` | `boolean \| string?` | Pet policy for this room |

### BedTypeEnum values

`"Single bed"`, `"Double bed"`, `"Queen bed"`, `"King bed"`, `"Bunk bed"`, `"Sofa bed"`, `"Cot"`, `"Waterbed"`, `"Toddler bed"`, or any custom string.

---

## Common Mistakes

{: .warning }
> **`containsPlace` is required for Google's vacation rental rich result.** Without at least one `Accommodation`, your listing may not be eligible.

{: .tip }
> Include multiple high-quality photos (at least 5). Google's vacation rental experience is heavily visual — more photos correlate with higher click-through rates.

{: .tip }
> `amenityFeature` entries should use `value: true` for available amenities. You can also use `value: false` to explicitly indicate something is NOT available.

{: .tip }
> Always include `geo` coordinates. Rental search is location-based, and accurate coordinates ensure your property appears for the right searches.
