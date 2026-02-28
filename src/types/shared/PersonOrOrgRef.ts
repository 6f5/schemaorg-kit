import { z } from "zod";

/**
 * Reusable union for a Person or Organization reference.
 * Accepts a plain name string, a Person ref, or an Organization ref.
 * Used throughout: Article.author, Review.author, Event.organizer, etc.
 */
export const PersonOrOrgRef = z.union([
  z.string(),
  // @id-only reference for @graph cross-referencing (e.g. { "@id": "https://example.com/#organization" })
  z.object({ "@id": z.string() }),
  // Accept any Person or Organization object — including full schema outputs via .toObject().
  // .catchall() allows extra fields; name/url are optional to match ThingSchema's base types.
  z.object({ "@type": z.literal("Person") }).catchall(z.unknown()),
  z.object({ "@type": z.literal("Organization") }).catchall(z.unknown()),
]);

export type PersonOrOrgRefType = z.infer<typeof PersonOrOrgRef>;
