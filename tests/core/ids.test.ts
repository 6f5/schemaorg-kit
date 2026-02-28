import { describe, it, expect } from "vitest";
import {
  SchemaIds,
  createOrganization,
  createWebSite,
  createLocalBusiness,
  createGraph,
} from "../../src";

describe("SchemaIds", () => {
  const ids = new SchemaIds("https://example.com");

  // ── Well-known IDs ──────────────────────────────────────────────────────

  it("generates well-known Thing IDs", () => {
    expect(ids.organization()).toBe("https://example.com/#organization");
    expect(ids.localBusiness()).toBe("https://example.com/#localbusiness");
    expect(ids.person()).toBe("https://example.com/#person");
    expect(ids.product()).toBe("https://example.com/#product");
    expect(ids.event()).toBe("https://example.com/#event");
    expect(ids.place()).toBe("https://example.com/#place");
    expect(ids.movie()).toBe("https://example.com/#movie");
  });

  it("generates well-known CreativeWork IDs", () => {
    expect(ids.website()).toBe("https://example.com/#website");
    expect(ids.webpage()).toBe("https://example.com/#webpage");
    expect(ids.article()).toBe("https://example.com/#article");
    expect(ids.breadcrumb()).toBe("https://example.com/#breadcrumb");
    expect(ids.dataset()).toBe("https://example.com/#dataset");
    expect(ids.recipe()).toBe("https://example.com/#recipe");
    expect(ids.course()).toBe("https://example.com/#course");
    expect(ids.softwareApplication()).toBe("https://example.com/#softwareapplication");
  });

  it("generates well-known Intangible IDs", () => {
    expect(ids.faqPage()).toBe("https://example.com/#faqpage");
    expect(ids.jobPosting()).toBe("https://example.com/#jobposting");
    expect(ids.vacationRental()).toBe("https://example.com/#vacationrental");
    expect(ids.profilePage()).toBe("https://example.com/#profilepage");
  });

  // ── Custom + path-scoped ────────────────────────────────────────────────

  it("generates custom fragment IDs", () => {
    expect(ids.custom("hero-banner")).toBe("https://example.com/#hero-banner");
    expect(ids.custom("logo")).toBe("https://example.com/#logo");
  });

  it("generates path-scoped IDs", () => {
    expect(ids.forPath("/about", "webpage")).toBe("https://example.com/about#webpage");
    expect(ids.forPath("/blog/post-1", "article")).toBe("https://example.com/blog/post-1#article");
  });

  // ── ref() helper ────────────────────────────────────────────────────────

  it("returns @id reference objects", () => {
    expect(ids.ref("organization")).toEqual({ "@id": "https://example.com/#organization" });
  });

  // ── Integration tests ──────────────────────────────────────────────────

  it("works with createOrganization @id field", () => {
    const org = createOrganization({
      "@id": ids.organization(),
      name: "Acme Corp",
    });
    expect(org.toObject()["@id"]).toBe("https://example.com/#organization");
  });

  it("ref() works with WebSite publisher field", () => {
    const site = createWebSite({
      "@id": ids.website(),
      name: "Acme",
      url: "https://example.com",
      publisher: ids.ref("organization"),
    });
    const obj = site.toObject();
    expect(obj["@id"]).toBe("https://example.com/#website");
    expect(obj.publisher).toEqual({ "@id": "https://example.com/#organization" });
  });

  it("works end-to-end with createGraph", () => {
    const org = createOrganization({
      "@id": ids.organization(),
      name: "Acme Corp",
    });
    const site = createWebSite({
      "@id": ids.website(),
      name: "Acme",
      url: "https://example.com",
      publisher: ids.ref("organization"),
    });
    const graph = createGraph([org, site]);
    const items = graph.toArray();

    expect(items[0]["@id"]).toBe("https://example.com/#organization");
    expect(items[1]["@id"]).toBe("https://example.com/#website");
    expect((items[1] as any).publisher).toEqual({ "@id": "https://example.com/#organization" });
  });

  it("LocalBusiness multi-type with SchemaIds", () => {
    const lb = createLocalBusiness({
      "@type": ["LocalBusiness", "TransportationService"],
      "@id": ids.localBusiness(),
      name: "Metro Transfer",
    });
    expect(lb.toObject()["@id"]).toBe("https://example.com/#localbusiness");
    expect(lb.toObject()["@type"]).toEqual(["LocalBusiness", "TransportationService"]);
  });
});
