import { z } from "zod";
import { makeFactory } from "../../core/base";
import { OfferShippingDetailsSchema } from "./ShippingDetails";

/**
 * Item availability enum.
 * Values are transformed to full schema.org URLs on output.
 */
export const ItemAvailability = z.enum([
  "InStock",
  "OutOfStock",
  "PreOrder",
  "Discontinued",
  "LimitedAvailability",
  "SoldOut",
  "OnlineOnly",
  "InStoreOnly",
  "BackOrder",
]).transform((v) => `https://schema.org/${v}`);

/**
 * schema.org/Offer
 * Used by Product, Event (ticketing), Course, SoftwareApplication, etc.
 */
export const OfferSchema = z.object({
  "@type": z.literal("Offer").default("Offer"),
  price: z.union([z.number(), z.string()]),
  priceCurrency: z.string().length(3),           // ISO 4217, e.g. "USD"
  availability: ItemAvailability.optional(),
  validFrom: z.string().optional(),              // ISO 8601
  validThrough: z.string().optional(),           // ISO 8601
  url: z.url().optional(),
  seller: z.object({ "@type": z.string(), name: z.string() }).optional(),
  category: z.string().optional(),
  inventoryLevel: z.object({
    "@type": z.literal("QuantitativeValue").default("QuantitativeValue"),
    value: z.number(),
  }).optional(),
  priceValidUntil: z.string().optional(),        // ISO 8601 date — Google Product requirement
  shippingDetails: z.union([
    OfferShippingDetailsSchema,
    z.array(OfferShippingDetailsSchema),
  ]).optional(),
  hasMerchantReturnPolicy: z.lazy(() =>
    z.object({ "@type": z.string() }).catchall(z.unknown())
  ).optional(),
});

/**
 * schema.org/MerchantReturnPolicy
 * Used by Product and Organization for Google Merchant Center.
 */
export const MerchantReturnPolicySchema = z.object({
  "@type": z.literal("MerchantReturnPolicy").default("MerchantReturnPolicy"),
  applicableCountry: z.union([z.string(), z.array(z.string())]).optional(),
  returnPolicyCategory: z.string().optional(),    // schema.org enum URL
  merchantReturnDays: z.number().int().nonnegative().optional(),
  returnMethod: z.string().optional(),            // schema.org enum URL
  returnFees: z.string().optional(),              // schema.org enum URL
  refundType: z.string().optional(),              // schema.org enum URL
});

export type Offer = z.infer<typeof OfferSchema>;
export type MerchantReturnPolicy = z.infer<typeof MerchantReturnPolicySchema>;

export const createOffer = makeFactory(OfferSchema);

/**
 * schema.org/AggregateOffer
 * Used when a product has multiple sellers or a price range.
 * Google uses this to display "from $X" or "$X–$Y" in Product rich results.
 */
export const AggregateOfferSchema = z.object({
  "@type": z.literal("AggregateOffer").default("AggregateOffer"),
  lowPrice: z.number().optional(),
  highPrice: z.number().optional(),
  priceCurrency: z.string().length(3).optional(),   // ISO 4217
  offerCount: z.number().int().nonnegative().optional(),
  offers: z.union([OfferSchema, z.array(OfferSchema)]).optional(),
  availability: ItemAvailability.optional(),
  url: z.url().optional(),
});

export type AggregateOffer = z.infer<typeof AggregateOfferSchema>;
