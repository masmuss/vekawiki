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

This file tests various markdown features.

## Headings

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

## Emphasis

**Bold text**, _Italic text_, _**Bold and Italic**_, ~~Strikethrough~~, `inline code`.

## Blockquotes

> This is a blockquote.
>
> > Nested blockquote.

## Lists

### Unordered List

- Item 1
- Item 2
  - Sub-item A
  - Sub-item B

### Ordered List

1. First item
2. Second item
   1. Sub-item 2.1
   2. Sub-item 2.2

### Task List

- [x] Completed task
- [ ] Incomplete task

## Code Blocks

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}
```

## Tables

| Syntax    | Description |   Test Text |
| :-------- | :---------: | ----------: |
| Header    |    Title    | Here's this |
| Paragraph |    Text     |    And more |

## Links & Images

[Link to Google](https://google.com)

![Placeholder Image](https://placehold.co/600x400)

![Unsplash Image](https://images.unsplash.com/photo-1782046820445-d2798c847f8f?q=80&w=2370&auto=format)

## Horizontal Rule

---

## Footnotes

Here is a simple footnote[^1].
And here is a longer footnote[^bignote].

[^1]: This is the first footnote.

[^bignote]: Here's one with multiple paragraphs and code.

    Indent paragraphs to include them in the footnote.

    `{ my code }`

    Add as many paragraphs as you like.

## Wiki Links

You can link to other notes using wiki links: [[git-workflow]] or [[eduos-overview]].

## Callouts / Admonitions

> [!note]
> This is a note callout.

> [!warning]
> This is a warning callout!

> [!CAUTION]
> Watch out!

## Details and Summary

<details>
<summary>Click to expand</summary>

Here is some hidden content! You can even put **markdown** inside.
</details>

## Math / KaTeX

Math block:

$$
E = mc^2
$$

Inline math: $a^2 + b^2 = c^2$

## Definition Lists

Apple
: Pomaceous fruit of plants of the genus Malus in the family Rosaceae.

Orange
: The fruit of the citrus species Citrus × sinensis in the family Rutaceae.

## Highlights and Sub/Superscripts

You can highlight text like ==this==.
Subscript: H,,2,,O
Superscript: X^2^

## Keyboard Keys

Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy.
