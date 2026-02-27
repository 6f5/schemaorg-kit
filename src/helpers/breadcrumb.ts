import { z } from "zod";
import { SchemaNode } from "../core/base";

const BreadcrumbListSchema = z.object({
  "@type": z.literal("BreadcrumbList").default("BreadcrumbList"),
  itemListElement: z.array(
    z.object({
      "@type": z.literal("ListItem").default("ListItem"),
      position: z.number().int().positive(),
      name: z.string(),
      item: z.url().optional(),
    })
  ),
});

export type BreadcrumbList = z.infer<typeof BreadcrumbListSchema>;

type BreadcrumbInput = {
  name: string;
  url?: string;
};

/**
 * Ergonomic helper for BreadcrumbList.
 * Automatically assigns position numbers.
 *
 * @example
 * createBreadcrumbList([
 *   { name: "Home", url: "https://example.com" },
 *   { name: "Shoes", url: "https://example.com/shoes" },
 *   { name: "Running Shoes" }, // last item — url optional
 * ])
 */
export function createBreadcrumbList(items: BreadcrumbInput[]): SchemaNode<typeof BreadcrumbListSchema.shape> {
  const data = BreadcrumbListSchema.parse({
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  });
  return new SchemaNode(BreadcrumbListSchema, data);
}
