import { z } from "zod";
import { PersonOrOrgRef } from "./PersonOrOrgRef";
import { makeFactory } from "../../core/base";

/**
 * schema.org/ImageObject
 * Full image metadata for Google's image rich results.
 * Includes all fields required/recommended by Google's image metadata documentation.
 */
export const ImageObjectSchema = z.object({
  "@type": z.literal("ImageObject").default("ImageObject"),
  url: z.string().url(),
  contentUrl: z.string().url().optional(),
  width: z.union([
    z.number(),
    z.object({ "@type": z.literal("QuantitativeValue").default("QuantitativeValue"), value: z.number(), unitCode: z.string().optional() }),
  ]).optional(),
  height: z.union([
    z.number(),
    z.object({ "@type": z.literal("QuantitativeValue").default("QuantitativeValue"), value: z.number(), unitCode: z.string().optional() }),
  ]).optional(),
  caption: z.string().optional(),
  description: z.string().optional(),
  name: z.string().optional(),
  // Google image metadata requirements:
  creator: PersonOrOrgRef.optional(),
  creditText: z.string().optional(),
  copyrightNotice: z.string().optional(),
  license: z.string().url().optional(),
  acquireLicensePage: z.string().url().optional(),
  representativeOfPage: z.boolean().optional(),
  encodingFormat: z.string().optional(),       // MIME type, e.g. "image/jpeg"
  uploadDate: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
  embedUrl: z.string().url().optional(),
});

/**
 * Convenience union: accepts either a URL string or a full ImageObject.
 * Used throughout: Thing.image, Organization.logo, etc.
 */
export const ImageOrUrl = z.union([z.string().url(), ImageObjectSchema]);

export type ImageObject = z.infer<typeof ImageObjectSchema>;

export const createImageObject = makeFactory(ImageObjectSchema);
