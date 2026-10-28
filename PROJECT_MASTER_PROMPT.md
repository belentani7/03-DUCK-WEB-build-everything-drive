# PROJECT_MASTER_PROMPT — DUCK Sound Lab (design archive)

## Identity and source of truth
This repository is **the archived design variant** of DUCK Sound Lab, not the canonical DUCK production site. Its canonical counterpart is the separate existing `belentani7/03-DUCK-WEB-build-everything`. Preserve this repo's distinctive neon-green visual experiment and history. The original producer DUCK's verified music credits are not automatically Belentani's releases.

## Actual code
- `index.html`: static PT/ES/EN design-archive landing page and interactive production-process catalog.
- `studio.html`: local Web Audio API drum sequencer, keys, mixer, effects, optional microphone and local recording/export.
- `tests/studio.test.mjs`: Node DOM-contract and source syntax regression checks.
- `.github/workflows/studio.yml`: Node tests; GitHub Actions status must be checked independently.
- `robots.txt`: no indexing. Do not invent an official discography, streams, links, clients or awards.

## Product goal
Maintain a useful, accessible and truthful **non-indexed design and music-technology demonstrator**. PT/ES/EN must translate actual rendered cards, not only section headings. All interactions must work with mouse, touch and keyboard. Keep mic opt-in and audio/files in the browser. No remote storage or payment integrations.

## Delivery gates
Run `node --test tests/studio.test.mjs`, check JS syntax, mobile menu keyboard and ARIA behavior, validate Web Audio behavior in a real HTTPS/localhost browser, then verify CI. The source-only V8 DOM simulation is not a browser audio test. Do not merge or deploy when CI is blocked or tests unverified. Do not publicize this private archive or publish unverified musical credits.

## Execution constraints
No new repository, rename, paid API, secrets, destructive cleanup or publication. Keep this archive separate from the canonical DUCK Studio. PRs and SHA-backed checkpoints are required for every change.
