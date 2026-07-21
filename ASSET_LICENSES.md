# Brassreach External Asset Credits

The assets below were added for Visual Overhaul #2. Each is distributed under
CC0 1.0 Universal and may be copied, modified, and redistributed without an
attribution requirement. Credits are retained here for provenance.

## Material textures

- `public/img/materials/brass-scratched.jpg`
  - Source: ambientCG, **Metal007**
  - Source page: <https://ambientcg.com/view?id=Metal007>
  - License: CC0 1.0 Universal
  - Use: 1K color map, renamed and composited at low opacity in CSS.
- `public/img/materials/stone-scuffed.jpg`
  - Source: ambientCG, **Rock054**
  - Source page: <https://ambientcg.com/view?id=Rock054>
  - License: CC0 1.0 Universal
  - Use: 1K color map, renamed and composited at low opacity in CSS.

## Intro music and fire layer

- `public/audio/intro-hearth-lament.mp3`
  - Creator: RandomMind
  - Work: **Fantasy: Lament for a Warrior's Soul**
  - Source page: <https://opengameart.org/content/fantasy-lament-for-a-warriors-soul>
  - License: CC0 1.0 Universal
  - Use: renamed; looped as the intro music bed.
- `public/audio/intro-fireplace-loop.wav`
  - Creator: PagDev
  - Work: **Fireplace Sound loop**
  - Source page: <https://opengameart.org/content/fireplace-sound-loop>
  - License: CC0 1.0 Universal
  - Original file: `fire.wav`, a 29.26-second, 44.1 kHz stereo PCM recording.
  - Use: converted by `tools/process_intro_audio.py` to a normalized 22.05 kHz
    mono 16-bit PCM WAV, then looped quietly beneath the intro music through the
    same music control and master audio path. The longer natural recording
    replaces the short, repetitive crackle used in earlier versions.

## Inventory interaction sounds

- `public/audio/inventory-pickup.wav`
- `public/audio/inventory-place.wav`
- `public/audio/inventory-reject.wav`
  - Creator: BMacZero
  - Work: **Metal Impact Sounds**
  - Source page: <https://opengameart.org/content/metal-impact-sounds>
  - License: CC0 1.0 Universal
  - Use: three source sounds renamed for pickup, placement, and invalid-slot
    feedback; played through the existing UI/master audio controls.

Source and license information was verified on 2026-07-14; the replacement
fireplace recording was verified on 2026-07-20.

## Visual & RPG Overhaul #3

No new external runtime dependency, texture, artwork, font, music, or sound file
was added in Overhaul #3. The inventory and equipment presentation is original
HTML/CSS artwork informed only by classic action-RPG layout principles. It
reuses the documented CC0 material textures and inventory sounds above.

## Master Lore Story Overhaul #5

No new external asset or runtime dependency was added. The intro reuses the
documented CC0 stone and brass textures in place of late-game spoiler art.
Remote Google Fonts requests were removed so the game loads without external
network access; typography now uses the existing local system-font fallbacks.

## Living-Book Intro Refinement #9

The following assets were added on 2026-07-20. All are stored locally and are
distributed under CC0 1.0 Universal. Attribution is not required, but creator
credits are retained here for provenance.

### Parchment fibers

- `public/img/materials/parchment-fiber.jpg`
  - Creator/source: ambientCG, **Paper 001**
  - Source page: <https://ambientcg.com/view?id=Paper001>
  - License: CC0 1.0 Universal
  - Original file: `Paper001_1K-JPG_Color.jpg`
  - Use: renamed without recompression; tinted and layered in CSS for the book
    leaves, page stack, inside cover, and animated turning page.

### Page-settling sound

- `public/audio/book-page-settle.ogg`
  - Creator: Kenney Vleugels, **50 RPG Sound Effects**
  - Source page: <https://opengameart.org/node/21999>
  - License: CC0 1.0 Universal
  - Original file: `bookPlace1.ogg`
  - Use: renamed without transcoding and mixed quietly for physical page
    settling and intra-Folio passage changes.

### Cover-opening and page-turn sounds

- `public/audio/book-cover-open.wav`
- `public/audio/book-page-turn.wav`
  - Creator: Voltiment555, **Book Flip Sounds**
  - Source page: <https://opengameart.org/content/book-flip-sounds>
  - License: CC0 1.0 Universal
  - Original files: `BookFlip3.wav` and `BookFlip2.wav`
  - Use: renamed without transcoding. The longer `BookFlip3.wav` is filtered
    and slowed slightly for the heavy cover movement; the familiar
    `BookFlip2.wav` follows as the first page turn and remains the cross-Folio
    page sound. Both are mixed through the existing UI and master audio buses.

## Photoreal Living-Book Intro

The following artwork was generated specifically for Brassreach and is
original project artwork rather than an external library asset:

- `public/img/intro/living-book/closed-cover.webp`
- `public/img/intro/living-book/open-base.webp`
- `public/img/intro/living-book/art-city.png`
- `public/img/intro/living-book/art-archives.png`
- `public/img/intro/living-book/art-unfathomer.png`

The open-book base remains fixed at runtime. The three PNG files are
registered, feathered left-page overlays produced from the matching generated
source plates by `tools/build_living_book_assets.py`. This preserves identical
lantern, lectern, binding, page, lighting, and camera geometry across slides.

No new third-party runtime dependency, font, music, sound, or texture was added
for that pass. The cover, binding, page, settling, and music assets remain in
use; the subsequent refinement replaced the former sparkle and short fire loop.

## Photoreal Living-Book Refinement

The closed and open photographic plates were regenerated non-destructively by
`tools/build_living_book_assets.py`. Its edge masks graduate only the distant
upper background, narrow side boundaries, and cropped lower lectern edge into
true black; the book, lantern, registered paintings, and camera geometry remain
unchanged. The foreground haze and lantern pulse are original CSS effects and
add no runtime dependency.

The opening bass impact and low metallic shimmer are synthesized with the Web
Audio API. Intra-Folio passage changes reuse the documented CC0 page-settling
recording at a much lower gain and never play the page-turn sample.

The replacement fireplace recording is documented in the intro music section
above. Source and license information was verified on 2026-07-20.

## Living-Book Cinematic Refinement

The top and bottom viewport framing, full-width smoke, stronger mechanical
lantern pulse, and Journey charge are original CSS and Web Audio work. The
Journey cue uses a compressed orchestral-style impact, audible second harmonic,
and descending synthesized fundamental; no new transition recording or runtime
dependency was added.

The intro music is raised to 1.15 times its previous layer gain. The fireplace
layer receives that increase plus an independent additional 1.15 multiplier,
for a final layer gain of 0.29095 versus its former 0.22. Intro page and book
effects are likewise raised by approximately 15 percent with compression and
gain staging retained to prevent clipping.

The former Kenney `bookOpen.ogg` and `creak1.ogg` runtime copies were removed.
The replacement cover performance uses `BookFlip3.wav` from the already
documented CC0 **Book Flip Sounds** pack, followed by the existing `BookFlip2`
page turn. Source and license information was reverified on 2026-07-20.
