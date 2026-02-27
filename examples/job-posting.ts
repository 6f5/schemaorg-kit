/**
 * job-posting.ts — JobPosting structured data for Google Jobs
 *
 * Demonstrates: required/recommended fields, salary, remote jobs,
 * education and experience requirements, and @graph.
 */

import {
  createJobPosting,
  createOrganization,
  createGraph,
  MonetaryAmountSchema,
  PostalAddressSchema,
} from "../src/index";

const company = createOrganization({
  name: "Acme Technology Inc.",
  url: "https://acme.com",
  logo: "https://acme.com/logo.png",
  sameAs: "https://www.linkedin.com/company/acme-tech",
});

// ─── Full-time on-site role ───────────────────────────────────────────────────

const seniorEngineer = createJobPosting({
  title: "Senior Software Engineer — Backend",
  description: `<p>We're looking for a Senior Software Engineer to join our backend infrastructure team.</p>
<h2>Responsibilities</h2>
<ul>
  <li>Design and build scalable microservices in Go and TypeScript</li>
  <li>Lead code reviews and mentor junior engineers</li>
  <li>Collaborate with product and design on API contracts</li>
</ul>
<h2>Requirements</h2>
<ul>
  <li>5+ years of backend engineering experience</li>
  <li>Proficiency in Go, TypeScript, or Python</li>
  <li>Experience with distributed systems and cloud infrastructure</li>
</ul>`,
  hiringOrganization: {
    "@type": "Organization",
    name: "Acme Technology Inc.",
    sameAs: "https://acme.com",
    logo: "https://acme.com/logo.png",
  },
  jobLocation: {
    "@type": "Place",
    address: PostalAddressSchema.parse({
      streetAddress: "1 Acme Plaza",
      addressLocality: "San Francisco",
      addressRegion: "CA",
      postalCode: "94105",
      addressCountry: "US",
    }),
  },
  datePosted: "2025-06-01",
  validThrough: "2025-08-01T00:00:00Z",
  employmentType: "FULL_TIME",
  baseSalary: MonetaryAmountSchema.parse({
    currency: "USD",
    value: {
      "@type": "QuantitativeValue",
      minValue: 180000,
      maxValue: 240000,
      unitText: "YEAR",
    },
  }),
  experienceRequirements: {
    "@type": "OccupationalExperienceRequirements",
    monthsOfExperience: 60,
  },
  educationRequirements: {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "bachelor degree",
  },
  skills: ["Go", "TypeScript", "Kubernetes", "PostgreSQL", "gRPC"],
  industry: "Software Development",
  occupationalCategory: "15-1252.00",   // O*NET code for Software Developer
  identifier: {
    "@type": "PropertyValue",
    name: "Acme Job ID",
    value: "ENG-2025-042",
  },
  directApply: true,
  url: "https://jobs.acme.com/senior-backend-engineer",
});

console.log("=== Senior Engineer (on-site) ===");
console.log(seniorEngineer.toScript());

// ─── Remote / telecommute role ────────────────────────────────────────────────

const remoteDesigner = createJobPosting({
  title: "Product Designer — Remote",
  description: `<p>Join our design team and shape the future of how millions of users interact with Acme products.</p>
<p>This is a fully remote position open to candidates in the United States and Canada.</p>`,
  hiringOrganization: company.toObject() as any,
  jobLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
  },
  jobLocationType: "TELECOMMUTE",
  applicantLocationRequirements: [
    { "@type": "Country", name: "US" },
    { "@type": "Country", name: "CA" },
  ],
  datePosted: "2025-06-10",
  validThrough: "2025-09-01T00:00:00Z",
  employmentType: "FULL_TIME",
  baseSalary: MonetaryAmountSchema.parse({
    currency: "USD",
    value: {
      "@type": "QuantitativeValue",
      minValue: 120000,
      maxValue: 160000,
      unitText: "YEAR",
    },
  }),
  skills: ["Figma", "Design Systems", "User Research", "Prototyping"],
  directApply: true,
  url: "https://jobs.acme.com/product-designer-remote",
  identifier: {
    "@type": "PropertyValue",
    name: "Acme Job ID",
    value: "DES-2025-018",
  },
});

console.log("\n=== Product Designer (remote) ===");
console.log(remoteDesigner.toJsonLd());

// ─── Part-time / contractor role ──────────────────────────────────────────────

const partTimeMarketer = createJobPosting({
  title: "Social Media Coordinator",
  description: "<p>Help grow our brand presence across social platforms. Flexible hours, 20 hrs/week.</p>",
  hiringOrganization: {
    "@type": "Organization",
    name: "Acme Technology Inc.",
    sameAs: "https://acme.com",
  },
  jobLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Francisco",
      addressRegion: "CA",
      addressCountry: "US",
    },
  },
  datePosted: "2025-07-01",
  employmentType: ["PART_TIME", "CONTRACTOR"],
  baseSalary: MonetaryAmountSchema.parse({
    currency: "USD",
    value: {
      "@type": "QuantitativeValue",
      minValue: 25,
      maxValue: 35,
      unitText: "HOUR",
    },
  }),
  workHours: "20 hours per week, flexible schedule",
  skills: ["Social Media", "Content Creation", "Analytics"],
  url: "https://jobs.acme.com/social-coordinator",
});

console.log("\n=== Part-time Contractor ===");
console.log(partTimeMarketer.toJsonLd());

// ─── @graph for a jobs page ───────────────────────────────────────────────────

const graph = createGraph([company, seniorEngineer, remoteDesigner]);

console.log("\n=== Jobs page @graph ===");
console.log(graph.toScript());
