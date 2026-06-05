# Portfolio_1 LLM Notes

This file captures repeat mistakes and decisions for future AI edits.

Read CX before non-trivial Portfolio_1 edits, then verify current files. Keep performance rules visible in every hero, media, and library-loading change.

## Lessons

- Do not make the hero headline feel buggy. Avoid character typing/deleting; rotate complete phrases with a hold.
- Do not leave the navbar visible at the very top of the hero. It should appear after scroll.
- Do not overload the Startup Lab. It is a portfolio section, so keep it compact.
- Do not use full generated images as text containers. Contact details, CTAs, and proof copy must remain HTML.
- Do not preload lower sections. Hero first, text first, lazy below.
- Do not keep optional library scripts in the critical path. Lazy-load feature plugins only if needed.
- Do not claim image optimization is complete just because assets exist. Check formats, sizes, references, and actual browser loading.

## Accepted Current Decisions

- Hero: selected Option C interactive 3D hero. Homepage uses optimized `images/hero-options/option-c-three-source.jpg`; `hero-options.html` keeps the original PNG source for comparison.
- Hero CTAs: `Hire for a project`, `Book Me for Event`, `Projects Demo`.
- Release badge: `Hunter v2.0.2`, linked to the HunterHo07 GitHub profile.
- Hero popup: uses `images/hero-layers/hero-hunter-cutout.webp`, appears after 15 seconds at the hero, rotates short messages, and exits when scrolling away.
- Startup Lab: second section after hero, embedded YouTube video `KRxQ8JuqMyE`, seven compact icons only.
- Assets 3: `qstyle-3d-models-lab` must stay a real GLB catalog with local `models/*.glb`, `models/manifest.json`, downloadable links, and embedded animations where claimed. Do not revert it to only procedural runtime shapes.
- Verification habit: use TDD, browser screenshots, and CX notes for durable changes.
