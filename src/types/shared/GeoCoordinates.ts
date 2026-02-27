import { z } from "zod";

/**
 * schema.org/GeoCoordinates
 * Latitude/longitude for Place, LocalBusiness, etc.
 * Google recommends at least 5 decimal places for precision.
 */
export const GeoCoordinatesSchema = z.object({
  "@type": z.literal("GeoCoordinates").default("GeoCoordinates"),
  latitude: z.union([z.number(), z.string()]),
  longitude: z.union([z.number(), z.string()]),
  elevation: z.union([z.number(), z.string()]).optional(),
});

export type GeoCoordinates = z.infer<typeof GeoCoordinatesSchema>;
