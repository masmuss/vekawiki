import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Builds a map of wiki filenames to their full relative paths.
 * E.g. "git-workflow" -> "notes/git-workflow"
 */
function buildWikiLinksMap() {
  const wikiLinksMap = new Map();
  try {
    // Go up from src/lib/wiki to src/content/wiki
    const contentWikiPath = path.resolve(__dirname, "../../content/wiki");
    const wikiFiles = fs.readdirSync(contentWikiPath, { recursive: true });

    for (const file of wikiFiles) {
      if (
        typeof file === "string" &&
        (file.endsWith(".md") || file.endsWith(".mdx"))
      ) {
        const slug = file.replace(/\.(md|mdx)?$/, "");
        const basename = path.basename(slug);
        wikiLinksMap.set(basename.toLowerCase(), slug);
      }
    }
  } catch (e) {
    console.warn("Failed to read wiki files for wikiLinksMap", e);
  }
  return wikiLinksMap;
}

const wikiLinksMap = buildWikiLinksMap();

export const wikiLinkOptions = {
  pageResolver: (name) => {
    return [name.replace(/ /g, "-").toLowerCase()];
  },
  hrefTemplate: (permalink) => {
    const resolved = wikiLinksMap.get(permalink) || permalink;
    return `/wiki/${resolved}`;
  },
};
