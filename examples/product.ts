/**
 * product.ts — Product, ProductGroup, offers, reviews, and merchant signals
 *
 * Demonstrates: single product, product variants (ProductGroup), reviews,
 * MerchantReturnPolicy, AggregateOffer (price range), OfferShippingDetails,
 * Certification, 3DModel, and @graph for a product page.
 */

import {
  createProduct,
  createProductGroup,
  createOffer,
  createOrganization,
  createBreadcrumbList,
  createWebPage,
  createGraph,
  ReviewSchema,
  AggregateRatingSchema,
  MerchantReturnPolicySchema,
  AggregateOfferSchema,
  OfferShippingDetailsSchema,
  DefinedRegionSchema,
  ShippingDeliveryTimeSchema,
  CertificationSchema,
  ThreeDModelSchema,
} from "../src/index";

const seller = createOrganization({
  name: "Acme Store",
  url: "https://acme.com",
  logo: "https://acme.com/logo.png",
});

// ─── Return policy (reused across products) ───────────────────────────────────

const returnPolicy = MerchantReturnPolicySchema.parse({
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 30,
  returnMethod: "https://schema.org/ReturnByMail",
  returnFees: "https://schema.org/FreeReturn",
  applicableCountry: "US",
});

// ─── Single Product ───────────────────────────────────────────────────────────

const product = createProduct({
  name: "Acme Trail Runner Pro",
  description: "All-terrain trail running shoe with responsive cushioning.",
  sku: "TR-PRO-001",
  gtin13: "0123456789012",
  mpn: "TR-PRO-2025",
  brand: { "@type": "Brand", name: "Acme" },
  image: [
    "https://acme.com/img/tr-pro-front.jpg",
    "https://acme.com/img/tr-pro-side.jpg",
  ],
  offers: createOffer({
    price: 149.99,
    priceCurrency: "USD",
    availability: "InStock",
    priceValidUntil: "2025-12-31",
    url: "https://acme.com/products/tr-pro",
    seller: { "@type": "Organization", name: "Acme Store" },
  }).toObject(),
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.8,
    reviewCount: 312,
    bestRating: 5,
    worstRating: 1,
  },
  review: [
    ReviewSchema.parse({
      author: { "@type": "Person", name: "Alex R." },
      reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5 },
      reviewBody: "Best trail shoe I've ever owned. Incredible grip.",
      datePublished: "2025-04-10",
    }),
  ],
  hasMerchantReturnPolicy: returnPolicy,
  color: "Midnight Blue",
  material: "Mesh upper, rubber sole",
  weight: { "@type": "QuantitativeValue", value: 285, unitCode: "GRM" },
  category: "Trail Running Shoes",
});

console.log("=== Single Product ===");
console.log(product.toScript());

// ─── ProductGroup (variants by size and color) ────────────────────────────────

const productGroup = createProductGroup({
  name: "Acme Trail Runner Pro",
  description: "All-terrain trail running shoe — available in multiple sizes and colors.",
  productGroupID: "TR-PRO",
  sku: "TR-PRO",
  gtin: "012345678901",
  brand: { "@type": "Brand", name: "Acme" },
  image: "https://acme.com/img/tr-pro-group.jpg",
  variesBy: ["https://schema.org/color", "https://schema.org/size"],
  offers: [
    createOffer({ price: 149.99, priceCurrency: "USD", availability: "InStock" }).toObject(),
    createOffer({ price: 149.99, priceCurrency: "USD", availability: "OutOfStock" }).toObject(),
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.8,
    reviewCount: 312,
  },
});

console.log("\n=== ProductGroup ===");
console.log(productGroup.toJsonLd());

// ─── AggregateOffer (multi-seller price range) ────────────────────────────────

const marketplaceProduct = createProduct({
  name: "Acme Trail Runner Pro",
  sku: "TR-PRO-001",
  brand: { "@type": "Brand", name: "Acme" },
  image: "https://acme.com/img/tr-pro-front.jpg",
  // Sold by multiple third-party sellers — show a price range
  offers: AggregateOfferSchema.parse({
    lowPrice: 89.99,
    highPrice: 149.99,
    priceCurrency: "USD",
    offerCount: 8,
    availability: "InStock",
  }),
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.8,
    reviewCount: 312,
    bestRating: 5,
  },
});

console.log("\n=== AggregateOffer (marketplace/multi-seller) ===");
console.log(marketplaceProduct.toScript());

// ─── Product with shipping details ────────────────────────────────────────────

const productWithShipping = createProduct({
  name: "Acme Trail Runner Pro",
  brand: { "@type": "Brand", name: "Acme" },
  offers: {
    "@type": "Offer",
    price: 149.99,
    priceCurrency: "USD",
    availability: "InStock",
    priceValidUntil: "2025-12-31",
    // OfferShippingDetails — required for Google Merchant Listing shipping display
    shippingDetails: [
      // Free standard shipping to US
      OfferShippingDetailsSchema.parse({
        shippingLabel: "Free Standard Shipping",
        shippingRate: { value: 0, currency: "USD" },
        shippingDestination: DefinedRegionSchema.parse({ addressCountry: "US" }),
        deliveryTime: ShippingDeliveryTimeSchema.parse({
          handlingTime: { minValue: 0, maxValue: 1 },
          transitTime: { minValue: 3, maxValue: 7 },
          cutoffTime: "14:00:00",
        }),
      }),
      // Express shipping to US (paid)
      OfferShippingDetailsSchema.parse({
        shippingLabel: "Express Shipping",
        shippingRate: { value: 14.99, currency: "USD" },
        shippingDestination: DefinedRegionSchema.parse({ addressCountry: "US" }),
        deliveryTime: ShippingDeliveryTimeSchema.parse({
          handlingTime: { minValue: 0, maxValue: 1 },
          transitTime: { minValue: 1, maxValue: 2 },
          cutoffTime: "12:00:00",
        }),
      }),
      // No shipping to Hawaii/Alaska
      OfferShippingDetailsSchema.parse({
        doesNotShip: true,
        shippingDestination: DefinedRegionSchema.parse({
          addressCountry: "US",
          addressRegion: ["HI", "AK"],
        }),
      }),
    ],
  },
});

console.log("\n=== Product with shipping details ===");
console.log(productWithShipping.toScript());

// ─── Product with certifications ──────────────────────────────────────────────

const certifiedProduct = createProduct({
  name: "Acme Solar Panel SP-400",
  description: "400W monocrystalline solar panel with 25-year power warranty.",
  image: "https://acme.com/img/sp-400.jpg",
  offers: { "@type": "Offer", price: 299.99, priceCurrency: "USD", availability: "InStock" },
  hasCertification: [
    CertificationSchema.parse({
      name: "IEC 61215",
      issuedBy: { "@type": "Organization", name: "TÜV Rheinland" },
      validFrom: "2024-01-01",
      validThrough: "2029-01-01",
      url: "https://www.tuv.com/cert/SP400",
    }),
    CertificationSchema.parse({
      name: "Energy Star",
      issuedBy: { "@type": "Organization", name: "U.S. Environmental Protection Agency" },
    }),
    CertificationSchema.parse({
      name: "UL 61730",
      issuedBy: { "@type": "Organization", name: "Underwriters Laboratories" },
    }),
  ],
});

console.log("\n=== Product with certifications ===");
console.log(certifiedProduct.toScript());

// ─── Product with 3D model ────────────────────────────────────────────────────

const productWith3D = createProduct({
  name: "Acme Trail Runner Pro",
  image: "https://acme.com/img/tr-pro-front.jpg",
  offers: { "@type": "Offer", price: 149.99, priceCurrency: "USD", availability: "InStock" },
  // 3D model — enables 3D view in Google Images and Shopping
  subjectOf: ThreeDModelSchema.parse({
    contentUrl: "https://acme.com/models/trail-runner-pro.glb",
    encodingFormat: "model/gltf-binary",
    name: "Acme Trail Runner Pro — 3D Model",
  }),
});

console.log("\n=== Product with 3D model ===");
console.log(productWith3D.toScript());

// ─── @graph for a full product page ──────────────────────────────────────────

const breadcrumb = createBreadcrumbList([
  { name: "Home", url: "https://acme.com" },
  { name: "Running Shoes", url: "https://acme.com/running" },
  { name: "Trail Runner Pro" },
]);

const webPage = createWebPage({
  name: "Trail Runner Pro — Acme",
  url: "https://acme.com/products/tr-pro",
  breadcrumb: breadcrumb.toObject(),
  description: "Shop the Acme Trail Runner Pro.",
});

const graph = createGraph([seller, webPage, breadcrumb, product]);

console.log("\n=== Product page @graph ===");
console.log(graph.toScript());
