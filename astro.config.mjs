// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import { fileURLToPath } from "url";
import path from "path";

// bejamas:astro-fonts:start
/** @type {NonNullable<import("astro/config").AstroUserConfig["fonts"]>} */
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
];
// bejamas:astro-fonts:end

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  fonts: BEJAMAS_ASTRO_FONTS,
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  },
});
