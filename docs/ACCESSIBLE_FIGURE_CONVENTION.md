# Accessible figure convention

An architecture diagram with no text restatement is a **picture of a system** to a
screen-reader user, not a description of one. The convention below is how this
project keeps every data-carrying figure accessible without turning every figure
into prose.

Two components implement it. **EngineeringFigure** wraps every figure in the case
studies. **SignatureVisual** is the homepage's equivalent — same discipline, its
own descriptive text, same disclosure pattern. A new figure is accessible when it
fits one of those shapes; the checklist below is what "fits" means.

## The rule

A figure is accessible when a reader who cannot see it still gets the same
information. That requires three things, in order of how much they cost:

1. **A real accessible name.** `aria-labelledby` pointing at a visible title the
   reader can already scan — not a hidden label invented for AT.
2. **A description.** `aria-describedby` pointing at the figure's caption text (or
   a hidden `<p>` restating the title when there is no caption). The description
   is what a screen reader announces after the name.
3. **A text restatement when the drawing encodes meaning the caption cannot.**
   The "Read this figure as text" disclosure — a `<details>` block — is the
   fallback. It is the same information as the figure, in words, available to
   everyone without adding permanent visual noise. Not every figure needs one:
   only figures whose takeaway is not recoverable from the caption alone.

Number the figures (`Fig. 03`). That is the register an engineering document uses
and it lets prose reference them by number.

## EngineeringFigure — the case-study shell

`components/work/figures/EngineeringFigure.tsx`

```tsx
<EngineeringFigure
  number={3}
  title="Pipeline stages and their outputs"
  caption="Each stage takes the previous stage's artefact as input and emits a
  validated artefact of its own. Stages are sequential; a stage never reads a
  later stage's output."
  fallback={
    <ul>
      <li>Stage 1 — input: raw event stream; output: canonical event model.</li>
      <li>Stage 2 — input: canonical model; output: validated simulation run.</li>
    </ul>
  }
>
  {/* the SVG / diagram itself */}
</EngineeringFigure>
```

What the wrapper forces:

- `<figure>` with `aria-labelledby={titleId}` (the visible "Fig. 03 … title")
  and `aria-describedby={descId}`.
- `<figcaption>` with the figure number and title, then the caption as a
  `<p>` **when a caption is provided**.
- When a caption is **not** provided, a visually-hidden `<p class="sr-only">`
  restating the title, so `aria-describedby` still points at real text and never
  at an empty node.
- Optional `fallback` → a `<details>` block whose summary is the literal text
  "Read this figure as text", rendered in the same typographic register as the
  caption. The block is not required; pass it only when the figure carries
  information the caption cannot.

## SignatureVisual — the homepage equivalent

`components/home/SignatureVisual.tsx`

The homepage figure is not wrapped by `EngineeringFigure` because it is a hero
element in layout prose, not a captioned figure in a case study. It still obeys
the same contract:

- The desktop `<svg>` carries `role="img"`, an `aria-label` describing the two
  channel figure, and `aria-describedby="signature-figure-desc"` pointing at the
  `<p>` beneath it.
- The mobile SVG is a cropped single-channel illustration with its own
  `aria-label` ("Schematic circuit map with three marked sectors."). It is not
  described by the desktop description — the two are different figures framed for
  different viewport widths from the same geometry.
- A descriptive `<p>` lives beneath the figure (`id="signature-figure-desc"`),
  in the same caption position `EngineeringFigure` would use.
- The same "Read this figure as text" `<details>` block restates the desktop
  figure in words, drawn from a `FIGURE_TEXT` constant so the description and the
  restatement cannot drift apart.

## Naming and IDs

- Titles and descriptions get stable IDs derived from the figure number or a
  fixed semantic id (`signature-figure-desc`). Do not author ids ad hoc inside
  prose; keep the id next to the element it describes.
- The accessible name is **visible text** when one exists (the title, the caption).
  Do not duplicate a visible label as a hidden `aria-label` — that is the kind of
  double-announcement that reads as broken.

## When a figure does not need a textual fallback

A figure whose meaning is fully captured by its caption and title does not need a
`fallback` / `FIGURE_TEXT`. Examples: a photo whose caption already states what it
shows; a decorative ornament. The test is whether removing the figure leaves the
reader with less information than the caption alone provides. If yes, write a
fallback. If no, skip it.

## Motion is separate

The accessible-name and text-restatement contract is independent of motion
preference. The reduced-motion path (fully-drawn static figure, motif mask absent
under `prefers-reduced-motion: reduce`) is a separate invariant, governed by the
CSS gate in `lib/motion.test.ts` and verified live in `lib/reduced-motion.test.ts`.
Do not weaken either to satisfy the other.

## Checklist for a new figure

- [ ] Does it have an accessible name? (visible title, referenced by
      `aria-labelledby`)
- [ ] Does it have a description? (caption text, referenced by
      `aria-describedby`; or a hidden `<p>` restating the title)
- [ ] If the figure's takeaway is not recoverable from the caption alone, is there
      a text restatement? (EngineeringFigure `fallback`, or SignatureVisual's
      `<figure>`-equivalent `details` block)
- [ ] Are the figure and the restatement the same information, or did one drift?
- [ ] If it is animated, does reduced motion get the finished static figure, not a
      mid-draw hidden state?

## References

- `components/work/figures/EngineeringFigure.tsx` — the case-study wrapper.
- `components/home/SignatureVisual.tsx` — the homepage figure and its equivalent.
- `lib/motion.test.ts` — the CSS gate asserting every animation is inside the
  reduced-motion opt-in.
- `lib/reduced-motion.test.ts` — the live-browser assertion that the composed page
  computes `content: none` on the motif mask and `stroke-dashoffset: 0px` on the
  signature trace under `prefers-reduced-motion: reduce`, plus that the signature
  figure's text disclosure is still present.
