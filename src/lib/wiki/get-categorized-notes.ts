import { getCollection } from "astro:content";

export interface CategorizedNote {
  name: string;
  notes: Array<{
    id: string;
    title: string;
    description: string;
    growthStage: string;
    updatedAt: Date;
  }>;
}

function getCategory(noteId: string): string {
  return noteId === "index" ? "overview" : noteId.split("/")[0];
}

function byUpdatedAtDesc(
  a: { updatedAt: Date },
  b: { updatedAt: Date },
): number {
  return b.updatedAt.valueOf() - a.updatedAt.valueOf();
}

function byNameAsc(a: { name: string }, b: { name: string }): number {
  return a.name.localeCompare(b.name);
}

export async function getCategorizedNotes(): Promise<CategorizedNote[]> {
  const allNotes = await getCollection("wiki");

  const grouped = allNotes.reduce(
    (acc, note) => {
      const category = getCategory(note.id);
      if (!acc[category]) acc[category] = [];
      acc[category].push({
        id: note.id,
        title: note.data.title,
        description: note.data.description || "",
        growthStage: note.data.growthStage || "",
        updatedAt: note.data.updatedAt,
      });
      return acc;
    },
    {} as Record<string, CategorizedNote["notes"]>,
  );

  return Object.entries(grouped)
    .map(([name, notes]) => ({
      name,
      notes: notes.sort(byUpdatedAtDesc),
    }))
    .sort(byNameAsc);
}
