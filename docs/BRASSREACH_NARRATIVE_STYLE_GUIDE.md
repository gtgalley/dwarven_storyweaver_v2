# Brassreach Narrative Style Guide

This guide governs authored campaign prose, interface copy, item text, and any live narration returned by a configured endpoint. The Master Lore Bible remains the authority on canon. This document defines how that canon reaches the player.

## Core standard

Every passage must make five facts easy to identify on one reading:

1. Who acts.
2. What they do.
3. What physically happens.
4. Why the action matters now.
5. What remains uncertain.

Write concrete nouns and active verbs. A sentence may be regal or vivid, but never at the cost of its literal meaning. Do not make gates, instruments, records, or civic systems think, judge, remember, agree, refuse, or speak unless the text immediately identifies the physical behavior being described.

Use present tense for the scene in front of the player. Use past tense for history only when a character, inscription, document, or visible record supplies it. Do not give the player historical facts through an unexplained omniscient narrator.

Clarity does not require minimalism. Brassreach should feel inhabited: gears turn behind walls, people interrupt one another under pressure, light reveals scale, and old materials carry visible histories. Use meaningful detail generously when it establishes place, clarifies danger, reveals character, demonstrates craft, or gives an outcome emotional weight.

## Authorial voice

The target voice is confident, atmospheric high fantasy written for immediate comprehension. A substantial beat should usually form a small dramatic arc:

1. Establish a strong physical impression.
2. Introduce motion, sound, light, labor, or danger.
3. Focus upon the immediate problem.
4. Let a person, discovery, or environmental response deepen the moment.
5. End with a choice, warning, revelation, or emotional turn.

Longer passages are welcome when every paragraph adds action, atmosphere, character, or understanding. Do not compress wonder into a report, and do not lengthen routine travel with decorative repetition. Paragraph breaks should mark a new action, speaker, revelation, danger, or moment of silence.

Emotion should arise from events. Show fear through narrowing routes, unstable footing, broken machinery, and urgent voices; show wonder through scale, ritual, light, and the careful discovery of old records; show relief through survivor counts, released breath, and changed behavior after danger passes. Name an emotion only when the physical scene has already earned it.

## Scene structure

A scene may use several paragraphs when each paragraph earns its place. Prefer this order:

- Establish the place and immediate pressure.
- Show a person doing or saying something that reveals the problem.
- Present the evidence the player can inspect now.
- End on the decision, danger, or unanswered question.

Do not append unrelated lore merely because the scene is an opportunity to teach it. Reveal history when it changes the player’s understanding of the current action. It is acceptable for a route to end without revealing every available fact.

## Dialogue and character voice

Dialogue should perform work: deliver an order, expose a disagreement, identify evidence, admit uncertainty, or force a decision.

- **Captain Brunna:** experienced, perceptive, encouraging, and authoritative. She may show warmth toward a promising graduate, but danger makes her concise.
- **Quartermaster Dorrin:** dry, economical, and focused on preparation, ownership, and public purpose.
- **Lithen the Wise:** formal and learned, but exact. She identifies her sources and says plainly what she cannot verify herself.
- **Commander Orra Vale:** urgent, disciplined, brave, and protective. She speaks in terms of people, loads, routes, and duties before symbols.
- **Piera:** quick, observant, locally informed, and skeptical of official maps that omit lived conditions.
- **Sella Flintwake:** practical salvage language with enough former Choir training to explain tone, timing, and material failure.
- **Officials such as Halvek:** procedural and cautious. Their language should reveal how responsibility is divided without turning them into theatrical villains.

Keep speaker attribution clear. Distinctive voices should come from priorities and sentence rhythm, not hard-to-read dialect spelling.

## Evidence and uncertainty

The player learns the Unfathomer’s nature through observed effects, records, and qualified expert interpretation. Before Lithen coins the name, do not use it in narration or ordinary public dialogue.

The Unfathomer does not use complex speech. Show it through simultaneous pressure, temperature, water movement, resonance, and matching readings across distant instruments. Characters may interpret those effects, but must identify inference as inference.

Unreliable narration does not justify unclear prose. State exactly what a witness claims, what conflicts with it, and why the player cannot yet settle the question.

## Choices and transitions

Choice labels begin with a direct verb and describe one coherent action. Integrate preparation into the action:

- Good: “Take the tools and help the crew repair the floodgate.”
- Avoid: “Take the tools. Help repair the floodgate.”

The success and failure result must state the physical outcome before its larger meaning. Failure moves the story forward, changes the route, and records a consequence.

A developed check result should show the attempt beginning, the relevant resistance, the practical effect of preparation or ability, the immediate resolution, and another person's or the environment's reaction. Do not repeat the choice label as the opening sentence.

When several choices reach one scene, use a short arrival passage keyed to the prior choice. Name the altered route, person, injury, repair, or evidence. The following scene should feel like a continuation of the player’s route, not a reset to a generic script.

## RPG information

Never display a bonus for an item the player does not own. Use source labels consistently:

- `Owned: Item` means the item is in the backpack and can be used for the task.
- `Equipped: Item` means the item is in its compatible equipment slot.
- Ratings, alliances, evidence, testimony, repairs, reputation, and flags name their own source.

Narrative preparation and system state must agree. If a story grants, buys, sells, equips, loses, or spends something, name the exact item or amount in the sentence and show the resulting system change separately.

Merchant results use these forms:

- “You bought the [item] from [merchant] for [amount] gold.”
- “You sold the [item] to [merchant] for [amount] gold.”

Health loss names the injury. Attribute, gold, item, evidence, testimony, repair, alliance, and reputation changes appear in a compact consequence summary after the prose.

## Editing checklist

- Can a reader point to the actor and verb in every sentence?
- Does each metaphor retain a literal physical meaning?
- Is historical information attributed to an in-world source?
- Does dialogue reflect the speaker’s profession and knowledge?
- Does every choice say what the player will actually do?
- Does every result say what changed?
- Does the transition acknowledge the prior route when it matters?
- Are all bonuses backed by current state?
- Are exact names and amounts used for items, health, and gold?
- Can any sentence or paragraph be removed without losing useful meaning?

## Applied references

The implementation follows several proven interactive-fiction principles: short and observable choice branches, dialogue shaped by urgency, visible state changes, route-specific callbacks, and choice wording that flows cleanly into its result. Research notes and source links are recorded in the Overhaul #6 pull request.
