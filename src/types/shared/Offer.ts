import { z } from "zod";
import { makeFactory } from "../../core/base";
import { OfferShippingDetailsSchema } from "./ShippingDetails";
import { MonetaryAmountSchema } from "./MonetaryAmount";

/**
 * Item availability enum.
 * Values are transformed to full schema.org URLs on output.
 */
export const ItemAvailability = z
  .enum([
    "InStock",
    "OutOfStock",
    "PreOrder",
    "Discontinued",
    "LimitedAvailability",
    "SoldOut",
    "OnlineOnly",
    "InStoreOnly",
    "BackOrder",
  ])
  .transform((v) => `https://schema.org/${v}`);

/**
 * Item condition enum.
 * Values are transformed to full schema.org URLs on output.
 */
export const ItemCondition = z
  .enum([
    "NewCondition",
    "UsedCondition",
    "RefurbishedCondition",
    "DamagedCondition",
  ])
  .transform((v) => `https://schema.org/${v}`);

// ─── UnitPriceSpecification ──────────────────────────────────────────────────

/**
 * schema.org/UnitPriceSpecification
 * Used in Merchant Listing for loyalty pricing, unit-based pricing, etc.
 */
export const UnitPriceSpecificationSchema = z.object({
  "@type": z
    .literal("UnitPriceSpecification")
    .default("UnitPriceSpecification"),
  price: z.union([z.number(), z.string()]),
  priceCurrency: z.string().length(3), // ISO 4217
  /** "SRP", "ListPrice", "MinimumAdvertisedPrice", "SalePrice", "InvoicePrice" */
  priceType: z.string().optional(),
  /** Member tier this price is valid for */
  validForMemberTier: z
    .union([z.string(), z.object({}).catchall(z.unknown())])
    .optional(),
  referenceQuantity: z
    .object({
      "@type": z.literal("QuantitativeValue").default("QuantitativeValue"),
      value: z.number().optional(),
      unitCode: z.string().optional(),
      unitText: z.string().optional(),
    })
    .optional(),
  /** Loyalty points earned */
  membershipPointsEarned: z
    .object({
      "@type": z.literal("QuantitativeValue").default("QuantitativeValue"),
      value: z.number().optional(),
      unitText: z.string().optional(),
    })
    .optional(),
  validFrom: z.string().optional(),
  validThrough: z.string().optional(),
});

export type UnitPriceSpecification = z.infer<
  typeof UnitPriceSpecificationSchema
>;

// ─── MerchantReturnPolicySeasonalOverride ─────────────────────────────────────

export const MerchantReturnPolicySeasonalOverrideSchema = z.object({
  "@type": z
    .literal("MerchantReturnPolicySeasonalOverride")
    .default("MerchantReturnPolicySeasonalOverride"),
  startDate: z.string().optional(), // ISO 8601
  endDate: z.string().optional(), // ISO 8601
  returnPolicyCategory: z.string().optional(), // schema.org enum URL
  merchantReturnDays: z.number().int().nonnegative().optional(),
});

export type MerchantReturnPolicySeasonalOverride = z.infer<
  typeof MerchantReturnPolicySeasonalOverrideSchema
>;

/**
 * schema.org/Offer
 * Used by Product, Event (ticketing), Course, SoftwareApplication, etc.
 */
export const OfferSchema = z.object({
  "@type": z.literal("Offer").default("Offer"),
  price: z.union([z.number(), z.string()]),
  priceCurrency: z.string().length(3), // ISO 4217, e.g. "USD"
  availability: ItemAvailability.optional(),
  itemCondition: ItemCondition.optional(),
  validFrom: z.string().optional(), // ISO 8601
  validThrough: z.string().optional(), // ISO 8601
  url: z.url().optional(),
  seller: z.union([
    z.object({ "@id": z.string() }),
    z.object({ "@type": z.string(), name: z.string() }),
  ]).optional(),
  category: z.string().optional(),
  inventoryLevel: z
    .object({
      "@type": z.literal("QuantitativeValue").default("QuantitativeValue"),
      value: z.number(),
    })
    .optional(),
  priceValidUntil: z.string().optional(), // ISO 8601 date — Google Product requirement
  priceSpecification: z
    .union([
      UnitPriceSpecificationSchema,
      z.array(UnitPriceSpecificationSchema),
    ])
    .optional(),
  shippingDetails: z
    .union([OfferShippingDetailsSchema, z.array(OfferShippingDetailsSchema)])
    .optional(),
  hasMerchantReturnPolicy: z
    .union([
      z.object({ "@id": z.string() }),
      z.lazy(() => z.object({ "@type": z.string() }).catchall(z.unknown())),
    ])
    .optional(),
});

/**
 * schema.org/MerchantReturnPolicy
 * Used by Product and Organization for Google Merchant Center.
 */
export const MerchantReturnPolicySchema = z.object({
  "@type": z.literal("MerchantReturnPolicy").default("MerchantReturnPolicy"),
  applicableCountry: z.union([z.string(), z.array(z.string())]).optional(),
  returnPolicyCategory: z.string().optional(), // schema.org enum URL
  merchantReturnDays: z.number().int().nonnegative().optional(),
  returnMethod: z.string().optional(), // schema.org enum URL
  returnFees: z.string().optional(), // schema.org enum URL
  refundType: z.string().optional(), // schema.org enum URL

  // Additional Google Merchant Listing fields
  merchantReturnLink: z.url().optional(),
  returnShippingFeesAmount: MonetaryAmountSchema.optional(),
  itemCondition: z.union([ItemCondition, z.array(ItemCondition)]).optional(),
  returnLabelSource: z.string().optional(), // schema.org enum URL
  returnPolicyCountry: z.string().optional(), // ISO 3166-1 alpha-2
  restockingFee: z.union([MonetaryAmountSchema, z.number()]).optional(),
  returnPolicySeasonalOverride: z
    .union([
      MerchantReturnPolicySeasonalOverrideSchema,
      z.array(MerchantReturnPolicySeasonalOverrideSchema),
    ])
    .optional(),

  // Customer remorse return fields
  customerRemorseReturnFees: z.string().optional(), // schema.org enum URL
  customerRemorseReturnLabelSource: z.string().optional(), // schema.org enum URL
  customerRemorseReturnShippingFeesAmount: MonetaryAmountSchema.optional(),

  // Item defect return fields
  itemDefectReturnFees: z.string().optional(), // schema.org enum URL
  itemDefectReturnLabelSource: z.string().optional(), // schema.org enum URL
  itemDefectReturnShippingFeesAmount: MonetaryAmountSchema.optional(),
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
  priceCurrency: z.string().length(3).optional(), // ISO 4217
  offerCount: z.number().int().nonnegative().optional(),
  offers: z.union([OfferSchema, z.array(OfferSchema)]).optional(),
  availability: ItemAvailability.optional(),
  url: z.url().optional(),
});

export type AggregateOffer = z.infer<typeof AggregateOfferSchema>;
