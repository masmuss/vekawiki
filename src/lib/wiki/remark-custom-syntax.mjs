import { findAndReplace } from "mdast-util-find-and-replace";
import { visit } from "unist-util-visit";

export function remarkCustomSyntax() {
	return (tree) => {
		findAndReplace(tree, [
			[
				/==([^=]+)==/g,
				(_match, content) => {
					return { type: "html", value: `<mark>${content}</mark>` };
				},
			],
			[
				/\^([^\^]+)\^/g,
				(_match, content) => {
					return { type: "html", value: `<sup>${content}</sup>` };
				},
			],
			[
				/,,([^,]+),,/g,
				(_match, content) => {
					return { type: "html", value: `<sub>${content}</sub>` };
				},
			],
		]);

		visit(tree, "delete", (_node) => {});
	};
}
