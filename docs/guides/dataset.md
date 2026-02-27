---
title: Dataset
parent: Guides
nav_order: 11
---

# Dataset Rich Results
{: .no_toc }

`Dataset` structured data makes your data discoverable in [Google Dataset Search](https://datasetsearch.research.google.com/) — a dedicated search engine for researchers, journalists, and data scientists.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Required Fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string` | Dataset name |
| `description` | `string` | What the dataset contains |

## Recommended Fields

| Field | Type | Notes |
|-------|------|-------|
| `url` | `string` | Landing page URL |
| `sameAs` | `string \| string[]` | DOI, repository URL |
| `license` | `string` | License URL |
| `creator` | `Person \| Organization` | Who created it |
| `publisher` | `Organization` | Who published it |
| `datePublished` | `string` | When first published |
| `dateModified` | `string` | Last update date |
| `version` | `string` | Dataset version |
| `keywords` | `string[]` | Descriptive keywords |
| `distribution` | `DataDownload[]` | Where to get the data |
| `variableMeasured` | `string \| PropertyValue[]` | What variables are included |
| `spatialCoverage` | `string \| Place` | Geographic scope |
| `temporalCoverage` | `string` | Time period covered |
| `measurementTechnique` | `string` | How data was collected |
| `includedInDataCatalog` | `DataCatalog` | Parent catalog |

---

## Basic Dataset

```ts
import { createDataset } from 'schemaorg-kit';

const dataset = createDataset({
  name: 'Global Carbon Emissions by Country 1990–2024',
  description: 'Annual CO₂ and greenhouse gas emissions data for 195 countries from 1990 to 2024. Includes total emissions, per-capita figures, and sector breakdowns.',
  url: 'https://climate-data.org/datasets/carbon-emissions',
  license: 'https://creativecommons.org/licenses/by/4.0/',
  creator: {
    '@type': 'Organization',
    name: 'Climate Research Institute',
    url: 'https://climate-data.org',
  },
  datePublished: '2025-01-15',
  dateModified: '2025-03-01',
  version: '4.2',
  keywords: ['climate', 'CO2', 'emissions', 'greenhouse gas', 'carbon footprint'],
  temporalCoverage: '1990/2024',
  spatialCoverage: {
    '@type': 'Place',
    name: 'Global',
  },
  distribution: [
    {
      '@type': 'DataDownload',
      encodingFormat: 'text/csv',
      contentUrl: 'https://climate-data.org/datasets/carbon-emissions.csv',
    },
    {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: 'https://climate-data.org/datasets/carbon-emissions.json',
    },
    {
      '@type': 'DataDownload',
      encodingFormat: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      contentUrl: 'https://climate-data.org/datasets/carbon-emissions.xlsx',
    },
  ],
  variableMeasured: [
    { '@type': 'PropertyValue', name: 'total_emissions_mt', description: 'Total annual emissions in megatons CO₂e' },
    { '@type': 'PropertyValue', name: 'per_capita_tons',    description: 'Per capita emissions in metric tons CO₂' },
    { '@type': 'PropertyValue', name: 'sector',             description: 'Emission source sector (energy, transport, industry, etc.)' },
  ],
  measurementTechnique: 'Satellite observation combined with national inventory reports (UNFCCC submission data)',
  sameAs: 'https://doi.org/10.5281/zenodo.1234567',
});
```

---

## Research Dataset with DataCatalog

```ts
import { createDataset } from 'schemaorg-kit';

const dataset = createDataset({
  name: 'ImageNet-1M — Cleaned Subset',
  description: 'A curated 1-million image subset of ImageNet with corrected labels and balanced class distribution.',
  creator: { '@type': 'Organization', name: 'ML Research Lab', url: 'https://mllab.edu' },
  datePublished: '2024-09-01',
  license: 'https://creativecommons.org/licenses/by-nc/4.0/',
  distribution: [
    {
      '@type': 'DataDownload',
      encodingFormat: 'application/zip',
      contentUrl: 'https://mllab.edu/datasets/imagenet-1m-clean.zip',
      contentSize: '45GB',
    },
  ],
  includedInDataCatalog: {
    '@type': 'DataCatalog',
    name: 'ML Research Lab Open Datasets',
    url: 'https://mllab.edu/datasets',
  },
  sameAs: 'https://paperswithcode.com/dataset/imagenet-1m-clean',
});
```

---

## Common Mistakes

{: .tip }
> Always include at least one `distribution` entry with `contentUrl` and `encodingFormat`. This is what allows Dataset Search to link directly to downloadable data.

{: .tip }
> Use `sameAs` to link to the DOI (Digital Object Identifier) if your dataset has one — this is how academic search engines identify your dataset.

{: .tip }
> `temporalCoverage` uses ISO 8601 interval notation: `"1990/2024"` means 1990 through 2024. For an ongoing dataset: `"2020/.."`
