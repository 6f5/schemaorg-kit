import { describe, it, expect } from "vitest";
import {
  PostalAddressSchema,
  GeoCoordinatesSchema,
  ImageObjectSchema,
  ImageOrUrl,
  createImageObject,
  ContactPointSchema,
  MonetaryAmountSchema,
  PriceSpecificationSchema,
  RatingSchema,
  AggregateRatingSchema,
  ReviewSchema,
  EmployerAggregateRatingSchema,
  OfferSchema,
  AggregateOfferSchema,
  MerchantReturnPolicySchema,
  ItemAvailability,
  ItemCondition,
  UnitPriceSpecificationSchema,
  MerchantReturnPolicySeasonalOverrideSchema,
  createOffer,
  OfferShippingDetailsSchema,
  DefinedRegionSchema,
  ShippingDeliveryTimeSchema,
  OpeningHoursSpecificationSchema,
  HowToStepSchema,
  HowToSectionSchema,
  ClipSchema,
  BroadcastEventSchema,
  SeekToActionSchema,
  VideoObjectSchema,
  createVideoObject,
  PersonOrOrgRef,
  InteractionCounterSchema,
  MemberProgramSchema,
  MemberProgramTierSchema,
  ShippingServiceSchema,
  ShippingConditionsSchema,
} from "../src/index";

// ─── PostalAddress ────────────────────────────────────────────────────────────

describe("PostalAddressSchema", () => {
  it("parses a full postal address", () => {
    const addr = PostalAddressSchema.parse({
      streetAddress: "1 Main St",
      addressLocality: "Springfield",
      addressRegion: "IL",
      postalCode: "62701",
      addressCountry: "US",
    });
    expect(addr["@type"]).toBe("PostalAddress");
    expect(addr.addressLocality).toBe("Springfield");
  });

  it("accepts partial address", () => {
    const addr = PostalAddressSchema.parse({ addressCountry: "US" });
    expect(addr.addressCountry).toBe("US");
  });
});

// ─── GeoCoordinates ───────────────────────────────────────────────────────────

describe("GeoCoordinatesSchema", () => {
  it("parses latitude/longitude", () => {
    const geo = GeoCoordinatesSchema.parse({ latitude: 37.77, longitude: -122.41 });
    expect(geo["@type"]).toBe("GeoCoordinates");
    expect(geo.latitude).toBe(37.77);
    expect(geo.longitude).toBe(-122.41);
  });
});

// ─── ImageObject ─────────────────────────────────────────────────────────────

describe("ImageObjectSchema / createImageObject", () => {
  it("parses a minimal ImageObject", () => {
    const img = ImageObjectSchema.parse({ url: "https://example.com/img.jpg" });
    expect(img["@type"]).toBe("ImageObject");
    expect(img.url).toBe("https://example.com/img.jpg");
  });

  it("accepts full image metadata", () => {
    const img = ImageObjectSchema.parse({
      url: "https://example.com/photo.jpg",
      width: 1200,
      height: 630,
      caption: "A beautiful photo",
      license: "https://creativecommons.org/licenses/by/4.0/",
      creditText: "Photo by Alice",
    });
    expect(img.width).toBe(1200);
    expect(img.creditText).toBe("Photo by Alice");
  });

  it("createImageObject returns a SchemaNode", () => {
    const img = createImageObject({ url: "https://example.com/img.jpg" });
    expect(img.toObject()["@type"]).toBe("ImageObject");
  });

  it("ImageOrUrl accepts a URL string", () => {
    expect(() => ImageOrUrl.parse("https://example.com/img.jpg")).not.toThrow();
  });

  it("ImageOrUrl accepts an ImageObject", () => {
    expect(() =>
      ImageOrUrl.parse({ "@type": "ImageObject", url: "https://example.com/img.jpg" })
    ).not.toThrow();
  });
});

// ─── ContactPoint ─────────────────────────────────────────────────────────────

describe("ContactPointSchema", () => {
  it("parses a customer support contact point", () => {
    const cp = ContactPointSchema.parse({
      contactType: "customer support",
      telephone: "+1-800-555-0100",
      email: "support@example.com",
      availableLanguage: ["English", "Spanish"],
    });
    expect(cp["@type"]).toBe("ContactPoint");
    expect(cp.contactType).toBe("customer support");
  });

  it("rejects invalid email", () => {
    expect(() =>
      ContactPointSchema.parse({ contactType: "sales", email: "not-valid" })
    ).toThrow();
  });
});

// ─── MonetaryAmount / PriceSpecification ──────────────────────────────────────

describe("MonetaryAmountSchema", () => {
  it("parses MonetaryAmount with currency", () => {
    const ma = MonetaryAmountSchema.parse({
      currency: "USD",
      value: { "@type": "QuantitativeValue", value: 50000, unitText: "YEAR" },
    });
    expect(ma["@type"]).toBe("MonetaryAmount");
    expect(ma.currency).toBe("USD");
  });
});

describe("PriceSpecificationSchema", () => {
  it("parses a PriceSpecification", () => {
    const ps = PriceSpecificationSchema.parse({ price: 9.99, priceCurrency: "USD" });
    expect(ps["@type"]).toBe("PriceSpecification");
    expect(ps.price).toBe(9.99);
  });
});

// ─── Rating / AggregateRating / Review ────────────────────────────────────────

describe("RatingSchema", () => {
  it("parses a Rating", () => {
    const r = RatingSchema.parse({ ratingValue: 4.5, bestRating: 5 });
    expect(r["@type"]).toBe("Rating");
    expect(r.ratingValue).toBe(4.5);
  });
});

describe("AggregateRatingSchema", () => {
  it("parses ratingCount", () => {
    const ar = AggregateRatingSchema.parse({ ratingValue: 4.2, ratingCount: 100, bestRating: 5 });
    expect(ar["@type"]).toBe("AggregateRating");
    expect(ar.ratingCount).toBe(100);
  });

  it("parses reviewCount", () => {
    const ar = AggregateRatingSchema.parse({ ratingValue: 4.2, reviewCount: 50, bestRating: 5 });
    expect(ar.reviewCount).toBe(50);
  });
});

describe("ReviewSchema", () => {
  it("parses a review with author and rating", () => {
    const review = ReviewSchema.parse({
      author: { "@type": "Person", name: "Alice" },
      reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5 },
      reviewBody: "Excellent!",
      datePublished: "2025-01-01",
    });
    expect(review["@type"]).toBe("Review");
    expect(review.author?.name).toBe("Alice");
  });
});

describe("EmployerAggregateRatingSchema", () => {
  it("parses employer rating", () => {
    const ear = EmployerAggregateRatingSchema.parse({
      ratingValue: 4.1,
      ratingCount: 200,
      bestRating: 5,
    });
    expect(ear["@type"]).toBe("EmployerAggregateRating");
  });
});

// ─── Offer / MerchantReturnPolicy ─────────────────────────────────────────────

describe("OfferSchema / createOffer", () => {
  it("parses an Offer", () => {
    const offer = OfferSchema.parse({ price: 9.99, priceCurrency: "USD" });
    expect(offer["@type"]).toBe("Offer");
    expect(offer.price).toBe(9.99);
  });

  it("transforms availability string to full URL", () => {
    const offer = OfferSchema.parse({ price: 0, priceCurrency: "USD", availability: "InStock" });
    expect(offer.availability).toBe("https://schema.org/InStock");
  });

  it("createOffer returns a SchemaNode", () => {
    const offer = createOffer({ price: 19.99, priceCurrency: "EUR" });
    expect(offer.toObject()["@type"]).toBe("Offer");
    expect(offer.toObject().price).toBe(19.99);
  });

  it("accepts all ItemAvailability values", () => {
    const values = [
      "InStock", "OutOfStock", "PreOrder", "SoldOut",
      "LimitedAvailability", "OnlineOnly", "InStoreOnly", "BackOrder",
    ] as const;
    for (const v of values) {
      const offer = OfferSchema.parse({ price: 0, priceCurrency: "USD", availability: v });
      expect(offer.availability).toBe(`https://schema.org/${v}`);
    }
  });
});

describe("MerchantReturnPolicySchema", () => {
  it("parses a return policy", () => {
    const policy = MerchantReturnPolicySchema.parse({
      applicableCountry: ["US", "CA"],
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 30,
      returnMethod: "https://schema.org/ReturnByMail",
      returnFees: "https://schema.org/FreeReturn",
    });
    expect(policy["@type"]).toBe("MerchantReturnPolicy");
    expect(policy.merchantReturnDays).toBe(30);
  });
});

// ─── OpeningHoursSpecification ────────────────────────────────────────────────

describe("OpeningHoursSpecificationSchema", () => {
  it("parses weekday hours", () => {
    const spec = OpeningHoursSpecificationSchema.parse({
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00:00",
      closes: "17:00:00",
    });
    expect(spec["@type"]).toBe("OpeningHoursSpecification");
    expect(spec.opens).toBe("09:00:00");
  });

  it("accepts single day string", () => {
    const spec = OpeningHoursSpecificationSchema.parse({ dayOfWeek: "Saturday", opens: "10:00:00", closes: "15:00:00" });
    expect(spec.dayOfWeek).toBe("Saturday");
  });

  it("accepts validFrom/validThrough for seasonal hours", () => {
    const spec = OpeningHoursSpecificationSchema.parse({
      dayOfWeek: "Thursday",
      opens: "00:00:00",
      closes: "00:00:00",
      validFrom: "2025-12-25",
      validThrough: "2025-12-25",
    });
    expect(spec.validFrom).toBe("2025-12-25");
  });
});

// ─── HowToStep / HowToSection ─────────────────────────────────────────────────

describe("HowToStepSchema", () => {
  it("parses a step with text", () => {
    const step = HowToStepSchema.parse({ text: "Preheat oven to 350°F" });
    expect(step["@type"]).toBe("HowToStep");
    expect(step.text).toBe("Preheat oven to 350°F");
  });

  it("accepts name, url, image", () => {
    const step = HowToStepSchema.parse({
      name: "Preheat",
      text: "Preheat oven",
      url: "https://example.com/recipe#step-1",
      image: "https://example.com/step-1.jpg",
    });
    expect(step.name).toBe("Preheat");
  });
});

describe("HowToSectionSchema", () => {
  it("parses a section with steps", () => {
    const section = HowToSectionSchema.parse({
      name: "Preparation",
      itemListElement: [
        { "@type": "HowToStep", text: "Wash vegetables" },
      ],
    });
    expect(section["@type"]).toBe("HowToSection");
    expect(section.name).toBe("Preparation");
  });
});

// ─── Clip / BroadcastEvent / VideoObject ─────────────────────────────────────

describe("ClipSchema", () => {
  it("parses a clip with offsets", () => {
    const clip = ClipSchema.parse({
      name: "Introduction",
      startOffset: 0,
      endOffset: 120,
      url: "https://example.com/video.mp4#t=0",
    });
    expect(clip["@type"]).toBe("Clip");
    expect(clip.startOffset).toBe(0);
    expect(clip.endOffset).toBe(120);
  });
});

describe("BroadcastEventSchema", () => {
  it("parses a broadcast event", () => {
    const event = BroadcastEventSchema.parse({
      isLiveBroadcast: true,
      startDate: "2025-06-01T09:00:00Z",
      endDate: "2025-06-01T11:00:00Z",
    });
    expect(event["@type"]).toBe("BroadcastEvent");
    expect(event.isLiveBroadcast).toBe(true);
  });
});

describe("PersonOrOrgRef", () => {
  it("accepts a string", () => {
    expect(() => PersonOrOrgRef.parse("https://example.com/alice")).not.toThrow();
  });

  it("accepts a Person object", () => {
    expect(() =>
      PersonOrOrgRef.parse({ "@type": "Person", name: "Alice" })
    ).not.toThrow();
  });

  it("accepts an Organization object", () => {
    expect(() =>
      PersonOrOrgRef.parse({ "@type": "Organization", name: "Acme" })
    ).not.toThrow();
  });
});

// ─── AggregateOffer ───────────────────────────────────────────────────────────

describe("AggregateOfferSchema", () => {
  it("parses lowPrice and highPrice", () => {
    const ao = AggregateOfferSchema.parse({
      lowPrice: 89.99,
      highPrice: 129.99,
      priceCurrency: "USD",
    });
    expect(ao["@type"]).toBe("AggregateOffer");
    expect(ao.lowPrice).toBe(89.99);
    expect(ao.highPrice).toBe(129.99);
  });

  it("accepts offerCount", () => {
    const ao = AggregateOfferSchema.parse({ offerCount: 7, priceCurrency: "EUR" });
    expect(ao.offerCount).toBe(7);
  });

  it("accepts nested offers array", () => {
    const ao = AggregateOfferSchema.parse({
      lowPrice: 10,
      priceCurrency: "USD",
      offers: [
        { "@type": "Offer", price: 10, priceCurrency: "USD" },
        { "@type": "Offer", price: 15, priceCurrency: "USD" },
      ],
    });
    expect(Array.isArray(ao.offers)).toBe(true);
  });

  it("transforms availability to schema.org URL", () => {
    const ao = AggregateOfferSchema.parse({ priceCurrency: "USD", availability: "InStock" });
    expect(ao.availability).toBe("https://schema.org/InStock");
  });
});

// ─── OfferShippingDetails ─────────────────────────────────────────────────────

describe("OfferShippingDetailsSchema", () => {
  it("parses shippingRate with currency", () => {
    const sd = OfferShippingDetailsSchema.parse({
      shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "USD" },
      shippingLabel: "Free Shipping",
    });
    expect(sd["@type"]).toBe("OfferShippingDetails");
    expect(sd.shippingRate?.value).toBe(0);
    expect(sd.shippingLabel).toBe("Free Shipping");
  });

  it("parses shippingDestination DefinedRegion", () => {
    const sd = OfferShippingDetailsSchema.parse({
      shippingDestination: DefinedRegionSchema.parse({ addressCountry: "US" }),
    });
    expect((sd.shippingDestination as any)?.addressCountry).toBe("US");
  });

  it("parses deliveryTime with handlingTime + transitTime", () => {
    const sd = OfferShippingDetailsSchema.parse({
      deliveryTime: ShippingDeliveryTimeSchema.parse({
        handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2 },
        transitTime: { "@type": "QuantitativeValue", minValue: 3, maxValue: 7 },
      }),
    });
    expect((sd.deliveryTime?.handlingTime as any)?.minValue).toBe(1);
    expect((sd.deliveryTime?.transitTime as any)?.maxValue).toBe(7);
  });

  it("accepts doesNotShip boolean", () => {
    const sd = OfferShippingDetailsSchema.parse({ doesNotShip: true });
    expect(sd.doesNotShip).toBe(true);
  });
});

describe("DefinedRegionSchema", () => {
  it("parses addressCountry", () => {
    const region = DefinedRegionSchema.parse({ addressCountry: "GB" });
    expect(region["@type"]).toBe("DefinedRegion");
    expect(region.addressCountry).toBe("GB");
  });

  it("accepts postalCodePrefix as array", () => {
    const region = DefinedRegionSchema.parse({
      addressCountry: "US",
      postalCodePrefix: ["900", "901", "902"],
    });
    expect(Array.isArray(region.postalCodePrefix)).toBe(true);
  });
});

// ─── Offer with shippingDetails ───────────────────────────────────────────────

describe("OfferSchema — shippingDetails", () => {
  it("accepts a single OfferShippingDetails", () => {
    const offer = OfferSchema.parse({
      price: 49.99,
      priceCurrency: "USD",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: 5.99, currency: "USD" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" },
      },
    });
    expect((offer.shippingDetails as any)?.["@type"]).toBe("OfferShippingDetails");
  });
});

// ─── ItemCondition ────────────────────────────────────────────────────────────

describe("ItemCondition", () => {
  it("transforms NewCondition to schema.org URL", () => {
    expect(ItemCondition.parse("NewCondition")).toBe("https://schema.org/NewCondition");
  });

  it("transforms UsedCondition to schema.org URL", () => {
    expect(ItemCondition.parse("UsedCondition")).toBe("https://schema.org/UsedCondition");
  });

  it("transforms RefurbishedCondition to schema.org URL", () => {
    expect(ItemCondition.parse("RefurbishedCondition")).toBe("https://schema.org/RefurbishedCondition");
  });
});

// ─── UnitPriceSpecification ───────────────────────────────────────────────────

describe("UnitPriceSpecificationSchema", () => {
  it("parses a basic unit price", () => {
    const spec = UnitPriceSpecificationSchema.parse({
      price: 9.99,
      priceCurrency: "USD",
    });
    expect(spec["@type"]).toBe("UnitPriceSpecification");
    expect(spec.price).toBe(9.99);
  });

  it("accepts priceType and validForMemberTier", () => {
    const spec = UnitPriceSpecificationSchema.parse({
      price: 7.99,
      priceCurrency: "USD",
      priceType: "SalePrice",
      validForMemberTier: "Gold",
    });
    expect(spec.priceType).toBe("SalePrice");
    expect(spec.validForMemberTier).toBe("Gold");
  });

  it("accepts membershipPointsEarned", () => {
    const spec = UnitPriceSpecificationSchema.parse({
      price: 5.00,
      priceCurrency: "USD",
      membershipPointsEarned: { value: 500, unitText: "Points" },
    });
    expect((spec.membershipPointsEarned as any)?.value).toBe(500);
  });
});

// ─── MerchantReturnPolicySeasonalOverride ─────────────────────────────────────

describe("MerchantReturnPolicySeasonalOverrideSchema", () => {
  it("parses seasonal override", () => {
    const override = MerchantReturnPolicySeasonalOverrideSchema.parse({
      startDate: "2025-11-01",
      endDate: "2026-01-31",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 60,
    });
    expect(override["@type"]).toBe("MerchantReturnPolicySeasonalOverride");
    expect(override.merchantReturnDays).toBe(60);
  });
});

// ─── MerchantReturnPolicy (expanded fields) ───────────────────────────────────

describe("MerchantReturnPolicySchema (expanded)", () => {
  it("accepts new fields: merchantReturnLink, returnShippingFeesAmount, returnPolicyCountry", () => {
    const policy = MerchantReturnPolicySchema.parse({
      merchantReturnLink: "https://example.com/returns",
      returnShippingFeesAmount: { "@type": "MonetaryAmount", currency: "USD", value: 5 },
      returnPolicyCountry: "US",
    });
    expect(policy.merchantReturnLink).toBe("https://example.com/returns");
    expect(policy.returnPolicyCountry).toBe("US");
  });

  it("accepts customer remorse fields", () => {
    const policy = MerchantReturnPolicySchema.parse({
      customerRemorseReturnFees: "https://schema.org/FreeReturn",
      customerRemorseReturnLabelSource: "https://schema.org/ReturnLabelCustomerResponsibility",
    });
    expect(policy.customerRemorseReturnFees).toBe("https://schema.org/FreeReturn");
  });

  it("accepts returnPolicySeasonalOverride", () => {
    const policy = MerchantReturnPolicySchema.parse({
      returnPolicySeasonalOverride: {
        startDate: "2025-12-01",
        endDate: "2026-01-15",
        merchantReturnDays: 90,
      },
    });
    expect((policy.returnPolicySeasonalOverride as any)?.["@type"]).toBe("MerchantReturnPolicySeasonalOverride");
  });
});

// ─── SeekToAction ─────────────────────────────────────────────────────────────

describe("SeekToActionSchema", () => {
  it("sets @type = SeekToAction and default startOffset-input", () => {
    const action = SeekToActionSchema.parse({
      target: "https://example.com/video?t={seek_to_second_number}",
    });
    expect(action["@type"]).toBe("SeekToAction");
    expect(action["startOffset-input"]).toBe("required name=seek_to_second_number");
  });

  it("can be added to VideoObjectSchema as potentialAction", () => {
    const video = VideoObjectSchema.parse({
      name: "Demo",
      thumbnailUrl: "https://example.com/thumb.jpg",
      uploadDate: "2025-01-01",
      potentialAction: {
        target: "https://example.com/video?t={seek_to_second_number}",
      },
    });
    expect((video.potentialAction as any)?.["@type"]).toBe("SeekToAction");
  });
});

// ─── InteractionCounter ───────────────────────────────────────────────────────

describe("InteractionCounterSchema", () => {
  it("parses a like interaction", () => {
    const counter = InteractionCounterSchema.parse({
      interactionType: "https://schema.org/LikeAction",
      userInteractionCount: 1234,
    });
    expect(counter["@type"]).toBe("InteractionCounter");
    expect(counter.userInteractionCount).toBe(1234);
  });
});

// ─── MemberProgram ────────────────────────────────────────────────────────────

describe("MemberProgramSchema", () => {
  it("parses a basic member program", () => {
    const program = MemberProgramSchema.parse({
      name: "Gold Rewards",
    });
    expect(program["@type"]).toBe("MemberProgram");
    expect(program.name).toBe("Gold Rewards");
  });

  it("accepts tiers", () => {
    const program = MemberProgramSchema.parse({
      name: "Rewards",
      hasTiers: [
        {
          name: "Silver",
          hasTierBenefit: "5% discount",
        },
        {
          name: "Gold",
          hasTierBenefit: ["10% discount", "Free shipping"],
        },
      ],
    });
    expect(Array.isArray(program.hasTiers)).toBe(true);
    expect((program.hasTiers as any)[0]["@type"]).toBe("MemberProgramTier");
  });
});

// ─── ShippingService ──────────────────────────────────────────────────────────

describe("ShippingServiceSchema", () => {
  it("parses a basic shipping service", () => {
    const svc = ShippingServiceSchema.parse({
      name: "Standard Shipping",
      fulfillmentType: "Delivery",
    });
    expect(svc["@type"]).toBe("ShippingService");
    expect(svc.name).toBe("Standard Shipping");
  });

  it("accepts shippingConditions with shippingDestination", () => {
    const svc = ShippingServiceSchema.parse({
      shippingConditions: {
        shippingDestination: { addressCountry: "US" },
        shippingRate: { "@type": "MonetaryAmount", currency: "USD", value: 0 },
      },
    });
    expect((svc.shippingConditions as any)?.["@type"]).toBe("ShippingConditions");
  });
});
