# Handoff: academic redesign of anthonyeversole.com

Written October 12, 2026. Branch: `claude/modest-pasteur-9vfaw8` (4 commits ahead of `main`, nothing merged, nothing deployed). This file lives in `notes/`, which is excluded from the deployed site by `.assetsignore`.

## Goal

Shift the site from a local private studio toward an academic profile (aiming to return to higher ed), keeping the existing visual style. Model: Lori Sen's site (Home, About with Biography and CV, Performances, Voice Studio, Research with subject areas, Contact), adapted so Directing has its own nav item.

## What changed

New nav on every page: **About, Performances, Directing, Research, Teaching, Contact**, plus a "Book a Lesson" button. Footers match, with "Writing" linking to the blog.

| Page | Notes |
|---|---|
| `index.html` | Rebuilt. Hero "Directing and teaching the singing actor", tabs for Performance / Directing / Research / Teaching & Studio, OperaBot feature band, About section, recent writing, recent performances, studio band. |
| `about.html` | Bio (drafted from the July 2026 CV and the 2021 bio), headshot, links. |
| `cv.html` | Built from the July 2026 CV (`Academic Job Materials/UofUMaterials/Dr_Anthony_Eversole_CV.pdf` in Dropbox). No phone, personal email, or references published. |
| `performances.html` | Recordings, photos, performing credits, moved from `on-stage.html`. |
| `directing.html` | Directing credits with photo galleries, OperaBot feature, production dramaturgy index, guest-direction inquiry form. Moved from `organizations.html`. |
| `research.html` | Four threads (see below). |
| `operabot.html` | Case study of the 2019 robot collaboration. |
| `teaching.html` | University teaching, philosophy, private studio, workshops, music production. |
| `on-stage.html`, `organizations.html` | Now redirect stubs (meta refresh plus JS that keeps the hash). |
| `philosophy.html` | Now linked from About; `noindex` removed. |

Research threads: (1) Opera & Performance Studies, (2) Pedagogy of the Singing Actor, (3) Musical Analysis, Song & Text, (4) Performance & Technology. PDFs are in `research/`: dissertation, Butterfly paper, Finzi paper, Beethoven paper (merged with its bibliography, about 7 MB).

Other fixes: `.assetsignore` no longer excludes `research/` (the old On Stage page linked PDFs that were never deployed); audio seek bar no longer overflows on phones.

## How to deploy

Not done. `wrangler.toml` points at a Cloudflare Worker with static assets; the repo has no CI workflow, so it is unknown whether Cloudflare builds from `main` automatically.

1. Check the Cloudflare dashboard (Workers & Pages, `studio-site`, Settings) for a connected Git repo and whether branches get preview URLs. A preview URL would allow review without touching `main`.
2. If it builds from `main`: open a PR for this branch on GitHub, review, merge.
3. If you deploy by hand: `git status` (save any local edits first), `git fetch origin`, merge or check out the branch, then `npx wrangler deploy`. Prefer merging to `main` first so `main` matches what is live.
4. The Dropbox copy at `Claude/Studio Site` is stale (July to early August). Work from a clone of the GitHub repo.

## Decide or verify before going live

1. **Paper titles differ** between the CV and the site. Butterfly: site "Japonisme, Authenticity, and Anti-Imperialism..." vs CV "...Musical Borrowing...". Finzi: site "The Words That Chose Him" vs CV "The Frailty of Days". The site currently uses its own titles.
2. **Beethoven title** says "Sonata Op. 28, No. 4". The paper discusses the finale (fourth movement) of Op. 28, which is Piano Sonata No. 15. Probably reword.
3. **Typo in the Beethoven PDF:** "Presto alla tecesca" (should be "tedesca") in Figs. 6, 7, 8, and 11a. The PDF will be public; consider correcting and re-exporting.
4. **Planned items** on the Research page (zarzuela libretti, Acting for Singers curriculum) come from a 2019 research plan. Confirm they are still planned.
5. **OperaBot wording:** you are the stage director described in the paper and are thanked in the acknowledgments. You are not an author. The CV lists it under Research & Scholarship as "Collaborative research". The "What I take from it as a teacher" paragraph on `operabot.html` is a draft for you to edit.
6. **Unverified links:** the two lab YouTube videos on `operabot.html` (taken from the lab's slide deck) and https://www.charismarobotics.com/publications.
7. **Credit discrepancies** between the old site and the July 2026 CV. I used the CV on the CV page; `directing.html` still has the old-site values.
   - So Many Possibilities: 2017 (site) vs 2018 (CV).
   - Fauré Requiem and Britten War Requiem are on the Performances page but not the CV.
   - Rutter Gloria, Handel Messiah, and the roles Marullo, Plunkett, Bartley, Pastey, Pasquale, and Windy are on the CV but not the Performances page.
   - "Nathan Fifeld" (conductors list) is probably "Fifield". Left as written.
8. **Tuck Everlasting** is shown as "Recent" on the home page and removed from the upcoming list, assuming the run has closed by launch. Revert if it publishes earlier.
9. **Home page:** the student testimonial (Eli Nicholas, studio alumnus) and the empty-stage hero photo are unchanged. Consider a testimonial from a university student and a photo of you directing or performing.
10. **Performance photo** on `operabot.html` is 865 px wide, extracted from the paper PDF. Replace with the original if available (`images/directing/mozartistry/operabot-graveyard-scene.jpg`).

## Known issues not touched

- `posts/tuck-nine-questions.html` links to `downloads/Preparation - Nine Questions.pdf`, which is not in the repo.
- The old services copy on `directing.html` ("Vocal Direction", "Stage Direction" cards) still uses em dashes from the original text.
- No CV PDF download yet. The CV is HTML only (it prints cleanly; print styles hide nav and footer).
- No sitemap or canonical tags (none existed before).

## Ideas for next steps

- Real-phone check of every new page.
- A downloadable CV PDF without personal contact details.
- Student testimonials and teaching evidence (syllabi, evaluations) for the Teaching page.
- Video excerpts of performance or directing (NATS faculty postings often ask for a performance video).
- Ask Dr. Heather Knight's lab for permission before embedding their videos, and for confirmation of the OperaBot details.

## Working notes for whoever edits next

- Static HTML. Each page has its own inline `<style>`; shared tokens and components are in `styles.css`; design tokens are listed in `design-system.json`.
- The nav and footer are identical copies in all 27+ pages (including `posts/`). To change them, use find and replace across files. `posts/` pages use `../` paths.
- `html_handling = "none"` in `wrangler.toml`, so links need `.html`.
- Voice rules: no em dashes, no AI-isms, warm and specific. The copywriting skill and `HANDOFF.md` (Dropbox) describe this.
- `worker.js` handles booking endpoints and the `/larynx` alias. Do not change them for content work.
- `posts-data.js` drives the blog index and the home page writing strip.

## Where things are

- Research summary for Claude chat (public): `notes/research-summary.md`, at https://github.com/eversoleanthony-bot/studio-site/blob/claude/modest-pasteur-9vfaw8/notes/research-summary.md
- Private preview of the Research page: https://claude.ai/artifact/AgfiMwEW9brywTVj6i5Mbv (share from its Share menu if needed)
- Source materials in Dropbox: `Academic Job Materials/UofUMaterials/` (July 2026 CV and philosophy), `OperaBot/` (slides and paper), `Research/`, `music research/`, `Opera History/`.
- The paper's Springer page: https://doi.org/10.1007/978-981-95-2398-6_48
