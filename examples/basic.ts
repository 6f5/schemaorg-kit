/**
 * basic.ts — Quick-start overview of schemaorg-kit
 *
 * Shows the two factory APIs, output methods, composition pattern,
 * and the @graph helper for combining multiple nodes in one <script> tag.
 */

import {
  // Named factories
  createProduct,
  createOffer,
  createPerson,
  createOrganization,
  createArticle,
  createWebPage,
  createBreadcrumbList,

  // Unified factory
  schema,

  // @graph
  createGraph,
} from "../src/index";

// ─── 1. Named factory + nesting via .toObject() ───────────────────────────────

const offer = createOffer({
  price: 99.99,
  priceCurrency: "USD",
  availability: "InStock",          // auto-expands to "https://schema.org/InStock"
  priceValidUntil: "2025-12-31",
});

const product = createProduct({
  name: "Running Shoes",
  description: "Lightweight everyday trainers",
  sku: "RS-001",
  gtin13: "0123456789012",
  brand: { "@type": "Brand", name: "Acme" },
  offers: offer.toObject(),         // pass .toObject() when nesting
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.7,
    reviewCount: 214,
  },
});

console.log("=== Product (script tag) ===");
console.log(product.toScript());

// ─── 2. Unified schema() factory ──────────────────────────────────────────────

const org = schema("Organization", {
  name: "Acme Corp",
  url: "https://acme.com",
  email: "hello@acme.com",
  logo: "https://acme.com/logo.png",
  sameAs: [
    "https://twitter.com/acme",
    "https://linkedin.com/company/acme",
  ],
});

console.log("\n=== Organization (JSON-LD object) ===");
console.log(org.toJsonLd());

// ─── 3. Output methods ────────────────────────────────────────────────────────

const author = createPerson({
  name: "Jane Doe",
  email: "jane@example.com",
  jobTitle: "Senior Editor",
  url: "https://example.com/jane",
});

const article = createArticle({
  headline: "The Best Running Shoes of 2025",
  author: author.toObject(),
  datePublished: "2025-01-15",
  dateModified: "2025-03-01",
  inLanguage: "en-US",
  keywords: ["running", "shoes", "fitness"],
  image: "https://example.com/shoes.jpg",
});

console.log("\n=== Article (pretty JSON string) ===");
console.log(article.toString());

// ─── 4. BreadcrumbList helper ─────────────────────────────────────────────────

const breadcrumb = createBreadcrumbList([
  { name: "Home", url: "https://example.com" },
  { name: "Products", url: "https://example.com/products" },
  { name: "Running Shoes" },        // last item — url is optional
]);

// ─── 5. @graph — multiple nodes in one <script> tag ──────────────────────────

const webPage = createWebPage({
  name: "Running Shoes - Acme",
  url: "https://example.com/products/running-shoes",
  breadcrumb: breadcrumb.toObject(),
});

const graph = createGraph([org, webPage, breadcrumb, product]);

console.log("\n=== @graph (single <script> tag) ===");
console.log(graph.toScript());

// ─── 6. Validation ────────────────────────────────────────────────────────────

const result = product.safeParse();
if (!result.success) {
  console.error("Validation errors:", result.error.issues);
} else {
  console.log("\n✓ Product is valid");
}
