// Brassreach authored campaign
// v5 — canonical story graph derived from BRASSREACH_MASTER_LORE_BIBLE.md.

export const CAMPAIGN_VERSION = 2;

export const CAMPAIGN_CHAPTERS = {
  tutorial:{act:'Act I',label:'The First Thread'},
  halls:{act:'Act II',label:'A Writ Below'},
  archives:{act:'Act III',label:'The First Register'},
  depths:{act:'Act IV',label:'The Weight of Brassreach'},
  brassworks:{act:'Act V',label:'The Broken Song'},
  gate:{act:'Act VI',label:'The Gate of Measures'},
  choice:{act:'Act VII',label:'The Living Choice'}
};

const check=(id,label,stat,dc,success,failure,next,effects={},extra={})=>({
  id,type:'check',label,sentence:label,stat,dc,success,failure,
  nextSuccess:extra.nextSuccess||next,nextFail:extra.nextFail||next,
  effects,bonuses:extra.bonuses||[],encounter:extra.encounter||id
});
const advance=(id,label,next,outcome,effects={})=>({id,type:'advance',label,sentence:label,next,outcome,effects});
const merchant=(id,label,merchantId)=>({id,type:'merchant',label,sentence:label,merchant:merchantId});

export const CAMPAIGN_SCENES = {
  'tutorial-commission':{
    id:'tutorial-commission',chapter:'tutorial',title:'The Public Bell',
    objective:'Accept Captain Brunna’s probationary commission.',
    story:`Morning rain darkens the upper terraces of Brassreach. Below the Public Bell, Captain Brunna waits beside a slate table crowded with repair petitions. She commands the Civic Watch detail that escorts Threadbearers through public works. A Threadbearer is not a wandering hero: the office investigates a failure, hears the people affected by it, tests the physical evidence, and enters a tamper-evident account in the Thread Ledger. The record does not make law by itself, but councillors cannot lawfully ignore the chain of responsibility it proves. Three failures have reached Brunna’s desk—a cracked bell-stair, water under homes in the Tangles, and frightened animals driven into a market passage. Each report carries the same low vibration, though the sites share no pipe or support wall. Brunna offers you a probationary writ and one plain instruction: observe before you conclude.`,
    enter:{authority:'Probationary Threadbearer',writ:'probationary',item:{name:'Thread Ledger',reason:'Captain Brunna locks a blank brass-leaf ledger into your field case. Its pages will show any later alteration.'},milestone:'Accepted a probationary Threadbearer commission.'},
    choices:[
      advance('tutorial-accept','Take the writ and ask where the first report began.','tutorial-quartermaster','Brunna marks the bell-stair in red chalk. “Start with stone you can see. Then follow what the stone tells you.”',{reputation:{accuracy:1}}),
      advance('tutorial-question','Ask what makes these failures one investigation.','tutorial-quartermaster','Brunna admits that no official map connects them. Their shared vibration is the only common fact, which is precisely why she needs a careful witness.',{reputation:{accuracy:1},evidence:'Three unrelated failures share one low overtone.'}),
      advance('tutorial-people','Ask who is in danger before discussing the masonry.','tutorial-quartermaster','Brunna names two stair-keepers, six Tangles households, and a porter injured by a salt-hound. She adds their names to your route.',{reputation:{compassion:1},testimony:'Captain Brunna identified the workers and residents behind the repair petitions.'})
    ]
  },

  'tutorial-quartermaster':{
    id:'tutorial-quartermaster',chapter:'tutorial',title:'Dorrin’s Issue Desk',
    objective:'Equip for a civic inspection, then leave for the bell-stair.',
    story:`Quartermaster Dorrin keeps the Watch stores behind an iron counter polished by generations of impatient hands. He checks your writ, looks at your boots, and gives the boots more consideration. “A record is useful only if the recorder comes back with it.” He has basic field gear for sale, but the city issue is simpler: surveyor’s chalk, a hood that leaves the ears clear, and a route token that opens staffed service doors. Every object is entered beside the public reason for its issue.`,
    enter:{item:{name:'Surveyor’s Chalk',reason:'Dorrin issues it so you can mark tested masonry and a safe return route.'},discovery:'Watch equipment is logged against a public purpose, not granted as a private favor.'},
    choices:[
      merchant('tutorial-dorrin-shop','Inspect Dorrin’s field stock.','dorrin'),
      advance('tutorial-dorrin-ready','Fasten the ledger and depart for the bell-stair.','tutorial-bell-stair','Dorrin stamps your route token and points toward the rain-dark stair. “Bring back causes, not rumors.”',{item:{name:'Surveyor Hood',reason:'Dorrin lends you a listening hood because the first failure may have to be heard as well as seen.'}})
    ]
  },

  'tutorial-bell-stair':{
    id:'tutorial-bell-stair',chapter:'tutorial',title:'The Cracked Bell-Stair',
    objective:'Secure the stair and determine why its lower landing failed.',
    story:`The bell-stair joins a crowded terrace to the civic Halls. A lower tread has split from wall to rail, leaving two stair-keepers stranded above a service arch. Rainwater alone did not cause it. Each time the noon bell settles, a second vibration arrives from below—too low to hear clearly, but strong enough to stir grit along the crack. The original foundation is sound. A newer drain collar, installed with cheaper iron, has pulled the landing out of balance.`,
    choices:[
      check('stair-brace','Brace the landing while the stair-keepers cross. (STR)','STR',10,'You shoulder the temporary beam into place. Both keepers cross, and one shows you where the low vibration makes a cup of rainwater tremble.','The brace slips before you seat it. The keepers retreat safely, but falling stone bruises your shoulder and closes the direct stair.', 'tutorial-tangles',{success:{repair:'Bell-stair landing braced for evacuation.',reputation:{courage:1},testimony:'The stair-keepers confirmed the vibration begins after each bell stroke.'},failure:{hp:-1,consequence:'The bell-stair remains closed pending a full repair.',reputation:{accuracy:1}}},{bonuses:[{item:'Rope Coil',bonus:2,label:'secured rope'},{derived:'power',threshold:4,bonus:1,label:'equipment power'}]}),
      check('stair-collar','Release the warped drain collar in the correct sequence. (INT)','INT',11,'You chalk the load path, loosen the collar one quarter-turn at a time, and let the old stone settle. The dangerous strain eases without breaking the drain.','The final catch binds. You stop before the collar shears, but the landing must be closed and the water diverted through the Tangles.', 'tutorial-tangles',{success:{repair:'Warped bell-stair drain collar safely released.',evidence:'A modern iron collar distorted an older balanced foundation.',reputation:{accuracy:2}},failure:{consequence:'Runoff was diverted toward the Tangles after the bell-stair collar could not be released.',hp:-1}},{bonuses:[{item:'Surveyor’s Chalk',bonus:2,label:'marked load path'},{item:'Lockpin',bonus:1,label:'fine catch tool'}]}),
      check('stair-listen','Time the lower vibration against the bell’s fading note. (DEX)','DEX',10,'You keep perfectly still through three bell strokes. The second pulse is not an echo: it arrives late from beneath the service arch and travels against the visible pipework.','Foot traffic shakes the landing before you complete the comparison. You record the delay but cannot prove its direction here.', 'tutorial-tangles',{success:{evidence:'The low overtone travels upward against the mapped pipework.',reputation:{accuracy:2}},failure:{evidence:'The low vibration arrives after the public bell, but its direction remains uncertain.'}},{bonuses:[{item:'Surveyor Hood',bonus:2,label:'listening plates'}]})
    ]
  },

  'tutorial-tangles':{
    id:'tutorial-tangles',chapter:'tutorial',title:'Almost-True Maps',
    objective:'Compare the official route with conditions in the Tangles.',
    story:`The diverted water leads into the Tangles, where ropewalks, wire presses, homes, and workshops share every dry ledge. The official plan shows a clear inspection lane. A dye-house now occupies half of it, and an improvised footbridge crosses the rest. Piera, a quick-eyed map trader, has drawn the district on stitched scraps of delivery paper. She calls them “almost-true maps”: each begins with a fact, a shortcut, or a lie someone found useful. Her newest map marks damp walls that the city plan calls dry.`,
    choices:[
      check('piera-compare','Compare Piera’s map against your ledger and the drain flow. (INT)','INT',10,'Two of Piera’s marks are guesses, but the third follows the same delayed vibration you found at the stair. An omitted maintenance throat links the sites.','The patched map is difficult to align with the civic grid. Piera points out your error before it enters the ledger, and you record her correction openly.', 'tutorial-salt-hounds',{success:{evidence:'An omitted maintenance throat links the bell-stair runoff to the Tangles.',alliance:{piera:1},flags:{pieraRoute:true},item:{name:'Piera’s Route Map',reason:'Piera gives you the corrected sheet because official plans no longer show the lived route.'},reputation:{accuracy:2}},failure:{testimony:'Piera corrected a false alignment before it entered the Thread Ledger.',alliance:{piera:1},reputation:{humility:1}}},{bonuses:[{item:'Surveyor’s Chalk',bonus:1,label:'survey marks'}]}),
      check('piera-residents','Hear the flooded households before testing Piera’s route. (CHA)','CHA',10,'Residents describe water arriving in pulses, not as a steady leak. Their times match the bell-stair vibration and identify a blocked relief grate beneath the market.','Several accounts conflict over dates, but every household describes the same pulsing rise. You preserve the disagreement instead of forcing a clean answer.', 'tutorial-salt-hounds',{success:{testimony:'Tangles households reported pulsing water and a blocked market relief grate.',alliance:{worksfolk:1},reputation:{compassion:2}},failure:{testimony:'Tangles testimony conflicts on timing but agrees that the flooding rises in pulses.',reputation:{accuracy:1}}},{bonuses:[{alliance:'piera',bonus:1,label:'Piera’s introductions'}]}),
      check('piera-shortcut','Follow Piera across the wire-press roofs to inspect the omitted throat. (DEX)','DEX',11,'The rooftop route brings you above the sealed maintenance throat. From there, you see wet animal tracks leading from its broken grate.','A loose sheet of brass drops under your boot. You catch the rail, but the noise scatters whatever moved below and costs time.', 'tutorial-salt-hounds',{success:{discovery:'Salt-hound tracks emerge from the omitted maintenance throat.',alliance:{piera:1},reputation:{courage:1}},failure:{hp:-1,consequence:'Noise on the rooftop route drove the displaced animals toward the market.'}},{bonuses:[{item:'Rope Coil',bonus:2,label:'roof line'}]})
    ]
  },

  'tutorial-salt-hounds':{
    id:'tutorial-salt-hounds',chapter:'tutorial',title:'The Market Pack',
    objective:'Clear the displaced salt-hounds without harming the market crowd.',
    story:`Four salt-hounds crouch beneath the market’s lifting gears. Their mineral-crusted coats are wet, and the smallest has a cut paw. They are not hunting people. Repeated flood pulses drove them out of a warm drainage den; hammering shutters now keep them frightened and cornered. A porter lies behind an overturned cart while the largest hound guards the only dry exit.`,
    choices:[
      check('hounds-lure','Open a quiet route and lure the pack toward an unused culvert. (CHA)','CHA',11,'You lower your voice, move the crowd back, and leave water along the open route. The pack follows the largest hound into the empty culvert without a charge.','A dropped pan startles the largest hound. You still clear the crowd, but the pack bolts through a spice stall and one animal is injured.', 'tutorial-floodgate',{success:{repair:'A safe animal route was opened from the market to an unused culvert.',reputation:{compassion:2},item:{name:'Salt-Hound Whistle',reason:'The porter gives you the low whistle animal handlers use near the drainage dens.'}},failure:{consequence:'The pack escaped through the market; one salt-hound was injured.',hp:-1}},{bonuses:[{testimony:'Tangles households reported pulsing water and a blocked market relief grate.',bonus:1,label:'resident guidance'},{item:'Canteen',bonus:1,label:'clean water'}]}),
      check('hounds-cart','Lift the cart long enough for the porter to crawl free. (STR)','STR',11,'You raise the axle while the porter rolls clear. With the immediate threat gone, handlers open the far shutter and guide the pack away.','The wet axle twists in your grip. The porter escapes, but the cart falls hard and the hounds scatter through the market.', 'tutorial-floodgate',{success:{reputation:{courage:2},testimony:'The rescued porter saw water burst from the blocked relief grate before the pack arrived.'},failure:{hp:-2,consequence:'The market pack scattered before handlers could guide it.'}},{bonuses:[{derived:'power',threshold:5,bonus:1,label:'equipment power'},{item:'Foundry Gloves',bonus:2,label:'secure grip'}]}),
      check('hounds-gears','Stop the lifting gears and use their low idle tone to calm the pack. (INT)','INT',12,'You disengage the striking cam but leave the flywheel turning. Its steady low tone masks the painful pulses below, and the hounds allow handlers to approach.','You stop the wrong axle. The market shutters slam closed, forcing an evacuation before the pack can be moved.', 'tutorial-floodgate',{success:{evidence:'A stable mechanical tone calmed animals distressed by the underground pulse.',repair:'Market lifting gears retuned to a quieter idle.',reputation:{accuracy:2}},failure:{consequence:'The market closed for emergency evacuation after its lifting gear locked.'}},{bonuses:[{item:'Oil Flask',bonus:1,label:'freed clutch'},{item:'Lockpin',bonus:1,label:'cam release'}]})
    ]
  },

  'tutorial-floodgate':{
    id:'tutorial-floodgate',chapter:'tutorial',title:'The Buried Relief Gate',
    objective:'Restore the relief gate beneath the Tangles market.',
    story:`Behind the animals’ abandoned den, the omitted maintenance throat ends at a relief gate buried under silt and household debris. Its stone frame predates the iron collar at the bell-stair. The mechanism is worn but not broken. It failed because no office claimed the route: the Halls mapped the upper drain, the Tangles maintained the market grate, and the Works budget ended one wall short of both. Water rises against the gate in measured pulses.`,
    choices:[
      check('relief-clear','Clear the silt while residents form a bucket line. (STR)','STR',11,'The line moves mud, broken tile, and years of neglect. When the gate opens, water falls by a handspan through the market and stair foundations.','The gate opens only halfway before the next pulse. The immediate pressure drops, but the channel will need a crew before nightfall.', 'tutorial-report',{success:{repair:'Tangles relief gate fully reopened with resident help.',alliance:{worksfolk:2},reputation:{courage:1,compassion:1}},failure:{repair:'Tangles relief gate opened halfway, buying several hours.',consequence:'A Works crew must clear the remaining silt before nightfall.'}},{bonuses:[{item:'Rope Coil',bonus:1,label:'haul line'},{alliance:'worksfolk',bonus:1,label:'resident bucket line'}]}),
      check('relief-balance','Reset the old counterweight before opening the gate. (INT)','INT',12,'You follow the founder marks instead of the newer iron labels. The counterweight settles, the gate lifts evenly, and the low overtone weakens across the chamber.','The modern repair marks conceal one original notch. You avoid a collapse, but the gate can only be chained open at a narrow setting.', 'tutorial-report',{success:{repair:'Founder-era relief counterweight restored to balance.',evidence:'Restoring an older balanced mechanism weakened the shared overtone.',reputation:{accuracy:2}},failure:{repair:'Relief gate chained at a narrow emergency opening.',item:{name:'Mender’s Clamp',reason:'A resident lends you a clamp to hold the emergency opening until a Works crew arrives.'}}},{bonuses:[{item:'Surveyor’s Chalk',bonus:1,label:'founder marks'},{flag:'pieraRoute',bonus:1,label:'omitted route'}]}),
      check('relief-coordinate','Assign the opening sequence among residents, Watch, and drain workers. (CHA)','CHA',11,'Each group takes one task and hears why the others matter. The gate opens under shared control, and the first repair crew arrives before the crowd disperses.','Old disputes slow the work. The gate is made safe, but each office records the repair as someone else’s temporary duty.', 'tutorial-report',{success:{repair:'Relief gate reopened under a shared maintenance plan.',alliance:{wardens:1,worksfolk:2},reputation:{compassion:1},testimony:'Residents, Watch, and drain workers agreed to a shared account of the failure.'},failure:{repair:'Relief gate made safe under a temporary order.',consequence:'The offices still dispute permanent responsibility.'}},{bonuses:[{alliance:'piera',bonus:1,label:'local trust'},{reputation:'compassion',threshold:2,bonus:1,label:'public trust'}]})
    ]
  },

  'tutorial-report':{
    id:'tutorial-report',chapter:'tutorial',title:'The Joined Account',
    objective:'Present a precise account without claiming more than the evidence proves.',
    story:`Back beneath the Public Bell, Brunna reads while water dries on your boots. Your ledger now connects a cheap collar, an omitted route, displaced animals, and a relief gate abandoned between offices. The low overtone appears at every site, but you still do not know its source. Brunna asks for one sentence the Council can act upon today and one question the next expedition must answer.`,
    choices:[
      check('report-precise','Name the maintenance chain and keep the unknown source marked as unknown. (INT)','INT',10,'Your account assigns immediate repairs without inventing a culprit. Brunna seals it into the Thread Ledger as a model of accurate field work.','Your first wording implies a single mechanical source. Brunna makes you correct it in view of the clerks, preserving both the error and the revision.', 'halls-deep-writ',{success:{evidence:'The joined account proves connected neglect without claiming a known source.',reputation:{accuracy:2},milestone:'Completed the first joined Threadbearer account.'},failure:{reputation:{humility:1},consequence:'The public record preserves an overstatement and its correction.'}},{bonuses:[{item:'Thread Ledger',bonus:2,label:'field record'},{reputation:'accuracy',threshold:4,bonus:1,label:'careful record'}]}),
      check('report-people','Lead with the people endangered by the gaps between offices. (CHA)','CHA',11,'Your testimony makes the administrative boundary impossible to treat as an abstraction. Brunna orders the Works and Watch to share responsibility while the deeper cause is investigated.','The clerks challenge two details, but the named residents stand by the common sequence of events. The report survives with narrower language.', 'halls-deep-writ',{success:{alliance:{worksfolk:2,wardens:1},reputation:{compassion:2},milestone:'Placed affected residents and workers into the public account.'},failure:{testimony:'Named residents upheld the sequence after clerks challenged the report.',reputation:{accuracy:1}}},{bonuses:[{alliance:'worksfolk',bonus:1,label:'worker testimony'},{reputation:'compassion',threshold:3,bonus:1,label:'public standing'}]})
    ]
  },

  'halls-deep-writ':{
    id:'halls-deep-writ',chapter:'halls',title:'The Deep Writ',
    objective:'Accept authority to follow the shared overtone below the civic Halls.',
    story:`Brunna returns your ledger with a second seal fixed beside the first. The Deep Writ authorizes a Threadbearer to enter restricted public works, compel the production of maintenance records, and carry witnessed findings between institutions. It does not grant command over workers or private homes. “You found a true connection and left the unknown honest,” Brunna says. “That is why you may follow it.” The overtone now appears in three older Halls reports, each redirected to a different office and closed without comparison. One points toward a sealed map room.`,
    enter:{authority:'Threadbearer under Deep Writ',writ:'deep',item:{name:'Deep Writ Seal',reason:'Brunna fixes the seal to your ledger as proof of lawful access below the Halls.'},milestone:'Earned a Deep Writ.',flags:{deepWrit:true}},
    choices:[
      advance('deep-writ-maps','Enter the sealed map room with Brunna’s order.','halls-omitted-route','The map-room keeper breaks an old wax strip and admits no Threadbearer has requested these plans in twenty-three years.',{reputation:{accuracy:1}}),
      advance('deep-writ-workers','Ask a drain crew to witness the map-room inspection.','halls-omitted-route','Two drain workers come with you. Their working memory will test whether the official plans describe any route that still exists.',{alliance:{worksfolk:1},testimony:'Drain workers witnessed the Deep Writ inspection.'})
    ]
  },

  'halls-omitted-route':{
    id:'halls-omitted-route',chapter:'halls',title:'The Map That Ends Early',
    objective:'Trace why modern civic plans omit the route below the Tangles.',
    story:`The sealed plan shows the maintenance throat clearly—then stops at a neat ink border marked “outside funded jurisdiction.” An older vellum beneath it continues through Archives foundations and into the first cistern galleries. Someone did not erase the route; generations of offices copied smaller maps until the connection disappeared from ordinary use. A column of repair denials bears the countersign of the Works Comptroller’s office.`,
    choices:[
      check('map-layers','Align the maps by founder benchmarks rather than modern property lines. (INT)','INT',11,'The layers meet. The same buried route passes under the Archives and descends toward an abandoned pressure stair.','A shifted terrace number creates a false junction. The drain workers catch it and provide the modern work-name for the pressure stair.', 'halls-comptroller',{success:{evidence:'Successive civic maps cropped one continuous maintenance route at office boundaries.',reputation:{accuracy:2},flags:{archiveRoute:true}},failure:{testimony:'Drain workers identified the pressure stair omitted by modern terrace numbers.',alliance:{worksfolk:1},reputation:{humility:1}}},{bonuses:[{item:'Piera’s Route Map',bonus:2,label:'lived route'},{item:'Surveyor’s Chalk',bonus:1,label:'founder benchmarks'}]}),
      advance('map-workers-route','Follow the drain workers’ name for the route instead of the Comptroller’s filing chain.','archives-entry','The crew leads you through a staffed pump room to an Archives foundation door. You postpone the office confrontation but record every denied repair attached to the route.',{evidence:'Repeated repair denials left the Archives pressure stair unmaintained.',alliance:{worksfolk:2},route:'worker route'})
    ]
  },

  'halls-comptroller':{
    id:'halls-comptroller',chapter:'halls',title:'A Responsible Delay',
    objective:'Obtain the denied repair files from the Works Comptroller.',
    story:`Comptroller Halvek receives you in a dry office above the wet Halls. He does not deny the signatures. Each refusal, he explains, followed the budget and jurisdiction then in force. His language turns danger into orderly delay: another survey, another ownership ruling, another winter allocation. Your Deep Writ compels the files, but it cannot compel candor. On his desk, a fresh request from the Archives pressure stair waits beneath a stack of ornamental foundry contracts.`,
    choices:[
      check('comptroller-chain','Read the denial chain aloud and ask where responsibility finally rests. (CHA)','CHA',12,'Halvek cannot name an office that owns the whole route. He releases the files and authorizes an emergency crew rather than let the silence enter the ledger beside his name.','Halvek releases only what the Writ requires. The record still shows how every lawful refusal produced an unlawful whole.', 'archives-entry',{success:{evidence:'The Comptroller admitted no office accepts responsibility for the continuous route.',repair:'Emergency crew assigned to the Archives pressure stair.',alliance:{wardens:1},reputation:{courage:1}},failure:{evidence:'Every repair refusal was procedurally lawful, but together they abandoned a public system.',consequence:'The Comptroller withheld discretionary repair funds.'}},{bonuses:[{evidence:'Successive civic maps cropped one continuous maintenance route at office boundaries.',bonus:1,label:'map chain'},{item:'Thread Ledger',bonus:1,label:'tamper-evident record'}]}),
      check('comptroller-request','Use the fresh Archives request to prove the danger is current. (INT)','INT',11,'The request carries the same overtone notation as the bell-stair. Halvek releases the full maintenance series and a route token before the comparison becomes public without him.','The notation is buried in an obsolete code. You cannot prove the match here, but the request gives you lawful entry to the Archives foundation.', 'archives-entry',{success:{evidence:'The Archives pressure stair reports the same low overtone.',flags:{fullRepairFiles:true},reputation:{accuracy:2}},failure:{discovery:'A current Archives repair request uses an obsolete vibration code.',route:'archive request'}})
    ]
  },

  'archives-entry':{
    id:'archives-entry',chapter:'archives',title:'The Foundation Door',
    objective:'Bring the joined account to Lithen in the deep Archives.',
    story:`The foundation door opens onto the Archives’ working levels, not its public reading hall. Restorers dry flood-stained records beside warm pipes. Indexers carry law tablets through galleries where every footstep returns twice. Lithen the Wise, chief bookkeeper and librarian, has already pulled the three old Halls reports. She is aged, sharp-eyed, and impatient only with careless certainty. “Your route passes through records older than the offices that divided it,” she says. “Before we name anything, we will learn what repeats.”`,
    enter:{alliance:{lithen:1},milestone:'Brought the joined account to Lithen the Wise.'},
    choices:[
      advance('archives-follow','Follow Lithen to the resonant record well.','archives-record-well','She carries no weapon—only a lamp, a tuning weight, and your ledger copied onto a clean brass leaf.'),
      advance('archives-ask-record','Ask why the Archives foundation belongs in a water investigation.','archives-record-well','Lithen explains that early laws, maintenance patterns, and civic calibrations were stored together because the founders did not separate public duty from the works that sustained it.',{discovery:'Founder-era records join civic decisions to physical maintenance patterns.'})
    ]
  },

  'archives-record-well':{
    id:'archives-record-well',chapter:'archives',title:'The Resonant Record Well',
    objective:'Compare the overtone against preserved maintenance and civic records.',
    story:`The record well is a cylindrical chamber lined with thin brass leaves. A note struck at its rim travels through dated layers of metal and returns altered by every repair recorded there. Lithen sets your observations beside entries from the bell-stair, the Tangles, and old cistern surveys. The low overtone does not point to one broken machine. It appears wherever neglected systems interfere with one another. More troubling, its oldest traces predate the modern failures by centuries.`,
    choices:[
      check('well-pattern','Separate the old stable return from the modern interference. (INT)','INT',13,'You identify a calm foundational pattern beneath the harsh overtone. The modern city is not producing a new sound so much as drowning an older relationship in conflicting repairs.','The layers blur until Lithen slows the return with a tuning weight. You cannot isolate the original pattern alone, but your failed comparison proves the disturbance is distributed across many systems.', 'archives-lithen',{success:{evidence:'A calm founder-era pattern persists beneath modern mechanical interference.',reputation:{accuracy:2},alliance:{lithen:1}},failure:{evidence:'The disturbance is distributed across multiple civic systems rather than one machine.',reputation:{humility:1}}},{bonuses:[{item:'Surveyor Hood',bonus:1,label:'listening plates'},{item:'Thread Ledger',bonus:1,label:'joined observations'},{flag:'fullRepairFiles',bonus:1,label:'complete repair series'}]}),
      check('well-testimony','Match worker descriptions to the dated returns. (CHA)','CHA',12,'The phrases workers used—pressure behind the teeth, water listening in the wall, a second pulse—align with distinct periods of neglected maintenance. Their practical language preserves data the official codes discarded.','Some testimony cannot be dated. Lithen keeps it in the record as lived evidence without forcing it into the wrong year.', 'archives-lithen',{success:{testimony:'Worker descriptions preserve changes omitted by official vibration codes.',alliance:{worksfolk:1,lithen:1},reputation:{compassion:1}},failure:{testimony:'Undated worker accounts remain useful evidence when clearly marked as undated.',reputation:{accuracy:1}}},{bonuses:[{alliance:'worksfolk',bonus:2,label:'worker trust'},{reputation:'compassion',threshold:3,bonus:1,label:'careful hearing'}]})
    ]
  },

  'archives-lithen':{
    id:'archives-lithen',chapter:'archives',title:'Lithen’s Name for the Deep',
    objective:'Understand Lithen’s theory without mistaking it for complete knowledge.',
    story:`Only after the comparisons are complete does Lithen offer a name. She calls the distributed presence the Unfathomer—not because it is a monster hidden in one cavern, but because no map can contain its full extent. Centuries of founder craft joined stone, water, brass, and living intention into harmonies precise enough to shape the natural world. Those harmonies accumulated a continuous, emergent life the founders never recognized. It rested within the city’s older concord. As Brassreach divided stewardship, deferred repairs, and accepted manufactured inequality, the deep network became painfully discordant. The Unfathomer now spreads upward with the rising water, searching without language for the stable conditions in which it first came into being. It is dangerous, but danger is not proof of malice. Lithen marks every part of this account as theory supported by evidence—not revealed truth.`,
    enter:{flags:{unfathomerNamed:true,keysKnown:true},discovery:'Lithen named the distributed living resonance the Unfathomer.',milestone:'Learned Lithen’s evidence-based theory of the Unfathomer.'},
    choices:[
      advance('lithen-origin','Ask what evidence could test the theory.','archives-first-register','Lithen names the First Register: the earliest surviving joined record of law, water, load, and tone. If its pattern matches the record well, her theory gains a foundation.',{reputation:{accuracy:1}}),
      advance('lithen-danger','Ask how a non-malicious presence can still be stopped.','archives-first-register','“By changing what reaches it,” Lithen replies. “Or by separating it from us. Neither choice is simple, and neither can begin with pretending it understands a speech.”',{discovery:'The Unfathomer may perceive sustained pattern and intention, but it cannot negotiate in complex speech.'}),
      advance('lithen-city','Ask why the city’s social failures matter to physical resonance.','archives-first-register','Lithen explains that repeated law directs labor, repair, access, and neglect. Across generations those choices become physical pattern. In Brassreach, civic precedent and resonant structure have never been cleanly separate.',{evidence:'Generations of civic decisions became physical patterns through labor, repair, and neglect.'})
    ]
  },

  'archives-first-register':{
    id:'archives-first-register',chapter:'archives',title:'The First Register',
    objective:'Recover a readable account from the city’s earliest constitutional record.',
    story:`The First Register was never stolen. It lies where the Archives placed it: in a restoration cradle behind flood glass, too fragile for ordinary use. Its stone-backed leaves record the Founding Covenant as a civic constitution—shared stewardship, public access to essential works, distributed custody of citywide instruments, and a duty to record consequences. Beside the law are calibration notes for Weight, Tone, and Pattern. Later copies kept the ceremonial language but dropped much of the maintenance context. Water has fused several crucial leaves.`,
    choices:[
      check('register-lens','Use the Archive Lens to read pressure marks beneath the fused ink. (INT)','INT',13,'Hairline impressions reveal the missing refrain: Stone bears the load. Brass carries the song. Echo holds what the ages pass on. Three Keys wake the old works below; the living must choose where tomorrow will go.','The ink cannot be separated safely. You recover only the repeated relationship among Stone, Brass, Echo, and a living choice.', 'archives-restoration',{success:{evidence:'Recovered the complete founder refrain linking the Three Keys to a living choice.',item:{name:'First Register Rubbing',reason:'Lithen authorizes a pressure rubbing so the Gate team can carry the recovered refrain without risking the original.'},reputation:{accuracy:2}},failure:{evidence:'The First Register links Stone, Brass, Echo, and a living choice, though part of its refrain remains unreadable.'}},{bonuses:[{item:'Archive Lens',bonus:3,label:'restoration lens'},{item:'Oil Flask',bonus:1,label:'glass catch'}]}),
      check('register-restorers','Let the restorers direct your hands and separate one wet leaf at a time. (DEX)','DEX',12,'You hold the warped frame while the restorers wick water from the edges. The full calibration table survives, along with the signatures of workers omitted from later ceremonial copies.','One corner tears along an old crease. No words are lost, but the team must stop before recovering the final line of the refrain.', 'archives-restoration',{success:{testimony:'The First Register credits workers and stewards omitted from later ceremonial copies.',alliance:{lithen:1,worksfolk:1},repair:'First Register stabilized for continued restoration.'},failure:{consequence:'A fragile corner of the First Register tore during emergency restoration.',evidence:'The main calibration table survived intact.'}},{bonuses:[{item:'Foundry Gloves',bonus:1,label:'steady grip'},{reputation:'humility',threshold:1,bonus:1,label:'followed expert direction'}]}),
      check('register-law','Trace how later copies narrowed the Covenant’s public duties. (CHA)','CHA',12,'Lithen’s indexers assemble a clear chain: broad duties became ceremonial ideals while repair authority migrated toward hereditary offices. The record names no single villain, but it makes the long direction of policy visible.','The legal revisions are too numerous for one conclusion tonight. You preserve three representative changes and mark the wider claim for later review.', 'archives-restoration',{success:{evidence:'Later law preserved the Covenant’s language while narrowing its public duties.',reputation:{accuracy:1,courage:1},alliance:{lithen:1}},failure:{evidence:'Three documented revisions narrowed public maintenance duties; the larger legal pattern remains under review.'}},{bonuses:[{item:'Thread Ledger',bonus:1,label:'revision chain'},{evidence:'Generations of civic decisions became physical patterns through labor, repair, and neglect.',bonus:1,label:'civic pattern'}]})
    ]
  },

  'archives-restoration':{
    id:'archives-restoration',chapter:'archives',title:'The Echo Instrument',
    objective:'Demonstrate that the recovered pattern can be carried without distortion.',
    story:`The Echo Key rests inside the record well’s oldest indexing frame. It is not a prize or a lockpick. It is a portable reference instrument that preserves Pattern: what a system was, how it changed, and which return remains trustworthy. Archive custody exists so no ruler can revise the city’s past while changing its works. Lithen will release it only if your joined record can travel through the well and return without hiding a contradiction.`,
    choices:[
      check('echo-full-record','Send the full account—including failures and corrections—through the record well. (INT)','INT',13,'The account returns with every correction visible and its central pattern intact. The Key answers with a clear, steady interval.','The well exposes two missing dates. You add them as unknowns rather than guesses; the Key answers more faintly, but Lithen accepts the honest limit.', 'archives-echo-key',{success:{evidence:'The joined account remained coherent through the Echo Key’s record test.',alliance:{lithen:2},reputation:{accuracy:2}},failure:{consequence:'Two dates remain unresolved in the joined account.',reputation:{humility:1},alliance:{lithen:1}}},{bonuses:[{item:'Thread Ledger',bonus:2,label:'complete ledger'},{reputation:'accuracy',threshold:6,bonus:1,label:'record accuracy'}]}),
      check('echo-witnesses','Have workers and restorers witness how their words return. (CHA)','CHA',12,'Each witness hears their account preserved in context rather than flattened into one official voice. The Key holds the differences without losing the shared pattern.','The first return overemphasizes your summary. You revise the leaf until the witnesses recognize their own statements.', 'archives-echo-key',{success:{testimony:'Workers and restorers witnessed their differing accounts preserved by the Echo instrument.',alliance:{worksfolk:2,lithen:1},reputation:{compassion:2}},failure:{reputation:{humility:1,accuracy:1},consequence:'The Echo test required revision after witness statements were over-summarized.'}},{bonuses:[{alliance:'worksfolk',bonus:1,label:'witness trust'},{reputation:'compassion',threshold:4,bonus:1,label:'representative record'}]})
    ]
  },

  'archives-echo-key':{
    id:'archives-echo-key',chapter:'archives',title:'Custody of Echo',
    objective:'Carry the Echo Key and the First Register findings to Orra Vale.',
    story:`Lithen seats the Echo instrument in its travel cradle and records its transfer before the gathered restorers. “Pattern is not obedience to the past,” she says. “It is the ability to see what we are continuing.” The Key’s concentric leaves hold a stable return from the First Register. Orra Vale’s Mullinen watch is holding the lower pressure stair, where rising water now strikes the foundations in the same sequence. Lithen cannot promise what waits below. She can prove only that the city once knew how to listen.`,
    enter:{key:'Echo',keyReason:'Lithen and the Archive witnesses release the calibration instrument after your record passes the Echo test.',milestone:'Earned institutional custody of the Echo Key.',flags:{echoEarned:true}},
    choices:[
      advance('echo-descend','Take the pressure stair toward Orra’s watch.','depths-descent','The Echo Key repeats a quiet interval against your hip. Far below, the water answers late.',{route:'Archive pressure stair'}),
      advance('echo-copy','Send one copy of the joined account to Brunna before descending.','depths-descent','A runner carries the sealed copy upward. Whatever happens below, the evidence can no longer vanish with one expedition.',{repair:'A sealed copy of the investigation was secured aboveground.',reputation:{accuracy:1}})
    ]
  },

  'depths-descent':{
    id:'depths-descent',chapter:'depths',title:'Orra’s Lower Watch',
    objective:'Reach Commander Orra Vale and assess the failing pressure stair.',
    story:`The pressure stair descends through cold mist into the first cistern galleries. Commander Orra Vale meets you beside a barricade built from doors, braces, and one retired bell frame. She leads a Mullinen watch: descendants and adherents of Mullinen the Stout, the builder who taught that public works exist to preserve common life. Orra inherited a harsher version—hold every structure at any personal cost. Her exhausted watch has kept the stair open while three lower platforms flooded. She does not need a symbolic confession. She needs a route that saves people and keeps the city supplied.`,
    enter:{alliance:{orra:1,wardens:1},milestone:'Reached Orra Vale’s lower watch.'},
    choices:[
      advance('orra-status','Ask for the people, loads, and time remaining.','depths-platform','Orra gives exact numbers: eleven watch members, eighteen trapped pump workers, two sound braces, and perhaps forty minutes before the next major pulse.',{reputation:{accuracy:1}}),
      advance('orra-history','Show Orra the First Register’s account of Mullinen’s duty.','depths-platform','Orra reads the old wording twice: the works shall bear the people; the people shall not be spent to preserve the works. She says nothing, but folds the copy into her coat.',{alliance:{orra:1},evidence:'Mullinen’s original principle put public life before preserving infrastructure.'})
    ]
  },

  'depths-platform':{
    id:'depths-platform',chapter:'depths',title:'The Ninth Platform',
    objective:'Rescue the pump crew before the next pressure pulse.',
    story:`The Ninth Platform hangs over a black reservoir on three chains and one cracked stone bracket. Eighteen pump workers crowd its upper rail. A pressure pulse lifts the water from below without a normal wave front; the whole surface rises as if taking one breath. The bracket cannot hold another impact. Orra can keep the stair open or lead the rescue, not both.`,
    choices:[
      check('platform-brace','Hold the cracked bracket while Orra evacuates the platform. (STR)','STR',14,'You and two Wardens force a spare brace beneath the load. Orra brings every worker across before the bracket splits.','The brace seats too late to save the platform, but your warning gives Orra time to pull the last workers onto the chain ladder. Equipment is lost; lives are not.', 'depths-lower-watch',{success:{repair:'Ninth Platform stabilized long enough for a complete evacuation.',alliance:{orra:2,wardens:1},reputation:{courage:2}},failure:{consequence:'The Ninth Platform and its pumps were lost after the crew escaped.',hp:-2,alliance:{orra:1}}},{bonuses:[{item:'Mender’s Clamp',bonus:2,label:'brace clamp'},{derived:'power',threshold:6,bonus:1,label:'equipment power'},{item:'Rope Coil',bonus:1,label:'safety line'}]}),
      check('platform-counterload','Shift the surviving chains to turn the water pulse into a counterload. (INT)','INT',14,'You read the Echo interval and move the chains one link before the pulse. The rising water lifts against the platform’s fall, holding it level while the workers cross.','The interval changes near the reservoir wall. You abandon the counterload before it overturns the platform and direct the crew onto the chain ladder instead.', 'depths-lower-watch',{success:{repair:'Ninth Platform chains rebalanced against the pressure pulse.',evidence:'The rising water responds as one distributed motion across the reservoir.',reputation:{accuracy:2},alliance:{orra:1}},failure:{consequence:'The platform could not be rebalanced; its pumps were abandoned.',evidence:'Pressure timing changes near the reservoir wall.'}},{bonuses:[{item:'Echo Key',bonus:2,label:'pattern reference'},{item:'Surveyor’s Chalk',bonus:1,label:'chain marks'}]}),
      check('platform-command','Coordinate Watch and pump crew into one timed evacuation. (CHA)','CHA',13,'You give each group a concrete task and place Orra where her authority matters most. The final worker crosses as the bracket tears free.','Competing orders cost precious seconds. Everyone survives, but a Warden is hurt catching a worker at the stair.', 'depths-lower-watch',{success:{testimony:'Watch and pump workers completed a shared evacuation under one timed plan.',alliance:{orra:1,worksfolk:2,wardens:1},reputation:{compassion:2}},failure:{hp:-1,consequence:'A Warden was injured during the Ninth Platform evacuation.',alliance:{worksfolk:1}}},{bonuses:[{alliance:'worksfolk',bonus:1,label:'worker trust'},{alliance:'wardens',bonus:1,label:'Watch support'}]})
    ]
  },

  'depths-lower-watch':{
    id:'depths-lower-watch',chapter:'depths',title:'What the Works Are For',
    objective:'Decide how Orra’s watch will hold the route.',
    story:`At the barricade, rescued workers argue for sealing the lower stair before more lives are risked. Orra’s oldest sergeant insists Mullinens do not yield a public work. The First Register gives a different measure of endurance: structures carry weight so people do not have to carry it alone. Orra asks for your record of the Ninth Platform before she gives her next order.`,
    choices:[
      check('orra-evacuate','Record the lost platform as a successful rescue, not a failed defense. (CHA)','CHA',12,'Orra orders the exhausted watch back by shifts and assigns pump workers to design the next brace. Duty becomes a shared repair instead of a test of who can suffer longest.','The sergeant rejects your wording, but Orra still orders rest rotations after seeing the injury list entered beside the structural loss.', 'depths-foundation',{success:{alliance:{orra:2,worksfolk:1},reputation:{compassion:2},testimony:'Orra restored Mullinen’s principle that the works exist to carry people.'},failure:{alliance:{orra:1},repair:'Orra established rest rotations for the lower watch.'}},{bonuses:[{evidence:'Mullinen’s original principle put public life before preserving infrastructure.',bonus:2,label:'First Register principle'},{reputation:'compassion',threshold:5,bonus:1,label:'humane record'}]}),
      check('orra-reinforce','Design a smaller defensible line around the surviving load paths. (INT)','INT',13,'You mark a line that protects the evacuation route and abandons stone already beyond repair. Orra recognizes the difference between endurance and waste.','One brace cannot be trusted. Orra withdraws farther than planned, preserving the watch but losing access to a pump gallery.', 'depths-foundation',{success:{repair:'Lower watch consolidated around tested load paths.',alliance:{orra:2,wardens:1},reputation:{accuracy:2}},failure:{consequence:'A pump gallery was abandoned during the Watch withdrawal.',alliance:{orra:1}}},{bonuses:[{item:'Surveyor’s Chalk',bonus:1,label:'load marks'},{evidence:'A calm founder-era pattern persists beneath modern mechanical interference.',bonus:1,label:'stable reference'}]})
    ]
  },

  'depths-foundation':{
    id:'depths-foundation',chapter:'depths',title:'The Stone Test',
    objective:'Prove which foundation can carry the descent and the city above it.',
    story:`Beyond the watch line, three founder piers carry the weight of an entire terrace. Modern braces crowd them at conflicting angles. The Stone Key lies in a calibration socket at the center pier, held in Mullinen custody for citywide load work. It will register only when the surrounding force has been made legible. Orra cannot release it while false supports hide where the weight truly falls.`,
    choices:[
      check('stone-strip','Remove the false braces one at a time and expose the original load path. (STR)','STR',14,'Each removed brace makes the true foundation easier to read. The center pier takes the load cleanly, and the Stone instrument settles in its socket.','One brace carries more than its rust suggests. You stop before removing it and mark a narrower safe path through the chamber.', 'depths-stone-key',{success:{repair:'Founder piers returned to a clear, shared load path.',reputation:{courage:2,accuracy:1},alliance:{orra:1}},failure:{repair:'A narrow safe path was marked through the foundation chamber.',consequence:'Conflicting braces still obscure part of the terrace load.'}},{bonuses:[{item:'Mender’s Clamp',bonus:2,label:'controlled release'},{derived:'power',threshold:6,bonus:1,label:'equipment power'}]}),
      check('stone-calculate','Use settlement marks and the Echo return to calculate the true load. (INT)','INT',14,'The figures reveal that two expensive modern braces carry nothing while an unremarked worker repair bears a quarter of the terrace. You transfer the force into the founder pier and document the hidden labor.','The moving water changes one reading. You still identify the safe pier, but the full terrace calculation must remain provisional.', 'depths-stone-key',{success:{evidence:'An undocumented worker repair carried a critical share of the terrace load.',repair:'Terrace load transferred into the center founder pier.',reputation:{accuracy:2},alliance:{worksfolk:1}},failure:{evidence:'The center founder pier is safe, but the full terrace load remains provisional.'}},{bonuses:[{item:'Echo Key',bonus:2,label:'pattern return'},{item:'First Register Rubbing',bonus:1,label:'founder table'}]}),
      check('stone-witness','Have Orra, workers, and Wardens agree to the load record before moving it. (CHA)','CHA',13,'Every group signs the calculation and names the repairs it will maintain. The Key registers not the signatures themselves, but the stable physical pattern their coordinated work creates.','The sergeant disputes abandoning a ceremonial brace. Orra overrules him and accepts responsibility in the ledger, though the agreement remains narrow.', 'depths-stone-key',{success:{testimony:'Wardens and workers signed a shared foundation maintenance record.',alliance:{orra:2,wardens:1,worksfolk:1},reputation:{compassion:1}},failure:{alliance:{orra:1},consequence:'The foundation plan proceeds without full Watch agreement.'}},{bonuses:[{alliance:'orra',bonus:1,label:'Orra’s trust'},{alliance:'worksfolk',bonus:1,label:'worker support'}]})
    ]
  },

  'depths-stone-key':{
    id:'depths-stone-key',chapter:'depths',title:'Custody of Stone',
    objective:'Carry the Stone Key toward the Brassworks route.',
    story:`The Stone Key is a dense black instrument crossed by one pale seam. In the calibrated foundation it shows Weight plainly: load, consequence, and the difference between a structure that carries a community and a community forced to carry a failing structure. Orra records the transfer under Mullinen authority. She assigns two rested Wardens and three pump workers to keep the repaired path stable behind you.`,
    enter:{key:'Stone',keyReason:'Orra and the lower watch release the load instrument after the foundation is made legible.',milestone:'Earned institutional custody of the Stone Key.',flags:{stoneEarned:true}},
    choices:[
      advance('stone-route','Take the old supply channel toward the Brassworks.','depths-cistern-crossing','The channel is steep, wet, and still marked with delivery signs from the city’s first foundries.',{route:'old supply channel'}),
      advance('stone-send-word','Ask Orra to send the foundation record to Brunna and Lithen.','depths-cistern-crossing','Orra dispatches a rested runner with copies for the Watch and Archives. The joined repair now exists above and below.',{repair:'Foundation record distributed to Watch and Archives.',alliance:{orra:1}})
    ]
  },

  'depths-cistern-crossing':{
    id:'depths-cistern-crossing',chapter:'depths',title:'The Breathing Water',
    objective:'Cross the cistern without treating the Unfathomer as a speaking foe.',
    story:`The supply channel opens above a cistern too broad for your lamp to find the far wall. The water rises everywhere at once, smooth as dark glass, then settles. The Echo Key repeats the motion; the Stone Key grows fractionally lighter as the pressure shifts. No voice enters your mind. Instead, a stable chord from your repaired route produces a visible easing in the nearest current, while the scrape of a damaged pump sends a shudder across the whole surface. The response is immediate, distributed, and difficult to mistake for ordinary hydraulics.`,
    choices:[
      check('cistern-chord','Carry the stable Echo interval across the bridge plates. (INT)','INT',14,'You strike only the interval preserved from the First Register. The water settles beneath each plate long enough for the party to cross, responding to coherence rather than command.','A corroded plate changes the interval. The water rises against the bridge, forcing a slower crossing along the wall chain.', 'brassworks-threshold',{success:{evidence:'The distributed water eased around a stable founder interval without receiving a spoken command.',reputation:{accuracy:2},repair:'A coherent crossing interval was established across the cistern bridge.'},failure:{hp:-1,consequence:'The cistern crossing required the exposed wall chain.'}},{bonuses:[{item:'Echo Key',bonus:2,label:'stable interval'},{item:'Stone Key',bonus:1,label:'load reading'}]}),
      check('cistern-chain','Lead the party hand-over-hand along the wall chain. (DEX)','DEX',13,'You time each movement between pressure rises and bring the party across without disturbing the damaged pump.','The chain tears free at the last anchor. You reach the far ledge, but a Warden loses gear to the water and the route cannot be used for return.', 'brassworks-threshold',{success:{reputation:{courage:2},route:'quiet wall-chain crossing'},failure:{hp:-1,consequence:'The wall-chain route collapsed after the crossing.'}},{bonuses:[{item:'Cistern Boots',bonus:2,label:'wet footing'},{item:'Rope Coil',bonus:1,label:'backup line'}]}),
      check('cistern-pump','Quiet the damaged pump before crossing. (STR)','STR',14,'You lock its broken arm against the housing. The shudder stops, and the entire cistern calms by degrees.','The arm bucks free and throws you against the rail. You disable it, but the last impact sends a high surge through the chamber.', 'brassworks-threshold',{success:{repair:'Damaged cistern pump secured against its housing.',evidence:'Removing one discordant impact calmed water across the full cistern.',reputation:{courage:1}},failure:{hp:-2,repair:'Damaged pump disabled after a final pressure surge.'}},{bonuses:[{item:'Mender’s Clamp',bonus:2,label:'housing clamp'},{derived:'power',threshold:6,bonus:1,label:'equipment power'}]})
    ]
  },

  'brassworks-threshold':{
    id:'brassworks-threshold',chapter:'brassworks',title:'The Silent Brassworks',
    objective:'Enter the abandoned tuning floor and find the Brass Choir team.',
    story:`The old Brassworks should ring with test notes, furnace chains, and shift bells. Instead, incompatible repairs have made sound dangerous. Hammer marks on one wall trigger loose valves in another. A Brass Choir team waits behind felt screens, led by Master Tuner Selka. Choir craft joins bellfounding, engineering, and controlled resonance; the stories say they sing bolts from walls, but Selka uses measurements, breath, and practiced intervals. She will not release the Brass Key until the tuning floor can carry one coherent adjustment without setting off destructive interference.`,
    enter:{alliance:{choir:1},milestone:'Reached the Brass Choir team in the silent Brassworks.'},
    choices:[
      advance('works-hear-selka','Hear Selka’s account of the failed repair attempts.','brassworks-sella','Three contracted crews tuned separate machines perfectly in isolation. Together, their “perfect” repairs beat against one another hard enough to crack the floor.',{evidence:'Isolated repairs became destructive when their tones were combined.'}),
      advance('works-hear-workers','Ask the furnace workers what changed before the floor closed.','brassworks-sella','They identify a cheap replacement bell-metal used after the Choir budget was cut. Its tone drifts when heated, pulling every linked mechanism out of agreement.',{testimony:'Furnace workers traced the tuning drift to cheap replacement bell-metal.',alliance:{worksfolk:1}})
    ]
  },

  'brassworks-sella':{
    id:'brassworks-sella',chapter:'brassworks',title:'Sella’s Salvage Table',
    objective:'Prepare for the tuning floor and learn what its discarded parts reveal.',
    story:`Sella keeps a salvage table beneath the silent shift bell. She buys what can be safely carried, sells tools with their defects plainly marked, and remembers where every part was found. Her collection shows the Brassworks decline in miniature: founder alloy worn thin by centuries of use, careful worker patches, and newer decorative housings that conceal inferior metal. She offers trade, then points out a resonance fork recovered beside the failed anchor.`,
    enter:{item:{name:'Resonance Fork',reason:'Sella lends you the fork recovered from the failed anchor so its last stable setting can guide the repair.'},alliance:{sella:1}},
    choices:[
      merchant('sella-shop','Trade with Sella before entering the tuning floor.','sella'),
      advance('sella-anchor','Carry the resonance fork to the first anchor.','brassworks-choir','Sella wraps the fork in felt. “It tells the truth,” she says. “That does not mean the truth is gentle.”',{reputation:{accuracy:1}})
    ]
  },

  'brassworks-choir':{
    id:'brassworks-choir',chapter:'brassworks',title:'A Chord Built by Many Hands',
    objective:'Choose a repair plan shared by Choir tuners and Worksfolk.',
    story:`Selka diagrams the floor as four linked systems: furnace draft, water pressure, lifting gear, and the great tuning anchor. The Choir can set the intervals. Furnace workers know how heat changes the alloy. Pump crews know the pressure lag. No group has authority over the whole floor. The Brass Key’s divided custody was designed for exactly this problem: citywide adjustment should require cooperation, not one expert’s command.`,
    choices:[
      check('choir-plan','Build one sequence from Choir measurements and worker timings. (INT)','INT',13,'The combined plan gives every system room to settle before the next enters. Selka marks it as the first credible full-floor sequence in two generations.','Two timing notes conflict. You preserve both and choose a slower sequence with wider safety margins.', 'brassworks-anchor',{success:{repair:'Choir and Worksfolk agreed on a coherent full-floor tuning sequence.',alliance:{choir:2,worksfolk:2},reputation:{accuracy:2}},failure:{repair:'A slower Brassworks tuning sequence was adopted with wider safety margins.',alliance:{choir:1,worksfolk:1}}},{bonuses:[{testimony:'Furnace workers traced the tuning drift to cheap replacement bell-metal.',bonus:1,label:'worker timing'},{item:'Resonance Fork',bonus:1,label:'anchor reference'}]}),
      check('choir-authority','Use the Deep Writ to require each specialist’s objection in the record. (CHA)','CHA',13,'Once objections must be answered rather than overruled, the team discovers that three “minor” worker concerns predict the same dangerous beat. The plan changes before anyone enters the floor.','The formal hearing hardens old resentments. Still, the written objections expose one unsafe interval and prevent a reckless start.', 'brassworks-anchor',{success:{testimony:'Choir and Worksfolk objections were answered in one public repair record.',alliance:{choir:1,worksfolk:2},reputation:{compassion:2}},failure:{evidence:'A recorded worker objection exposed an unsafe tuning interval.',consequence:'Choir and Worksfolk cooperation remains strained.'}},{bonuses:[{item:'Deep Writ Seal',bonus:1,label:'public authority'},{reputation:'compassion',threshold:5,bonus:1,label:'fair hearing'}]})
    ]
  },

  'brassworks-anchor':{
    id:'brassworks-anchor',chapter:'brassworks',title:'The First Harmonic Anchor',
    objective:'Restore the first anchor without waking every damaged machine at once.',
    story:`The tuning anchor is a brass column rooted in resonant stone. Its outer rings have been tightened into three incompatible “correct” positions. Heat rolls across the floor in waves. Each time the damaged alloy drifts, the dark water in the inspection channels rises toward the sound. The Unfathomer is not attacking the repair crew; it is responding across its continuous body to every new burst of discord.`,
    choices:[
      check('anchor-retune','Retune the rings through the shared slow sequence. (INT)','INT',15,'The Echo Key preserves the pattern, Stone shows the load, and the resonance fork finds the interval between them. When the anchor settles, lights kindle across the floor and the inspection water falls.','The third ring drifts under heat. You lock the first two into a stable partial chord and shut down the furnace before the interference can spread.', 'brassworks-interference',{success:{repair:'First Brassworks harmonic anchor restored to a coherent chord.',evidence:'The inspection water receded when the anchor reached stable harmony.',alliance:{choir:1,worksfolk:1},reputation:{accuracy:2}},failure:{repair:'First harmonic anchor stabilized at a partial chord.',consequence:'The furnace remains shut down until the third ring is replaced.'}},{bonuses:[{item:'Resonance Fork',bonus:2,label:'anchor reference'},{item:'Echo Key',bonus:1,label:'pattern'},{item:'Stone Key',bonus:1,label:'load'}]}),
      check('anchor-replace','Replace the drifting bell-metal ring during a cold interval. (DEX)','DEX',14,'Workers cool the housing while you lift the warped ring free and seat Sella’s older alloy. The anchor takes the shared tuning without further drift.','The cold interval closes before the final pin seats. You withdraw safely, but the ring must be clamped and the anchor held below full power.', 'brassworks-interference',{success:{repair:'Inferior bell-metal ring replaced with stable reclaimed alloy.',alliance:{worksfolk:2,sella:1},reputation:{courage:1},item:{name:'Foundry Gloves',reason:'The furnace crew gives you heat-capped gloves after the successful ring change.'}},failure:{repair:'Drifting anchor ring clamped below full power.',hp:-1}},{bonuses:[{item:'Foundry Gloves',bonus:2,label:'heat protection'},{item:'Mender’s Clamp',bonus:1,label:'ring clamp'},{item:'Cistern Boots',bonus:1,label:'flooring grip'}]}),
      check('anchor-call','Conduct the specialists through the sequence from the safe gantry. (CHA)','CHA',14,'You call each change only after its worker confirms the preceding system is stable. The finished chord belongs to the whole floor, not one master.','One command is repeated through the echo and reaches a crew late. Selka catches the error, but the anchor must be held at a partial setting.', 'brassworks-interference',{success:{repair:'First anchor tuned through a witnessed multi-crew sequence.',alliance:{choir:2,worksfolk:2},reputation:{compassion:1}},failure:{repair:'First anchor held at a partial setting after a delayed command.',consequence:'The floor lost time correcting an echoed instruction.'}},{bonuses:[{alliance:'choir',bonus:1,label:'Choir trust'},{alliance:'worksfolk',bonus:1,label:'crew trust'}]})
    ]
  },

  'brassworks-interference':{
    id:'brassworks-interference',chapter:'brassworks',title:'The Returning Beat',
    objective:'Find the remaining source of destructive interference.',
    story:`The restored anchor reveals a second beat rather than eliminating it. The Counter diagrams in your First Register rubbing show why: an abandoned lift engine below the floor continues to answer at the wrong interval. Silt and mineral growth have fused around its flywheel, and a stoneback crawler has nested in the warm housing. The animal’s armored movement strikes the mechanism whenever the new chord reaches it.`,
    choices:[
      check('crawler-lure','Use the salt-hound whistle and warmth to draw the crawler from the housing. (CHA)','CHA',13,'The whistle’s low call and a heated oil pan offer a calmer signal than the anchor. The crawler uncurls and follows it into an empty slag bay.','The crawler leaves the flywheel but blocks the safest exit. The crew withdraws while you keep its attention.', 'brassworks-crawler',{success:{repair:'Stoneback crawler relocated from the lift housing without harm.',reputation:{compassion:2},item:{name:'Stoneback Plate',reason:'Sella recovers a naturally shed plate from the abandoned nest and fits it as armor.'}},failure:{hp:-1,consequence:'The crawler was moved from the mechanism but still blocks the slag-bay route.'}},{bonuses:[{item:'Salt-Hound Whistle',bonus:3,label:'animal call'},{item:'Oil Flask',bonus:1,label:'heated lure'}]}),
      check('crawler-wheel','Lock the flywheel between the crawler’s movements. (DEX)','DEX',14,'You read the rhythm, drive the lockpin on the quiet beat, and isolate the engine before the crawler strikes again. It retreats from the still housing.','The pin bends on the first attempt. You stop the engine with a heavier catch, but the impact cracks its outer gear.', 'brassworks-crawler',{success:{repair:'Abandoned lift engine isolated from the tuning network.',reputation:{courage:1,accuracy:1}},failure:{repair:'Lift engine stopped with damage to its outer gear.',item:{name:'Bent Lockpin',reason:'You keep the bent pin as evidence of the force inside the fused flywheel.'}}},{bonuses:[{item:'Lockpin',bonus:2,label:'flywheel catch'},{item:'Echo Key',bonus:1,label:'movement pattern'}]}),
      check('crawler-free','Break the mineral growth and free both animal and flywheel. (STR)','STR',15,'The fused crust comes away in controlled sections. The crawler drops into the slag bay, and the old flywheel turns freely enough to be retuned.','The crust fractures at once. You shield the crawler from falling stone, but the lift engine is damaged beyond safe use.', 'brassworks-crawler',{success:{repair:'Lift flywheel freed and made available for retuning.',reputation:{courage:2},alliance:{worksfolk:1}},failure:{hp:-2,consequence:'The abandoned lift engine was damaged while the crawler escaped safely.',reputation:{compassion:1}}},{bonuses:[{derived:'power',threshold:7,bonus:1,label:'equipment power'},{item:'Warden Pick',bonus:2,label:'controlled breaking'}]})
    ]
  },

  'brassworks-crawler':{
    id:'brassworks-crawler',chapter:'brassworks',title:'The Whole Floor Answers',
    objective:'Complete the full-floor tuning and demonstrate stable Tone.',
    story:`With the false beat isolated, Selka begins the shared sequence. Furnace draft enters first, then water pressure, lifting gear, and the restored anchor. The chord is not beautiful because every note is pure. It is beautiful because different materials, temperatures, and people hold a relationship that gives each one room. Across the inspection channels, the water settles. Far beyond the Brassworks, repaired routes answer in sequence: the Tangles gate, the Archive well, Orra’s foundation. For the first time in generations, the deep network receives a connected change in the right direction.`,
    choices:[
      check('whole-floor-hold','Hold the final interval on the resonance fork. (INT)','INT',14,'The interval travels through every repaired anchor without splitting. Selka declares the Brassworks ready to carry a city-scale adjustment.','The fork wavers as the furnace warms, but the crew corrects together and establishes a narrower stable range.', 'brassworks-brass-key',{success:{repair:'Brassworks full-floor harmony restored across all four systems.',evidence:'Repaired routes answered one another as a connected harmonic network.',alliance:{choir:2,worksfolk:1},reputation:{accuracy:2}},failure:{repair:'Brassworks stabilized within a narrow safe tonal range.',alliance:{choir:1,worksfolk:1}}},{bonuses:[{item:'Resonance Fork',bonus:2,label:'tone reference'},{repair:'First Brassworks harmonic anchor restored to a coherent chord.',bonus:1,label:'restored anchor'},{alliance:'choir',bonus:1,label:'Choir support'}]}),
      check('whole-floor-witness','Have every crew confirm the change before the Key is released. (CHA)','CHA',13,'The final chord holds while workers name what they repaired and what remains unsafe. Tone becomes a shared technical fact rather than a performance owned by the Choir.','Exhaustion makes the testimony uneven, but no one disputes that the floor now operates as one system.', 'brassworks-brass-key',{success:{testimony:'Every Brassworks crew witnessed the full-floor tuning and recorded unfinished work.',alliance:{choir:1,worksfolk:2},reputation:{compassion:2}},failure:{testimony:'Brassworks crews confirmed the stable tuning despite incomplete testimony.'}},{bonuses:[{alliance:'worksfolk',bonus:1,label:'crew trust'},{reputation:'compassion',threshold:6,bonus:1,label:'shared credit'}]})
    ]
  },

  'brassworks-brass-key':{
    id:'brassworks-brass-key',chapter:'brassworks',title:'Custody of Brass',
    objective:'Carry the third calibration instrument to the Gate route.',
    story:`The Brass Key resembles a tuning frame folded around a warm amber core. It carries Tone: the relationship among active systems, not the authority to command them. Selka records its release under Choir and Works witness. Messages arrive from above and below. Brunna has opened emergency supply routes. Lithen brings the restored Register pattern. Orra’s watch holds the foundation without spending more lives. The city is not repaired, but the Unfathomer has felt a connected improvement and the intention behind it. That first honest change has slowed the rise enough to attempt the Gate.`,
    enter:{key:'Brass',keyReason:'The Brass Choir and Works crews release the tonal instrument after the full-floor sequence holds.',milestone:'Earned institutional custody of the Brass Key.',flags:{brassEarned:true,networkImproved:true}},
    choices:[
      advance('brass-gate','Join the converging teams at the Gate route.','gate-approach','Stone, Brass, and Echo rest in separate cradles. None is sufficient alone. Together they make the old works readable.',{route:'Brassworks Gate conduit'}),
      advance('brass-message','Send the stable interval upward before entering the Gate route.','gate-approach','Upper pumps adopt the safe interval. It cannot cure the city, but it prevents several fresh failures while the Gate team descends.',{repair:'Upper pump crews received the Brassworks safe interval.',reputation:{compassion:1}})
    ]
  },

  'gate-approach':{
    id:'gate-approach',chapter:'gate',title:'The Gate of Measures',
    objective:'Seat the Three Keys and read the founders’ instructions.',
    story:`The Gate fills a cavernous atrium: a circular structure of dark stone veined with brass, taller than any ordinary door. Moss and water cover its lower inscriptions. It was not built to imprison the Unfathomer; it predates any confirmed awareness of that life. The founders made it as a citywide calibration mechanism, constitutional safeguard, and teaching instrument—a dwarven Rosetta stone for those who might inherit systems they no longer understood. Lithen arrives by the Archive conduit, Orra by the stabilized foundation stair, and Selka through the Brassworks line. The Three Keys open separate readings. Your Thread Ledger supplies the record of living consequences.`,
    enter:{milestone:'Reached the Gate of Measures with all three institutional Keys.',flags:{gateReached:true}},
    choices:[
      advance('gate-seat','Seat Stone, Brass, and Echo in their separate instruments.','gate-weight','The Gate does not swing. Concentric galleries awaken, each revealing a different layer of the city below.',{reputation:{accuracy:1}})
    ]
  },

  'gate-weight':{
    id:'gate-weight',chapter:'gate',title:'The Reading of Weight',
    objective:'Use Stone to mark what the city can safely carry.',
    story:`Stone illuminates load lines through the Gate atrium and outward into Brassreach. Several High House terraces glow with redundant supports while lower pump districts burn white at the edge of collapse. The instrument does not accuse. It makes consequence visible: where material, labor, and danger have been placed. Orra compares the reading to the foundation record and waits for your mark.`,
    choices:[
      check('gate-weight-public','Mark the vulnerable public works as the first loads to relieve. (INT)','INT',12,'Stone accepts the route. Redundant upper supports can carry a temporary transfer while the lower districts are stabilized.','One upper support proves ceremonial rather than structural. You revise the transfer to a smaller safe route.', 'gate-tone',{success:{repair:'Gate load route prioritizes vulnerable public works.',evidence:'Stone exposed unequal structural investment across city districts.',alliance:{orra:1}},failure:{repair:'Gate load route established at a smaller safe transfer.',consequence:'Several lower districts remain near their load limit.'}},{bonuses:[{item:'Stone Key',bonus:2,label:'Weight instrument'},{repair:'Founder piers returned to a clear, shared load path.',bonus:1,label:'foundation repair'}]}),
      check('gate-weight-evac','Use the reading to clear people from loads that cannot be repaired tonight. (CHA)','CHA',12,'Brunna’s messengers carry precise evacuation orders along routes already tested by your expedition. The Counter records lives moved before structures.','Two districts resist an order based on an unfamiliar instrument. Brunna secures the most vulnerable block while the rest remain on warning.', 'gate-tone',{success:{repair:'Gate reading guided targeted evacuations from failing loads.',reputation:{compassion:2},alliance:{wardens:1}},failure:{consequence:'Only the most vulnerable district completed evacuation before calibration.'}},{bonuses:[{alliance:'wardens',bonus:1,label:'Watch network'},{reputation:'compassion',threshold:7,bonus:1,label:'public trust'}]})
    ]
  },

  'gate-tone':{
    id:'gate-tone',chapter:'gate',title:'The Reading of Tone',
    objective:'Use Brass to carry a coherent adjustment through the old works.',
    story:`Brass reveals interference as bands of amber and black. The repaired anchors form a thin coherent path from the Tangles to the Archives, through Orra’s foundation, and across the Brassworks. Beyond it, centuries of incompatible work remain. Selka warns that forcing a powerful chord through the whole network would turn unresolved differences into fracture. The Gate can send only what the existing path can honestly carry.`,
    choices:[
      check('gate-tone-coherent','Send the modest stable interval through every repaired anchor. (INT)','INT',13,'The interval reaches the city as a connected promise rather than a command. Water levels pause along the repaired route, and the coherent path widens by degrees.','The interval splits at an unrepaired branch. You narrow it to the anchors you can verify, preserving stability at the cost of reach.', 'gate-pattern',{success:{repair:'A coherent Gate interval reached every repaired anchor.',evidence:'The Unfathomer’s outward pressure eased along the connected repair path.'},failure:{repair:'Gate interval confined to verified anchors.',consequence:'Unrepaired branches remain outside the stable tonal path.'}},{bonuses:[{item:'Brass Key',bonus:2,label:'Tone instrument'},{repair:'Brassworks full-floor harmony restored across all four systems.',bonus:2,label:'full-floor harmony'}]}),
      check('gate-tone-crews','Let each crew answer from its anchor before extending the interval. (CHA)','CHA',13,'Voices and instruments confirm the route section by section. The resulting harmony carries the evidence of sustained cooperation, and the deep water settles around it.','One remote crew cannot answer. You leave that branch untouched and preserve the rest of the sequence.', 'gate-pattern',{success:{testimony:'Archive, Watch, Works, and Choir crews answered through one Gate sequence.',alliance:{choir:1,worksfolk:1,wardens:1,lithen:1,orra:1}},failure:{consequence:'One remote repair branch could not join the Gate sequence.'}},{bonuses:[{alliance:'choir',bonus:1,label:'Choir support'},{alliance:'worksfolk',bonus:1,label:'Works support'},{alliance:'orra',bonus:1,label:'Orra’s watch'}]})
    ]
  },

  'gate-pattern':{
    id:'gate-pattern',chapter:'gate',title:'The Reading of Pattern',
    objective:'Use Echo to show how Brassreach reached the present crisis.',
    story:`Echo turns the Gate into a layered history. Founder works begin as relationships among natural water, resonant stone, craft, and shared stewardship. Later layers narrow access, split maintenance, and place more weight on people with less authority. No single decree creates the crisis. Repetition does. The First Register pattern remains visible beneath the accumulated discord, not as a golden age to copy, but as proof that another relationship once functioned.`,
    choices:[
      check('gate-pattern-full','Enter the complete Thread Ledger, including contradictions and costs. (INT)','INT',13,'The Gate aligns civic decisions with physical decline and every repair your route began. The Counter can now distinguish hope from preparation.','Two early observations remain ambiguous. You enter them as unresolved, and the larger progression still holds.', 'gate-counter',{success:{evidence:'The Gate linked centuries of civic division to physical discord without inventing a single culprit.',reputation:{accuracy:2},flags:{fullRecord:true}},failure:{evidence:'The Gate confirmed the broad progression into discord with two observations unresolved.'}},{bonuses:[{item:'Echo Key',bonus:2,label:'Pattern instrument'},{item:'Thread Ledger',bonus:1,label:'joined record'},{reputation:'accuracy',threshold:8,bonus:1,label:'record integrity'}]}),
      check('gate-pattern-witness','Have Lithen, Orra, Selka, and the workers attest to their parts of the record. (CHA)','CHA',13,'The Gate preserves distinct testimony inside one visible pattern. No institution can later claim that the crisis belonged to someone else.','The witnesses disagree over one repair’s importance. The disagreement remains visible, but all attest to the common sequence.', 'gate-counter',{success:{testimony:'Allied institutions attested to their place in the Gate’s historical pattern.',alliance:{lithen:1,orra:1,choir:1,worksfolk:1},flags:{broadWitness:true}},failure:{testimony:'Gate witnesses preserved one unresolved disagreement inside the common sequence.'}},{bonuses:[{alliance:'lithen',bonus:1,label:'Archive trust'},{alliance:'orra',bonus:1,label:'Watch trust'},{alliance:'choir',bonus:1,label:'Choir trust'}]})
    ]
  },

  'gate-counter':{
    id:'gate-counter',chapter:'gate',title:'What the Counter Remembers',
    objective:'Read the expedition’s actual preparation before entering the deepest network.',
    story:`The Counter is not a judge and does not speak. Brass drums rotate behind glass, totaling visible load, tonal alignment, historical pattern, repaired anchors, institutional custody, and the consequences preserved in your ledger. Its result is practical. Brassreach cannot be restored tonight. The repaired route has nevertheless created the first connected improvement the Unfathomer has felt in generations. The city’s teams are acting with a shared intention to continue. That may be enough to ease its disquiet and buy real time—if the living choice matches what the route can carry. The Gate opens no door. Instead, water climbs its lower rings and forms a passage into the deepest resonant network.`,
    enter:{flags:{counterRead:true},milestone:'The Counter measured the expedition’s preparation without moral judgment.'},
    choices:[
      advance('counter-enter','Enter the water-lit passage with the Three Keys and the ledger.','choice-contact','The passage holds around you as a pressure boundary. Every repaired anchor remains faintly present through Stone, Brass, and Echo.',{reputation:{courage:1}})
    ]
  },

  'choice-contact':{
    id:'choice-contact',chapter:'choice',title:'The Unfathomer’s Nearness',
    objective:'Understand the response of the deep network without inventing speech.',
    story:`Within the passage, the boundary between reservoir, stone, mechanism, and living presence disappears. The Unfathomer has no face waiting in the dark and no sentence prepared for you. It is continuous awareness moving through pressure, temperature, return, and interruption—an immense water-like mind reaching toward remembered peace. When the Gate carries your repaired harmony, the surrounding current loosens. When your ledger records the intention to continue repair, the response arrives as instant agreement across miles of water: not consent in words, but a measurable easing around the connected anchors. You cannot cure centuries of discord here. You can choose the first durable direction Brassreach will take, and the Unfathomer can perceive whether that direction offers relief.`,
    choices:[
      advance('contact-read','Let the Three Keys translate the available interventions.','choice-decision','Stone shows cost. Brass shows reach. Echo shows likely continuation. The Counter adds the strength of your repairs and alliances. Five credible courses emerge; none is free of consequence.',{milestone:'Reached a nonverbal understanding of the deep network’s distress.'})
    ]
  },

  'choice-decision':{
    id:'choice-decision',chapter:'choice',title:'The Living Choice',
    objective:'Choose the first direction Brassreach will sustain after this night.',
    story:`The founders left no command for this crisis because they never knew the life their craft had awakened. The final Measure is therefore not a hidden word or fourth instrument. It is living Choice: a decision made with incomplete knowledge, recorded consequences, and responsibility for what follows. The Gate can begin one course tonight. Its quality will depend on the evidence, repairs, and cooperation you actually brought—not on a final throw of chance.`,
    choices:[
      {id:'ending-concord',type:'ending',ending:'concord',label:'Begin a Concord: connect the repaired anchors to a public program of reform and stewardship.',sentence:'Begin a Concord.',requirements:{keys:3,evidence:7,repairs:6,alliances:4},requirementText:'Requires all three Keys, strong evidence, six repairs, and four allied institutions.'},
      {id:'ending-channel',type:'ending',ending:'channel',label:'Channel the deep pressure toward Porkkala’s old tuning quarries.',sentence:'Channel the Unfathomer toward Porkkala.',requirements:{keys:3,evidence:5,repairs:4},requirementText:'Requires all three Keys and a credible repaired route.'},
      {id:'ending-bind',type:'ending',ending:'bind',label:'Bind the deepest network behind monitored dampening works.',sentence:'Bind the deepest network.',requirements:{keys:2,repairs:3},requirementText:'Requires at least two Keys and three completed repairs.'},
      {id:'ending-banish',type:'ending',ending:'banish',label:'Banish the presence by severing Brassreach’s oldest resonant paths.',sentence:'Sever the old resonant paths.',requirements:{keys:2},requirementText:'Requires at least two Keys; the cultural and structural cost is severe.'},
      {id:'ending-hold',type:'ending',ending:'hold',label:'Hold the immediate rise and preserve time for another civic effort.',sentence:'Hold the immediate rise.',requirements:{keys:2},requirementText:'Requires at least two Keys and remains a valid, temporary resolution.'}
    ]
  }
};

export const MERCHANTS = {
  dorrin:{
    id:'dorrin',name:'Quartermaster Dorrin',title:'Watch Issue & Field Stock',
    greeting:'“Buy for the route you can prove, not the danger you hope to meet.”',
    stock:['Rope Coil','Oil Flask','Lockpin','Surveyor Hood','Saltglass Salve']
  },
  sella:{
    id:'sella',name:'Sella of the Lower Salvage',title:'Brassworks Reclamation Table',
    greeting:'“Everything here failed somewhere. I can tell you where, and I will not pretend that makes it useless.”',
    stock:['Foundry Gloves','Warden Pick','Echo Buckler','Cistern Boots','Saltglass Salve']
  }
};

export const ENDINGS = {
  concord:{
    id:'concord',title:'Concord — The First Repair',
    strong:`The Gate carries a modest, coherent harmony through every repaired anchor. The Unfathomer feels the relief and the sustained intention behind it; its outward search slows, and the waters settle away from the most vulnerable districts. Above, your Thread Ledger makes the city’s long departure from the Founding Covenant impossible to dismiss. Archives, Wardens, Worksfolk, and the Brass Choir begin a public program of repair, redistribution, and stewardship. Brassreach is not healed in one night. It has gained time, a truthful record, and its first shared direction in generations.`,
    strained:`The Concord reaches the deep network, but gaps in evidence and cooperation leave parts of the city outside its first stable path. The rise slows enough to prevent immediate collapse. Reform begins under dispute, and the Thread Ledger becomes the ground on which that dispute must be answered.`
  },
  channel:{
    id:'channel',title:'Channel — A Quieter Shore',
    strong:`The Gate opens a coherent route toward Porkkala’s old tuning quarries. Their resonant stone carries the restored interval away from the crowded terraces. The Unfathomer follows the relief without spoken bargain, and water falls through Brassreach’s most threatened works. The city survives with much of its living craft intact. Whether leaders use this reprieve for reform or merely move the burden elsewhere remains written as an open obligation in your ledger.`,
    strained:`A narrow channel reaches Porkkala, drawing enough pressure away to save the city. The route needs constant tuning, and several districts remain flooded. Brassreach has relief, not absolution.`
  },
  bind:{
    id:'bind',title:'Bind — The Monitored Quiet',
    strong:`Stone and Brass raise monitored dampening works around the deepest network. The Unfathomer withdraws from the city’s discord, and the immediate rise stops. The binding is made as temporary protection rather than punishment: workers record pressure, the Archives preserve review dates, and the city commits to repairing conditions before contact is widened. Much of the old living network falls silent, but no one pretends the quiet is a cure.`,
    strained:`The dampening works hold, but they isolate more of the old network than intended. Brassreach is safe for now at the cost of living systems it does not yet understand. Your ledger records a mandatory return, though future councils may resist it.`
  },
  banish:{
    id:'banish',title:'Banish — The Severed Wonder',
    strong:`The Gate severs the resonant paths linking the Unfathomer to Brassreach. The deep presence withdraws beyond reach, and the waters subside. Old living mechanisms dim across the city. Pumps, foundations, and channels must be rebuilt by more ordinary craft, and some ancient terraces settle beyond repair. Brassreach survives, but it gives up part of what made it extraordinary. Your record names the choice as emergency separation, not victory over an evil foe.`,
    strained:`The severance drives the deep presence away, but uneven breaks damage several old works. Evacuations continue for weeks. The city survives in a quieter, poorer form and must decide what kind of craft can replace the wonder it cut away.`
  },
  hold:{
    id:'hold',title:'Hold — Time Honestly Bought',
    strong:`The Gate stabilizes the most dangerous loads and carries a narrow calm through the verified anchors. The Unfathomer’s rise pauses. Brassreach gains a credible season to finish the record, recover missing routes, and decide on a lasting course. Hold is not failure. It is time bought with an exact account of what remains undone.`,
    strained:`The Gate halts the worst pressure for several weeks. Some lower works remain closed, and the calm will not maintain itself. Your ledger identifies the missing instruments, repairs, and alliances so the next effort begins from truth rather than another forgotten warning.`
  }
};
