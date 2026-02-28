import { z } from "zod";
import { makeFactory } from "../../core/base";
import { ImageOrUrl } from "../shared/ImageObject";

// Loose passthrough ref used for self-referential fields.
// Avoids the "implicitly has type 'any'" TS error from circular z.lazy() references.
const AnyThingRef = z.lazy(() =>
  z.object({ "@type": z.string() }).catchall(z.unknown()),
);

/**
 * schema.org/Thing
 * The most generic type - all other types extend this.
 */
export const ThingSchema = z.object({
  "@type": z.string(),

  // JSON-LD node identifier — useful for @graph cross-references
  "@id": z.string().optional(),

  // Core identity
  name: z.string().optional(),
  description: z.string().optional(),
  url: z.url().optional(),
  identifier: z.union([z.string(), z.number()]).optional(),

  // Media — single image or array (Google recommends multiple aspect ratios)
  image: z.union([ImageOrUrl, z.array(ImageOrUrl)]).optional(),

  // Discovery
  sameAs: z.union([z.url(), z.array(z.url())]).optional(),
  alternateName: z.string().optional(),

  // Relationships (loose refs to avoid circular type inference)
  // All accept { "@id": "..." } for @graph cross-referencing
  subjectOf: z.union([z.object({ "@id": z.string() }), AnyThingRef]).optional(),
  mainEntityOfPage: z.union([z.url(), z.object({ "@id": z.string() }), AnyThingRef]).optional(),
});

export type Thing = z.infer<typeof ThingSchema>;

/**
 * Helper to extend Thing with additional fields.
 * Used internally by subtypes.
 *
 * @example
 * const PersonSchema = extendThing('Person', { jobTitle: z.string().optional() })
 */
export function extendThing<TType extends string, T extends z.ZodRawShape>(
  type: TType,
  shape: T,
) {
  return ThingSchema.extend({
    "@type": z.literal(type).default(type),
    ...shape,
  });
}
