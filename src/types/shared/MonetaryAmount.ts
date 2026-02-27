import { z } from "zod";

/**
 * schema.org/MonetaryAmount
 * Used by JobPosting.baseSalary, VacationRental pricing, etc.
 */
export const MonetaryAmountSchema = z.object({
  "@type": z.literal("MonetaryAmount").default("MonetaryAmount"),
  currency: z.string().length(3),              // ISO 4217, e.g. "USD"
  value: z.union([
    z.number(),
    z.object({
      "@type": z.literal("QuantitativeValue").default("QuantitativeValue"),
      value: z.number().optional(),
      minValue: z.number().optional(),
      maxValue: z.number().optional(),
      unitText: z.string().optional(),         // e.g. "HOUR", "MONTH", "YEAR"
    }),
  ]).optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
});

/**
 * schema.org/PriceSpecification
 * More detailed price specification with validity dates.
 */
export const PriceSpecificationSchema = z.object({
  "@type": z.literal("PriceSpecification").default("PriceSpecification"),
  price: z.union([z.number(), z.string()]),
  priceCurrency: z.string().length(3),         // ISO 4217
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  validFrom: z.string().optional(),            // ISO 8601
  validThrough: z.string().optional(),
  eligibleQuantity: z.object({
    "@type": z.literal("QuantitativeValue").default("QuantitativeValue"),
    value: z.number().optional(),
    minValue: z.number().optional(),
    maxValue: z.number().optional(),
  }).optional(),
});

export type MonetaryAmount = z.infer<typeof MonetaryAmountSchema>;
export type PriceSpecification = z.infer<typeof PriceSpecificationSchema>;
