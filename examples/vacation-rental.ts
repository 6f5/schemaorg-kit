/**
 * vacation-rental.ts — VacationRental structured data
 *
 * Demonstrates: full vacation rental listing with containsPlace (Accommodation +
 * BedDetails), pricing, amenities, pet-friendly property, and a property @graph.
 */

import {
  createVacationRental,
  createOrganization,
  createGraph,
  PostalAddressSchema,
  GeoCoordinatesSchema,
  AggregateRatingSchema,
  AccommodationSchema,
  BedDetailsSchema,
} from "../src/index";

// ─── Full Vacation Rental ──────────────────────────────────────────────────

const beachHouse = createVacationRental({
  name: "Oceanfront Beach House — Private Pool & Direct Beach Access",
  description:
    "Stunning 4-bedroom oceanfront home with private pool, hot tub, and direct beach access. " +
    "Sleeps 10 comfortably. Fully equipped kitchen, outdoor dining area, fire pit, and " +
    "stunning panoramic ocean views from every room.",
  url: "https://coastalrentals.example.com/properties/oceanfront-beach-house",
  telephone: "+1-800-555-0198",
  address: PostalAddressSchema.parse({
    streetAddress: "1 Ocean Drive",
    addressLocality: "Malibu",
    addressRegion: "CA",
    postalCode: "90265",
    addressCountry: "US",
  }),
  geo: GeoCoordinatesSchema.parse({
    latitude: 34.0259,
    longitude: -118.7798,
  }),
  image: [
    "https://coastalrentals.example.com/properties/beach-house/exterior.jpg",
    "https://coastalrentals.example.com/properties/beach-house/pool.jpg",
    "https://coastalrentals.example.com/properties/beach-house/living-room.jpg",
    "https://coastalrentals.example.com/properties/beach-house/master-bedroom.jpg",
  ],
  checkinTime: "15:00:00",
  checkoutTime: "11:00:00",
  petsAllowed: false,
  numberOfRooms: 4,
  occupancy: {
    "@type": "QuantitativeValue",
    minValue: 1,
    maxValue: 10,
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Private Pool", value: true },
    { "@type": "LocationFeatureSpecification", name: "Hot Tub", value: true },
    { "@type": "LocationFeatureSpecification", name: "Direct Beach Access", value: true },
    { "@type": "LocationFeatureSpecification", name: "Ocean View", value: true },
    { "@type": "LocationFeatureSpecification", name: "Free WiFi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Air Conditioning", value: true },
    { "@type": "LocationFeatureSpecification", name: "Full Kitchen", value: true },
    { "@type": "LocationFeatureSpecification", name: "Outdoor BBQ Grill", value: true },
    { "@type": "LocationFeatureSpecification", name: "Fire Pit", value: true },
    { "@type": "LocationFeatureSpecification", name: "Smart TV", value: true },
    { "@type": "LocationFeatureSpecification", name: "Washer/Dryer", value: true },
    { "@type": "LocationFeatureSpecification", name: "Free Parking (2 cars)", value: true },
  ],
  starRating: {
    "@type": "Rating",
    ratingValue: 5,
  },
  aggregateRating: AggregateRatingSchema.parse({
    ratingValue: 4.9,
    reviewCount: 124,
    bestRating: 5,
    worstRating: 1,
  }),
  priceRange: "$$$$",
  offers: {
    "@type": "Offer",
    price: 850,
    priceCurrency: "USD",
    description: "Per night (3-night minimum)",
    availability: "https://schema.org/InStock",
    url: "https://coastalrentals.example.com/properties/oceanfront-beach-house/book",
  },
  // containsPlace — room-level markup, required by Google for vacation rental rich results
  containsPlace: [
    AccommodationSchema.parse({
      name: "Master Suite",
      numberOfBedrooms: 1,
      numberOfBathroomsTotal: 1,
      floorSize: { "@type": "QuantitativeValue", value: 55, unitCode: "MTK" },
      bed: BedDetailsSchema.parse({ numberOfBeds: 1, typeOfBed: "King bed" }),
      occupancy: { "@type": "QuantitativeValue", maxValue: 2 },
      amenityFeature: [
        { "@type": "LocationFeatureSpecification", name: "Ocean View", value: true },
        { "@type": "LocationFeatureSpecification", name: "Private Balcony", value: true },
        { "@type": "LocationFeatureSpecification", name: "En-suite Bathroom", value: true },
      ],
    }),
    AccommodationSchema.parse({
      name: "Guest Room 1",
      numberOfBedrooms: 1,
      numberOfBathroomsTotal: 1,
      bed: BedDetailsSchema.parse({ numberOfBeds: 1, typeOfBed: "Queen bed" }),
      occupancy: { "@type": "QuantitativeValue", maxValue: 2 },
    }),
    AccommodationSchema.parse({
      name: "Guest Room 2",
      numberOfBedrooms: 1,
      numberOfBathroomsTotal: 1,
      bed: BedDetailsSchema.parse({ numberOfBeds: 1, typeOfBed: "Queen bed" }),
      occupancy: { "@type": "QuantitativeValue", maxValue: 2 },
    }),
    AccommodationSchema.parse({
      name: "Kids Bunk Room",
      numberOfBedrooms: 1,
      bed: [
        BedDetailsSchema.parse({ numberOfBeds: 2, typeOfBed: "Bunk bed" }),
      ],
      occupancy: { "@type": "QuantitativeValue", maxValue: 4 },
      amenityFeature: [
        { "@type": "LocationFeatureSpecification", name: "Game Console", value: true },
      ],
    }),
  ],
});

console.log("=== Oceanfront Beach House ===");
console.log(beachHouse.toScript());

// ─── Pet-friendly mountain cabin ──────────────────────────────────────────

const mountainCabin = createVacationRental({
  name: "Rustic Mountain Cabin — Pet Friendly, Hot Tub, Ski-In/Ski-Out",
  description:
    "Cozy 3-bedroom log cabin nestled in the Rockies. Ski-in/ski-out access to " +
    "Aspen Mountain, private hot tub on the deck, stone fireplace, and stunning mountain views. " +
    "Dogs welcome! (2 pets max, 50 lb limit)",
  url: "https://coastalrentals.example.com/properties/mountain-cabin",
  address: PostalAddressSchema.parse({
    addressLocality: "Aspen",
    addressRegion: "CO",
    postalCode: "81611",
    addressCountry: "US",
  }),
  geo: GeoCoordinatesSchema.parse({
    latitude: 39.1911,
    longitude: -106.8175,
  }),
  image: [
    "https://coastalrentals.example.com/properties/cabin/exterior-snow.jpg",
    "https://coastalrentals.example.com/properties/cabin/hot-tub.jpg",
    "https://coastalrentals.example.com/properties/cabin/fireplace.jpg",
  ],
  checkinTime: "16:00:00",
  checkoutTime: "10:00:00",
  petsAllowed: true,
  numberOfRooms: 3,
  occupancy: {
    "@type": "QuantitativeValue",
    minValue: 1,
    maxValue: 8,
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Ski-In/Ski-Out", value: true },
    { "@type": "LocationFeatureSpecification", name: "Hot Tub", value: true },
    { "@type": "LocationFeatureSpecification", name: "Stone Fireplace", value: true },
    { "@type": "LocationFeatureSpecification", name: "Pet Friendly", value: true },
    { "@type": "LocationFeatureSpecification", name: "Free WiFi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Ski Storage", value: true },
    { "@type": "LocationFeatureSpecification", name: "Full Kitchen", value: true },
    { "@type": "LocationFeatureSpecification", name: "Mountain View", value: true },
  ],
  aggregateRating: AggregateRatingSchema.parse({
    ratingValue: 4.8,
    reviewCount: 87,
    bestRating: 5,
  }),
  priceRange: "$$$",
  offers: {
    "@type": "Offer",
    price: 395,
    priceCurrency: "USD",
    description: "Per night (2-night minimum in peak season)",
    availability: "https://schema.org/InStock",
    url: "https://coastalrentals.example.com/properties/mountain-cabin/book",
  },
});

console.log("\n=== Mountain Cabin (pet-friendly) ===");
console.log(mountainCabin.toJsonLd());

// ─── Apartment in city center ─────────────────────────────────────────────

const cityApartment = createVacationRental({
  name: "Stylish Studio — Heart of Manhattan, Times Square Area",
  description:
    "Modern studio apartment for 1–2 guests in the heart of Midtown Manhattan. " +
    "Steps from Times Square, Central Park, and major subway lines. " +
    "Full kitchen, fast WiFi, 24/7 doorman.",
  url: "https://coastalrentals.example.com/properties/nyc-studio",
  address: PostalAddressSchema.parse({
    streetAddress: "400 W 43rd Street",
    addressLocality: "New York",
    addressRegion: "NY",
    postalCode: "10036",
    addressCountry: "US",
  }),
  geo: GeoCoordinatesSchema.parse({
    latitude: 40.7589,
    longitude: -74.0, // approx
  }),
  image: "https://coastalrentals.example.com/properties/nyc-studio/main.jpg",
  checkinTime: "14:00:00",
  checkoutTime: "11:00:00",
  petsAllowed: false,
  numberOfRooms: 1,
  occupancy: {
    "@type": "QuantitativeValue",
    maxValue: 2,
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Free WiFi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Air Conditioning", value: true },
    { "@type": "LocationFeatureSpecification", name: "Kitchenette", value: true },
    { "@type": "LocationFeatureSpecification", name: "24/7 Doorman", value: true },
    { "@type": "LocationFeatureSpecification", name: "Elevator", value: true },
  ],
  aggregateRating: AggregateRatingSchema.parse({
    ratingValue: 4.6,
    reviewCount: 312,
    bestRating: 5,
  }),
  priceRange: "$$",
  offers: {
    "@type": "Offer",
    price: 189,
    priceCurrency: "USD",
    description: "Per night",
    availability: "https://schema.org/InStock",
  },
});

// ─── @graph for property listing page ─────────────────────────────────────

const rentalCompany = createOrganization({
  "@id": "https://coastalrentals.example.com/#organization",
  name: "Coastal & Mountain Rentals",
  url: "https://coastalrentals.example.com",
  logo: "https://coastalrentals.example.com/logo.png",
  telephone: "+1-800-555-0198",
});

const graph = createGraph([rentalCompany, beachHouse]);

console.log("\n=== Beach House property @graph ===");
console.log(graph.toScript());
