// @ts-check
import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import { fileURLToPath } from "url";
import path from "path";
import pagefind from "astro-pagefind";
import { SITE } from "./src/lib/site-config";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import wikiLink from "remark-wiki-link";
import { wikiLinkOptions } from "./src/lib/wiki/wiki-link-resolver.mjs";
import { remarkCustomSyntax } from "./src/lib/wiki/remark-custom-syntax.mjs";
import { remarkAlert } from "remark-github-blockquote-alert";
import { remarkDefinitionList } from "remark-definition-list";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

// bejamas:astro-fonts:start
/** @type {any} */
const BEJAMAS_ASTRO_FONTS = [
  {
    provider: fontProviders.google(),
    name: "Geist Mono",
    cssVariable: "--font-mono",
    subsets: ["latin"],
  },
  {
    provider: fontProviders.google(),
    name: "Geist",
    cssVariable: "--font-sans",
    subsets: ["latin"],
  },
  {
    provider: fontProviders.google(),
    name: "Spectral",
    cssVariable: "--font-heading",
    subsets: ["latin"],
  },
];
// bejamas:astro-fonts:end

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: SITE.url,
  fonts: BEJAMAS_ASTRO_FONTS,
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  },
  integrations: [pagefind(), mdx(), sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkMath,
        [wikiLink, wikiLinkOptions],
        remarkDefinitionList,
        remarkCustomSyntax,
        remarkAlert,
      ],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: {
      themes: {
        dark: "github-dark",
        light: "github-light",
      },
    },
  },
});
