// Brassreach authored campaign data.
// Narrative content stays separate from the engine so scenes, rewards, and balance
// can be revised without disturbing inventory, save, or interface code.

export const CAMPAIGN_VERSION = 1;

export const CAMPAIGN_CHAPTERS = {
  halls: { act:'TUNE', label:'Warden Halls' },
  archives: { act:'NAME', label:'Lithen Archives' },
  depths: { act:'MEASURE', label:'Mullinen Depths' },
  gate: { act:'DECIDE', label:'Gate of Measures' },
  unfathomer: { act:'DECIDE', label:'The Unfathomer' },
  epilogue: { act:'EPILOGUE', label:'Brassreach Remembered' }
};

export const MERCHANTS = {
  quartermaster: {
    id:'merchant-quartermaster', name:'Quartermaster Dorrin', title:'Warden Stores',
    greeting:'Dorrin opens an iron-bound case. “Take what keeps you alive. Bring back what the city can use.”',
    stock:['Rope Coil','Oil Flask','Lockpin','Foundry Gloves','Riveted Workcoat']
  },
  salvager: {
    id:'merchant-salvager', name:'Sella Flintwake', title:'Depths Salvage Cart',
    greeting:'Sella braces her cart against the channel wall. “Coin, salvage, or a useful trade. The flood will not wait for bargaining.”',
    stock:['Saltglass Salve','Cistern Boots','Echo Buckler','Resonance Fork','Slateweave Trousers']
  }
};

const choice=(id,label,options={})=>({id,label,...options});

export const CAMPAIGN_SCENES = {
  'halls-briefing': {
    id:'halls-briefing', chapter:'halls', title:'The Warden Briefing', objective:'Report to Quartermaster Dorrin and prepare for the lower halls.',
    story:'The Warden hall is crowded with surveyors, healers, and families from the flooded wards. Captain Brunna marks three failures on a brass map: broken channels beneath the Archives, a silent Mullinen watchpost, and a new pulse at the Gate of Measures. She orders you to find the cause before the next surge reaches the city.',
    choices:[
      choice('brief-ask-pattern','Ask Brunna what changed before the first surge.',{type:'check',stat:'CHA',dc:9,next:'halls-quartermaster',encounter:'briefing-brunna',success:'Brunna gives a direct answer: the Gate began sounding a fourth note after an Archive team carried a sealed record below.',failure:'Brunna has no time for debate. She points you toward the stores and orders you to move.',effects:{success:{discovery:'A sealed Archive record preceded the first surge.',gold:2},failure:{consequence:'Brunna withheld the Warden incident notes.'}}}),
      choice('brief-read-map','Study the flood marks and choose a safe route.',{type:'check',stat:'INT',dc:10,next:'halls-quartermaster',encounter:'briefing-map',bonuses:[{item:'Torch',bonus:1,label:'clear light'}],success:'You trace the pressure marks to a service culvert that should remain above the first flood surge.',failure:'The newest marks overlap old repairs. You choose the main Warden route instead.',effects:{success:{flag:'surveyRoute',discovery:'A service culvert offers a safer route through the Halls.'},failure:{consequence:'You must cross the exposed floodgate gallery.'}}})
    ]
  },
  'halls-quartermaster': {
    id:'halls-quartermaster', chapter:'halls', title:'The Last Open Storehouse', objective:'Gather supplies, then descend to the floodgate gallery.',
    story:'Quartermaster Dorrin checks your name against a slate and pushes a Warden Pick across the counter. “The city pays for results,” he says. “The pick is issued gear. Anything else comes from your purse.” Beyond him, the descent bell rings twice.',
    enter:{items:[{name:'Warden Pick',reason:'Dorrin issues the pick so you can clear damaged masonry and defend yourself below.'}],milestone:'Received a Warden commission and field weapon.'},
    choices:[
      choice('quartermaster-trade','Open Dorrin’s store case.',{type:'merchant',merchant:'quartermaster'}),
      choice('quartermaster-descend','Secure your pack and descend.',{type:'advance',next:'halls-floodgate',outcome:'Dorrin seals the issue slate. You pass beneath the warning bell and enter the wet service halls.'})
    ]
  },
  'halls-floodgate': {
    id:'halls-floodgate', chapter:'halls', title:'The Broken Floodgate', objective:'Cross the floodgate gallery before the next pressure surge.',
    story:'A bent floodgate hangs over a waist-deep channel. Each pulse from below lifts it, then drops it hard enough to shake dust from the ceiling. A trapped Warden clings to the far ladder while dark water rises around her.',
    choices:[
      choice('floodgate-brace','Brace the gate and pull the Warden through.',{type:'check',stat:'STR',dc:12,next:'halls-culvert',encounter:'broken-floodgate',bonuses:[{item:'Foundry Gloves',bonus:2,label:'secure grip'},{item:'Warden Pick',bonus:1,label:'steel brace'}],success:'You wedge the pick under the gate and hold it. The Warden crawls clear before the next pulse strikes.',failure:'The gate tears free of your grip. The Warden escapes by diving through, but the falling iron clips your shoulder.',effects:{success:{item:{name:'Foundry Gloves',reason:'The rescued Warden gives you her spare gloves; your grip saved her life.'},alliance:{wardens:1}},failure:{hp:-2,consequence:'The broken gate injured you and flooded the direct route.'}}}),
      choice('floodgate-bypass','Use the maintenance rail above the channel.',{type:'check',stat:'DEX',dc:11,next:'halls-culvert',encounter:'floodgate-rail',bonuses:[{item:'Rope Coil',bonus:2,label:'safety line'},{flag:'surveyRoute',bonus:1,label:'mapped route'}],success:'You cross the narrow rail and lower a chain ladder for the trapped Warden.',failure:'A corroded bracket gives way. You catch the rail, but your pack strikes the wall and the fall leaves you bruised.',effects:{success:{alliance:{wardens:1}},failure:{hp:-1,consequence:'The rail crossing cost time and strength.'}}})
    ]
  },
  'halls-culvert': {
    id:'halls-culvert', chapter:'halls', title:'Culvert Hounds', objective:'Drive off the salt-hounds and reach the Archives lift.',
    story:'Three pale salt-hounds block the culvert. They are half-starved, frightened by the pulses, and guarding a torn survey satchel. Their claws scrape the same four-beat rhythm into the stone.',
    choices:[
      choice('hounds-calm','Lower your weapon and calm the pack.',{type:'check',stat:'CHA',dc:12,next:'archives-entry',encounter:'culvert-hounds',bonuses:[{item:'Canteen',bonus:1,label:'water offering'},{derived:'resilience',threshold:3,bonus:1,label:'steady presence'}],success:'You set down water and wait. The lead hound drinks, then guides the others into a dry pipe.',failure:'The lead hound lunges when you move. You drive the pack away, but not before its claws find your arm.',effects:{success:{item:{name:'Surveyor Hood',reason:'The abandoned satchel contains a reinforced hood left by the missing survey team.'},discovery:'The missing survey team passed toward the Archives.'},failure:{hp:-2,consequence:'The salt-hounds were driven off by force.'}}}),
      choice('hounds-drive','Drive the hounds back with a controlled strike.',{type:'check',stat:'STR',dc:11,next:'archives-entry',encounter:'culvert-hounds',bonuses:[{item:'Warden Pick',bonus:2,label:'Warden weapon'},{derived:'power',threshold:5,bonus:1,label:'equipment power'}],success:'A blow against the iron grating sends a sharp warning through the culvert. The hounds retreat without a killing strike.',failure:'The pack scatters and attacks from both sides. You force a path, but take a deep bite.',effects:{success:{gold:4,discovery:'The survey satchel held Archive lift tokens.'},failure:{hp:-3,consequence:'The salt-hounds left you badly wounded.'}}})
    ]
  },
  'archives-entry': {
    id:'archives-entry', chapter:'archives', title:'The Lift of Names', objective:'Reach Archivist Lithen and learn why the sealed record was moved.',
    story:'The lift opens inside a library cut around a bottomless shaft. Brass nameplates cover every shelf. Several plates have been turned inward, hiding the names they once recorded. A woman in a slate-gray coat waits beside a jammed catalog wheel.',
    choices:[
      choice('entry-identify','State your commission and show the Warden seal.',{type:'check',stat:'CHA',dc:10,next:'archives-lithen',encounter:'archives-introduction',bonuses:[{alliance:'wardens',bonus:1,label:'Warden trust'}],success:'The woman introduces herself as Lithen and accepts your commission without delay.',failure:'Lithen studies you in silence before allowing you into the record hall.',effects:{success:{alliance:{lithen:1}},failure:{consequence:'Lithen remains cautious about your purpose.'}}}),
      choice('entry-repair','Reset the catalog wheel before asking questions.',{type:'check',stat:'INT',dc:11,next:'archives-lithen',encounter:'catalog-wheel',bonuses:[{item:'Oil Flask',bonus:2,label:'freed gears'},{item:'Lockpin',bonus:1,label:'fine mechanism'}],success:'The wheel turns and exposes the hidden index. Lithen notices the repair and offers her full cooperation.',failure:'The wheel resists your first sequence. Lithen stops it before the index tears.',effects:{success:{alliance:{lithen:2},discovery:'The hidden index lists a record called the Fourth Measure.'},failure:{alliance:{lithen:0}}}})
    ]
  },
  'archives-lithen': {
    id:'archives-lithen', chapter:'archives', title:'Lithen’s Account', objective:'Trace the Fourth Measure through the restricted ledgers.',
    story:'Lithen explains that the Unfathomer did not attack the city. It answered a command buried in an old covenant. Someone removed the record that defined the fourth Measure, then carried it toward the Depths. Without that definition, the Gate can only repeat an incomplete order.',
    enter:{discovery:'The Unfathomer is answering an incomplete covenant, not attacking without cause.',milestone:'Met Archivist Lithen.'},
    choices:[
      choice('lithen-ledgers','Follow Lithen into the restricted ledger hall.',{type:'advance',next:'archives-ledgers',outcome:'Lithen unlocks the inner stacks. The air inside smells of dust, cold metal, and fresh-cut sealing wax.'}),
      choice('lithen-press','Ask who had authority to move the record.',{type:'check',stat:'CHA',dc:12,next:'archives-ledgers',encounter:'lithen-trust',bonuses:[{alliance:'lithen',bonus:1,label:'earned trust'}],success:'Lithen names a Mullinen survey master, Orra Vale, but warns that the order carried a valid Warden seal.',failure:'Lithen refuses to accuse anyone without the original order.',effects:{success:{discovery:'Orra Vale moved the Fourth Measure under a valid Warden order.',alliance:{lithen:1}},failure:{consequence:'The authority behind the transfer remains unknown.'}}})
    ]
  },
  'archives-ledgers': {
    id:'archives-ledgers', chapter:'archives', title:'The Misbound Record', objective:'Reconstruct the route of the missing record.',
    story:'Four ledgers lie open beneath the catalog lamp. Their dates agree, but their route marks do not. One sends the record to storage, one to repair, one to the Mullinen watch, and one to a chamber that does not exist on any public map.',
    choices:[
      choice('ledgers-pattern','Compare ink pressure, binding thread, and correction marks.',{type:'check',stat:'INT',dc:13,next:'archives-guardian',encounter:'misbound-ledger',bonuses:[{item:'Archive Lens',bonus:2,label:'fine inspection'},{item:'Surveyor Hood',bonus:1,label:'listening plates'}],success:'Three entries are careful forgeries. The true route runs through a hidden lift called the Line Descent.',failure:'The forged entries hold together. Lithen chooses the repair route, the safest of the uncertain options.',effects:{success:{item:{name:'Archive Lens',reason:'Lithen lends you the lens used to expose altered ink and asks you to carry it below.'},flag:'lineDescent',discovery:'The Fourth Measure went down the hidden Line Descent.'},failure:{consequence:'You must take a longer route through unstable stacks.'}}}),
      choice('ledgers-lock','Open the sealed dispatch tube beside the ledgers.',{type:'check',stat:'DEX',dc:12,next:'archives-guardian',encounter:'dispatch-tube',bonuses:[{item:'Lockpin',bonus:2,label:'precision tool'}],success:'The tube opens without breaking its seal. Inside is a route strip for the Line Descent.',failure:'The old catch snaps loudly. Something heavy moves in the dark stacks.',effects:{success:{flag:'lineDescent',discovery:'A sealed route strip confirms the hidden Line Descent.'},failure:{consequence:'The Archive guardian was alerted early.'}}})
    ]
  },
  'archives-guardian': {
    id:'archives-guardian', chapter:'archives', title:'The Index Guardian', objective:'Pass the awakened guardian and secure the Echo Key.',
    story:'A brass index guardian unfolds from the shelving rail. It blocks the vault door and repeats one demand: “Name the authority. Name the Measure. Name the cost.” Its cutting arms lock into place.',
    choices:[
      choice('guardian-answer','Answer with the covenant’s known terms.',{type:'check',stat:'INT',dc:13,next:'archives-vault',encounter:'index-guardian',bonuses:[{alliance:'lithen',bonus:1,label:'Lithen’s counsel'},{item:'Archive Lens',bonus:1,label:'visible inscription'}],success:'You name the city, the four Measures, and the duty owed to those below. The guardian withdraws its blades.',failure:'Your answer omits the cost. The guardian strikes before Lithen forces an emergency release.',effects:{success:{alliance:{lithen:1}},failure:{hp:-3,consequence:'The guardian marked you as an incomplete witness.'}}}),
      choice('guardian-disable','Jam the cutting rail and reach the release lever.',{type:'check',stat:'DEX',dc:14,next:'archives-vault',encounter:'index-guardian',bonuses:[{item:'Lockpin',bonus:2,label:'rail catch'},{derived:'armor',threshold:11,bonus:1,label:'protected reach'}],success:'You trap the nearest blade and roll beneath the second. The release lever drops the guardian into silence.',failure:'The jam slips. You reach the lever, but a blade cuts through your outer gear.',effects:{success:{gold:5},failure:{hp:-3,consequence:'The guardian damaged your equipment harness.'}}})
    ]
  },
  'archives-vault': {
    id:'archives-vault', chapter:'archives', title:'The Echo Key', objective:'Take the Echo Key and descend to the Mullinen watch.',
    story:'Inside the vault, a silver-brass key rests in a tuning cradle. When you lift it, the metal repeats the last sound in the room: Lithen saying your name. The key is a witness. It remembers what was spoken before the Gate.',
    enter:{key:'Echo',keyReason:'Lithen entrusts you with the Echo Key so the Gate can verify the covenant’s spoken terms.',milestone:'Recovered the Echo Key.',item:{name:'Resonance Fork',reason:'Lithen gives you a Resonance Fork for testing the old channels below.'}},
    choices:[
      choice('vault-promise','Promise Lithen that the Archive record will be returned.',{type:'advance',next:'depths-descent',outcome:'Lithen fastens the vault seal behind you. “Return the truth,” she says, “even if the city dislikes its shape.”',effects:{alliance:{lithen:1}}}),
      choice('vault-question','Ask what the Gate may demand in payment.',{type:'check',stat:'CHA',dc:11,next:'depths-descent',encounter:'lithen-farewell',success:'Lithen answers plainly: a binding may cost freedom, a bargain may cost pride, and banishment may break the works that keep the lower city alive.',failure:'Lithen can offer no certain answer. The oldest ending pages were removed with the Fourth Measure.',effects:{success:{discovery:'Every final choice carries a different cost for Brassreach.'},failure:{consequence:'The final cost remains uncertain.'}}})
    ]
  },
  'depths-descent': {
    id:'depths-descent', chapter:'depths', title:'The Line Descent', objective:'Reach the Mullinen watchpost alive.',
    story:'The descent follows a narrow shaft beside a roaring water column. Every fourth platform is missing. Far below, hooded lamps answer your lantern with a measured sequence.',
    choices:[
      choice('descent-rope','Anchor a rope and descend along the surviving brackets.',{type:'check',stat:'DEX',dc:13,next:'depths-mullinen',encounter:'line-descent',bonuses:[{item:'Rope Coil',bonus:3,label:'anchored descent'},{flag:'lineDescent',bonus:1,label:'route strip'}],success:'The rope holds. You reach the watchpost without losing time or supplies.',failure:'One bracket tears free. You stop the fall, but strike the wall hard.',effects:{success:{discovery:'The Line Descent bypasses the worst flood channels.'},failure:{hp:-3,consequence:'The descent left you injured.'}}}),
      choice('descent-lift','Restore power to the hidden freight lift.',{type:'check',stat:'INT',dc:13,next:'depths-mullinen',encounter:'line-lift',bonuses:[{item:'Oil Flask',bonus:2,label:'freed drive chain'},{item:'Resonance Fork',bonus:1,label:'matched cadence'}],success:'The lift accepts the four-beat cadence and lowers you through the shaft.',failure:'The lift stalls halfway. You climb the remaining distance through cold spray.',effects:{success:{gold:3},failure:{hp:-1,consequence:'The stalled lift delayed your arrival.'}}})
    ]
  },
  'depths-mullinen': {
    id:'depths-mullinen', chapter:'depths', title:'The Mullinen Watch', objective:'Earn Orra Vale’s aid and locate the Stone Key.',
    story:'The watchpost is built into a natural cavern where black water moves beneath stone bridges. Orra Vale and six Mullinen Wardens hold the last dry platform. They have been fighting tunnel crawlers and sealing breaches for three days.',
    enter:{milestone:'Reached the Mullinen Depths.',discovery:'The Mullinen watch is trapped between the flood and the Gate pulses.'},
    choices:[
      choice('orra-aid','Help reinforce the breach before demanding answers.',{type:'check',stat:'STR',dc:12,next:'depths-crossing',encounter:'mullinen-breach',bonuses:[{item:'Warden Pick',bonus:2,label:'repair tool'},{item:'Foundry Gloves',bonus:1,label:'protected grip'}],success:'You drive two braces into the failing wall. Orra orders her Wardens to stand down and hear you out.',failure:'The brace shifts under pressure. The Wardens catch it before the wall breaks, but Orra doubts your judgment.',effects:{success:{alliance:{mullinen:2}},failure:{hp:-1,consequence:'Orra questions your skill after the failed repair.'}}}),
      choice('orra-record','Show Orra the Archive evidence and ask for the truth.',{type:'check',stat:'CHA',dc:13,next:'depths-crossing',encounter:'orra-testimony',bonuses:[{alliance:'lithen',bonus:1,label:'Lithen’s trust'},{flag:'lineDescent',bonus:1,label:'route evidence'}],success:'Orra admits she moved the record on a valid order, then hid it when she learned the order would erase the Mullinen claim to the lower waters.',failure:'Orra refuses to discuss the record while her people are under attack.',effects:{success:{alliance:{mullinen:1},discovery:'Orra hid the Fourth Measure to protect Mullinen water rights.'},failure:{consequence:'Orra’s reason for moving the record remains hidden.'}}})
    ]
  },
  'depths-crossing': {
    id:'depths-crossing', chapter:'depths', title:'The Cistern Crossing', objective:'Cross the flood channel and reopen the Stone Key shrine.',
    story:'The route to the shrine is underwater except for a line of slick valve housings. Flood pressure rises with every Gate pulse. On the far side, a red service lamp marks a dry control room.',
    choices:[
      choice('crossing-boots','Cross the valve housings before the next surge.',{type:'check',stat:'DEX',dc:14,next:'depths-salvager',encounter:'cistern-crossing',bonuses:[{item:'Cistern Boots',bonus:3,label:'flood grip'},{item:'Rope Coil',bonus:2,label:'guide line'},{derived:'resilience',threshold:5,bonus:1,label:'endurance'}],success:'You keep your footing and reach the control room before the channel rises.',failure:'The surge sweeps your legs out. A Mullinen line hauls you clear, coughing and bruised.',effects:{success:{alliance:{mullinen:1}},failure:{hp:-3,consequence:'The cistern crossing nearly drowned you.'}}}),
      choice('crossing-valves','Redirect the flood through an abandoned settling tank.',{type:'check',stat:'INT',dc:14,next:'depths-salvager',encounter:'cistern-valves',bonuses:[{item:'Resonance Fork',bonus:2,label:'pressure cadence'},{item:'Archive Lens',bonus:1,label:'worn markings'}],success:'You open the valves in the correct order. The channel drops long enough for the entire watch to cross.',failure:'A reversed valve sends a hard wave through the gallery. The route remains passable, but several braces fail.',effects:{success:{alliance:{mullinen:2},discovery:'The old settling tanks still answer the four Measures.'},failure:{hp:-1,consequence:'The valve error damaged Mullinen defenses.'}}})
    ]
  },
  'depths-salvager': {
    id:'depths-salvager', chapter:'depths', title:'Flintwake’s Salvage Cart', objective:'Resupply, then clear the crawler nest from the shrine approach.',
    story:'Sella Flintwake has chained a salvage cart to the control-room wall. She offers medicine, recovered armor, and a tuning tool taken from the old Gate crews. Scratches on the cart show that something large followed her from the shrine.',
    choices:[
      choice('salvager-trade','Inspect Sella’s salvage.',{type:'merchant',merchant:'salvager'}),
      choice('salvager-track','Study the scratches and prepare for the creature ahead.',{type:'check',stat:'INT',dc:11,next:'depths-crawler',encounter:'crawler-tracks',bonuses:[{item:'Archive Lens',bonus:1,label:'clear tracks'}],success:'The marks show a stoneback crawler that attacks sound before movement. You plan a quiet approach.',failure:'The overlapping tracks reveal only that the creature is heavy and close.',effects:{success:{flag:'crawlerPattern',discovery:'The stoneback crawler hunts loud, repeated sounds.'},failure:{consequence:'You enter the crawler nest without a clear plan.'}}}),
      choice('salvager-move','Leave the cart and advance carefully.',{type:'advance',next:'depths-crawler',outcome:'Sella extinguishes the cart lamp behind you. Ahead, stone plates scrape across the shrine floor.'})
    ]
  },
  'depths-crawler': {
    id:'depths-crawler', chapter:'depths', title:'The Stoneback Crawler', objective:'Defeat or divert the crawler guarding the shrine.',
    story:'A stoneback crawler fills the shrine approach, plated from snout to tail. Brass survey tags hang from its jaw. It strikes the floor, listens to the echo, and charges the loudest return.',
    choices:[
      choice('crawler-divert','Throw a tuned echo into the side channel.',{type:'check',stat:'INT',dc:14,next:'depths-shrine',encounter:'stoneback-crawler',bonuses:[{item:'Resonance Fork',bonus:3,label:'false echo'},{flag:'crawlerPattern',bonus:1,label:'known hunting pattern'}],success:'The false echo draws the crawler into an empty settling tank. Orra seals the grate behind it.',failure:'The echo returns from the wrong wall. The crawler charges through your position before the Wardens turn it aside.',effects:{success:{alliance:{mullinen:1},item:{name:'Stoneback Plate',reason:'A loose plate breaks free when the crawler strikes the grate; Sella shapes it into usable armor.'}},failure:{hp:-4,consequence:'The crawler’s charge left you badly hurt.'}}}),
      choice('crawler-break','Meet the charge and break its leading plate.',{type:'check',stat:'STR',dc:15,next:'depths-shrine',encounter:'stoneback-crawler',bonuses:[{item:'Warden Pick',bonus:2,label:'armor-breaking point'},{derived:'power',threshold:6,bonus:2,label:'high power'}],success:'You step aside at the last moment and drive the pick beneath its leading plate. The crawler retreats into the dark.',failure:'The pick glances off the plate. You survive the impact, but only because Orra’s line drags you clear.',effects:{success:{item:{name:'Stoneback Plate',reason:'The plate you broke free is fitted into a durable chest guard.'}},failure:{hp:-4,consequence:'The crawler escaped and may return.'}}})
    ]
  },
  'depths-shrine': {
    id:'depths-shrine', chapter:'depths', title:'The Weight Shrine', objective:'Claim the Stone Key and recover the missing covenant record.',
    story:'The shrine holds a balance cut from one piece of basalt. The missing Fourth Measure lies beneath one pan. The other holds the Stone Key. An inscription states the test plainly: “No claim has weight unless another can answer it.”',
    choices:[
      choice('shrine-share','Place the Warden and Mullinen seals on the empty pan.',{type:'check',stat:'CHA',dc:13,next:'depths-brassworks',encounter:'weight-shrine',bonuses:[{alliance:'mullinen',bonus:2,label:'Mullinen trust'},{alliance:'wardens',bonus:1,label:'Warden trust'}],success:'The balance settles. The shrine accepts both claims and releases the Stone Key with the missing record.',failure:'The seals do not balance. Orra adds her own field badge, and the shrine opens at the cost of her command.',effects:{success:{key:'Stone',keyReason:'The Weight Shrine releases the Stone Key after you recognize both Warden and Mullinen claims.',flag:'fourthMeasure',milestone:'Recovered the Fourth Measure and Stone Key.',discovery:'The Fourth Measure is consent: every bound party must be allowed to answer.'},failure:{key:'Stone',keyReason:'Orra sacrifices her command badge so the Weight Shrine will release the Stone Key.',flag:'fourthMeasure',consequence:'Orra surrendered her command to satisfy the Weight Shrine.'}}}),
      choice('shrine-measure','Balance the record by reading its physical construction.',{type:'check',stat:'INT',dc:15,next:'depths-brassworks',encounter:'weight-shrine',bonuses:[{item:'Archive Lens',bonus:2,label:'record construction'},{item:'Measure Ring',bonus:2,label:'four Measures'}],success:'You match stone, brass, echo, and thread within the record itself. The shrine releases both the key and the covenant.',failure:'The measure falls short. Orra places her command badge on the scale to complete the cost.',effects:{success:{key:'Stone',keyReason:'The Weight Shrine releases the Stone Key after you prove the record contains all four Measures.',flag:'fourthMeasure',milestone:'Recovered the Fourth Measure and Stone Key.',discovery:'The Fourth Measure is consent: every bound party must be allowed to answer.'},failure:{key:'Stone',keyReason:'Orra sacrifices her command badge so the Weight Shrine will release the Stone Key.',flag:'fourthMeasure',consequence:'Orra surrendered her command to satisfy the Weight Shrine.'}}})
    ]
  },
  'depths-brassworks': {
    id:'depths-brassworks', chapter:'depths', title:'The Silent Brassworks', objective:'Choose whether to recover the optional Brass Key before returning to the Gate.',
    story:'A side passage leads to the abandoned Tone works. The Brass Key remains locked in a sounding engine, but the chamber is filling with hot steam. You already hold enough Keys to open the Gate; entering risks the time you have left.',
    choices:[
      choice('brassworks-enter','Enter the steam chamber and tune the sounding engine.',{type:'check',stat:'INT',dc:15,next:'gate-approach',encounter:'brass-key-engine',bonuses:[{item:'Resonance Fork',bonus:3,label:'true pitch'},{item:'Oil Flask',bonus:1,label:'free regulator'}],success:'You match the engine’s damaged tone and release the Brass Key before the chamber vents.',failure:'The regulator opens too soon. You seize the Key through the steam, but the burns slow your return.',effects:{success:{key:'Brass',keyReason:'You tune the old sounding engine and recover the optional Brass Key.',milestone:'Recovered all three Keys.',optional:'Restored the Silent Brassworks.'},failure:{key:'Brass',keyReason:'You recover the Brass Key from the venting engine despite the heat.',hp:-4,consequence:'Recovering the Brass Key left you burned.'}}}),
      choice('brassworks-leave','Keep the two Keys and return to the Gate.',{type:'advance',next:'gate-approach',outcome:'You mark the Tone works for a later expedition and take the fastest route back to the Gate.',effects:{optional:'Left the Brass Key sealed to protect the expedition.'}})
    ]
  },
  'gate-approach': {
    id:'gate-approach', chapter:'gate', title:'The Gate of Measures', objective:'Set the recovered Keys and restore the covenant.',
    story:'The Gate fills the last gallery: a circular mechanism of stone collars, brass channels, echo chambers, and silver thread. Water strikes the sealed doors in four steady pulses. Lithen arrives by the upper lift; Orra and the Mullinen Wardens hold the lower bridge.',
    enter:{milestone:'Reached the Gate of Measures.'},
    choices:[
      choice('gate-brief-allies','Compare Lithen’s record with Orra’s account.',{type:'check',stat:'CHA',dc:12,next:'gate-alignment',encounter:'gate-council',bonuses:[{alliance:'lithen',bonus:1,label:'Lithen trust'},{alliance:'mullinen',bonus:1,label:'Mullinen trust'}],success:'Lithen and Orra agree on the missing clause: the Unfathomer must be allowed to answer before any new order binds it.',failure:'Their argument consumes precious time. You restore the clause from the record without their agreement.',effects:{success:{flag:'unitedCouncil',discovery:'Lithen and Orra agree that the Unfathomer must be allowed to answer.'},failure:{consequence:'The Gate council remains divided.'}}}),
      choice('gate-set-keys','Begin setting the recovered Keys.',{type:'advance',next:'gate-alignment',outcome:'You climb the central dais and fit the recovered Keys into their collars. The Gate answers with a pressure wave that turns every lamp blue-white.'})
    ]
  },
  'gate-alignment': {
    id:'gate-alignment', chapter:'gate', title:'Four Measures Aligned', objective:'Complete the Gate sequence and open a path to the Unfathomer.',
    story:'The Gate presents four controls. Weight asks who bears the cost. Tone asks what command is spoken. Pattern asks what the command will repeat. Line asks who may end it. The recovered record supplies the missing answer, but the mechanism is fighting years of damage.',
    choices:[
      choice('gate-align-int','Set each Measure from the restored record.',{type:'check',stat:'INT',dc:15,next:'unfathomer-weight',encounter:'gate-alignment',bonuses:[{item:'Measure Ring',bonus:3,label:'four Measures'},{item:'Archive Lens',bonus:1,label:'restored text'},{keys:3,bonus:2,label:'three-Key circuit'}],success:'The four controls lock into one clean sequence. The Gate opens without tearing the surrounding channels.',failure:'The sequence catches on the Line control. You force it through, but the Gate opens with a violent shock.',effects:{success:{flag:'cleanGate'},failure:{hp:-3,consequence:'The damaged Gate opened under strain.'}}}),
      choice('gate-align-force','Hold the collars in place while your allies set the sequence.',{type:'check',stat:'STR',dc:15,next:'unfathomer-weight',encounter:'gate-alignment',bonuses:[{derived:'power',threshold:7,bonus:2,label:'high power'},{derived:'armor',threshold:13,bonus:1,label:'braced armor'},{flag:'unitedCouncil',bonus:1,label:'coordinated allies'}],success:'You hold the collars against the pressure while Lithen and Orra complete the sequence.',failure:'One collar breaks free and throws you across the dais. The opening remains, but the mechanism is damaged.',effects:{success:{flag:'cleanGate'},failure:{hp:-4,consequence:'A Gate collar broke during alignment.'}}})
    ]
  },
  'unfathomer-weight': {
    id:'unfathomer-weight', chapter:'unfathomer', title:'Unfathomer — Weight', objective:'Survive the first Measure and show who bears the city’s burden.',
    story:'Beyond the Gate, the Unfathomer is not a body but a vast pressure moving through water, stone, and brass. It raises the entire cistern floor. A voice reaches you through every metal surface: “WHO CARRIES THE CITY?”',
    choices:[
      choice('boss-weight-endure','Stand within the pressure and name those who paid the cost.',{type:'check',stat:'STR',dc:15,next:'unfathomer-tone',encounter:'unfathomer-weight',bossPhase:1,bonuses:[{derived:'resilience',threshold:6,bonus:2,label:'high resilience'},{item:'Stoneback Plate',bonus:2,label:'stoneback brace'},{keys:3,bonus:1,label:'complete circuit'}],success:'You remain standing and name Wardens, Archivists, Mullinen crews, and flooded families. The pressure eases.',failure:'The pressure drives you to one knee. Orra adds the names of her lost Wardens, and the Measure accepts the shared answer.',effects:{success:{flag:'weightAnswered'},failure:{hp:-4,consequence:'You could not bear the first Measure alone.'}}})
    ]
  },
  'unfathomer-tone': {
    id:'unfathomer-tone', chapter:'unfathomer', title:'Unfathomer — Tone', objective:'Speak a command the Unfathomer can answer freely.',
    story:'The pressure becomes sound. Every old order ever spoken at the Gate overlaps until words lose meaning. The Unfathomer asks, “WHAT DO YOU COMMAND?”',
    choices:[
      choice('boss-tone-speak','Speak a request instead of an order.',{type:'check',stat:'CHA',dc:15,next:'unfathomer-pattern',encounter:'unfathomer-tone',bossPhase:2,bonuses:[{flag:'unitedCouncil',bonus:2,label:'shared authority'},{alliance:'mullinen',bonus:1,label:'Mullinen witness'}],success:'You ask the Unfathomer to lower the flood and answer in its own voice. The old commands fall silent around your words.',failure:'Your first words sound too much like the old command. Lithen recites the consent clause, giving the Unfathomer room to answer.',effects:{success:{flag:'toneAnswered'},failure:{hp:-2,consequence:'The old command remains tangled in your voice.'}}}),
      choice('boss-tone-tune','Use the Echo Key and Resonance Fork to clear the command channel.',{type:'check',stat:'INT',dc:15,next:'unfathomer-pattern',encounter:'unfathomer-tone',bossPhase:2,bonuses:[{item:'Resonance Fork',bonus:3,label:'clear channel'},{keys:3,bonus:1,label:'Brass Key harmony'}],success:'The fork isolates one clean frequency. Through it, you speak the restored covenant without distortion.',failure:'The channel splits under the strain. You complete the phrase, but the backlash cracks the tuning cradle.',effects:{success:{flag:'toneAnswered'},failure:{hp:-2,consequence:'The Gate’s tuning cradle cracked.'}}})
    ]
  },
  'unfathomer-pattern': {
    id:'unfathomer-pattern', chapter:'unfathomer', title:'Unfathomer — Pattern', objective:'Break the cycle that repeats the flood command.',
    story:'The chamber shows you the same disaster repeating: the city orders more water, the lower wards flood, the Unfathomer obeys, and the record is hidden again. “WHAT MUST NOT REPEAT?” it asks.',
    choices:[
      choice('boss-pattern-name','Name the secrecy and unequal cost that caused the cycle.',{type:'check',stat:'INT',dc:16,next:'unfathomer-decision',encounter:'unfathomer-pattern',bossPhase:3,bonuses:[{flag:'fourthMeasure',bonus:2,label:'restored consent clause'},{item:'Archive Lens',bonus:1,label:'record evidence'},{flag:'weightAnswered',bonus:1,label:'first Measure answered'}],success:'You name the hidden order, the erased claim, and the repeated sacrifice. The vision stops before the next flood.',failure:'The vision repeats once more. Orra tears the false Warden order in half, giving the Pattern a visible ending.',effects:{success:{flag:'patternAnswered'},failure:{hp:-3,consequence:'Breaking the repeating Pattern demanded a final shock.'}}})
    ]
  },
  'unfathomer-decision': {
    id:'unfathomer-decision', chapter:'unfathomer', title:'Unfathomer — Line', objective:'Choose the covenant that will govern Brassreach.',
    story:'The Unfathomer withdraws from the walls and waits within the Gate. The final Measure is Line: who is bound, where the duty ends, and who may change it. Three answers remain possible.',
    choices:[
      choice('ending-bind','Bind the Unfathomer to a repaired covenant with shared oversight.',{type:'ending',stat:'CHA',dc:14,ending:'bind',bonuses:[{flag:'unitedCouncil',bonus:2,label:'united council'},{keys:3,bonus:2,label:'all three Keys'},{alliance:'mullinen',bonus:1,label:'Mullinen trust'}]}),
      choice('ending-bargain','Bargain with the Unfathomer as a free power beneath the city.',{type:'ending',stat:'CHA',dc:15,ending:'bargain',bonuses:[{flag:'toneAnswered',bonus:2,label:'clear request'},{flag:'patternAnswered',bonus:1,label:'broken cycle'},{item:'Measure Ring',bonus:2,label:'unresolved oath'}]}),
      choice('ending-banish','Banish the Unfathomer from the Gate and accept the loss of the old works.',{type:'ending',stat:'STR',dc:16,ending:'banish',bonuses:[{derived:'power',threshold:8,bonus:2,label:'high power'},{keys:3,bonus:2,label:'complete Key circuit'},{item:'Warden Pick',bonus:1,label:'Gate-breaking point'}]})
    ]
  }
};

export const ENDINGS = {
  bind:{title:'The Covenant Reforged',success:'The Unfathomer accepts a covenant witnessed by Wardens, Archivists, and Mullinen crews. The flood channels settle. New law requires every bound party to answer before the Gate may issue a command.',failure:'The binding holds, but only after the Gate takes a permanent mark from every Key. Brassreach is safe, though the covenant will need careful guardians.'},
  bargain:{title:'The Fourth Voice',success:'The Unfathomer agrees to regulate the lower waters in exchange for a voice in every future Measure. Brassreach gains an ally beneath the city, and the old order becomes a negotiation.',failure:'The bargain is narrow and uneasy. The floods recede, but the Unfathomer reserves the right to refuse any command that ignores the lower wards.'},
  banish:{title:'The Silent Gate',success:'You break the old Line and drive the Unfathomer beyond the Gate. The cisterns fall silent. Brassreach survives, but crews must rebuild the waterworks by mortal hands.',failure:'The banishment succeeds at a severe cost. The Gate collapses behind the departing force, cutting the deepest channels away from the city.'}
};
