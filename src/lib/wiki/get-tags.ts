import { getCollection } from "astro:content";

export interface TagEntry {
  tag: string;
  count: number;
  items: Array<{
    id: string;
    title: string;
    description: string;
    growthStage: string;
    updatedAt: Date;
  }>;
}

export async function getTags(): Promise<TagEntry[]> {
  const allNotes = await getCollection("wiki");

  const tagMap = new Map<string, TagEntry>();

  for (const note of allNotes) {
    if (note.id === "index") continue;

    for (const tag of note.data.tags || []) {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, { tag, count: 0, items: [] });
      }
      const entry = tagMap.get(tag)!;
      entry.count++;
      entry.items.push({
        id: note.id,
        title: note.data.title,
        description: note.data.description || "",
        growthStage: note.data.growthStage || "",
        updatedAt: note.data.updatedAt,
      });
    }
  }

  return Array.from(tagMap.values()).sort((a, b) => b.count - a.count);
}
