# Whole campaign: playtest and production notes

## Start here

Play a fresh commission in the isolated `?playtest=whole-campaign` save. The normal URL keeps the book intro and the player's existing save. Run `node tests/serve-playtest.mjs --preview` in this checkout, then open <http://127.0.0.1:4176/?playtest=whole-campaign>. To read the new prose without rolling, start with [the authored scenes](../public/js/campaign.js). The author's rewrite workbook is unchanged.

At Dorrin’s desk, the rope and the hood each get a demonstration or a specific use before the choice. The player need not know how the city's pipes work. Apply that same test at the Well, the deck, the ring, and the three dials: **what is in front of me, what can I do with it, and what still isn't known?**

## Two routes to try (spoilers)

- **Pump first:** At Orra’s barricade, send the six workers to the reserve pump. Choose between draining homes or keeping the escape stair dry. In the Brassworks, send a second crew to check on the families, or keep the available hands for other work.
- **Households first:** Search the last house for the boy’s grandmother, or move five families onto higher ground and leave a guide. Later you can send a fitter back to connect the intake. Shelter is not a substitute for a working pump, and a working pump is not a head count.
- The two routes share the Archives, Brassworks and Gate. They are not separate campaigns. Each preserves all three Keys and offers more than one final decision. Decisions and crew preparation determine which settings are possible; the final choice is not decided by a die roll. A night of relief is not a cure for the city.
- Brunna issues twelve gold for field supplies with the Deep Writ. If you save that and the five starting gold, you can afford Sella's gloves without selling equipment or changing your stats.
- To try a guaranteed gear action: bring the handler's whistle to the old lift, or buy Foundry Gloves from Sella and equip them **before** changing the hot ring. The whistle works from the pack; the gloves must actually be worn. Other checks still distinguish carried items from equipped ones.

## Saves and presentation

Existing scene IDs, save keys, recorded passages and endings are kept. New outcomes are recorded only after the corresponding decision. A returning player beyond Orra does not get an invented evacuation or pump assignment. Historical evidence wording still counts toward its corresponding check. Fresh and resumed playtests are separate from normal saves.

Six races have two portrait choices each. The editor previews the face, and the story and inventory show its full-length counterpart. Equipped items have named readouts and position markers, not twelve painted variants per garment. The Record Well, Ninth Platform and last chamber each have an optional illustration under the objective. None supplies a clue the reader cannot get from the text.

## Temporary score: replacement cues

| Where | What the player hears | Direction for a future score |
| --- | --- | --- |
| Book and bell stair | Existing intro score, fire and book Foley. The bell sounds before the pipe knocks. | Leave room after the bell; the delay also appears in the text. |
| Halls | Existing field prelude and civic music. | Keep speech at the desk and the market easy to follow. |
| Archives | Kimiko Ishizaka’s complete recording of Bach’s Goldberg Aria; the former track remains a decode fallback. | One unhurried solo line. Avoid short repeating fragments. |
| Cisterns and Brassworks | Existing deep-works score, shifting to the darker cue at the platform and stalled lift. | Mark a specific danger, then release the tension when people are safe. |
| Gate and contact | The deeper cue at the Gate; no background score at the water or during the final decision. | Give the reader silence here. Do not make the presence speak. |
| Epilogues | Aria returns for a strong outcome; the prelude returns for a strained one. | Two different responses to the same journey, not a victory fanfare. |

The cue map is in `BGM.updateForState`; sources loop, normal swaps crossfade over 1.4 seconds, and player music settings remain in force. [Recording and art credits](../ASSET_LICENSES.md).

## Verification

The `whole-campaign-playtest` browser suite starts five isolated runs at Brunna’s table, follows the actual choices, accepts failures, reloads in the field, and checks the stored ending against the displayed result. The cases cover both assignments, all four local decisions, deferred help, an equipped-only action, all three Keys and five endings. Transcripts and screenshots are generated under `tests/artifacts/whole-campaign/`. Structural tests check all 39 scenes, 98 choices and the success/failure prose for 52 checks. Browser walkthroughs establish reachability, not whether a first-time reader will anticipate each result.

## Art briefs

Built-in raster image generation, optimized to WebP for local delivery. Two registered sheets use the same race/portrait order; no generation or external lookup is needed at runtime. Prompts used for the field assets follow.

### portraits

Stylized-concept. Original character casting atlas for Brassreach. Use the provided image only as a style reference for lighting, work clothes and realism. EXACTLY twelve distinct individual bust portraits in rigid equal-width/equal-height 4 columns by 3 rows on a flat smoky charcoal ground. Every cell shows one single centered face and shoulders, full head with spare margin. No labels, dividers, typography or props. Row 1: broad bearded male dwarf; mature female dwarf with short tied copper hair; dark-skinned male human; brown-skinned female human. Row 2: tall male elf, swept black hair pointed ears; female elf with cropped pale hair and pointed ears; older male gnome with broad nose; female gnome with copper curls and broad nose. Row 3: curly haired male halfling; curly haired female halfling; large olive-grey male orc with small tusks; strong olive-grey female orc with small tusks. Dignified individual adults of a working city, simple linen collars. Each face must be centered within exactly one grid cell and readily visible at thumbnail size. No helmets or equipment. Landscape 4:3 atlas.

### platform

Illustration-story. Wide cinematic realistic oil painting of one particular rescue in Brassreach, a dwarven underground city. From a narrow stone service ledge in the lower left foreground look across a visible six-foot gap at a rectangular pump deck hanging from three iron chains beside a cavern wall. Warm lamps light a group of soaked pump workers at a jammed door at the rear of the deck. One stone bracket beneath the deck has cracked. Smooth mirror-black reservoir just below the deck not a raging sea. Art deco brass mechanisms, dark wet stone, practical workwear, immediate danger. Camera shows the gap, rear door and crowd clearly. No text, no borders, no foreground hero or monster.

### models

Identity-preserve. Production full-body character atlas for a dwarven RPG, same twelve faces, races, genders and exact reading order as this reference face atlas. Precisely FOUR columns by THREE rows. Each of twelve equal cells contains one standing person, crown to boots fully visible with room around all sides. Whole atlas portrait orientation (cells taller than wide); do not add gutters, labels or frames. Row 1 male dwarf, female dwarf, male human, female human. Row 2 male elf, female elf, male gnome, female gnome. Row 3 male halfling, female halfling, male orc, female orc. Match each reference identity. Dwarves squat and broad, gnomes small and wiry, halflings short and round, elves tall, orcs broad and tall. Practical linen work shirts, belts, trousers, boots. Bare heads, relaxed hands empty. Charcoal studio background, strong refined naturalistic painting and realistic wear. Identical straight-on pose and camera angle. Every person centered in exactly their cell, bottom of boots aligned just above the bottom of that cell. No writing, no weapons, no points of light or scenery.

### well

Illustration-story, panoramic, detailed painterly realism. Dwarven Art Deco underground Record Well: an ancient round cylindrical library shaft lined with thousands of paper-thin engraved brass leaves in circular galleries descending out of reach of lamplight; among them a few ancient woven cloth records. From beside the rim, an elderly woman librarian, age-lined hands, dropping a small padded weight onto a brass dish to play back a reading. Warm lamplight glints along concentric edges, the darkness beyond real, scene at human scale. No glowing magic text, no words, borders or watermark.

### water

Illustration-story, wide panoramic painting in grounded realistic oil, last chamber below Brassreach. Immense completely still black subterranean water and a low wet stone step in foreground. Minute blue points of light, firefly-like, floating over the water all the way to darkness. High irregular stalactites barely visible in their reflection. Deep black negative space, delicate cerulean and indigo light, no face, no creature, no humanoids, no explanations, text or framing.
