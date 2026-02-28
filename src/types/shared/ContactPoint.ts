import { z } from "zod";

/**
 * schema.org/ContactPoint
 * Shared contact information used by Organization, LocalBusiness, etc.
 */
export const ContactPointSchema = z.object({
  "@type": z.literal("ContactPoint").default("ContactPoint"),
  "@id": z.string().optional(),
  telephone: z.string().optional(),
  contactType: z.string().optional(),                    // e.g. "customer support", "sales"
  email: z.string().email().optional(),
  areaServed: z.union([z.string(), z.array(z.string())]).optional(),
  availableLanguage: z.union([z.string(), z.array(z.string())]).optional(),
  hoursAvailable: z.string().optional(),
  contactOption: z.string().optional(),                  // e.g. "TollFree", "HearingImpairedSupported"
});

export type ContactPoint = z.infer<typeof ContactPointSchema>;
