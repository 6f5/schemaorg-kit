import { z } from "zod";
import { makeFactory } from "../../core/base";
import { CreativeWorkSchema } from "./CreativeWork";
import { PersonOrOrgRef } from "../shared/PersonOrOrgRef";

/**
 * schema.org/PropertyValue
 * Used as dataset identifiers (DOI, SPDX, etc.)
 */
export const PropertyValueSchema = z.object({
  "@type": z.literal("PropertyValue").default("PropertyValue"),
  propertyID: z.string().optional(),             // e.g. "DOI", "SPDX"
  name: z.string().optional(),
  value: z.union([z.string(), z.number()]),
  url: z.url().optional(),
  description: z.string().optional(),
});

/**
 * schema.org/Dataset
 * Google required: name, description
 * Google recommended: url, sameAs, identifier, keywords, license, creator, distribution
 */
export const DatasetSchema = CreativeWorkSchema.extend({
  "@type": z.literal("Dataset").default("Dataset"),
  // Required by Google:
  name: z.string(),
  description: z.string(),
  // Recommended by Google:
  url: z.url().optional(),
  sameAs: z.union([z.url(), z.array(z.url())]).optional(),
  identifier: z.union([
    z.string(),
    PropertyValueSchema,
    z.array(z.union([z.string(), PropertyValueSchema])),
  ]).optional(),
  keywords: z.union([z.string(), z.array(z.string())]).optional(),
  license: z.url().optional(),
  isAccessibleForFree: z.boolean().optional(),
  creator: z.union([PersonOrOrgRef, z.array(PersonOrOrgRef)]).optional(),
  citation: z.union([z.string(), z.array(z.string())]).optional(),
  variableMeasured: z.union([z.string(), z.array(z.string())]).optional(),
  measurementTechnique: z.union([z.string(), z.array(z.string())]).optional(),
  temporalCoverage: z.string().optional(),       // ISO 8601 or date range string
  spatialCoverage: z.union([
    z.string(),
    z.object({ "@type": z.literal("Place"), name: z.string() }),
  ]).optional(),
  distribution: z.array(z.object({
    "@type": z.literal("DataDownload").default("DataDownload"),
    encodingFormat: z.string(),                  // MIME type or format name
    contentUrl: z.url(),
    name: z.string().optional(),
    description: z.string().optional(),
  })).optional(),
  includedInDataCatalog: z.object({
    "@type": z.literal("DataCatalog").default("DataCatalog"),
    name: z.string(),
    url: z.url().optional(),
  }).optional(),
  datePublished: z.string().optional(),          // ISO 8601
  dateModified: z.string().optional(),
  version: z.union([z.string(), z.number()]).optional(),
  funder: z.union([PersonOrOrgRef, z.array(PersonOrOrgRef)]).optional(),
});

export type PropertyValue = z.infer<typeof PropertyValueSchema>;
export type Dataset = z.infer<typeof DatasetSchema>;

export const createDataset = makeFactory(DatasetSchema);
