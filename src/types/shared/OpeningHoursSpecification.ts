import { z } from "zod";

export const DayOfWeek = z.enum([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);

/**
 * schema.org/OpeningHoursSpecification
 * Used by LocalBusiness, Place, etc.
 * `opens` and `closes` are in "HH:MM:SS" format.
 */
export const OpeningHoursSpecificationSchema = z.object({
  "@type": z.literal("OpeningHoursSpecification").default("OpeningHoursSpecification"),
  dayOfWeek: z.union([DayOfWeek, z.array(DayOfWeek)]),
  opens: z.string().optional(),        // "HH:MM:SS" e.g. "09:00:00"
  closes: z.string().optional(),       // "HH:MM:SS" e.g. "17:00:00"
  validFrom: z.string().optional(),    // ISO 8601 date — for seasonal hours
  validThrough: z.string().optional(), // ISO 8601 date
});

export type OpeningHoursSpecification = z.infer<typeof OpeningHoursSpecificationSchema>;
