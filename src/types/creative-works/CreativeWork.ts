import { z } from "zod";
import { extendThing } from "../things/Thing";
import { PersonOrOrgRef } from "../shared/PersonOrOrgRef";
import { ImageOrUrl } from "../shared/ImageObject";

/**
 * schema.org/CreativeWork
 * Base type for all creative works: Article, Recipe, Course, Dataset, etc.
 */
export const CreativeWorkSchema = extendThing("CreativeWork", {
  author: PersonOrOrgRef.optional(),
  publisher: PersonOrOrgRef.optional(),
  datePublished: z.string().optional(),          // ISO 8601
  dateModified: z.string().optional(),           // ISO 8601
  headline: z.string().max(110).optional(),      // Google recommends max 110 chars
  keywords: z.union([z.string(), z.array(z.string())]).optional(),
  inLanguage: z.union([
    z.string(),                                  // BCP 47, e.g. "en-US"
    z.object({ "@type": z.literal("Language").default("Language"), name: z.string() }),
  ]).optional(),
  license: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  isAccessibleForFree: z.boolean().optional(),
  image: z.union([ImageOrUrl, z.array(ImageOrUrl)]).optional(),
  // Paywalled content support:
  hasPart: z.array(z.object({
    "@type": z.string(),
    isAccessibleForFree: z.boolean().optional(),
    cssSelector: z.string().optional(),
  })).optional(),
  // For subscription / paywalled content
  isPartOf: z.object({
    "@type": z.string(),
    name: z.string().optional(),
  }).optional(),
  text: z.string().optional(),
  abstract: z.string().optional(),
  encodingFormat: z.string().optional(),         // MIME type
  contentUrl: z.string().url().optional(),
  copyrightYear: z.number().int().optional(),
  copyrightHolder: PersonOrOrgRef.optional(),
});

export type CreativeWork = z.infer<typeof CreativeWorkSchema>;
