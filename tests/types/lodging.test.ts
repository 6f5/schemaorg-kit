import { describe, it, expect } from "vitest";
import {
  createVacationRental,
  PostalAddressSchema,
  GeoCoordinatesSchema,
  AggregateRatingSchema,
  AccommodationSchema,
  BedDetailsSchema,
  BedTypeEnum,
} from "../../src/index";

describe("createVacationRental", () => {
  it("sets @type = VacationRental", () => {
    const rental = createVacationRental({ name: "Beach House" });
    expect(rental.toObject()["@type"]).toBe("VacationRental");
  });

  it("accepts address, geo, and amenities", () => {
    const rental = createVacationRental({
      name: "Beach House",
      address: PostalAddressSchema.parse({
        addressLocality: "Malibu",
        addressRegion: "CA",
        addressCountry: "US",
      }),
      geo: GeoCoordinatesSchema.parse({ latitude: 34.02, longitude: -118.78 }),
      amenityFeature: [
        { "@type": "LocationFeatureSpecification", name: "Pool", value: true },
        { "@type": "LocationFeatureSpecification", name: "WiFi", value: true },
      ],
    });
    expect((rental.toObject().address as any)?.addressLocality).toBe("Malibu");
    expect((rental.toObject().geo as any)?.latitude).toBe(34.02);
    expect(Array.isArray(rental.toObject().amenityFeature)).toBe(true);
  });

  it("accepts checkinTime and checkoutTime", () => {
    const rental = createVacationRental({
      name: "Cabin",
      checkinTime: "15:00:00",
      checkoutTime: "11:00:00",
    });
    expect(rental.toObject().checkinTime).toBe("15:00:00");
    expect(rental.toObject().checkoutTime).toBe("11:00:00");
  });

  it("accepts petsAllowed boolean", () => {
    const rental = createVacationRental({ name: "Pet Cabin", petsAllowed: true });
    expect(rental.toObject().petsAllowed).toBe(true);
  });

  it("accepts numberOfRooms and occupancy", () => {
    const rental = createVacationRental({
      name: "Villa",
      numberOfRooms: 5,
      occupancy: { "@type": "QuantitativeValue", maxValue: 10 },
    });
    expect(rental.toObject().numberOfRooms).toBe(5);
  });

  it("accepts aggregateRating", () => {
    const rental = createVacationRental({
      name: "Villa",
      aggregateRating: AggregateRatingSchema.parse({ ratingValue: 4.9, reviewCount: 50, bestRating: 5 }),
    });
    expect((rental.toObject().aggregateRating as any)?.ratingValue).toBe(4.9);
  });

  it("accepts offers with price", () => {
    const rental = createVacationRental({
      name: "Cabin",
      offers: { "@type": "Offer", price: 200, priceCurrency: "USD" },
    });
    expect((rental.toObject().offers as any)?.price).toBe(200);
  });

  it("accepts image as array", () => {
    const rental = createVacationRental({
      name: "Villa",
      image: ["https://example.com/1.jpg", "https://example.com/2.jpg"],
    });
    expect(Array.isArray(rental.toObject().image)).toBe(true);
  });

  it("accepts containsPlace with Accommodation", () => {
    const rental = createVacationRental({
      name: "Beach House",
      containsPlace: AccommodationSchema.parse({
        name: "Master Bedroom",
        numberOfBedrooms: 1,
        numberOfBathroomsTotal: 1,
        bed: BedDetailsSchema.parse({ numberOfBeds: 1, typeOfBed: "King bed" }),
      }),
    });
    const place = rental.toObject().containsPlace as any;
    expect(place?.["@type"]).toBe("Accommodation");
    expect(place?.numberOfBedrooms).toBe(1);
  });

  it("accepts containsPlace as array of Accommodations", () => {
    const rental = createVacationRental({
      name: "Villa",
      containsPlace: [
        AccommodationSchema.parse({ name: "Bedroom 1", numberOfBedrooms: 1 }),
        AccommodationSchema.parse({ name: "Bedroom 2", numberOfBedrooms: 1 }),
      ],
    });
    expect(Array.isArray(rental.toObject().containsPlace)).toBe(true);
  });
});

// ─── Accommodation ───────────────────────────────────────────────────────────

describe("AccommodationSchema", () => {
  it("sets @type = Accommodation", () => {
    const acc = AccommodationSchema.parse({ name: "Suite" });
    expect(acc["@type"]).toBe("Accommodation");
  });

  it("accepts bed as BedDetails", () => {
    const acc = AccommodationSchema.parse({
      bed: BedDetailsSchema.parse({ numberOfBeds: 2, typeOfBed: "Queen bed" }),
    });
    expect((acc.bed as any)?.typeOfBed).toBe("Queen bed");
  });

  it("accepts bed as BedDetails array", () => {
    const acc = AccommodationSchema.parse({
      bed: [
        BedDetailsSchema.parse({ numberOfBeds: 1, typeOfBed: "King bed" }),
        BedDetailsSchema.parse({ numberOfBeds: 1, typeOfBed: "Sofa bed" }),
      ],
    });
    expect(Array.isArray(acc.bed)).toBe(true);
  });

  it("accepts occupancy with maxValue", () => {
    const acc = AccommodationSchema.parse({
      occupancy: { "@type": "QuantitativeValue", maxValue: 4 },
    });
    expect((acc.occupancy as any)?.maxValue).toBe(4);
  });

  it("accepts floorSize", () => {
    const acc = AccommodationSchema.parse({
      floorSize: { "@type": "QuantitativeValue", value: 75, unitCode: "MTK" },
    });
    expect((acc.floorSize as any)?.value).toBe(75);
    expect((acc.floorSize as any)?.unitCode).toBe("MTK");
  });
});

// ─── BedDetails ──────────────────────────────────────────────────────────────

describe("BedDetailsSchema", () => {
  it("sets @type = BedDetails", () => {
    const bed = BedDetailsSchema.parse({ numberOfBeds: 1, typeOfBed: "Double bed" });
    expect(bed["@type"]).toBe("BedDetails");
  });

  it("accepts all BedTypeEnum values", () => {
    const validTypes = ["Single bed", "Double bed", "Bunk bed", "Queen bed", "King bed", "Sofa bed", "Cot", "Waterbed", "Toddler bed"];
    for (const t of validTypes) {
      expect(() => BedTypeEnum.parse(t)).not.toThrow();
    }
  });

  it("accepts custom bed type string", () => {
    const bed = BedDetailsSchema.parse({ typeOfBed: "Murphy bed" });
    expect(bed.typeOfBed).toBe("Murphy bed");
  });
});
