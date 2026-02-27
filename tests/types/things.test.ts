import { describe, it, expect } from "vitest";
import {
  createPerson,
  createOrganization,
  createNGO,
  createCorporation,
  createOnlineStore,
  createOnlineBusiness,
  createProduct,
  createProductGroup,
  createOffer,
  createEvent,
  createPlace,
  createLocalBusiness,
  createRestaurant,
  createHotel,
  createMovie,
  ReviewSchema,
  AggregateRatingSchema,
  AggregateOfferSchema,
  PostalAddressSchema,
  GeoCoordinatesSchema,
  OpeningHoursSpecificationSchema,
  EventStatusType,
  EventAttendanceMode,
  CertificationSchema,
  InteractionCounterSchema,
  SizeSpecificationSchema,
  PeopleAudienceSchema,
} from "../../src/index";

// ─── Person ───────────────────────────────────────────────────────────────────

describe("createPerson", () => {
  it("sets @type = Person", () => {
    expect(createPerson({ name: "Alice" }).toObject()["@type"]).toBe("Person");
  });

  it("accepts all common fields", () => {
    const p = createPerson({
      name: "Bob",
      email: "bob@example.com",
      jobTitle: "Engineer",
      url: "https://example.com/bob",
    });
    const obj = p.toObject();
    expect(obj.name).toBe("Bob");
    expect(obj.email).toBe("bob@example.com");
    expect(obj.jobTitle).toBe("Engineer");
  });

  it("rejects invalid email", () => {
    expect(() => createPerson({ name: "X", email: "not-an-email" })).toThrow();
  });

  it("accepts image as a URL string", () => {
    const p = createPerson({ name: "Alice", image: "https://example.com/alice.jpg" });
    expect(p.toObject().image).toBe("https://example.com/alice.jpg");
  });

  it("accepts image as an array of URLs", () => {
    const p = createPerson({
      name: "Alice",
      image: ["https://example.com/a.jpg", "https://example.com/b.jpg"],
    });
    expect(Array.isArray(p.toObject().image)).toBe(true);
  });

  it("accepts @id for @graph cross-referencing", () => {
    const p = createPerson({ "@id": "https://example.com/#alice", name: "Alice" });
    expect(p.toObject()["@id"]).toBe("https://example.com/#alice");
  });
});

// ─── Organization ─────────────────────────────────────────────────────────────

describe("createOrganization", () => {
  it("sets @type = Organization", () => {
    expect(createOrganization({ name: "Acme" }).toObject()["@type"]).toBe("Organization");
  });

  it("createNGO sets @type = NGO", () => {
    expect(createNGO({ name: "Charity" }).toObject()["@type"]).toBe("NGO");
  });

  it("createCorporation sets @type = Corporation", () => {
    expect(createCorporation({ name: "Corp Inc" }).toObject()["@type"]).toBe("Corporation");
  });

  it("accepts sameAs as array", () => {
    const org = createOrganization({
      name: "Acme",
      sameAs: ["https://twitter.com/acme", "https://linkedin.com/company/acme"],
    });
    expect(Array.isArray(org.toObject().sameAs)).toBe(true);
  });

  it("accepts logo as URL string", () => {
    const org = createOrganization({ name: "Acme", logo: "https://acme.com/logo.png" });
    expect(org.toObject().logo).toBe("https://acme.com/logo.png");
  });

  it("accepts address via PostalAddressSchema", () => {
    const org = createOrganization({
      name: "Acme",
      address: PostalAddressSchema.parse({
        streetAddress: "1 Main St",
        addressLocality: "Springfield",
        addressCountry: "US",
      }),
    });
    expect((org.toObject().address as any)?.addressLocality).toBe("Springfield");
  });
});

// ─── Product ─────────────────────────────────────────────────────────────────

describe("createProduct", () => {
  it("sets @type = Product", () => {
    expect(createProduct({ name: "Widget" }).toObject()["@type"]).toBe("Product");
  });

  it("accepts an Offer", () => {
    const product = createProduct({
      name: "Widget",
      offers: createOffer({ price: 9.99, priceCurrency: "USD" }).toObject(),
    });
    expect((product.toObject().offers as any)?.price).toBe(9.99);
  });

  it("transforms ItemAvailability to full URL", () => {
    const offer = createOffer({ price: 10, priceCurrency: "USD", availability: "InStock" });
    expect(offer.toObject().availability).toBe("https://schema.org/InStock");
  });

  it("accepts review", () => {
    const product = createProduct({
      name: "Widget",
      review: ReviewSchema.parse({
        author: { "@type": "Person", name: "Jane" },
        reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5 },
      }),
    });
    expect((product.toObject().review as any)?.author?.name).toBe("Jane");
  });

  it("accepts GTIN fields", () => {
    const product = createProduct({ name: "Widget", gtin13: "0123456789012" });
    expect(product.toObject().gtin13).toBe("0123456789012");
  });
});

describe("createProductGroup", () => {
  it("sets @type = ProductGroup", () => {
    expect(createProductGroup({ name: "Shoe Range", productGroupID: "shoes-001" }).toObject()["@type"]).toBe("ProductGroup");
  });
});

// ─── Event ───────────────────────────────────────────────────────────────────

describe("createEvent", () => {
  it("sets @type = Event", () => {
    const e = createEvent({ name: "Concert", startDate: "2025-06-01" });
    expect(e.toObject()["@type"]).toBe("Event");
  });

  it("transforms EventStatusType to full URL", () => {
    const e = createEvent({
      name: "Concert",
      startDate: "2025-06-01",
      eventStatus: "EventScheduled",
    });
    expect(e.toObject().eventStatus).toBe("https://schema.org/EventScheduled");
  });

  it("transforms EventAttendanceMode to full URL", () => {
    const e = createEvent({
      name: "Webinar",
      startDate: "2025-06-01",
      eventAttendanceMode: "OnlineEventAttendanceMode",
    });
    expect(e.toObject().eventAttendanceMode).toBe("https://schema.org/OnlineEventAttendanceMode");
  });

  it("accepts location as a Place object", () => {
    const e = createEvent({
      name: "Concert",
      startDate: "2025-06-01",
      location: { "@type": "Place", name: "Madison Square Garden" },
    });
    expect((e.toObject().location as any)?.name).toBe("Madison Square Garden");
  });

  it("accepts organizer as Person reference", () => {
    const e = createEvent({
      name: "Concert",
      startDate: "2025-06-01",
      organizer: { "@type": "Organization", name: "Event Co" },
    });
    expect((e.toObject().organizer as any)?.name).toBe("Event Co");
  });
});

// ─── Place ────────────────────────────────────────────────────────────────────

describe("createPlace", () => {
  it("sets @type = Place", () => {
    expect(createPlace({ name: "Central Park" }).toObject()["@type"]).toBe("Place");
  });

  it("accepts geo coordinates", () => {
    const place = createPlace({
      name: "Central Park",
      geo: GeoCoordinatesSchema.parse({ latitude: 40.785, longitude: -73.968 }),
    });
    expect((place.toObject().geo as any)?.latitude).toBe(40.785);
  });
});

// ─── LocalBusiness ───────────────────────────────────────────────────────────

describe("createLocalBusiness", () => {
  it("sets default @type = LocalBusiness", () => {
    expect(createLocalBusiness({ name: "Shop" }).toObject()["@type"]).toBe("LocalBusiness");
  });

  it("accepts @type override to HairSalon", () => {
    const salon = createLocalBusiness({ "@type": "HairSalon", name: "Cuts" });
    expect(salon.toObject()["@type"]).toBe("HairSalon");
  });

  it("createRestaurant sets @type = Restaurant", () => {
    expect(createRestaurant({ name: "Pizza Place" }).toObject()["@type"]).toBe("Restaurant");
  });

  it("createHotel sets @type = Hotel", () => {
    expect(createHotel({ name: "Grand Hotel" }).toObject()["@type"]).toBe("Hotel");
  });

  it("accepts opening hours specification", () => {
    const lb = createLocalBusiness({
      name: "Shop",
      openingHoursSpecification: [
        OpeningHoursSpecificationSchema.parse({
          dayOfWeek: ["Monday", "Tuesday"],
          opens: "09:00:00",
          closes: "17:00:00",
        }),
      ],
    });
    const spec = (lb.toObject().openingHoursSpecification as any[])?.[0];
    expect(spec?.opens).toBe("09:00:00");
  });

  it("accepts image as array of URLs", () => {
    const lb = createRestaurant({
      name: "Bistro",
      image: ["https://example.com/dining.jpg", "https://example.com/food.jpg"],
    });
    expect(Array.isArray(lb.toObject().image)).toBe(true);
  });

  it("accepts aggregateRating", () => {
    const lb = createLocalBusiness({
      name: "Shop",
      aggregateRating: AggregateRatingSchema.parse({ ratingValue: 4.5, reviewCount: 100, bestRating: 5 }),
    });
    expect((lb.toObject().aggregateRating as any)?.ratingValue).toBe(4.5);
  });
});

// ─── Movie ────────────────────────────────────────────────────────────────────

describe("createMovie", () => {
  it("sets @type = Movie", () => {
    expect(createMovie({ name: "Inception" }).toObject()["@type"]).toBe("Movie");
  });

  it("accepts director as Person reference", () => {
    const movie = createMovie({
      name: "Inception",
      director: { "@type": "Person", name: "Christopher Nolan" },
    });
    expect((movie.toObject().director as any)?.name).toBe("Christopher Nolan");
  });

  it("accepts aggregateRating", () => {
    const movie = createMovie({
      name: "Inception",
      aggregateRating: AggregateRatingSchema.parse({ ratingValue: 8.8, ratingCount: 2000000, bestRating: 10 }),
    });
    expect((movie.toObject().aggregateRating as any)?.ratingValue).toBe(8.8);
  });
});

// ─── OnlineStore / OnlineBusiness ─────────────────────────────────────────────

describe("createOnlineStore", () => {
  it("sets @type = OnlineStore", () => {
    const store = createOnlineStore({ name: "Acme Shop", url: "https://acmeshop.example" });
    expect(store.toObject()["@type"]).toBe("OnlineStore");
  });

  it("accepts standard Organization fields", () => {
    const store = createOnlineStore({
      name: "Acme Shop",
      url: "https://acmeshop.example",
      logo: "https://acmeshop.example/logo.png",
      sameAs: ["https://twitter.com/acmeshop"],
    });
    expect(store.toObject().name).toBe("Acme Shop");
  });
});

describe("createOnlineBusiness", () => {
  it("sets @type = OnlineBusiness", () => {
    const biz = createOnlineBusiness({ name: "SaaS Co", url: "https://saas.example" });
    expect(biz.toObject()["@type"]).toBe("OnlineBusiness");
  });
});

// ─── Product — Certification & AggregateOffer ─────────────────────────────────

describe("Product — new fields", () => {
  it("accepts hasCertification", () => {
    const cert = CertificationSchema.parse({
      name: "Energy Star",
      url: "https://energystar.gov",
      issuedBy: { "@type": "Organization", name: "U.S. EPA" },
    });
    const product = createProduct({ name: "Smart Thermostat", hasCertification: cert });
    expect((product.toObject().hasCertification as any)?.name).toBe("Energy Star");
    expect((product.toObject().hasCertification as any)?.["@type"]).toBe("Certification");
  });

  it("accepts hasCertification as array", () => {
    const product = createProduct({
      name: "Organic Coffee",
      hasCertification: [
        CertificationSchema.parse({ name: "USDA Organic", issuedBy: { "@type": "Organization", name: "USDA" } }),
        CertificationSchema.parse({ name: "Fair Trade", issuedBy: { "@type": "Organization", name: "Fair Trade USA" } }),
      ],
    });
    expect(Array.isArray(product.toObject().hasCertification)).toBe(true);
  });

  it("accepts AggregateOffer on offers", () => {
    const aggOffer = AggregateOfferSchema.parse({
      lowPrice: 89.99,
      highPrice: 129.99,
      priceCurrency: "USD",
      offerCount: 5,
    });
    const product = createProduct({ name: "Trail Shoes", offers: aggOffer });
    expect((product.toObject().offers as any)?.["@type"]).toBe("AggregateOffer");
    expect((product.toObject().offers as any)?.lowPrice).toBe(89.99);
    expect((product.toObject().offers as any)?.offerCount).toBe(5);
  });

  it("accepts subjectOf 3DModel", () => {
    const product = createProduct({
      name: "Widget",
      subjectOf: { "@type": "3DModel", contentUrl: "https://example.com/widget.glb", encodingFormat: "model/gltf-binary" },
    });
    expect((product.toObject().subjectOf as any)?.["@type"]).toBe("3DModel");
  });

  it("accepts pattern, size as string, and inProductGroupWithID", () => {
    const product = createProduct({
      name: "T-Shirt",
      pattern: "Striped",
      size: "XL",
      inProductGroupWithID: "GROUP-001",
    });
    const obj = product.toObject();
    expect(obj.pattern).toBe("Striped");
    expect(obj.size).toBe("XL");
    expect(obj.inProductGroupWithID).toBe("GROUP-001");
  });

  it("accepts size as SizeSpecification", () => {
    const product = createProduct({
      name: "Jeans",
      size: SizeSpecificationSchema.parse({ name: "32W x 30L", sizeSystem: "US" }),
    });
    expect((product.toObject().size as any)?.["@type"]).toBe("SizeSpecification");
  });

  it("accepts audience (PeopleAudience)", () => {
    const product = createProduct({
      name: "Kids Toy",
      audience: PeopleAudienceSchema.parse({ suggestedGender: "Male", suggestedMinAge: 3, suggestedMaxAge: 8 }),
    });
    expect((product.toObject().audience as any)?.["@type"]).toBe("PeopleAudience");
  });

  it("accepts positiveNotes and negativeNotes", () => {
    const product = createProduct({
      name: "Headphones",
      positiveNotes: {
        itemListElement: [
          { position: 1, name: "Great sound quality" },
          { position: 2, name: "Comfortable fit" },
        ],
      },
      negativeNotes: {
        itemListElement: [{ position: 1, name: "Short battery life" }],
      },
    });
    const obj = product.toObject();
    expect((obj.positiveNotes as any)?.["@type"]).toBe("ItemList");
    expect((obj.negativeNotes as any)?.["@type"]).toBe("ItemList");
  });
});

// ─── Organization (new fields) ────────────────────────────────────────────────

describe("createOrganization (new fields)", () => {
  it("accepts globalLocationNumber and naics", () => {
    const org = createOrganization({
      name: "ACME Corp",
      globalLocationNumber: "1234567890123",
      naics: "541511",
    });
    const obj = org.toObject();
    expect(obj.globalLocationNumber).toBe("1234567890123");
    expect(obj.naics).toBe("541511");
  });

  it("accepts interactionStatistic and agentInteractionStatistic", () => {
    const org = createOrganization({
      name: "ACME Corp",
      interactionStatistic: InteractionCounterSchema.parse({
        interactionType: "https://schema.org/FollowAction",
        userInteractionCount: 5000,
      }),
    });
    expect((org.toObject().interactionStatistic as any)?.userInteractionCount).toBe(5000);
  });

  it("accepts hasMemberProgram", () => {
    const org = createOrganization({
      name: "Loyalty Co",
      hasMemberProgram: { name: "VIP Club" },
    });
    expect((org.toObject().hasMemberProgram as any)?.name).toBe("VIP Club");
  });
});

// ─── Person (new fields) ──────────────────────────────────────────────────────

describe("createPerson (new fields)", () => {
  it("accepts interactionStatistic", () => {
    const person = createPerson({
      name: "Jane Doe",
      interactionStatistic: InteractionCounterSchema.parse({
        interactionType: "https://schema.org/FollowAction",
        userInteractionCount: 1200,
      }),
    });
    expect((person.toObject().interactionStatistic as any)?.["@type"]).toBe("InteractionCounter");
  });
});
