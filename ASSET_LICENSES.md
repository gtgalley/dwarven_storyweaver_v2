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

## Music and fire layer

- `public/audio/intro-hearth-lament.mp3`
  - Creator: RandomMind
  - Work: **Fantasy: Lament for a Warrior's Soul**
  - Source page: <https://opengameart.org/content/fantasy-lament-for-a-warriors-soul>
  - License: CC0 1.0 Universal
  - Use: renamed; looped as the intro music bed.
- `public/audio/intro-fire-crackle.ogg`
  - Creator: AntumDeluge
  - Work: **Fire Crackling**
  - Source page: <https://opengameart.org/content/fire-crackling>
  - License: CC0 1.0 Universal
  - Use: renamed; looped quietly in sync with the intro music through the same
    music control and master audio path.

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

Source and license information was verified on 2026-07-14.

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

### Cover, binding, and page-settling sounds

- `public/audio/book-cover-open.ogg`
- `public/audio/book-binding-creak.ogg`
- `public/audio/book-page-settle.ogg`
  - Creator: Kenney Vleugels, **50 RPG Sound Effects**
  - Source page: <https://opengameart.org/node/21999>
  - License: CC0 1.0 Universal
  - Original files: `bookOpen.ogg`, `creak1.ogg`, and `bookPlace1.ogg`
  - Use: renamed without transcoding; mixed at restrained levels through the
    existing UI and master audio buses.

### Page-turn sound

- `public/audio/book-page-turn.wav`
  - Creator: Voltiment555, **Book Flip Sounds**
  - Source page: <https://opengameart.org/content/book-flip-sounds>
  - License: CC0 1.0 Universal
  - Original file: `BookFlip2.wav`
  - Use: renamed without transcoding and synchronized with the 750 ms physical
    page-turn animation.

### Journey sparkle

- `public/audio/intro-sparkle.mp3`
  - Creator: Brandon Morris (submitted by HaelDB), **Completion sound**
  - Source page: <https://opengameart.org/content/completion-sound>
  - License selected for this project: CC0 1.0 Universal
  - Original file: `completetask_0.mp3`
  - Use: renamed without transcoding and played once as the word `journey`
    illuminates before the cover opens.
