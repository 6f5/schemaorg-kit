/**
 * dataset.ts — Dataset structured data for Google Dataset Search
 *
 * Demonstrates: basic dataset, dataset with distributions, spatial/temporal
 * coverage, and a data catalog @graph.
 */

import {
  createDataset,
  createOrganization,
  createPerson,
  createGraph,
  PropertyValueSchema,
} from "../src/index";

const publisher = createOrganization({
  name: "Open Climate Data Initiative",
  url: "https://openclimate.example.org",
  logo: "https://openclimate.example.org/logo.png",
});

// ─── Basic Dataset ─────────────────────────────────────────────────────────

const basicDataset = createDataset({
  name: "Global Surface Temperature Anomalies 1880–2024",
  description:
    "Monthly global surface temperature anomalies from 1880 to 2024, expressed as " +
    "deviations from the 1951–1980 average. Source: NASA GISS Surface Temperature Analysis.",
  url: "https://openclimate.example.org/datasets/giss-temp-anomalies",
  license: "https://creativecommons.org/licenses/by/4.0/",
  creator: createPerson({
    name: "Dr. Elena Vasquez",
    url: "https://openclimate.example.org/team/vasquez",
  }).toObject(),
  publisher: publisher.toObject(),
  datePublished: "2024-02-01",
  dateModified: "2025-01-15",
  keywords: [
    "climate change",
    "temperature",
    "global warming",
    "NASA",
    "surface temperature",
  ],
  variableMeasured: "Surface temperature anomaly (°C)",
  measurementTechnique: "Direct measurement from weather stations and ocean buoys",
  temporalCoverage: "1880-01-01/2024-12-31",
  spatialCoverage: {
    "@type": "Place",
    name: "Global",
    geo: {
      "@type": "GeoShape",
      box: "-90 -180 90 180",
    },
  },
});

console.log("=== Basic Dataset ===");
console.log(basicDataset.toScript());

// ─── Dataset with distributions ───────────────────────────────────────────
// Multiple file formats — Google indexes all of them.

const fullDataset = createDataset({
  name: "Urban Air Quality Index — European Cities 2023",
  description:
    "Hourly air quality index (AQI) measurements for 150 European cities throughout 2023. " +
    "Includes PM2.5, PM10, NO₂, O₃, SO₂, and CO readings from official monitoring stations.",
  url: "https://openclimate.example.org/datasets/eu-air-quality-2023",
  identifier: "doi:10.5281/zenodo.1234567",
  license: "https://creativecommons.org/licenses/by-sa/4.0/",
  creator: [
    createOrganization({
      name: "European Environment Agency",
      url: "https://www.eea.europa.eu",
    }).toObject(),
    createPerson({ name: "Marco Bianchi" }).toObject(),
  ],
  publisher: publisher.toObject(),
  datePublished: "2024-03-01",
  keywords: [
    "air quality",
    "AQI",
    "PM2.5",
    "European cities",
    "pollution",
    "2023",
  ],
  variableMeasured: [
    PropertyValueSchema.parse({ name: "PM2.5", unitText: "µg/m³" }),
    PropertyValueSchema.parse({ name: "PM10", unitText: "µg/m³" }),
    PropertyValueSchema.parse({ name: "NO₂", unitText: "µg/m³" }),
    PropertyValueSchema.parse({ name: "O₃", unitText: "µg/m³" }),
  ],
  measurementTechnique: "Automated monitoring stations certified by European standard EN 14907",
  temporalCoverage: "2023-01-01/2023-12-31",
  spatialCoverage: {
    "@type": "Place",
    name: "European Union",
    geo: {
      "@type": "GeoShape",
      box: "34.5 -10.7 71.2 31.8",
    },
  },
  // Downloadable files in multiple formats
  distribution: [
    {
      "@type": "DataDownload",
      encodingFormat: "text/csv",
      contentUrl: "https://openclimate.example.org/datasets/eu-air-quality-2023/data.csv",
      contentSize: "245 MB",
    },
    {
      "@type": "DataDownload",
      encodingFormat: "application/json",
      contentUrl: "https://openclimate.example.org/datasets/eu-air-quality-2023/data.json",
      contentSize: "580 MB",
    },
    {
      "@type": "DataDownload",
      encodingFormat: "application/parquet",
      contentUrl: "https://openclimate.example.org/datasets/eu-air-quality-2023/data.parquet",
      contentSize: "42 MB",
    },
  ],
  inLanguage: "en",
  isAccessibleForFree: true,
  hasPart: [
    {
      "@type": "Dataset",
      name: "PM2.5 Subset",
      description: "Only PM2.5 measurements, smaller file size.",
      distribution: {
        "@type": "DataDownload",
        encodingFormat: "text/csv",
        contentUrl: "https://openclimate.example.org/datasets/eu-air-quality-2023/pm25.csv",
      },
    },
  ],
});

console.log("\n=== Full Dataset with distributions ===");
console.log(fullDataset.toJsonLd());

// ─── Research Dataset @graph ──────────────────────────────────────────────
// Include publisher organization for richer knowledge panel signals.

const researchDataset = createDataset({
  "@id": "https://openclimate.example.org/datasets/sea-level-rise#dataset",
  name: "Global Mean Sea Level Rise 1993–2024 (Satellite Altimetry)",
  description:
    "Global mean sea level rise measurements derived from satellite altimetry data. " +
    "Combines data from TOPEX/Poseidon, Jason-1, Jason-2, Jason-3, and Sentinel-6 missions.",
  url: "https://openclimate.example.org/datasets/sea-level-rise",
  license: "https://creativecommons.org/publicdomain/zero/1.0/",
  creator: createOrganization({
    name: "NASA Physical Oceanography DAAC",
    url: "https://podaac.jpl.nasa.gov",
  }).toObject(),
  publisher: publisher.toObject(),
  datePublished: "2024-06-01",
  keywords: ["sea level", "satellite altimetry", "ocean", "climate", "TOPEX", "Jason"],
  temporalCoverage: "1993-01-01/2024-09-30",
  citation: "Beckley, B. et al. (2024). Global Mean Sea Level Trend from Integrated Multi-Mission Ocean Altimeters. NASA PO.DAAC.",
  isBasedOn: "https://doi.org/10.5067/GMSLM-TJ124",
  distribution: {
    "@type": "DataDownload",
    encodingFormat: "application/x-netcdf",
    contentUrl: "https://openclimate.example.org/datasets/sea-level-rise/gmsl.nc",
    contentSize: "12 MB",
  },
});

const orgWithId = createOrganization({
  "@id": "https://openclimate.example.org/#organization",
  name: "Open Climate Data Initiative",
  url: "https://openclimate.example.org",
  logo: "https://openclimate.example.org/logo.png",
});

const graph = createGraph([orgWithId, researchDataset]);

console.log("\n=== Dataset @graph ===");
console.log(graph.toScript());
