/**
 * local-business.ts — LocalBusiness, Restaurant, and opening hours
 *
 * Demonstrates: LocalBusiness with geo, opening hours, reviews,
 * restaurant specialization, and @graph for a business page.
 */

import {
  createLocalBusiness,
  createRestaurant,
  createGraph,
  createBreadcrumbList,
  createWebPage,
  OpeningHoursSpecificationSchema,
  AggregateRatingSchema,
  PostalAddressSchema,
  GeoCoordinatesSchema,
} from "../src/index";

// ─── Basic LocalBusiness ──────────────────────────────────────────────────────

const salon = createLocalBusiness({
  "@type": "HairSalon",
  name: "Luxe Hair Studio",
  url: "https://luxehair.example.com",
  telephone: "+1-555-867-5309",
  email: "hello@luxehair.example.com",
  address: PostalAddressSchema.parse({
    streetAddress: "123 Main Street",
    addressLocality: "San Francisco",
    addressRegion: "CA",
    postalCode: "94105",
    addressCountry: "US",
  }),
  geo: GeoCoordinatesSchema.parse({
    latitude: 37.78825,
    longitude: -122.4324,
  }),
  openingHoursSpecification: [
    OpeningHoursSpecificationSchema.parse({
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00:00",
      closes: "19:00:00",
    }),
    OpeningHoursSpecificationSchema.parse({
      dayOfWeek: "Saturday",
      opens: "10:00:00",
      closes: "18:00:00",
    }),
    OpeningHoursSpecificationSchema.parse({
      dayOfWeek: "Sunday",
      opens: "11:00:00",
      closes: "16:00:00",
    }),
  ],
  priceRange: "$$$",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.6,
    reviewCount: 189,
    bestRating: 5,
    worstRating: 1,
  },
  image: "https://luxehair.example.com/photos/salon-front.jpg",
  sameAs: [
    "https://www.yelp.com/biz/luxe-hair-studio",
    "https://www.instagram.com/luxehair",
  ],
});

console.log("=== HairSalon ===");
console.log(salon.toScript());

// ─── Restaurant (Google-specific subtype) ─────────────────────────────────────

const restaurant = createRestaurant({
  name: "Trattoria Bella",
  url: "https://trattoria-bella.example.com",
  telephone: "+1-415-555-0123",
  address: {
    "@type": "PostalAddress",
    streetAddress: "456 North Beach Ave",
    addressLocality: "San Francisco",
    addressRegion: "CA",
    postalCode: "94133",
    addressCountry: "US",
  },
  geo: { "@type": "GeoCoordinates", latitude: 37.8006, longitude: -122.4099 },
  servesCuisine: ["Italian", "Mediterranean"],
  hasMenu: "https://trattoria-bella.example.com/menu",
  acceptsReservations: "https://trattoria-bella.example.com/reservations",
  priceRange: "$$",
  openingHoursSpecification: [
    OpeningHoursSpecificationSchema.parse({
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday"],
      opens: "17:30:00",
      closes: "22:00:00",
    }),
    OpeningHoursSpecificationSchema.parse({
      dayOfWeek: ["Friday", "Saturday"],
      opens: "17:00:00",
      closes: "23:00:00",
    }),
    OpeningHoursSpecificationSchema.parse({
      dayOfWeek: "Sunday",
      opens: "16:00:00",
      closes: "21:00:00",
    }),
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.9,
    reviewCount: 437,
  },
  image: [
    "https://trattoria-bella.example.com/img/dining-room.jpg",
    "https://trattoria-bella.example.com/img/pasta.jpg",
  ],
  sameAs: ["https://www.yelp.com/biz/trattoria-bella"],
});

console.log("\n=== Restaurant ===");
console.log(restaurant.toJsonLd());

// ─── Seasonal hours (holiday override) ───────────────────────────────────────

const restaurantWithHoliday = createRestaurant({
  name: "Trattoria Bella",
  address: {
    "@type": "PostalAddress",
    streetAddress: "456 North Beach Ave",
    addressLocality: "San Francisco",
    addressRegion: "CA",
    postalCode: "94133",
    addressCountry: "US",
  },
  openingHoursSpecification: [
    OpeningHoursSpecificationSchema.parse({
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "17:30:00",
      closes: "22:00:00",
    }),
  ],
  specialOpeningHoursSpecification: [
    // Closed Christmas Day
    OpeningHoursSpecificationSchema.parse({
      dayOfWeek: "Thursday",
      opens: "00:00:00",
      closes: "00:00:00",
      validFrom: "2025-12-25",
      validThrough: "2025-12-25",
    }),
    // Extended hours New Year's Eve
    OpeningHoursSpecificationSchema.parse({
      dayOfWeek: "Wednesday",
      opens: "17:00:00",
      closes: "02:00:00",
      validFrom: "2025-12-31",
      validThrough: "2025-12-31",
    }),
  ],
});

console.log("\n=== Restaurant with holiday hours ===");
console.log(JSON.stringify(restaurantWithHoliday.toJsonLd(), null, 2));

// ─── @graph for a business landing page ──────────────────────────────────────

const breadcrumb = createBreadcrumbList([
  { name: "Home", url: "https://trattoria-bella.example.com" },
  { name: "About Us" },
]);

const graph = createGraph([restaurant, breadcrumb]);

console.log("\n=== Business page @graph ===");
console.log(graph.toScript());
