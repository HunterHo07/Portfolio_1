# Portfolio Interactive Upgrade Plan

## Tasks

- [ ] Preserve existing Project 24 URL change.
- [ ] Generate or prepare improved project-bound image assets:
  - [ ] hero banner optimized for header usage
  - [ ] mobile app demo thumbnails
  - [ ] additional 3D models demo thumbnail
  - [ ] additional game demo thumbnails if needed
- [ ] Create two public mobile demo repos:
  - [ ] WarrantyScan Mobile
  - [ ] NameCard Mobile
- [ ] Add a new portfolio Mobile App Demo section with two cards and Details buttons.
- [ ] Rename `Demo Mini Games` to `Games Demo` and expand to nine cards.
- [ ] Rename `RunJian 3D Assets Demo` to `3D Models Demo` and expand to three cards.
- [ ] Upgrade Details modal structure and JavaScript:
  - [ ] richer project story fields
  - [ ] clickable skill chips
  - [ ] reusable 3-5 second mini demo panel
- [ ] Add parallax and scroll animation system.
- [ ] Add gray husky helper with random EN/CN speech and WhatsApp CTA.
- [ ] Add EN/CN i18n system and language toggle.
- [ ] Update tests for new required content and behaviors.
- [ ] Run `pnpm test`.
- [ ] Run browser QA on desktop and mobile.
- [ ] Commit and push portfolio changes.

## Implementation Notes

- Use static HTML/CSS/JS in the current repo.
- Use public GitHub metadata where possible, but present wording as premium and client-value oriented.
- Keep all generated assets inside the workspace before referencing them.
- Use `pnpm` only for project scripts.
