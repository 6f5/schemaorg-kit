import { describe, it, expect } from "vitest";
import { createPerson, createProduct, createOffer } from "../../src/index";

describe("createPerson", () => {
  it("creates a valid person with required fields", () => {
    const person = createPerson({ name: "Jane Doe" });
    expect(person.toObject()).toMatchObject({
      "@type": "Person",
      name: "Jane Doe",
    });
  });

  it("toJsonLd includes @context", () => {
    const person = createPerson({ name: "Jane Doe" });
    expect(person.toJsonLd()["@context"]).toBe("https://schema.org");
  });

  it("toScript wraps in script tag", () => {
    const person = createPerson({ name: "Jane Doe" });
    expect(person.toScript()).toContain('<script type="application/ld+json">');
    expect(person.toScript()).toContain("</script>");
  });

  it("validates email format", () => {
    expect(() => createPerson({ name: "Jane", email: "not-an-email" })).toThrow();
  });
});

describe("createProduct", () => {
  it("creates a product with an offer", () => {
    const product = createProduct({
      name: "Shoes",
      offers: createOffer({ price: 99.99, priceCurrency: "USD" }).toObject(),
    });
    const obj = product.toObject();
    expect(obj["@type"]).toBe("Product");
    expect((obj.offers as any).price).toBe(99.99);
  });

  it("transforms availability to full schema.org URL", () => {
    const offer = createOffer({
      price: 10,
      priceCurrency: "USD",
      availability: "InStock",
    });
    expect(offer.toObject().availability).toBe("https://schema.org/InStock");
  });
});
