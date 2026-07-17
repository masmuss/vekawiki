import type { TreeNode } from "@/components/wiki/WikiNavNode.astro";

function isTreeNodeFolder(node: TreeNode): boolean {
  return Object.keys(node.children).length > 0;
}

export function sortTreeNodes(children: Record<string, TreeNode>): string[] {
  return Object.keys(children).sort((a, b) => {
    const nodeA = children[a];
    const nodeB = children[b];
    const aIsFolder = isTreeNodeFolder(nodeA);
    const bIsFolder = isTreeNodeFolder(nodeB);

    if (!aIsFolder && bIsFolder) return -1;
    if (aIsFolder && !bIsFolder) return 1;

    return nodeA.label.localeCompare(nodeB.label);
  });
}
