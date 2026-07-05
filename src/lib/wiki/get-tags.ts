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

  const notesToProcess = allNotes.filter((note) => note.id !== "index");

  for (const note of notesToProcess) {
    const tags = note.data.tags || [];
    for (const tag of tags) {
      const entry = getOrCreateTagEntry(tagMap, tag);
      addNoteToTagEntry(entry, note);
    }
  }

  return Array.from(tagMap.values()).sort((a, b) => b.count - a.count);
}

function getOrCreateTagEntry(
  tagMap: Map<string, TagEntry>,
  tag: string,
): TagEntry {
  let entry = tagMap.get(tag);
  if (!entry) {
    entry = { tag, count: 0, items: [] };
    tagMap.set(tag, entry);
  }
  return entry;
}

function addNoteToTagEntry(entry: TagEntry, note: any) {
  entry.count++;
  entry.items.push({
    id: note.id,
    title: note.data.title,
    description: note.data.description || "",
    growthStage: note.data.growthStage || "",
    updatedAt: note.data.updatedAt,
  });
}
