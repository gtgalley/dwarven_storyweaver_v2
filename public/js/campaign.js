// Brassreach authored campaign
// v6 — clarity-edited canonical story with reactive transitions and explicit RPG sources.

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
    story:`Morning rain darkens the upper terraces of Brassreach. Captain Brunna stands beneath the Public Bell with three repair petitions spread across a slate table. She taps them in turn. “A cracked stair. Water beneath six homes. Salt-hounds driven into a market. The sites share no pipe and no wall, but every report mentions the same low vibration.”

Brunna places a probationary writ beside the petitions. “A Threadbearer follows a failure from its cause to its consequences. You inspect the damage, hear the people who live with it, and record what the evidence can prove. Your ledger cannot make law on its own, but it makes responsibility hard to bury.” She pushes the writ toward you. “Observe first. Conclude later.”`,
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
    story:`Quartermaster Dorrin works behind an iron counter polished by generations of impatient hands. He checks your writ, looks at your boots, and spends longer on the boots. “A fine report from the bottom of a shaft is still at the bottom of a shaft,” he says. He issues surveyor’s chalk, a listening hood, and a route token for staffed service doors. He records each object beside the public reason for carrying it. Additional field gear is available for purchase.`,
    enter:{item:{name:'Surveyor’s Chalk',reason:'Dorrin issues it so you can mark tested masonry and a safe return route.'},discovery:'Watch equipment is logged against a public purpose, not granted as a private favor.'},
    choices:[
      merchant('tutorial-dorrin-shop','Inspect Dorrin’s field stock.','dorrin'),
      advance('tutorial-dorrin-ready','Fasten the ledger and depart for the bell-stair.','tutorial-bell-stair','Dorrin stamps your route token and points toward the rain-dark stair. “Bring back causes, not rumors.”',{item:{name:'Surveyor Hood',reason:'Dorrin lends you a listening hood because the first failure may have to be heard as well as seen.'}})
    ]
  },

  'tutorial-bell-stair':{
    id:'tutorial-bell-stair',chapter:'tutorial',title:'The Cracked Bell-Stair',
    objective:'Secure the stair and determine why its lower landing failed.',
    story:`The bell-stair connects a crowded terrace to the civic Halls. One lower tread has split from the wall to the rail, trapping two stair-keepers above a service arch. “The crack widened after the noon bell,” one keeper calls down. Rainwater runs through it, but the old foundation remains sound. A newer iron drain collar has twisted the landing out of balance. After each bell stroke fades, a second vibration rises from below and moves grit along the crack.`,
    choices:[
      check('stair-brace','Brace the landing while the stair-keepers cross. (STR)','STR',10,'You shoulder the temporary beam into place. Both keepers cross, and one shows you where the low vibration makes a cup of rainwater tremble.','The brace slips before you seat it. The keepers retreat safely, but falling stone bruises your shoulder and closes the direct stair.', 'tutorial-tangles',{success:{repair:'Bell-stair landing braced for evacuation.',reputation:{courage:1},testimony:'The stair-keepers confirmed the vibration begins after each bell stroke.'},failure:{hp:-1,hpReason:'bruised by falling stone at the bell-stair',consequence:'The bell-stair remains closed pending a full repair.',reputation:{accuracy:1}}},{bonuses:[{item:'Rope Coil',bonus:2,label:'secured rope'},{derived:'power',threshold:4,bonus:1,label:'power rating'}]}),
      check('stair-collar','Release the warped drain collar in the correct sequence. (INT)','INT',11,'You chalk the load path, loosen the collar one quarter-turn at a time, and let the old stone settle. The dangerous strain eases without breaking the drain.','The final catch binds. You stop before the collar shears, but the landing must be closed and the water diverted through the Tangles.', 'tutorial-tangles',{success:{repair:'Warped bell-stair drain collar safely released.',evidence:'A modern iron collar distorted an older balanced foundation.',reputation:{accuracy:2}},failure:{consequence:'Runoff was diverted toward the Tangles after the bell-stair collar could not be released.',hp:-1,hpReason:'strained while holding the jammed drain collar'}},{bonuses:[{item:'Surveyor’s Chalk',bonus:2,label:'marked load path'},{item:'Lockpin',bonus:1,label:'fine catch tool'}]}),
      check('stair-listen','Time the lower vibration against the bell’s fading note. (DEX)','DEX',10,'You keep perfectly still through three bell strokes. The second pulse is not an echo: it arrives late from beneath the service arch and travels against the visible pipework.','Foot traffic shakes the landing before you complete the comparison. You record the delay but cannot prove its direction here.', 'tutorial-tangles',{success:{evidence:'The low overtone travels upward against the mapped pipework.',reputation:{accuracy:2}},failure:{evidence:'The low vibration arrives after the public bell, but its direction remains uncertain.'}},{bonuses:[{item:'Surveyor Hood',bonus:2,label:'listening plates'}]})
    ]
  },

  'tutorial-tangles':{
    id:'tutorial-tangles',chapter:'tutorial',title:'Almost-True Maps',
    objective:'Compare the official route with conditions in the Tangles.',
    arrivals:{
      'stair-brace:success':'With the stair-keepers safe, you follow their description of the delayed vibration toward the Tangles.',
      'stair-brace:failure':'The closed stair forces you down a service lane, where diverted runoff already flows toward the Tangles.',
      'stair-collar:success':'The released collar sends the runoff back into its old channel. You follow that channel toward the Tangles.',
      'stair-collar:failure':'Because the collar remains jammed, Watch crews divert the runoff toward the Tangles. You go ahead to warn the residents.',
      'stair-listen:success':'Your timing marks lead away from the visible pipework and toward the Tangles.',
      'stair-listen:failure':'Your incomplete timing still gives you one useful lead: the delayed pulse is strongest on the Tangles side of the wall.'
    },
    story:`Ropewalks, wire presses, homes, and workshops crowd every dry ledge in the Tangles. The official plan shows a clear inspection lane. A dye-house fills half of it, and a footbridge crosses the rest. Piera, a quick-eyed map trader, unfolds a district map stitched from delivery slips. “Official maps show where an office believes a street ought to be,” she says. “Mine show where people can still walk.” Her newest marks follow damp walls that the city plan labels dry.`,
    choices:[
      check('piera-compare','Compare Piera’s map against your ledger and the drain flow. (INT)','INT',10,'Two of Piera’s marks are guesses, but the third follows the same delayed vibration you found at the stair. An omitted maintenance throat links the sites.','The patched map is difficult to align with the civic grid. Piera points out your error before it enters the ledger, and you record her correction openly.', 'tutorial-salt-hounds',{success:{evidence:'An omitted maintenance throat links the bell-stair runoff to the Tangles.',alliance:{piera:1},flags:{pieraRoute:true},item:{name:'Piera’s Route Map',reason:'Piera gives you the corrected sheet because official plans no longer show the lived route.'},reputation:{accuracy:2}},failure:{testimony:'Piera corrected a false alignment before it entered the Thread Ledger.',alliance:{piera:1},reputation:{humility:1}}},{bonuses:[{item:'Surveyor’s Chalk',bonus:1,label:'survey marks'}]}),
      check('piera-residents','Speak with the flooded households before testing Piera’s route. (CHA)','CHA',10,'Residents describe water arriving in pulses, not as a steady leak. Their times match the bell-stair vibration and identify a blocked relief grate beneath the market.','Several accounts conflict over dates, but every household describes the same pulsing rise. You preserve the disagreement instead of forcing a clean answer.', 'tutorial-salt-hounds',{success:{testimony:'Tangles households reported pulsing water and a blocked market relief grate.',alliance:{worksfolk:1},reputation:{compassion:2}},failure:{testimony:'Tangles testimony conflicts on timing but agrees that the flooding rises in pulses.',reputation:{accuracy:1}}},{bonuses:[{alliance:'piera',bonus:1,label:'Piera’s introductions'}]}),
      check('piera-shortcut','Follow Piera across the wire-press roofs to inspect the omitted throat. (DEX)','DEX',11,'The rooftop route brings you above the sealed maintenance throat. From there, you see wet animal tracks leading from its broken grate.','A loose sheet of brass drops under your boot. You catch the rail, but the noise scatters whatever moved below and costs time.', 'tutorial-salt-hounds',{success:{discovery:'Salt-hound tracks emerge from the omitted maintenance throat.',alliance:{piera:1},reputation:{courage:1}},failure:{hp:-1,hpReason:'cut by the loose brass roof sheet',consequence:'Noise on the rooftop route drove the displaced animals toward the market.'}},{bonuses:[{item:'Rope Coil',bonus:2,label:'roof line'}]})
    ]
  },

  'tutorial-salt-hounds':{
    id:'tutorial-salt-hounds',chapter:'tutorial',title:'The Market Pack',
    objective:'Clear the displaced salt-hounds without harming the market crowd.',
    story:`Four salt-hounds crouch beneath the market’s lifting gears. Their mineral-crusted coats are soaked, and the smallest holds up a cut paw. A porter lies behind an overturned cart. The largest hound stands between him and the only dry exit, but it watches the hammering shutters rather than the crowd. Wet tracks lead back to a flooded drainage den. The animals are trapped and frightened, not hunting.`,
    choices:[
      check('hounds-lure','Open a quiet route and lure the pack toward an unused culvert. (CHA)','CHA',11,'You lower your voice, move the crowd back, and leave water along the open route. The pack follows the largest hound into the empty culvert without a charge.','A dropped pan startles the largest hound. You still clear the crowd, but the pack bolts through a spice stall and one animal is injured.', 'tutorial-floodgate',{success:{repair:'A safe animal route was opened from the market to an unused culvert.',reputation:{compassion:2},item:{name:'Salt-Hound Whistle',reason:'The porter gives you the low whistle animal handlers use near the drainage dens.'}},failure:{consequence:'The pack escaped through the market; one salt-hound was injured.',hp:-1,hpReason:'scratched while clearing the startled market pack'}},{bonuses:[{testimony:'Tangles households reported pulsing water and a blocked market relief grate.',bonus:1,label:'resident guidance'},{item:'Canteen',bonus:1,label:'clean water'}]}),
      check('hounds-cart','Lift the cart long enough for the porter to crawl free. (STR)','STR',11,'You raise the axle while the porter rolls clear. With the immediate threat gone, handlers open the far shutter and guide the pack away.','The wet axle twists in your grip. The porter escapes, but the cart falls hard and the hounds scatter through the market.', 'tutorial-floodgate',{success:{reputation:{courage:2},testimony:'The rescued porter saw water burst from the blocked relief grate before the pack arrived.'},failure:{hp:-2,hpReason:'strained when the wet cart axle twisted free',consequence:'The market pack scattered before handlers could guide it.'}},{bonuses:[{derived:'power',threshold:5,bonus:1,label:'power rating'},{equipped:'Foundry Gloves',bonus:2,label:'secure gloves'}]}),
      check('hounds-gears','Stop the lifting gears and use their low idle tone to calm the pack. (INT)','INT',12,'You disengage the striking cam but leave the flywheel turning. Its steady low tone masks the painful pulses below, and the hounds allow handlers to approach.','You stop the wrong axle. The market shutters slam closed, forcing an evacuation before the pack can be moved.', 'tutorial-floodgate',{success:{evidence:'A stable mechanical tone calmed animals distressed by the underground pulse.',repair:'Market lifting gears retuned to a quieter idle.',reputation:{accuracy:2}},failure:{consequence:'The market closed for emergency evacuation after its lifting gear locked.'}},{bonuses:[{item:'Oil Flask',bonus:1,label:'freed clutch'},{item:'Lockpin',bonus:1,label:'cam release'}]})
    ]
  },

  'tutorial-floodgate':{
    id:'tutorial-floodgate',chapter:'tutorial',title:'The Buried Relief Gate',
    objective:'Restore the relief gate beneath the Tangles market.',
    story:`Behind the abandoned den, the missing maintenance throat ends at a relief gate buried under silt, broken tile, and household debris. Its stone frame is older than the iron collar at the bell-stair. The mechanism is worn but still intact. Three inspection plates explain the neglect: the Halls maintain the upper drain, the Tangles maintain the market grate, and the Works budget stops at the wall between them. No office maintains the gate itself. Water strikes it in measured pulses.`,
    choices:[
      check('relief-clear','Clear the silt while residents form a bucket line. (STR)','STR',11,'The line moves mud, broken tile, and years of neglect. When the gate opens, water falls by a handspan through the market and stair foundations.','The gate opens only halfway before the next pulse. The immediate pressure drops, but the channel will need a crew before nightfall.', 'tutorial-report',{success:{repair:'Tangles relief gate fully reopened with resident help.',alliance:{worksfolk:2},reputation:{courage:1,compassion:1}},failure:{repair:'Tangles relief gate opened halfway, buying several hours.',consequence:'A Works crew must clear the remaining silt before nightfall.'}},{bonuses:[{item:'Rope Coil',bonus:1,label:'haul line'},{alliance:'worksfolk',bonus:1,label:'resident bucket line'}]}),
      check('relief-balance','Reset the old counterweight before opening the gate. (INT)','INT',12,'You follow the founder marks instead of the newer iron labels. The counterweight settles, the gate lifts evenly, and the low overtone weakens across the chamber.','The modern repair marks conceal one original notch. You avoid a collapse, but the gate can only be chained open at a narrow setting.', 'tutorial-report',{success:{repair:'Founder-era relief counterweight restored to balance.',evidence:'Restoring an older balanced mechanism weakened the shared overtone.',reputation:{accuracy:2}},failure:{repair:'Relief gate chained at a narrow emergency opening.',item:{name:'Mender’s Clamp',reason:'A resident lends you a clamp to hold the emergency opening until a Works crew arrives.'}}},{bonuses:[{item:'Surveyor’s Chalk',bonus:1,label:'founder marks'},{flag:'pieraRoute',bonus:1,label:'omitted route'}]}),
      check('relief-coordinate','Assign the opening sequence among residents, Watch, and drain workers. (CHA)','CHA',11,'Each group takes one task and hears why the others matter. The gate opens under shared control, and the first repair crew arrives before the crowd disperses.','Old disputes slow the work. The gate is made safe, but each office records the repair as someone else’s temporary duty.', 'tutorial-report',{success:{repair:'Relief gate reopened under a shared maintenance plan.',alliance:{wardens:1,worksfolk:2},reputation:{compassion:1},testimony:'Residents, Watch, and drain workers agreed to a shared account of the failure.'},failure:{repair:'Relief gate made safe under a temporary order.',consequence:'The offices still dispute permanent responsibility.'}},{bonuses:[{alliance:'piera',bonus:1,label:'local trust'},{reputation:'compassion',threshold:2,bonus:1,label:'public trust'}]})
    ]
  },

  'tutorial-report':{
    id:'tutorial-report',chapter:'tutorial',title:'The Joined Account',
    objective:'Present a precise account without claiming more than the evidence proves.',
    story:`Back beneath the Public Bell, Brunna reads your wet ledger in silence. It connects the cheap collar, the route omitted from modern maps, the displaced animals, and the relief gate abandoned between offices. The same low overtone appears at every site, but its source remains unknown. Brunna looks up. “Give me one finding the city can act on today. Then give me one question you have not yet earned the right to answer.”`,
    choices:[
      check('report-precise','Name the maintenance chain and leave the unknown source marked as unknown. (INT)','INT',10,'Your account assigns immediate repairs without inventing a culprit. Brunna seals it into the Thread Ledger as a model of accurate field work.','Your first wording implies a single mechanical source. Brunna makes you correct it in view of the clerks, preserving both the error and the revision.', 'halls-deep-writ',{success:{evidence:'The joined account proves connected neglect without claiming a known source.',reputation:{accuracy:2},attributes:{INT:1},milestone:'Completed the first joined Threadbearer account.'},failure:{reputation:{humility:1},consequence:'The public record preserves an overstatement and its correction.'}},{bonuses:[{item:'Thread Ledger',bonus:2,label:'field record'},{reputation:'accuracy',threshold:4,bonus:1,label:'careful record'}]}),
      check('report-people','Lead with the people endangered by the gaps between offices. (CHA)','CHA',11,'Your testimony makes the administrative boundary impossible to treat as an abstraction. Brunna orders the Works and Watch to share responsibility while the deeper cause is investigated.','The clerks challenge two details, but the named residents stand by the common sequence of events. The report survives with narrower language.', 'halls-deep-writ',{success:{alliance:{worksfolk:2,wardens:1},reputation:{compassion:2},attributes:{CHA:1},milestone:'Placed affected residents and workers into the public account.'},failure:{testimony:'Named residents upheld the sequence after clerks challenged the report.',reputation:{accuracy:1}}},{bonuses:[{alliance:'worksfolk',bonus:1,label:'worker testimony'},{reputation:'compassion',threshold:3,bonus:1,label:'public standing'}]})
    ]
  },

  'halls-deep-writ':{
    id:'halls-deep-writ',chapter:'halls',title:'The Deep Writ',
    objective:'Accept authority to follow the shared overtone below the civic Halls.',
    story:`Brunna returns your ledger with a second seal fixed beside the first. “This Deep Writ opens restricted public works and requires offices to show you relevant maintenance records,” she says. “It does not put workers or private homes under your command.” She turns to three older Halls reports. Each describes the same overtone, and each was sent to a different office and closed without comparison. One report points toward a sealed map room. “You found a real connection and left the cause honestly unknown. Now follow it.”`,
    enter:{authority:'Threadbearer under Deep Writ',writ:'deep',item:{name:'Deep Writ Seal',reason:'Brunna fixes the seal to your ledger as proof of lawful access below the Halls.'},milestone:'Earned a Deep Writ.',flags:{deepWrit:true}},
    choices:[
      advance('deep-writ-maps','Enter the sealed map room with Brunna’s order.','halls-omitted-route','The map-room keeper breaks an old wax strip and admits no Threadbearer has requested these plans in twenty-three years.',{reputation:{accuracy:1}}),
      advance('deep-writ-workers','Ask a drain crew to witness the map-room inspection.','halls-omitted-route','Two drain workers come with you. Their working memory will test whether the official plans describe any route that still exists.',{alliance:{worksfolk:1},testimony:'Drain workers witnessed the Deep Writ inspection.'})
    ]
  },

  'halls-omitted-route':{
    id:'halls-omitted-route',chapter:'halls',title:'The Map That Ends Early',
    objective:'Trace why modern civic plans omit the route below the Tangles.',
    story:`The sealed plan shows the maintenance throat, then stops at an ink border labeled “outside funded jurisdiction.” An older vellum map continues beneath the Archives and into the first cistern galleries. The route was not erased in one act. Each office copied only the section it funded until the full connection vanished from working maps. A column of denied repairs carries the Works Comptroller’s countersign.`,
    choices:[
      check('map-layers','Align the maps by founder benchmarks rather than modern property lines. (INT)','INT',11,'The layers meet. The same buried route passes under the Archives and descends toward an abandoned pressure stair.','A shifted terrace number creates a false junction. The drain workers catch it and provide the modern work-name for the pressure stair.', 'halls-comptroller',{success:{evidence:'Successive civic maps cropped one continuous maintenance route at office boundaries.',reputation:{accuracy:2},flags:{archiveRoute:true}},failure:{testimony:'Drain workers identified the pressure stair omitted by modern terrace numbers.',alliance:{worksfolk:1},reputation:{humility:1}}},{bonuses:[{item:'Piera’s Route Map',bonus:2,label:'lived route'},{item:'Surveyor’s Chalk',bonus:1,label:'founder benchmarks'}]}),
      advance('map-workers-route','Follow the drain workers’ name for the route instead of the Comptroller’s filing chain.','archives-entry','The crew leads you through a staffed pump room to an Archives foundation door. You postpone the office confrontation but record every denied repair attached to the route.',{evidence:'Repeated repair denials left the Archives pressure stair unmaintained.',alliance:{worksfolk:2},route:'worker route'})
    ]
  },

  'halls-comptroller':{
    id:'halls-comptroller',chapter:'halls',title:'A Responsible Delay',
    objective:'Obtain the denied repair files from the Works Comptroller.',
    story:`Comptroller Halvek receives you in a dry office above the wet Halls. He does not deny his signatures. “Every request was reviewed under the budget and jurisdiction then in force,” he says. He proposes another survey, another ownership ruling, and another winter allocation. Your Deep Writ requires him to release the files, but it cannot make him accept responsibility. A fresh request from the Archives pressure stair lies beneath a stack of ornamental foundry contracts on his desk.`,
    choices:[
      check('comptroller-chain','Read the denial chain aloud and ask where responsibility finally rests. (CHA)','CHA',12,'Halvek cannot name an office that owns the whole route. He releases the files and authorizes an emergency crew rather than let the silence enter the ledger beside his name.','Halvek releases only what the Writ requires. The record still shows how every lawful refusal produced an unlawful whole.', 'archives-entry',{success:{evidence:'The Comptroller admitted no office accepts responsibility for the continuous route.',repair:'Emergency crew assigned to the Archives pressure stair.',alliance:{wardens:1},reputation:{courage:1}},failure:{evidence:'Every repair refusal was procedurally lawful, but together they abandoned a public system.',consequence:'The Comptroller withheld discretionary repair funds.'}},{bonuses:[{evidence:'Successive civic maps cropped one continuous maintenance route at office boundaries.',bonus:1,label:'map chain'},{item:'Thread Ledger',bonus:1,label:'tamper-evident record'}]}),
      check('comptroller-request','Use the fresh Archives request to prove the danger is current. (INT)','INT',11,'The request carries the same overtone notation as the bell-stair. Halvek releases the full maintenance series and a route token before the comparison becomes public without him.','The notation is buried in an obsolete code. You cannot prove the match here, but the request gives you lawful entry to the Archives foundation.', 'archives-entry',{success:{evidence:'The Archives pressure stair reports the same low overtone.',flags:{fullRepairFiles:true},reputation:{accuracy:2}},failure:{discovery:'A current Archives repair request uses an obsolete vibration code.',route:'archive request'}})
    ]
  },

  'archives-entry':{
    id:'archives-entry',chapter:'archives',title:'The Foundation Door',
    objective:'Bring the joined account to Lithen in the deep Archives.',
    arrivals:{
      'comptroller-chain:success':'A newly authorized repair crew reaches the foundation door beside you, carrying the maintenance files Halvek released.',
      'comptroller-chain:failure':'You reach the foundation door with the required files but no emergency crew or repair funds.',
      'comptroller-request:success':'The full maintenance series fills your document case when you present the Deep Writ at the foundation door.',
      'comptroller-request:failure':'The current repair request opens the foundation door, though its obsolete vibration code remains unresolved.'
    },
    story:`The foundation door opens into the Archives’ working levels. Restorers dry flood-stained records beside warm pipes, while indexers carry law tablets through galleries where every footstep returns twice. Lithen the Wise waits beside the three old Halls reports. Her age has bent her shoulders but not her attention. “Your route is older than the offices that divided it,” she says. “We will compare what repeats before we give it a name. A name is useful only after the evidence can carry it.”`,
    enter:{alliance:{lithen:1},item:{name:'Archive Lens',reason:'Lithen lends you her Archive Lens so you can examine altered ink and pressure marks during the comparison.'},milestone:'Brought the joined account to Lithen the Wise.'},
    choices:[
      advance('archives-follow','Follow Lithen to the resonant record well.','archives-record-well','She carries no weapon—only a lamp, a tuning weight, and your ledger copied onto a clean brass leaf.'),
      advance('archives-ask-record','Ask why the Archives foundation belongs in a water investigation.','archives-record-well','Lithen explains that early laws, maintenance patterns, and civic calibrations were stored together because the founders did not separate public duty from the works that sustained it.',{discovery:'Founder-era records join civic decisions to physical maintenance patterns.'})
    ]
  },

  'archives-record-well':{
    id:'archives-record-well',chapter:'archives',title:'The Resonant Record Well',
    objective:'Compare the overtone against preserved maintenance and civic records.',
    story:`Thin brass leaves line the cylindrical record well. Lithen strikes its rim with a padded weight. The note passes through layers dated to old repairs, and each layer changes the sound before it returns. She places your bell-stair and Tangles observations beside older cistern surveys. The same low overtone appears in distant systems that share no modern pipe or gear. Its oldest recorded traces are centuries old.

Lithen points to the matching marks. “This proves the disturbance is distributed. It does not yet prove what the disturbance is.”`,
    choices:[
      check('well-pattern','Separate the old stable return from the modern interference. (INT)','INT',13,'You identify a calm foundational pattern beneath the harsh overtone. The modern city is not producing a new sound so much as drowning an older relationship in conflicting repairs.','The layers blur until Lithen slows the return with a tuning weight. You cannot isolate the original pattern alone, but your failed comparison proves the disturbance is distributed across many systems.', 'archives-lithen',{success:{evidence:'A calm founder-era pattern persists beneath modern mechanical interference.',reputation:{accuracy:2},alliance:{lithen:1}},failure:{evidence:'The disturbance is distributed across multiple civic systems rather than one machine.',reputation:{humility:1}}},{bonuses:[{item:'Surveyor Hood',bonus:1,label:'listening plates'},{item:'Thread Ledger',bonus:1,label:'joined observations'},{flag:'fullRepairFiles',bonus:1,label:'complete repair series'}]}),
      check('well-testimony','Match worker descriptions to the dated returns. (CHA)','CHA',12,'The phrases workers used—pressure behind the teeth, water listening in the wall, a second pulse—align with distinct periods of neglected maintenance. Their practical language preserves data the official codes discarded.','Some testimony cannot be dated. Lithen keeps it in the record as lived evidence without forcing it into the wrong year.', 'archives-lithen',{success:{testimony:'Worker descriptions preserve changes omitted by official vibration codes.',alliance:{worksfolk:1,lithen:1},reputation:{compassion:1}},failure:{testimony:'Undated worker accounts remain useful evidence when clearly marked as undated.',reputation:{accuracy:1}}},{bonuses:[{alliance:'worksfolk',bonus:2,label:'worker trust'},{reputation:'compassion',threshold:3,bonus:1,label:'careful hearing'}]})
    ]
  },

  'archives-lithen':{
    id:'archives-lithen',chapter:'archives',title:'Lithen’s Name for the Deep',
    objective:'Understand Lithen’s theory without mistaking it for complete knowledge.',
    story:`Lithen places your ledger in the reading frame. Three older plates answer its low overtone: one from a cistern collapse, one from a Brassworks failure, and one made before the present city map. “No pipe or gear connects these records,” she says. “Yet a change in one part produces an answer elsewhere. The evidence suggests one continuous presence spread through water, stone, and metal.”

She rests both hands on the frame. “I cannot speak to its full nature. My old bones will not carry me into the farthest cistern fields, and the few Threadbearers who reached them left incomplete accounts. I can tell you what those accounts share. The presence responds to harmony and recoils from interference. It raises water as it spreads, but it does not choose targets or speak like a person.”

The water in a covered ink cup trembles with the returning note. “I have avoided naming it because a name can be mistaken for understanding. We cannot find its boundary, its depth, or any center to its awareness. For the sake of a careful discussion, I call it the Unfathomer. My present theory is that centuries of founder craft gave rise to it, and that our neglected works now cause it pain. That is a theory supported by evidence—not a revealed truth.”`,
    enter:{flags:{unfathomerNamed:true,keysKnown:true},discovery:'Lithen named the distributed living resonance the Unfathomer.',milestone:'Learned Lithen’s evidence-based theory of the Unfathomer.'},
    choices:[
      advance('lithen-origin','Ask what evidence could test the theory.','archives-first-register','Lithen names the First Register: the earliest surviving joined record of law, water, load, and tone. If its pattern matches the record well, her theory gains a foundation.',{reputation:{accuracy:1}}),
      advance('lithen-danger','Ask how the city can stop a dangerous presence that may not intend harm.','archives-first-register','“We can change the conditions reaching it, redirect those conditions, or separate the deep network from the city,” Lithen replies. “None is simple. We must begin by refusing to imagine that it understands a speech.”',{discovery:'The Unfathomer may perceive sustained pattern and intention, but it cannot negotiate in complex speech.'}),
      advance('lithen-city','Ask why the city’s social failures matter to physical resonance.','archives-first-register','Lithen explains that repeated law directs labor, repair, access, and neglect. Across generations those choices become physical pattern. In Brassreach, civic precedent and resonant structure have never been cleanly separate.',{evidence:'Generations of civic decisions became physical patterns through labor, repair, and neglect.'})
    ]
  },

  'archives-first-register':{
    id:'archives-first-register',chapter:'archives',title:'The First Register',
    objective:'Recover a readable account from the city’s earliest constitutional record.',
    story:`The First Register rests in a restoration cradle behind flood glass. No one stole or concealed it; water damage made its stone-backed leaves too fragile for ordinary use. Lithen opens a later ceremonial copy beside it. The newer text praises stewardship but omits the original maintenance tables and many worker signatures. Through the glass, the older leaves place the Founding Covenant beside practical instructions for public water, structural load, and shared custody of citywide instruments. Several crucial pages have fused together.`,
    choices:[
      check('register-lens','Use the Archive Lens to read pressure marks beneath the fused ink. (INT)','INT',13,'Hairline impressions reveal the missing refrain: Stone bears the load. Brass carries the song. Echo holds what the ages pass on. Three Keys wake the old works below; the living must choose where tomorrow will go.','The ink cannot be separated safely. You recover only the repeated relationship among Stone, Brass, Echo, and a living choice.', 'archives-restoration',{success:{evidence:'Recovered the complete founder refrain linking the Three Keys to a living choice.',item:{name:'First Register Rubbing',reason:'Lithen authorizes a pressure rubbing so the Gate team can carry the recovered refrain without risking the original.'},reputation:{accuracy:2}},failure:{evidence:'The First Register links Stone, Brass, Echo, and a living choice, though part of its refrain remains unreadable.'}},{bonuses:[{item:'Archive Lens',bonus:3,label:'restoration lens'},{item:'Oil Flask',bonus:1,label:'glass catch'}]}),
      check('register-restorers','Let the restorers direct your hands and separate one wet leaf at a time. (DEX)','DEX',12,'You hold the warped frame while the restorers wick water from the edges. The full calibration table survives, along with the signatures of workers omitted from later ceremonial copies.','One corner tears along an old crease. No words are lost, but the team must stop before recovering the final line of the refrain.', 'archives-restoration',{success:{testimony:'The First Register credits workers and stewards omitted from later ceremonial copies.',alliance:{lithen:1,worksfolk:1},repair:'First Register stabilized for continued restoration.'},failure:{consequence:'A fragile corner of the First Register tore during emergency restoration.',evidence:'The main calibration table survived intact.'}},{bonuses:[{item:'Foundry Gloves',bonus:1,label:'steady grip'},{reputation:'humility',threshold:1,bonus:1,label:'followed expert direction'}]}),
      check('register-law','Trace how later copies narrowed the Covenant’s public duties. (CHA)','CHA',12,'Lithen’s indexers assemble a clear chain: broad duties became ceremonial ideals while repair authority migrated toward hereditary offices. The record names no single villain, but it makes the long direction of policy visible.','The legal revisions are too numerous for one conclusion tonight. You preserve three representative changes and mark the wider claim for later review.', 'archives-restoration',{success:{evidence:'Later law preserved the Covenant’s language while narrowing its public duties.',reputation:{accuracy:1,courage:1},alliance:{lithen:1}},failure:{evidence:'Three documented revisions narrowed public maintenance duties; the larger legal pattern remains under review.'}},{bonuses:[{item:'Thread Ledger',bonus:1,label:'revision chain'},{evidence:'Generations of civic decisions became physical patterns through labor, repair, and neglect.',bonus:1,label:'civic pattern'}]})
    ]
  },

  'archives-restoration':{
    id:'archives-restoration',chapter:'archives',title:'The Echo Instrument',
    objective:'Demonstrate that the recovered pattern can be carried without distortion.',
    story:`The Echo Key rests inside the record well’s oldest indexing frame. Lithen turns its concentric leaves until the First Register’s recovered interval sounds through the chamber. “This instrument preserves a reference,” she says. “It lets an operator compare what a system was, what changed, and which earlier state remained stable. That is Pattern.” Archive custody prevents one ruler from changing both the city and the record of what came before. Lithen will release the Key only if your joined account passes through the well without hiding a contradiction.`,
    choices:[
      check('echo-full-record','Send the full account—including failures and corrections—through the record well. (INT)','INT',13,'The account returns with every correction visible and its central pattern intact. The Key produces a clear, steady interval.','The well exposes two missing dates. You add them as unknowns rather than guesses; the Key produces a weaker but stable interval, and Lithen accepts the honest limit.', 'archives-echo-key',{success:{evidence:'The joined account remained coherent through the Echo Key’s record test.',alliance:{lithen:2},reputation:{accuracy:2}},failure:{consequence:'Two dates remain unresolved in the joined account.',reputation:{humility:1},alliance:{lithen:1}}},{bonuses:[{item:'Thread Ledger',bonus:2,label:'complete ledger'},{reputation:'accuracy',threshold:6,bonus:1,label:'record accuracy'}]}),
      check('echo-witnesses','Have workers and restorers witness how their words return. (CHA)','CHA',12,'Each witness hears their account preserved in context rather than flattened into one official voice. The Key holds the differences without losing the shared pattern.','The first return overemphasizes your summary. You revise the leaf until the witnesses recognize their own statements.', 'archives-echo-key',{success:{testimony:'Workers and restorers witnessed their differing accounts preserved by the Echo instrument.',alliance:{worksfolk:2,lithen:1},reputation:{compassion:2}},failure:{reputation:{humility:1,accuracy:1},consequence:'The Echo test required revision after witness statements were over-summarized.'}},{bonuses:[{alliance:'worksfolk',bonus:1,label:'witness trust'},{reputation:'compassion',threshold:4,bonus:1,label:'representative record'}]})
    ]
  },

  'archives-echo-key':{
    id:'archives-echo-key',chapter:'archives',title:'Custody of Echo',
    objective:'Carry the Echo Key and the First Register findings to Orra Vale.',
    story:`Lithen seats the Echo Key in a padded travel cradle and records its transfer before the restorers. “Pattern is not obedience to the past,” she says. “It lets us see what we are continuing—and decide whether to continue it.” The Key now carries the stable interval recovered from the First Register. Reports from below say the same rising-water sequence is striking the foundations held by Orra Vale’s Mullinen watch. Lithen does not claim to know what waits there. She can prove only that the oldest records describe a stable relationship the modern city has lost.`,
    enter:{key:'Echo',keyReason:'Lithen and the Archive witnesses release the calibration instrument after your record passes the Echo test.',milestone:'Earned institutional custody of the Echo Key.',flags:{echoEarned:true}},
    choices:[
      advance('echo-descend','Take the pressure stair toward Orra’s watch.','depths-descent','The Echo Key repeats a quiet interval against your hip. Several breaths later, the same interval vibrates through the water far below.',{route:'Archive pressure stair'}),
      advance('echo-copy','Send one copy of the joined account to Brunna before descending.','depths-descent','A runner carries the sealed copy upward. Whatever happens below, the evidence can no longer vanish with one expedition.',{repair:'A sealed copy of the investigation was secured aboveground.',reputation:{accuracy:1}})
    ]
  },

  'depths-descent':{
    id:'depths-descent',chapter:'depths',title:'Orra’s Lower Watch',
    objective:'Reach Commander Orra Vale and assess the failing pressure stair.',
    story:`The pressure stair descends through cold mist into the first cistern galleries. Commander Orra Vale waits beside a barricade built from doors, braces, and a retired bell frame. Her exhausted Mullinen watch has kept the stair open while three lower platforms flooded. “Eighteen pump workers are trapped below,” she says. “If I send the whole watch after them, this stair may close behind us. If I hold the stair, the next pressure pulse takes the platform.” She studies your Deep Writ. “Give me a route that saves people and keeps the city supplied. I have no use for a heroic death.”`,
    enter:{alliance:{orra:1,wardens:1},milestone:'Reached Orra Vale’s lower watch.'},
    choices:[
      advance('orra-status','Ask for the people, loads, and time remaining.','depths-platform','Orra gives exact numbers: eleven watch members, eighteen trapped pump workers, two sound braces, and perhaps forty minutes before the next major pulse.',{reputation:{accuracy:1}}),
      advance('orra-history','Show Orra the First Register’s account of Mullinen’s duty.','depths-platform','Orra reads the old wording twice: the works shall bear the people; the people shall not be spent to preserve the works. She says nothing, but folds the copy into her coat.',{alliance:{orra:1},evidence:'Mullinen’s original principle put public life before preserving infrastructure.'})
    ]
  },

  'depths-platform':{
    id:'depths-platform',chapter:'depths',title:'The Ninth Platform',
    objective:'Rescue the pump crew before the next pressure pulse.',
    story:`The Ninth Platform hangs above a black reservoir on three chains and one cracked stone bracket. Eighteen pump workers crowd its upper rail. The water rises across the entire reservoir at once, without a wave traveling from any shore. The pressure lifts the platform and drops it back onto the failing bracket. “One more strike will break it,” Orra says. She can hold the stair open or lead the rescue, but she cannot do both.`,
    choices:[
      check('platform-brace','Hold the cracked bracket while Orra evacuates the platform. (STR)','STR',14,'You and two Wardens force a spare brace beneath the load. Orra brings every worker across before the bracket splits.','The brace seats too late to save the platform, but your warning gives Orra time to pull the last workers onto the chain ladder. Equipment is lost; lives are not.', 'depths-lower-watch',{success:{repair:'Ninth Platform stabilized long enough for a complete evacuation.',alliance:{orra:2,wardens:1},reputation:{courage:2},attributes:{STR:1}},failure:{consequence:'The Ninth Platform and its pumps were lost after the crew escaped.',hp:-2,hpReason:'struck by the failing platform brace',alliance:{orra:1}}},{bonuses:[{equippedAny:['Mender’s Clamp','Rope Coil'],bonus:2,label:'bracing gear'},{derived:'power',threshold:6,bonus:1,label:'power rating'}]}),
      check('platform-counterload','Shift the surviving chains so the next water pulse supports the platform. (INT)','INT',14,'You read the Echo interval and move the chains one link before the pulse. The rising water pushes against the platform’s fall and holds it level while the workers cross.','The interval changes near the reservoir wall. You stop before the counterload overturns the platform and direct the crew onto the chain ladder instead.', 'depths-lower-watch',{success:{repair:'Ninth Platform chains rebalanced against the pressure pulse.',evidence:'The rising water responds as one distributed motion across the reservoir.',reputation:{accuracy:2},attributes:{INT:1},alliance:{orra:1}},failure:{consequence:'The platform could not be rebalanced; its pumps were abandoned.',evidence:'Pressure timing changes near the reservoir wall.'}},{bonuses:[{item:'Echo Key',bonus:2,label:'pattern reference'},{equippedAny:['Surveyor’s Chalk','Mender’s Clamp'],bonus:1,label:'marked chain setting'}]}),
      check('platform-command','Give the Watch and pump crew one timed evacuation plan. (CHA)','CHA',13,'You give each group a concrete task and place Orra where her authority matters most. The final worker crosses as the bracket tears free.','Competing orders cost precious seconds. Everyone survives, but a Warden is hurt catching a worker at the stair.', 'depths-lower-watch',{success:{testimony:'Watch and pump workers completed a shared evacuation under one timed plan.',alliance:{orra:1,worksfolk:2,wardens:1},reputation:{compassion:2},attributes:{CHA:1}},failure:{hp:-1,hpReason:'injured while catching a worker at the stair',consequence:'A Warden was injured during the Ninth Platform evacuation.',alliance:{worksfolk:1}}},{bonuses:[{alliance:'worksfolk',bonus:1,label:'worker trust'},{alliance:'wardens',bonus:1,label:'Watch support'}]})
    ]
  },

  'depths-lower-watch':{
    id:'depths-lower-watch',chapter:'depths',title:'What the Works Are For',
    objective:'Decide how Orra’s watch will hold the route.',
    arrivals:{
      'platform-brace:success':'The rescued crew carries the spare brace back to Orra’s barricade, where it becomes proof that preparation saved lives.',
      'platform-brace:failure':'The workers return without their pumps, carrying one injured Warden and a clear account of why the platform had to be abandoned.',
      'platform-counterload:success':'The rebalanced chains leave the Ninth Platform standing behind you, though no one mistakes the temporary repair for safety.',
      'platform-counterload:failure':'The empty chain ladder swings above the lost pumps as the rescued crew reaches Orra’s barricade.',
      'platform-command:success':'Watch members and pump workers arrive together, still repeating the timing that carried them across.',
      'platform-command:failure':'The rescued crew reaches the barricade while a medic binds the Warden injured by the conflicting orders.'
    },
    story:`At the barricade, pump workers demand that Orra seal the lower stair before another platform fails. Her oldest sergeant answers, “Mullinens do not surrender a public work.” Orra opens the copied First Register and reads Mullinen’s older instruction aloud: “The works shall bear the people. The people shall not be spent to preserve the works.” She turns to you. “Record what happened at the Ninth Platform. Then tell me what we can still defend without feeding this stair more lives.”`,
    choices:[
      check('orra-evacuate','Record the lost platform as a successful rescue, not a failed defense. (CHA)','CHA',12,'Orra orders the exhausted watch back by shifts and assigns pump workers to design the next brace. Duty becomes a shared repair instead of a test of who can suffer longest.','The sergeant rejects your wording, but Orra still orders rest rotations after seeing the injury list entered beside the structural loss.', 'depths-foundation',{success:{alliance:{orra:2,worksfolk:1},reputation:{compassion:2},testimony:'Orra restored Mullinen’s principle that the works exist to carry people.'},failure:{alliance:{orra:1},repair:'Orra established rest rotations for the lower watch.'}},{bonuses:[{evidence:'Mullinen’s original principle put public life before preserving infrastructure.',bonus:2,label:'First Register principle'},{reputation:'compassion',threshold:5,bonus:1,label:'humane record'}]}),
      check('orra-reinforce','Design a smaller defensible line around the surviving load paths. (INT)','INT',13,'You mark a line that protects the evacuation route and abandons stone already beyond repair. Orra recognizes the difference between endurance and waste.','One brace cannot be trusted. Orra withdraws farther than planned, preserving the watch but losing access to a pump gallery.', 'depths-foundation',{success:{repair:'Lower watch consolidated around tested load paths.',alliance:{orra:2,wardens:1},reputation:{accuracy:2}},failure:{consequence:'A pump gallery was abandoned during the Watch withdrawal.',alliance:{orra:1}}},{bonuses:[{item:'Surveyor’s Chalk',bonus:1,label:'load marks'},{evidence:'A calm founder-era pattern persists beneath modern mechanical interference.',bonus:1,label:'stable reference'}]})
    ]
  },

  'depths-foundation':{
    id:'depths-foundation',chapter:'depths',title:'The Stone Test',
    objective:'Prove which foundation can carry the descent and the city above it.',
    story:`Beyond the watch line, three founder piers carry the weight of an entire terrace. Modern braces press against them from conflicting angles. A pump worker taps two expensive additions. “Those shake in every pulse, but neither carries the floor,” she says. The Stone Key sits in a calibration socket inside the center pier. Orra cannot release it until the crew removes or marks the false supports and proves where the terrace’s weight actually falls.`,
    choices:[
      check('stone-strip','Remove the false braces one at a time and expose the original load path. (STR)','STR',14,'Each removed brace makes the true foundation easier to read. The center pier takes the load cleanly, and the Stone instrument settles in its socket.','One brace carries more than its rust suggests. You stop before removing it and mark a narrower safe path through the chamber.', 'depths-stone-key',{success:{repair:'Founder piers returned to a clear, shared load path.',reputation:{courage:2,accuracy:1},alliance:{orra:1}},failure:{repair:'A narrow safe path was marked through the foundation chamber.',consequence:'Conflicting braces still obscure part of the terrace load.'}},{bonuses:[{item:'Mender’s Clamp',bonus:2,label:'controlled release'},{derived:'power',threshold:6,bonus:1,label:'power rating'}]}),
      check('stone-calculate','Use settlement marks and the Echo return to calculate the true load. (INT)','INT',14,'The figures reveal that two expensive modern braces carry nothing while an unremarked worker repair bears a quarter of the terrace. You transfer the force into the founder pier and document the hidden labor.','The moving water changes one reading. You still identify the safe pier, but the full terrace calculation must remain provisional.', 'depths-stone-key',{success:{evidence:'An undocumented worker repair carried a critical share of the terrace load.',repair:'Terrace load transferred into the center founder pier.',reputation:{accuracy:2},alliance:{worksfolk:1}},failure:{evidence:'The center founder pier is safe, but the full terrace load remains provisional.'}},{bonuses:[{item:'Echo Key',bonus:2,label:'pattern return'},{item:'First Register Rubbing',bonus:1,label:'founder table'}]}),
      check('stone-witness','Have Orra, workers, and Wardens agree to the load record before moving it. (CHA)','CHA',13,'Every group signs the calculation and names the repairs it will maintain. The Key registers not the signatures themselves, but the stable physical pattern their coordinated work creates.','The sergeant disputes abandoning a ceremonial brace. Orra overrules him and accepts responsibility in the ledger, though the agreement remains narrow.', 'depths-stone-key',{success:{testimony:'Wardens and workers signed a shared foundation maintenance record.',alliance:{orra:2,wardens:1,worksfolk:1},reputation:{compassion:1}},failure:{alliance:{orra:1},consequence:'The foundation plan proceeds without full Watch agreement.'}},{bonuses:[{alliance:'orra',bonus:1,label:'Orra’s trust'},{alliance:'worksfolk',bonus:1,label:'worker support'}]})
    ]
  },

  'depths-stone-key':{
    id:'depths-stone-key',chapter:'depths',title:'Custody of Stone',
    objective:'Carry the Stone Key toward the Brassworks route.',
    story:`The Stone Key is a dense black instrument crossed by one pale seam. When Orra lifts it from the calibrated pier, the pale line follows the true load through the floor. “Stone does not care who paid for a brace or whose crest is stamped on it,” she says. “It shows what bears the weight.” She records the transfer under Mullinen authority, then assigns two rested Wardens and three pump workers to maintain the repaired path behind you.`,
    enter:{key:'Stone',keyReason:'Orra and the lower watch release the load instrument after the foundation is made legible.',milestone:'Earned institutional custody of the Stone Key.',flags:{stoneEarned:true}},
    choices:[
      advance('stone-route','Take the old supply channel toward the Brassworks.','depths-cistern-crossing','The channel is steep, wet, and still marked with delivery signs from the city’s first foundries.',{route:'old supply channel'}),
      advance('stone-send-word','Ask Orra to send the foundation record to Brunna and Lithen.','depths-cistern-crossing','Orra dispatches a rested runner with copies for the Watch and Archives. The joined repair now exists above and below.',{repair:'Foundation record distributed to Watch and Archives.',alliance:{orra:1}})
    ]
  },

  'depths-cistern-crossing':{
    id:'depths-cistern-crossing',chapter:'depths',title:'The Breathing Water',
    objective:'Cross the cistern without treating the Unfathomer as a speaking foe.',
    story:`The supply channel opens above a cistern so broad that your lamp cannot find the far wall. The entire surface rises at once, smooth as dark glass, and then settles. No wave travels across it. No voice enters your mind. When the Echo Key repeats the stable interval from the repaired route, the current beneath the bridge slows. When a damaged pump scrapes against its housing, a shudder appears across the whole cistern at the same instant. Whatever connects the water responds as one body.`,
    choices:[
      check('cistern-chord','Carry the stable Echo interval across the bridge plates. (INT)','INT',14,'You strike only the interval preserved from the First Register. The water settles beneath each plate long enough for the party to cross, responding to coherence rather than command.','A corroded plate changes the interval. The water rises against the bridge, forcing a slower crossing along the wall chain.', 'brassworks-threshold',{success:{evidence:'The distributed water eased around a stable founder interval without receiving a spoken command.',reputation:{accuracy:2},repair:'A coherent crossing interval was established across the cistern bridge.'},failure:{hp:-1,hpReason:'battered by water while reaching the exposed wall chain',consequence:'The cistern crossing required the exposed wall chain.'}},{bonuses:[{item:'Echo Key',bonus:2,label:'stable interval'},{item:'Stone Key',bonus:1,label:'load reading'}]}),
      check('cistern-chain','Lead the party hand-over-hand along the wall chain. (DEX)','DEX',13,'You time each movement between pressure rises and bring the party across without disturbing the damaged pump.','The chain tears free at the last anchor. You reach the far ledge, but a Warden loses gear to the water and the route cannot be used for return.', 'brassworks-threshold',{success:{reputation:{courage:2},route:'quiet wall-chain crossing'},failure:{hp:-1,hpReason:'cut by the wall chain when its last anchor failed',consequence:'The wall-chain route collapsed after the crossing.'}},{bonuses:[{equipped:'Cistern Boots',bonus:2,label:'wet-footing boots'},{item:'Rope Coil',bonus:1,label:'backup line'}]}),
      check('cistern-pump','Quiet the damaged pump before crossing. (STR)','STR',14,'You lock its broken arm against the housing. The shudder stops, and the entire cistern calms by degrees.','The arm bucks free and throws you against the rail. You disable it, but the last impact sends a high surge through the chamber.', 'brassworks-threshold',{success:{repair:'Damaged cistern pump secured against its housing.',evidence:'Removing one discordant impact calmed water across the full cistern.',reputation:{courage:1}},failure:{hp:-2,hpReason:'thrown against the rail by the damaged pump arm',repair:'Damaged pump disabled after a final pressure surge.'}},{bonuses:[{item:'Mender’s Clamp',bonus:2,label:'housing clamp'},{derived:'power',threshold:6,bonus:1,label:'power rating'}]})
    ]
  },

  'brassworks-threshold':{
    id:'brassworks-threshold',chapter:'brassworks',title:'The Silent Brassworks',
    objective:'Enter the abandoned tuning floor and find the Brass Choir team.',
    story:`The old Brassworks should ring with test notes, furnace chains, and shift bells. Instead, the floor stands silent behind heavy felt screens. A hammer strike on one wall can now open a loose valve on another. Sella Flintwake waits with a small Brass Choir team. She salvages the lower works and trained with the Choir before failed budgets scattered its crews. “No one is singing bolts out of walls today,” she says. “We measure first, then we breathe, then we move one part at a time.” The Choir cannot release the Brass Key until the floor carries one coherent adjustment without breaking another machine.`,
    enter:{alliance:{choir:1},milestone:'Reached the Brass Choir team in the silent Brassworks.'},
    choices:[
      advance('works-hear-sella','Ask Sella what happened during the failed repairs.','brassworks-sella','Sella shows you three contractor marks. Each crew tuned one machine correctly in isolation. When the machines ran together, their mismatched intervals struck the floor hard enough to crack it.',{evidence:'Isolated repairs became destructive when their tones were combined.'}),
      advance('works-hear-workers','Ask the furnace workers what changed before the floor closed.','brassworks-sella','They identify a cheap replacement bell-metal used after the Choir budget was cut. Its tone drifts when heated, pulling every linked mechanism out of agreement.',{testimony:'Furnace workers traced the tuning drift to cheap replacement bell-metal.',alliance:{worksfolk:1}})
    ]
  },

  'brassworks-sella':{
    id:'brassworks-sella',chapter:'brassworks',title:'Sella’s Salvage Table',
    objective:'Prepare for the tuning floor and learn what its discarded parts reveal.',
    story:`Sella’s salvage table stands beneath the silent shift bell. Every tool carries a tag naming where she found it and what defect it may have. She sets three pieces of metal in front of you: founder alloy worn thin by honest use, a careful worker patch, and a polished modern housing hiding brittle brass. “That is the floor’s history in three scraps,” she says. She offers to trade, then unwraps a resonance fork recovered beside the failed anchor. Its prongs still hold the last stable setting.`,
    enter:{item:{name:'Resonance Fork',reason:'Sella lends you the fork recovered from the failed anchor so its last stable setting can guide the repair.'},alliance:{sella:1}},
    choices:[
      merchant('sella-shop','Trade with Sella before entering the tuning floor.','sella'),
      advance('sella-anchor','Take the resonance fork to the repair crew.','brassworks-choir','Sella wraps the fork in felt. “It gives an honest reading,” she says. “Keep your hand steady when you hear how bad the floor has become.”',{reputation:{accuracy:1}})
    ]
  },

  'brassworks-choir':{
    id:'brassworks-choir',chapter:'brassworks',title:'A Chord Built by Many Hands',
    objective:'Choose a repair plan shared by Choir tuners and Worksfolk.',
    story:`Sella lays a worker’s sketch beside the Choir measurements. Together they divide the floor into four linked systems: furnace draft, water pressure, lifting gear, and the great tuning anchor. Choir members know the safe intervals. Furnace workers know how heat changes the alloy. Pump crews know how long pressure takes to cross the floor. “Any one of us can tune our own machine,” Sella says. “The trouble begins when we pretend the others are not attached.” No group can repair the whole floor alone.`,
    choices:[
      check('choir-plan','Build one repair sequence from Choir measurements and worker timings. (INT)','INT',13,'The combined plan gives each system time to settle before the next begins. Sella marks it as the first credible full-floor sequence in two generations.','Two timing notes conflict. You preserve both and choose a slower sequence with wider safety margins.', 'brassworks-anchor',{success:{repair:'Choir and Worksfolk agreed on a coherent full-floor tuning sequence.',alliance:{choir:2,worksfolk:2},reputation:{accuracy:2}},failure:{repair:'A slower Brassworks tuning sequence was adopted with wider safety margins.',alliance:{choir:1,worksfolk:1}}},{bonuses:[{testimony:'Furnace workers traced the tuning drift to cheap replacement bell-metal.',bonus:1,label:'worker timing'},{item:'Resonance Fork',bonus:1,label:'anchor reference'}]}),
      check('choir-authority','Use the Deep Writ to require each specialist’s objection in the record. (CHA)','CHA',13,'Once objections must be answered rather than overruled, the team discovers that three “minor” worker concerns predict the same dangerous beat. The plan changes before anyone enters the floor.','The formal hearing hardens old resentments. Still, the written objections expose one unsafe interval and prevent a reckless start.', 'brassworks-anchor',{success:{testimony:'Choir and Worksfolk objections were answered in one public repair record.',alliance:{choir:1,worksfolk:2},reputation:{compassion:2}},failure:{evidence:'A recorded worker objection exposed an unsafe tuning interval.',consequence:'Choir and Worksfolk cooperation remains strained.'}},{bonuses:[{item:'Deep Writ Seal',bonus:1,label:'public authority'},{reputation:'compassion',threshold:5,bonus:1,label:'fair hearing'}]})
    ]
  },

  'brassworks-anchor':{
    id:'brassworks-anchor',chapter:'brassworks',title:'The First Harmonic Anchor',
    objective:'Restore the first anchor without waking every damaged machine at once.',
    story:`The tuning anchor is a brass column rooted in resonant stone. Three repair crews tightened its outer rings to three different “correct” positions. Heat rolls across the floor, and the damaged alloy shifts as it warms. Each shift produces a harsh beat. Dark water rises in the inspection channels whenever that beat sounds, then falls when the crew restores a stable interval. The movement follows the sound, not the people on the gantry.`,
    choices:[
      check('anchor-retune','Retune the rings through the shared slow sequence. (INT)','INT',15,'The Echo Key preserves the pattern, Stone shows the load, and the resonance fork finds the interval between them. When the anchor settles, lights kindle across the floor and the inspection water falls.','The third ring drifts under heat. You lock the first two into a stable partial chord and shut down the furnace before the interference can spread.', 'brassworks-interference',{success:{repair:'First Brassworks harmonic anchor restored to a coherent chord.',evidence:'The inspection water receded when the anchor reached stable harmony.',alliance:{choir:1,worksfolk:1},reputation:{accuracy:2}},failure:{repair:'First harmonic anchor stabilized at a partial chord.',consequence:'The furnace remains shut down until the third ring is replaced.'}},{bonuses:[{item:'Resonance Fork',bonus:2,label:'anchor reference'},{item:'Echo Key',bonus:1,label:'pattern'},{item:'Stone Key',bonus:1,label:'load'}]}),
      check('anchor-replace','Replace the drifting bell-metal ring during a cold interval. (DEX)','DEX',14,'Workers cool the housing while you lift the warped ring free and seat Sella’s older alloy. The anchor holds the shared tuning without further drift.','The cold interval closes before the final pin seats. You withdraw safely, but the crew must clamp the ring and keep the anchor below full power.', 'brassworks-interference',{success:{repair:'Inferior bell-metal ring replaced with stable reclaimed alloy.',alliance:{worksfolk:2,sella:1},reputation:{courage:1},item:{name:'Foundry Gloves',reason:'The furnace crew gives you heat-capped gloves after the successful ring change.'}},failure:{repair:'Drifting anchor ring clamped below full power.',hp:-1,hpReason:'burned while withdrawing from the warming anchor'}},{bonuses:[{equippedAny:['Foundry Gloves','Mender’s Clamp','Cistern Boots'],bonus:2,label:'prepared work gear'}]}),
      check('anchor-call','Guide the specialists through the sequence from the safe gantry. (CHA)','CHA',14,'You call each change only after its worker confirms that the previous system is stable. Every crew can hear when its work enters the final chord.','One command repeats through the echo and reaches a crew late. Sella catches the error, but the anchor must remain at a partial setting.', 'brassworks-interference',{success:{repair:'First anchor tuned through a witnessed multi-crew sequence.',alliance:{choir:2,worksfolk:2},reputation:{compassion:1}},failure:{repair:'First anchor held at a partial setting after a delayed command.',consequence:'The floor lost time correcting an echoed instruction.'}},{bonuses:[{alliance:'choir',bonus:1,label:'Choir trust'},{alliance:'worksfolk',bonus:1,label:'crew trust'}]})
    ]
  },

  'brassworks-interference':{
    id:'brassworks-interference',chapter:'brassworks',title:'The Returning Beat',
    objective:'Find the remaining source of destructive interference.',
    story:`The repaired anchor makes a second, slower beat easier to hear. Your First Register rubbing shows an old lift engine below the floor at the matching interval. Silt and mineral growth have fused around its flywheel, and a stoneback crawler has made a nest inside the warm housing. Each time the new chord reaches the engine, the animal shifts its armored body and knocks the flywheel against its stops.`,
    choices:[
      check('crawler-lure','Use the salt-hound whistle and warmth to draw the crawler from the housing. (CHA)','CHA',13,'The whistle’s low call and a heated oil pan offer a calmer signal than the anchor. The crawler uncurls and follows it into an empty slag bay.','The crawler leaves the flywheel but blocks the safest exit. The crew withdraws while you keep its attention.', 'brassworks-crawler',{success:{repair:'Stoneback crawler relocated from the lift housing without harm.',reputation:{compassion:2},item:{name:'Stoneback Plate',reason:'Sella recovers a naturally shed plate from the abandoned nest and fits it as armor.'}},failure:{hp:-1,hpReason:'struck while holding the crawler’s attention',consequence:'The crawler was moved from the mechanism but still blocks the slag-bay route.'}},{bonuses:[{item:'Salt-Hound Whistle',bonus:3,label:'animal call'},{item:'Oil Flask',bonus:1,label:'heated lure'}]}),
      check('crawler-wheel','Lock the flywheel between the crawler’s movements. (DEX)','DEX',14,'You read the rhythm, drive the lockpin on the quiet beat, and isolate the engine before the crawler strikes again. It retreats from the still housing.','The pin bends on the first attempt. You stop the engine with a heavier catch, but the impact cracks its outer gear.', 'brassworks-crawler',{success:{repair:'Abandoned lift engine isolated from the tuning network.',reputation:{courage:1,accuracy:1}},failure:{repair:'Lift engine stopped with damage to its outer gear.',item:{name:'Bent Lockpin',reason:'You keep the bent pin as evidence of the force inside the fused flywheel.'}}},{bonuses:[{equipped:'Lockpin',bonus:2,label:'flywheel catch'},{item:'Echo Key',bonus:1,label:'movement pattern'}]}),
      check('crawler-free','Break the mineral crust and free both the animal and the flywheel. (STR)','STR',15,'You break the crust into controlled sections. The crawler drops into the slag bay, and the old flywheel turns freely enough to retune.','The crust fractures all at once. You shield the crawler from falling stone, but the lift engine is damaged beyond safe use.', 'brassworks-crawler',{success:{repair:'Lift flywheel freed and made available for retuning.',reputation:{courage:2},alliance:{worksfolk:1}},failure:{hp:-2,hpReason:'struck while shielding the crawler from falling stone',consequence:'The abandoned lift engine was damaged while the crawler escaped safely.',reputation:{compassion:1}}},{bonuses:[{derived:'power',threshold:7,bonus:1,label:'power rating'},{equipped:'Warden Pick',bonus:2,label:'controlled breaking'}]})
    ]
  },

  'brassworks-crawler':{
    id:'brassworks-crawler',chapter:'brassworks',title:'The Whole Floor Holds',
    objective:'Complete the full-floor tuning and demonstrate stable Tone.',
    arrivals:{
      'crawler-lure:success':'Sella closes the slag-bay gate after the stoneback crawler settles beside the heated pan.',
      'crawler-lure:failure':'The crew gives the blocked slag bay a wide berth and returns to the tuning controls by the longer route.',
      'crawler-wheel:success':'With the lift engine isolated, the second beat disappears from the floor.',
      'crawler-wheel:failure':'The cracked outer gear is unsafe to run, but the stopped engine can no longer disrupt the tuning sequence.',
      'crawler-free:success':'Workers turn the freed flywheel by hand and match it to the repaired anchor.',
      'crawler-free:failure':'The crew marks the damaged lift engine for removal and closes it out of the active network.'
    },
    story:`Sella raises one hand, and the crews begin the shared sequence. Furnace draft enters first, followed by water pressure, lifting gear, and the repaired anchor. The final chord holds because each system enters at the time its workers tested. Water settles in the inspection channels. A reply returns from the Tangles relief gate, then the Archive well, then Orra’s repaired foundation. The sites do not merely sound alike; the old network carries one stable change through all of them.`,
    choices:[
      check('whole-floor-hold','Hold the final interval on the resonance fork. (INT)','INT',14,'The interval travels through every repaired anchor without splitting. Sella confirms that the Brassworks can carry a city-scale adjustment.','The fork wavers as the furnace warms, but the crews correct together and establish a narrower stable range.', 'brassworks-brass-key',{success:{repair:'Brassworks full-floor harmony restored across all four systems.',evidence:'Repaired routes answered one another as a connected harmonic network.',alliance:{choir:2,worksfolk:1},reputation:{accuracy:2}},failure:{repair:'Brassworks stabilized within a narrow safe tonal range.',alliance:{choir:1,worksfolk:1}}},{bonuses:[{item:'Resonance Fork',bonus:2,label:'tone reference'},{repair:'First Brassworks harmonic anchor restored to a coherent chord.',bonus:1,label:'restored anchor'},{alliance:'choir',bonus:1,label:'Choir support'}]}),
      check('whole-floor-witness','Have every crew confirm the change before the Key is released. (CHA)','CHA',13,'The final chord holds while workers name what they repaired and what remains unsafe. Tone becomes a shared technical fact rather than a performance owned by the Choir.','Exhaustion makes the testimony uneven, but no one disputes that the floor now operates as one system.', 'brassworks-brass-key',{success:{testimony:'Every Brassworks crew witnessed the full-floor tuning and recorded unfinished work.',alliance:{choir:1,worksfolk:2},reputation:{compassion:2}},failure:{testimony:'Brassworks crews confirmed the stable tuning despite incomplete testimony.'}},{bonuses:[{alliance:'worksfolk',bonus:1,label:'crew trust'},{reputation:'compassion',threshold:6,bonus:1,label:'shared credit'}]})
    ]
  },

  'brassworks-brass-key':{
    id:'brassworks-brass-key',chapter:'brassworks',title:'Custody of Brass',
    objective:'Carry the third calibration instrument to the Gate route.',
    story:`The Brass Key resembles a tuning frame folded around a warm amber core. Sella and the senior Choir tuner record its release before the Works crews. The instrument carries Tone: a stable relationship among active systems, not the power to command them. Messages arrive through the repaired route. Brunna has opened emergency supply lines. Lithen is bringing the restored Register pattern. Orra’s rested watch still holds the foundation. Water gauges throughout the route have slowed for the first time in years. The city is not repaired, but the connected work has bought enough time to attempt the Gate.`,
    enter:{key:'Brass',keyReason:'The Brass Choir and Works crews release the tonal instrument after the full-floor sequence holds.',milestone:'Earned institutional custody of the Brass Key.',flags:{brassEarned:true,networkImproved:true}},
    choices:[
      advance('brass-gate','Join the converging teams at the Gate route.','gate-approach','Stone, Brass, and Echo rest in separate cradles. None is sufficient alone. Together they make the old works readable.',{route:'Brassworks Gate conduit'}),
      advance('brass-message','Send the stable interval upward before entering the Gate route.','gate-approach','Upper pumps adopt the safe interval. It cannot cure the city, but it prevents several fresh failures while the Gate team descends.',{repair:'Upper pump crews received the Brassworks safe interval.',reputation:{compassion:1}})
    ]
  },

  'gate-approach':{
    id:'gate-approach',chapter:'gate',title:'The Gate of Measures',
    objective:'Seat the Three Keys and read the founders’ instructions.',
    story:`The Gate fills a cavernous atrium: a circle of dark stone veined with brass, taller than any ordinary door. Moss and water cover its lower inscriptions. Lithen wipes one line clean and translates it aloud. The founders built this chamber to test the city’s physical load, the harmony of its working systems, and the pattern of its public decisions. It also preserves instructions for people who inherit the machinery without understanding it. The inscription predates every known account of the Unfathomer; the Gate was never meant to imprison anything. Orra arrives by the stabilized foundation stair, and Sella comes through the Brassworks line. The Three Keys will make separate parts of the old instructions readable. Your Thread Ledger will add the consequences witnessed on this expedition.`,
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
      check('gate-weight-public','Mark the vulnerable public works as the first loads to relieve. (INT)','INT',12,'The Stone reading confirms that redundant upper supports can carry a temporary transfer while the lower districts are stabilized.','One upper support proves ceremonial rather than structural. You revise the transfer to a smaller route that the reading confirms is safe.', 'gate-tone',{success:{repair:'Gate load route prioritizes vulnerable public works.',evidence:'Stone exposed unequal structural investment across city districts.',alliance:{orra:1}},failure:{repair:'Gate load route established at a smaller safe transfer.',consequence:'Several lower districts remain near their load limit.'}},{bonuses:[{item:'Stone Key',bonus:2,label:'Weight instrument'},{repair:'Founder piers returned to a clear, shared load path.',bonus:1,label:'foundation repair'}]}),
      check('gate-weight-evac','Use the reading to clear people from loads that cannot be repaired tonight. (CHA)','CHA',12,'Brunna’s messengers carry precise evacuation orders along routes already tested by your expedition. The Counter records lives moved before structures.','Two districts resist an order based on an unfamiliar instrument. Brunna secures the most vulnerable block while the rest remain on warning.', 'gate-tone',{success:{repair:'Gate reading guided targeted evacuations from failing loads.',reputation:{compassion:2},alliance:{wardens:1}},failure:{consequence:'Only the most vulnerable district completed evacuation before calibration.'}},{bonuses:[{alliance:'wardens',bonus:1,label:'Watch network'},{reputation:'compassion',threshold:7,bonus:1,label:'public trust'}]})
    ]
  },

  'gate-tone':{
    id:'gate-tone',chapter:'gate',title:'The Reading of Tone',
    objective:'Use Brass to carry a coherent adjustment through the old works.',
    story:`The Brass Key turns interference into visible bands of amber and black. The repaired anchors form a thin, steady path from the Tangles to the Archives, through Orra’s foundation, and across the Brassworks. Beyond that path, centuries of incompatible repairs remain. Sella studies the black bands. “If we force the loudest chord through every branch, those mismatched systems will tear at one another,” she says. “Send only what our repaired route can carry.”`,
    choices:[
      check('gate-tone-coherent','Send the modest stable interval through every repaired anchor. (INT)','INT',13,'The interval reaches every repaired site without splitting. Water levels pause along that route, and the steady amber path widens by degrees.','The interval divides at an unrepaired branch. You narrow the signal to the anchors you can verify, preserving their stability at the cost of reach.', 'gate-pattern',{success:{repair:'A coherent Gate interval reached every repaired anchor.',evidence:'The Unfathomer’s outward pressure eased along the connected repair path.'},failure:{repair:'Gate interval confined to verified anchors.',consequence:'Unrepaired branches remain outside the stable tonal path.'}},{bonuses:[{item:'Brass Key',bonus:2,label:'Tone instrument'},{repair:'Brassworks full-floor harmony restored across all four systems.',bonus:2,label:'full-floor harmony'}]}),
      check('gate-tone-crews','Let each crew answer from its anchor before extending the interval. (CHA)','CHA',13,'Voices and instruments confirm the route section by section. The resulting harmony carries the evidence of sustained cooperation, and the deep water settles around it.','One remote crew cannot answer. You leave that branch untouched and preserve the rest of the sequence.', 'gate-pattern',{success:{testimony:'Archive, Watch, Works, and Choir crews answered through one Gate sequence.',alliance:{choir:1,worksfolk:1,wardens:1,lithen:1,orra:1}},failure:{consequence:'One remote repair branch could not join the Gate sequence.'}},{bonuses:[{alliance:'choir',bonus:1,label:'Choir support'},{alliance:'worksfolk',bonus:1,label:'Works support'},{alliance:'orra',bonus:1,label:'Orra’s watch'}]})
    ]
  },

  'gate-pattern':{
    id:'gate-pattern',chapter:'gate',title:'The Reading of Pattern',
    objective:'Use Echo to show how Brassreach reached the present crisis.',
    story:`The Echo Key projects dated records across the Gate. Lithen reads them in order. Early plans treat natural water, resonant stone, skilled labor, and public care as parts of one system. Later maps restrict access, divide maintenance among offices, and move dangerous work into districts with little authority. No single decree creates the crisis. The same choices repeat until neglect becomes ordinary. Beneath those later records, the First Register shows that a more balanced system once worked. Lithen does not call that early age perfect. She calls it evidence.`,
    choices:[
      check('gate-pattern-full','Enter the complete Thread Ledger, including contradictions and costs. (INT)','INT',13,'The Gate aligns civic decisions with physical decline and every repair your route began. The Counter can now distinguish hope from preparation.','Two early observations remain ambiguous. You enter them as unresolved, and the larger progression still holds.', 'gate-counter',{success:{evidence:'The Gate linked centuries of civic division to physical discord without inventing a single culprit.',reputation:{accuracy:2},flags:{fullRecord:true}},failure:{evidence:'The Gate confirmed the broad progression into discord with two observations unresolved.'}},{bonuses:[{item:'Echo Key',bonus:2,label:'Pattern instrument'},{item:'Thread Ledger',bonus:1,label:'joined record'},{reputation:'accuracy',threshold:8,bonus:1,label:'record integrity'}]}),
      check('gate-pattern-witness','Have Lithen, Orra, Sella, and the workers attest to their parts of the record. (CHA)','CHA',13,'Each witness identifies the part of the record they can verify. Their separate accounts form one visible sequence, so no institution can later claim that the crisis belonged entirely to someone else.','The witnesses disagree over the importance of one repair. You preserve that dispute in the ledger, and every witness still attests to the larger sequence.', 'gate-counter',{success:{testimony:'Allied institutions attested to their place in the Gate’s historical pattern.',alliance:{lithen:1,orra:1,choir:1,worksfolk:1},flags:{broadWitness:true}},failure:{testimony:'Gate witnesses preserved one unresolved disagreement inside the common sequence.'}},{bonuses:[{alliance:'lithen',bonus:1,label:'Archive trust'},{alliance:'orra',bonus:1,label:'Watch trust'},{alliance:'choir',bonus:1,label:'Choir trust'}]})
    ]
  },

  'gate-counter':{
    id:'gate-counter',chapter:'gate',title:'The Counter Reading',
    objective:'Read the expedition’s actual preparation before entering the deepest network.',
    arrivals:{
      'gate-pattern-full:success':'The complete ledger settles into the Counter without hiding any recorded cost or contradiction.',
      'gate-pattern-full:failure':'The Counter marks two early observations as unresolved and continues with the evidence you could verify.',
      'gate-pattern-witness:success':'The witnesses seal their separate statements before the Counter begins its reading.',
      'gate-pattern-witness:failure':'One disputed repair remains visible beside the witnesses’ shared account.'
    },
    story:`The Counter is not a judge, and it does not speak. Brass drums rotate behind glass. Their markings total the loads shown by Stone, the stable route shown by Brass, the history shown by Echo, and the repairs and consequences in your ledger. The result is practical: Brassreach cannot be restored tonight. Yet the connected repairs have produced the first broad improvement in generations, and the city’s crews have begun to work toward the same purpose. That may be enough to ease the Unfathomer’s distress and buy real time if your final decision stays within what the repaired route can carry. The Gate does not open like a door. Water climbs its lower rings and forms a pressure-held passage into the deepest network.`,
    enter:{flags:{counterRead:true},milestone:'The Counter measured the expedition’s preparation without moral judgment.'},
    choices:[
      advance('counter-enter','Enter the water-lit passage with the Three Keys and the ledger.','choice-contact','The passage holds around you as a pressure boundary. Every repaired anchor remains faintly present through Stone, Brass, and Echo.',{reputation:{courage:1}})
    ]
  },

  'choice-contact':{
    id:'choice-contact',chapter:'choice',title:'The Unfathomer’s Nearness',
    objective:'Understand the response of the deep network without inventing speech.',
    story:`Inside the passage, you can no longer separate reservoir, stone, mechanism, and living presence by sight or touch. No face waits in the dark, and no voice speaks. Pressure changes around you all at once across distances too large for an ordinary current. The Three Keys show the same change at every repaired anchor. When the Gate carries the stable interval, the water releases its grip on the surrounding stone. When your ledger records the crews’ commitment to continue the work, that easing spreads farther. Lithen’s name for this continuous awareness—the Unfathomer—now fits the evidence before you. It cannot tell you what it wants in words, but it can perceive that the repaired harmony and the intention behind it offer relief. You cannot undo centuries of discord tonight. You can choose a direction the city can begin and sustain.`,
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
