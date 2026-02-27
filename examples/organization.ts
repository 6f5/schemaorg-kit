/**
 * organization.ts — Organization, knowledge panel signals, and profile @graph
 *
 * Demonstrates: organization with trust signals (vatID, sameAs),
 * merchant return policy, contact points, and a complete @graph
 * that Google uses to build a knowledge panel.
 */

import {
  createOrganization,
  createNGO,
  createOnlineStore,
  createOnlineBusiness,
  createGraph,
  createWebPage,
  MerchantReturnPolicySchema,
  PostalAddressSchema,
  ContactPointSchema,
} from "../src/index";

// ─── Full Organization for knowledge panel ────────────────────────────────────

const org = createOrganization({
  name: "Acme Corporation",
  legalName: "Acme Corporation, Inc.",
  url: "https://acme.com",
  logo: {
    "@type": "ImageObject",
    url: "https://acme.com/logo.png",
    width: 512,
    height: 512,
  },
  description: "Acme Corporation is a global leader in innovative consumer products since 1985.",
  foundingDate: "1985-03-15",
  address: PostalAddressSchema.parse({
    streetAddress: "1 Acme Plaza",
    addressLocality: "San Francisco",
    addressRegion: "CA",
    postalCode: "94105",
    addressCountry: "US",
  }),
  telephone: "+1-800-226-3872",
  email: "hello@acme.com",
  contactPoint: [
    ContactPointSchema.parse({
      contactType: "customer support",
      telephone: "+1-800-226-3872",
      email: "support@acme.com",
      availableLanguage: ["English", "Spanish"],
      hoursAvailable: "Mo-Fr 09:00-18:00",
    }),
    ContactPointSchema.parse({
      contactType: "sales",
      telephone: "+1-800-226-3873",
      email: "sales@acme.com",
      availableLanguage: "English",
    }),
  ],
  // Trust signals — help Google verify your organization's identity
  vatID: "US123456789",
  iso6523Code: "0060:123456789",   // DUNS number
  // Social / profile links — appear in knowledge panel
  sameAs: [
    "https://en.wikipedia.org/wiki/Acme_Corporation",
    "https://www.linkedin.com/company/acme-corp",
    "https://twitter.com/AcmeCorp",
    "https://www.facebook.com/AcmeCorp",
    "https://www.instagram.com/acmecorp",
    "https://www.youtube.com/@AcmeCorp",
    "https://www.crunchbase.com/organization/acme",
  ],
  // Merchant return policy (improves Product Snippet eligibility)
  hasMerchantReturnPolicy: MerchantReturnPolicySchema.parse({
    applicableCountry: ["US", "CA", "GB"],
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 30,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/FreeReturn",
  }),
  numberOfEmployees: { "@type": "QuantitativeValue", value: 5000 },
});

console.log("=== Organization ===");
console.log(org.toScript());

// ─── NGO / Non-profit ─────────────────────────────────────────────────────────


const ngo = createNGO({
  name: "Ocean Guardians Foundation",
  url: "https://oceanguardians.org",
  logo: "https://oceanguardians.org/logo.png",
  description: "Dedicated to protecting marine ecosystems through research, education, and advocacy.",
  foundingDate: "2010-04-22",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Seattle",
    addressRegion: "WA",
    addressCountry: "US",
  },
  telephone: "+1-206-555-0100",
  email: "info@oceanguardians.org",
  sameAs: [
    "https://en.wikipedia.org/wiki/Ocean_Guardians_Foundation",
    "https://twitter.com/OceanGuardians",
  ],
});

console.log("\n=== NGO / Non-profit ===");
console.log(ngo.toJsonLd());

// ─── Online Store (pure e-commerce retailer) ──────────────────────────────────

const onlineStore = createOnlineStore({
  name: "Acme Shop",
  legalName: "Acme Shop, Inc.",
  url: "https://shop.acme.com",
  logo: {
    "@type": "ImageObject",
    url: "https://shop.acme.com/logo.png",
    width: 512,
    height: 512,
  },
  description: "Premium outdoor gear — free shipping on orders over $75.",
  // Merchant return policy — helps Product Snippet eligibility
  hasMerchantReturnPolicy: MerchantReturnPolicySchema.parse({
    applicableCountry: ["US", "CA"],
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 60,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/FreeReturn",
  }),
  sameAs: [
    "https://twitter.com/acmeshop",
    "https://www.instagram.com/acmeshop",
    "https://www.facebook.com/AcmeShop",
  ],
  vatID: "US987654321",
});

console.log("\n=== OnlineStore ===");
console.log(onlineStore.toScript());

// ─── Online Business (SaaS / online-only service) ─────────────────────────────

const onlineBusiness = createOnlineBusiness({
  name: "Acme Analytics",
  url: "https://analytics.acme.io",
  description: "Real-time web analytics platform for engineering teams.",
  logo: "https://analytics.acme.io/logo.png",
  contactPoint: [
    ContactPointSchema.parse({
      contactType: "customer support",
      email: "support@analytics.acme.io",
      availableLanguage: ["English"],
      hoursAvailable: "Mo-Fr 09:00-18:00",
    }),
  ],
  sameAs: [
    "https://twitter.com/acmeanalytics",
    "https://linkedin.com/company/acme-analytics",
  ],
});

console.log("\n=== OnlineBusiness (SaaS) ===");
console.log(onlineBusiness.toJsonLd());

// ─── @graph for homepage (organization + homepage) ────────────────────────────
// Google uses this to build the knowledge panel for your organization.

const homepage = createWebPage({
  name: "Acme Corporation — Innovative Products",
  url: "https://acme.com",
  description: "Acme Corporation creates innovative consumer products for millions of customers worldwide.",
  inLanguage: "en-US",
  "@id": "https://acme.com/#webpage",
});

// Add "@id" to the org for @graph cross-referencing
const orgWithId = createOrganization({
  name: "Acme Corporation",
  url: "https://acme.com",
  logo: "https://acme.com/logo.png",
  sameAs: [
    "https://en.wikipedia.org/wiki/Acme_Corporation",
    "https://twitter.com/AcmeCorp",
  ],
  "@id": "https://acme.com/#organization",
});

const graph = createGraph([orgWithId, homepage]);

console.log("\n=== Homepage @graph (for knowledge panel) ===");
console.log(graph.toScript());
