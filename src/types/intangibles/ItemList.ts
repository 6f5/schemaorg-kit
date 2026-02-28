import { z } from "zod";
import { makeFactory } from "../../core/base";

/**
 * schema.org/ListItem
 * An item in an ItemList. Used for Carousel structured data.
 */
export const ListItemSchema = z.object({
  "@type": z.literal("ListItem").default("ListItem"),
  position: z.number().int().positive(),
  url: z.string().url().optional(),
  name: z.string().optional(),
  // item: the actual entity being listed (loose ref to any schema node)
  item: z.lazy(() =>
    z.object({ "@type": z.string() }).catchall(z.unknown())
  ).optional(),
});

/**
 * schema.org/ItemList
 * A list of items. Used for Carousel rich results.
 * Google requires: itemListElement (array of ListItem)
 */
export const ItemListSchema = z.object({
  "@type": z.literal("ItemList").default("ItemList"),
  name: z.string().optional(),
  description: z.string().optional(),
  url: z.string().url().optional(),
  itemListOrder: z.enum(["Ascending", "Descending", "Unordered"])
    .transform((v) => `https://schema.org/ItemListOrder${v}`)
    .optional(),
  numberOfItems: z.number().int().nonnegative().optional(),
  itemListElement: z.array(
    z.union([
      ListItemSchema,
      z.object({ "@type": z.string() }).catchall(z.unknown()),
    ])
  ),
});

export type ListItem = z.infer<typeof ListItemSchema>;
export type ItemList = z.infer<typeof ItemListSchema>;

export const createItemList = makeFactory(ItemListSchema);
