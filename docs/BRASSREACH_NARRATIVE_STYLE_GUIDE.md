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

## Scene structure

A scene may use several paragraphs when each paragraph earns its place. Prefer this order:

- Establish the place and immediate pressure.
- Show a person doing or saying something that reveals the problem.
- Present the evidence the player can inspect now.
- End on the decision, danger, or unanswered question.

Do not append unrelated lore merely because the scene is an opportunity to teach it. Reveal history when it changes the player’s understanding of the current action. It is acceptable for a route to end without revealing every available fact.

## Dialogue and character voice

Dialogue should perform work: deliver an order, expose a disagreement, identify evidence, admit uncertainty, or force a decision.

- **Captain Brunna:** short sentences, practical orders, named risks, little ornament. She distinguishes fact from rumor.
- **Quartermaster Dorrin:** dry, economical, and focused on preparation, ownership, and public purpose.
- **Lithen the Wise:** formal and learned, but exact. She identifies her sources and says plainly what she cannot verify herself.
- **Orra Mullinen:** disciplined and protective. She speaks in terms of people, loads, routes, and duties before symbols.
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
