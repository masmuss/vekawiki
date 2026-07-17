const TITLE_MAX_LENGTH = 60;
const DESCRIPTION_MIN_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 160;
const TITLE_SEPARATOR = " | ";

export function truncateByWordBoundary(
  text: string,
  maxLength: number,
): string {
  if (text.length <= maxLength) return text;
  const sliced = text.slice(0, maxLength + 1);
  const cutIndex = Math.max(
    sliced.lastIndexOf(" "),
    sliced.lastIndexOf("-"),
    sliced.lastIndexOf("|"),
  );
  const safeText =
    cutIndex > Math.floor(maxLength * 0.7)
      ? sliced.slice(0, cutIndex)
      : text.slice(0, maxLength);
  return `${safeText.trim()}...`;
}

export function normalizeTitle(raw: string, siteTitle: string): string {
  const baseTitle = raw.trim();
  const siteTitleTrimmed = siteTitle.trim();
  const hasSiteName = baseTitle
    .toLowerCase()
    .includes(siteTitleTrimmed.toLowerCase());

  if (hasSiteName) return baseTitle;

  const suffix = `${TITLE_SEPARATOR}${siteTitleTrimmed}`;
  const normalized = `${baseTitle}${suffix}`;

  if (normalized.length > TITLE_MAX_LENGTH) {
    const maxBaseLength = TITLE_MAX_LENGTH - suffix.length;
    if (maxBaseLength <= 0) return siteTitleTrimmed;
    return `${truncateByWordBoundary(baseTitle, maxBaseLength - 3)}${suffix}`;
  }

  return normalized;
}

export function normalizeDescription(
  raw: string | undefined,
  fallback: string,
): string {
  const base = (raw ?? "").trim() || fallback;

  if (base.length < DESCRIPTION_MIN_LENGTH) {
    return truncateByWordBoundary(
      `${base}. A living collection of interconnected notes on software engineering, tools, and ideas.`,
      DESCRIPTION_MAX_LENGTH - 3,
    );
  }

  if (base.length > DESCRIPTION_MAX_LENGTH) {
    return truncateByWordBoundary(base, DESCRIPTION_MAX_LENGTH - 3);
  }

  return base;
}

export function formatCanonicalURL(url: URL): string {
  const normalized = new URL(url.toString());
  normalized.hash = "";
  const path =
    normalized.pathname === "/" ? "/" : normalized.pathname.replace(/\/+$/, "");
  return `${normalized.origin}${path}${normalized.search}`;
}
