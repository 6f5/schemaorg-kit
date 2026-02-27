/**
 * profile-page.ts — ProfilePage structured data
 *
 * Demonstrates: individual person profile page, organization profile page,
 * and a social media-style profile @graph.
 */

import {
  createProfilePage,
  createPerson,
  createOrganization,
  createGraph,
} from "../src/index";

// ─── Individual (person) profile page ─────────────────────────────────────
// Useful for author pages, speaker profiles, team member pages.

const personProfile = createProfilePage({
  name: "Priya Sharma — Software Engineer & Open Source Contributor",
  url: "https://devplatform.example.com/u/priya-sharma",
  description:
    "Full-stack software engineer specializing in TypeScript, distributed systems, and " +
    "developer tooling. Open source maintainer. Speaker at JSConf and NodeConf.",
  datePublished: "2023-01-15",
  dateModified: "2025-04-10",
  inLanguage: "en-US",
  // The Person this page is about — mainEntity links the page to the entity
  mainEntity: createPerson({
    "@id": "https://devplatform.example.com/u/priya-sharma#person",
    name: "Priya Sharma",
    url: "https://devplatform.example.com/u/priya-sharma",
    image: "https://devplatform.example.com/avatars/priya-sharma.jpg",
    jobTitle: "Senior Software Engineer",
    worksFor: {
      "@type": "Organization",
      name: "Acme Tech",
      url: "https://acmetech.example.com",
    },
    sameAs: [
      "https://github.com/priya-sharma",
      "https://www.linkedin.com/in/priya-sharma-dev",
      "https://twitter.com/priyacodes",
      "https://bsky.app/profile/priya.codes",
    ],
    description:
      "Priya is a senior engineer at Acme Tech with 10+ years of experience. " +
      "She contributes to popular open source projects and speaks at international conferences.",
    knowsAbout: [
      "TypeScript",
      "Node.js",
      "Distributed Systems",
      "React",
      "PostgreSQL",
    ],
  }).toObject(),
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://devplatform.example.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Community",
        item: "https://devplatform.example.com/community",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Priya Sharma",
      },
    ],
  },
});

console.log("=== Person Profile Page ===");
console.log(personProfile.toScript());

// ─── Company / Organization profile page ──────────────────────────────────

const orgProfile = createProfilePage({
  name: "Acme Tech — Developer Tools & Cloud Platform",
  url: "https://devplatform.example.com/companies/acme-tech",
  description:
    "Acme Tech builds developer tools, cloud infrastructure, and APIs " +
    "trusted by 50,000+ engineering teams worldwide.",
  datePublished: "2022-06-01",
  dateModified: "2025-03-20",
  inLanguage: "en-US",
  mainEntity: createOrganization({
    "@id": "https://devplatform.example.com/companies/acme-tech#organization",
    name: "Acme Tech",
    url: "https://acmetech.example.com",
    logo: "https://acmetech.example.com/logo.png",
    description: "Developer tools and cloud infrastructure for engineering teams.",
    foundingDate: "2015-03-10",
    numberOfEmployees: { "@type": "QuantitativeValue", value: 320 },
    sameAs: [
      "https://github.com/acme-tech",
      "https://www.linkedin.com/company/acme-tech",
      "https://twitter.com/acmetech",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Francisco",
      addressRegion: "CA",
      addressCountry: "US",
    },
  }).toObject(),
});

console.log("\n=== Organization Profile Page ===");
console.log(orgProfile.toJsonLd());

// ─── @graph for a profile page ────────────────────────────────────────────
// Full graph that connects: the platform, the profile page, and the person.

const platform = createOrganization({
  "@id": "https://devplatform.example.com/#organization",
  name: "DevPlatform",
  url: "https://devplatform.example.com",
  logo: "https://devplatform.example.com/logo.png",
  description: "A community platform for software developers.",
});

const profilePageWithId = createProfilePage({
  "@id": "https://devplatform.example.com/u/priya-sharma#profilepage",
  name: "Priya Sharma — DevPlatform",
  url: "https://devplatform.example.com/u/priya-sharma",
  description: "Priya Sharma's profile on DevPlatform.",
  datePublished: "2023-01-15",
  dateModified: "2025-04-10",
  inLanguage: "en-US",
  isPartOf: { "@id": "https://devplatform.example.com/#website" },
  mainEntity: {
    "@id": "https://devplatform.example.com/u/priya-sharma#person",
    "@type": "Person",
    name: "Priya Sharma",
  },
});

const personWithId = createPerson({
  "@id": "https://devplatform.example.com/u/priya-sharma#person",
  name: "Priya Sharma",
  url: "https://devplatform.example.com/u/priya-sharma",
  image: "https://devplatform.example.com/avatars/priya-sharma.jpg",
  jobTitle: "Senior Software Engineer",
  sameAs: [
    "https://github.com/priya-sharma",
    "https://www.linkedin.com/in/priya-sharma-dev",
    "https://twitter.com/priyacodes",
  ],
});

const graph = createGraph([platform, profilePageWithId, personWithId]);

console.log("\n=== Profile page @graph ===");
console.log(graph.toScript());
