import { z } from 'zod';
import { DayOfWeek } from './OpeningHoursSpecification';

// ─── DefinedRegion ──────────────────────────────────────────────────────────

export const DefinedRegionSchema = z.object({
  '@type': z.literal('DefinedRegion').default('DefinedRegion'),
  name: z.string().optional(),
  /** ISO 3166-1 alpha-2 country code, e.g. "US", "GB" */
  addressCountry: z.string().optional(),
  /** State/province code(s) */
  addressRegion: z.union([z.string(), z.array(z.string())]).optional(),
  /** Postal code prefix(es) */
  postalCodePrefix: z.union([z.string(), z.array(z.string())]).optional(),
  /** Postal code range */
  postalCodeRange: z.object({
    postalCodeBegin: z.string(),
    postalCodeEnd: z.string(),
  }).optional(),
});

export type DefinedRegion = z.infer<typeof DefinedRegionSchema>;

// ─── ShippingDeliveryTime ────────────────────────────────────────────────────

const QuantitativeDaysSchema = z.object({
  '@type': z.literal('QuantitativeValue').default('QuantitativeValue'),
  minValue: z.number().int().nonnegative().optional(),
  maxValue: z.number().int().nonnegative().optional(),
  /** Unit code — always "DAY" for delivery times */
  unitCode: z.string().default('DAY'),
});

export const ShippingDeliveryTimeSchema = z.object({
  '@type': z.literal('ShippingDeliveryTime').default('ShippingDeliveryTime'),
  /** Days the warehouse processes orders (e.g. Mon–Fri) */
  businessDays: z.object({
    '@type': z.literal('OpeningHoursSpecification').default('OpeningHoursSpecification'),
    dayOfWeek: z.union([DayOfWeek, z.array(DayOfWeek)]),
  }).optional(),
  /** Order processing/packing time in days */
  handlingTime: QuantitativeDaysSchema.optional(),
  /** Transit time in days after dispatch */
  transitTime: QuantitativeDaysSchema.optional(),
  /** Cutoff time for same-day processing, ISO 8601 time, e.g. "14:00:00" */
  cutoffTime: z.string().optional(),
});

export type ShippingDeliveryTime = z.infer<typeof ShippingDeliveryTimeSchema>;

// ─── OfferShippingDetails ────────────────────────────────────────────────────

export const OfferShippingDetailsSchema = z.object({
  '@type': z.literal('OfferShippingDetails').default('OfferShippingDetails'),
  /** Shipping cost as a MonetaryAmount (use value: 0 for free shipping) */
  shippingRate: z.object({
    '@type': z.literal('MonetaryAmount').default('MonetaryAmount'),
    value: z.number(),
    currency: z.string(),
  }).optional(),
  /** Region(s) this shipping option applies to */
  shippingDestination: z.union([
    DefinedRegionSchema,
    z.array(DefinedRegionSchema),
  ]).optional(),
  /** Expected delivery time */
  deliveryTime: ShippingDeliveryTimeSchema.optional(),
  /** Set to true to indicate item cannot be shipped to a destination */
  doesNotShip: z.boolean().optional(),
  /** Human-readable shipping label, e.g. "Free Shipping", "Express Delivery" */
  shippingLabel: z.string().optional(),
});

export type OfferShippingDetails = z.infer<typeof OfferShippingDetailsSchema>;
