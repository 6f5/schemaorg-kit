import { z } from "zod";
import { DefinedRegionSchema } from "./ShippingDetails";
import { DayOfWeek } from "./OpeningHoursSpecification";
import { MonetaryAmountSchema } from "./MonetaryAmount";

// ─── ServicePeriod ───────────────────────────────────────────────────────────
// Business days + cutoff time for processing orders at org level

export const ServicePeriodSchema = z.object({
  "@type": z.literal("ServicePeriod").default("ServicePeriod"),
  businessDays: z
    .object({
      "@type": z
        .literal("OpeningHoursSpecification")
        .default("OpeningHoursSpecification"),
      dayOfWeek: z.union([DayOfWeek, z.array(DayOfWeek)]),
    })
    .optional(),
  /** Order cutoff time (ISO 8601), e.g. "14:00:00-05:00" */
  cutoffTime: z.string().optional(),
  /** ISO 8601 duration, e.g. "P3D" for 3 days */
  duration: z.string().optional(),
});

export type ServicePeriod = z.infer<typeof ServicePeriodSchema>;

// ─── ShippingConditions ──────────────────────────────────────────────────────

export const ShippingConditionsSchema = z.object({
  "@type": z.literal("ShippingConditions").default("ShippingConditions"),
  /** Shipping cost */
  shippingRate: MonetaryAmountSchema.optional(),
  /** Region(s) this condition applies to */
  shippingDestination: z
    .union([DefinedRegionSchema, z.array(DefinedRegionSchema)])
    .optional(),
  /** Region(s) shipment originates from */
  shippingOrigin: z
    .union([DefinedRegionSchema, z.array(DefinedRegionSchema)])
    .optional(),
  /** Delivery time details */
  deliveryTime: z
    .object({
      "@type": z
        .literal("ShippingDeliveryTime")
        .default("ShippingDeliveryTime"),
      handlingTime: z
        .object({
          "@type": z.literal("QuantitativeValue").default("QuantitativeValue"),
          minValue: z.number().int().nonnegative().optional(),
          maxValue: z.number().int().nonnegative().optional(),
          unitCode: z.string().default("DAY"),
        })
        .optional(),
      transitTime: z
        .object({
          "@type": z.literal("QuantitativeValue").default("QuantitativeValue"),
          minValue: z.number().int().nonnegative().optional(),
          maxValue: z.number().int().nonnegative().optional(),
          unitCode: z.string().default("DAY"),
        })
        .optional(),
    })
    .optional(),
  /** Set to true to indicate item cannot be shipped to destination */
  doesNotShip: z.boolean().optional(),
  /** Minimum order value for this condition */
  orderValue: MonetaryAmountSchema.optional(),
  /** Number of items constraint */
  numItems: z
    .object({
      "@type": z.literal("QuantitativeValue").default("QuantitativeValue"),
      minValue: z.number().optional(),
      maxValue: z.number().optional(),
    })
    .optional(),
  /** Weight constraint */
  weight: z
    .object({
      "@type": z.literal("QuantitativeValue").default("QuantitativeValue"),
      value: z.number().optional(),
      maxValue: z.number().optional(),
      unitCode: z.string().optional(),
    })
    .optional(),
});

export type ShippingConditions = z.infer<typeof ShippingConditionsSchema>;

// ─── ShippingService ─────────────────────────────────────────────────────────

export const ShippingServiceSchema = z.object({
  "@type": z.literal("ShippingService").default("ShippingService"),
  name: z.string().optional(),
  description: z.string().optional(),
  shippingConditions: z
    .union([ShippingConditionsSchema, z.array(ShippingConditionsSchema)])
    .optional(),
  handlingTime: ServicePeriodSchema.optional(),
  /** "Delivery" | "Pickup" | "DigitalDelivery" */
  fulfillmentType: z.string().optional(),
  /** Member tier this service is valid for */
  validForMemberTier: z
    .union([z.string(), z.object({}).catchall(z.unknown())])
    .optional(),
});

export type ShippingService = z.infer<typeof ShippingServiceSchema>;
