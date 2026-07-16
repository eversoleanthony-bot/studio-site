# Handoff: The Eversole Studio — Voice & Acting Studio Website

## Overview
A marketing/content site for a voice teacher, acting coach, director, and performer (Anthony Eversole, DMA), based in Salt Lake City. It covers lesson booking, organizational direction/workshop services, a performance/credits page, an editorial blog ("Studio Journal"), and standard about/legal pages.

## About the Design Files
The files in this bundle are **design references built as standalone HTML prototypes** (a proprietary "Design Component" format with inline styles and a small custom templating runtime — `support.js` is that runtime and is NOT meant to be reused in a real codebase). They demonstrate intended layout, typography, copy, and interaction — they are not production code to copy directly.

The task is to **recreate these designs in the target codebase's actual environment** (React, Vue, a static site generator, whatever the project already uses — or the best modern choice if starting fresh), using idiomatic components, a real stylesheet/CSS-in-JS approach, and routing, rather than inline styles and the custom template tags (`<sc-for>`, `<sc-if>`, `<x-import>`, `{{ }}` holes) seen in the source.

## Fidelity
**High-fidelity.** All spacing, type, and color values below are final as designed — pixel/hex values should be recreated exactly. Some content is explicitly placeholder (see "Placeholder Content" below) and should NOT be treated as final copy.

## Site Map / Pages
| File | Route purpose |
|---|---|
| Home.dc.html | Homepage — hero, testimonials, performance/writing teaser, journal links, book CTA |
| Lessons.dc.html | Lesson offerings, pricing/packages, FAQ, book CTA |
| Direction.dc.html | Music/stage direction & workshops for organizations, inquiry form |
| Performance.dc.html | Performance history, recordings (SoundCloud embed), credits |
| Writing.dc.html | Blog index ("Studio Journal") — filterable by category, email subscribe |
| About.dc.html | Bio, location/map placeholder |
| Book.dc.html | Booking page (embeds external scheduler placeholder) |
| Privacy.dc.html | Privacy policy (placeholder legal copy) |
| Terms.dc.html | Terms of service (placeholder legal copy) |
| Post-*.dc.html (10 files) | Individual blog posts — mix of image-heavy (6) and text-only (4) |

All pages share the same header nav and footer (see "Shared Layout" below).

## Shared Layout

**Header** (68px tall, border-bottom `#E2DACB`, padding `0 64px`):
- Left: wordmark "The Eversole Studio" (Newsreader serif, 20px, weight 500) + "Voice & Stage" kicker (11px, letter-spacing 0.2em, uppercase, `#8B8378`)
- Right: nav links (12px, weight 500, letter-spacing 0.14em, uppercase, `#6B675F`) — Lessons, For Organizations, Performance, Writing, About — plus a filled "Book a Lesson" button (`background:#221E19; color:#F6F1E7; padding:11px 22px`)

**Footer** (two-row):
1. Primary footer: studio name + nav link list, 11px uppercase, border-top `#E2DACB`, padding `28px 64px`
2. Legal/social row: `background:#EFE8DA`, padding `16px 64px`, 10.5px `#A89C88` — left: Privacy Policy / Terms links; right: Instagram / YouTube / Facebook (currently pointing to generic domains — replace with real profile URLs)

## Design Tokens

**Colors**
- Background (cream): `#F6F1E7`
- Background (warm tint / alt section): `#EFE8DA`
- Ink (primary text/dark fill): `#221E19`
- Body text: `#33302A`
- Secondary text: `#57534A`
- Muted text: `#6B675F`
- Faint/meta text: `#8B8378`, `#A89C88`
- Accent (rust/terracotta — links, kickers, category labels): `#7E3B2C`
- Border/hairline: `#E2DACB`
- Dark band accent text: `#DDB9A6`, `#C9A48E`

**Typography**
- Display/headings/editorial: `Newsreader` (serif), weights 300 (large display), 400, 500; italic used for pull quotes and editorial emphasis
- UI/nav/labels/body-UI: `DM Sans` (sans-serif), weights 400–600
- Kickers/eyebrows: 11–12px, weight 500–600, letter-spacing 0.14–0.24em, uppercase
- H1 (post titles): ~46px, Newsreader 400, line-height 1.15
- H1 (page display, e.g. legal pages): ~52px, Newsreader 300, line-height 1.05
- Body copy (posts): Newsreader serif, ~17–20px, line-height 1.7–1.8

**Spacing / structure**
- Page horizontal padding: 64px (24px on legal-page inner content, which is a centered 720px column)
- Section vertical padding: 56–88px
- Standard border: 1px solid `#E2DACB`

## Interactions & Behavior
- **Lightbox** (all 6 image-heavy posts): click any photo → full-size view on dark overlay; closes via backdrop click, × button, or Esc. Images are Squarespace-CDN-hosted thumbnails (~583×700px) scaled via `object-fit: contain`.
- **Writing.dc.html filter chips**: All / Pedagogy / Character Work / Dramaturgy / Productions — clicking sets active state (filled dark chip vs. outlined) and filters the post list client-side; shows an italic "No posts in this category yet" empty state.
- **Writing.dc.html email subscribe**: input + button in a dark band; on submit with non-empty text, swaps to a "Thanks — you're on the list" confirmation. **No backend** — needs real email-capture service integration (Mailchimp, ConvertKit, etc.).
- **Direction.dc.html inquiry form**: Name / Organization / Email / Message inputs; "Send Inquiry" is a `mailto:` link that pre-fills subject/body from form state and opens the visitor's email client. **No backend** — should be replaced with a real form submission (e.g. to an email API or CRM) in production.
- **Performance.dc.html** "View Credits & Résumé" button scrolls to an in-page `#credits` anchor — it does not download a PDF (no résumé file exists yet).

## Placeholder Content — replace before launch
- **Testimonials** (Home.dc.html): 3 fabricated quotes + circular photo-slot placeholders (student/director names are made up).
- **FAQ** (Lessons.dc.html): 4 reasonable-guess Q&As — verify against actual studio policy.
- **Map/location block** (About.dc.html): diagonal-stripe placeholder graphic where a real map embed (Google Maps iframe or similar) should go; exact studio address is intentionally withheld pending owner decision on whether to publish it.
- **Legal pages** (Privacy.dc.html, Terms.dc.html): generic boilerplate language — have reviewed by an actual legal advisor before publishing.
- **Social links**: Instagram/YouTube/Facebook footer links point at bare domains, not real profile URLs.
- **SoundCloud embed** (Performance.dc.html): contains a literal placeholder string in place of a real playlist URL — needs a real SoundCloud (or other) embed URL.
- **Booking widget** (Book.dc.html): placeholder in place of the real booking-provider embed (e.g. My Music Staff, Acuity).
- **All photography**: every image is either a Squarespace-CDN legacy asset or an empty `image-slot` drag-and-drop placeholder — needs final photography throughout.

## Assets
- All post photography currently hot-links to `images.squarespace-cdn.com` (from the studio's prior Squarespace site) — these should be downloaded and re-hosted properly, not left as a live dependency on the old site.
- `image-slot.js` — a small web component used for drag-and-drop image placeholders (testimonial photos). Not needed in the rebuilt codebase unless useful as a CMS placeholder pattern.
- No custom icon/illustration assets — the design uses no iconography beyond text and a generated favicon (rust square with serif "E").

## Files in This Bundle
All 19 page files plus `support.js` (the prototype's template runtime — reference only, don't port) and `image-slot.js` (placeholder-image web component — reference only). Open any `.dc.html` file directly in a browser to view it.
