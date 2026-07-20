# Brassreach Author Rewrite Workbook

> A source-mapped manuscript of the game’s player-facing prose. Rewrite the words inside the fenced `text` blocks; keep every Text ID intact so the finished manuscript can be installed back into the game without guesswork.

Generated from branch `agent/atmospheric-narrative-overhaul-7`, commit `18195f0`, on 2026-07-16.

## How to use this workbook

1. Rewrite only the prose inside each fenced `text` block. You may change paragraph breaks inside a block.
2. Do not rename, delete, or duplicate a `Text ID`. It is the address used to reinstall that passage.
3. Preserve placeholders written in braces, such as `{ITEM}`, `{PRICE}`, or `{ERROR}`. They are filled by the game at runtime.
4. Treat lines marked as mechanical context as reference material. Stats, DCs, destinations, item IDs, flags, and requirements are not prose.
5. Choice labels should state one clear action. Success and failure passages should show the attempted action, its immediate result, and the consequence that carries forward.
6. Keep canonical proper nouns consistent. If you want to rename a person, place, office, or artifact, add an `AUTHOR NOTE` beneath the block so the data references can be updated together later.
7. Intro glossary terms may be rewritten in context, but their highlighted visible wording should remain recognizable unless you explicitly request a lore rename.
8. A blank rewrite is ambiguous. If you intentionally want a passage removed, replace it with `[REMOVE THIS TEXT]`.

## Narrative standard for the rewrite

- Make it immediately clear who acts, what they do, where they do it, and what changes.
- Let concrete action and dialogue carry the lore whenever possible.
- Preserve uncertainty by naming its source: a damaged record, conflicting witnesses, an untested theory, or a character’s limited experience.
- Use elevated language selectively. No image or unusual verb should obscure the physical event.
- Give Brunna, Dorrin, Lithen, Orra, Sella, Piera, and other recurring figures distinct but intelligible voices.
- Make each scene earn its place in the route from the first public failure to the Unfathomer.

---

## Part I — Opening and Field Brief

### Intro Slide 1

**Slide 1, paragraph 1**

Text ID: `intro:slide-1:paragraph-1`

```text
The labyrinth of towers, alleyways, stairwells, and terraces of Brassreach glows beneath a thousand mechanical lanterns. Metal gears turn with impossible ease everywhere you look. The city itself seems alive, and by design; centuries of work dating back to the Founders brought to life a city whose metal heartbeat whirrs, clicks, and hums in perfect harmony. At least, it once did. In recent decades, neglect born of greed, vanity, and contested authority renders the once flawless machinery of Brassreach frail and shuddering. Gone is the pealing chorus of perfectly tuned bells, while superficially lavish towers loom imperiously above ever-worsening squalor. Factions have arisen, some with eyes only for gold and jewels, others for political gain, and all the while fewer and fewer remain who remember the concord of a youthful Brassreach.
```

**Hover definition — Brassreach**

Text ID: `intro:slide-1:glossary:brassreach-1`

Context: This appears when the player hovers or focuses the highlighted term.

```text
A layered dwarven city whose unique constructions join water, stone, brass, and sound.
```

### Intro Slide 2

**Slide 2, paragraph 1**

Text ID: `intro:slide-2:paragraph-1`

```text
The stone and metal maze of Brassreach's surface holds civic workshops, dwellings, towers, and the Halls where elected officials and hereditary power struggle over the city's course. Beneath them, however, layer by Brass-wrought layer, the Undercity opens into sprawling Founder-made reservoirs and vaulted public works, lit by golden seams that fade a little more each year. Deeper still lie the Archives, where the memory of Brassreach survives in etched metal tablets of witness accounts, work inspections, and repair orders. To and from those galleries travel Threadbearers. The first of these truth-seekers returned from long journeys with accounts woven by needle and thread; modern bearers carry their findings in a Thread Ledger, and seldom venture as far as their predecessors. Most now work near the public Halls, while a trusted few earn the Deep Writ and descend toward the Cistern Fields, where high vaults, dark reservoirs, and the very foundations of Brassreach are legendary. 
```

**Hover definition — Threadbearers**

Text ID: `intro:slide-2:glossary:threadbearers-1`

Context: This appears when the player hovers or focuses the highlighted term.

```text
Civic investigators trained to seek truth by following mechanical failures to their source, uncovering hidden patterns and decoding mystery along the way.
```

**Hover definition — Thread Ledger**

Text ID: `intro:slide-2:glossary:thread-ledger-2`

Context: This appears when the player hovers or focuses the highlighted term.

```text
A Threadbearer's field record whose firsthand accounts are vital. 
```

**Hover definition — Deep Writ**

Text ID: `intro:slide-2:glossary:deep-writ-3`

Context: This appears when the player hovers or focuses the highlighted term.

```text
A hard-earned seal of authority to inspect restricted work, cross-office records, and the deepest reaches of the Undercity. 
```

### Intro Slide 3

**Slide 3, paragraph 1**

Text ID: `intro:slide-3:paragraph-1`

```text
The Founders shaped the Cistern Fields chamber by chamber, guiding sound through water, stone, and brass until the deepest works rang true enough to birth a city. That foundational accord has weakened. Water has risen for years through neglected channels, and repair orders miles from one another hint at the same strange, pulsing undertone. A cracked stairwell near the public Halls, flooded neighborhoods in the Tangles, and animals driven from a drainage den below the Markets should have nothing in common...
You begin as a recent Institute graduate under a probationary writ. Your attributes, equipment, testimony, repairs, and alliances will shape what follows; failures come at a cost, while successes follow in your footsteps as you explore deeper and deeper. Though you are but a recent Initiate, it is up to you to follow your intuition and uncover what might otherwise spell the end of Brassreach.
```

**Hover definition — Tangles**

Text ID: `intro:slide-3:glossary:tangles-1`

Context: This appears when the player hovers or focuses the highlighted term.

```text
A densely settled district of workshops, homes, and improvised bridges.
```

**Hover definition — probationary writ**

Text ID: `intro:slide-3:glossary:probationary-writ-2`

Context: This appears when the player hovers or focuses the highlighted term.

```text
Limited authority for a new Threadbearer to investigate public hazards under Captain Brunna's supervision.
```

### Threadbearer Institute Field Brief

**Heading 1**

Text ID: `intro:field-brief:01-threadbearer-institute-field-brief`

```text
Threadbearer Institute Field Briefing
```

**Subheading 2**

Text ID: `intro:field-brief:02-the-office`

```text
Captain Brunna's Office
```

**Field point 3**

Text ID: `intro:field-brief:03-investigate-test-the-physical-site-a`

```text
Investigate — Follow the evidence as far as it leads. 
```

**Field point 4**

Text ID: `intro:field-brief:04-witness-record-who-was-affected-and-`

```text
Witness — Record the firsthand accounts of those affected. 
```

**Field point 5**

Text ID: `intro:field-brief:05-connect-show-how-decisions-repairs-a`

```text
Connect — Where possible, connect pieces of seemingly unrelated and circumstantial evidence to paint a picture of cause to effect.
```

**Paragraph 6**

Text ID: `intro:field-brief:06-a-threadbearer-follows-the-unbroken-`

```text
A Threadbearer follows the line from failing mechanism through the people, decisions, and neglected duties that left vulnerabilities to such failure. Your Probationary Writ grants access to witness and account- use it well. 
```

**Subheading 7**

Text ID: `intro:field-brief:07-your-record`

```text
Your Record
```

**Field point 8**

Text ID: `intro:field-brief:08-evidence-tested-facts-that-support-a`

```text
Evidence — Your observations and deductions that begin to form a network of cause and effect.
```

**Field point 9**

Text ID: `intro:field-brief:09-testimony-lived-accounts-kept-in-the`

```text
Testimony — Firsthand accounts recorded regardless of caste, duty, authority, or wealth. 
```

**Field point 10**

Text ID: `intro:field-brief:10-repairs-concrete-improvements-comple`

```text
Repairs — By directing or initiating a proper chain of repair duties, the very failures you investigate can be righted as you explore. 
```

**Field point 11**

Text ID: `intro:field-brief:11-consequences-costs-that-remain-even-`

```text
Consequences — Your failures will leave their mark in gold, gathered items, or the relationships you form through your journeys. 
```

**Paragraph 12**

Text ID: `intro:field-brief:12-your-thread-ledger-keeps-these-stran`

```text
Your Thread Ledger keeps safe these strands of evidence and testimony, preserving the truth in perpetuity. 
```

**Subheading 13**

Text ID: `intro:field-brief:13-first-commission`

```text
First Commission
```

**Field point 14**

Text ID: `intro:field-brief:14-secure-the-cracked-bell-stair-and-he`

```text
Examine and secure the cracked stairwell, keeping an ear out for unusual resonance. 
```

**Field point 15**

Text ID: `intro:field-brief:15-compare-official-plans-with-the-rout`

```text
Compare dated city plans with the routes you find in use in the Tangles.
```

**Field point 16**

Text ID: `intro:field-brief:16-protect-residents-and-animals-displa`

```text
Protect residents and animals displaced by the rising water.
```

**Field point 17**

Text ID: `intro:field-brief:17-return-to-captain-brunna-with-what-t`

```text
Return to Captain Brunna with your findings across Brassreach- and the potential for strange connections between them. 
```

## Part II — Authored Campaign

Every scene below includes its stable scene ID, routing context, full scene narration, branch-specific arrivals, choices, outcomes, and player-facing journal or feedback copy.

### Act I — The First Thread

- Chapter ID: `tutorial`
- Scenes: 7

**Act label**

Text ID: `chapter:tutorial:act`

```text
Act I
```

**Chapter title**

Text ID: `chapter:tutorial:title`

```text
The First Thread
```

#### The Public Bell `tutorial-commission`

- Scene ID: `tutorial-commission`
- Chapter: `tutorial`
- Choice count: 3
- Entry authority: Probationary Threadbearer
- Entry writ: probationary

**Scene title**

Text ID: `scene:tutorial-commission:title`

```text
The Public Bell
```

**Current objective**

Text ID: `scene:tutorial-commission:objective`

```text
Accept Captain Brunna’s probationary commission.
```

**Scene narration**

Text ID: `scene:tutorial-commission:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
Morning rain wets the upper terraces of Brassreach, turning roofs, railings, and broad stone stairs the color of wet iron. Far below, gears the size of houses turn within the city walls. Their ineluctable rotation once inspired the great Public Bell to ring in a single measured rhythm. Today the gears labor half a beat apart, and the Bell's rope trembles with unsurety.

Captain Brunna waits beneath the Bell with three repair petitions spread across a slate table. You remember the table from your final examinations at the Threadbearer Institute; every new graduate stands before it sooner or later. Brunna knows you as well. A tired but genuine smile spreads encouragingly on her weathered face before she taps the petitions in turn. “A cracked stair. Salt-hounds driven into the Market. Floodwater threatening no less than six homes in the Tangles. We haven't had such a busy day in years.”

She lays a Probationary Writ beside the reports—your first commission below the open terraces of the Institute, far more imposing a charge than it seemed in the Institute's training rooms. “A Threadbearer, first and foremost, is a servant of the truth,” she says. “I am clearing you alone to look into each of these three situations in turn. Use this oversight to rule out anything somehow connecting them. Remember, Threadbearer— listen to the people, test the stone, record what you hear, see, and feel.” She pushes the writ toward you, then rests one finger upon its narrow red seal. “This opens the civic Halls and supervised public works to your investigation. It does not grant access to the Undercity. Earn that authorization by returning to me with results.”
```

##### Entry records and rewards

**Entry copy: enter › item › reason**

Text ID: `scene:tutorial-commission:enter:enter:item:reason`

```text
Captain Brunna locks a blank brass-leaf ledger into your field case.
```

**Entry copy: enter › milestone**

Text ID: `scene:tutorial-commission:enter:enter:milestone`

```text
Accepted a probationary Threadbearer commission.
```

##### Choices

###### Take the writ and ask where the first failure was reported. `tutorial-accept`

- Choice ID: `tutorial-accept`
- Type: `advance`
- Next on success: `tutorial-quartermaster`

**Choice label**

Text ID: `choice:tutorial-accept:label`

```text
Take the writ and ask to which location you should report first. 
```

**Immediate outcome**

Text ID: `choice:tutorial-accept:outcome`

```text
The brass seal feels cold beneath your thumb. Brunna marks the circular stairwell on the upper plan with red chalk. “Begin here, at the Halls,” she says. “Then proceed in the direction the city leads you.”
```

###### Journal, reward, and consequence copy

###### Ask why Brunna believes the three failures belong to one investigation. `tutorial-question`

- Choice ID: `tutorial-question`
- Type: `advance`
- Next on success: `tutorial-quartermaster`

**Choice label**

Text ID: `choice:tutorial-question:label`

```text
Ask once more why Brunna believes the three failures belong to one investigation.
```

**Immediate outcome**

Text ID: `choice:tutorial-question:outcome`

```text
Brunna turns the plans so that you can compare them yourself. They lie at three separate corners of the Upper City. The strange references to a pulsating undertone, she explains, are similar enough to warrant this departure from protocol— you recall that novice Threadbearers rarely recieve an investigational charge, let alone three. 
```

###### Journal, reward, and consequence copy

**Effect copy: effects › evidence**

Text ID: `choice:tutorial-question:effects:effects:evidence`

```text
Three unrelated failures share one pulsating undertone.
```

###### Ask who remains in danger before discussing the machinery. `tutorial-people`

- Choice ID: `tutorial-people`
- Type: `advance`
- Next on success: `tutorial-quartermaster`

**Choice label**

Text ID: `choice:tutorial-people:label`

```text
Ask Captain Brunna who in the city stands in greatest danger from these three mechanical failures.
```

**Immediate outcome**

Text ID: `choice:tutorial-people:outcome`

```text
Brunna’s expression softens, but her answer lacks ambiguity: "The two stair-keepers stranded above the cracked circular stairwell must be addressed first. Investigate the six Tangles households taking water next. Finally, proceed to the Markets and broker a solution between the salt-hounds and their flooded drain culvert." She writes these details into your ledger and bids you good luck.
```

###### Journal, reward, and consequence copy

**Effect copy: effects › testimony**

Text ID: `choice:tutorial-people:effects:effects:testimony`

```text
Captain Brunna identified the workers, residents, and animals behind the repair petitions.
```

#### Dorrin’s Issue Desk `tutorial-quartermaster`

- Scene ID: `tutorial-quartermaster`
- Chapter: `tutorial`
- Choice count: 2

**Scene title**

Text ID: `scene:tutorial-quartermaster:title`

```text
Dorrin’s Threadbearer Supply and Field-Issue Desk
```

**Current objective**

Text ID: `scene:tutorial-quartermaster:objective`

```text
Gather equipment for a civic inspection, then leave for the cracked stairwell.
```

**Scene narration**

Text ID: `scene:tutorial-quartermaster:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
The Threadbearer supply and field-issue room occupies a narrow vault beneath the Bell court. Racks of ropes, braces, lamps, and listening instruments climb its walls in perfect rows, each tagged with the name of the last person who carried it. Quartermaster Dorrin works behind an iron counter polished by generations of impatient hands. He reads your new Probationary Writ and associated charge from Captain Brunna, looks down at your boots, and smirks.

“A fine report from the bottom of a shaft is useless if you slip and fall and never make it back up again,” he says. He sets out surveyor's chalk, a close-cut listening hood, and a standard-issue token of entry for staffed service doors. Before pushing any of it across the counter to you, he records each piece's condition and the reason for its use. The ritual is slow as you bounce on anxious feet, but nothing about Dorrin suggests wasted time. “Brunna thinks you may need to go farther than most first commissions,” he adds while testing the hood's thin brass plates. “That's her concern. Mine is whether you come back with the same number of bones.”

He pushes the standard issue equipment toward you, then unlocks a smaller cabinet of field gear available for purchase. Beyond the door, the Public Bell begins its thirteenth ring of the day. A second, lower tremor echoes through the small room after the note has faded. Dorrin stands, glances warily around the room, and slides your Probationary Writ back across the counter. “Best not keep that stair waiting.”
```

##### Entry records and rewards

**Entry copy: enter › item › reason**

Text ID: `scene:tutorial-quartermaster:enter:enter:item:reason`

```text
Dorrin issues surveyor's chalk so you can mark tested masonry and a safe return route.
```

**Entry copy: enter › discovery**

Text ID: `scene:tutorial-quartermaster:enter:enter:discovery`

```text
Every rope, lamp, and tool in Dorrin’s storeroom belongs to the Threadbearer Institute. He issues equipment only for an authorized investigation and records who receives it, ensuring that dangerous tools remain in trained hands.
```

##### Choices

###### Inspect Dorrin’s field stock. `tutorial-dorrin-shop`

- Choice ID: `tutorial-dorrin-shop`
- Type: `merchant`
- Merchant: `dorrin`

**Choice label**

Text ID: `choice:tutorial-dorrin-shop:label`

```text
Inspect Quartermaster Dorrin’s Institute equipment available for purchase.
```

###### Fasten the Thread Ledger and leave for the bell-stair. `tutorial-dorrin-ready`

- Choice ID: `tutorial-dorrin-ready`
- Type: `advance`
- Next on success: `tutorial-bell-stair`

**Choice label**

Text ID: `choice:tutorial-dorrin-ready:label`

```text
Fasten the Thread Ledger to your belt and leave for the cracked stairwell.
```

**Immediate outcome**

Text ID: `choice:tutorial-dorrin-ready:outcome`

```text
You secure the Thread Ledger, gather your equipment, and pull on the Surveyor Hood. Dorrin tightens one of its straps before shooing you toward the door. “People first, measurements second,” he says. “Collapsed stairs are patient. Injured dwarves are not.”
```

###### Journal, reward, and consequence copy

**Effect copy: effects › item › reason**

Text ID: `choice:tutorial-dorrin-ready:effects:effects:item:reason`

```text
Dorrin issues you a surveyor's hood, whose brass listening plates isolate the sounds you need to hear most clearly. 
```

#### The Cracked Bell-Stair `tutorial-bell-stair`

- Scene ID: `tutorial-bell-stair`
- Chapter: `tutorial`
- Choice count: 3

**Scene title**

Text ID: `scene:tutorial-bell-stair:title`

```text
The Cracked Stairwell
```

**Current objective**

Text ID: `scene:tutorial-bell-stair:objective`

```text
Secure the stair and determine why its lower landing failed.
```

**Scene narration**

Text ID: `scene:tutorial-bell-stair:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
The first location on Brunna's route is a tall, circular stairwell connecting a crowded terrace with the lower level of the civic Halls. You hear the stone groan before you reach it. With each rumble from somewhere far below, hairline cracks creep farther around the central support column, shedding pale grit onto the steps below. Lantern Constables (ADD A GLOSSARY DEFINITION AND HIGHLIGHTABLE TEXT FOR LANTERN CONSTABLES USING THE SAME LOGIC AS THE INTRO SLIDE MODALS!!!) hold the crowd behind a chain while two stair-keepers remain stranded on the far side of a split landing. The steps beneath the keepers remain intact, but the damaged landing is their only route back to the terrace.

“The cracks appeared with the noon bell,” one keeper calls, gripping the rail as the landing shivers beneath her. “We've watched them grow ever since, but we've never seen stone move like this.”

Rainwater runs through the widening split. You see that a dark iron collar surrounds the terrace drain where it passes through the central column. The metal is newer than the surrounding stone and seems to bear several official inspection stamps. The hairline cracks spread across the landing near the collar, branching through the stone in several directions.

Then the Public Bell sounds its next stroke. Its booming note rolls across the terrace and fades. For a moment the stair is still, before a second tremor -that same strange, low rumbling-, rises through the soles of your boots. The lowest exposed pipe shakes first, followed in turn by each pipe above it. You watch the tremor reach the central column, where the iron collar remains fixed while the stone around it jerks sideways.

The split widens with a sharp snap, and the outer edge of the landing drops several inches. Stone breaks away into the sinking landing, opening a wider gap between you and the stranded keepers. Another tremor could tear the landing from the central column and destroy their only way out.
```

##### Choices

###### Brace the split landing and hold it steady while the stair-keepers cross. (STR) `stair-brace`

- Choice ID: `stair-brace`
- Type: `check`
- Stat / DC: STR / 10
- Next on success: `tutorial-tangles`
- Next on failure: `tutorial-tangles`

**Choice label**

Text ID: `choice:stair-brace:label`

```text
Brace the split landing and hold it steady while the stair-keepers cross. (STR)
```

**Success result**

Text ID: `choice:stair-brace:success`

```text
You hoist a coil of rope and a spare shoring beam and begin climbing, step by trembling step, towards the splitting upper landing. With every ring of the Public Bell and answering deep rumble, 
```

**Failure result**

Text ID: `choice:stair-brace:failure`

```text
The beam strikes the socket at an angle and kicks back before you can seat it. You throw your weight against the landing long enough for both keepers to retreat to solid steps, but a falling stone catches your shoulder and drives you to one knee. Brunna’s Watch closes the stair and lowers the keepers by rope from the terrace. The rescue succeeds; the direct route does not. Through the pain, you still see the rainwater tremble after the bell note fades.
```

**Visible bonus label 1**

Text ID: `choice:stair-brace:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
secured rope
```

**Visible bonus label 2**

Text ID: `choice:stair-brace:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
power rating
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › repair**

Text ID: `choice:stair-brace:effects:effects:success:repair`

```text
Bell-stair landing braced for evacuation.
```

**Effect copy: effects › success › testimony**

Text ID: `choice:stair-brace:effects:effects:success:testimony`

```text
The stair-keepers confirmed the vibration begins after each bell stroke.
```

**Effect copy: effects › failure › hp Reason**

Text ID: `choice:stair-brace:effects:effects:failure:hpReason`

```text
bruised by falling stone at the bell-stair
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:stair-brace:effects:effects:failure:consequence`

```text
The bell-stair remains closed pending a full repair.
```

###### Mark the load path, then release the warped drain collar in sequence. (INT) `stair-collar`

- Choice ID: `stair-collar`
- Type: `check`
- Stat / DC: INT / 11
- Next on success: `tutorial-tangles`
- Next on failure: `tutorial-tangles`

**Choice label**

Text ID: `choice:stair-collar:label`

```text
Mark the load path, then release the warped drain collar in sequence. (INT)
```

**Success result**

Text ID: `choice:stair-collar:success`

```text
Your chalk marks reveal where the newer iron bears against the older stone. You order the landing cleared, loosen the collar one quarter-turn at a time, and wait through each low pulse before moving again. The founder-laid blocks settle toward the lines you marked instead of away from them. When the final catch releases, the column gives one deep groan and becomes still. Rainwater runs cleanly through the drain. More importantly, the old foundation carries its load again, exposing the modern collar as the source of the dangerous twist.
```

**Failure result**

Text ID: `choice:stair-collar:failure`

```text
You mark the load correctly, but the final catch has rusted into the collar. It binds under your lockpin and begins to shear. You stop rather than trade a strained landing for a broken drain, holding the mechanism long enough for Watch officers to close the stair. The effort pulls a muscle in your arm, and the runoff must be diverted toward the Tangles until a heavier crew arrives. Your chalked load path remains on the column, showing exactly where the repair failed.
```

**Visible bonus label 1**

Text ID: `choice:stair-collar:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
marked load path
```

**Visible bonus label 2**

Text ID: `choice:stair-collar:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
fine catch tool
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › repair**

Text ID: `choice:stair-collar:effects:effects:success:repair`

```text
Warped bell-stair drain collar safely released.
```

**Effect copy: effects › success › evidence**

Text ID: `choice:stair-collar:effects:effects:success:evidence`

```text
A modern iron collar distorted an older balanced foundation.
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:stair-collar:effects:effects:failure:consequence`

```text
Runoff was diverted toward the Tangles after the bell-stair collar could not be released.
```

**Effect copy: effects › failure › hp Reason**

Text ID: `choice:stair-collar:effects:effects:failure:hpReason`

```text
strained while holding the jammed drain collar
```

###### Cross the landing between tremors and time the lower vibration against the bell. (DEX) `stair-listen`

- Choice ID: `stair-listen`
- Type: `check`
- Stat / DC: DEX / 10
- Next on success: `tutorial-tangles`
- Next on failure: `tutorial-tangles`

**Choice label**

Text ID: `choice:stair-listen:label`

```text
Cross the landing between tremors and time the lower vibration against the bell. (DEX)
```

**Success result**

Text ID: `choice:stair-listen:success`

```text
You pull the Surveyor Hood over your ears and step lightly onto the least damaged edge of the landing. Its brass plates separate the bell’s clear decay from the tremor beneath it. One stroke passes, then another. On the third, you feel the delayed pulse rise through your forward foot and hear it strike the service arch from below. It is not an echo. It arrives too late, and it moves upward against every pipe shown on Brunna’s plan. You return before the next crack opens and mark the direction in your ledger.
```

**Failure result**

Text ID: `choice:stair-listen:failure`

```text
You reach the middle of the landing, but anxious footsteps on the terrace shake the rail before the hood can isolate the third return. A chip of stone skips into the darkness below. You withdraw while the path remains passable. The comparison is incomplete, yet two timed strokes still prove that the lower vibration follows the bell instead of occurring at random. You record the missing direction rather than guess it.
```

**Visible bonus label 1**

Text ID: `choice:stair-listen:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
listening plates
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › evidence**

Text ID: `choice:stair-listen:effects:effects:success:evidence`

```text
The low overtone travels upward against the mapped pipework.
```

**Effect copy: effects › failure › evidence**

Text ID: `choice:stair-listen:effects:effects:failure:evidence`

```text
The low vibration arrives after the public bell, but its direction remains uncertain.
```

#### Almost-True Maps `tutorial-tangles`

- Scene ID: `tutorial-tangles`
- Chapter: `tutorial`
- Choice count: 3

**Scene title**

Text ID: `scene:tutorial-tangles:title`

```text
Almost-True Maps
```

**Current objective**

Text ID: `scene:tutorial-tangles:objective`

```text
Compare the official route with conditions in the Tangles.
```

**Scene narration**

Text ID: `scene:tutorial-tangles:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
The Tangles begin where orderly civic stone gives way to necessity. Ropewalks span alleys above wire presses; homes lean over workshops; narrow bridges climb from one dry ledge to the next without waiting for an architect's permission. Runoff from the bell-stair now threads through the district in bright, unwelcome streams. Residents lift crates onto tables while children chalk the water's advance along the walls.

Your official plan promises a clear inspection lane. A dye-house occupies half of it, and a footbridge has crossed the rest for so many years that its rails have grown smooth beneath thousands of hands. Piera finds you turning the useless sheet beneath a mechanical lantern. She is quick-eyed, rain-soaked, and carrying a map stitched from delivery slips, rent notices, and the blank back of a Council proclamation.

“Official maps show where an office believes a street ought to be,” she says, unfolding her work across a barrel. “Mine show where people can still walk.” Several of her newest marks follow walls the city plan labels dry. One line ends beneath the market, where a relief grate has been sealed behind newer masonry. Piera taps that line with a blackened fingernail. “The water knows a road your map has forgotten. Shall we find out who is wrong?”
```

##### Branch arrivals

**Arrival from stair-brace:success**

Text ID: `scene:tutorial-tangles:arrival:stair-brace:success`

Context: This sentence bridges the previous choice result into this scene.

```text
With the stair-keepers safe, you follow their description of the delayed vibration toward the Tangles.
```

**Arrival from stair-brace:failure**

Text ID: `scene:tutorial-tangles:arrival:stair-brace:failure`

Context: This sentence bridges the previous choice result into this scene.

```text
The closed stair forces you down a service lane, where diverted runoff already flows toward the Tangles.
```

**Arrival from stair-collar:success**

Text ID: `scene:tutorial-tangles:arrival:stair-collar:success`

Context: This sentence bridges the previous choice result into this scene.

```text
The released collar sends the runoff back into its old channel. You follow that channel toward the Tangles.
```

**Arrival from stair-collar:failure**

Text ID: `scene:tutorial-tangles:arrival:stair-collar:failure`

Context: This sentence bridges the previous choice result into this scene.

```text
Because the collar remains jammed, Watch crews divert the runoff toward the Tangles. You go ahead to warn the residents.
```

**Arrival from stair-listen:success**

Text ID: `scene:tutorial-tangles:arrival:stair-listen:success`

Context: This sentence bridges the previous choice result into this scene.

```text
Your timing marks lead away from the visible pipework and toward the Tangles.
```

**Arrival from stair-listen:failure**

Text ID: `scene:tutorial-tangles:arrival:stair-listen:failure`

Context: This sentence bridges the previous choice result into this scene.

```text
Your incomplete timing still gives you one useful lead: the delayed pulse is strongest on the Tangles side of the wall.
```

##### Choices

###### Lay Piera’s map over the civic plan and follow the drain flow between them. (INT) `piera-compare`

- Choice ID: `piera-compare`
- Type: `check`
- Stat / DC: INT / 10
- Next on success: `tutorial-salt-hounds`
- Next on failure: `tutorial-salt-hounds`

**Choice label**

Text ID: `choice:piera-compare:label`

```text
Lay Piera’s map over the civic plan and follow the drain flow between them. (INT)
```

**Success result**

Text ID: `choice:piera-compare:success`

```text
You use the founder benchmarks copied into your ledger rather than the district names that have changed. Two damp lines on Piera’s map prove to be guesswork; she crosses them out without embarrassment. The third aligns with the delayed vibration from the bell-stair and continues through a wall marked solid on the civic plan. Behind it lies an omitted maintenance throat linking the upper drain to the market relief grate. Piera studies your joined sheets, then tears the useful half from her map. “You can have the truth,” she says. “I will draw another.”
```

**Failure result**

Text ID: `choice:piera-compare:failure`

```text
The stitched scraps refuse to lie flat against the rigid civic grid. You align a dye-house chimney with the wrong terrace mark and nearly carry that false junction into your ledger. Piera catches your wrist before the stylus touches brass. She walks you to the chimney, makes you sight the founder benchmark beneath its soot, and waits while you record both the mistake and her correction. The route remains uncertain, but your account becomes more trustworthy because the error stays visible.
```

**Visible bonus label 1**

Text ID: `choice:piera-compare:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
survey marks
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › evidence**

Text ID: `choice:piera-compare:effects:effects:success:evidence`

```text
An omitted maintenance throat links the bell-stair runoff to the Tangles.
```

**Effect copy: effects › success › item › reason**

Text ID: `choice:piera-compare:effects:effects:success:item:reason`

```text
Piera gives you the corrected sheet because official plans no longer show the lived route.
```

**Effect copy: effects › failure › testimony**

Text ID: `choice:piera-compare:effects:effects:failure:testimony`

```text
Piera corrected a false alignment before it entered the Thread Ledger.
```

###### Ask the flooded households when and how the water entered their homes. (CHA) `piera-residents`

- Choice ID: `piera-residents`
- Type: `check`
- Stat / DC: CHA / 10
- Next on success: `tutorial-salt-hounds`
- Next on failure: `tutorial-salt-hounds`

**Choice label**

Text ID: `choice:piera-residents:label`

```text
Ask the flooded households when and how the water entered their homes. (CHA)
```

**Success result**

Text ID: `choice:piera-residents:success`

```text
Piera takes you door to door, and the guarded residents speak once they understand that their names will remain beside their words. A rope-maker shows you a basin that filled, emptied, and filled again without steady rain. A dyer remembers each rise following the distant bell. Their times match the delayed vibration at the stair and point toward a relief grate sealed beneath the market. By the final account, the residents are comparing their own chalk marks and finishing one another’s sequence.
```

**Failure result**

Text ID: `choice:piera-residents:failure`

```text
The first accounts disagree by nearly an hour, and frustration sharpens every correction. You resist the temptation to choose the neatest version. Instead, you place the conflicting times side by side. One detail survives every disagreement: the water did not creep upward like a leak; it arrived in pulses. The testimony cannot yet prove when the first pulse began, but it gives you a behavior no ordinary drain failure should produce.
```

**Visible bonus label 1**

Text ID: `choice:piera-residents:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
Piera’s introductions
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › testimony**

Text ID: `choice:piera-residents:effects:effects:success:testimony`

```text
Tangles households reported pulsing water and a blocked market relief grate.
```

**Effect copy: effects › failure › testimony**

Text ID: `choice:piera-residents:effects:effects:failure:testimony`

```text
Tangles testimony conflicts on timing but agrees that the flooding rises in pulses.
```

###### Follow Piera over the wire-press roofs and inspect the omitted throat from above. (DEX) `piera-shortcut`

- Choice ID: `piera-shortcut`
- Type: `check`
- Stat / DC: DEX / 11
- Next on success: `tutorial-salt-hounds`
- Next on failure: `tutorial-salt-hounds`

**Choice label**

Text ID: `choice:piera-shortcut:label`

```text
Follow Piera over the wire-press roofs and inspect the omitted throat from above. (DEX)
```

**Success result**

Text ID: `choice:piera-shortcut:success`

```text
Piera ties your rope around a roof crane and crosses the first gap without looking down. You follow as press wheels turn beneath the thin brass sheets, timing each step between their shudders. The route brings you to a ledge directly above the sealed throat. Its broken grate bears fresh scratches, and mineral-crusted tracks run from the dark opening toward the market. Whatever climbed out was wet, heavy, and moving away from the rising water.
```

**Failure result**

Text ID: `choice:piera-shortcut:failure`

```text
A brass roof sheet folds beneath your boot with a crack like a pistol shot. The safety rope catches you against the rail, but its hook tears a bright cut along your forearm. Below, claws scrape over tile and vanish toward the market. Piera hauls you upright and points to the wet tracks before the rain can erase them. You have lost the quiet approach, not the trail.
```

**Visible bonus label 1**

Text ID: `choice:piera-shortcut:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
roof line
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › discovery**

Text ID: `choice:piera-shortcut:effects:effects:success:discovery`

```text
Salt-hound tracks emerge from the omitted maintenance throat.
```

**Effect copy: effects › failure › hp Reason**

Text ID: `choice:piera-shortcut:effects:effects:failure:hpReason`

```text
cut by the loose brass roof sheet
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:piera-shortcut:effects:effects:failure:consequence`

```text
Noise on the rooftop route drove the displaced animals toward the market.
```

#### The Market Pack `tutorial-salt-hounds`

- Scene ID: `tutorial-salt-hounds`
- Chapter: `tutorial`
- Choice count: 3

**Scene title**

Text ID: `scene:tutorial-salt-hounds:title`

```text
The Market Pack
```

**Current objective**

Text ID: `scene:tutorial-salt-hounds:objective`

```text
Clear the displaced salt-hounds without harming the market crowd.
```

**Scene narration**

Text ID: `scene:tutorial-salt-hounds:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
The Tangles market has become a cage of noise. Merchants crowd behind locked stalls while the lifting gears above them hammer a row of metal shutters against their stops. Beneath those gears, four salt-hounds crouch among overturned baskets. Their mineral-crusted coats are soaked black, and the smallest holds one bleeding paw above the floor.

A porter lies pinned behind a fallen handcart near the only dry exit. The largest hound stands between him and the waiting handlers, shoulders low and white teeth bared. Yet it does not watch the porter. Each time the shutters strike, the animal turns toward the sound and flinches as if the blow has landed on its own skull. The rest of the pack presses close around it.

Wet tracks lead from a broken drainage grate at the rear of the market. Beyond that grate, the animals' den is already under water. The pack has not come to hunt; it has fled one danger and found itself surrounded by another. A dropped hook or shouted order could send it through the crowd. The porter tries to move, and the cart axle creaks beneath his leg.
```

##### Choices

###### Clear a quiet route, then lure the frightened pack toward an unused culvert. (CHA) `hounds-lure`

- Choice ID: `hounds-lure`
- Type: `check`
- Stat / DC: CHA / 11
- Next on success: `tutorial-floodgate`
- Next on failure: `tutorial-floodgate`

**Choice label**

Text ID: `choice:hounds-lure:label`

```text
Clear a quiet route, then lure the frightened pack toward an unused culvert. (CHA)
```

**Success result**

Text ID: `choice:hounds-lure:success`

```text
You ask the crowd for silence instead of bravery. Stall by stall, they stop the shutters and retreat from the culvert Piera’s neighbors identified. You pour clean water in a short line across the floor and sound the handler’s low call. The largest hound tests the air, steps over the porter without touching him, and follows the wet trail. The others move behind it. Only when the last mineral tail disappears into the empty culvert does the market breathe again. The freed porter presses his handler’s whistle into your hand. “You listened before you frightened them,” he says. “Keep it.”
```

**Failure result**

Text ID: `choice:hounds-lure:failure`

```text
A merchant backs into a hanging pan, and its clang breaks the fragile quiet. The largest hound charges—not at you, but at the only gap it can see. You throw yourself between the pack and the crowd, taking a claw across the ribs while handlers open a path. The hounds escape through a spice stall in a storm of red dust. Everyone survives, but the smallest animal leaves blood along the stones, and the market must be cleared before anyone can follow.
```

**Visible bonus label 1**

Text ID: `choice:hounds-lure:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
resident guidance
```

**Visible bonus label 2**

Text ID: `choice:hounds-lure:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
clean water
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › repair**

Text ID: `choice:hounds-lure:effects:effects:success:repair`

```text
A safe animal route was opened from the market to an unused culvert.
```

**Effect copy: effects › success › item › reason**

Text ID: `choice:hounds-lure:effects:effects:success:item:reason`

```text
The porter gives you the low whistle animal handlers use near the drainage dens.
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:hounds-lure:effects:effects:failure:consequence`

```text
The pack escaped through the market; one salt-hound was injured.
```

**Effect copy: effects › failure › hp Reason**

Text ID: `choice:hounds-lure:effects:effects:failure:hpReason`

```text
scratched while clearing the startled market pack
```

###### Lift the cart long enough for the porter to crawl free. (STR) `hounds-cart`

- Choice ID: `hounds-cart`
- Type: `check`
- Stat / DC: STR / 11
- Next on success: `tutorial-floodgate`
- Next on failure: `tutorial-floodgate`

**Choice label**

Text ID: `choice:hounds-cart:label`

```text
Lift the cart long enough for the porter to crawl free. (STR)
```

**Success result**

Text ID: `choice:hounds-cart:success`

```text
You wade between the stalls before the largest hound can decide whether to charge. The cart axle bites into your palms, then rises as you drive upward with your legs. The porter drags himself clear and calls the handlers by name from the floor. With the immediate threat removed, they open the far shutter and guide the pack toward a dark, quiet lane. Before the medics carry him away, the porter tells you that water burst from the blocked relief grate moments before the animals appeared.
```

**Failure result**

Text ID: `choice:hounds-cart:failure`

```text
The rain-slick axle twists as it leaves the floor. You keep it raised long enough for the porter to roll free, but the strain tears through your shoulder and the cart crashes behind him. The impact sends the hounds in four directions. Handlers shield the crowd while the pack escapes through the market. The porter is safe and able to give his account; the chance for a calm removal is lost.
```

**Visible bonus label 1**

Text ID: `choice:hounds-cart:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
power rating
```

**Visible bonus label 2**

Text ID: `choice:hounds-cart:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
secure gloves
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › testimony**

Text ID: `choice:hounds-cart:effects:effects:success:testimony`

```text
The rescued porter saw water burst from the blocked relief grate before the pack arrived.
```

**Effect copy: effects › failure › hp Reason**

Text ID: `choice:hounds-cart:effects:effects:failure:hpReason`

```text
strained when the wet cart axle twisted free
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:hounds-cart:effects:effects:failure:consequence`

```text
The market pack scattered before handlers could guide it.
```

###### Stop the lifting gears and use their low idle tone to calm the pack. (INT) `hounds-gears`

- Choice ID: `hounds-gears`
- Type: `check`
- Stat / DC: INT / 12
- Next on success: `tutorial-floodgate`
- Next on failure: `tutorial-floodgate`

**Choice label**

Text ID: `choice:hounds-gears:label`

```text
Stop the lifting gears and use their low idle tone to calm the pack. (INT)
```

**Success result**

Text ID: `choice:hounds-gears:success`

```text
You trace the hammering shutters to their striking cam, oil the stiff clutch, and disengage the blow without stopping the flywheel. A low, even tone replaces the repeated crash. The largest hound raises its head. When the deeper pulse returns, the flywheel masks its painful edge, and the pack’s rigid posture eases. Handlers approach one step at a time and lead the animals out beneath the steady note. The market engineer copies your new idle setting before restarting the other machinery.
```

**Failure result**

Text ID: `choice:hounds-gears:failure`

```text
The crowded gear train hides which axle drives the striking cam. Your lockpin releases the neighboring catch instead, and every shutter slams closed at once. Darkness and fresh noise drive the hounds toward the rear stalls. You stop the machinery before anyone is bitten, but the market must be evacuated through its service doors while handlers move the pack in the confined dark. The locked gears will need a full repair before the market can reopen.
```

**Visible bonus label 1**

Text ID: `choice:hounds-gears:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
freed clutch
```

**Visible bonus label 2**

Text ID: `choice:hounds-gears:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
cam release
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › evidence**

Text ID: `choice:hounds-gears:effects:effects:success:evidence`

```text
A stable mechanical tone calmed animals distressed by the underground pulse.
```

**Effect copy: effects › success › repair**

Text ID: `choice:hounds-gears:effects:effects:success:repair`

```text
Market lifting gears retuned to a quieter idle.
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:hounds-gears:effects:effects:failure:consequence`

```text
The market closed for emergency evacuation after its lifting gear locked.
```

#### The Buried Relief Gate `tutorial-floodgate`

- Scene ID: `tutorial-floodgate`
- Chapter: `tutorial`
- Choice count: 3

**Scene title**

Text ID: `scene:tutorial-floodgate:title`

```text
The Buried Relief Gate
```

**Current objective**

Text ID: `scene:tutorial-floodgate:objective`

```text
Restore the relief gate beneath the Tangles market.
```

**Scene narration**

Text ID: `scene:tutorial-floodgate:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
Beyond the flooded den, the omitted maintenance throat slopes beneath the market and ends at a stone relief gate. Silt, broken tile, and years of household debris bury its lower half. The gate predates the warped iron collar at the bell-stair; founder marks still trace the arc of its counterweight, and beneath the rust its mechanism appears worn but whole.

Three inspection plates hang on the wall. Together they explain why no crew has touched the gate in years. The Halls maintain the upper drain. The Tangles maintain the market grate. The Works budget ends at the wall between them. Each plate carries a clean signature and a boundary line, but none names the mechanism sitting directly before you. No one secretly destroyed it. Every office simply stopped at the edge of its authority until a public work became no one's work.

Water strikes the buried gate with a heavy, measured pulse. Mud jumps around your boots. After a short silence it strikes again, harder, and a thread of water cuts through the market wall above. Residents arrive with buckets; Watch officers bring a chain; a drain crew argues that opening the gate too quickly may tear the old counterweight free. For the first time, every part of the failure stands in one room.
```

##### Choices

###### Clear the silt while residents form a bucket line. (STR) `relief-clear`

- Choice ID: `relief-clear`
- Type: `check`
- Stat / DC: STR / 11
- Next on success: `tutorial-report`
- Next on failure: `tutorial-report`

**Choice label**

Text ID: `choice:relief-clear:label`

```text
Clear the silt while residents form a bucket line. (STR)
```

**Success result**

Text ID: `choice:relief-clear:success`

```text
You fasten the Rope Coil to the gate’s buried crossbar while residents form a line from the channel to the market steps. Buckets carry away mud, broken tile, and decades of ordinary neglect. When the founder marks finally emerge, Watch officers and drain workers pull beside the households. The stone gate rises with a grinding roar. Water drops by a handspan beneath the market and bell-stair foundations, and cheers follow the first clean rush into the old channel.
```

**Failure result**

Text ID: `choice:relief-clear:failure`

```text
The bucket line clears enough silt to expose the crossbar, but the next pulse strikes before the lower hinge is free. You haul the gate halfway open and chain it there while mud rushes around your knees. Pressure falls immediately, buying the Tangles several precious hours. The opening will not survive the night without a Works crew, and Brunna sends that need ahead before you leave the chamber.
```

**Visible bonus label 1**

Text ID: `choice:relief-clear:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
haul line
```

**Visible bonus label 2**

Text ID: `choice:relief-clear:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
resident bucket line
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › repair**

Text ID: `choice:relief-clear:effects:effects:success:repair`

```text
Tangles relief gate fully reopened with resident help.
```

**Effect copy: effects › failure › repair**

Text ID: `choice:relief-clear:effects:effects:failure:repair`

```text
Tangles relief gate opened halfway, buying several hours.
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:relief-clear:effects:effects:failure:consequence`

```text
A Works crew must clear the remaining silt before nightfall.
```

###### Reset the old counterweight before opening the gate. (INT) `relief-balance`

- Choice ID: `relief-balance`
- Type: `check`
- Stat / DC: INT / 12
- Next on success: `tutorial-report`
- Next on failure: `tutorial-report`

**Choice label**

Text ID: `choice:relief-balance:label`

```text
Reset the old counterweight before opening the gate. (INT)
```

**Success result**

Text ID: `choice:relief-balance:success`

```text
You clean the founder marks with Surveyor’s Chalk and ignore the newer iron labels that place the mechanism one notch too high. Piera’s omitted route explains where the original return channel carried the released weight. The counterbalance settles into that path, and the gate rises evenly instead of wrenching against its frame. As the water drains, the low overtone weakens across the chamber. Residents fall silent to hear the change, then mark the true setting beside your own.
```

**Failure result**

Text ID: `choice:relief-balance:failure`

```text
A modern repair plate covers one of the original counterweight notches. You discover it only when the gate begins to lift unevenly. Rather than force the mechanism and tear its frame, you lower it to a narrow emergency opening and secure it with a resident’s Mender’s Clamp. The pressure eases, but the borrowed tool must remain in place until a restoration crew exposes the hidden notch.
```

**Visible bonus label 1**

Text ID: `choice:relief-balance:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
founder marks
```

**Visible bonus label 2**

Text ID: `choice:relief-balance:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
omitted route
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › repair**

Text ID: `choice:relief-balance:effects:effects:success:repair`

```text
Founder-era relief counterweight restored to balance.
```

**Effect copy: effects › success › evidence**

Text ID: `choice:relief-balance:effects:effects:success:evidence`

```text
Restoring an older balanced mechanism weakened the shared overtone.
```

**Effect copy: effects › failure › repair**

Text ID: `choice:relief-balance:effects:effects:failure:repair`

```text
Relief gate chained at a narrow emergency opening.
```

**Effect copy: effects › failure › item › reason**

Text ID: `choice:relief-balance:effects:effects:failure:item:reason`

```text
A resident lends you a clamp to hold the emergency opening until a Works crew arrives.
```

###### Assign the opening sequence among residents, Watch, and drain workers. (CHA) `relief-coordinate`

- Choice ID: `relief-coordinate`
- Type: `check`
- Stat / DC: CHA / 11
- Next on success: `tutorial-report`
- Next on failure: `tutorial-report`

**Choice label**

Text ID: `choice:relief-coordinate:label`

```text
Assign the opening sequence among residents, Watch, and drain workers. (CHA)
```

**Success result**

Text ID: `choice:relief-coordinate:success`

```text
You place the three inspection plates side by side and ask each group to name what it can safely control. Residents clear the silt and watch the market walls. Drain workers set the counterweight. The Watch holds the crowd and carries pressure readings. Because every group hears how the others’ work affects its own, the gate opens under shared control. Before anyone disperses, the first permanent repair crew arrives with a maintenance order bearing all three signatures.
```

**Failure result**

Text ID: `choice:relief-coordinate:failure`

```text
Years of unpaid damage and ignored warnings cannot be settled in one flooded chamber. The groups argue over who must touch the mechanism first, and the next pulse ends the debate. You use the Deep Writ’s limited emergency authority to make the gate safe, but each office records the action as someone else’s temporary duty. Water begins to fall; the dispute that buried the gate remains in place.
```

**Visible bonus label 1**

Text ID: `choice:relief-coordinate:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
local trust
```

**Visible bonus label 2**

Text ID: `choice:relief-coordinate:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
public trust
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › repair**

Text ID: `choice:relief-coordinate:effects:effects:success:repair`

```text
Relief gate reopened under a shared maintenance plan.
```

**Effect copy: effects › success › testimony**

Text ID: `choice:relief-coordinate:effects:effects:success:testimony`

```text
Residents, Watch, and drain workers agreed to a shared account of the failure.
```

**Effect copy: effects › failure › repair**

Text ID: `choice:relief-coordinate:effects:effects:failure:repair`

```text
Relief gate made safe under a temporary order.
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:relief-coordinate:effects:effects:failure:consequence`

```text
The offices still dispute permanent responsibility.
```

#### The Joined Account `tutorial-report`

- Scene ID: `tutorial-report`
- Chapter: `tutorial`
- Choice count: 2

**Scene title**

Text ID: `scene:tutorial-report:title`

```text
The Joined Account
```

**Current objective**

Text ID: `scene:tutorial-report:objective`

```text
Present a precise account without claiming more than the evidence proves.
```

**Scene narration**

Text ID: `scene:tutorial-report:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
Evening has settled over the Public Bell by the time you return. Your coat smells of wet stone and animal musk, and mud has dried in the hinges of your field case. Brunna reads the ledger while clerks make clean copies of the emergency orders already sent to the Tangles. She pauses over every correction and runs one thumb across the tamper marks left by your sealed entries.

The joined account connects a cheap iron collar, a route cropped from modern maps, animals displaced from a flooded den, and a relief gate abandoned between offices. It also records the same low overtone at every site. Nothing in the evidence tells you what produces that sound, only that it moves through structures the current plans insist are separate.

Brunna closes the ledger. Behind her, the bell rings the evening hour. Both of you wait. A faint second tremor passes through the slate table after the final note. “That,” she says quietly, “is why a Threadbearer must know the difference between courage and certainty.” She slides the ledger back across the table. “Give me one finding the city can act upon tonight. Then give me one question you have not yet earned the right to answer.”
```

##### Choices

###### Name the maintenance chain and leave the unknown source marked as unknown. (INT) `report-precise`

- Choice ID: `report-precise`
- Type: `check`
- Stat / DC: INT / 10
- Next on success: `halls-deep-writ`
- Next on failure: `halls-deep-writ`

**Choice label**

Text ID: `choice:report-precise:label`

```text
Name the maintenance chain and leave the unknown source marked as unknown. (INT)
```

**Success result**

Text ID: `choice:report-precise:success`

```text
You separate what the route proves from what it only suggests. The ledger assigns immediate repairs to the iron collar, omitted throat, market gears, and relief gate, then marks the climbing overtone as a connected phenomenon of unknown origin. Brunna tests every link and finds no claim reaching beyond its evidence. She seals the account before the clerks as a model of field judgment, and the final impression feels deeper than the Institute’s practice plates ever did.
```

**Failure result**

Text ID: `choice:report-precise:failure`

```text
Your first summary calls the overtone a single mechanical source. Brunna asks which machine you inspected, and the confident phrase fails beneath the simple question. In full view of the clerks, you reopen the leaf, replace the claim with a distributed pattern of unknown cause, and seal the correction beside the error. The account is less elegant and more honest. Brunna allows both versions to remain visible because that is precisely what a Thread Ledger is for.
```

**Visible bonus label 1**

Text ID: `choice:report-precise:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
field record
```

**Visible bonus label 2**

Text ID: `choice:report-precise:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
careful record
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › evidence**

Text ID: `choice:report-precise:effects:effects:success:evidence`

```text
The joined account proves connected neglect without claiming a known source.
```

**Effect copy: effects › success › milestone**

Text ID: `choice:report-precise:effects:effects:success:milestone`

```text
Completed the first joined Threadbearer account.
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:report-precise:effects:effects:failure:consequence`

```text
The public record preserves an overstatement and its correction.
```

###### Lead with the people endangered by the gaps between offices. (CHA) `report-people`

- Choice ID: `report-people`
- Type: `check`
- Stat / DC: CHA / 11
- Next on success: `halls-deep-writ`
- Next on failure: `halls-deep-writ`

**Choice label**

Text ID: `choice:report-people:label`

```text
Lead with the people endangered by the gaps between offices. (CHA)
```

**Success result**

Text ID: `choice:report-people:success`

```text
You begin with the two stair-keepers, the flooded households, the injured porter, and the crews who found themselves responsible for a gate no office owned. Their named accounts make the jurisdiction line impossible to treat as an abstraction. When the clerks ask which office should act, Brunna points to the joined testimony and orders Works and Watch to share the immediate duty while the deeper cause is investigated. The people who carried the failure now stand inside the public record of its repair.
```

**Failure result**

Text ID: `choice:report-people:failure`

```text
Two clerks challenge details in the residents’ timing and try to dismiss the whole account as inconsistent. You call the named witnesses back to the table. They disagree openly over the hour, then confirm the same pulsing rise, blocked grate, and abandoned boundary. The report survives with narrower language and stronger testimony. Brunna notes that you protected their meaning without pretending they all remembered the same moment perfectly.
```

**Visible bonus label 1**

Text ID: `choice:report-people:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
worker testimony
```

**Visible bonus label 2**

Text ID: `choice:report-people:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
public standing
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › milestone**

Text ID: `choice:report-people:effects:effects:success:milestone`

```text
Placed affected residents and workers into the public account.
```

**Effect copy: effects › failure › testimony**

Text ID: `choice:report-people:effects:effects:failure:testimony`

```text
Named residents upheld the sequence after clerks challenged the report.
```

### Act II — A Writ Below

- Chapter ID: `halls`
- Scenes: 3

**Act label**

Text ID: `chapter:halls:act`

```text
Act II
```

**Chapter title**

Text ID: `chapter:halls:title`

```text
A Writ Below
```

#### The Deep Writ `halls-deep-writ`

- Scene ID: `halls-deep-writ`
- Chapter: `halls`
- Choice count: 2
- Entry authority: Threadbearer under Deep Writ
- Entry writ: deep

**Scene title**

Text ID: `scene:halls-deep-writ:title`

```text
The Deep Writ
```

**Current objective**

Text ID: `scene:halls-deep-writ:objective`

```text
Accept authority to follow the shared overtone below the civic Halls.
```

**Scene narration**

Text ID: `scene:halls-deep-writ:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
Brunna sends the clerks away before she opens a narrow iron case. Inside lies a dark brass seal marked with the descending stair of the Deep Writ. At the Institute, it was spoken of with the reverence reserved for distant expeditions and names cut into memorial stone. Brunna fixes it beside your probationary mark without ceremony, then turns the ledger so you can see both seals together.

“This opens restricted public works, cross-office records, and the old routes beneath the Halls,” she says. “It compels cooperation from offices. It does not put workers, residents, or private homes under your command. A Deep Writ extends your reach, not your wisdom.”

She lays out three older Halls reports. Each describes the same delayed overtone. One went to Drainage, one to Civic Stone, and one to the Archives; each office closed its own file without comparing the others. The oldest report points toward a sealed map room beneath the Council floor. Brunna's hand rests upon the new seal for a moment. Pride warms her expression, but concern remains behind it. “You found a true connection and left its cause honestly unknown. That is why I am sending you farther. Follow it—and come back with more than a beautiful theory.”
```

##### Entry records and rewards

**Entry copy: enter › item › reason**

Text ID: `scene:halls-deep-writ:enter:enter:item:reason`

```text
Brunna fixes the seal to your ledger as proof of lawful access below the Halls.
```

**Entry copy: enter › milestone**

Text ID: `scene:halls-deep-writ:enter:enter:milestone`

```text
Earned a Deep Writ.
```

##### Choices

###### Enter the sealed map room with Brunna’s order. `deep-writ-maps`

- Choice ID: `deep-writ-maps`
- Type: `advance`
- Next on success: `halls-omitted-route`

**Choice label**

Text ID: `choice:deep-writ-maps:label`

```text
Enter the sealed map room with Brunna’s order.
```

**Immediate outcome**

Text ID: `choice:deep-writ-maps:outcome`

```text
The map-room keeper breaks an old wax strip and admits no Threadbearer has requested these plans in twenty-three years.
```

###### Journal, reward, and consequence copy

###### Ask a drain crew to witness the map-room inspection. `deep-writ-workers`

- Choice ID: `deep-writ-workers`
- Type: `advance`
- Next on success: `halls-omitted-route`

**Choice label**

Text ID: `choice:deep-writ-workers:label`

```text
Ask a drain crew to witness the map-room inspection.
```

**Immediate outcome**

Text ID: `choice:deep-writ-workers:outcome`

```text
Two drain workers come with you. Their working memory will test whether the official plans describe any route that still exists.
```

###### Journal, reward, and consequence copy

**Effect copy: effects › testimony**

Text ID: `choice:deep-writ-workers:effects:effects:testimony`

```text
Drain workers witnessed the Deep Writ inspection.
```

#### The Map That Ends Early `halls-omitted-route`

- Scene ID: `halls-omitted-route`
- Chapter: `halls`
- Choice count: 2

**Scene title**

Text ID: `scene:halls-omitted-route:title`

```text
The Map That Ends Early
```

**Current objective**

Text ID: `scene:halls-omitted-route:objective`

```text
Trace why modern civic plans omit the route below the Tangles.
```

**Scene narration**

Text ID: `scene:halls-omitted-route:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
The map room smells of dust, lamp oil, and the sweet wax used to seal forgotten cabinets. Its keeper breaks a strip that has remained intact for twenty-three years, then helps you unroll the modern plan across a table large enough to chart an entire terrace. The omitted maintenance throat from Piera's map appears at last—only to stop at a ruler-straight ink border marked OUTSIDE FUNDED JURISDICTION.

Beneath the modern sheet lies an older vellum map. Its lines ignore the later border and continue beneath the Archives, down an abandoned pressure stair, and into the first cistern galleries. Drain workers at your side recognize work-names along the route that no longer appear in official indexes. By laying successive copies over one another, you watch the city forget itself. No official erased the route in one dramatic act. Each office copied only the section it funded, and with every new plan the full connection grew shorter until it disappeared from daily use.

Along the map's margin runs a column of denied repairs. Different clerks wrote the dates, but the same countersign closes each request: Works Comptroller Halvek. The latest denial is less than a month old. Somewhere beyond the cropped line, a pressure stair beneath the Archives is still waiting for an inspection the city has repeatedly declared to be someone else's responsibility.
```

##### Choices

###### Align the maps by founder benchmarks rather than modern property lines. (INT) `map-layers`

- Choice ID: `map-layers`
- Type: `check`
- Stat / DC: INT / 11
- Next on success: `halls-comptroller`
- Next on failure: `halls-comptroller`

**Choice label**

Text ID: `choice:map-layers:label`

```text
Align the maps by founder benchmarks rather than modern property lines. (INT)
```

**Success result**

Text ID: `choice:map-layers:success`

```text
You pin each map at the founder benchmarks that have not moved, then rotate the later plans around them. The cropped lines meet one after another. What modern offices treat as separate drains and passages is one continuous route passing beneath the Archives and descending toward an abandoned pressure stair. A drain worker traces the full line with one stained finger. “We still use pieces of it,” she says. “No one told us they were pieces of the same road.”
```

**Failure result**

Text ID: `choice:map-layers:failure`

```text
A shifted terrace number sends your first alignment into a false junction beneath a solid wall. One of the drain workers notices that your route crosses a pump gallery she has repaired for twenty years. You leave the mistaken line visible, reset the maps by the older benchmarks, and ask for the crew’s work-name for the missing stair. Their answer identifies the correct descent even though the complete map still refuses to align.
```

**Visible bonus label 1**

Text ID: `choice:map-layers:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
lived route
```

**Visible bonus label 2**

Text ID: `choice:map-layers:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
founder benchmarks
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › evidence**

Text ID: `choice:map-layers:effects:effects:success:evidence`

```text
Successive civic maps cropped one continuous maintenance route at office boundaries.
```

**Effect copy: effects › failure › testimony**

Text ID: `choice:map-layers:effects:effects:failure:testimony`

```text
Drain workers identified the pressure stair omitted by modern terrace numbers.
```

###### Follow the drain workers’ name for the route instead of the Comptroller’s filing chain. `map-workers-route`

- Choice ID: `map-workers-route`
- Type: `advance`
- Next on success: `archives-entry`

**Choice label**

Text ID: `choice:map-workers-route:label`

```text
Follow the drain workers’ name for the route instead of the Comptroller’s filing chain.
```

**Immediate outcome**

Text ID: `choice:map-workers-route:outcome`

```text
The crew leads you through a staffed pump room to an Archives foundation door. You postpone the office confrontation but record every denied repair attached to the route.
```

###### Journal, reward, and consequence copy

**Effect copy: effects › evidence**

Text ID: `choice:map-workers-route:effects:effects:evidence`

```text
Repeated repair denials left the Archives pressure stair unmaintained.
```

**Effect copy: effects › route**

Text ID: `choice:map-workers-route:effects:effects:route`

```text
worker route
```

#### A Responsible Delay `halls-comptroller`

- Scene ID: `halls-comptroller`
- Chapter: `halls`
- Choice count: 2

**Scene title**

Text ID: `scene:halls-comptroller:title`

```text
A Responsible Delay
```

**Current objective**

Text ID: `scene:halls-comptroller:objective`

```text
Obtain the denied repair files from the Works Comptroller.
```

**Scene narration**

Text ID: `scene:halls-comptroller:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
Comptroller Halvek receives you in a dusty office just above the wet Halls. One mechanical lantern burns weakly over an unfinished budget, and filigreed contracts rise in tottering stacks around his desk. Their borders are elaborate enough for a coronation; the pages inside authorize decorative foundry work on High House terraces.

Halvek glances at the denied proposals you place before him. His eyes rest upon his own countersign only briefly before he begins a well-rehearsed explanation. “Every request was reviewed under the budget and jurisdiction in force at the time of submission.” He shifts on his feet and straightens a contract that was not crooked. “My office has no authority to question measures lawfully placed upon my desk. I can order another survey, seek a ruling on ownership, and submit the work for winter allocation.”

Your Deep Writ requires him to release the relevant files. It cannot force him to understand what those files mean together. When he gestures toward his orderly process, the top stack slides aside. Near the bottom you glimpse the sigil of the Archives on a fresh request to examine a cistern-level pressure field. Beside it, a clerk has copied the same obsolete vibration mark found at the bell-stair. Water darkens the paper's lower edge.
```

##### Choices

###### Read the denied repairs in order and ask Halvek which office owns the whole route. (CHA) `comptroller-chain`

- Choice ID: `comptroller-chain`
- Type: `check`
- Stat / DC: CHA / 12
- Next on success: `archives-entry`
- Next on failure: `archives-entry`

**Choice label**

Text ID: `choice:comptroller-chain:label`

```text
Read the denied repairs in order and ask Halvek which office owns the whole route. (CHA)
```

**Success result**

Text ID: `choice:comptroller-chain:success`

```text
You read each request aloud with its date, danger, and lawful reason for refusal. Halvek answers the first three from memory. By the seventh, his voice has thinned. When you ask which office finally became responsible for the continuous route, he searches the budget columns and finds only borders. The silence lengthens beside your open ledger. Rather than let that silence become his only answer, Halvek releases the full files and signs an emergency crew to the Archives stair. He never confesses to villainy; he does something rarer and more useful—he acts beyond the habit that protected him.
```

**Failure result**

Text ID: `choice:comptroller-chain:failure`

```text
Halvek endures the reading without interrupting, then cites the exact clause limiting your demand. He releases every file the Deep Writ requires and withholds the discretionary funds that could place a crew beside you. Yet the victory of procedure turns hollow when the pages lie together. Each refusal was lawful by itself. Together they abandoned one public system. Halvek cannot remove that sequence from the brass leaves now resting between you.
```

**Visible bonus label 1**

Text ID: `choice:comptroller-chain:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
map chain
```

**Visible bonus label 2**

Text ID: `choice:comptroller-chain:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
tamper-evident record
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › evidence**

Text ID: `choice:comptroller-chain:effects:effects:success:evidence`

```text
The Comptroller admitted no office accepts responsibility for the continuous route.
```

**Effect copy: effects › success › repair**

Text ID: `choice:comptroller-chain:effects:effects:success:repair`

```text
Emergency crew assigned to the Archives pressure stair.
```

**Effect copy: effects › failure › evidence**

Text ID: `choice:comptroller-chain:effects:effects:failure:evidence`

```text
Every repair refusal was procedurally lawful, but together they abandoned a public system.
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:comptroller-chain:effects:effects:failure:consequence`

```text
The Comptroller withheld discretionary repair funds.
```

###### Compare the fresh Archives request with the overtone marks in your ledger. (INT) `comptroller-request`

- Choice ID: `comptroller-request`
- Type: `check`
- Stat / DC: INT / 11
- Next on success: `archives-entry`
- Next on failure: `archives-entry`

**Choice label**

Text ID: `choice:comptroller-request:label`

```text
Compare the fresh Archives request with the overtone marks in your ledger. (INT)
```

**Success result**

Text ID: `choice:comptroller-request:success`

```text
You move the ornamental contracts aside and place the Archives request beneath your listening notes. The obsolete code uses a different scale, but its spacing matches the delayed overtone at the bell-stair exactly. A second entry records water rising against the expected pressure gradient. Halvek recognizes the match when you convert both notations into current measures. Before the comparison can enter the public record without his cooperation, he releases the complete maintenance series and signs a route token to the Archives foundation.
```

**Failure result**

Text ID: `choice:comptroller-request:failure`

```text
The request uses a vibration code retired before your instructors were born. You can prove that it describes a repeating pressure anomaly, but not that its interval matches the bell-stair. Halvek seizes upon the uncertainty and withholds the older maintenance series. The Deep Writ still makes the current request sufficient for lawful entry to the Archives foundation, where someone may be able to read what his office cannot—or will not.
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › evidence**

Text ID: `choice:comptroller-request:effects:effects:success:evidence`

```text
The Archives pressure stair reports the same low overtone.
```

**Effect copy: effects › failure › discovery**

Text ID: `choice:comptroller-request:effects:effects:failure:discovery`

```text
A current Archives repair request uses an obsolete vibration code.
```

**Effect copy: effects › failure › route**

Text ID: `choice:comptroller-request:effects:effects:failure:route`

```text
archive request
```

### Act III — The First Register

- Chapter ID: `archives`
- Scenes: 6

**Act label**

Text ID: `chapter:archives:act`

```text
Act III
```

**Chapter title**

Text ID: `chapter:archives:title`

```text
The First Register
```

#### The Foundation Door `archives-entry`

- Scene ID: `archives-entry`
- Chapter: `archives`
- Choice count: 2

**Scene title**

Text ID: `scene:archives-entry:title`

```text
The Foundation Door
```

**Current objective**

Text ID: `scene:archives-entry:objective`

```text
Bring the joined account to Lithen in the deep Archives.
```

**Scene narration**

Text ID: `scene:archives-entry:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
The foundation door opens upon warm, amber darkness. The working levels of the Archives descend in galleries cut around ancient pipes, their walls crowded with law tablets, rolled maps, brass leaves, and stitched accounts from every age of the city. Restorers dry flood-stained records over low heat while indexers move silently between them. Every footstep returns twice: once from the stone beneath you, and once from somewhere deeper than the lamps can reveal.

Lithen the Wise waits beside the three old Halls reports. She is smaller than the portraits in the Threadbearer Institute and far older than their captions admit. Time has bent her shoulders, but her pale eyes move over your ledger with unnerving speed. She touches the Deep Writ seal, then the mud dried along the field case.

“So Brunna's promising graduate has followed a forgotten drain to my foundation,” she says. Her voice is soft, precise, and readily heard through the gallery. “Good. Your route is older than the offices that divided it, and the Archives have been taking water where their maps insist no water can arrive.” She gathers the reports beneath one thin arm. “Come. We shall compare what repeats before we burden it with a name. Names are useful things, child, but only after the evidence has grown strong enough to carry them.”
```

##### Branch arrivals

**Arrival from comptroller-chain:success**

Text ID: `scene:archives-entry:arrival:comptroller-chain:success`

Context: This sentence bridges the previous choice result into this scene.

```text
A newly authorized repair crew reaches the foundation door beside you, carrying the maintenance files Halvek released.
```

**Arrival from comptroller-chain:failure**

Text ID: `scene:archives-entry:arrival:comptroller-chain:failure`

Context: This sentence bridges the previous choice result into this scene.

```text
You reach the foundation door with the required files but no emergency crew or repair funds.
```

**Arrival from comptroller-request:success**

Text ID: `scene:archives-entry:arrival:comptroller-request:success`

Context: This sentence bridges the previous choice result into this scene.

```text
The full maintenance series fills your document case when you present the Deep Writ at the foundation door.
```

**Arrival from comptroller-request:failure**

Text ID: `scene:archives-entry:arrival:comptroller-request:failure`

Context: This sentence bridges the previous choice result into this scene.

```text
The current repair request opens the foundation door, though its obsolete vibration code remains unresolved.
```

##### Entry records and rewards

**Entry copy: enter › item › reason**

Text ID: `scene:archives-entry:enter:enter:item:reason`

```text
Lithen lends you her Archive Lens so you can examine altered ink and pressure marks during the comparison.
```

**Entry copy: enter › milestone**

Text ID: `scene:archives-entry:enter:enter:milestone`

```text
Brought the joined account to Lithen the Wise.
```

##### Choices

###### Follow Lithen to the resonant record well. `archives-follow`

- Choice ID: `archives-follow`
- Type: `advance`
- Next on success: `archives-record-well`

**Choice label**

Text ID: `choice:archives-follow:label`

```text
Follow Lithen to the resonant record well.
```

**Immediate outcome**

Text ID: `choice:archives-follow:outcome`

```text
She carries no weapon—only a lamp, a tuning weight, and your ledger copied onto a clean brass leaf.
```

###### Journal, reward, and consequence copy

###### Ask why the Archives foundation belongs in a water investigation. `archives-ask-record`

- Choice ID: `archives-ask-record`
- Type: `advance`
- Next on success: `archives-record-well`

**Choice label**

Text ID: `choice:archives-ask-record:label`

```text
Ask why the Archives foundation belongs in a water investigation.
```

**Immediate outcome**

Text ID: `choice:archives-ask-record:outcome`

```text
Lithen explains that early laws, maintenance patterns, and civic calibrations were stored together because the founders did not separate public duty from the works that sustained it.
```

###### Journal, reward, and consequence copy

**Effect copy: effects › discovery**

Text ID: `choice:archives-ask-record:effects:effects:discovery`

```text
Founder-era records join civic decisions to physical maintenance patterns.
```

#### The Resonant Record Well `archives-record-well`

- Scene ID: `archives-record-well`
- Chapter: `archives`
- Choice count: 2

**Scene title**

Text ID: `scene:archives-record-well:title`

```text
The Resonant Record Well
```

**Current objective**

Text ID: `scene:archives-record-well:objective`

```text
Compare the overtone against preserved maintenance and civic records.
```

**Scene narration**

Text ID: `scene:archives-record-well:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
Impossibly thin brass leaves line the walls of the cylindrical Record Well. Their edges descend beyond the reach of Lithen's lamp, each leaf engraved with the date, place, and witness of a Threadbearer's account. Some of the oldest retain small holes along their margins where their first versions were bound with needle and thread before the Archives learned to strike testimony into metal.

Lithen lays your ledger upon a circular dish and lifts a small padded weight. “The Well does not summon the dead,” she says, anticipating the question on your face. “It compares what they measured.” She lets the weight fall. A clear hum fills the chamber and descends into the dark. Then the records answer—not in voices, but layer by layer, as hundreds of old impressions alter the note and return it to the dish.

Your bell-stair account wakes three leaves. The Tangles testimony wakes seven more. Lithen adds old cistern surveys, a Brassworks failure, and a pressure report made before the present city map. The same low overtone rises from systems joined by no modern pipe or gear. Its oldest trace is centuries old, faint beneath a stable return that the newer records steadily obscure.

“Fascinating,” Lithen murmurs. Wonder brightens her face, followed quickly by caution. She points to the matching marks. “This proves the disturbance is spread across the old works. It does not prove what the disturbance is. Let us discover how much of the older harmony remains beneath it.”
```

##### Choices

###### Use your joined records to separate the founder return from modern interference. (INT) `well-pattern`

- Choice ID: `well-pattern`
- Type: `check`
- Stat / DC: INT / 13
- Next on success: `archives-lithen`
- Next on failure: `archives-lithen`

**Choice label**

Text ID: `choice:well-pattern:label`

```text
Use your joined records to separate the founder return from modern interference. (INT)
```

**Success result**

Text ID: `choice:well-pattern:success`

```text
You fit the Surveyor Hood over your ears and arrange the dated leaves in the order established by your ledger. The harsh overtone shifts with every modern repair, but a slower interval remains steady beneath it. Once you hear that foundation, the rest becomes painfully clear: the city has not created one new sound. Generations of mismatched collars, cheaper alloys, shortened cooling times, and divided maintenance have crowded an older relationship with competing beats. Lithen closes her eyes as the clean interval returns. “There you are,” she whispers—not to a creature, but to a pattern she feared had been lost.
```

**Failure result**

Text ID: `choice:well-pattern:failure`

```text
The Well releases too many returns at once. They blur into a pressure that makes your teeth ache, and you reach for a conclusion before the tones have separated. Lithen catches the dish and lowers a tuning weight onto its rim. The chamber quiets by degrees. You cannot isolate the founder pattern alone, but your failed comparison reveals something valuable: changing one group of records alters replies from distant, mechanically separate systems. You record that limit while Lithen nods approval at your restraint.
```

**Visible bonus label 1**

Text ID: `choice:well-pattern:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
listening plates
```

**Visible bonus label 2**

Text ID: `choice:well-pattern:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
joined observations
```

**Visible bonus label 3**

Text ID: `choice:well-pattern:bonus:3:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
complete repair series
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › evidence**

Text ID: `choice:well-pattern:effects:effects:success:evidence`

```text
A calm founder-era pattern persists beneath modern mechanical interference.
```

**Effect copy: effects › failure › evidence**

Text ID: `choice:well-pattern:effects:effects:failure:evidence`

```text
The disturbance is distributed across multiple civic systems rather than one machine.
```

###### Match worker descriptions to the dated returns. (CHA) `well-testimony`

- Choice ID: `well-testimony`
- Type: `check`
- Stat / DC: CHA / 12
- Next on success: `archives-lithen`
- Next on failure: `archives-lithen`

**Choice label**

Text ID: `choice:well-testimony:label`

```text
Match worker descriptions to the dated returns. (CHA)
```

**Success result**

Text ID: `choice:well-testimony:success`

```text
You read the workers’ phrases beside the old maintenance dates: pressure behind the teeth, water listening in the wall, a second pulse after the bell. What sounded like folklore in separate reports becomes a practical record of distinct failures. Lithen adjusts the Well to each description, and the returning tones fall into sequence with periods of cheaper repairs and longer neglect. The workers preserved changes that official codes were too narrow to name.
```

**Failure result**

Text ID: `choice:well-testimony:failure`

```text
Several accounts name no date, and two use district landmarks that vanished before the current maps were drawn. You cannot place them honestly within the sequence. Lithen refuses to discard them. She seats the undated leaves in a separate ring, where they alter the comparison without pretending to belong to a known year. “An uncertainty marked plainly is still knowledge,” she says. “A convenient date would be a lie.”
```

**Visible bonus label 1**

Text ID: `choice:well-testimony:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
worker trust
```

**Visible bonus label 2**

Text ID: `choice:well-testimony:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
careful hearing
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › testimony**

Text ID: `choice:well-testimony:effects:effects:success:testimony`

```text
Worker descriptions preserve changes omitted by official vibration codes.
```

**Effect copy: effects › failure › testimony**

Text ID: `choice:well-testimony:effects:effects:failure:testimony`

```text
Undated worker accounts remain useful evidence when clearly marked as undated.
```

#### Lithen’s Name for the Deep `archives-lithen`

- Scene ID: `archives-lithen`
- Chapter: `archives`
- Choice count: 3

**Scene title**

Text ID: `scene:archives-lithen:title`

```text
Lithen’s Name for the Deep
```

**Current objective**

Text ID: `scene:archives-lithen:objective`

```text
Understand Lithen’s theory without mistaking it for complete knowledge.
```

**Scene narration**

Text ID: `scene:archives-lithen:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
Lithen seats your ledger in the Well's reading frame. Three older plates answer its low overtone: one impressed during a cistern collapse thirty-two years ago, one from a Brassworks failure before Brunna was born, and one made before the present map of Brassreach. She turns the frame, and the vibration passes through the table. Water trembles beneath the lid of an ink cup.

“No pipe or gear connects these records,” she says. “Yet disturb one part, and another answers at once. The measurements suggest one continuous presence spread through water, resonant stone, and the oldest brass. Not a chorus of smaller lives, nor a mind seated in one secret chamber. If our comparison is sound, its awareness has no single center.”

Lithen closes the Well's immense cover until only a ring of amber light remains. “I cannot speak to its full nature. My old bones will not carry me into the farthest Cistern Fields, and the few Deep-Writ Threadbearers who reached those places returned with incomplete accounts—or did not return at all. They describe water rising without a traveling wave, light answering across separate pools in the same instant, and pressure easing around a clean interval. They do not describe speech, strategy, or chosen victims.”

She folds her hands upon the cover. “I believe the Founders' harmony became more alive than they understood. For centuries it rested within the conditions that gave it being. Now our neglected works reach it as pain, and it spreads upward in blind search of relief, carrying the water with it.” Her gaze does not leave yours. “That is my present theory, not a revealed truth. I have avoided naming it because names are too easily mistaken for mastery. Yet we must discuss what we intend to investigate, and neither gauge nor record can find its boundary. For now, I call it the Unfathomer.”
```

##### Entry records and rewards

**Entry copy: enter › discovery**

Text ID: `scene:archives-lithen:enter:enter:discovery`

```text
Lithen named the distributed living resonance the Unfathomer.
```

**Entry copy: enter › milestone**

Text ID: `scene:archives-lithen:enter:enter:milestone`

```text
Learned Lithen’s evidence-based theory of the Unfathomer.
```

##### Choices

###### Ask which surviving record could test Lithen’s theory. `lithen-origin`

- Choice ID: `lithen-origin`
- Type: `advance`
- Next on success: `archives-first-register`

**Choice label**

Text ID: `choice:lithen-origin:label`

```text
Ask which surviving record could test Lithen’s theory.
```

**Immediate outcome**

Text ID: `choice:lithen-origin:outcome`

```text
Lithen names the First Register, the earliest surviving account to place law, water, structural load, skilled labor, and tone within one civic design. “If its physical pattern matches what the Well preserves,” she says, “then my theory gains a foundation. If it does not, we must be willing to let the theory fall.”
```

###### Journal, reward, and consequence copy

###### Ask how Brassreach can survive a presence that causes harm without intending it. `lithen-danger`

- Choice ID: `lithen-danger`
- Type: `advance`
- Next on success: `archives-first-register`

**Choice label**

Text ID: `choice:lithen-danger:label`

```text
Ask how Brassreach can survive a presence that causes harm without intending it.
```

**Immediate outcome**

Text ID: `choice:lithen-danger:outcome`

```text
“We change the conditions that reach it, guide its search toward safer resonance, or separate the deep network from the city,” Lithen replies. “Every course carries a cost, and none begins with a speech it cannot understand. Our actions must form the meaning.”
```

###### Journal, reward, and consequence copy

**Effect copy: effects › discovery**

Text ID: `choice:lithen-danger:effects:effects:discovery`

```text
The Unfathomer may perceive sustained pattern and intention, but it cannot negotiate in complex speech.
```

###### Ask how laws and social divisions could become physical discord. `lithen-city`

- Choice ID: `lithen-city`
- Type: `advance`
- Next on success: `archives-first-register`

**Choice label**

Text ID: `choice:lithen-city:label`

```text
Ask how laws and social divisions could become physical discord.
```

**Immediate outcome**

Text ID: `choice:lithen-city:outcome`

```text
Lithen places an old repair order beside a newer one. The first requires true bell-metal, a full cooling period, and a crew empowered to stop unsafe work. The second substitutes brittle brass, halves the cooling time, and charges delays against workers’ pay. “Law directs hands, material, time, and danger,” she says. “Repeat those choices for generations, and policy becomes stone.”
```

###### Journal, reward, and consequence copy

**Effect copy: effects › evidence**

Text ID: `choice:lithen-city:effects:effects:evidence`

```text
Generations of civic decisions became physical patterns through labor, repair, and neglect.
```

#### The First Register `archives-first-register`

- Scene ID: `archives-first-register`
- Chapter: `archives`
- Choice count: 3

**Scene title**

Text ID: `scene:archives-first-register:title`

```text
The First Register
```

**Current objective**

Text ID: `scene:archives-first-register:objective`

```text
Recover a readable account from the city’s earliest constitutional record.
```

**Scene narration**

Text ID: `scene:archives-first-register:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
The First Register rests in a restoration cradle behind flood glass. Water damage has swollen its stone-backed leaves until they are too delicate to open, but the brass filigree of its cover still catches every lamp in the chamber. No thief hid the Register and no secret order removed its pages. Neglected pipes did quieter work: year after year, seepage entered the case while requests for restoration waited between offices.

Lithen opens a ceremonial copy beside it. The newer book is handsome, legible, and almost useless. It praises stewardship in polished language but omits the maintenance tables, the calibration intervals, and many of the worker signatures visible through the glass. The original places the Founding Covenant beside practical instructions for public water, structural load, and divided custody of three citywide instruments. Civic principle and engineering appear on facing leaves because the Founders treated them as one responsibility.

You compare the signatures. Stonemasons, pump keepers, bellfounders, cooks, haulers, and elected stewards all marked the earliest pages. In later copies, those many hands vanish beneath the names of hereditary offices. Lithen watches you notice. “Brassreach did not fall from harmony in one wicked hour,” she says. “The first cruel step was teaching those who sustained the city that their knowledge carried less weight than a crest. The rest followed slowly enough to look respectable.” Several crucial leaves remain fused beneath a tide line. Their hidden impressions may show what the ceremonial copy chose not to preserve.
```

##### Choices

###### Use the Archive Lens to read pressure marks beneath the fused ink. (INT) `register-lens`

- Choice ID: `register-lens`
- Type: `check`
- Stat / DC: INT / 13
- Next on success: `archives-restoration`
- Next on failure: `archives-restoration`

**Choice label**

Text ID: `choice:register-lens:label`

```text
Use the Archive Lens to read pressure marks beneath the fused ink. (INT)
```

**Success result**

Text ID: `choice:register-lens:success`

```text
You angle the Archive Lens until the visible ink disappears and only the pressure of the original stylus remains. Hairline impressions rise from beneath the fused leaves. Lithen reads beside you as the missing refrain returns: “Stone bears the load. Brass carries the song. Echo holds what the ages pass on. Three Keys wake the old works below; the living must choose where tomorrow will go.” No command follows. The Founders preserved instruments for understanding, then left the final direction to those who would inherit the consequences.
```

**Failure result**

Text ID: `choice:register-lens:failure`

```text
Minerals in the floodwater scatter the Lens before the final lines can separate. You recover the repeated relationship among Stone, Brass, Echo, and a living choice, but not the complete wording that joins them. Lithen stops you before stronger light can heat the fused ink. “We have learned what the passage concerns,” she says, lowering the lamp. “We have not earned the right to invent what it says.” The incomplete refrain enters your ledger with its missing section clearly marked.
```

**Visible bonus label 1**

Text ID: `choice:register-lens:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
restoration lens
```

**Visible bonus label 2**

Text ID: `choice:register-lens:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
glass catch
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › evidence**

Text ID: `choice:register-lens:effects:effects:success:evidence`

```text
Recovered the complete founder refrain linking the Three Keys to a living choice.
```

**Effect copy: effects › success › item › reason**

Text ID: `choice:register-lens:effects:effects:success:item:reason`

```text
Lithen authorizes a pressure rubbing so the Gate team can carry the recovered refrain without risking the original.
```

**Effect copy: effects › failure › evidence**

Text ID: `choice:register-lens:effects:effects:failure:evidence`

```text
The First Register links Stone, Brass, Echo, and a living choice, though part of its refrain remains unreadable.
```

###### Let the restorers direct your hands and separate one wet leaf at a time. (DEX) `register-restorers`

- Choice ID: `register-restorers`
- Type: `check`
- Stat / DC: DEX / 12
- Next on success: `archives-restoration`
- Next on failure: `archives-restoration`

**Choice label**

Text ID: `choice:register-restorers:label`

```text
Let the restorers direct your hands and separate one wet leaf at a time. (DEX)
```

**Success result**

Text ID: `choice:register-restorers:success`

```text
A senior restorer guides every movement of your hands. You hold the warped frame while her crew draws moisture from the edges with silvered wicks, lifting one leaf only when the fibers release on their own. The full calibration table emerges, followed by rows of stonemason, pump keeper, bellfounder, cook, and hauler signatures omitted from ceremonial copies. When the leaf settles flat, the workers around the cradle see their own trades restored to the city’s first public record.
```

**Failure result**

Text ID: `choice:register-restorers:failure`

```text
The frame shifts beneath your grip, and one softened corner opens along an old crease. You stop before the tear can cross the writing. No words are lost, but the final line of the refrain remains hidden when the senior restorer orders the leaf closed. She marks the damage and your immediate halt in the same report. The main calibration table survives; recovering the rest will require time the flooded Archives do not have tonight.
```

**Visible bonus label 1**

Text ID: `choice:register-restorers:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
steady grip
```

**Visible bonus label 2**

Text ID: `choice:register-restorers:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
followed expert direction
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › testimony**

Text ID: `choice:register-restorers:effects:effects:success:testimony`

```text
The First Register credits workers and stewards omitted from later ceremonial copies.
```

**Effect copy: effects › success › repair**

Text ID: `choice:register-restorers:effects:effects:success:repair`

```text
First Register stabilized for continued restoration.
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:register-restorers:effects:effects:failure:consequence`

```text
A fragile corner of the First Register tore during emergency restoration.
```

**Effect copy: effects › failure › evidence**

Text ID: `choice:register-restorers:effects:effects:failure:evidence`

```text
The main calibration table survived intact.
```

###### Trace how later copies narrowed the Covenant’s public duties. (CHA) `register-law`

- Choice ID: `register-law`
- Type: `check`
- Stat / DC: CHA / 12
- Next on success: `archives-restoration`
- Next on failure: `archives-restoration`

**Choice label**

Text ID: `choice:register-law:label`

```text
Trace how later copies narrowed the Covenant’s public duties. (CHA)
```

**Success result**

Text ID: `choice:register-law:success`

```text
You ask Lithen’s indexers to place each ceremonial copy beside the law that governed real work in the same year. The chain grows clear. Broad public duties survive in speeches while repair authority, safe-work power, and access to materials move toward hereditary offices. No single revision creates the present crisis, and the record names no solitary villain. It shows something more difficult to dismiss: generations of respectable decisions traveling in the same harmful direction.
```

**Failure result**

Text ID: `choice:register-law:failure`

```text
The revisions fill three tables before midnight, with contradictory dates and offices renamed between copies. You resist forcing them into one sweeping conclusion. Instead, you preserve three changes that the original and later texts prove beyond dispute: workers lose the power to halt unsafe work, maintenance custody narrows, and signatures disappear from the public copy. The wider legal pattern remains under review, but those three steps can no longer hide inside ceremony.
```

**Visible bonus label 1**

Text ID: `choice:register-law:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
revision chain
```

**Visible bonus label 2**

Text ID: `choice:register-law:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
civic pattern
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › evidence**

Text ID: `choice:register-law:effects:effects:success:evidence`

```text
Later law preserved the Covenant’s language while narrowing its public duties.
```

**Effect copy: effects › failure › evidence**

Text ID: `choice:register-law:effects:effects:failure:evidence`

```text
Three documented revisions narrowed public maintenance duties; the larger legal pattern remains under review.
```

#### The Echo Instrument `archives-restoration`

- Scene ID: `archives-restoration`
- Chapter: `archives`
- Choice count: 2

**Scene title**

Text ID: `scene:archives-restoration:title`

```text
The Echo Instrument
```

**Current objective**

Text ID: `scene:archives-restoration:objective`

```text
Demonstrate that the recovered pattern can be carried without distortion.
```

**Scene narration**

Text ID: `scene:archives-restoration:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
The Echo Key rests inside the Record Well's oldest indexing frame: a dark metal spindle surrounded by concentric brass leaves thin enough to tremble with your breath. Lithen turns each ring until the recovered interval of the First Register sounds through the chamber. The note is not loud, yet every old plate answers in its proper place, as if a corridor has opened through centuries of accumulated noise.

“This instrument preserves a reference,” Lithen says. “It compares what a system was, what changed, and which earlier condition remained stable. That is Pattern—not obedience to the past, but the means to recognize what the past has handed us.” She shows you the custody marks cut around the spindle. No ruler, archivist, or Threadbearer can alter both the city and the record of what came before. The separation is deliberate.

Your own account must now pass through the Well. Its successful repairs are easy to preserve; its failed attempts, conflicting testimony, and corrected conclusions will test whether the record holds together without becoming falsely simple. Lithen places one hand upon the Key and waits. She will trust it to your custody only if the Well can return the truth you actually witnessed.
```

##### Choices

###### Send the full account—including failures and corrections—through the record well. (INT) `echo-full-record`

- Choice ID: `echo-full-record`
- Type: `check`
- Stat / DC: INT / 13
- Next on success: `archives-echo-key`
- Next on failure: `archives-echo-key`

**Choice label**

Text ID: `choice:echo-full-record:label`

```text
Send the full account—including failures and corrections—through the record well. (INT)
```

**Success result**

Text ID: `choice:echo-full-record:success`

```text
You seat the complete account in the Well: successful repairs, abandoned machinery, conflicting testimony, and every correction made in the field. The first return is rough, but none of its discord comes from a hidden omission. As the rings align, each correction remains visible while the central sequence holds. The Echo Key answers with a clear, steady interval, proving that an honest pattern can survive complexity without being flattened into a cleaner lie.
```

**Failure result**

Text ID: `choice:echo-full-record:failure`

```text
The Well stops twice against blank spaces in your chronology. You search the field leaves and find that neither missing date can be recovered. Rather than infer them from nearby entries, you strike UNKNOWN into both positions and send the account through again. The Echo Key produces a weaker interval, but it holds. Lithen accepts the result because its limit is now part of the record instead of concealed beneath confidence.
```

**Visible bonus label 1**

Text ID: `choice:echo-full-record:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
complete ledger
```

**Visible bonus label 2**

Text ID: `choice:echo-full-record:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
record accuracy
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › evidence**

Text ID: `choice:echo-full-record:effects:effects:success:evidence`

```text
The joined account remained coherent through the Echo Key’s record test.
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:echo-full-record:effects:effects:failure:consequence`

```text
Two dates remain unresolved in the joined account.
```

###### Have workers and restorers witness how their words return. (CHA) `echo-witnesses`

- Choice ID: `echo-witnesses`
- Type: `check`
- Stat / DC: CHA / 12
- Next on success: `archives-echo-key`
- Next on failure: `archives-echo-key`

**Choice label**

Text ID: `choice:echo-witnesses:label`

```text
Have workers and restorers witness how their words return. (CHA)
```

**Success result**

Text ID: `choice:echo-witnesses:success`

```text
You invite the workers and restorers to stand around the Well while their statements pass through it. A pump keeper hears her rough description remain beside Lithen’s technical notation; a restorer hears his objection preserved rather than reduced to delay. Their accounts differ in language and emphasis, yet the Echo Key holds those differences around the same observable sequence. When the final note settles, every witness can point to their own words inside the joined pattern.
```

**Failure result**

Text ID: `choice:echo-witnesses:failure`

```text
The first return gives your summary too much weight and reduces three witnesses to supporting phrases. A furnace worker folds her arms. “That is what you heard,” she says. “It is not all we told you.” You reopen the leaf before the Well, restore each statement in its own language, and repeat the test. The second interval is less elegant but true enough that the witnesses recognize themselves within it.
```

**Visible bonus label 1**

Text ID: `choice:echo-witnesses:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
witness trust
```

**Visible bonus label 2**

Text ID: `choice:echo-witnesses:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
representative record
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › testimony**

Text ID: `choice:echo-witnesses:effects:effects:success:testimony`

```text
Workers and restorers witnessed their differing accounts preserved by the Echo instrument.
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:echo-witnesses:effects:effects:failure:consequence`

```text
The Echo test required revision after witness statements were over-summarized.
```

#### Custody of Echo `archives-echo-key`

- Scene ID: `archives-echo-key`
- Chapter: `archives`
- Choice count: 2
- Key awarded: Echo

**Scene title**

Text ID: `scene:archives-echo-key:title`

```text
Custody of Echo
```

**Current objective**

Text ID: `scene:archives-echo-key:objective`

```text
Carry the Echo Key and the First Register findings to Orra Vale.
```

**Scene narration**

Text ID: `scene:archives-echo-key:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
The last return fades without concealing a single correction. In the hush that follows, Lithen lifts the Echo Key from its frame and seats it inside a padded travel cradle. Every restorer present marks the transfer. The act feels less like receiving treasure than accepting custody of a question the Archives has carried for centuries.

“Pattern is not obedience to the past,” Lithen reminds you as she locks the cradle. “It reveals what we are continuing, so the living may decide whether it deserves to continue.” The Key now carries the stable interval recovered from the First Register, along with the joined account of how that interval was lost.

A runner arrives while the final seal is cooling. Reports from below describe the same rising-water sequence striking the foundations held by Commander Orra Vale's Mullinen watch. Three lower platforms have flooded. A black rise has reached the pressure stair, and the watch cannot agree whether to hold its post or abandon the trapped crews beneath it. Lithen does not pretend to know what waits in those caverns. She can prove only that the oldest records describe a stable relationship the modern city has broken.

At the foundation door, she takes your hand between both of hers. “The Deep Writ will carry you as far as the Mullinen outposts. Beyond them, you must earn every step from those whose lives keep the route open. Search carefully, young Threadbearer. Go with the goodwill of the Archives—and return with whatever truth the dark permits you to carry.”
```

##### Entry records and rewards

**Entry copy: enter › key Reason**

Text ID: `scene:archives-echo-key:enter:enter:keyReason`

```text
Lithen and the Archive witnesses release the calibration instrument after your record passes the Echo test.
```

**Entry copy: enter › milestone**

Text ID: `scene:archives-echo-key:enter:enter:milestone`

```text
Earned institutional custody of the Echo Key.
```

##### Choices

###### Take the pressure stair toward Orra’s watch. `echo-descend`

- Choice ID: `echo-descend`
- Type: `advance`
- Next on success: `depths-descent`

**Choice label**

Text ID: `choice:echo-descend:label`

```text
Take the pressure stair toward Orra’s watch.
```

**Immediate outcome**

Text ID: `choice:echo-descend:outcome`

```text
The Echo Key repeats a quiet interval against your hip. Several breaths later, the same interval vibrates through the water far below.
```

###### Journal, reward, and consequence copy

**Effect copy: effects › route**

Text ID: `choice:echo-descend:effects:effects:route`

```text
Archive pressure stair
```

###### Send one copy of the joined account to Brunna before descending. `echo-copy`

- Choice ID: `echo-copy`
- Type: `advance`
- Next on success: `depths-descent`

**Choice label**

Text ID: `choice:echo-copy:label`

```text
Send one copy of the joined account to Brunna before descending.
```

**Immediate outcome**

Text ID: `choice:echo-copy:outcome`

```text
A runner carries the sealed copy upward. Whatever happens below, the evidence can no longer vanish with one expedition.
```

###### Journal, reward, and consequence copy

**Effect copy: effects › repair**

Text ID: `choice:echo-copy:effects:effects:repair`

```text
A sealed copy of the investigation was secured aboveground.
```

### Act IV — The Weight of Brassreach

- Chapter ID: `depths`
- Scenes: 6

**Act label**

Text ID: `chapter:depths:act`

```text
Act IV
```

**Chapter title**

Text ID: `chapter:depths:title`

```text
The Weight of Brassreach
```

#### Orra’s Lower Watch `depths-descent`

- Scene ID: `depths-descent`
- Chapter: `depths`
- Choice count: 2

**Scene title**

Text ID: `scene:depths-descent:title`

```text
Orra’s Lower Watch
```

**Current objective**

Text ID: `scene:depths-descent:objective`

```text
Reach Commander Orra Vale and assess the failing pressure stair.
```

**Scene narration**

Text ID: `scene:depths-descent:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
The Archives pressure stair coils downward through cold mist. Each landing is older than the one above, and every hundred steps the polished civic stone gives way to rough cavern walls reinforced with founder brass. The Echo Key repeats a quiet interval against your hip. Several breaths later, the same interval returns through water somewhere far below.

Commander Orra Vale waits at the first Mullinen outpost beside a barricade built from doors, pump braces, and the frame of a retired bell. Her watch bears the marks of a long emergency: soot beneath the eyes, bandaged hands, armor buckled over wet work clothes. They have kept this stair open while three lower platforms disappeared beneath the rising cisterns.

Orra comes straight to the problem. “Eighteen pump workers are trapped on the Ninth Platform. The exit behind them is jammed, the outer bracket is cracked, and the water is striking hard enough to lift the whole deck.” A low impact travels up the stair. Dust sifts from the barricade. “If I send my entire watch, this route may close behind us. If I hold everyone here, the next pulse takes the platform.”

She examines your Deep Writ, then the Echo cradle. “Lithen trusts your record. Brunna trusts your judgment. Neither will lift a single worker out of that water.” Orra turns toward the lower stair. “Give me a plan that saves people and leaves Brassreach a road home. I have no use for a heroic death.”
```

##### Entry records and rewards

**Entry copy: enter › milestone**

Text ID: `scene:depths-descent:enter:enter:milestone`

```text
Reached Orra Vale’s lower watch.
```

##### Choices

###### Ask for the people, loads, and time remaining. `orra-status`

- Choice ID: `orra-status`
- Type: `advance`
- Next on success: `depths-platform`

**Choice label**

Text ID: `choice:orra-status:label`

```text
Ask for the people, loads, and time remaining.
```

**Immediate outcome**

Text ID: `choice:orra-status:outcome`

```text
Orra gives exact numbers: eleven watch members, eighteen trapped pump workers, two sound braces, and perhaps forty minutes before the next major pulse.
```

###### Journal, reward, and consequence copy

###### Show Orra the First Register’s account of Mullinen’s duty. `orra-history`

- Choice ID: `orra-history`
- Type: `advance`
- Next on success: `depths-platform`

**Choice label**

Text ID: `choice:orra-history:label`

```text
Show Orra the First Register’s account of Mullinen’s duty.
```

**Immediate outcome**

Text ID: `choice:orra-history:outcome`

```text
Orra reads the old wording twice: the works shall bear the people; the people shall not be spent to preserve the works. She says nothing, but folds the copy into her coat.
```

###### Journal, reward, and consequence copy

**Effect copy: effects › evidence**

Text ID: `choice:orra-history:effects:effects:evidence`

```text
Mullinen’s original principle put public life before preserving infrastructure.
```

#### The Ninth Platform `depths-platform`

- Scene ID: `depths-platform`
- Chapter: `depths`
- Choice count: 4

**Scene title**

Text ID: `scene:depths-platform:title`

```text
The Ninth Platform
```

**Current objective**

Text ID: `scene:depths-platform:objective`

```text
Rescue the pump crew before the next pressure pulse.
```

**Scene narration**

Text ID: `scene:depths-platform:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
You enter the cistern, and a deafening clash of stone and metal nearly sends you over the rail of the narrow service ledge. Beyond a six-foot gap, the Ninth Platform swings above a black reservoir on three great iron chains and one cracked stone bracket. It is the last pump deck still visible above the water. Eighteen workers crowd its rear railing, soaked to the waist, hammering in vain at a jammed door that should open into the foundation stair behind them.

The cavern is so broad that your lamplight cannot find either shore. Across that impossible width, the entire surface rises at once. No wave travels toward the platform. The black water simply lifts, smooth as polished glass, and raises the deck beneath the workers' feet. For one suspended instant the chains fall slack. Then the water drops. The Ninth Platform crashes onto its failing bracket, and a fresh crack races through the stone.

Orra catches you by the harness before the recoil can throw you from the ledge. “One more strike will break it!” she shouts. She points across the gap: one of her Wardens has reached the rear door with a wrench, but cannot free the latch while the platform swings. A pump forewoman holds the workers back from the sagging edge. The next deep pulse already prickles across your skin.

“Threadbearer—now or never!” Orra calls. “Give us the opening, and I will get them through.” Your ledger cannot stop the water, but the route behind you has given you something no one else on the ledge possesses: a joined record of the pulse, the load, the workers, and the tools at hand. You have seconds to turn that knowledge into action.
```

##### Choices

###### Jump to the Ninth Platform and brace its cracked support while Orra opens the stair. (STR) `platform-brace`

- Choice ID: `platform-brace`
- Type: `check`
- Stat / DC: STR / 14
- Next on success: `depths-lower-watch`
- Next on failure: `depths-lower-watch`

**Choice label**

Text ID: `choice:platform-brace:label`

```text
Jump to the Ninth Platform and brace its cracked support while Orra opens the stair. (STR)
```

**Success result**

Text ID: `choice:platform-brace:success`

```text
You secure your rope, clear the gap, and land hard on the shuddering deck. With two Wardens hauling from the service ledge, you drag a spare brace beneath the cracked bracket and force it upright. The platform bears down through your shoulders as the black water rises again. This time the brace holds. Orra drives her wrench beneath the rear door and tears the swollen latch free. Workers cross into the stair one by one, gripping your harness as they pass. The final forewoman reaches safety just as the bracket splits around the brace. When you climb after her, eighteen relieved voices count one another in the stairwell.
```

**Failure result**

Text ID: `choice:platform-brace:failure`

```text
You leap across and drive the brace toward the failing socket, but the swinging platform knocks it sideways. Stone breaks against your shoulder. You cannot save the deck, so you use the strength you have left to hold its rear rail level while Orra forces the stair door. Your shouted warning sends the workers across before the next pulse tears the bracket away. The empty platform rolls into the reservoir with its pumps still attached. Orra pulls you into the stair as the rope snaps tight. Equipment is lost; every worker answers the final count.
```

**Visible bonus label 1**

Text ID: `choice:platform-brace:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
bracing gear
```

**Visible bonus label 2**

Text ID: `choice:platform-brace:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
power rating
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › repair**

Text ID: `choice:platform-brace:effects:effects:success:repair`

```text
Ninth Platform stabilized long enough for a complete evacuation.
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:platform-brace:effects:effects:failure:consequence`

```text
The Ninth Platform and its pumps were lost after the crew escaped.
```

**Effect copy: effects › failure › hp Reason**

Text ID: `choice:platform-brace:effects:effects:failure:hpReason`

```text
struck by the failing platform brace
```

###### Cross the suspension chain and release the jammed stair latch between swings. (DEX) `platform-rigging`

- Choice ID: `platform-rigging`
- Type: `check`
- Stat / DC: DEX / 14
- Next on success: `depths-lower-watch`
- Next on failure: `depths-lower-watch`

**Choice label**

Text ID: `choice:platform-rigging:label`

```text
Cross the suspension chain and release the jammed stair latch between swings. (DEX)
```

**Success result**

Text ID: `choice:platform-rigging:success`

```text
You clip the Rope Coil to the upper chain and move above the gap while the platform swings beneath you. At the far wall, you drop behind the trapped crew and reach the latch from its exposed side. The Lockpin finds the bent catch by touch. One careful turn frees it a heartbeat before the next pulse lifts the deck. Orra catches the door from the stairwell and hauls it wide. Workers pour through beneath you while the platform crashes once more, and you follow on the last safe swing. The forewoman laughs when solid stone meets her boots, then begins counting her crew with shaking hands.
```

**Failure result**

Text ID: `choice:platform-rigging:failure`

```text
Mineral growth hides the catch until the next swing has already begun. Your tool slips, and the chain tears skin from your palm as you keep yourself above the water. You cannot free the full door, but you release its lower bolt and shout the weakness to Orra. She and three workers wrench a narrow gap open. The crew squeezes through while the platform breaks away behind them. You reach the stair with a bleeding hand and no return route, but the count still reaches eighteen.
```

**Visible bonus label 1**

Text ID: `choice:platform-rigging:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
crossing gear
```

**Visible bonus label 2**

Text ID: `choice:platform-rigging:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
marked swing timing
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › repair**

Text ID: `choice:platform-rigging:effects:effects:success:repair`

```text
Ninth Platform stair latch released for a complete evacuation.
```

**Effect copy: effects › failure › hp Reason**

Text ID: `choice:platform-rigging:effects:effects:failure:hpReason`

```text
cut while crossing the Ninth Platform suspension chain
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:platform-rigging:effects:effects:failure:consequence`

```text
The Ninth Platform access route collapsed after the crew escaped.
```

###### Use the Echo pattern to shift the chains before the next pressure pulse. (INT) `platform-counterload`

- Choice ID: `platform-counterload`
- Type: `check`
- Stat / DC: INT / 14
- Next on success: `depths-lower-watch`
- Next on failure: `depths-lower-watch`

**Choice label**

Text ID: `choice:platform-counterload:label`

```text
Use the Echo pattern to shift the chains before the next pressure pulse. (INT)
```

**Success result**

Text ID: `choice:platform-counterload:success`

```text
You open the Echo cradle and compare its steady return with the timing marks in your ledger. The water pulse is not random; it reaches its highest pressure two breaths after the Key’s third overtone. You call the workers away from the weak corner and order the Wardens to shorten the opposite chain by one link. The reservoir rises. Instead of driving the platform into the bracket, the water supports its weight and holds the rear door level. Orra frees the latch, and the workers cross while the black surface bears them. As the last boot enters the stair, the Echo Key rings once and the entire cistern settles beneath it.
```

**Failure result**

Text ID: `choice:platform-counterload:failure`

```text
Your first calculation is sound near the center of the reservoir, but the return changes beside the wall. The platform tilts toward the water before you can complete the counterload. You recognize the error and abandon the clever plan before it overturns the deck. Following the chain path marked in your ledger, you direct the crew onto the emergency ladder while Orra holds the stair. The Ninth Platform sinks with its pumps, but the workers reach stone. Your failed calculation leaves a crucial discovery: the pressure moves as one body, yet the old architecture can bend its timing.
```

**Visible bonus label 1**

Text ID: `choice:platform-counterload:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
pattern reference
```

**Visible bonus label 2**

Text ID: `choice:platform-counterload:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
marked chain setting
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › repair**

Text ID: `choice:platform-counterload:effects:effects:success:repair`

```text
Ninth Platform chains rebalanced against the pressure pulse.
```

**Effect copy: effects › success › evidence**

Text ID: `choice:platform-counterload:effects:effects:success:evidence`

```text
The rising water responds as one distributed motion across the reservoir.
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:platform-counterload:effects:effects:failure:consequence`

```text
The platform could not be rebalanced; its pumps were abandoned.
```

**Effect copy: effects › failure › evidence**

Text ID: `choice:platform-counterload:effects:effects:failure:evidence`

```text
Pressure timing changes near the reservoir wall.
```

###### Join Watch and pump crews under one timed evacuation order. (CHA) `platform-command`

- Choice ID: `platform-command`
- Type: `check`
- Stat / DC: CHA / 13
- Next on success: `depths-lower-watch`
- Next on failure: `depths-lower-watch`

**Choice label**

Text ID: `choice:platform-command:label`

```text
Join Watch and pump crews under one timed evacuation order. (CHA)
```

**Success result**

Text ID: `choice:platform-command:success`

```text
You call the forewoman by name from the testimony Orra gave you, then assign one concrete task to each group. Pump workers clear the rear rail. Wardens take the chain ladder. Orra attacks the door while you count the pulse aloud from the service ledge. Because every person knows what the others will do, no one rushes the same narrow opening. The final worker crosses as the bracket tears free, and six waiting hands catch her in the stair. For a moment the only sound is breath and the soft counting of survivors. Then Orra grips your shoulder. “That,” she says, “is a public work worth defending.”
```

**Failure result**

Text ID: `choice:platform-command:failure`

```text
Your first order collides with the sergeant’s command, and precious seconds vanish in the confusion. You stop, name Orra as the single rescue lead, and rebuild the plan around her voice. The correction comes late but clearly enough. Every worker escapes before the platform falls, though a Warden is hurt catching the final jumper against the stair wall. The crew carries the injured Warden upward with them. Your ledger will preserve both the cost of divided orders and the choice that finally brought everyone home.
```

**Visible bonus label 1**

Text ID: `choice:platform-command:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
worker trust
```

**Visible bonus label 2**

Text ID: `choice:platform-command:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
Watch support
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › testimony**

Text ID: `choice:platform-command:effects:effects:success:testimony`

```text
Watch and pump workers completed a shared evacuation under one timed plan.
```

**Effect copy: effects › failure › hp Reason**

Text ID: `choice:platform-command:effects:effects:failure:hpReason`

```text
injured while catching a worker at the stair
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:platform-command:effects:effects:failure:consequence`

```text
A Warden was injured during the Ninth Platform evacuation.
```

#### What the Works Are For `depths-lower-watch`

- Scene ID: `depths-lower-watch`
- Chapter: `depths`
- Choice count: 2

**Scene title**

Text ID: `scene:depths-lower-watch:title`

```text
What the Works Are For
```

**Current objective**

Text ID: `scene:depths-lower-watch:objective`

```text
Decide how Orra’s watch will hold the route.
```

**Scene narration**

Text ID: `scene:depths-lower-watch:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
Relief does not arrive as cheering. It arrives as names answered during the count, blankets passed from hand to hand, and one pump worker kneeling to press her forehead against dry stone. At the barricade, the rescued crew argues that Orra must seal the lower stair before another platform fails. Her oldest sergeant, still wearing the brass braid of the traditional Mullinen watch, strikes his fist against the bell-frame brace. “Mullinens do not surrender a public work.”

Orra looks from the exhausted workers to the injury list in your ledger. Then she opens the copied First Register and finds the passage you showed her above: THE WORKS SHALL BEAR THE PEOPLE. THE PEOPLE SHALL NOT BE SPENT TO PRESERVE THE WORKS. She reads it aloud. The old sergeant's certainty does not vanish, but it no longer fills the room.

“We have spent years proving our devotion by how long we can stand in water,” Orra says. “Mullinen built these works so other people would not have to.” She turns to you while her watch gathers around the ledger. “Record what happened at the Ninth Platform. If the deck was lost, call it lost. If lives were saved, do not let any office name the rescue a failure because a pump went under.” A deeper impact passes through the barricade. “Then show me what we can still defend without feeding this stair more people.”
```

##### Branch arrivals

**Arrival from platform-brace:success**

Text ID: `scene:depths-lower-watch:arrival:platform-brace:success`

Context: This sentence bridges the previous choice result into this scene.

```text
The rescued crew carries the spare brace back to Orra’s barricade, where it becomes proof that preparation saved lives.
```

**Arrival from platform-brace:failure**

Text ID: `scene:depths-lower-watch:arrival:platform-brace:failure`

Context: This sentence bridges the previous choice result into this scene.

```text
The workers return without their pumps, carrying one injured Warden and a clear account of why the platform had to be abandoned.
```

**Arrival from platform-rigging:success**

Text ID: `scene:depths-lower-watch:arrival:platform-rigging:success`

Context: This sentence bridges the previous choice result into this scene.

```text
The pump forewoman returns with the released stair latch in one hand and every member of her crew walking behind her.
```

**Arrival from platform-rigging:failure**

Text ID: `scene:depths-lower-watch:arrival:platform-rigging:failure`

Context: This sentence bridges the previous choice result into this scene.

```text
The rescued crew reaches the barricade along a route that no longer exists, while a medic binds the cuts left by the suspension chain.
```

**Arrival from platform-counterload:success**

Text ID: `scene:depths-lower-watch:arrival:platform-counterload:success`

Context: This sentence bridges the previous choice result into this scene.

```text
The rebalanced chains leave the Ninth Platform standing behind you, though no one mistakes the temporary repair for safety.
```

**Arrival from platform-counterload:failure**

Text ID: `scene:depths-lower-watch:arrival:platform-counterload:failure`

Context: This sentence bridges the previous choice result into this scene.

```text
The empty chain ladder swings above the lost pumps as the rescued crew reaches Orra’s barricade.
```

**Arrival from platform-command:success**

Text ID: `scene:depths-lower-watch:arrival:platform-command:success`

Context: This sentence bridges the previous choice result into this scene.

```text
Watch members and pump workers arrive together, still repeating the timing that carried them across.
```

**Arrival from platform-command:failure**

Text ID: `scene:depths-lower-watch:arrival:platform-command:failure`

Context: This sentence bridges the previous choice result into this scene.

```text
The rescued crew reaches the barricade while a medic binds the Warden injured by the conflicting orders.
```

##### Choices

###### Record the lost platform as a successful rescue, not a failed defense. (CHA) `orra-evacuate`

- Choice ID: `orra-evacuate`
- Type: `check`
- Stat / DC: CHA / 12
- Next on success: `depths-foundation`
- Next on failure: `depths-foundation`

**Choice label**

Text ID: `choice:orra-evacuate:label`

```text
Record the lost platform as a successful rescue, not a failed defense. (CHA)
```

**Success result**

Text ID: `choice:orra-evacuate:success`

```text
You enter the names of all eighteen workers before the machinery that was lost, then place Mullinen’s original principle beside the rescue account. Orra reads both entries to her watch. The old sergeant lowers his fist from the bell-frame brace. By the next shift, exhausted Wardens are rotating back from the water while pump workers use their practical knowledge to design the new line. Duty becomes a shared repair instead of a contest to see who can suffer longest.
```

**Failure result**

Text ID: `choice:orra-evacuate:failure`

```text
The sergeant rejects your wording and insists that abandoning a public platform must remain a defeat. You do not erase the loss. You enter the drowned pumps, the broken access route, every rescued worker, and every recorded injury on the same leaf. Orra studies that complete cost, then orders rest rotations despite the sergeant’s objection. The watch has not agreed on the meaning of the rescue, but it will stop spending people as though endurance alone could hold the stair.
```

**Visible bonus label 1**

Text ID: `choice:orra-evacuate:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
First Register principle
```

**Visible bonus label 2**

Text ID: `choice:orra-evacuate:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
humane record
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › testimony**

Text ID: `choice:orra-evacuate:effects:effects:success:testimony`

```text
Orra restored Mullinen’s principle that the works exist to carry people.
```

**Effect copy: effects › failure › repair**

Text ID: `choice:orra-evacuate:effects:effects:failure:repair`

```text
Orra established rest rotations for the lower watch.
```

###### Design a smaller defensible line around the surviving load paths. (INT) `orra-reinforce`

- Choice ID: `orra-reinforce`
- Type: `check`
- Stat / DC: INT / 13
- Next on success: `depths-foundation`
- Next on failure: `depths-foundation`

**Choice label**

Text ID: `choice:orra-reinforce:label`

```text
Design a smaller defensible line around the surviving load paths. (INT)
```

**Success result**

Text ID: `choice:orra-reinforce:success`

```text
You compare the fresh cracks with the Echo return, then mark only the stone that still carries weight cleanly. The new line protects the evacuation stair, the medic station, and the one pump channel required to keep pressure off the upper districts. Everything beyond it is tagged for withdrawal rather than defended from pride. Orra walks the boundary herself and nods. “That is a line we can maintain,” she says. “Not one we merely hope to die behind.”
```

**Failure result**

Text ID: `choice:orra-reinforce:failure`

```text
A polished brace rings true beneath your hammer but shifts when the next pressure pulse reaches its hidden foot. You stop the consolidation and move the watch one gallery farther back. The withdrawal preserves every remaining route needed for evacuation, but a lower pump gallery falls beyond the defensible line. Orra records the loss without softening it and assigns a sentry to watch the water rise where the old post stood.
```

**Visible bonus label 1**

Text ID: `choice:orra-reinforce:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
load marks
```

**Visible bonus label 2**

Text ID: `choice:orra-reinforce:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
stable reference
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › repair**

Text ID: `choice:orra-reinforce:effects:effects:success:repair`

```text
Lower watch consolidated around tested load paths.
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:orra-reinforce:effects:effects:failure:consequence`

```text
A pump gallery was abandoned during the Watch withdrawal.
```

#### The Stone Test `depths-foundation`

- Scene ID: `depths-foundation`
- Chapter: `depths`
- Choice count: 3

**Scene title**

Text ID: `scene:depths-foundation:title`

```text
The Stone Test
```

**Current objective**

Text ID: `scene:depths-foundation:objective`

```text
Prove which foundation can carry the descent and the city above it.
```

**Scene narration**

Text ID: `scene:depths-foundation:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
Beyond the new watch line, the stair widens into a foundation chamber built around three founder piers. Somewhere impossibly high above, an entire inhabited terrace rests upon these columns. Modern braces crowd their bases from a dozen conflicting angles, each stamped with the crest of the office that funded it. During every pressure pulse the costly additions shake, grind, and throw dust—yet the three older piers remain almost silent.

A pump worker named Hessa taps two polished braces with the handle of her wrench. Both ring hollow. “Those dance for the officials whenever the floor moves,” she says, “but neither carries the floor.” She crawls behind a plain worker patch no map records and shows you a compressed seam bearing a quarter of the terrace's load.

Inside the center pier rests the Stone Key, a dense black instrument crossed by one pale line. It does not belong to Orra as a private possession. The Mullinen watch holds it in institutional custody because no citywide adjustment should begin without an honest reading of what the city asks its foundations—and its workers—to bear. Orra cannot release it while ornamental supports obscure the true load. The crew must remove, transfer, or clearly mark every false brace before the Key can show a safe descent.
```

##### Choices

###### Remove the false braces one at a time and expose the original load path. (STR) `stone-strip`

- Choice ID: `stone-strip`
- Type: `check`
- Stat / DC: STR / 14
- Next on success: `depths-stone-key`
- Next on failure: `depths-stone-key`

**Choice label**

Text ID: `choice:stone-strip:label`

```text
Remove the false braces one at a time and expose the original load path. (STR)
```

**Success result**

Text ID: `choice:stone-strip:success`

```text
You fit the Mender’s Clamp around the first brace and take its force a fraction at a time. Each polished support that comes free makes the true foundation easier to read. Hessa calls the changing load from behind her worker patch while Orra’s Wardens carry the useless iron clear. When the final false brace leaves the center line, the founder piers accept the terrace without a shudder, and the Stone instrument settles into its socket as though the room has taken a full breath.
```

**Failure result**

Text ID: `choice:stone-strip:failure`

```text
The third brace looks hollow but tightens under the first turn of your clamp. Rust has hidden a real share of the terrace load. You stop before the metal can tear free, return its force carefully, and mark it in red rather than pretending the original plan can be restored tonight. The center pier still reveals a narrow safe path through the chamber. The terrace remains standing, but part of its burden must stay entangled with the modern braces until a larger crew can transfer it.
```

**Visible bonus label 1**

Text ID: `choice:stone-strip:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
controlled release
```

**Visible bonus label 2**

Text ID: `choice:stone-strip:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
power rating
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › repair**

Text ID: `choice:stone-strip:effects:effects:success:repair`

```text
Founder piers returned to a clear, shared load path.
```

**Effect copy: effects › failure › repair**

Text ID: `choice:stone-strip:effects:effects:failure:repair`

```text
A narrow safe path was marked through the foundation chamber.
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:stone-strip:effects:effects:failure:consequence`

```text
Conflicting braces still obscure part of the terrace load.
```

###### Use settlement marks and the Echo return to calculate the true load. (INT) `stone-calculate`

- Choice ID: `stone-calculate`
- Type: `check`
- Stat / DC: INT / 14
- Next on success: `depths-stone-key`
- Next on failure: `depths-stone-key`

**Choice label**

Text ID: `choice:stone-calculate:label`

```text
Use settlement marks and the Echo return to calculate the true load. (INT)
```

**Success result**

Text ID: `choice:stone-calculate:success`

```text
You copy every settlement mark, then use the Echo Key to compare how each brace answers beneath a controlled shift. The figures expose the room’s deception. Two expensive modern supports carry almost nothing, while Hessa’s unrecorded patch bears a quarter of the inhabited terrace. Under her direction, the crew transfers that force into the center founder pier. You enter her name and method beside the calculation before the Stone instrument accepts the new load.
```

**Failure result**

Text ID: `choice:stone-calculate:failure`

```text
The black water rises during your second reading and changes the pressure beneath the eastern pier. One number refuses to repeat. You can still prove that the center founder pier offers the safest path, but not how the full terrace will settle after a complete transfer. Orra accepts a provisional route and leaves two crews on the gauges. The descent can continue; the larger calculation remains open instead of becoming a dangerous certainty.
```

**Visible bonus label 1**

Text ID: `choice:stone-calculate:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
pattern return
```

**Visible bonus label 2**

Text ID: `choice:stone-calculate:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
founder table
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › evidence**

Text ID: `choice:stone-calculate:effects:effects:success:evidence`

```text
An undocumented worker repair carried a critical share of the terrace load.
```

**Effect copy: effects › success › repair**

Text ID: `choice:stone-calculate:effects:effects:success:repair`

```text
Terrace load transferred into the center founder pier.
```

**Effect copy: effects › failure › evidence**

Text ID: `choice:stone-calculate:effects:effects:failure:evidence`

```text
The center founder pier is safe, but the full terrace load remains provisional.
```

###### Have Orra, workers, and Wardens agree to the load record before moving it. (CHA) `stone-witness`

- Choice ID: `stone-witness`
- Type: `check`
- Stat / DC: CHA / 13
- Next on success: `depths-stone-key`
- Next on failure: `depths-stone-key`

**Choice label**

Text ID: `choice:stone-witness:label`

```text
Have Orra, workers, and Wardens agree to the load record before moving it. (CHA)
```

**Success result**

Text ID: `choice:stone-witness:success`

```text
You gather the people who read the structure from different positions: Hessa beneath the patch, Orra at the evacuation line, and the Wardens responsible for keeping the chamber open. Each names what the plan asks them to move and what they can maintain afterward. Their signatures do not awaken the Stone Key by themselves. The coordinated transfer does. As every group completes the work it accepted, the foundation settles into one stable pattern and the pale seam across the instrument brightens.
```

**Failure result**

Text ID: `choice:stone-witness:failure`

```text
Orra’s oldest sergeant refuses to sign a plan that removes a ceremonial Mullinen brace, even after the load test shows it carries nothing. The argument stalls the crew while dust continues to fall. Orra finally orders the brace removed under her own authority and enters her responsibility beside the disputed line. The transfer succeeds, but the Watch leaves the chamber with a narrow command decision rather than a shared understanding of what the repair means.
```

**Visible bonus label 1**

Text ID: `choice:stone-witness:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
Orra’s trust
```

**Visible bonus label 2**

Text ID: `choice:stone-witness:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
worker support
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › testimony**

Text ID: `choice:stone-witness:effects:effects:success:testimony`

```text
Wardens and workers signed a shared foundation maintenance record.
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:stone-witness:effects:effects:failure:consequence`

```text
The foundation plan proceeds without full Watch agreement.
```

#### Custody of Stone `depths-stone-key`

- Scene ID: `depths-stone-key`
- Chapter: `depths`
- Choice count: 2
- Key awarded: Stone

**Scene title**

Text ID: `scene:depths-stone-key:title`

```text
Custody of Stone
```

**Current objective**

Text ID: `scene:depths-stone-key:objective`

```text
Carry the Stone Key toward the Brassworks route.
```

**Scene narration**

Text ID: `scene:depths-stone-key:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
When the final load settles into a path the crew can name and maintain, the center pier releases a sound too low to hear and strong enough to feel through your knees. Orra places both hands around the Stone Key and lifts it from its socket. The pale seam brightens. A line of light crosses the floor, passes through Hessa's unrecorded patch, and climbs the founder piers toward the terrace above.

“Stone does not care who paid for a brace or whose crest is stamped upon it,” Orra says. “It shows what bears the weight.” Hessa laughs once, without humor, when the light ignores the two polished additions. Orra enters the transfer beneath Mullinen authority, and the pump crew signs beside her watch.

She seats the Stone Key in a shock-bound cradle next to Echo. For the first time, the instruments answer one another: Echo repeats the stable pattern, while Stone reveals exactly where that pattern is supported. Orra assigns two rested Wardens and three pump workers to maintain the repaired route behind you. No one calls the chamber restored. It is simply honest enough to carry the next descent.
```

##### Entry records and rewards

**Entry copy: enter › key Reason**

Text ID: `scene:depths-stone-key:enter:enter:keyReason`

```text
Orra and the lower watch release the load instrument after the foundation is made legible.
```

**Entry copy: enter › milestone**

Text ID: `scene:depths-stone-key:enter:enter:milestone`

```text
Earned institutional custody of the Stone Key.
```

##### Choices

###### Take the old supply channel toward the Brassworks. `stone-route`

- Choice ID: `stone-route`
- Type: `advance`
- Next on success: `depths-cistern-crossing`

**Choice label**

Text ID: `choice:stone-route:label`

```text
Take the old supply channel toward the Brassworks.
```

**Immediate outcome**

Text ID: `choice:stone-route:outcome`

```text
The channel is steep, wet, and still marked with delivery signs from the city’s first foundries.
```

###### Journal, reward, and consequence copy

**Effect copy: effects › route**

Text ID: `choice:stone-route:effects:effects:route`

```text
old supply channel
```

###### Ask Orra to send the foundation record to Brunna and Lithen. `stone-send-word`

- Choice ID: `stone-send-word`
- Type: `advance`
- Next on success: `depths-cistern-crossing`

**Choice label**

Text ID: `choice:stone-send-word:label`

```text
Ask Orra to send the foundation record to Brunna and Lithen.
```

**Immediate outcome**

Text ID: `choice:stone-send-word:outcome`

```text
Orra dispatches a rested runner with copies for the Watch and Archives. The joined repair now exists above and below.
```

###### Journal, reward, and consequence copy

**Effect copy: effects › repair**

Text ID: `choice:stone-send-word:effects:effects:repair`

```text
Foundation record distributed to Watch and Archives.
```

#### The Breathing Water `depths-cistern-crossing`

- Scene ID: `depths-cistern-crossing`
- Chapter: `depths`
- Choice count: 3

**Scene title**

Text ID: `scene:depths-cistern-crossing:title`

```text
The Breathing Water
```

**Current objective**

Text ID: `scene:depths-cistern-crossing:objective`

```text
Cross the cistern without treating the Unfathomer as a speaking foe.
```

**Scene narration**

Text ID: `scene:depths-cistern-crossing:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
The old supply channel opens above a cistern so broad that your lamplight fails before reaching the far wall. A narrow bridge crosses into that darkness, its brass plates hanging over water black enough to return your reflection without revealing its own depth.

Before anyone steps onto the bridge, the entire surface rises at once. It lifts smooth and level as obsidian, then settles without a wave traveling from any shore. The sudden change leaves your body waiting for a motion the eye never saw approach. A prickling sensation, like the gathering of static before a lightning strike, moves across your skin.

The Echo Key sounds its gentle interval inside the travel cradle. Beneath the bridge, the current slows. Far to your left, a damaged pump scrapes against its housing, and a shudder appears across the whole cistern at the same instant—under your feet, beyond the lamps, and in the water behind you. No voice enters your mind. No shape rises to threaten the party. Yet the separate pools, channels, and pressure seams respond with the speed of one body receiving a single sensation. Lithen's theory no longer feels safely contained within the Archives. The bridge is the only route to the Brassworks, and each scraping blow makes the black surface climb a little higher.
```

##### Choices

###### Carry the stable Echo interval across the bridge plates. (INT) `cistern-chord`

- Choice ID: `cistern-chord`
- Type: `check`
- Stat / DC: INT / 14
- Next on success: `brassworks-threshold`
- Next on failure: `brassworks-threshold`

**Choice label**

Text ID: `choice:cistern-chord:label`

```text
Carry the stable Echo interval across the bridge plates. (INT)
```

**Success result**

Text ID: `choice:cistern-chord:success`

```text
You strike only the interval preserved from the First Register, then wait for the nearest bridge plate to answer before stepping forward. Stone confirms each plate can bear the party’s weight. Echo keeps the note from drifting as it travels. Beneath you, the black water releases the bridge by degrees, settling long enough for every person to cross. It has not obeyed a command; a calmer relationship has reached it, and the pressure around that relationship has eased.
```

**Failure result**

Text ID: `choice:cistern-chord:failure`

```text
The fourth bridge plate is green with corrosion and returns the interval a fraction too high. The entire black surface rises against the span. You stop the sequence before the bad note can travel farther and lead the party onto the exposed wall chain instead. Water strikes your legs while you reach it, but everyone crosses. The failed plate remains marked in your ledger as the exact point where the stable route broke.
```

**Visible bonus label 1**

Text ID: `choice:cistern-chord:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
stable interval
```

**Visible bonus label 2**

Text ID: `choice:cistern-chord:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
load reading
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › evidence**

Text ID: `choice:cistern-chord:effects:effects:success:evidence`

```text
The distributed water eased around a stable founder interval without receiving a spoken command.
```

**Effect copy: effects › success › repair**

Text ID: `choice:cistern-chord:effects:effects:success:repair`

```text
A coherent crossing interval was established across the cistern bridge.
```

**Effect copy: effects › failure › hp Reason**

Text ID: `choice:cistern-chord:effects:effects:failure:hpReason`

```text
battered by water while reaching the exposed wall chain
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:cistern-chord:effects:effects:failure:consequence`

```text
The cistern crossing required the exposed wall chain.
```

###### Lead the party hand-over-hand along the wall chain. (DEX) `cistern-chain`

- Choice ID: `cistern-chain`
- Type: `check`
- Stat / DC: DEX / 13
- Next on success: `brassworks-threshold`
- Next on failure: `brassworks-threshold`

**Choice label**

Text ID: `choice:cistern-chain:label`

```text
Lead the party hand-over-hand along the wall chain. (DEX)
```

**Success result**

Text ID: `choice:cistern-chain:success`

```text
You fasten a backup rope above the chain and test every anchor before placing the party’s weight upon it. Between each pressure rise, you call one person forward. Boots scrape wet stone; the damaged pump shudders behind you; no one rushes. The final Warden reaches the far ledge before the black surface climbs again, and your quiet crossing leaves the unstable pump untouched for a crew better equipped to repair it.
```

**Failure result**

Text ID: `choice:cistern-chain:failure`

```text
The final anchor tears from rotten mortar as the last two Wardens cross. Your backup line keeps them above the water, but the wrenching chain opens your palm and strips a field case from one Warden’s shoulder. You reach the far ledge together while the lost gear vanishes without a splash. The party is safe. The chain route hangs useless behind you, leaving the Brassworks as the only possible road onward.
```

**Visible bonus label 1**

Text ID: `choice:cistern-chain:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
wet-footing boots
```

**Visible bonus label 2**

Text ID: `choice:cistern-chain:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
backup line
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › route**

Text ID: `choice:cistern-chain:effects:effects:success:route`

```text
quiet wall-chain crossing
```

**Effect copy: effects › failure › hp Reason**

Text ID: `choice:cistern-chain:effects:effects:failure:hpReason`

```text
cut by the wall chain when its last anchor failed
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:cistern-chain:effects:effects:failure:consequence`

```text
The wall-chain route collapsed after the crossing.
```

###### Quiet the damaged pump before crossing. (STR) `cistern-pump`

- Choice ID: `cistern-pump`
- Type: `check`
- Stat / DC: STR / 14
- Next on success: `brassworks-threshold`
- Next on failure: `brassworks-threshold`

**Choice label**

Text ID: `choice:cistern-pump:label`

```text
Quiet the damaged pump before crossing. (STR)
```

**Success result**

Text ID: `choice:cistern-pump:success`

```text
You descend to the maintenance ledge and wait until the broken arm strikes its housing. On the recoil, you drive the Mender’s Clamp through both plates and tighten until the mechanism can no longer gather force. The next expected blow never comes. Across the entire cistern, the shudder fades at the same pace, and the black water falls away from the bridge. One small mechanical injury had been reaching the whole body below; removing it creates relief far beyond the pump itself.
```

**Failure result**

Text ID: `choice:cistern-pump:failure`

```text
The broken arm bucks before the clamp can seat and throws you against the rail. You rise before the next stroke, wedge your full weight behind the housing, and force the emergency catch closed. The pump stops, but its final impact sends a high surge through the chamber. Water breaks over the ledge and batters the bridge before settling. The party crosses after the surge, carrying you between them until you can stand unaided.
```

**Visible bonus label 1**

Text ID: `choice:cistern-pump:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
housing clamp
```

**Visible bonus label 2**

Text ID: `choice:cistern-pump:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
power rating
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › repair**

Text ID: `choice:cistern-pump:effects:effects:success:repair`

```text
Damaged cistern pump secured against its housing.
```

**Effect copy: effects › success › evidence**

Text ID: `choice:cistern-pump:effects:effects:success:evidence`

```text
Removing one discordant impact calmed water across the full cistern.
```

**Effect copy: effects › failure › hp Reason**

Text ID: `choice:cistern-pump:effects:effects:failure:hpReason`

```text
thrown against the rail by the damaged pump arm
```

**Effect copy: effects › failure › repair**

Text ID: `choice:cistern-pump:effects:effects:failure:repair`

```text
Damaged pump disabled after a final pressure surge.
```

### Act V — The Broken Song

- Chapter ID: `brassworks`
- Scenes: 7

**Act label**

Text ID: `chapter:brassworks:act`

```text
Act V
```

**Chapter title**

Text ID: `chapter:brassworks:title`

```text
The Broken Song
```

#### The Silent Brassworks `brassworks-threshold`

- Scene ID: `brassworks-threshold`
- Chapter: `brassworks`
- Choice count: 2

**Scene title**

Text ID: `scene:brassworks-threshold:title`

```text
The Silent Brassworks
```

**Current objective**

Text ID: `scene:brassworks-threshold:objective`

```text
Enter the abandoned tuning floor and find the Brass Choir team.
```

**Scene narration**

Text ID: `scene:brassworks-threshold:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
The old Brassworks should announce itself long before you reach it. The supply walls were built to carry the ring of test notes, the clatter of furnace chains, and the deep bells that once divided every shift. Instead, heavy felt screens hang across the threshold, and the great floor beyond them stands silent. A warning slate explains why: the works have become so badly misaligned that a hammer strike on one wall can open a valve on another.

Sella Flintwake waits beside the screens with a small Brass Choir team, three furnace workers, and two pump keepers. Her cropped hair is dusted with filings, and a leather roll of salvaged tuning forks hangs across her chest. She trained with the Choir before failed budgets scattered its crews; now she reclaims usable parts from the lower works and remembers where each one failed.

“The famous Deep-Writ Threadbearer arrives carrying half the city's foundation,” she says, eyeing the two Key cradles. The humor leaves her voice when a faint beat passes through the floor. A valve wheel turns by itself six paces away. “No one is singing bolts out of walls today. We measure first, then we breathe, then we move one part at a time.”

Behind her, the Brass Key rests within a locked tonal frame. The Choir cannot release it until the tuning floor can carry one coherent adjustment without breaking another machine. To reach that point, the specialists around Sella must first agree that they are repairing one connected work.
```

##### Entry records and rewards

**Entry copy: enter › milestone**

Text ID: `scene:brassworks-threshold:enter:enter:milestone`

```text
Reached the Brass Choir team in the silent Brassworks.
```

##### Choices

###### Ask Sella what happened during the failed repairs. `works-hear-sella`

- Choice ID: `works-hear-sella`
- Type: `advance`
- Next on success: `brassworks-sella`

**Choice label**

Text ID: `choice:works-hear-sella:label`

```text
Ask Sella what happened during the failed repairs.
```

**Immediate outcome**

Text ID: `choice:works-hear-sella:outcome`

```text
Sella shows you three contractor marks. Each crew tuned one machine correctly in isolation. When the machines ran together, their mismatched intervals struck the floor hard enough to crack it.
```

###### Journal, reward, and consequence copy

**Effect copy: effects › evidence**

Text ID: `choice:works-hear-sella:effects:effects:evidence`

```text
Isolated repairs became destructive when their tones were combined.
```

###### Ask the furnace workers what changed before the floor closed. `works-hear-workers`

- Choice ID: `works-hear-workers`
- Type: `advance`
- Next on success: `brassworks-sella`

**Choice label**

Text ID: `choice:works-hear-workers:label`

```text
Ask the furnace workers what changed before the floor closed.
```

**Immediate outcome**

Text ID: `choice:works-hear-workers:outcome`

```text
They identify a cheap replacement bell-metal used after the Choir budget was cut. Its tone drifts when heated, pulling every linked mechanism out of agreement.
```

###### Journal, reward, and consequence copy

**Effect copy: effects › testimony**

Text ID: `choice:works-hear-workers:effects:effects:testimony`

```text
Furnace workers traced the tuning drift to cheap replacement bell-metal.
```

#### Sella’s Salvage Table `brassworks-sella`

- Scene ID: `brassworks-sella`
- Chapter: `brassworks`
- Choice count: 2

**Scene title**

Text ID: `scene:brassworks-sella:title`

```text
Sella’s Salvage Table
```

**Current objective**

Text ID: `scene:brassworks-sella:objective`

```text
Prepare for the tuning floor and learn what its discarded parts reveal.
```

**Scene narration**

Text ID: `scene:brassworks-sella:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
Sella's salvage table stands beneath the silent shift bell. Every tool and broken part carries a tag naming where she found it, who last handled it, and what defect it may conceal. Nothing is called worthless until someone who understands its material has examined it.

She sets three pieces of metal before you. The first is founder alloy worn thin by centuries of honest use. The second is a careful worker patch, inelegant but sound. The third is a polished modern housing. Sella strikes it against the table; the casing rings beautifully while brittle brass rattles inside. “That is the floor's history in three scraps,” she says. “Good work used until it grew tired. Quiet work that kept everyone alive. Expensive work made to look finished.”

She opens her stock for trade, then waits until the other workers have gone before unwrapping a two-pronged resonance fork. Scorch marks darken its handle. “Found this beside the great anchor after the last tuning crew ran,” she says. The prongs still hold the final stable interval recorded before the floor broke into interference. She offers it hilt-first. “It will not repair anything for you. It will tell the truth while you do.”
```

##### Entry records and rewards

**Entry copy: enter › item › reason**

Text ID: `scene:brassworks-sella:enter:enter:item:reason`

```text
Sella lends you the fork recovered from the failed anchor so its last stable setting can guide the repair.
```

##### Choices

###### Trade with Sella before entering the tuning floor. `sella-shop`

- Choice ID: `sella-shop`
- Type: `merchant`
- Merchant: `sella`

**Choice label**

Text ID: `choice:sella-shop:label`

```text
Trade with Sella before entering the tuning floor.
```

###### Take the resonance fork to the repair crew. `sella-anchor`

- Choice ID: `sella-anchor`
- Type: `advance`
- Next on success: `brassworks-choir`

**Choice label**

Text ID: `choice:sella-anchor:label`

```text
Take the resonance fork to the repair crew.
```

**Immediate outcome**

Text ID: `choice:sella-anchor:outcome`

```text
Sella wraps the fork in felt. “It gives an honest reading,” she says. “Keep your hand steady when you hear how bad the floor has become.”
```

###### Journal, reward, and consequence copy

#### A Chord Built by Many Hands `brassworks-choir`

- Scene ID: `brassworks-choir`
- Chapter: `brassworks`
- Choice count: 2

**Scene title**

Text ID: `scene:brassworks-choir:title`

```text
A Chord Built by Many Hands
```

**Current objective**

Text ID: `scene:brassworks-choir:objective`

```text
Choose a repair plan shared by Choir tuners and Worksfolk.
```

**Scene narration**

Text ID: `scene:brassworks-choir:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
Sella lays a pump worker's charcoal sketch beside the Choir's map of measured intervals. The two documents scarcely resemble one another, but together they divide the Brassworks floor into four linked systems: furnace draft along the western wall, water pressure beneath the central grates, lifting gear above the gantries, and the great tuning anchor in the far-right quarter.

The Choir members hear relationships among machined intervals as clearly as spoken words. Furnace workers know how the alloy changes color and pitch near the scorching hearth. Pump crews know exactly how long a pressure adjustment takes to cross the floor. Salvagers can identify a hidden defect from the shape of a discarded bolt. As a Threadbearer, you can place those separate truths into one sequence without allowing the prestige of one trade to erase another.

“Any one of us can tune our own machine,” Sella says, glancing around the table. “That is how this floor became dangerous—everyone proving they were right in isolation.” She moves the four drawings until their edges meet. “We need to remember how to learn from one another, and how to put our work together well enough to make something beautiful. None of us can do this alone.”

The crews lean over the joined map. Somewhere behind the felt screens, the broken floor answers their first test tone with a hard, destructive beat.
```

##### Choices

###### Build one repair sequence from Choir measurements and worker timings. (INT) `choir-plan`

- Choice ID: `choir-plan`
- Type: `check`
- Stat / DC: INT / 13
- Next on success: `brassworks-anchor`
- Next on failure: `brassworks-anchor`

**Choice label**

Text ID: `choice:choir-plan:label`

```text
Build one repair sequence from Choir measurements and worker timings. (INT)
```

**Success result**

Text ID: `choice:choir-plan:success`

```text
You translate the Choir’s intervals into the minutes each crew needs to move heat, pressure, and weight across the floor. The furnace must settle before the pumps rise; the pumps must answer before the lifting gears engage; only then may the anchor sound. Every specialist tests the section that belongs to their craft. When the four pieces finally agree, Sella draws one heavy line around the joined plan. “First credible full-floor sequence in two generations,” she says, and hands the chalk to the workers so they can sign it.
```

**Failure result**

Text ID: `choice:choir-plan:failure`

```text
The furnace notes predict that the alloy will settle before the pump keepers say pressure can reach the far channel. Neither side can prove its timing under present conditions. You preserve both measurements and widen the pause between systems until either one can be wrong without endangering the next crew. The slower plan sacrifices reach and time, but it gives every specialist a safe point at which to stop the sequence. Sella accepts it without pretending the conflict has been solved.
```

**Visible bonus label 1**

Text ID: `choice:choir-plan:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
worker timing
```

**Visible bonus label 2**

Text ID: `choice:choir-plan:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
anchor reference
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › repair**

Text ID: `choice:choir-plan:effects:effects:success:repair`

```text
Choir and Worksfolk agreed on a coherent full-floor tuning sequence.
```

**Effect copy: effects › failure › repair**

Text ID: `choice:choir-plan:effects:effects:failure:repair`

```text
A slower Brassworks tuning sequence was adopted with wider safety margins.
```

###### Use the Deep Writ to require each specialist’s objection in the record. (CHA) `choir-authority`

- Choice ID: `choir-authority`
- Type: `check`
- Stat / DC: CHA / 13
- Next on success: `brassworks-anchor`
- Next on failure: `brassworks-anchor`

**Choice label**

Text ID: `choice:choir-authority:label`

```text
Use the Deep Writ to require each specialist’s objection in the record. (CHA)
```

**Success result**

Text ID: `choice:choir-authority:success`

```text
You place the Deep Writ seal on the joined map and require every objection to be heard and answered before the next voice can overrule it. A furnace worker names a drifting alloy. A pump keeper warns that pressure crosses the floor more slowly than the Choir’s table allows. A salvager shows where a polished housing conceals an older crack. The three concerns appear minor in isolation; together they predict the same destructive beat. Sella revises the sequence before anyone enters the dangerous floor.
```

**Failure result**

Text ID: `choice:choir-authority:failure`

```text
The formal hearing gives old resentment a stage. Choir members defend measurements the workers distrust, and the workers repeat grievances too broad to settle tonight. You keep every objection in the record instead of ending the dispute by authority. One pump keeper’s precise warning survives the argument: the central channel answers two beats later than the plan assumes. That correction prevents a reckless start, though the crews enter the floor beside one another without yet trusting one another.
```

**Visible bonus label 1**

Text ID: `choice:choir-authority:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
public authority
```

**Visible bonus label 2**

Text ID: `choice:choir-authority:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
fair hearing
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › testimony**

Text ID: `choice:choir-authority:effects:effects:success:testimony`

```text
Choir and Worksfolk objections were answered in one public repair record.
```

**Effect copy: effects › failure › evidence**

Text ID: `choice:choir-authority:effects:effects:failure:evidence`

```text
A recorded worker objection exposed an unsafe tuning interval.
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:choir-authority:effects:effects:failure:consequence`

```text
Choir and Worksfolk cooperation remains strained.
```

#### The First Harmonic Anchor `brassworks-anchor`

- Scene ID: `brassworks-anchor`
- Chapter: `brassworks`
- Choice count: 3

**Scene title**

Text ID: `scene:brassworks-anchor:title`

```text
The First Harmonic Anchor
```

**Current objective**

Text ID: `scene:brassworks-anchor:objective`

```text
Restore the first anchor without waking every damaged machine at once.
```

**Scene narration**

Text ID: `scene:brassworks-anchor:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
The felt screens lift, revealing a floor of furnaces, overhead gears, pressure channels, and narrow gantries suspended above them all. At the far side stands the great tuning anchor, a brass column rooted in resonant stone. Three repair crews have tightened its outer rings to three different “correct” positions. Each mark makes sense beside the machine it was meant to serve. Together they form a chord that strikes the floor like a hammer.

The crews begin the slow sequence designed at Sella's table. Furnace shutters open by degrees. Heat rolls across the chamber, and the cheap replacement alloy begins to drift as it warms. A harsh beat builds between the anchor rings. With every pulse, dark water rises through the inspection channels; when the workers restore a stable interval, it falls again. The water does not follow the people moving on the gantries. It follows the sound.

Sella stands at the central control with one hand raised, refusing to rush the next change. The Echo Key preserves the recovered pattern. Stone reveals where the anchor's force enters the floor. The Resonance Fork trembles in your grip between them. The first complete adjustment must pass through all three truths without waking every damaged machine at once.
```

##### Choices

###### Retune the rings through the shared slow sequence. (INT) `anchor-retune`

- Choice ID: `anchor-retune`
- Type: `check`
- Stat / DC: INT / 15
- Next on success: `brassworks-interference`
- Next on failure: `brassworks-interference`

**Choice label**

Text ID: `choice:anchor-retune:label`

```text
Retune the rings through the shared slow sequence. (INT)
```

**Success result**

Text ID: `choice:anchor-retune:success`

```text
Echo preserves the founder pattern while Stone reveals where each adjustment enters the floor. Between them, the Resonance Fork shows the narrow interval the warm alloy can actually hold. You turn the rings one measured notch at a time and wait for each crew’s confirmation. The harsh beat weakens, separates, and disappears. Amber lights kindle across the floor as the anchor settles into one coherent chord, and black inspection water drops below the grates.
```

**Failure result**

Text ID: `choice:anchor-retune:failure`

```text
The first two rings settle, but heat pulls the cheap third ring beyond the interval your plan can safely correct. You hear the drift before it becomes a blow. Sella repeats your shutdown call, furnace workers close the draft, and pump keepers bleed pressure from the floor. The first two rings remain locked in a stable partial chord. The anchor cannot reach full power until its alloy is replaced, but the crews leave the gantries without adding another crack to the works.
```

**Visible bonus label 1**

Text ID: `choice:anchor-retune:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
anchor reference
```

**Visible bonus label 2**

Text ID: `choice:anchor-retune:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
pattern
```

**Visible bonus label 3**

Text ID: `choice:anchor-retune:bonus:3:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
load
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › repair**

Text ID: `choice:anchor-retune:effects:effects:success:repair`

```text
First Brassworks harmonic anchor restored to a coherent chord.
```

**Effect copy: effects › success › evidence**

Text ID: `choice:anchor-retune:effects:effects:success:evidence`

```text
The inspection water receded when the anchor reached stable harmony.
```

**Effect copy: effects › failure › repair**

Text ID: `choice:anchor-retune:effects:effects:failure:repair`

```text
First harmonic anchor stabilized at a partial chord.
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:anchor-retune:effects:effects:failure:consequence`

```text
The furnace remains shut down until the third ring is replaced.
```

###### Replace the drifting bell-metal ring during a cold interval. (DEX) `anchor-replace`

- Choice ID: `anchor-replace`
- Type: `check`
- Stat / DC: DEX / 14
- Next on success: `brassworks-interference`
- Next on failure: `brassworks-interference`

**Choice label**

Text ID: `choice:anchor-replace:label`

```text
Replace the drifting bell-metal ring during a cold interval. (DEX)
```

**Success result**

Text ID: `choice:anchor-replace:success`

```text
Furnace workers close the draft and call the falling temperature while pump keepers hold pressure away from the housing. At Sella’s signal, you lift the warped ring free and slide her reclaimed founder alloy into the narrow opening. The final pin seats just before the housing begins to expand again. When the furnace returns, the older metal warms without losing its note, and the anchor carries the shared tuning without further drift.
```

**Failure result**

Text ID: `choice:anchor-replace:failure`

```text
The cold interval closes while the final pin is still half a turn from its seat. Heat reaches your gloves, and Sella orders you out before the housing can trap your hands. The crew clamps the ring at its safest partial position and limits the furnace draft. The anchor can operate below full power, but its usable range remains narrow and your burned palm records the cost of missing the interval by seconds.
```

**Visible bonus label 1**

Text ID: `choice:anchor-replace:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
prepared work gear
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › repair**

Text ID: `choice:anchor-replace:effects:effects:success:repair`

```text
Inferior bell-metal ring replaced with stable reclaimed alloy.
```

**Effect copy: effects › success › item › reason**

Text ID: `choice:anchor-replace:effects:effects:success:item:reason`

```text
The furnace crew gives you heat-capped gloves after the successful ring change.
```

**Effect copy: effects › failure › repair**

Text ID: `choice:anchor-replace:effects:effects:failure:repair`

```text
Drifting anchor ring clamped below full power.
```

**Effect copy: effects › failure › hp Reason**

Text ID: `choice:anchor-replace:effects:effects:failure:hpReason`

```text
burned while withdrawing from the warming anchor
```

###### Guide the specialists through the sequence from the safe gantry. (CHA) `anchor-call`

- Choice ID: `anchor-call`
- Type: `check`
- Stat / DC: CHA / 14
- Next on success: `brassworks-interference`
- Next on failure: `brassworks-interference`

**Choice label**

Text ID: `choice:anchor-call:label`

```text
Guide the specialists through the sequence from the safe gantry. (CHA)
```

**Success result**

Text ID: `choice:anchor-call:success`

```text
From the central gantry, you call no adjustment until the worker responsible for the previous system confirms it is stable. Furnace, pump, gear, and anchor crews answer in their own language, and you repeat each response in terms the next crew understands. No order outruns the material. As the final ring turns, every worker hears exactly where their labor enters the completed chord, and the anchor settles beneath a sequence owned by all of them.
```

**Failure result**

Text ID: `choice:anchor-call:failure`

```text
The curved walls repeat one of your commands and carry it late to the lifting crew. A gear engages before the pump channel has settled. Sella hears the doubled order, cuts the anchor tone, and prevents the error from crossing the floor. You restart with hand signals and hold the mechanism at a partial setting. No one is hurt, but the lost time and limited range remain in the public repair account.
```

**Visible bonus label 1**

Text ID: `choice:anchor-call:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
Choir trust
```

**Visible bonus label 2**

Text ID: `choice:anchor-call:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
crew trust
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › repair**

Text ID: `choice:anchor-call:effects:effects:success:repair`

```text
First anchor tuned through a witnessed multi-crew sequence.
```

**Effect copy: effects › failure › repair**

Text ID: `choice:anchor-call:effects:effects:failure:repair`

```text
First anchor held at a partial setting after a delayed command.
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:anchor-call:effects:effects:failure:consequence`

```text
The floor lost time correcting an echoed instruction.
```

#### The Returning Beat `brassworks-interference`

- Scene ID: `brassworks-interference`
- Chapter: `brassworks`
- Choice count: 3

**Scene title**

Text ID: `scene:brassworks-interference:title`

```text
The Returning Beat
```

**Current objective**

Text ID: `scene:brassworks-interference:objective`

```text
Find the remaining source of destructive interference.
```

**Scene narration**

Text ID: `scene:brassworks-interference:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
When the anchor reaches its first stable setting, amber work lights kindle across the Brassworks one row at a time. The crews have barely begun to celebrate when a second, slower beat emerges beneath the chord. It was present all along, hidden by the louder interference.

Your First Register rubbing places an old lift engine below the floor at the same interval. Sella leads the party down a maintenance ladder into a cramped housing where silt and mineral growth have fused around the flywheel. Warmth moves inside the crust. Then an armored stoneback crawler opens one dark eye from a nest built among the gear teeth.

The animal is not attacking the works. It has taken shelter in the only warm, dry chamber left near the rising water. Each time the repaired chord reaches the engine, the startled crawler shifts its heavy plates and knocks the frozen flywheel against its stops. The impact returns through the tuning floor as destructive interference. Sella lowers her pick. “We repair the machine and crush the tenant, we have learned nothing,” she says. “Find us a way to separate them.”
```

##### Choices

###### Use the salt-hound whistle and warmth to draw the crawler from the housing. (CHA) `crawler-lure`

- Choice ID: `crawler-lure`
- Type: `check`
- Stat / DC: CHA / 13
- Next on success: `brassworks-crawler`
- Next on failure: `brassworks-crawler`

**Choice label**

Text ID: `choice:crawler-lure:label`

```text
Use the salt-hound whistle and warmth to draw the crawler from the housing. (CHA)
```

**Success result**

Text ID: `choice:crawler-lure:success`

```text
You heat a shallow oil pan at the mouth of an empty slag bay, then sound the handler’s lowest call. The stoneback crawler lifts its plated head from the flywheel. Warmth and the even whistle offer a calmer signal than the repaired anchor beating through its nest. It uncurls one heavy segment at a time and follows you into the bay. When Sella closes the gate, the animal settles beside the pan instead of striking the bars. A naturally shed plate remains in the empty housing, thick enough to turn a blade.
```

**Failure result**

Text ID: `choice:crawler-lure:failure`

```text
The crawler follows the warm pan out of the flywheel, but the repaired chord startles it before it reaches the slag bay. It plants itself across the safest exit and swings one plated limb toward anyone who approaches. You keep the whistle sounding and hold its attention while the crew withdraws through the narrow maintenance ladder. The mechanism is clear, but the longer route will be needed until handlers can move the frightened animal without harm.
```

**Visible bonus label 1**

Text ID: `choice:crawler-lure:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
animal call
```

**Visible bonus label 2**

Text ID: `choice:crawler-lure:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
heated lure
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › repair**

Text ID: `choice:crawler-lure:effects:effects:success:repair`

```text
Stoneback crawler relocated from the lift housing without harm.
```

**Effect copy: effects › success › item › reason**

Text ID: `choice:crawler-lure:effects:effects:success:item:reason`

```text
Sella recovers a naturally shed plate from the abandoned nest and fits it as armor.
```

**Effect copy: effects › failure › hp Reason**

Text ID: `choice:crawler-lure:effects:effects:failure:hpReason`

```text
struck while holding the crawler’s attention
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:crawler-lure:effects:effects:failure:consequence`

```text
The crawler was moved from the mechanism but still blocks the slag-bay route.
```

###### Lock the flywheel between the crawler’s movements. (DEX) `crawler-wheel`

- Choice ID: `crawler-wheel`
- Type: `check`
- Stat / DC: DEX / 14
- Next on success: `brassworks-crawler`
- Next on failure: `brassworks-crawler`

**Choice label**

Text ID: `choice:crawler-wheel:label`

```text
Lock the flywheel between the crawler’s movements. (DEX)
```

**Success result**

Text ID: `choice:crawler-wheel:success`

```text
You watch the crawler’s plates tighten before each frightened strike and count the pause that follows. On the quiet beat, you reach past its nest and drive the Lockpin through the flywheel catch. The next blow meets a still housing. Without the moving gear to answer it, the animal backs away into the slag bay and curls against the warm wall. Above, the destructive second beat vanishes from the tuning floor.
```

**Failure result**

Text ID: `choice:crawler-wheel:failure`

```text
Your Lockpin meets the catch at the wrong angle and bends beneath the crawler’s next strike. You pull your hand clear, wait for the animal to recoil, and drop a heavier maintenance bar through the outer gear. The engine stops, but the sudden load cracks three teeth from its rim. The crawler retreats from the still housing unharmed. The lift can no longer rejoin the floor without a major rebuild.
```

**Visible bonus label 1**

Text ID: `choice:crawler-wheel:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
flywheel catch
```

**Visible bonus label 2**

Text ID: `choice:crawler-wheel:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
movement pattern
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › repair**

Text ID: `choice:crawler-wheel:effects:effects:success:repair`

```text
Abandoned lift engine isolated from the tuning network.
```

**Effect copy: effects › failure › repair**

Text ID: `choice:crawler-wheel:effects:effects:failure:repair`

```text
Lift engine stopped with damage to its outer gear.
```

**Effect copy: effects › failure › item › reason**

Text ID: `choice:crawler-wheel:effects:effects:failure:item:reason`

```text
You keep the bent pin as evidence of the force inside the fused flywheel.
```

###### Break the mineral crust and free both the animal and the flywheel. (STR) `crawler-free`

- Choice ID: `crawler-free`
- Type: `check`
- Stat / DC: STR / 15
- Next on success: `brassworks-crawler`
- Next on failure: `brassworks-crawler`

**Choice label**

Text ID: `choice:crawler-free:label`

```text
Break the mineral crust and free both the animal and the flywheel. (STR)
```

**Success result**

Text ID: `choice:crawler-free:success`

```text
You read the seams in the mineral crust, then drive the Warden Pick where each controlled break will fall away from the nest. Sella catches the loosened slabs while the furnace workers shield the crawler from the noise. The final crust splits cleanly. The animal drops into the open slag bay and scuttles toward its warmth, while the old flywheel turns for the first time in years. Workers oil its exposed axle and bring its note slowly into the floor’s shared interval.
```

**Failure result**

Text ID: `choice:crawler-free:failure`

```text
A hidden fault runs beneath the seam you strike. The mineral shell breaks all at once, sending a slab toward the trapped animal. You throw yourself across its nest and take the impact on your shoulder while the crawler escapes beneath you into the slag bay. The fall bends the lift engine’s axle beyond safe use. The creature survives and the interference ends, but the machine must be removed rather than restored.
```

**Visible bonus label 1**

Text ID: `choice:crawler-free:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
power rating
```

**Visible bonus label 2**

Text ID: `choice:crawler-free:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
controlled breaking
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › repair**

Text ID: `choice:crawler-free:effects:effects:success:repair`

```text
Lift flywheel freed and made available for retuning.
```

**Effect copy: effects › failure › hp Reason**

Text ID: `choice:crawler-free:effects:effects:failure:hpReason`

```text
struck while shielding the crawler from falling stone
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:crawler-free:effects:effects:failure:consequence`

```text
The abandoned lift engine was damaged while the crawler escaped safely.
```

#### The Whole Floor Holds `brassworks-crawler`

- Scene ID: `brassworks-crawler`
- Chapter: `brassworks`
- Choice count: 2

**Scene title**

Text ID: `scene:brassworks-crawler:title`

```text
The Whole Floor Holds
```

**Current objective**

Text ID: `scene:brassworks-crawler:objective`

```text
Complete the full-floor tuning and demonstrate stable Tone.
```

**Scene narration**

Text ID: `scene:brassworks-crawler:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
Back on the tuning floor, every crew takes its place. Sella raises one hand. The furnace workers open the draft and wait until the replacement alloy reaches the color they named at the table. Pump keepers bring water pressure beneath the grates and call the instant it reaches the far channel. The lifting crew engages one gear assembly at a time. Only then does the Choir sound the repaired anchor.

For several breathless seconds, the separate systems pull against one another. Sella watches the workers rather than the gauges. Each specialist makes the small correction only they could recognize, then signals the next. The floor settles into a chord no single craft could have built alone.

Water falls in the inspection channels. The amber lights brighten without flickering. A reply enters from beyond the Brassworks: first the relief gate beneath the Tangles, then the deep Archive Well, then Orra's repaired foundation. The responses arrive in sequence along the route you traveled, each carrying the marks of an actual repair and the people who made it. The sites do not merely sound alike. For the first time in generations, the old network carries one stable change through all of them.

The crews stand in astonished silence until Hessa's distant pump signal returns once more. Sella lowers her hand, smiling openly now. “There,” she says. “That is what joined work sounds like.”
```

##### Branch arrivals

**Arrival from crawler-lure:success**

Text ID: `scene:brassworks-crawler:arrival:crawler-lure:success`

Context: This sentence bridges the previous choice result into this scene.

```text
Sella closes the slag-bay gate after the stoneback crawler settles beside the heated pan.
```

**Arrival from crawler-lure:failure**

Text ID: `scene:brassworks-crawler:arrival:crawler-lure:failure`

Context: This sentence bridges the previous choice result into this scene.

```text
The crew gives the blocked slag bay a wide berth and returns to the tuning controls by the longer route.
```

**Arrival from crawler-wheel:success**

Text ID: `scene:brassworks-crawler:arrival:crawler-wheel:success`

Context: This sentence bridges the previous choice result into this scene.

```text
With the lift engine isolated, the second beat disappears from the floor.
```

**Arrival from crawler-wheel:failure**

Text ID: `scene:brassworks-crawler:arrival:crawler-wheel:failure`

Context: This sentence bridges the previous choice result into this scene.

```text
The cracked outer gear is unsafe to run, but the stopped engine can no longer disrupt the tuning sequence.
```

**Arrival from crawler-free:success**

Text ID: `scene:brassworks-crawler:arrival:crawler-free:success`

Context: This sentence bridges the previous choice result into this scene.

```text
Workers turn the freed flywheel by hand and match it to the repaired anchor.
```

**Arrival from crawler-free:failure**

Text ID: `scene:brassworks-crawler:arrival:crawler-free:failure`

Context: This sentence bridges the previous choice result into this scene.

```text
The crew marks the damaged lift engine for removal and closes it out of the active network.
```

##### Choices

###### Hold the final interval on the resonance fork. (INT) `whole-floor-hold`

- Choice ID: `whole-floor-hold`
- Type: `check`
- Stat / DC: INT / 14
- Next on success: `brassworks-brass-key`
- Next on failure: `brassworks-brass-key`

**Choice label**

Text ID: `choice:whole-floor-hold:label`

```text
Hold the final interval on the resonance fork. (INT)
```

**Success result**

Text ID: `choice:whole-floor-hold:success`

```text
You raise the Resonance Fork into the completed chord and keep its prongs within the narrow band every crew established. The interval travels through furnace, water, lifting gear, and anchor without splitting. A reply returns from the Tangles relief gate, another from the Record Well, and a third from Orra’s foundation. Sella listens through all three cycles before she lowers her hand. “The Brassworks can carry a city-scale adjustment,” she says, “because the whole route has learned how to answer.”
```

**Failure result**

Text ID: `choice:whole-floor-hold:failure`

```text
The Fork begins to waver as furnace heat reaches the reclaimed ring. Before the drift can divide the floor, pump keepers lower pressure, the lifting crew eases one gear, and Choir tuners narrow the interval together. The final chord cannot hold the broad range you planned, but it stabilizes inside a smaller band every crew can maintain. The Brassworks will carry less power tonight; what it carries will not tear the route apart.
```

**Visible bonus label 1**

Text ID: `choice:whole-floor-hold:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
tone reference
```

**Visible bonus label 2**

Text ID: `choice:whole-floor-hold:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
restored anchor
```

**Visible bonus label 3**

Text ID: `choice:whole-floor-hold:bonus:3:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
Choir support
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › repair**

Text ID: `choice:whole-floor-hold:effects:effects:success:repair`

```text
Brassworks full-floor harmony restored across all four systems.
```

**Effect copy: effects › success › evidence**

Text ID: `choice:whole-floor-hold:effects:effects:success:evidence`

```text
Repaired routes answered one another as a connected harmonic network.
```

**Effect copy: effects › failure › repair**

Text ID: `choice:whole-floor-hold:effects:effects:failure:repair`

```text
Brassworks stabilized within a narrow safe tonal range.
```

###### Have every crew confirm the change before the Key is released. (CHA) `whole-floor-witness`

- Choice ID: `whole-floor-witness`
- Type: `check`
- Stat / DC: CHA / 13
- Next on success: `brassworks-brass-key`
- Next on failure: `brassworks-brass-key`

**Choice label**

Text ID: `choice:whole-floor-witness:label`

```text
Have every crew confirm the change before the Key is released. (CHA)
```

**Success result**

Text ID: `choice:whole-floor-witness:success`

```text
You hold the final chord while each crew names what it changed, what answered, and what remains unsafe. Furnace workers record the stable heat. Pump keepers confirm pressure at the far grate. The lifting crew marks the isolated engine, and Sella enters the anchor’s narrow limits beside the Choir reading. Their testimony becomes a technical map anyone can repeat, not a performance only the Choir can claim to understand. The tonal frame opens after the last worker signs.
```

**Failure result**

Text ID: `choice:whole-floor-witness:failure`

```text
After hours on the floor, several workers can remember the repair but not the exact order of every adjustment. You refuse to polish their exhaustion into false precision. Each crew confirms the system it knows, and all agree that the four parts now operate in one stable relation. The incomplete details remain marked for the morning shift. The tonal frame accepts the shared result, though the record will need a second witnessed pass.
```

**Visible bonus label 1**

Text ID: `choice:whole-floor-witness:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
crew trust
```

**Visible bonus label 2**

Text ID: `choice:whole-floor-witness:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
shared credit
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › testimony**

Text ID: `choice:whole-floor-witness:effects:effects:success:testimony`

```text
Every Brassworks crew witnessed the full-floor tuning and recorded unfinished work.
```

**Effect copy: effects › failure › testimony**

Text ID: `choice:whole-floor-witness:effects:effects:failure:testimony`

```text
Brassworks crews confirmed the stable tuning despite incomplete testimony.
```

#### Custody of Brass `brassworks-brass-key`

- Scene ID: `brassworks-brass-key`
- Chapter: `brassworks`
- Choice count: 2
- Key awarded: Brass

**Scene title**

Text ID: `scene:brassworks-brass-key:title`

```text
Custody of Brass
```

**Current objective**

Text ID: `scene:brassworks-brass-key:objective`

```text
Carry the third calibration instrument to the Gate route.
```

**Scene narration**

Text ID: `scene:brassworks-brass-key:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
The tonal frame opens only after the full-floor chord has held through three complete cycles. Inside, the Brass Key resembles a tuning fork folded around a warm amber core. Sella and the senior Choir tuner release it before the assembled Works crews, naming every group whose knowledge made the tuning possible. Tone, they record, is not the power to command separate systems. It is the stable relationship that allows them to act together without destroying one another.

When the Key enters its travel cradle, Stone and Echo answer. The joined interval passes upward along the route. Messages return with it. Brunna has opened emergency supply lines between offices that had not shared stores in decades. Lithen is carrying the restored Register pattern down from the Archives. Orra's rested watch still holds the honest foundation, and Hessa's crew has kept the Ninth stair open. Water gauges from the Tangles to the lower galleries have slowed for the first time in years.

No one mistakes the reprieve for a cure. Countless branches remain discordant, and the dark water continues to press against the city's weakest places. Yet the route behind you has made a genuine change in the right direction—one broad enough to be felt below. Sella locks the cradle to your harness. “Whatever waits at the end of these old works,” she says, “we can finally reach it with something better than noise.”
```

##### Entry records and rewards

**Entry copy: enter › key Reason**

Text ID: `scene:brassworks-brass-key:enter:enter:keyReason`

```text
The Brass Choir and Works crews release the tonal instrument after the full-floor sequence holds.
```

**Entry copy: enter › milestone**

Text ID: `scene:brassworks-brass-key:enter:enter:milestone`

```text
Earned institutional custody of the Brass Key.
```

##### Choices

###### Join the converging teams at the Gate route. `brass-gate`

- Choice ID: `brass-gate`
- Type: `advance`
- Next on success: `gate-approach`

**Choice label**

Text ID: `choice:brass-gate:label`

```text
Join the converging teams at the Gate route.
```

**Immediate outcome**

Text ID: `choice:brass-gate:outcome`

```text
Stone, Brass, and Echo rest in separate cradles. None is sufficient alone. Together they make the old works readable.
```

###### Journal, reward, and consequence copy

**Effect copy: effects › route**

Text ID: `choice:brass-gate:effects:effects:route`

```text
Brassworks Gate conduit
```

###### Send the stable interval upward before entering the Gate route. `brass-message`

- Choice ID: `brass-message`
- Type: `advance`
- Next on success: `gate-approach`

**Choice label**

Text ID: `choice:brass-message:label`

```text
Send the stable interval upward before entering the Gate route.
```

**Immediate outcome**

Text ID: `choice:brass-message:outcome`

```text
Upper pumps adopt the safe interval. It cannot cure the city, but it prevents several fresh failures while the Gate team descends.
```

###### Journal, reward, and consequence copy

**Effect copy: effects › repair**

Text ID: `choice:brass-message:effects:effects:repair`

```text
Upper pump crews received the Brassworks safe interval.
```

### Act VI — The Gate of Measures

- Chapter ID: `gate`
- Scenes: 5

**Act label**

Text ID: `chapter:gate:act`

```text
Act VI
```

**Chapter title**

Text ID: `chapter:gate:title`

```text
The Gate of Measures
```

#### The Gate of Measures `gate-approach`

- Scene ID: `gate-approach`
- Chapter: `gate`
- Choice count: 1

**Scene title**

Text ID: `scene:gate-approach:title`

```text
The Gate of Measures
```

**Current objective**

Text ID: `scene:gate-approach:objective`

```text
Seat the Three Keys and read the founders’ instructions.
```

**Scene narration**

Text ID: `scene:gate-approach:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
The Brassworks conduit descends into an atrium vast enough to contain the Public Bell tower. At its center stands the Gate of Measures: a hundred-foot circle of dark stone veined with brass, half submerged beneath moss and slowly rising water. It resembles no ordinary door. Concentric galleries surround a sealed center, and hundreds of channels radiate outward into the foundations of Brassreach.

Lithen waits at the lower inscription with her robes gathered above the water. She cleans one line with a restorer's brush and translates it aloud. The Founders built this chamber to test what the city carried, whether its working systems could act in stable relation, and what patterns its people chose to repeat. The Gate also preserves practical instructions for those who might inherit the machinery after its purpose had been forgotten—a constitutional lesson written into stone, load, and sound.

“This inscription predates every account that supports my theory,” Lithen says. “The Gate was not built to imprison the Unfathomer. The Founders left us a means to understand their whole work, and by fortune or consequence, that same work now offers a road into the deepest network.”

Orra arrives by the stabilized foundation stair with rested Wardens and pump workers. Sella follows through the Brassworks line with the Choir. None has crossed the dangers you faced by magic; each comes along the route their own labor helped preserve. Stone, Brass, and Echo settle into separate cradles around the circle. Your Thread Ledger fits a fourth, unkeyed stand at the center. The Keys will make the old instructions readable. The ledger will show what the living city has actually done.
```

##### Entry records and rewards

**Entry copy: enter › milestone**

Text ID: `scene:gate-approach:enter:enter:milestone`

```text
Reached the Gate of Measures with all three institutional Keys.
```

##### Choices

###### Seat Stone, Brass, and Echo in their separate instruments. `gate-seat`

- Choice ID: `gate-seat`
- Type: `advance`
- Next on success: `gate-weight`

**Choice label**

Text ID: `choice:gate-seat:label`

```text
Seat Stone, Brass, and Echo in their separate instruments.
```

**Immediate outcome**

Text ID: `choice:gate-seat:outcome`

```text
The Gate does not swing. Concentric galleries awaken, each revealing a different layer of the city below.
```

###### Journal, reward, and consequence copy

#### The Reading of Weight `gate-weight`

- Scene ID: `gate-weight`
- Chapter: `gate`
- Choice count: 2

**Scene title**

Text ID: `scene:gate-weight:title`

```text
The Reading of Weight
```

**Current objective**

Text ID: `scene:gate-weight:objective`

```text
Use Stone to mark what the city can safely carry.
```

**Scene narration**

Text ID: `scene:gate-weight:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
When Stone enters its instrument, the Gate's dark veins brighten from the floor upward. Lines of pale light spread through the atrium and outward beneath Brassreach, carrying the present load of every connected foundation. The city appears around you as a towering web of weight.

Several High House terraces glow with redundant supports: ornamental piers, private lifts, and broad galleries carrying little more than their own splendor. Far below them, the public pump districts burn white at the edge of collapse. Worker repairs appear as thin, stubborn lines holding burdens their builders were never given authority to name. The Stone instrument does not accuse. It reveals where material, labor, safety, and danger have been placed.

Orra lays Hessa's foundation record beside the Gate reading. “If we move too much, we bring the upper city down upon the people we mean to save,” she says. “If we move nothing, the lower works fail first and take the water system with them.” Around the atrium, Wardens wait beside transfer controls while Brunna's messengers stand ready to carry evacuation orders. Stone has made the unequal load visible. The living must decide which burden to relieve before the deeper calibration begins.
```

##### Choices

###### Mark the vulnerable public works as the first loads to relieve. (INT) `gate-weight-public`

- Choice ID: `gate-weight-public`
- Type: `check`
- Stat / DC: INT / 12
- Next on success: `gate-tone`
- Next on failure: `gate-tone`

**Choice label**

Text ID: `choice:gate-weight-public:label`

```text
Mark the vulnerable public works as the first loads to relieve. (INT)
```

**Success result**

Text ID: `choice:gate-weight-public:success`

```text
You follow the Stone reading from the white-hot pump districts to the redundant foundations beneath High House terraces. Orra’s crews test every transfer before opening its control. Load moves away from the exhausted public piers and settles into upper supports built with room to spare. Pumps that had groaned without pause fall into a steadier rhythm. The Gate makes no declaration of justice; it shows that the city possesses strength it had chosen not to share.
```

**Failure result**

Text ID: `choice:gate-weight-public:failure`

```text
The first upper support glows broad and bright, but Hessa’s comparison reveals that most of its stone is ceremonial cladding around a narrow core. You halt the transfer before weight can crush it. A smaller route through two tested galleries still relieves the weakest pump district, though several lower foundations remain near their limit. The failed assumption stays visible in the Gate reading so no one can mistake the partial repair for an equal settlement.
```

**Visible bonus label 1**

Text ID: `choice:gate-weight-public:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
Weight instrument
```

**Visible bonus label 2**

Text ID: `choice:gate-weight-public:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
foundation repair
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › repair**

Text ID: `choice:gate-weight-public:effects:effects:success:repair`

```text
Gate load route prioritizes vulnerable public works.
```

**Effect copy: effects › success › evidence**

Text ID: `choice:gate-weight-public:effects:effects:success:evidence`

```text
Stone exposed unequal structural investment across city districts.
```

**Effect copy: effects › failure › repair**

Text ID: `choice:gate-weight-public:effects:effects:failure:repair`

```text
Gate load route established at a smaller safe transfer.
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:gate-weight-public:effects:effects:failure:consequence`

```text
Several lower districts remain near their load limit.
```

###### Use the reading to clear people from loads that cannot be repaired tonight. (CHA) `gate-weight-evac`

- Choice ID: `gate-weight-evac`
- Type: `check`
- Stat / DC: CHA / 12
- Next on success: `gate-tone`
- Next on failure: `gate-tone`

**Choice label**

Text ID: `choice:gate-weight-evac:label`

```text
Use the reading to clear people from loads that cannot be repaired tonight. (CHA)
```

**Success result**

Text ID: `choice:gate-weight-evac:success`

```text
You mark each structure the Gate shows beyond safe repair and give Brunna’s messengers exact routes already tested by the expedition. The Watch does not announce a nameless disaster. It names the failing supports, the streets to use, and the halls prepared to receive each household. Replies return through the Gate as the most vulnerable blocks empty in order. The Counter records people moved before stone, proof that the city has begun to choose whom its works are meant to carry.
```

**Failure result**

Text ID: `choice:gate-weight-evac:failure`

```text
Two districts resist an evacuation ordered from an unfamiliar chamber below the city. Their stewards demand a second survey while the Stone lines continue to brighten beneath them. Brunna sends Wardens with the named evidence and secures the most vulnerable block before calibration begins. The remaining households stay under warning beside open routes. Their delay enters the ledger as a danger still carried, not consent to whatever the old foundations may do.
```

**Visible bonus label 1**

Text ID: `choice:gate-weight-evac:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
Watch network
```

**Visible bonus label 2**

Text ID: `choice:gate-weight-evac:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
public trust
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › repair**

Text ID: `choice:gate-weight-evac:effects:effects:success:repair`

```text
Gate reading guided targeted evacuations from failing loads.
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:gate-weight-evac:effects:effects:failure:consequence`

```text
Only the most vulnerable district completed evacuation before calibration.
```

#### The Reading of Tone `gate-tone`

- Scene ID: `gate-tone`
- Chapter: `gate`
- Choice count: 2

**Scene title**

Text ID: `scene:gate-tone:title`

```text
The Reading of Tone
```

**Current objective**

Text ID: `scene:gate-tone:objective`

```text
Use Brass to carry a coherent adjustment through the old works.
```

**Scene narration**

Text ID: `scene:gate-tone:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
Brass enters its frame, and sound becomes visible. Amber bands pass through the Gate wherever connected systems can carry one another's motion. Black interference gathers around mismatched repairs, severed responsibilities, and mechanisms tuned correctly only in isolation.

Your expedition appears as a narrow but continuous amber path. It begins at the relief gate beneath the Tangles, passes through the Record Well and Orra's foundation, and widens across the restored Brassworks. Voices answer from each anchor: residents at the bucket line, restorers beside the Well, pump workers under Hessa's piers, and Sella's crews on the tuning floor. Beyond them, centuries of incompatible work remain dark.

Sella studies the black branches while the Choir holds the stable interval. “We could make a magnificent noise,” she says, “and tear half the city apart with it.” She points to the modest line the crews can verify. “Send only what our repaired route can carry. Let every anchor answer before we extend it. If the deep water can feel intention, give it work already done—not a promise shouted louder than our reach.”
```

##### Choices

###### Send the modest stable interval through every repaired anchor. (INT) `gate-tone-coherent`

- Choice ID: `gate-tone-coherent`
- Type: `check`
- Stat / DC: INT / 13
- Next on success: `gate-pattern`
- Next on failure: `gate-pattern`

**Choice label**

Text ID: `choice:gate-tone-coherent:label`

```text
Send the modest stable interval through every repaired anchor. (INT)
```

**Success result**

Text ID: `choice:gate-tone-coherent:success`

```text
You refuse the broad power the Gate could release and set Brass to the smaller interval proven at the Brassworks. The signal reaches Orra’s foundation, the Record Well, the Tangles relief gate, and every tested anchor without splitting. Amber bands widen around those sites. Water gauges stop climbing along the route, then fall by the width of a finger. Far below, the pressure surrounding the stable path eases as the Unfathomer encounters the first sustained improvement it has felt in generations.
```

**Failure result**

Text ID: `choice:gate-tone-coherent:failure`

```text
The interval reaches the repaired foundation, then divides where an unrepaired branch crosses the route. Black interference races toward the Tangles. You close that path before the unstable signal can damage the relief gate and confine Brass to the anchors you can verify. Those sites remain steady and the water around them pauses, but the unrepaired branches stay dark. The city gains a smaller island of relief instead of the continuous path you intended.
```

**Visible bonus label 1**

Text ID: `choice:gate-tone-coherent:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
Tone instrument
```

**Visible bonus label 2**

Text ID: `choice:gate-tone-coherent:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
full-floor harmony
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › repair**

Text ID: `choice:gate-tone-coherent:effects:effects:success:repair`

```text
A coherent Gate interval reached every repaired anchor.
```

**Effect copy: effects › success › evidence**

Text ID: `choice:gate-tone-coherent:effects:effects:success:evidence`

```text
The Unfathomer’s outward pressure eased along the connected repair path.
```

**Effect copy: effects › failure › repair**

Text ID: `choice:gate-tone-coherent:effects:effects:failure:repair`

```text
Gate interval confined to verified anchors.
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:gate-tone-coherent:effects:effects:failure:consequence`

```text
Unrepaired branches remain outside the stable tonal path.
```

###### Let each crew answer from its anchor before extending the interval. (CHA) `gate-tone-crews`

- Choice ID: `gate-tone-crews`
- Type: `check`
- Stat / DC: CHA / 13
- Next on success: `gate-pattern`
- Next on failure: `gate-pattern`

**Choice label**

Text ID: `choice:gate-tone-crews:label`

```text
Let each crew answer from its anchor before extending the interval. (CHA)
```

**Success result**

Text ID: `choice:gate-tone-crews:success`

```text
You send the first note only to Orra’s foundation and wait. Hessa answers through the pump line. The Record Well returns Lithen’s measured interval; Tangles residents ring the reopened relief gate; Sella’s crews carry the response across the Brassworks floor. Only after each anchor confirms the last do you extend the sequence. The resulting harmony contains more than matching sound. It carries a chain of people sustaining the same work, and the deep water settles around evidence of their shared intention.
```

**Failure result**

Text ID: `choice:gate-tone-crews:failure`

```text
The Archive anchor answers, then the next remote crew remains silent. No one knows whether its signal failed or its people had to abandon the post. You leave that branch untouched and continue through the connections that answer clearly. The rest of the sequence holds without sacrificing an unseen crew to complete a beautiful chord. One dark gap remains in the Gate, named and waiting for rescue after the present crisis.
```

**Visible bonus label 1**

Text ID: `choice:gate-tone-crews:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
Choir support
```

**Visible bonus label 2**

Text ID: `choice:gate-tone-crews:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
Works support
```

**Visible bonus label 3**

Text ID: `choice:gate-tone-crews:bonus:3:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
Orra’s watch
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › testimony**

Text ID: `choice:gate-tone-crews:effects:effects:success:testimony`

```text
Archive, Watch, Works, and Choir crews answered through one Gate sequence.
```

**Effect copy: effects › failure › consequence**

Text ID: `choice:gate-tone-crews:effects:effects:failure:consequence`

```text
One remote repair branch could not join the Gate sequence.
```

#### The Reading of Pattern `gate-pattern`

- Scene ID: `gate-pattern`
- Chapter: `gate`
- Choice count: 2

**Scene title**

Text ID: `scene:gate-pattern:title`

```text
The Reading of Pattern
```

**Current objective**

Text ID: `scene:gate-pattern:objective`

```text
Use Echo to show how Brassreach reached the present crisis.
```

**Scene narration**

Text ID: `scene:gate-pattern:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
Echo enters the final keyed instrument. Dated records rise across the Gate in translucent layers, each aligned with the physical change it produced. The First Register appears at the deepest level: natural water, resonant stone, skilled labor, public care, and shared authority drawn as one working system.

Later plans settle over it. Access narrows. Maintenance divides among offices. Worker signatures disappear from ceremonial copies. Dangerous work moves into districts with the least power to refuse it. Halvek's lawful denials join cheaper alloys, shortened schedules, flooded Archive cases, and braces purchased for display rather than load. No single decree breaks Brassreach. The same choices repeat until a preventable failure becomes tradition and tradition begins to look like nature.

Lithen reads each source aloud and names its certainty. “This amendment proves the duty was narrowed. This pressure history shows when the low interference increased. The relationship between them remains our supported conclusion, not a confession left by one villain.” Beneath the later records, the founder pattern continues to glow. She does not call the young city perfect. She calls it evidence that another relationship once worked—and that the present one was made by choices that can be answered with different choices.
```

##### Choices

###### Enter the complete Thread Ledger, including contradictions and costs. (INT) `gate-pattern-full`

- Choice ID: `gate-pattern-full`
- Type: `check`
- Stat / DC: INT / 13
- Next on success: `gate-counter`
- Next on failure: `gate-counter`

**Choice label**

Text ID: `choice:gate-pattern-full:label`

```text
Enter the complete Thread Ledger, including contradictions and costs. (INT)
```

**Success result**

Text ID: `choice:gate-pattern-full:success`

```text
You place the entire Thread Ledger in the fourth stand. The Gate aligns each civic decision with the labor and material that followed it: narrowed duties beside omitted repairs, cheaper alloy beside widening interference, divided authority beside a route disappearing from maps. It also reveals every correction you made and every failure the expedition could not undo. Because nothing has been polished away, the Counter can separate a hopeful claim from preparation already made real.
```

**Failure result**

Text ID: `choice:gate-pattern-full:failure`

```text
Two early observations refuse to align: the first Tangles timing and an undated worker account from the Well. You enter both as unresolved rather than forcing them into the sequence. The Gate leaves small gaps where those claims would have rested, but the larger progression remains visible from the First Register through the present repairs. The Counter will judge the route with less evidence, not false certainty.
```

**Visible bonus label 1**

Text ID: `choice:gate-pattern-full:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
Pattern instrument
```

**Visible bonus label 2**

Text ID: `choice:gate-pattern-full:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
joined record
```

**Visible bonus label 3**

Text ID: `choice:gate-pattern-full:bonus:3:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
record integrity
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › evidence**

Text ID: `choice:gate-pattern-full:effects:effects:success:evidence`

```text
The Gate linked centuries of civic division to physical discord without inventing a single culprit.
```

**Effect copy: effects › failure › evidence**

Text ID: `choice:gate-pattern-full:effects:effects:failure:evidence`

```text
The Gate confirmed the broad progression into discord with two observations unresolved.
```

###### Have Lithen, Orra, Sella, and the workers attest to their parts of the record. (CHA) `gate-pattern-witness`

- Choice ID: `gate-pattern-witness`
- Type: `check`
- Stat / DC: CHA / 13
- Next on success: `gate-counter`
- Next on failure: `gate-counter`

**Choice label**

Text ID: `choice:gate-pattern-witness:label`

```text
Have Lithen, Orra, Sella, and the workers attest to their parts of the record. (CHA)
```

**Success result**

Text ID: `choice:gate-pattern-witness:success`

```text
Lithen names which historical conclusions the Archives can support and which remain theory. Orra confirms the cost beneath the city; Sella names the material failures of the Brassworks; Hessa and the rescued pump crews identify the labor hidden from official plans. Their accounts overlap without becoming identical. Together they form one visible sequence, preventing any institution from claiming later that the crisis belonged entirely to another office—or that the repair was achieved by one heroic hand.
```

**Failure result**

Text ID: `choice:gate-pattern-witness:failure`

```text
The witnesses dispute whether the First Register or the Ninth Platform did more to change Orra’s watch. You do not ask the Gate to settle a question of meaning that its instruments cannot measure. The disagreement remains beside their signatures. Every witness still confirms the larger sequence of divided duty, physical decay, joined repair, and immediate relief, so the Counter receives a common record with one honest argument inside it.
```

**Visible bonus label 1**

Text ID: `choice:gate-pattern-witness:bonus:1:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
Archive trust
```

**Visible bonus label 2**

Text ID: `choice:gate-pattern-witness:bonus:2:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
Watch trust
```

**Visible bonus label 3**

Text ID: `choice:gate-pattern-witness:bonus:3:label`

Context: Short label shown beside the roll modifier when this bonus applies.

```text
Choir trust
```

###### Journal, reward, and consequence copy

**Effect copy: effects › success › testimony**

Text ID: `choice:gate-pattern-witness:effects:effects:success:testimony`

```text
Allied institutions attested to their place in the Gate’s historical pattern.
```

**Effect copy: effects › failure › testimony**

Text ID: `choice:gate-pattern-witness:effects:effects:failure:testimony`

```text
Gate witnesses preserved one unresolved disagreement inside the common sequence.
```

#### The Counter Reading `gate-counter`

- Scene ID: `gate-counter`
- Chapter: `gate`
- Choice count: 1

**Scene title**

Text ID: `scene:gate-counter:title`

```text
The Counter Reading
```

**Current objective**

Text ID: `scene:gate-counter:objective`

```text
Read the expedition’s actual preparation before entering the deepest network.
```

**Scene narration**

Text ID: `scene:gate-counter:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
The Counter awakens behind thick flood glass. It is not a judge, and it does not speak. Brass drums rotate through the readings of Stone, Brass, and Echo, then stop against the repairs, testimony, injuries, failures, and alliances preserved in your ledger. Nothing can be improved by rhetoric now. The instrument measures only what the expedition has made true.

Its answer is practical and severe. Brassreach cannot be restored tonight. Thousands of discordant branches remain, and centuries of unequal burden cannot be reversed by one calibration. Yet the Counter also reveals the first broad improvement in generations. Water has slowed along the connected anchors. Offices that worked apart have begun to share material and authority. The people who maintain the city can hear one another again. The Unfathomer has encountered sustained relief where it expected only worsening pain.

Lithen reads the final drums. “We cannot know whether it understands hope,” she says. “We know it responds to the direction our work has already taken. That may be enough to ease its search and buy the city honest time—if the course you choose remains within what this route can carry.”

The Gate does not swing open. Its concentric rings separate by inches, and black water climbs between them without spilling. Pressure shapes the water into a standing passage that leads beyond the atrium wall. Cerulean light flickers somewhere inside. The Three Keys continue to sound behind you as the living Choice waits ahead.
```

##### Branch arrivals

**Arrival from gate-pattern-full:success**

Text ID: `scene:gate-counter:arrival:gate-pattern-full:success`

Context: This sentence bridges the previous choice result into this scene.

```text
The complete ledger settles into the Counter without hiding any recorded cost or contradiction.
```

**Arrival from gate-pattern-full:failure**

Text ID: `scene:gate-counter:arrival:gate-pattern-full:failure`

Context: This sentence bridges the previous choice result into this scene.

```text
The Counter marks two early observations as unresolved and continues with the evidence you could verify.
```

**Arrival from gate-pattern-witness:success**

Text ID: `scene:gate-counter:arrival:gate-pattern-witness:success`

Context: This sentence bridges the previous choice result into this scene.

```text
The witnesses seal their separate statements before the Counter begins its reading.
```

**Arrival from gate-pattern-witness:failure**

Text ID: `scene:gate-counter:arrival:gate-pattern-witness:failure`

Context: This sentence bridges the previous choice result into this scene.

```text
One disputed repair remains visible beside the witnesses’ shared account.
```

##### Entry records and rewards

**Entry copy: enter › milestone**

Text ID: `scene:gate-counter:enter:enter:milestone`

```text
The Counter measured the expedition’s preparation without moral judgment.
```

##### Choices

###### Enter the water-lit passage with the Three Keys and the ledger. `counter-enter`

- Choice ID: `counter-enter`
- Type: `advance`
- Next on success: `choice-contact`

**Choice label**

Text ID: `choice:counter-enter:label`

```text
Enter the water-lit passage with the Three Keys and the ledger.
```

**Immediate outcome**

Text ID: `choice:counter-enter:outcome`

```text
The passage holds around you as a pressure boundary. Every repaired anchor remains faintly present through Stone, Brass, and Echo.
```

###### Journal, reward, and consequence copy

### Act VII — The Living Choice

- Chapter ID: `choice`
- Scenes: 2

**Act label**

Text ID: `chapter:choice:act`

```text
Act VII
```

**Chapter title**

Text ID: `chapter:choice:title`

```text
The Living Choice
```

#### The Unfathomer’s Nearness `choice-contact`

- Scene ID: `choice-contact`
- Chapter: `choice`
- Choice count: 1

**Scene title**

Text ID: `scene:choice-contact:title`

```text
The Unfathomer’s Nearness
```

**Current objective**

Text ID: `scene:choice-contact:objective`

```text
Understand the response of the deep network without inventing speech.
```

**Scene narration**

Text ID: `scene:choice-contact:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
You step into the water-lit passage. At first its walls remain a patchwork of reservoir stone, founder brass, and exposed mechanism. Deeper within, those familiar materials become impossible to separate. Out of the corner of your eye, the walls seem to ebb with the water beyond them, almost breathing. The air hums with energy, but no voice speaks. The same prickling you felt at the great cistern travels slowly along your skin.

For several minutes you walk in silence while the corridor widens around you. The changing echo of your footfalls is the only warning that you have entered another chamber. Your lamplight finds no ceiling and no far shore. Small cerulean lights rise from a body of black water stretching beyond perception. At first they resemble fireflies. Then every light turns with your movement in the same instant, and the comparison becomes far too small.

You place the Three Keys in their traveling cradles upon the stone. Stone reveals pressure settling through caverns larger than the city. Brass carries the repaired interval from every anchor along your route. Echo returns the deep memory of that relationship before neglect bent it apart. The lights gather around those signals, responding everywhere at once. When the stable interval reaches them, the water releases its grip upon the chamber walls. When your ledger receives the crews' witnessed commitment to continue, that easing spreads farther into the dark.

No face waits in the water. No hidden voice explains what you must do. Yet Lithen's name finally fits the evidence before you: immense, continuous, aware without a center, and reaching blindly for the harmony in which it once rested. The Unfathomer cannot weigh a polished promise. It can perceive the repairs, the shared labor, and the direction of intention carried through them. You cannot heal Brassreach tonight, nor in a hundred nights. You can show this suffering presence which future the city is prepared to begin.
```

##### Choices

###### Let the Three Keys translate the available interventions. `contact-read`

- Choice ID: `contact-read`
- Type: `advance`
- Next on success: `choice-decision`

**Choice label**

Text ID: `choice:contact-read:label`

```text
Let the Three Keys translate the available interventions.
```

**Immediate outcome**

Text ID: `choice:contact-read:outcome`

```text
Stone shows cost. Brass shows reach. Echo shows likely continuation. The Counter adds the strength of your repairs and alliances. Five credible courses emerge; none is free of consequence.
```

###### Journal, reward, and consequence copy

**Effect copy: effects › milestone**

Text ID: `choice:contact-read:effects:effects:milestone`

```text
Reached a nonverbal understanding of the deep network’s distress.
```

#### The Living Choice `choice-decision`

- Scene ID: `choice-decision`
- Chapter: `choice`
- Choice count: 5

**Scene title**

Text ID: `scene:choice-decision:title`

```text
The Living Choice
```

**Current objective**

Text ID: `scene:choice-decision:objective`

```text
Choose the first direction Brassreach will sustain after this night.
```

**Scene narration**

Text ID: `scene:choice-decision:story`

Context: This is the main passage shown when the scene begins. Paragraph breaks are preserved.

```text
The Founders left no command for this crisis because they never knew the life their craft had awakened. Stone can reveal the weight of each course. Brass can show how far it will carry. Echo can compare the likely pattern with what came before. None can decide what Brassreach ought to become.

That final Measure is not a hidden word or a fourth instrument. It is living Choice: a decision made with incomplete knowledge, entered beside its foreseeable cost, and accepted by someone who will remain responsible after the chamber grows quiet. The Gate can begin one course tonight. The Unfathomer will perceive that course through the signal you enact and the intention already made physical along your route.

The cerulean lights draw closer. Far above, a scattered and ailing city continues its ordinary evening, unaware that its immediate future rests within this dark chamber. Your decision will not be tested by one last throw of chance. Its strength has been built—or weakened—by every witness heard, every repair completed, every burden moved, and every institution persuaded to act. You take one breath, look into the black expanse, and choose what you are willing to ask Brassreach to sustain.
```

##### Choices

###### Begin a Concord: connect the repaired anchors to a public program of reform and stewardship. `ending-concord`

- Choice ID: `ending-concord`
- Type: `ending`
- Ending: `concord`

**Choice label**

Text ID: `choice:ending-concord:label`

```text
Begin a Concord: connect the repaired anchors to a public program of reform and stewardship.
```

**Submitted action sentence**

Text ID: `choice:ending-concord:sentence`

```text
Begin a Concord.
```

**Locked-choice requirement**

Text ID: `choice:ending-concord:requirement`

```text
Requires all three Keys, strong evidence, six repairs, and four allied institutions.
```

###### Channel the deep pressure toward Porkkala’s old tuning quarries. `ending-channel`

- Choice ID: `ending-channel`
- Type: `ending`
- Ending: `channel`

**Choice label**

Text ID: `choice:ending-channel:label`

```text
Channel the deep pressure toward Porkkala’s old tuning quarries.
```

**Submitted action sentence**

Text ID: `choice:ending-channel:sentence`

```text
Channel the Unfathomer toward Porkkala.
```

**Locked-choice requirement**

Text ID: `choice:ending-channel:requirement`

```text
Requires all three Keys and a credible repaired route.
```

###### Bind the deepest network behind monitored dampening works. `ending-bind`

- Choice ID: `ending-bind`
- Type: `ending`
- Ending: `bind`

**Choice label**

Text ID: `choice:ending-bind:label`

```text
Bind the deepest network behind monitored dampening works.
```

**Submitted action sentence**

Text ID: `choice:ending-bind:sentence`

```text
Bind the deepest network.
```

**Locked-choice requirement**

Text ID: `choice:ending-bind:requirement`

```text
Requires at least two Keys and three completed repairs.
```

###### Banish the presence by severing Brassreach’s oldest resonant paths. `ending-banish`

- Choice ID: `ending-banish`
- Type: `ending`
- Ending: `banish`

**Choice label**

Text ID: `choice:ending-banish:label`

```text
Banish the presence by severing Brassreach’s oldest resonant paths.
```

**Submitted action sentence**

Text ID: `choice:ending-banish:sentence`

```text
Sever the old resonant paths.
```

**Locked-choice requirement**

Text ID: `choice:ending-banish:requirement`

```text
Requires at least two Keys; the cultural and structural cost is severe.
```

###### Hold the immediate rise and preserve time for another civic effort. `ending-hold`

- Choice ID: `ending-hold`
- Type: `ending`
- Ending: `hold`

**Choice label**

Text ID: `choice:ending-hold:label`

```text
Hold the immediate rise and preserve time for another civic effort.
```

**Submitted action sentence**

Text ID: `choice:ending-hold:sentence`

```text
Hold the immediate rise.
```

**Locked-choice requirement**

Text ID: `choice:ending-hold:requirement`

```text
Requires at least two Keys and remains a valid, temporary resolution.
```

## Part III — Endings

The ending address is the player’s declared course. The strong or strained passage is selected from the accumulated evidence, repairs, alliances, testimony, and Keys.

### Concord — The First Repair `concord`

**Ending title**

Text ID: `ending:concord:title`

```text
Concord — The First Repair
```

**Player address / decisive act**

Text ID: `ending:concord:address`

```text
You close your eyes and speak with the authority of a scattered people who do not yet know how near they stand to ruin. “Brassreach turned long ago from the care that made it great. I cannot heal our city in one night, nor in a hundred nights, and I will not offer you a promise made only of words. Along the road to this chamber, people who had forgotten how to labor together repaired one another's failures. They heard the workers our laws ignored. They carried burdens they once placed upon others. Those acts are small beside the harm of centuries, but they are real.”

The cerulean lights circle closer, their pulse joining the repaired interval. “We will look to yesterday for guidance and to tomorrow for hope. I have seen the first good seeds take root, and I will not let them wither unseen. Give us the time to continue what we have begun, and we will find our way—not backward into legend, but forward into a harmony the living choose together.”
```

**Strong resolution**

Text ID: `ending:concord:strong`

```text
The response arrives everywhere at once. Pressure leaves the chamber walls. Cerulean light passes through the brass veins without traveling from one vein to the next, as if the whole deep network remembers brightness in the same instant. Through Stone comes the weight of caverns settling. Through Brass come the Tangles gate, the Record Well, the Mullinen foundation, and the full Brassworks chord. Through Echo comes the memory of those relationships before neglect bent them apart.

The Unfathomer cannot know whether Brassreach will keep faith for a century. It can perceive that the movement has already begun. Its outward search slows around the repaired anchors and withdraws from the most vulnerable foundations. The black water falls below the Ninth stair, then the Archive flood line, then the homes marked in your first commission.

Above, the Thread Ledger makes the city's departure from the Founding Covenant impossible to dismiss. Archives, Wardens, Worksfolk, and the Brass Choir establish a public repair assembly with workers holding witnessed authority beside officials. Halvek's files open the first hearings into divided maintenance. Brassreach is not healed. Years of labor and political struggle remain, and not every House accepts the new course. Yet the city has gained time, a truthful record, and its first shared direction in generations.
```

**Strained resolution**

Text ID: `ending:concord:strained`

```text
The lights answer your words, but the response falters where the repaired route ends. Pressure eases through the anchors your expedition secured, while neglected branches continue to groan beyond them. The Unfathomer slows its rise around those islands of relief. Water drops far enough to prevent immediate collapse, though several lower districts remain flooded and the Ninth stair stays closed.

Your ledger carries the call for Concord upward, but gaps in evidence and cooperation give the High Houses room to dispute its meaning. Reform begins as an argument rather than a united program. Workers and allied officials use the stable anchors as proof that another direction is possible, and every opposing claim must now answer the witnessed record. Brassreach has not found harmony. It has won a fragile beginning and enough time to defend it.
```

### Channel — A Quieter Shore `channel`

**Ending title**

Text ID: `ending:channel:title`

```text
Channel — A Quieter Shore
```

**Player address / decisive act**

Text ID: `ending:channel:address`

```text
You turn the Brass Key toward the old quarry line that climbs beyond the crowded terraces. “I cannot promise you peace within a city that has forgotten how to make it,” you say into the immense silence. “But there is quieter stone at Porkkala, shaped for tuning before greed stripped its halls. We can open that road. Follow the relief we are able to give, and we will maintain the way for as long as you need it.”

The lights stream toward the new interval, testing its direction without forming a word. “This is not exile, and it is not absolution for Brassreach. My ledger will name the burden we move and the duty that follows it. If our people use your departure to forget what caused your pain, then this road will become another failure. If they keep faith, it may become a shore where both city and deep water can rest.”
```

**Strong resolution**

Text ID: `ending:channel:strong`

```text
Stone reveals an intact load path beneath Porkkala, Brass carries the stable interval into its abandoned tuning chambers, and Echo confirms that the old quarries once held the same founder relationship. The Gate opens that route gradually. Cerulean lights enter the western channels, and the Unfathomer follows the expanding region of relief without command or spoken bargain.

Water falls through Brassreach's most threatened works while pressure gathers safely beneath the empty quarries. Choir and quarry crews establish permanent stations along the channel, and the living mechanisms of the city remain bright. Your ledger requires public measurements at both ends so no future office can call a burden removed merely because it has moved beyond sight.

Brassreach survives with much of its wonder intact. The easier danger is postponed, however: leaders may treat the quieter water as permission to avoid deeper reform. Whether the city uses this reprieve to repair its values or merely exports the consequence remains an obligation cut prominently into your final account.
```

**Strained resolution**

Text ID: `ending:channel:strained`

```text
The quarry line accepts only a narrow interval. The lights gather toward it, and enough of the Unfathomer's outward pressure turns west to save the upper foundations, but the channel must be tuned without interruption. Several lower districts remain flooded while crews reinforce the route.

Porkkala receives a responsibility its people did not create, and negotiations begin beneath the shadow of emergency. Your ledger records the moved water, the shared custody required, and every warning against calling the crisis solved. Brassreach has relief, not absolution; one neglected station could teach the deep network to search upward again.
```

### Bind — The Monitored Quiet `bind`

**Ending title**

Text ID: `ending:bind:title`

```text
Bind — The Monitored Quiet
```

**Player address / decisive act**

Text ID: `ending:bind:address`

```text
You rest one hand upon Stone and face the lights moving through the black water. “We have brought you pain, and our first duty is to stop that pain from destroying lives neither you nor I intend to lose. I cannot give Brassreach harmony tonight. I can give you distance from its worst discord while we repair what reaches you.”

Brass turns the proposed dampening ring into a low, sheltered interval. “This boundary is not a prison and cannot become an excuse. The Archives will preserve its limits. Workers will measure the pressure. The city will return when it can approach with something better than the noise it has made. Until then, let this quiet stand between your suffering and ours.”
```

**Strong resolution**

Text ID: `ending:bind:strong`

```text
The Gate raises dampening fields along load paths Stone has proven safe. Brass turns the barriers inward toward a calm interval rather than striking the deep network with silence. The Unfathomer withdraws from the city's discord and settles behind the new quiet. Its cerulean lights remain visible through the channels, dim but unbroken, while the immediate rise stops.

The binding is recorded as temporary protection, not punishment. Pump workers hold the monitoring stations; the Archives preserve review dates that no Council may erase; and the Brass Choir keeps a controlled tone through which pressure changes can still be observed. Large portions of the old living network fall quiet, and several extraordinary mechanisms cease to answer, but no one mistakes that silence for a cure.

Brassreach has made room for repair without forcing the Unfathomer to endure every discordant blow. Whether the city uses that room honestly will determine whether the boundary becomes a shelter or another inherited wrong.
```

**Strained resolution**

Text ID: `ending:bind:strained`

```text
The dampening ring closes unevenly. It halts the outward pressure and saves the city, but weak readings force the Gate to isolate more of the old network than intended. Cerulean lights disappear from entire branches. Ancient pumps and self-balancing foundations become ordinary metal and stone before the water finally stops.

Your ledger records a mandatory return and the conditions required before contact can be widened. Lithen warns that future Councils may prefer a permanent silence they no longer have to understand. Brassreach is safe for now, but its safety rests upon a restricted living presence and a promise the city has not yet earned the right to trust.
```

### Banish — The Severed Wonder `banish`

**Ending title**

Text ID: `ending:banish:title`

```text
Banish — The Severed Wonder
```

**Player address / decisive act**

Text ID: `ending:banish:address`

```text
You look upon the lights and feel the scale of what Brassreach is about to lose. “We made the discord that drives you upward, and you have no other way to escape it. Our failure has placed lives in the path of your search. I will not name you evil so that this choice becomes easier.”

Echo shows the oldest resonant paths leaving the city for deeper stone. “I am opening a way beyond our reach and closing the roads between us. You will no longer feel the city that wounded you. We will no longer depend upon the life our craft awakened without understanding. Go where our noise cannot follow. Brassreach will bear the cost of surviving by its own hands.”
```

**Strong resolution**

Text ID: `ending:banish:strong`

```text
The Gate severs each resonant path in a measured order. Cerulean lights retreat through the oldest channels, not as a fleeing army but as sensation withdrawing from a source of pain. The Unfathomer passes beyond the reach of Stone, Brass, and Echo. Only then does the water subside.

Across Brassreach, living mechanisms dim. Self-balancing pumps lose their subtle correction. Golden seams in the Undercity fade to ordinary brass. Engineers and crews move immediately to the replacement plans carried in your ledger, preserving the most vulnerable systems while ancient terraces settle by inches.

The city survives, but it gives up part of what made it extraordinary. Your record names the act as emergency separation, never victory over an evil foe. Brassreach must now discover whether shared stewardship was merely a way to use living wonder—or a principle its people can uphold when only their own labor remains.
```

**Strained resolution**

Text ID: `ending:banish:strained`

```text
The severance begins before every branch has been mapped. The deep lights withdraw, but uneven breaks tear through several old works as they go. One terrace settles beyond repair, pumps stop across the lower wards, and evacuations continue for weeks after the water recedes.

The Unfathomer becomes unreachable. Brassreach survives in a quieter, poorer form, sustained by emergency machinery and exhausting labor. Your ledger preserves both the necessity claimed and the uncertainty accepted. The city must decide what kind of craft can replace the wonder it cut away—and whether it will place the cost upon the same people once again.
```

### Hold — Time Honestly Bought `hold`

**Ending title**

Text ID: `ending:hold:title`

```text
Hold — Time Honestly Bought
```

**Player address / decisive act**

Text ID: `ending:hold:address`

```text
You do not offer the deep water a future your expedition cannot yet support. “I have followed this crisis farther than any first commission should have carried me,” you say, “and still there is more I do not know than I know. Brassreach is not ready to choose a lasting course. I will not hide that failure beneath brave words.”

You set the Keys to the strongest verified anchors. “What we can give tonight is a narrow peace. We will hold back the worst discord, complete the missing record, and return with a city better prepared to answer for itself. This is not the end of your suffering or our duty. It is time honestly bought.”
```

**Strong resolution**

Text ID: `ending:hold:strong`

```text
The Gate settles the most dangerous loads and carries a narrow calm through every verified anchor. The cerulean lights gather around that stable path. The Unfathomer's outward rise pauses, not because it has received a promise, but because the repaired route offers sustained relief from the harshest interference.

Water drops from the immediate flood lines, and Brassreach gains a credible season. Lithen begins the missing Archive comparisons. Orra maps the unmended foundations. Sella trains new mixed crews to extend the stable interval. Your ledger names every instrument, repair, and alliance still required before another expedition attempts a lasting course.

Hold is not failure. It is restraint made useful: time purchased with a truthful account of what remains undone and a citywide warning that cannot be filed away as one more isolated problem.
```

**Strained resolution**

Text ID: `ending:hold:strained`

```text
The available anchors carry only a brief, uneven calm. The Gate halts the worst pressure for several weeks, and the lights recede from the nearest foundations, but lower works remain closed and the interval requires constant labor to maintain.

Your ledger gives the next effort something earlier generations denied you: a precise map of missing evidence, failed repairs, unsupported burdens, and absent allies. Brassreach has not solved its crisis. It has refused to bury another warning, and that refusal may be enough to keep the next Threadbearer from beginning in darkness.
```

## Part IV — Merchants and Items

### Merchants

#### Quartermaster Dorrin `dorrin`

- Merchant ID: `dorrin`
- Stock: Rope Coil, Oil Flask, Lockpin, Surveyor Hood, Saltglass Salve

**Display name**

Text ID: `merchant:dorrin:name`

```text
Quartermaster Dorrin
```

**Role / shop title**

Text ID: `merchant:dorrin:title`

```text
Watch Issue & Field Stock
```

**Greeting**

Text ID: `merchant:dorrin:greeting`

```text
“Buy for the climb back, not just the walk down,” Dorrin says. “Most first-timers forget there are two directions.”
```

#### Sella of the Lower Salvage `sella`

- Merchant ID: `sella`
- Stock: Foundry Gloves, Warden Pick, Echo Buckler, Cistern Boots, Saltglass Salve

**Display name**

Text ID: `merchant:sella:name`

```text
Sella of the Lower Salvage
```

**Role / shop title**

Text ID: `merchant:sella:title`

```text
Brassworks Reclamation Table
```

**Greeting**

Text ID: `merchant:sella:greeting`

```text
“Everything here failed somewhere. I can tell you where, and I will not pretend that makes it useless.”
```

### Item Catalog

Stable item IDs, slots, stats, requirements, qualities, and values are mechanical context. Names, mechanical descriptions, and lore descriptions are editable copy.

#### Torch `tool-torch`

- Item ID: `tool-torch`
- Slot: `offHand`
- Category: Tool
- Quality: common
- Relic: no
- Stats: power +0, armor +0, resilience +1
- Requirements: none
- Value: 3 gold

**Item name**

Text ID: `item:tool-torch:name`

```text
Torch
```

**Mechanical description**

Text ID: `item:tool-torch:mechanic`

```text
Lights dark passages and keeps one hand occupied.
```

**Lore description**

Text ID: `item:tool-torch:lore`

```text
A pitch-wrapped torch made for the damp air below Brassreach.
```

#### Canteen `provision-canteen`

- Item ID: `provision-canteen`
- Slot: `accessory`
- Category: Provision
- Quality: common
- Relic: no
- Stats: power +0, armor +0, resilience +1
- Requirements: none
- Value: 4 gold

**Item name**

Text ID: `item:provision-canteen:name`

```text
Canteen
```

**Mechanical description**

Text ID: `item:provision-canteen:mechanic`

```text
Carries clean water for a long descent.
```

**Lore description**

Text ID: `item:provision-canteen:lore`

```text
Stamped brass marks show that it once belonged to a city survey crew.
```

#### Oil Flask `provision-oil-flask`

- Item ID: `provision-oil-flask`
- Slot: `accessory`
- Category: Provision
- Quality: fine
- Relic: no
- Stats: power +0, armor +0, resilience +1
- Requirements: none
- Value: 8 gold

**Item name**

Text ID: `item:provision-oil-flask:name`

```text
Oil Flask
```

**Mechanical description**

Text ID: `item:provision-oil-flask:mechanic`

```text
Feeds lamps or loosens a seized mechanism.
```

**Lore description**

Text ID: `item:provision-oil-flask:lore`

```text
The dark oil smells of cedar smoke and hot iron.
```

#### Rope Coil `tool-rope-coil`

- Item ID: `tool-rope-coil`
- Slot: `accessory`
- Category: Tool
- Quality: common
- Relic: no
- Stats: power +0, armor +0, resilience +1
- Requirements: STR 8
- Value: 6 gold

**Item name**

Text ID: `item:tool-rope-coil:name`

```text
Rope Coil
```

**Mechanical description**

Text ID: `item:tool-rope-coil:mechanic`

```text
Secures climbs, crossings, and heavy loads.
```

**Lore description**

Text ID: `item:tool-rope-coil:lore`

```text
Forty feet of tarred rope woven in the Warden yards.
```

#### Lockpin `tool-lockpin`

- Item ID: `tool-lockpin`
- Slot: `accessory`
- Category: Tool
- Quality: fine
- Relic: no
- Stats: power +0, armor +0, resilience +0
- Requirements: DEX 10
- Value: 11 gold

**Item name**

Text ID: `item:tool-lockpin:name`

```text
Lockpin
```

**Mechanical description**

Text ID: `item:tool-lockpin:mechanic`

```text
Opens simple locks and releases old brass catches.
```

**Lore description**

Text ID: `item:tool-lockpin:lore`

```text
Its narrow teeth can feel a mechanism before the hand can see it.
```

#### Surveyor Hood `armor-surveyor-hood`

- Item ID: `armor-surveyor-hood`
- Slot: `head`
- Category: Armor
- Quality: fine
- Relic: no
- Stats: power +0, armor +1, resilience +1
- Requirements: INT 9
- Value: 18 gold

**Item name**

Text ID: `item:armor-surveyor-hood:name`

```text
Surveyor Hood
```

**Mechanical description**

Text ID: `item:armor-surveyor-hood:mechanic`

```text
Protects the head without muffling echoes.
```

**Lore description**

Text ID: `item:armor-surveyor-hood:lore`

```text
A close-cut hood reinforced with thin brass listening plates.
```

#### Riveted Workcoat `armor-riveted-workcoat`

- Item ID: `armor-riveted-workcoat`
- Slot: `chest`
- Category: Armor
- Quality: rare
- Relic: no
- Stats: power +0, armor +3, resilience +1
- Requirements: STR 10
- Value: 42 gold

**Item name**

Text ID: `item:armor-riveted-workcoat:name`

```text
Riveted Workcoat
```

**Mechanical description**

Text ID: `item:armor-riveted-workcoat:mechanic`

```text
A sturdy coat built to turn falling stone and glancing steel.
```

**Lore description**

Text ID: `item:armor-riveted-workcoat:lore`

```text
Small iron scales are sewn beneath soot-dark leather.
```

#### Foundry Gloves `armor-foundry-gloves`

- Item ID: `armor-foundry-gloves`
- Slot: `hands`
- Category: Armor
- Quality: fine
- Relic: no
- Stats: power +1, armor +1, resilience +0
- Requirements: STR 9
- Value: 22 gold

**Item name**

Text ID: `item:armor-foundry-gloves:name`

```text
Foundry Gloves
```

**Mechanical description**

Text ID: `item:armor-foundry-gloves:mechanic`

```text
Improves grip on tools, weapons, and hot mechanisms.
```

**Lore description**

Text ID: `item:armor-foundry-gloves:lore`

```text
The palms are rough leather; the knuckles are capped in brass.
```

#### Slateweave Trousers `armor-slateweave-trousers`

- Item ID: `armor-slateweave-trousers`
- Slot: `legs`
- Category: Armor
- Quality: rare
- Relic: no
- Stats: power +0, armor +2, resilience +1
- Requirements: DEX 10
- Value: 36 gold

**Item name**

Text ID: `item:armor-slateweave-trousers:name`

```text
Slateweave Trousers
```

**Mechanical description**

Text ID: `item:armor-slateweave-trousers:mechanic`

```text
Flexible leg protection for ladders and narrow ledges.
```

**Lore description**

Text ID: `item:armor-slateweave-trousers:lore`

```text
Overlapping slate fibers move like cloth and harden under impact.
```

#### Cistern Boots `armor-cistern-boots`

- Item ID: `armor-cistern-boots`
- Slot: `feet`
- Category: Armor
- Quality: flawless
- Relic: no
- Stats: power +0, armor +2, resilience +2
- Requirements: DEX 11
- Value: 58 gold

**Item name**

Text ID: `item:armor-cistern-boots:name`

```text
Cistern Boots
```

**Mechanical description**

Text ID: `item:armor-cistern-boots:mechanic`

```text
Keeps steady footing on flooded stone.
```

**Lore description**

Text ID: `item:armor-cistern-boots:lore`

```text
Deep-cut soles grip wet channels without scraping loud enough to carry.
```

#### Warden Pick `weapon-warden-pick`

- Item ID: `weapon-warden-pick`
- Slot: `mainHand`
- Category: Weapon
- Quality: rare
- Relic: no
- Stats: power +3, armor +0, resilience +0
- Requirements: STR 11
- Value: 48 gold

**Item name**

Text ID: `item:weapon-warden-pick:name`

```text
Warden Pick
```

**Mechanical description**

Text ID: `item:weapon-warden-pick:mechanic`

```text
A compact war pick suited to armor and cracked masonry.
```

**Lore description**

Text ID: `item:weapon-warden-pick:lore`

```text
Wardens carry this balanced tool when repairs may become a fight.
```

#### Echo Buckler `shield-echo-buckler`

- Item ID: `shield-echo-buckler`
- Slot: `offHand`
- Category: Shield
- Quality: flawless
- Relic: no
- Stats: power +0, armor +3, resilience +1
- Requirements: DEX 11
- Value: 64 gold

**Item name**

Text ID: `item:shield-echo-buckler:name`

```text
Echo Buckler
```

**Mechanical description**

Text ID: `item:shield-echo-buckler:mechanic`

```text
Deflects blows and rings sharply when danger is near.
```

**Lore description**

Text ID: `item:shield-echo-buckler:lore`

```text
Concentric channels spread impact into a clear warning note.
```

#### Measure Ring `relic-measure-ring`

- Item ID: `relic-measure-ring`
- Slot: `accessory`
- Category: Relic
- Quality: legendary
- Relic: yes
- Stats: power +1, armor +1, resilience +3
- Requirements: INT 12
- Value: 120 gold

**Item name**

Text ID: `item:relic-measure-ring:name`

```text
Measure Ring
```

**Mechanical description**

Text ID: `item:relic-measure-ring:mechanic`

```text
Strengthens the wearer while they carry an unresolved civic duty.
```

**Lore description**

Text ID: `item:relic-measure-ring:lore`

```text
Its three old marks preserve Weight, Tone, and Pattern; the unmarked center is left for living choice.
```

#### Archive Lens `tool-archive-lens`

- Item ID: `tool-archive-lens`
- Slot: `accessory`
- Category: Tool
- Quality: rare
- Relic: no
- Stats: power +0, armor +0, resilience +1
- Requirements: INT 11
- Value: 34 gold

**Item name**

Text ID: `item:tool-archive-lens:name`

```text
Archive Lens
```

**Mechanical description**

Text ID: `item:tool-archive-lens:mechanic`

```text
Reveals altered ink, hairline cracks, and worn inscriptions.
```

**Lore description**

Text ID: `item:tool-archive-lens:lore`

```text
Lithen keeps this silver-rimmed lens beside the restricted ledgers.
```

#### Resonance Fork `tool-resonance-fork`

- Item ID: `tool-resonance-fork`
- Slot: `mainHand`
- Category: Tool
- Quality: flawless
- Relic: no
- Stats: power +1, armor +0, resilience +2
- Requirements: INT 11
- Value: 56 gold

**Item name**

Text ID: `item:tool-resonance-fork:name`

```text
Resonance Fork
```

**Mechanical description**

Text ID: `item:tool-resonance-fork:mechanic`

```text
Tests pressure channels and isolates a clean mechanical tone.
```

**Lore description**

Text ID: `item:tool-resonance-fork:lore`

```text
Its twin prongs were tuned for the Gate crews before the lower works closed.
```

#### Saltglass Salve `provision-saltglass-salve`

- Item ID: `provision-saltglass-salve`
- Slot: `accessory`
- Category: Provision
- Quality: fine
- Relic: no
- Stats: power +0, armor +0, resilience +1
- Requirements: none
- Value: 16 gold

**Item name**

Text ID: `item:provision-saltglass-salve:name`

```text
Saltglass Salve
```

**Mechanical description**

Text ID: `item:provision-saltglass-salve:mechanic`

```text
A field medicine that seals cuts and cools minor burns.
```

**Lore description**

Text ID: `item:provision-saltglass-salve:lore`

```text
Pale mineral gel glows briefly when pressed into a wound.
```

#### Surveyor’s Chalk `tool-surveyors-chalk`

- Item ID: `tool-surveyors-chalk`
- Slot: `accessory`
- Category: Tool
- Quality: common
- Relic: no
- Stats: power +0, armor +0, resilience +1
- Requirements: INT 8
- Value: 5 gold

**Item name**

Text ID: `item:tool-surveyors-chalk:name`

```text
Surveyor’s Chalk
```

**Mechanical description**

Text ID: `item:tool-surveyors-chalk:mechanic`

```text
Marks tested masonry, load paths, and a safe return route.
```

**Lore description**

Text ID: `item:tool-surveyors-chalk:lore`

```text
Dorrin issues each stick against a written public purpose.
```

#### Thread Ledger `quest-thread-ledger`

- Item ID: `quest-thread-ledger`
- Slot: `accessory`
- Category: Quest
- Quality: rare
- Relic: yes
- Stats: power +0, armor +0, resilience +2
- Requirements: INT 9
- Value: 0 gold

**Item name**

Text ID: `item:quest-thread-ledger:name`

```text
Thread Ledger
```

**Mechanical description**

Text ID: `item:quest-thread-ledger:mechanic`

```text
Preserves witnessed findings and makes later alterations visible.
```

**Lore description**

Text ID: `item:quest-thread-ledger:lore`

```text
Thin brass leaves bind testimony, physical evidence, decisions, and consequences into one public record.
```

#### Deep Writ Seal `quest-deep-writ-seal`

- Item ID: `quest-deep-writ-seal`
- Slot: `accessory`
- Category: Quest
- Quality: flawless
- Relic: yes
- Stats: power +0, armor +1, resilience +2
- Requirements: none
- Value: 0 gold

**Item name**

Text ID: `item:quest-deep-writ-seal:name`

```text
Deep Writ Seal
```

**Mechanical description**

Text ID: `item:quest-deep-writ-seal:mechanic`

```text
Proves lawful access to restricted public works without granting command over their people.
```

**Lore description**

Text ID: `item:quest-deep-writ-seal:lore`

```text
Captain Brunna fixed the seal beside your probationary mark after your first joined account.
```

#### Piera’s Route Map `tool-pieras-route-map`

- Item ID: `tool-pieras-route-map`
- Slot: `accessory`
- Category: Tool
- Quality: fine
- Relic: no
- Stats: power +0, armor +0, resilience +1
- Requirements: INT 9
- Value: 14 gold

**Item name**

Text ID: `item:tool-pieras-route-map:name`

```text
Piera’s Route Map
```

**Mechanical description**

Text ID: `item:tool-pieras-route-map:mechanic`

```text
Reveals lived routes omitted from modern civic plans.
```

**Lore description**

Text ID: `item:tool-pieras-route-map:lore`

```text
Stitched delivery scraps turn official blanks into useful, almost-true geography.
```

#### Mender’s Clamp `tool-menders-clamp`

- Item ID: `tool-menders-clamp`
- Slot: `accessory`
- Category: Tool
- Quality: fine
- Relic: no
- Stats: power +1, armor +0, resilience +1
- Requirements: STR 9
- Value: 18 gold

**Item name**

Text ID: `item:tool-menders-clamp:name`

```text
Mender’s Clamp
```

**Mechanical description**

Text ID: `item:tool-menders-clamp:mechanic`

```text
Holds a brace, gate, or housing at a controlled temporary setting.
```

**Lore description**

Text ID: `item:tool-menders-clamp:lore`

```text
Tangles repair crews favor this plain clamp over ornamental emergency gear.
```

#### Salt-Hound Whistle `tool-salt-hound-whistle`

- Item ID: `tool-salt-hound-whistle`
- Slot: `accessory`
- Category: Tool
- Quality: fine
- Relic: no
- Stats: power +0, armor +0, resilience +1
- Requirements: CHA 9
- Value: 12 gold

**Item name**

Text ID: `item:tool-salt-hound-whistle:name`

```text
Salt-Hound Whistle
```

**Mechanical description**

Text ID: `item:tool-salt-hound-whistle:mechanic`

```text
Carries a low handler call through drainage passages.
```

**Lore description**

Text ID: `item:tool-salt-hound-whistle:lore`

```text
Its note is quiet to dwarven ears and clear to animals raised near resonant stone.
```

#### First Register Rubbing `quest-first-register-rubbing`

- Item ID: `quest-first-register-rubbing`
- Slot: `accessory`
- Category: Quest
- Quality: legendary
- Relic: yes
- Stats: power +0, armor +0, resilience +2
- Requirements: INT 10
- Value: 0 gold

**Item name**

Text ID: `item:quest-first-register-rubbing:name`

```text
First Register Rubbing
```

**Mechanical description**

Text ID: `item:quest-first-register-rubbing:mechanic`

```text
Carries the recovered founder calibration without risking the original record.
```

**Lore description**

Text ID: `item:quest-first-register-rubbing:lore`

```text
The pressure rubbing preserves the relationship among Stone, Brass, Echo, and living choice.
```

#### Echo Key `quest-echo-key`

- Item ID: `quest-echo-key`
- Slot: `accessory`
- Category: Quest
- Quality: legendary
- Relic: yes
- Stats: power +0, armor +0, resilience +3
- Requirements: INT 11
- Value: 0 gold

**Item name**

Text ID: `item:quest-echo-key:name`

```text
Echo Key
```

**Mechanical description**

Text ID: `item:quest-echo-key:mechanic`

```text
Provides a stable reference for Pattern, memory, and trustworthy return.
```

**Lore description**

Text ID: `item:quest-echo-key:lore`

```text
Archive custody keeps citywide history beyond the reach of any single office.
```

#### Stone Key `quest-stone-key`

- Item ID: `quest-stone-key`
- Slot: `accessory`
- Category: Quest
- Quality: legendary
- Relic: yes
- Stats: power +0, armor +2, resilience +2
- Requirements: STR 10
- Value: 0 gold

**Item name**

Text ID: `item:quest-stone-key:name`

```text
Stone Key
```

**Mechanical description**

Text ID: `item:quest-stone-key:mechanic`

```text
Makes load, burden, and structural consequence legible.
```

**Lore description**

Text ID: `item:quest-stone-key:lore`

```text
Mullinen custody binds the instrument to the public purpose of the works.
```

#### Brass Key `quest-brass-key`

- Item ID: `quest-brass-key`
- Slot: `accessory`
- Category: Quest
- Quality: legendary
- Relic: yes
- Stats: power +1, armor +0, resilience +2
- Requirements: INT 10
- Value: 0 gold

**Item name**

Text ID: `item:quest-brass-key:name`

```text
Brass Key
```

**Mechanical description**

Text ID: `item:quest-brass-key:mechanic`

```text
Carries a coherent tonal relationship through connected systems.
```

**Lore description**

Text ID: `item:quest-brass-key:lore`

```text
Choir and Works witness prevent the instrument from becoming one expert’s private command.
```

#### Bent Lockpin `curio-bent-lockpin`

- Item ID: `curio-bent-lockpin`
- Slot: `accessory`
- Category: Curio
- Quality: common
- Relic: no
- Stats: power +0, armor +0, resilience +0
- Requirements: none
- Value: 2 gold

**Item name**

Text ID: `item:curio-bent-lockpin:name`

```text
Bent Lockpin
```

**Mechanical description**

Text ID: `item:curio-bent-lockpin:mechanic`

```text
Documents the force required to stop the fused Brassworks flywheel.
```

**Lore description**

Text ID: `item:curio-bent-lockpin:lore`

```text
The bent teeth are more useful as evidence than as a tool.
```

#### Stoneback Plate `armor-stoneback-plate`

- Item ID: `armor-stoneback-plate`
- Slot: `chest`
- Category: Armor
- Quality: legendary
- Relic: no
- Stats: power +1, armor +4, resilience +2
- Requirements: STR 12
- Value: 78 gold

**Item name**

Text ID: `item:armor-stoneback-plate:name`

```text
Stoneback Plate
```

**Mechanical description**

Text ID: `item:armor-stoneback-plate:mechanic`

```text
Heavy natural armor shaped to turn crushing impacts.
```

**Lore description**

Text ID: `item:armor-stoneback-plate:lore`

```text
The plate still carries the slow mineral warmth of the Depths.
```

**Unknown legacy item — mechanical description**

Text ID: `item:legacy:mechanic`

```text
No reliable use has been recorded.
```

**Unknown legacy item — lore description**

Text ID: `item:legacy:lore`

```text
An uncatalogued object carried into Brassreach.
```

## Part V — Glossary and Codex Definitions

These definitions appear when a globally recognized lore term is focused or hovered. Intro-specific hover definitions are listed separately in Part I because their current wording is not always identical.

**Glossary — brassreach**

Text ID: `glossary:brassreach`

```text
A layered dwarven city whose living works join water, stone, brass, skilled labor, and public care.
```

**Glossary — threadbearers**

Text ID: `glossary:threadbearers`

```text
Civic investigators trained to follow a failure from physical cause through testimony, decision, and consequence.
```

**Glossary — thread-bearers**

Text ID: `glossary:thread-bearers`

```text
Civic investigators trained to follow a failure from physical cause through testimony, decision, and consequence.
```

**Glossary — thread ledger**

Text ID: `glossary:thread-ledger`

```text
A tamper-evident field record. Every sealed account, correction, and later alteration remains visible.
```

**Glossary — deep writ**

Text ID: `glossary:deep-writ`

```text
Hard-earned authority to inspect restricted works and cross-office records, without command over workers or residents.
```

**Glossary — unfathomer**

Text ID: `glossary:unfathomer`

```text
Lithen’s careful name for the immense, continuous living resonance spread through the oldest water, stone, and brass.
```

**Glossary — halls**

Text ID: `glossary:halls`

```text
Upper civic corridors and inspection works forming the threshold to the old city below.
```

**Glossary — archives**

Text ID: `glossary:archives`

```text
The repository of civic law, testimony, engineering history, Threadbearer records, and the Echo Key.
```

**Glossary — depths**

Text ID: `glossary:depths`

```text
Flooded foundations, pressure stairs, and cistern galleries beneath the public works.
```

**Glossary — gate of measures**

Text ID: `glossary:gate-of-measures`

```text
A founder-era calibration mechanism, constitutional safeguard, teaching instrument, and passage into the deepest network.
```

**Glossary — keys**

Text ID: `glossary:keys`

```text
Stone, Brass, and Echo are institutional calibration instruments. Divided custody prevents one office from making a citywide change alone.
```

**Glossary — brass key**

Text ID: `glossary:brass-key`

```text
The calibration instrument for Tone: active resonance and relationships among systems.
```

**Glossary — echo key**

Text ID: `glossary:echo-key`

```text
The calibration instrument for Pattern: memory, change, and trustworthy return.
```

**Glossary — stone key**

Text ID: `glossary:stone-key`

```text
The calibration instrument for Weight: load, burden, foundation, and consequence.
```

**Glossary — measures**

Text ID: `glossary:measures`

```text
Weight, Tone, and Pattern make the old works legible; living Choice supplies a responsible direction.
```

**Glossary — weight**

Text ID: `glossary:weight`

```text
What a structure, institution, or decision must carry, and who bears the consequence.
```

**Glossary — tone**

Text ID: `glossary:tone`

```text
The working relationship among voices, materials, mechanisms, and resonant systems.
```

**Glossary — pattern**

Text ID: `glossary:pattern`

```text
What returns across time, including memory, maintenance, precedent, and change.
```

**Glossary — founding covenant**

Text ID: `glossary:founding-covenant`

```text
Brassreach’s first civic constitution, joining stewardship, public record, shared duty, and limits on inherited power.
```

## Part VI — Free Actions and Generated-Prose Guidance

### Local free-action continuation passages

When live narration is disabled or unavailable, the game appends one of these chapter-specific passages after the action written by the player.

**The First Thread fallback 1**

Text ID: `exploration:tutorial:1`

```text
Your inspection reveals fresh strain around the immediate hazard, but no new cause. You mark the safest return route, add the observation to your ledger, and turn back before curiosity becomes delay.
```

**The First Thread fallback 2**

Text ID: `exploration:tutorial:2`

```text
You hold still until nearby footsteps fade. The same low overtone enters the stone beneath your hand, lingers after the visible mechanism grows quiet, and disappears before you can find its source. You record the limit as carefully as the sound.
```

**A Writ Below fallback 1**

Text ID: `exploration:halls:1`

```text
Beneath soot and newer paint, you uncover a maintenance mark pointing beyond the border of the modern plan. It confirms that the route once continued, but your current objective remains the strongest way to learn where it went.
```

**A Writ Below fallback 2**

Text ID: `exploration:halls:2`

```text
Water beads along the lower masonry, cold and metallic against your fingers. The wall remains stable for now. You enter the damp line in your ledger without pretending it explains the wider failure.
```

**The First Register fallback 1**

Text ID: `exploration:archives:1`

```text
A dated note in the margin supports the sequence already assembled in your ledger. It changes no conclusion by itself, but Lithen nods when you preserve it beside the source that gave it meaning.
```

**The First Register fallback 2**

Text ID: `exploration:archives:2`

```text
Three neighboring shelves preserve three different explanations for the same old collapse. You record the disagreement, the authors, and the evidence each possessed before returning to the comparison Lithen can actually test.
```

**The Weight of Brassreach fallback 1**

Text ID: `exploration:depths:1`

```text
Cold water presses through the floor in one broad movement and makes every loose chain answer together. You secure the return line, wait for the pressure to pass, and continue without mistaking survival for discovery.
```

**The Weight of Brassreach fallback 2**

Text ID: `exploration:depths:2`

```text
A scarred Warden mark identifies the next brace that still carries weight. You verify it before trusting your rope to the stone. The larger rise does not slow for this brief inspection.
```

**The Broken Song fallback 1**

Text ID: `exploration:brassworks:1`

```text
Behind a polished modern housing, you find another careful worker patch bearing years of heat without recognition. Its workmanship supports the shared repair plan; it cannot replace the next coordinated step.
```

**The Broken Song fallback 2**

Text ID: `exploration:brassworks:2`

```text
A faint interference beat persists beneath the silent machines. You follow it across two floor plates, mark the timing, and return to Sella before testing anything alone.
```

**The Gate of Measures fallback 1**

Text ID: `exploration:gate:1`

```text
The Gate reveals another layer of load, repair, and consequence. The image is vast enough to invite speculation, but the active instrument still awaits the concrete calibration named in your objective.
```

**The Living Choice fallback 1**

Text ID: `exploration:choice:1`

```text
Pressure changes around you with the stable interval, and the cerulean lights turn as one. No words form in the water. The living Choice still depends upon the preparation measured by the Counter.
```

### Rules that guide optional live narration

These instructions are not shown directly to the player, but they materially influence generated prose and therefore belong in the authoring record.

**Live narration rule 1**

Text ID: `live-guidance:rule-1`

```text
Narrate only the submitted exploratory action; do not advance the authored scene, award items, change stats, or resolve the objective.
```

**Live narration rule 2**

Text ID: `live-guidance:rule-2`

```text
Before Lithen names it: Do not use the name Unfathomer or reveal a hidden entity; the player knows only connected failures and a low overtone.
```

**Live narration rule 3**

Text ID: `live-guidance:rule-3`

```text
After Lithen names it: The Unfathomer is continuous living resonance and cannot speak complex language.
```

**Live narration rule 4**

Text ID: `live-guidance:rule-4`

```text
Do not introduce a Fourth Measure, Line Measure, stolen constitutional record, magical command, or speaking boss.
```

**Live narration rule 5**

Text ID: `live-guidance:rule-5`

```text
Use present-tense, atmospheric high-fantasy prose with a clear actor, object, physical setting, and visible result. Rich detail must establish scale, danger, character, or causality.
```

**Live narration rule 6**

Text ID: `live-guidance:rule-6`

```text
Historical facts must come from a named speaker, document, inscription, or other source available in the current scene.
```

**Live narration rule 7**

Text ID: `live-guidance:rule-7`

```text
Preserve each character voice: Brunna is concise, Dorrin practical, Lithen learned but explicit about uncertainty, Orra direct, and Sella dry and technically observant.
```

**Live narration rule 8**

Text ID: `live-guidance:rule-8`

```text
Never invent item ownership, equipment, bonuses, injuries, gold changes, reputation changes, or other game-state changes.
```

**Live narration rule 9**

Text ID: `live-guidance:rule-9`

```text
Let the beat move from physical impression through action or discovery to a clear turn, while remaining understandable on one attentive reading. Preserve uncertainty where the record is incomplete.
```

## Part VII — Runtime Messages and Reusable Sentence Templates

Words in braces are runtime placeholders. Preserve them exactly unless the associated game code is deliberately changed during reinstallation.

**Free-action assembly**

Text ID: `runtime:free-action:assembly`

```text
You {PLAYER ACTION}. {CHAPTER-SPECIFIC CONTINUATION}
```

**Action processing status**

Text ID: `runtime:status:recording`

```text
Recording…
```

**Missing success fallback**

Text ID: `runtime:check:success-fallback`

```text
The attempt succeeds.
```

**Missing failure fallback**

Text ID: `runtime:check:failure-fallback`

```text
The attempt fails, but the expedition continues.
```

**Missing advance fallback**

Text ID: `runtime:advance:fallback`

```text
You move on.
```

**Roll result summary**

Text ID: `runtime:roll:summary`

```text
d20 {ROLL} {ATTRIBUTE MODIFIER} + {BONUS LABELS AND VALUES} vs DC {DC} = {TOTAL}
```

**Available ending modifier**

Text ID: `runtime:choice:ending-ready`

```text
Living Choice · outcome reflects your preparation
```

**Missing requirement modifier**

Text ID: `runtime:choice:missing`

```text
Missing: {REQUIREMENT PROGRESS}
```

**Merchant choice modifier**

Text ID: `runtime:choice:merchant`

```text
Merchant · buy and sell
```

**Non-check choice modifier**

Text ID: `runtime:choice:no-roll`

```text
No roll
```

**Check modifier**

Text ID: `runtime:choice:check`

```text
DC {DC} · {ACTIVE BONUS LABELS AND VALUES}
```

**Attribute bonus label**

Text ID: `runtime:bonus:attribute`

```text
Attribute: {STAT}
```

**Owned item bonus label**

Text ID: `runtime:bonus:owned`

```text
Owned: {ITEM}
```

**Equipped item bonus label**

Text ID: `runtime:bonus:equipped`

```text
Equipped: {ITEM}
```

**Derived rating bonus label**

Text ID: `runtime:bonus:rating`

```text
{RATING} rating
```

**Prepared route bonus fallback**

Text ID: `runtime:bonus:prepared-route`

```text
Prepared route
```

**Support bonus fallback**

Text ID: `runtime:bonus:support`

```text
Support: {GROUP}
```

**Standing bonus fallback**

Text ID: `runtime:bonus:standing`

```text
Standing: {REPUTATION}
```

**Evidence bonus fallback**

Text ID: `runtime:bonus:evidence`

```text
Relevant evidence
```

**Testimony bonus fallback**

Text ID: `runtime:bonus:testimony`

```text
Witnessed account
```

**Repair bonus fallback**

Text ID: `runtime:bonus:repair`

```text
Earlier repair
```

**Item acquisition fallback**

Text ID: `runtime:item:add-fallback`

```text
You add {ITEM} to your field case.
```

**Key acquisition fallback**

Text ID: `runtime:item:key-fallback`

```text
You secure the {KEY} Key in its travel cradle.
```

**Incompatible equipment**

Text ID: `runtime:item:invalid-slot`

```text
That item does not fit the {SLOT}.
```

**Unmet equipment requirements**

Text ID: `runtime:item:requirements`

```text
You do not meet {ITEM}'s requirements.
```

**Item acquired notice**

Text ID: `runtime:item:added-toast`

```text
{ITEM} added to the field case
```

**Equipped item swap status**

Text ID: `runtime:item:swapped`

```text
{ITEM} swapped into place
```

**Equipped item status**

Text ID: `runtime:item:equipped`

```text
{ITEM} equipped
```

**Unequipped item status**

Text ID: `runtime:item:unequipped`

```text
{ITEM} returned to the pack
```

**Key recovered notice**

Text ID: `runtime:item:key-recovered`

```text
{KEY} Key recovered
```

**Protected editor item**

Text ID: `runtime:item:editor-recorded`

```text
Recorded
```

**Empty editor inventory**

Text ID: `runtime:item:editor-empty`

```text
No items in the field kit.
```

**Relic tooltip hover label**

Text ID: `runtime:tooltip:relic-provenance`

```text
Relic provenance
```

**Relic tooltip seal**

Text ID: `runtime:tooltip:relic`

```text
RELIC
```

**Equipped tooltip tag**

Text ID: `runtime:tooltip:equipped`

```text
Equipped
```

**Equipment comparison line**

Text ID: `runtime:tooltip:comparison`

```text
Compared with {EQUIPPED ITEM}
```

**Item requirements heading**

Text ID: `runtime:tooltip:requirements`

```text
Requirements
```

**No item requirements**

Text ID: `runtime:tooltip:none`

```text
None
```

**Unusable item state**

Text ID: `runtime:tooltip:requirements-not-met`

```text
Requirements not met
```

**Equipped item state**

Text ID: `runtime:tooltip:equipped-ready`

```text
Equipped and ready
```

**Compatible item state**

Text ID: `runtime:tooltip:fits-slot`

```text
Fits the {SLOT} slot
```

**Inventory category fallback**

Text ID: `runtime:inventory:all-categories`

```text
All categories
```

**Empty field-kit accessibility label**

Text ID: `runtime:inventory:empty-hotbar`

```text
Empty field kit slot {SLOT NUMBER}
```

**Filtered backpack accessibility label**

Text ID: `runtime:inventory:filtered-slot`

```text
Filtered item {SLOT NUMBER}
```

**Empty backpack accessibility label**

Text ID: `runtime:inventory:empty-slot-label`

```text
Empty backpack slot {SLOT NUMBER}
```

**Backpack capacity**

Text ID: `runtime:inventory:capacity`

```text
{USED} / {CAPACITY} slots
```

**Backpack overflow count**

Text ID: `runtime:inventory:capacity-overflow`

```text
{USED} / {CAPACITY} slots · {OVERFLOW COUNT} overflow
```

**Overflow tray heading**

Text ID: `runtime:inventory:overflow-title`

```text
Overflow tray · {OVERFLOW COUNT}
```

**Overflow tray help**

Text ID: `runtime:inventory:overflow-help`

```text
Nothing is lost. Clear a backpack slot before adding more items.
```

**Empty equipment slot**

Text ID: `runtime:inventory:empty-equipment-slot`

```text
Empty slot
```

**Occupied equipment accessibility label**

Text ID: `runtime:inventory:unequip-label`

```text
{SLOT}: {ITEM}. Select to unequip.
```

**Compatible equipment accessibility label**

Text ID: `runtime:inventory:equip-label`

```text
{SLOT}: equip {ITEM}
```

**Empty equipment accessibility label**

Text ID: `runtime:inventory:empty-equip-label`

```text
{SLOT}: empty
```

**Lost encounter fallback summary**

Text ID: `runtime:failure:summary`

```text
The attempt fails, but the expedition can continue.
```

**Lost encounter explanation**

Text ID: `runtime:failure:explanation`

```text
The moment cannot be erased. You may accept its consequence, pay once for emergency labor and replacement material, or surrender an ordinary carried item to create one more opening. Keys, relics, quest records, and equipped gear remain protected.
```

**Lost encounter gold option**

Text ID: `runtime:failure:gold-option`

```text
Spend {COST} gold
{SECOND ATTEMPT ALREADY USED OR AVAILABLE GOLD}
```

**Lost encounter item option**

Text ID: `runtime:failure:item-option`

```text
Sacrifice a random item
{ELIGIBLE ITEM COUNT} eligible
```

**Lost encounter accept option**

Text ID: `runtime:failure:accept-option`

```text
Accept the consequence
The story continues from it
```

**Gold reroll passage**

Text ID: `runtime:failure:gold-payment`

```text
You pay {COST} gold for emergency help, replacement material, and one more attempt.
```

**Item reroll passage**

Text ID: `runtime:failure:item-payment`

```text
You leave the {ITEM} behind to recover your position and try again.
```

**Failure modal close warning**

Text ID: `runtime:failure:escape-warning`

```text
Choose a recovery option to continue
```

**Purchase passage**

Text ID: `runtime:merchant:purchase`

```text
You bought the {ITEM} from {MERCHANT} for {PRICE} gold.
```

**Sale passage**

Text ID: `runtime:merchant:sale`

```text
You sold the {ITEM} to {MERCHANT} for {PRICE} gold.
```

**Empty field case**

Text ID: `runtime:merchant:empty`

```text
Your field case is empty.
```

**Empty milestones**

Text ID: `runtime:journal:milestones-empty`

```text
No milestones recorded yet.
```

**Empty evidence**

Text ID: `runtime:journal:evidence-empty`

```text
No evidence joined yet.
```

**Empty witnessed accounts**

Text ID: `runtime:journal:testimony-empty`

```text
No testimony recorded yet.
```

**Empty completed repairs**

Text ID: `runtime:journal:repairs-empty`

```text
No repairs completed yet.
```

**Empty discoveries**

Text ID: `runtime:journal:discoveries-empty`

```text
No discoveries recorded yet.
```

**Empty consequences**

Text ID: `runtime:journal:consequences-empty`

```text
No lasting consequences yet.
```

**Attribute effect label**

Text ID: `runtime:effects:attribute`

```text
Attribute improved
```

**Item effect label**

Text ID: `runtime:effects:item`

```text
Item gained
```

**Authority effect label**

Text ID: `runtime:effects:authority`

```text
Authority updated
```

**Support effect label**

Text ID: `runtime:effects:support`

```text
Support changed
```

**Standing effect label**

Text ID: `runtime:effects:standing`

```text
Standing changed
```

**Evidence effect label**

Text ID: `runtime:effects:evidence`

```text
Evidence recorded
```

**Testimony effect label**

Text ID: `runtime:effects:testimony`

```text
Testimony recorded
```

**Repair effect label**

Text ID: `runtime:effects:repair`

```text
Repair completed
```

**Consequence effect label**

Text ID: `runtime:effects:consequence`

```text
Consequence recorded
```

**Discovery effect label**

Text ID: `runtime:effects:discovery`

```text
Discovery recorded
```

**Missing objective fallback**

Text ID: `runtime:character:awaiting-objective`

```text
Awaiting a new commission.
```

**Empty character harness**

Text ID: `runtime:character:no-gear`

```text
No gear equipped
```

**Healthy condition**

Text ID: `runtime:character:steady`

```text
Steady
```

**Wounded condition**

Text ID: `runtime:character:wounded`

```text
Wounded
```

**Critical condition**

Text ID: `runtime:character:critical`

```text
Critical
```

**Fallen condition**

Text ID: `runtime:character:fallen`

```text
Fallen
```

**Missing authority fallback**

Text ID: `runtime:ledger:uncommissioned`

```text
Uncommissioned
```

**Empty Thread Ledger**

Text ID: `runtime:ledger:empty`

```text
No discoveries inscribed.
```

**Missing resolution title fallback**

Text ID: `runtime:ledger:resolution-recorded`

```text
Recorded
```

**Ending counter record**

Text ID: `runtime:ending:counter`

```text
Counter record: {KEY COUNT} Keys, {EVIDENCE COUNT} evidence entries, {TESTIMONY COUNT} witnessed accounts, {REPAIR COUNT} completed repairs, and {ALLY COUNT} allied groups.
```

**Completed expedition objective**

Text ID: `runtime:ending:objective`

```text
The expedition is complete.
```

**Early retirement — named crisis**

Text ID: `runtime:ending:unresolved-named`

```text
The Unfathomer’s rise remains unresolved below Brassreach.
```

**Early retirement — unnamed crisis**

Text ID: `runtime:ending:unresolved-unnamed`

```text
The connected failures below Brassreach remain unexplained.
```

**Early retirement passage**

Text ID: `runtime:ending:retired`

```text
You retire the expedition at {SCENE} with {GOLD} gold and {ITEM COUNT} carried items. {UNRESOLVED CRISIS}
```

**Early retirement title**

Text ID: `runtime:ending:retired-title`

```text
Expedition Retired
```

**Rejected live narration warning**

Text ID: `runtime:live:canon-warning`

```text
Live narration conflicted with the established record; the local account was used.
```

**Live connection log**

Text ID: `runtime:live:connection-failure`

```text
Live DM connection failed ({ERROR}). The local story engine will continue this turn.
```

**Locked course warning**

Text ID: `runtime:choice:locked`

```text
That course is not yet supported: {MISSING REQUIREMENTS}.
```

**Default save status**

Text ID: `runtime:save:stored`

```text
Progress stored
```

**Manual save confirmation**

Text ID: `runtime:save:game-saved`

```text
Game saved
```

**Missing save warning**

Text ID: `runtime:save:no-game`

```text
No saved game
```

**Nothing to undo**

Text ID: `runtime:undo:none`

```text
Nothing to undo
```

**New run confirmation**

Text ID: `runtime:run:new`

```text
New run started
```

**Enable live narration**

Text ID: `runtime:live:toggle-on`

```text
Turn Live DM On
```

**Disable live narration**

Text ID: `runtime:live:toggle-off`

```text
Turn Live DM Off
```

**Intro skip confirmation**

Text ID: `runtime:intro:skip`

```text
Intro will be skipped next load
```

**Initial loading text**

Text ID: `runtime:index:loading`

```text
Loading…
```

**JavaScript required message**

Text ID: `runtime:index:noscript`

```text
Please enable JavaScript to play.
```

## Part VIII — Interface Copy

This appendix captures the static visible labels, prompts, hover labels, and accessibility labels assembled by the main interface. Repeated strings are listed once per copy type. Decorative symbols are retained where they are part of a control.

**Visible text 1**

Text ID: `ui:static:001-the-dwarven-storyweaver`

```text
The Dwarven Storyweaver
```

**Visible text 2**

Text ID: `ui:static:002-brass`

```text
BRASS
```

**Visible text 3**

Text ID: `ui:static:003-reach`

```text
REACH
```

**Visible text 4**

Text ID: `ui:static:004-field-authority`

```text
Field authority
```

**Visible text 5**

Text ID: `ui:static:005-writ`

```text
Writ
```

**Visible text 6**

Text ID: `ui:static:006-end-the-story`

```text
End the Story
```

**Visible text 7**

Text ID: `ui:static:007-settings`

```text
Settings
```

**Visible text 8**

Text ID: `ui:static:008-halls`

```text
Halls
```

**Visible text 9**

Text ID: `ui:static:009-text`

```text
◆
```

**Visible text 10**

Text ID: `ui:static:010-choose-your-course`

```text
Choose Your Course
```

**Visible text 11**

Text ID: `ui:static:011-ready`

```text
Ready
```

**Visible text 12**

Text ID: `ui:static:012-act`

```text
ACT
```

**Visible text 13**

Text ID: `ui:static:013-continue-story`

```text
Continue story
```

**Visible text 14**

Text ID: `ui:static:014-eldan`

```text
Eldan
```

**Visible text 15**

Text ID: `ui:static:015-dwarf`

```text
Dwarf
```

**Visible text 16**

Text ID: `ui:static:016-edit`

```text
Edit
```

**Visible text 17**

Text ID: `ui:static:017-current-objective`

```text
Current Objective
```

**Visible text 18**

Text ID: `ui:static:018-j`

```text
J
```

**Visible text 19**

Text ID: `ui:static:019-open-quest-journal`

```text
Open quest journal
```

**Visible text 20**

Text ID: `ui:static:020-field-kit`

```text
Field Kit
```

**Visible text 21**

Text ID: `ui:static:021-e`

```text
E
```

**Visible text 22**

Text ID: `ui:static:022-open-full-inventory`

```text
Open full inventory
```

**Visible text 23**

Text ID: `ui:static:023-thread-ledger`

```text
Thread Ledger
```

**Visible text 24**

Text ID: `ui:static:024-session`

```text
Session
```

**Visible text 25**

Text ID: `ui:static:025-seed`

```text
Seed
```

**Visible text 26**

Text ID: `ui:static:026-turn`

```text
Turn
```

**Visible text 27**

Text ID: `ui:static:027-stored-locally`

```text
Stored locally
```

**Visible text 28**

Text ID: `ui:static:028-now-playing`

```text
Now Playing:
```

**Visible text 29**

Text ID: `ui:static:029-text`

```text
—
```

**Visible text 30**

Text ID: `ui:static:030-edit-character`

```text
Edit Character
```

**Visible text 31**

Text ID: `ui:static:031-text`

```text
✕
```

**Visible text 32**

Text ID: `ui:static:032-name`

```text
Name
```

**Visible text 33**

Text ID: `ui:static:033-race`

```text
Race
```

**Visible text 34**

Text ID: `ui:static:034-human`

```text
Human
```

**Visible text 35**

Text ID: `ui:static:035-elf`

```text
Elf
```

**Visible text 36**

Text ID: `ui:static:036-gnome`

```text
Gnome
```

**Visible text 37**

Text ID: `ui:static:037-halfling`

```text
Halfling
```

**Visible text 38**

Text ID: `ui:static:038-orc`

```text
Orc
```

**Visible text 39**

Text ID: `ui:static:039-str`

```text
STR
```

**Visible text 40**

Text ID: `ui:static:040-dex`

```text
DEX
```

**Visible text 41**

Text ID: `ui:static:041-int`

```text
INT
```

**Visible text 42**

Text ID: `ui:static:042-cha`

```text
CHA
```

**Visible text 43**

Text ID: `ui:static:043-hp`

```text
HP
```

**Visible text 44**

Text ID: `ui:static:044-gold`

```text
Gold
```

**Visible text 45**

Text ID: `ui:static:045-inventory`

```text
Inventory
```

**Visible text 46**

Text ID: `ui:static:046-add-item`

```text
Add item
```

**Visible text 47**

Text ID: `ui:static:047-auto-generate`

```text
Auto-generate
```

**Visible text 48**

Text ID: `ui:static:048-save`

```text
Save
```

**Visible text 49**

Text ID: `ui:static:049-cancel`

```text
Cancel
```

**Visible text 50**

Text ID: `ui:static:050-brassreach-field-harness`

```text
Brassreach Field Harness
```

**Visible text 51**

Text ID: `ui:static:051-adventurer-s-field-case`

```text
Adventurer's Field Case
```

**Visible text 52**

Text ID: `ui:static:052-equipment-harness`

```text
Equipment Harness
```

**Visible text 53**

Text ID: `ui:static:053-drag-double-click-or-select-an-item-`

```text
Drag, double-click, or select an item and choose a slot
```

**Visible text 54**

Text ID: `ui:static:054-backpack`

```text
Backpack
```

**Visible text 55**

Text ID: `ui:static:055-0-40-slots`

```text
0 / 40 slots
```

**Visible text 56**

Text ID: `ui:static:056-quality`

```text
Quality
```

**Visible text 57**

Text ID: `ui:static:057-all-qualities`

```text
All qualities
```

**Visible text 58**

Text ID: `ui:static:058-common`

```text
Common
```

**Visible text 59**

Text ID: `ui:static:059-fine`

```text
Fine
```

**Visible text 60**

Text ID: `ui:static:060-rare`

```text
Rare
```

**Visible text 61**

Text ID: `ui:static:061-flawless`

```text
Flawless
```

**Visible text 62**

Text ID: `ui:static:062-legendary`

```text
Legendary
```

**Visible text 63**

Text ID: `ui:static:063-relics`

```text
Relics
```

**Visible text 64**

Text ID: `ui:static:064-category`

```text
Category
```

**Visible text 65**

Text ID: `ui:static:065-all-categories`

```text
All categories
```

**Visible text 66**

Text ID: `ui:static:066-order`

```text
Order
```

**Visible text 67**

Text ID: `ui:static:067-pack-order`

```text
Pack order
```

**Visible text 68**

Text ID: `ui:static:068-value`

```text
Value
```

**Visible text 69**

Text ID: `ui:static:069-relic-seal`

```text
Relic seal
```

**Visible text 70**

Text ID: `ui:static:070-equipped-items-stay-in-the-pack-and-`

```text
Equipped items stay in the pack and carry a slot mark. Hover or press Enter to inspect; press Q or double-click to equip or remove.
```

**Visible text 71**

Text ID: `ui:static:071-quest-journal`

```text
Quest Journal
```

**Visible text 72**

Text ID: `ui:static:072-field-exchange`

```text
Field Exchange
```

**Visible text 73**

Text ID: `ui:static:073-merchant`

```text
Merchant
```

**Visible text 74**

Text ID: `ui:static:074-attempt-failed`

```text
Attempt Failed
```

**Visible text 75**

Text ID: `ui:static:075-choose-the-cost`

```text
Choose the Cost
```

**Visible text 76**

Text ID: `ui:static:076-accessibility`

```text
Accessibility
```

**Visible text 77**

Text ID: `ui:static:077-high-contrast-mode`

```text
High-contrast mode
```

**Visible text 78**

Text ID: `ui:static:078-typewriter`

```text
Typewriter
```

**Visible text 79**

Text ID: `ui:static:079-enable`

```text
Enable
```

**Visible text 80**

Text ID: `ui:static:080-chars-sec`

```text
Chars/sec
```

**Visible text 81**

Text ID: `ui:static:081-audio`

```text
Audio
```

**Visible text 82**

Text ID: `ui:static:082-master`

```text
Master
```

**Visible text 83**

Text ID: `ui:static:083-ui`

```text
UI
```

**Visible text 84**

Text ID: `ui:static:084-music`

```text
Music
```

**Visible text 85**

Text ID: `ui:static:085-success-sfx`

```text
Success SFX
```

**Visible text 86**

Text ID: `ui:static:086-fail-sfx`

```text
Fail SFX
```

**Visible text 87**

Text ID: `ui:static:087-story-sfx`

```text
Story SFX
```

**Visible text 88**

Text ID: `ui:static:088-live-dm`

```text
Live DM
```

**Visible text 89**

Text ID: `ui:static:089-live-narration-enriches-written-free`

```text
Live narration enriches written free actions. Campaign decisions and rewards remain authored.
```

**Visible text 90**

Text ID: `ui:static:090-endpoint`

```text
Endpoint
```

**Visible text 91**

Text ID: `ui:static:091-toggle-live-dm`

```text
Toggle Live DM
```

**Visible text 92**

Text ID: `ui:static:092-load`

```text
Load
```

**Visible text 93**

Text ID: `ui:static:093-export`

```text
Export
```

**Visible text 94**

Text ID: `ui:static:094-undo`

```text
Undo
```

**Visible text 95**

Text ID: `ui:static:095-restart-run`

```text
Restart Run
```

**Visible text 96**

Text ID: `ui:static:096-reset-everything`

```text
Reset Everything
```

**Visible text 97**

Text ID: `ui:static:097-threadbearer-field-brief`

```text
Threadbearer Field Brief
```

**Visible text 98**

Text ID: `ui:static:098-epilogue`

```text
Epilogue
```

**Visible text 99**

Text ID: `ui:static:099-new-run`

```text
New Run
```

**Accessibility label 100**

Text ID: `ui:static:100-brassreach`

```text
Brassreach
```

**Accessibility label 101**

Text ID: `ui:static:101-story-controls`

```text
Story controls
```

**Hover label 102**

Text ID: `ui:static:102-field-authority`

```text
Field authority
```

**Accessibility label 103**

Text ID: `ui:static:103-field-authority-progress`

```text
Field authority progress
```

**Accessibility label 104**

Text ID: `ui:static:104-story-transcript`

```text
Story transcript
```

**Accessibility label 105**

Text ID: `ui:static:105-write-your-own-action`

```text
Write your own action
```

**Input prompt 106**

Text ID: `ui:static:106-write-your-own-action-search-the-alc`

```text
Write your own action — search the alcove, read the tablet…
```

**Accessibility label 107**

Text ID: `ui:static:107-owned-items`

```text
Owned items
```

**Input prompt 108**

Text ID: `ui:static:108-add-item`

```text
Add item
```

**Accessibility label 109**

Text ID: `ui:static:109-close-inventory`

```text
Close inventory
```

**Accessibility label 110**

Text ID: `ui:static:110-equipment-harness-and-character-outl`

```text
Equipment harness and character outline
```

**Accessibility label 111**

Text ID: `ui:static:111-equipment-bonuses`

```text
Equipment bonuses
```

**Accessibility label 112**

Text ID: `ui:static:112-backpack`

```text
Backpack
```

**Accessibility label 113**

Text ID: `ui:static:113-item-quality-legend`

```text
Item quality legend
```

**Accessibility label 114**

Text ID: `ui:static:114-backpack-slots`

```text
Backpack slots
```

**Accessibility label 115**

Text ID: `ui:static:115-close-quest-journal`

```text
Close quest journal
```

**Accessibility label 116**

Text ID: `ui:static:116-close-merchant`

```text
Close merchant
```

**Input prompt 117**

Text ID: `ui:static:117-dm-turn`

```text
/dm-turn
```

## Reinstallation checklist

- [ ] Every edited Text ID is still present exactly once.
- [ ] Runtime placeholders in braces remain intact.
- [ ] Intro highlighted terms and hover definitions still match.
- [ ] Choice labels still describe the mechanics and destinations they trigger.
- [ ] Success and failure passages still agree with their recorded effects.
- [ ] Item-acquisition prose names the item actually awarded.
- [ ] Branch arrivals agree with the preceding success, failure, or advance choice.
- [ ] Character names and voices are consistent across scenes.
- [ ] The public learns the name “Unfathomer” only after Lithen introduces it.
- [ ] The three Keys, Measures, Gate, Founding Covenant, and final choices remain consistent with the Master Lore Bible.
- [ ] The installed JavaScript passes syntax tests after escaping apostrophes, backticks, and interpolation markers.
- [ ] A complete playthrough verifies all reachable branches and endings.

---

Workbook inventory: 36 scenes, 85 choices, 5 endings, 28 catalog items, 19 global glossary entries, and 1074 editable text blocks.

