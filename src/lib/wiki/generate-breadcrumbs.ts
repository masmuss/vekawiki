export type Breadcrumb = {
  label: string;
};

export function generateBreadcrumbs(path: string): Breadcrumb[] {
  const segments = path.split("/").filter(Boolean);
  return segments.map((segment, index) => {
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    return {
      label,
    };
  });
}
