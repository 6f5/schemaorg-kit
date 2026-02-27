---
title: Job Posting
parent: Guides
nav_order: 7
---

# Job Posting Rich Results
{: .no_toc }

Job Posting structured data surfaces your openings in Google's dedicated job search interface — with salary, location, job type, and a direct "Apply" button.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Required Fields

| Field | Type | Notes |
|-------|------|-------|
| `title` | `string` | Job title |
| `description` | `string` | Full job description (HTML allowed) |
| `datePosted` | `string` | ISO 8601 date |
| `hiringOrganization` | `Organization` | Employer entity with `name` and `sameAs` |
| `jobLocation` | `Place` | Physical work location |

## Recommended Fields

| Field | Type | Notes |
|-------|------|-------|
| `validThrough` | `string` | Application deadline |
| `employmentType` | `string \| string[]` | FULL_TIME, PART_TIME, etc. |
| `baseSalary` | `MonetaryAmount` | Salary range or fixed amount |
| `applicantLocationRequirements` | `AdministrativeArea` | For remote — country/region |
| `jobLocationType` | `string` | `"TELECOMMUTE"` for remote |
| `qualifications` | `string` | Required qualifications |
| `skills` | `string` | Required skills |
| `experienceRequirements` | `string` | Years of experience |
| `educationRequirements` | `string` | Degree requirements |
| `responsibilities` | `string` | Key job responsibilities |
| `industry` | `string` | Industry sector |
| `identifier` | `PropertyValue` | Internal job ID |

---

## Full Example

```ts
import { createJobPosting } from 'schemaorg-kit';

const job = createJobPosting({
  title: 'Senior TypeScript Engineer',
  description: `
    <p>We're looking for a seasoned TypeScript engineer to join our platform team.</p>
    <h3>Responsibilities</h3>
    <ul>
      <li>Design and build scalable Node.js microservices</li>
      <li>Own the developer experience for our public API</li>
      <li>Mentor junior engineers</li>
    </ul>
    <h3>Requirements</h3>
    <ul>
      <li>5+ years of TypeScript experience</li>
      <li>Experience with React and Node.js</li>
      <li>Strong understanding of distributed systems</li>
    </ul>
  `,
  datePosted: '2025-04-01',
  validThrough: '2025-06-30T23:59:59Z',
  employmentType: ['FULL_TIME'],
  hiringOrganization: {
    '@type': 'Organization',
    name: 'Acme Technologies',
    sameAs: 'https://acme.tech',
    logo: 'https://acme.tech/logo.png',
  },
  jobLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '500 Market Street',
      addressLocality: 'San Francisco',
      addressRegion: 'CA',
      postalCode: '94105',
      addressCountry: 'US',
    },
  },
  baseSalary: {
    '@type': 'MonetaryAmount',
    currency: 'USD',
    value: {
      '@type': 'QuantitativeValue',
      minValue: 160000,
      maxValue: 220000,
      unitText: 'YEAR',
    },
  },
  qualifications: 'Bachelor\'s degree in Computer Science or equivalent experience',
  skills: 'TypeScript, Node.js, React, PostgreSQL, AWS',
  experienceRequirements: 'Minimum 5 years of professional software development',
  industry: 'Technology',
  identifier: {
    '@type': 'PropertyValue',
    name: 'Acme Job ID',
    value: 'JOB-2025-042',
  },
});
```

---

## Remote Job

```ts
import { createJobPosting } from 'schemaorg-kit';

const remoteJob = createJobPosting({
  title: 'Product Designer',
  description: 'Design beautiful, accessible interfaces for millions of users...',
  datePosted: '2025-05-01',
  employmentType: 'FULL_TIME',
  hiringOrganization: {
    '@type': 'Organization',
    name: 'Remote Co',
    sameAs: 'https://remoteco.example',
  },
  // For fully remote: use TELECOMMUTE + applicantLocationRequirements
  jobLocationType: 'TELECOMMUTE',
  jobLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',   // Country of the org's HQ
    },
  },
  applicantLocationRequirements: {
    '@type': 'Country',
    name: 'United States',
  },
  baseSalary: {
    '@type': 'MonetaryAmount',
    currency: 'USD',
    value: {
      '@type': 'QuantitativeValue',
      minValue: 90000,
      maxValue: 130000,
      unitText: 'YEAR',
    },
  },
});
```

---

## Employment Types

| Value | Description |
|-------|-------------|
| `"FULL_TIME"` | Full-time position |
| `"PART_TIME"` | Part-time position |
| `"CONTRACTOR"` | Independent contractor |
| `"TEMPORARY"` | Temporary / seasonal |
| `"INTERN"` | Internship |
| `"VOLUNTEER"` | Volunteer position |
| `"PER_DIEM"` | Per diem / on-call |
| `"OTHER"` | Other employment type |

Pass a single string or an array for multiple types:
```ts
employmentType: ['FULL_TIME', 'CONTRACTOR']
```

---

## Salary Units

| `unitText` | Meaning |
|-----------|---------|
| `"HOUR"` | Hourly rate |
| `"DAY"` | Daily rate |
| `"WEEK"` | Weekly rate |
| `"MONTH"` | Monthly salary |
| `"YEAR"` | Annual salary |

---

## Common Mistakes

{: .warning }
> **Don't omit `validThrough`** if the job has a deadline. Expired jobs without a close date may stay in Google for Search for too long.

{: .warning }
> **`hiringOrganization` must have a `name`.** Google requires at minimum the organization's name.

{: .tip }
> Including `baseSalary` significantly improves click-through rate. Salary transparency is one of the most-requested features by job seekers.

{: .tip }
> Use HTML in `description` — Google renders basic HTML tags in the job details panel.
