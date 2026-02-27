import { z } from "zod";

/**
 * schema.org/PostalAddress
 * Shared postal address used by Person, Organization, LocalBusiness, JobPosting, etc.
 */
export const PostalAddressSchema = z.object({
  "@type": z.literal("PostalAddress").default("PostalAddress"),
  streetAddress: z.string().optional(),
  addressLocality: z.string().optional(),   // city
  addressRegion: z.string().optional(),     // state/province
  postalCode: z.string().optional(),
  addressCountry: z.string().optional(),    // ISO 3166-1 alpha-2, e.g. "US"
  postOfficeBoxNumber: z.string().optional(),
});

export type PostalAddress = z.infer<typeof PostalAddressSchema>;
