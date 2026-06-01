# Portfolio Proof Sections Design

## Goal

Upgrade the portfolio so it better proves Hunter Ho is a founder, OSS/startup builder, speaker/teacher, and hackathon winner without exposing private CV employment details.

## Scope

- Fix the Founder Vision section so the banner can behave like a hero background and the tall poster is not cropped.
- Add a TrillionUnicorn / startup ecosystem section using public GitHub organization metadata and public project descriptions.
- Add a Speaker & Teaching section for free IT teaching, invitations, online/offline/onsite class support, and mentoring proof.
- Add a Hackathon Wins section using only achievement-level CV facts.
- Use provided teaching images as portfolio proof, but avoid overemphasizing unrelated channel clutter.
- Generate one project-bound teaching/speaker banner with the built-in image generation flow.

## Privacy Rules

- Do not add company names from the CV.
- Do not add employment history.
- Do not add sensitive provider lists, payment-provider details, regulated-system internals, or operational production numbers.
- It is acceptable to include high-level public-facing proof such as 18+ years hands-on IT, builder since 2007, AI automation, architecture, integrations, Web3, and hackathon wins.

## Content Model

The portfolio remains static HTML/CSS/JS. New sections are plain semantic HTML inserted after Founder Vision and before About. Styling extends the current premium dark/light design language with reusable proof cards. Tests assert required copy, URLs, and local assets.

## Image Strategy

- Use `founder-banner.jpeg` as Founder Vision background with a dark overlay for text readability.
- Show `founder-vision-poster.jpeg` with `object-fit: contain` and no fixed crop height.
- Copy teaching proof screenshots into the workspace under `images/teaching/`.
- Generate a new `images/teaching/speaker-teaching-banner.png` for the main section visual.

