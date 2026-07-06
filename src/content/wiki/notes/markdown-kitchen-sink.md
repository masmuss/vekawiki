---
title: "Markdown Kitchen Sink"
description: "Testing all markdown features available in the wiki."
createdAt: 2026-07-06
updatedAt: 2026-07-06
tags: ["markdown", "test"]
isPinned: true
growthStage: "evergreen"
---

# Markdown Kitchen Sink

This document serves as a comprehensive guide and test suite for all Markdown features available in the wiki. It demonstrates how various elements are rendered and provides the exact syntax needed to recreate them.

## Headings

Headings help structure your document. Use hash symbols (`#`) to create headings from level 1 to level 6.

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

**How to write it:**

```markdown
# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6
```

## Emphasis

You can emphasize text using bold, italics, strikethrough, or inline code formatting.

**Preview:**
**Bold text**, _Italic text_, _**Bold and Italic**_, ~~Strikethrough~~, `inline code`.

**How to write it:**

```markdown
**Bold text**, _Italic text_, _**Bold and Italic**_, ~~Strikethrough~~, `inline code`.
```

## Blockquotes

Blockquotes are useful for quoting text from external sources or highlighting important information.

**Preview:**

> This is a blockquote.
>
> > Nested blockquote.

**How to write it:**

```markdown
> This is a blockquote.
>
> > Nested blockquote.
```

## Lists

Organize your content using unordered lists, ordered lists, or task lists.

### Unordered List

**Preview:**

- Item 1
- Item 2
  - Sub-item A
  - Sub-item B

**How to write it:**

```markdown
- Item 1
- Item 2
  - Sub-item A
  - Sub-item B
```

### Ordered List

**Preview:**

1. First item
2. Second item
   1. Sub-item 2.1
   2. Sub-item 2.2

**How to write it:**

```markdown
1. First item
2. Second item
   1. Sub-item 2.1
   2. Sub-item 2.2
```

### Task List

**Preview:**

- [x] Completed task
- [ ] Incomplete task

**How to write it:**

```markdown
- [x] Completed task
- [ ] Incomplete task
```

## Code Blocks

Use fenced code blocks to display multi-line code snippets with syntax highlighting.

**Preview:**

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}
```

**How to write it:**

````markdown
```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}
```
````

## Tables

Tables are great for organizing structured data.

**Preview:**

| Syntax    | Description |   Test Text |
| :-------- | :---------: | ----------: |
| Header    |    Title    | Here's this |
| Paragraph |    Text     |    And more |

**How to write it:**

```markdown
| Syntax    | Description |   Test Text |
| :-------- | :---------: | ----------: |
| Header    |    Title    | Here's this |
| Paragraph |    Text     |    And more |
```

## Links & Images

Embed links and images easily.

**Preview:**
[Link to Google](https://google.com)

![Placeholder Image](https://placehold.co/600x400)

**How to write it:**

```markdown
[Link to Google](https://google.com)

![Placeholder Image](https://placehold.co/600x400)
```

## Horizontal Rule

Create a thematic break using three or more dashes.

**Preview:**

---

**How to write it:**

```markdown
---
```

## Footnotes

Footnotes are perfect for adding references or supplementary details without cluttering the main text.

**Preview:**
Here is a simple footnote[^1].
And here is a longer footnote[^bignote].

[^1]: This is the first footnote.

[^bignote]: Here's one with multiple paragraphs and code.

    Indent paragraphs to include them in the footnote.

    `{ my code }`

    Add as many paragraphs as you like.

**How to write it:**

```markdown
Here is a simple footnote[^1].
And here is a longer footnote[^bignote].

[^1]: This is the first footnote.

[^bignote]: Here's one with multiple paragraphs and code.

    Indent paragraphs to include them in the footnote.

    `{ my code }`

    Add as many paragraphs as you like.
```

## Wiki Links

Link internally to other notes in the wiki quickly.

**Preview:**
You can link to other notes using wiki links: [[git-workflow]] or [[eduos-overview]].

**How to write it:**

```markdown
You can link to other notes using wiki links: [[git-workflow]] or [[eduos-overview]].
```

## Callouts / Admonitions

Use callouts to draw attention to important warnings, notes, or tips.

**Preview:**

> [!note]
> This is a note callout.

> [!warning]
> This is a warning callout!

> [!CAUTION]
> Watch out!

**How to write it:**

```markdown
> [!note]
> This is a note callout.

> [!warning]
> This is a warning callout!

> [!CAUTION]
> Watch out!
```

## Details and Summary

Create interactive, collapsible sections for extra content.

**Preview:**
<details>
<summary>Click to expand</summary>

Here is some hidden content! You can even put **markdown** inside.
</details>

**How to write it:**

```markdown
<details>
<summary>Click to expand</summary>

Here is some hidden content! You can even put **markdown** inside.
</details>
```

## Math / KaTeX

Display complex mathematical formulas and equations using KaTeX syntax.

**Preview:**
Math block:

$$
E = mc^2
$$

Inline math: $a^2 + b^2 = c^2$

**How to write it:**

```markdown
Math block:

$$
E = mc^2
$$

Inline math: $a^2 + b^2 = c^2$
```

## Definition Lists

Use definition lists to present terms and their corresponding descriptions.

**Preview:**
Apple
: Pomaceous fruit of plants of the genus Malus in the family Rosaceae.

Orange
: The fruit of the citrus species Citrus × sinensis in the family Rutaceae.

**How to write it:**

```markdown
Apple
: Pomaceous fruit of plants of the genus Malus in the family Rosaceae.

Orange
: The fruit of the citrus species Citrus × sinensis in the family Rutaceae.
```

## Highlights and Sub/Superscripts

We support custom syntax for highlighting text and adding sub/superscripts.

**Preview:**
You can highlight text like ==this==.
Subscript: H,,2,,O
Superscript: X^2^

**How to write it:**

```markdown
You can highlight text like ==this==.
Subscript: H,,2,,O
Superscript: X^2^
```

## Keyboard Keys

Represent keyboard inputs elegantly.

**Preview:**
Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy.

**How to write it:**

```markdown
Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy.
```
