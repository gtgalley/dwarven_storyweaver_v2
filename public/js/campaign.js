// Brassreach authored campaign
// v8 — interim author-workbook integration and living-book interface pass.

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
  effects,bonuses:extra.bonuses||[],encounter:extra.encounter||id,
  ...(extra.equippedSuccess?{equippedSuccess:extra.equippedSuccess}:{})
});
const advance=(id,label,next,outcome,effects={})=>({id,type:'advance',label,sentence:label,next,outcome,effects});
const merchant=(id,label,merchantId)=>({id,type:'merchant',label,sentence:label,merchant:merchantId});

export const CAMPAIGN_SCENES = {
  'tutorial-commission':{
    id:'tutorial-commission',chapter:'tutorial',title:'The Public Bell',
    objective:'Collect your field gear and reach the two stranded stair-keepers.',
    story:`You find Captain Brunna beneath the Public Bell, holding down three sheets of paper against the wind. This is the table where you took your final examination at the Threadbearer Institute. This time, someone has run all the way up the steps to deliver the last report. His boots have left wet prints beside the table.

“Two keepers are stuck on the Hall stair,” Brunna says. “Six households below it have water coming up through their floors. Now the market porter says there are salt-hounds in his stalls.” She folds the reports into your field case. “They may be three separate problems. I want you to find out.”

She signs your Probationary Writ. “See Dorrin on your way to the stair. Get those two home first. Then follow what you find and bring me your account. This seal will get you into staffed public works. It won't take you into the Undercity.”`,
    enter:{authority:'Probationary Threadbearer',writ:'probationary',item:{name:'Thread Ledger',reason:'Brunna clips a blank Thread Ledger inside your case for your first report.'},milestone:'Received your first commission from Captain Brunna.'},
    choices:[
      advance('tutorial-accept','Ask Brunna for the quickest way to the stair.','tutorial-quartermaster','“Through the supply room, then out onto the Hall terrace.” Brunna puts a finger on the stairwell on your plan. “You’ll see the crowd before you see the crack.”',{reputation:{accuracy:1}}),
      advance('tutorial-question','Ask what the reports have in common.','tutorial-quartermaster','Brunna shows you two notes. A keeper heard a knock after the noon bell. A dyer heard it through her floor. “Different streets,” Brunna says. “See if you hear it too.”',{reputation:{accuracy:1},testimony:'A stair-keeper and a dyer both reported a knock after the noon bell.'}),
      advance('tutorial-people','Ask if anyone has reached the keepers.','tutorial-quartermaster','“Not yet. The Lantern Constables have cleared the terrace. The keepers can stand where they are, but they can’t get back across.” Brunna hands you the plan. “Take it to Dorrin. He knows that stair.”',{reputation:{compassion:1},testimony:'Brunna says both keepers are on their feet beyond the broken landing.'})
    ]
  },

  'tutorial-quartermaster':{
    id:'tutorial-quartermaster',chapter:'tutorial',title:'Dorrin’s Issue Desk',
    objective:'Choose a field tool for the stairwell. It is issued free of charge.',
    story:`Quartermaster Dorrin works behind an iron counter polished by generations of impatient hands. Each lamp and coil of rope on the wall bears the name of the last person who carried it. He reads your writ, looks down at your wet boots, and slides a box of chalk across the counter.

“Brunna wants a report. I want you back with the same number of bones.” He sets down a coil of rope. “The keepers can use that as a handrail on the upper gallery.” Then he hands you a Surveyor Hood and taps the counter with his fingernail while you hold one of its brass plates to your ear. The little tap comes through loud and clear. “Those plates make faint sounds louder. If you’re checking the drain, listen beside each pipe. You’ll hear the knock loudest at the one it’s coming from.”

He unlocks the cabinet of gear you can buy. Before he can name a price, the bell rings overhead. A moment later something knocks beneath the counter. Dorrin rests his hand on the iron until it stops. “Best not keep that stair waiting.”`,
    enter:{item:{name:'Surveyor’s Chalk',reason:'Dorrin issues chalk to mark cracks as they spread.'},discovery:'Dorrin records who takes each Institute tool and which job it is for.'},
    choices:[
      merchant('tutorial-dorrin-shop','Browse Dorrin’s supplies.','dorrin'),
      advance('tutorial-dorrin-ready','Take the listening hood to investigate the drain.','tutorial-bell-stair','You sign for the hood. Dorrin loosens the strap a notch. “You’ll want it snug, not tight enough to give you a headache. The paperwork will do that.”',{item:{name:'Surveyor Hood',reason:'The Surveyor Hood goes in your pack. Equip it in the head slot (E) to use its listening plates.'}}),
      advance('tutorial-dorrin-rope','Take a Rope Coil for the rescue and leave for the stair.','tutorial-bell-stair','Dorrin checks the rope for frayed strands. “There’s an iron ring at each end of the upper gallery. The stone under those rings is sound.” He marks the gallery on your plan.',{item:{name:'Rope Coil',reason:'Dorrin assigns you a Rope Coil for the gallery crossing.'}})
    ]
  },

  'tutorial-bell-stair':{
    id:'tutorial-bell-stair',chapter:'tutorial',title:'The Cracked Stairwell',
    objective:'Get both keepers off the far steps and find out where the pipe goes.',
    story:`The first location on Brunna's route is a tall, circular stairwell connecting a crowded terrace with the lower level of the civic Halls. You hear the stone groan before you reach it. Lantern Constables hold the crowd behind a chain while two stair-keepers remain stranded on the far side of a split landing. The steps beneath the keepers are intact. It’s the landing between you that’s giving way.

“The cracks appeared with the noon bell,” the older keeper calls. Rain runs down the central support column and drips from the iron collar around a drain. Beside you, a constable unhooks a long shoring plank from the terrace wall. Another climbs to the upper gallery with a rescue sling.

The Public Bell rings. Its note dies away. Then the lowest pipe knocks against the wall, and each pipe above it shakes in turn. The iron collar stays put; the stone around it jerks sideways. The near edge of the landing drops the width of your hand. Both keepers step back.`,
    cue:'bell-and-pipe',
    choices:[
      check('stair-brace','Lay the plank across the split and steady it for the keepers. (STR)','STR',10,'The constable feeds you the plank. You lay one end on the sound terrace steps and push the other across to the older keeper. She stamps it once, then sends her partner over. You hold it until her boots reach your step. “That pipe runs past my sister’s dye-house,” she says. “I’ll take you there.”','The far end of the plank slips off the step. A piece of falling stone strikes your shoulder. From the gallery, the constable lowers the sling and draws the keepers up one at a time. The older keeper calls down as you leave: “Ask for Piera by the dye-house. She knows where that pipe goes.”','tutorial-tangles',{success:{repair:'A plank spans the split for the evacuation.',flags:{keeperGuide:true},reputation:{courage:1},testimony:'The older keeper traced the pipe to her sister’s dye-house.'},failure:{hp:-1,hpReason:'bruised by falling stone at the bell-stair',consequence:'The stair is closed. The keepers left by the upper gallery.',reputation:{accuracy:1}}},{bonuses:[{derived:'power',threshold:4,bonus:1,label:'power rating'}]}),
      check('stair-collar','Watch the crack and tell the constable when to lift each keeper. (INT)','INT',11,'You sight along the crack from the terrace. Each time the pipe knocks, a little grit falls. Between knocks the stone holds still. On your signal the constable lifts first one keeper, then the other. You sketch the collar while you wait for them to come down. The younger keeper recognizes the pipe. “We cleaned that one from the dye-house end. Ask Piera.”','The next knock comes before the sling reaches the steps. You wave the constable off. On the second try the older keeper catches the sling herself. Both come up safely, but the edge has fallen away by the time you look back. “Try the dye-house,” the younger keeper tells you. “Piera can show you the other end.”','tutorial-tangles',{success:{evidence:'Grit fell from the crack each time the pipe knocked.',reputation:{accuracy:2}},failure:{consequence:'The landing edge broke away before you could finish inspecting the collar.'}},{bonuses:[{item:'Surveyor’s Chalk',bonus:2,label:'mark the crack'}]}),
      check('stair-listen','Trace the knocking pipe while the constables lift the keepers. (DEX)','DEX',10,'The constables lift the keepers clear. Below the terrace rail, three pipes bend into the same arch. You reach down and touch each one in turn. Only the narrow pipe knocks twice under your fingers. You copy its two-notch mark. “Piera has the market end of that line on her map,” says the keeper.','The constables bring both keepers up. You lean over the terrace rail, but water runs off your sleeve onto the marks below. By the time you get a hand on the pipes the knocking has stopped. The older keeper directs you to Piera at the dye-house. “She can show you where to look. Don’t put a number on it till you’re sure.”','tutorial-tangles',{success:{flags:{identifiedPipe:true},evidence:'The narrow pipe with two notches knocked after the bell.',reputation:{accuracy:2}},failure:{evidence:'The knock followed the bell; you could not identify which pipe made it.'}},{equippedSuccess:{item:'Surveyor Hood',text:'Through the hood you hear two knocks close together. Below the rail, you touch three pipes in turn. Only the narrow one taps your fingers twice. You copy its two-notch mark while the constables lift the keepers clear. The younger keeper looks at your sketch. “Show that to Piera. She’s marked those pipes all the way down to the market.”'},bonuses:[{equipped:'Surveyor Hood',bonus:2,label:'listening plates'}]}),
      {...advance('stair-gallery','Use your Rope Coil to guide the keepers along the upper gallery.','tutorial-tangles','The constable helps the keepers onto the gallery with the sling. Rain has made the narrow walkway slick. You pass your rope through both iron rings and pull it taut. Hand over hand, the keepers walk back to the terrace. You gather the rope. “My sister works at the other end of that drain,” the older keeper says. “Come with me.”',{flags:{keeperGuide:true},testimony:'The older keeper offers to show you the far end of the drain.'}),needsItem:'Rope Coil'}
    ]
  },

  'tutorial-tangles':{
    id:'tutorial-tangles',chapter:'tutorial',title:'Piera at the Dye-House',
    objective:'Find where the Hall drain enters the market.',
    arrivals:{
      'stair-brace:success':'The older keeper leads you down to the dye-house and asks her sister for the cellar key.',
      'stair-brace:failure':'The closed stair forces you down a service lane. You find the dye-house by the blue water in its gutter.',
      'stair-collar:success':'You follow the pipe downhill until it disappears beneath a dye-house. You keep your sketch open to the marks you saw at the stair.',
      'stair-collar:failure':'The keeper gives you directions while a constable bars the stair. At the foot of the hill you find the dye-house.',
      'stair-listen:success':'At the dye-house you find the same two notches on a pipe just above the gutter.',
      'stair-listen:failure':'You follow the keeper’s directions down the hill. The dye-house stands across the lane from six flooded homes.',
      'stair-gallery':'The keeper takes you to her sister’s dye-house. She comes back to the lane with the cellar key.'
    },
    story:`Piera sits on a barrel outside the dye-house with a map across her knees. A woman rolls up her wet carpet in the doorway opposite. On your city plan there’s a street between the two buildings. From where you stand, you could touch both walls.

“You’ve come about the water?” Piera moves her thumb. Under it is a pencil line running from the dye-house to the market. “That’s the drain. I’ve seen where it goes in. I want to know what’s coming out.” Beyond the roofs a metal shutter bangs, followed by a shout from the market.`,
    choices:[
      {...advance('piera-cellar','Follow the keeper through her sister’s dye cellar.','tutorial-dye-cellar','The keeper unlocks the door. Piera takes the lamp from its hook and goes down ahead of you.'),needsFlag:'keeperGuide'},
      {...advance('piera-pipe','Show Piera the two-notch mark and follow the matching pipe.','tutorial-salt-hounds','Piera finds the mark on the pipe outside. You follow it together to an open grate behind the market stalls. Four sets of wet paw prints lead away from it. The shouting is just beyond the shutters.',{evidence:'Wet paw prints lead from the marked drain into the market.',flags:{pieraRoute:true}}),needsFlag:'identifiedPipe'},
      check('piera-compare','Match Piera’s map to the streets around you. (INT)','INT',10,'You line up the dye-house chimney on both maps. Piera’s drain runs straight under the market where the city plan shows a wall. She tears off that part of her map for you. “You take the paper. I’ll show you the grate.”','You line up the wrong chimney. Piera turns the plan a quarter turn and points out the soot on the nearer stack. “I did that the first time too.” You leave the plan folded and follow her to the market on foot.','tutorial-salt-hounds',{success:{evidence:'Piera’s map shows a drain missing from the civic plan.',alliance:{piera:1},flags:{pieraRoute:true},item:{name:'Piera’s Route Map',reason:'Piera gives you the part of her map that shows the market drain.'},reputation:{accuracy:2}},failure:{testimony:'Piera showed you the way to the market grate.',alliance:{piera:1},reputation:{humility:1}}},{bonuses:[{item:'Surveyor’s Chalk',bonus:1,label:'survey marks'}]}),
      check('piera-residents','Ask the flooded households where the water came in. (CHA)','CHA',10,'The woman with the carpet shows you a floor drain. “Came up here. Then it went away. Then it came up again.” Across the lane a man points to wet paw prints leading from his grate to the market. Piera takes you after them.','Two neighbors disagree about the time. Both saw water come up through the floor rather than in through the door. You write down what they agree on. A handler runs past with an empty lead, and Piera hurries you after him.','tutorial-salt-hounds',{success:{testimony:'Residents saw water rise twice through their floor drains.',alliance:{worksfolk:1},reputation:{compassion:2}},failure:{testimony:'Neighbors disagree on the hour but saw water rise through the floor.',reputation:{accuracy:1}}},{bonuses:[{alliance:'piera',bonus:1,label:'Piera’s introductions'}]}),
      check('piera-shortcut','Climb the dye-house steps for a look over the market wall. (DEX)','DEX',11,'From the top step you see a porter back away from four wet salt-hounds. His heel catches a handcart. It tips over on top of him. You shout to the handlers and run down to help.','Your boot slips on the top step. You catch the rail and scrape your palm. Piera steadies you. Below, someone shouts that a porter is down. You take the lane to the market together.','tutorial-salt-hounds',{success:{discovery:'You saw the market porter fall beside the cart.',alliance:{piera:1},reputation:{courage:1}},failure:{hp:-1,hpReason:'scraped palm on the dye-house rail',consequence:'You reached the market by the longer street route.'}},{bonuses:[{item:'Rope Coil',bonus:2,label:'safety line'}]})
    ]
  },

  'tutorial-dye-cellar':{
    id:'tutorial-dye-cellar',chapter:'tutorial',title:'The Dye Cellar',
    objective:'Find what got through the drain beneath the market.',
    story:`Bolts of blue cloth hang from the rafters, their ends wet. The keeper’s sister has lifted a loose flagstone. Under it, a shallow channel runs toward the wall the cellar shares with the market. Through a broken grate at the far end, lamplight falls on four sets of muddy paw prints on the market side. Beside the grate is a delivery hatch, just wide enough for a person.

“That opens behind the stalls,” the dyer says. Piera puts her ear to the hatch. On the other side a man calls for help.`,
    choices:[
      advance('cellar-hatch','Open the hatch to reach the man calling for help.','tutorial-salt-hounds','You pull the bolt and Piera holds the hatch open. You climb out behind the stalls and see a handcart lying on its side.',{flags:{pieraRoute:true},evidence:'You traced the drain to a broken grate behind the market stalls.'})
    ]
  },

  'tutorial-salt-hounds':{
    id:'tutorial-salt-hounds',chapter:'tutorial',title:'The Market Pack',
    objective:'Free the porter and clear a way out for the four hounds.',
    story:`A handcart lies across the porter’s leg. Four wet salt-hounds have backed up against it. Each time the market shutters slam, the largest hound bares its teeth. Not at the porter. At the shutters.

A handler points to an empty culvert across the lane. “Get them in there and I can shut the gate behind them.” The porter tries to lift the cart. Its axle rolls against his ankle. Above him, the shutters swing on a belt he can’t reach.`,
    choices:[
check('hounds-lure','Give the pack a quiet way into the empty culvert. (CHA)','CHA',11,'You have the crowd step back. The handler whistles low. One hound noses past you; the others follow. As the handler shuts the gate, two stallholders lift the cart. The porter sits up and points out the drain the hounds came through.','The smallest hound catches its paw on a basket. You pull the basket free and take a scratch. The pack bolts through the stalls. The handlers follow while Piera helps lift the cart. From the ground the porter points out the drain.', 'tutorial-floodgate',{success:{repair:'A safe animal route was opened from the market to an unused culvert.',reputation:{compassion:2},item:{name:'Salt-Hound Whistle',reason:'The porter passes you a handler’s spare whistle for the drain inspection.'}},failure:{consequence:'The pack scattered through the stalls. The porter saw which drain it came from.',hp:-1,hpReason:'scratched while clearing the startled market pack'}},{bonuses:[{testimony:'Residents saw water rise twice through their floor drains.',bonus:1,label:'resident guidance'},{item:'Canteen',bonus:1,label:'clean water'}]}),
      check('hounds-cart','Lift the axle off the porter’s leg. (STR)','STR',11,'Piera slides a block under the cart as you lift. The porter crawls free. Behind him the handlers draw the pack out with scraps. “Water shot through that grate,” he says. “Dogs came next.”','The axle turns in your hands. You wrench your shoulder, but Piera gets the block in and the porter rolls clear. The hounds scatter. A handler stays to show you the wet tracks at the grate.', 'tutorial-floodgate',{success:{reputation:{courage:2},testimony:'The rescued porter saw water burst from the blocked relief grate before the pack arrived.'},failure:{hp:-2,hpReason:'strained when the wet cart axle twisted free',consequence:'The market pack scattered before handlers could guide it.'}},{bonuses:[{derived:'power',threshold:5,bonus:1,label:'power rating'},{equipped:'Foundry Gloves',bonus:2,label:'secure gloves'}]}),
      check('hounds-gears','Stop the belt that keeps slamming the shutters. (INT)','INT',12,'You slip the drive belt onto its idle wheel. The shutters fall quiet. The largest hound lowers its head. While the handler leads the pack away, the stallholders free the porter. He shows you the drain behind his stall.','You pull the wrong catch. The shutters close and stick. The handlers clear the stalls through the side doors, hounds first. Piera holds a lamp while the porter is freed. Wet paw prints run back to a drain beneath his stall.', 'tutorial-floodgate',{success:{evidence:'Stopping the shutters let the handler lead the hounds away.',repair:'The shutter belt is off the drive.',reputation:{accuracy:2}},failure:{consequence:'The market closed for emergency evacuation after its lifting gear locked.'}},{bonuses:[{item:'Oil Flask',bonus:1,label:'freed clutch'},{item:'Lockpin',bonus:1,label:'cam release'}]})
    ]
  },

  'tutorial-floodgate':{
    id:'tutorial-floodgate',chapter:'tutorial',title:'The Buried Relief Gate',
    objective:'Drain the market without sending the water into the houses.',
    story:`A passage beside the market grate leads to a gate half buried in silt. Water backs up against it and spills into the drains that serve the houses. On the far side there’s an empty channel. Open the gate and the water has somewhere else to go.

A drain worker points out a weight hanging on a chain. “That lifts the gate for us. Free the bottom edge before you let the weight drop.” Residents arrive with buckets. Two Lantern Constables keep people out of the empty channel.`,
    choices:[
      check('relief-clear','Clear the silt with a bucket line. (STR)','STR',11,'Buckets pass from hand to hand until the bottom edge shows. The drain worker lowers the weight. Muddy water runs down the empty channel. A woman on the market steps calls down that she can see her doorstep again.','A new rush of mud buries the hinge. You get the gate halfway up and the worker chains it there. The water starts to fall. He asks you to tell Brunna they need another shift before dark.', 'tutorial-report',{success:{repair:'Tangles relief gate fully reopened with resident help.',alliance:{worksfolk:2},reputation:{courage:1,compassion:1}},failure:{repair:'Tangles relief gate opened halfway, buying several hours.',consequence:'A Works crew must clear the remaining silt before nightfall.'}},{bonuses:[{item:'Rope Coil',bonus:1,label:'haul line'},{alliance:'worksfolk',bonus:1,label:'resident bucket line'}]}),
      check('relief-balance','Help the worker lower the counterweight a notch at a time. (INT)','INT',12,'He shows you which catch takes the strain. You release one notch while the others clear the hinge, then another. Water starts moving down the channel. With the gate open, the knock in the wall grows quieter.','The last notch sticks. The worker secures the half-open gate with his chain and lends you a spare clamp for the next inspection. You mark the stuck notch for the returning crew.', 'tutorial-report',{success:{repair:'The worker lowered the counterweight without twisting the gate.',evidence:'The knock grew quieter when the gate opened.',reputation:{accuracy:2}},failure:{repair:'Relief gate chained at a narrow emergency opening.',item:{name:'Mender’s Clamp',reason:'The worker gives you his spare clamp; his chain holds the gate open.'}}},{bonuses:[{item:'Surveyor’s Chalk',bonus:1,label:'founder marks'},{flag:'pieraRoute',bonus:1,label:'omitted route'}]}),
      check('relief-coordinate','Organize the crowd so the worker can raise the gate safely. (CHA)','CHA',11,'The residents clear mud, the constables keep the channel empty, and the worker lowers the weight at your signal. Before leaving, each group writes down who will check the gate tomorrow.','Nobody wants to stand downstream of a gate that hasn’t moved in years. You ask the worker to open it just wide enough to drain the houses. He does. Nobody agrees to take the next shift.', 'tutorial-report',{success:{repair:'Relief gate reopened under a shared maintenance plan.',alliance:{wardens:1,worksfolk:2},reputation:{compassion:1},testimony:'Residents, constables and drain workers signed up to check the gate tomorrow.'},failure:{repair:'Relief gate made safe under a temporary order.',consequence:'The offices still dispute permanent responsibility.'}},{bonuses:[{alliance:'piera',bonus:1,label:'local trust'},{reputation:'compassion',threshold:2,bonus:1,label:'public trust'}]})
    ]
  },

  'tutorial-report':{
    id:'tutorial-report',chapter:'tutorial',title:'The Joined Account',
    objective:'Tell Brunna what connects the stair, the market and the flooded homes.',
    story:`Back beneath the Bell, Brunna sets three petitions in front of you. “People safe?” You give her the count. “Good. Now show me what I ought to do before it rains again.”

On the city plan you can trace the water as far as the market. The line ends there. You have seen a channel on the other side that the plan does not show.`,
    choices:[
      check('report-precise','Trace the drain and mark where your evidence ends. (INT)','INT',10,'You draw the missing channel. “I can show where the water went. I can’t tell you what pushed it up.” Brunna sets the ledger beside the map. “Then that is where your next inspection starts.”','You call the blocked gate the cause. Brunna puts a finger beside the stair. “Why did this pipe knock before the water reached the market?” You strike out the claim but keep the drawing. The missing channel still needs investigating.', 'halls-deep-writ',{success:{evidence:'The market drain continues beyond the last line on the city plan.',reputation:{accuracy:2},attributes:{INT:1},milestone:'Completed the first joined Threadbearer account.'},failure:{reputation:{humility:1},consequence:'You crossed out the claim that the blocked gate caused the knock.'}},{bonuses:[{item:'Thread Ledger',bonus:2,label:'field record'},{reputation:'accuracy',threshold:4,bonus:1,label:'careful record'}]}),
      check('report-people','Ask Brunna to hear from the people who live over the drain. (CHA)','CHA',11,'Brunna has a clerk read the residents’ accounts aloud. Six homes share a drain no one has been sent to inspect. She orders someone back to the houses and keeps you to trace the missing line.','A clerk asks which minute the flood started. You cannot give him one. Brunna takes down the witnesses’ names instead. “We have enough to follow the drain. We can come back for the time.”', 'halls-deep-writ',{success:{alliance:{worksfolk:2,wardens:1},reputation:{compassion:2},attributes:{CHA:1},milestone:'Placed affected residents and workers into the public account.'},failure:{testimony:'Brunna took the witnesses’ names. The time of the flood is still uncertain.',reputation:{accuracy:1}}},{bonuses:[{alliance:'worksfolk',bonus:1,label:'worker testimony'},{reputation:'compassion',threshold:3,bonus:1,label:'public standing'}]})
    ]
  },

  'halls-deep-writ':{
    id:'halls-deep-writ',chapter:'halls',title:'The Deep Writ',
    objective:'Use your new authority to inspect the records for the missing drain.',
    story:`Brunna opens an iron case. “You found a working drain my map says isn’t there. I need someone who’ll notice the difference.” She fastens a second seal beside your probationary one.

“This is a Deep Writ. Show it at a public works door and the custodian must let you inspect. Show it at a records desk and they must bring the file. It does not make you anybody’s commanding officer.” She counts twelve gold pieces onto the ledger. “Your field allowance. If a crew needs supplies, you shouldn’t have to borrow from the people you came to help.” “Start in the map room.”`,
    enter:{gold:12,goldReason:'Brunna issued your field allowance for the descent.',authority:'Threadbearer under Deep Writ',writ:'deep',item:{name:'Deep Writ Seal',reason:'Brunna fixes the seal to your ledger as proof of lawful access below the Halls.'},milestone:'Earned a Deep Writ.',flags:{deepWrit:true}},
    choices:[
      advance('deep-writ-maps','Take Brunna’s order to the map room.','halls-omitted-route','The clerk sees the second seal and fetches the oldest maps of the market district.',{reputation:{accuracy:1}}),
      advance('deep-writ-workers','Bring a drain worker to the map room.','halls-omitted-route','A worker with blue dye on her cuff comes along. “If they call it the south drain, I can find it for you. Down here we call it the wash.”',{alliance:{worksfolk:1},testimony:'Drain workers witnessed the Deep Writ inspection.'})
    ]
  },

  'halls-omitted-route':{
    id:'halls-omitted-route',chapter:'halls',title:'The Map That Ends Early',
    objective:'Find the public works door at the far end of the channel.',
    story:`Two city maps lie on the clerk’s desk. On the older one, a stair runs from the market to the Archives. On the newer one, the street stops at the edge of a budget district. Neither map tells you whether the stair is still there.

A drain worker delivering her time sheet recognizes the old name. “I put in for a new rail there three times. Ask Halvek for the papers. Or come along now and mind your footing.”`,
    choices:[
      check('map-layers','Match the old and new maps before seeing Halvek. (INT)','INT',11,'You align the bell tower and market wall. On the newer map the district border cuts through the stair. You take the clerk’s tracing to the office that approved the boundary.','You mistake a newer tower for the old one. The worker points out the error and marks the stair herself. Halvek’s office keeps the requests for that address.', 'halls-comptroller',{success:{evidence:'Successive civic maps cropped one continuous maintenance route at office boundaries.',reputation:{accuracy:2},flags:{archiveRoute:true}},failure:{testimony:'Drain workers identified the pressure stair omitted by modern terrace numbers.',alliance:{worksfolk:1},reputation:{humility:1}}},{bonuses:[{item:'Piera’s Route Map',bonus:2,label:'lived route'},{item:'Surveyor’s Chalk',bonus:1,label:'founder benchmarks'}]}),
      advance('map-workers-route','Let the worker take you straight to the Archives stair.','archives-entry','On the way down she shows you three dated repair slips tucked behind the loose rail. Each tells her to apply to another office. You copy the dates and follow her to the Archive door.',{evidence:'Three repair slips sent the worker to three different offices.',alliance:{worksfolk:2},route:'worker route'})
    ]
  },

  'halls-comptroller':{
    id:'halls-comptroller',chapter:'halls',title:'A Responsible Delay',
    objective:'Find out who last inspected the Archives stair.',
    story:`Comptroller Halvek makes room for your map by moving a stack of contracts. The top one has gilt edges; the bottom one is damp. You can just see the Archives stamp on it.

“We paid for every step inside our boundary,” Halvek says. You put the two maps together on his desk. Half the staircase is still missing. “Would you like the accounts,” he asks after a moment, “or the most recent complaint?”`,
    choices:[
      check('comptroller-chain','Ask who was paid to maintain the whole stair. (CHA)','CHA',12,'Halvek follows the entries with his finger. At the boundary he stops. He signs an order sending a crew down the full length of the stair and gives you the files for Lithen.','Three offices have each paid for part of the stair. None will pay for the bit between. Halvek releases the files under your writ but won’t send a crew. The complaint at the bottom came from the Archives.', 'archives-entry',{success:{evidence:'No office took charge of the missing section of stair.',repair:'Emergency crew assigned to the Archives pressure stair.',alliance:{wardens:1},reputation:{courage:1}},failure:{evidence:'The payment records leave the section between districts unpaid for.',consequence:'The Comptroller withheld discretionary repair funds.'}},{bonuses:[{evidence:'Successive civic maps cropped one continuous maintenance route at office boundaries.',bonus:1,label:'map chain'},{item:'Thread Ledger',bonus:1,label:'tamper-evident record'}]}),
      check('comptroller-request','Read the damp request from the Archives. (INT)','INT',11,'The keeper below recorded a knock followed by water coming up through the floor. Halvek brings you the earlier requests too. You head down to ask the librarian how far back the reports go.','You cannot read the old marks for pressure. The date and the sender’s name are clear enough: Lithen, chief librarian. Halvek lets you take the request to her.', 'archives-entry',{success:{evidence:'An Archives keeper heard a knock before water rose through the floor.',flags:{fullRepairFiles:true},reputation:{accuracy:2}},failure:{discovery:'A current Archives repair request uses an obsolete vibration code.',route:'archive request'}})
    ]
  },

  'archives-entry':{
    id:'archives-entry',chapter:'archives',title:'The Foundation Door',
    objective:'Ask Lithen whether the Archives have recorded this kind of flooding before.',
    arrivals:{
      'comptroller-chain:success':'A newly authorized repair crew reaches the foundation door beside you, carrying the maintenance files Halvek released.',
      'comptroller-chain:failure':'You reach the foundation door with the required files but no emergency crew or repair funds.',
      'comptroller-request:success':'The full maintenance series fills your document case when you present the Deep Writ at the foundation door.',
      'comptroller-request:failure':'The current repair request opens the foundation door, though its obsolete vibration code remains unresolved.'
    },
    story:`At the foot of the stair a librarian is putting blocks under a cabinet. The bottom drawer has already swollen shut. “If you’ve come to tell me my floor is wet, you may take the other end,” she says. You help her lift it.

This is Lithen. When she sees your sketch of the drain, she takes an old brass sheet from a dry drawer. The same channel is cut into it. She lends you a lens; through it you can read the tiny grooves that record how often the pipe shook. “Dates on one side, readings on the other. Come and hear what the grooves are for.”`,
    enter:{alliance:{lithen:1},item:{name:'Archive Lens',reason:'Lithen lends you her Archive Lens so you can examine altered ink and pressure marks during the comparison.'},milestone:'Brought the joined account to Lithen the Wise.'},
    choices:[
      advance('archives-follow','Take the old reading to the Record Well.','archives-record-well','Lithen carries the lamp herself. She lets you carry the sheet.'),
      advance('archives-ask-record','Ask why anyone kept a record of a shaking pipe.','archives-record-well','“So the next crew could tell when it started shaking differently.” Lithen takes down a second sheet. “Keeping both is important. One reading alone tells you very little.”',{discovery:'The Archives kept earlier pipe readings for the next maintenance crew.'})
    ]
  },

  'archives-record-well':{
    id:'archives-record-well',chapter:'archives',title:'The Resonant Record Well',
    objective:'Compare today’s shaking with the older readings.',
    story:`The Record Well is a round shaft lined with brass leaves. Lithen shows you one with holes along the edge. “The first accounts were sewn with needle and thread. When we copied them onto brass we kept the stitch marks. That is how I know which pages belong together.”

She fits an old reading to a round dish and drops a padded weight onto it. A low note comes back from far below. Then she fits the sheet from the recent flood. This time you hear two knocks close together. “Hold the lamp for me,” she says. “I haven’t heard those two together since I was a girl.”`,
    choices:[
      check('well-pattern','Play the older leaves in date order. (INT)','INT',13,'On the oldest sheet the note holds steady. In later readings you pick out first a scrape, then the double knock. The older note is still there underneath them. Lithen sets aside the dates you can both identify.','Two dates have worn away. You cannot put the sheets in order. But readings from three different reservoirs give the same double knock. One loose pipe at the market cannot account for all three.', 'archives-lithen',{success:{evidence:'The older steady note is audible beneath newer knocks.',reputation:{accuracy:2},alliance:{lithen:1}},failure:{evidence:'Three reservoirs recorded the same double knock.',reputation:{humility:1}}},{bonuses:[{item:'Surveyor Hood',bonus:1,label:'listening plates'},{item:'Thread Ledger',bonus:1,label:'joined observations'},{flag:'fullRepairFiles',bonus:1,label:'complete repair series'}]}),
      check('well-testimony','Read the workers’ accounts beside the instrument readings. (CHA)','CHA',12,'A worker wrote “two taps under my heel” beside a reading marked normal. You find the same words in a second hand ten years later. Lithen turns up the lamp so you can copy both names.','A loose account has lost its date. Lithen stops you from tying it to the nearest sheet. You record what the worker heard and leave a space for the year.', 'archives-lithen',{success:{testimony:'Two workers, ten years apart, heard two taps during readings marked normal.',alliance:{worksfolk:1,lithen:1},reputation:{compassion:1}},failure:{testimony:'Undated worker accounts remain useful evidence when clearly marked as undated.',reputation:{accuracy:1}}},{bonuses:[{alliance:'worksfolk',bonus:2,label:'worker trust'},{reputation:'compassion',threshold:3,bonus:1,label:'careful hearing'}]})
    ]
  },

  'archives-lithen':{
    id:'archives-lithen',chapter:'archives',title:'Lithen’s Name for the Deep',
    objective:'Ask Lithen what she thinks is moving the water.',
    story:`“Here is what troubles me,” Lithen says. “Crews miles apart saw the water rise at the same instant. A wave from a broken gate would reach one crew before the other.” She sits on the rim of the Well. “I have not stood in those caverns. My knees would scarcely get me down the stair. I have their accounts, and I have these leaves.”

“For centuries the Founders tuned neighboring chambers together. I think something living grew out of that work, without anyone intending it. Now our pumps strike and scrape against one another. If it feels that noise everywhere at once, perhaps it rises through the city looking for somewhere quiet. For now, I call it the Unfathomer.”

She takes you to the case that holds the oldest instructions for tuning the chambers. “You needn’t take my word for what lives below. You do need to know what the works were meant to do.”`,
    enter:{flags:{unfathomerNamed:true,keysKnown:true},discovery:'Lithen calls the presence she suspects below the city the Unfathomer.',milestone:'Heard Lithen’s explanation for the rising water.'},
    choices:[
      advance('lithen-origin','Ask whether the Founders knew they had made something alive.','archives-first-register','“I have found no account of a meeting. No bargain, either. A missing page is possible; it is not a reason to write one myself.” She unlocks the case.',{reputation:{accuracy:1}}),
      advance('lithen-danger','Ask what might slow the rising water.','archives-first-register','“If I am right, quiet one of the striking machines and watch the water. If nothing changes, tell me that too.”',{discovery:'Lithen suggests quieting one machine and watching the water.'}),
      advance('lithen-city','Ask what the city used to do differently.','archives-first-register','“A pump crew once stayed for the bell crew’s test. Now one office signs off and leaves before the other starts. Both machines can pass inspection and still shake the same wall apart.” She points to the names on the work order.',{evidence:'The pump crew and the bell crew stopped testing the machines together.'})
    ]
  },

  'archives-first-register':{
    id:'archives-first-register',chapter:'archives',title:'The First Register',
    objective:'Recover the Founders’ instructions without damaging the original.',
    story:`The First Register rests behind flood glass. The ceremonial copy beside it has room for three officials’ signatures. In the original, narrow lines run all the way down the margin. With Lithen’s lens you can see a trade beside each name: mason, pump hand, bell founder.

The instructions describe three instruments called Keys. Stone measures what a support can bear. Brass sets the machines to run together. Echo repeats a reading so another crew can test it. The Founders kept them in different hands. Part of the table is stuck beneath a wet page.`,
    choices:[
      check('register-lens','Read the impressions on the back of the wet page. (INT)','INT',13,'The ink has run, but the stylus left dents. You turn the lamp sideways and read the last line: the three instruments give readings; a living person must choose what to do. Lithen has a rubbing made for the descent.','Three columns show clearly. The words beneath them do not. You copy Stone, Brass and Echo, and mark the gap. The diagrams still show how to use the instruments.', 'archives-restoration',{success:{evidence:'The last line says the Keys give readings. A person chooses the setting.',item:{name:'First Register Rubbing',reason:'Lithen authorizes a pressure rubbing so the Gate team can carry the recovered refrain without risking the original.'},reputation:{accuracy:2}},failure:{evidence:'The table names Stone, Brass and Echo. Its last line is too faint to read.'}},{bonuses:[{item:'Archive Lens',bonus:3,label:'restoration lens'},{item:'Oil Flask',bonus:1,label:'glass catch'}]}),
      check('register-restorers','Help the restorers support the page as they lift it. (DEX)','DEX',12,'You slide a sheet of silk under the corner. The restorer lifts it just far enough to read six workers’ names missing from the public copy. Then she lowers it onto a dry support.','A corner comes away on the silk. You stop. The restorer saves the piece and shows you the tuning table on the undamaged half. You copy that instead.', 'archives-restoration',{success:{testimony:'Six workers’ signatures are missing from the ceremonial copy.',alliance:{lithen:1,worksfolk:1},repair:'First Register stabilized for continued restoration.'},failure:{consequence:'A fragile corner of the First Register tore during emergency restoration.',evidence:'The main calibration table survived intact.'}},{bonuses:[{item:'Foundry Gloves',bonus:1,label:'steady grip'},{reputation:'humility',threshold:1,bonus:1,label:'followed expert direction'}]}),
      check('register-law','Compare who signed the original and the later copies. (CHA)','CHA',12,'In the original the crew can withhold its signature if the joint test fails. In the ceremonial copy an official signs for them. Lithen finds the order that made the change.','You find three changes to the signature lines. Two orders have no date. You can say what changed, but not who changed it first.', 'archives-restoration',{success:{evidence:'An official took over the crew’s right to sign off on a joint test.',reputation:{accuracy:1,courage:1},alliance:{lithen:1}},failure:{evidence:'The signature lines changed three times. Two orders are undated.'}},{bonuses:[{item:'Thread Ledger',bonus:1,label:'revision chain'},{evidence:'The pump crew and the bell crew stopped testing the machines together.',bonus:1,label:'civic pattern'}]})
    ]
  },

  'archives-restoration':{
    id:'archives-restoration',chapter:'archives',title:'The Echo Instrument',
    objective:'Show that the Echo Key can carry a reliable reading underground.',
    story:`The Echo Key is a spindle small enough to hold in one hand. Lithen seats it in the Well. She taps out the old reading, lifts the spindle, then sets it down again. The dish repeats the taps in the same order.

“Below the Archives you’ll have no leaves to compare,” she says. “Take this and you can play the same reading at the next station. But first I want to hear what you will send with it. If a date is missing, leave it missing.”`,
    choices:[
      check('echo-full-record','Copy the measured knocks and the gaps in your notes. (INT)','INT',13,'On playback you hear the short pause you marked at the stair. Lithen checks the copy against your ledger and signs it.','You reach a blank in your notes. You start the copy again and leave a silence there. “Better,” says Lithen. “I know where to start looking.”', 'archives-echo-key',{success:{evidence:'The playback repeats the pause you recorded at the stair.',alliance:{lithen:2},reputation:{accuracy:2}},failure:{consequence:'Lithen knows which part of the reading is missing.',reputation:{humility:1},alliance:{lithen:1}}},{bonuses:[{item:'Thread Ledger',bonus:2,label:'complete ledger'},{reputation:'accuracy',threshold:6,bonus:1,label:'record accuracy'}]}),
      check('echo-witnesses','Ask the workers to check their own readings before you copy them. (CHA)','CHA',12,'A pump hand corrects a beat you recorded too early. When she hears it again she nods. The other witnesses sign beside her.','“That isn’t what I heard,” a restorer says. You take out the single reading you made from two different accounts and enter both. She signs her own.', 'archives-echo-key',{success:{testimony:'Each witness signed a separate account of what they heard.',alliance:{worksfolk:2,lithen:1},reputation:{compassion:2}},failure:{reputation:{humility:1,accuracy:1},consequence:'The Echo test required revision after witness statements were over-summarized.'}},{bonuses:[{alliance:'worksfolk',bonus:1,label:'witness trust'},{reputation:'compassion',threshold:4,bonus:1,label:'representative record'}]})
    ]
  },

  'archives-echo-key':{
    id:'archives-echo-key',chapter:'archives',title:'Custody of Echo',
    objective:'Carry the Echo Key to Commander Orra at the lower watch.',
    story:`Lithen packs the spindle in a padded case and seals the loan in your ledger. “Commander Orra has the Stone Key. Her people know the foundations. Ask what the water is doing there before you tell her what I think.”

A runner waits at the stair with space in her pouch for a copy of your report. Down below, someone rings a small bell three times. The runner turns her head. “That’s the lower watch asking for hands.”`,
    enter:{key:'Echo',keyReason:'Lithen and the Archive witnesses release the calibration instrument after your record passes the Echo test.',milestone:'Earned institutional custody of the Echo Key.',flags:{echoEarned:true}},
    choices:[
      advance('echo-descend','Take the Echo Key directly to the lower watch.','depths-descent','You fasten the case and take the stairs two at a time. A Warden opens the barricade when she sees the Archive seal.',{route:'Archive pressure stair'}),
      advance('echo-copy','Send Brunna a copy before you go down.','depths-descent','The runner puts the copy inside her coat, out of the rain. You take the original down to the barricade.',{repair:'A sealed copy of the investigation was secured aboveground.',reputation:{accuracy:1}})
    ]
  },

  'depths-descent':{
    id:'depths-descent',chapter:'depths',title:'Orra’s Lower Watch',
    objective:'Find out how to reach the workers trapped on the Ninth Platform.',
    story:`At the barricade Commander Orra Vale is sorting wet brass name tags into rows. Eighteen hooks are empty. “Pump shift,” she says. “Their deck is hanging from three chains and a cracked bracket. There’s a stair behind it, but the door has jammed.”

She puts two Wardens on the barricade and takes a wrench herself. “We’ve a sling, a spare brace and a chain hoist. Tell me what else you need to know on the way.”`,
    enter:{alliance:{orra:1,wardens:1},milestone:'Reached Orra Vale’s lower watch.'},
    choices:[
      advance('orra-status','Ask how the deck moves before choosing a crossing.','depths-platform','“Water lifts it. Chains go slack. Water drops and the bracket takes the blow.” Orra puts the wrench through her belt. “If you hear the chains pull tight, don’t jump.”',{reputation:{accuracy:1}}),
      advance('orra-history','Ask why the pump shift stayed at its post.','depths-platform','“My order. We thought keeping the pumps running would save the ward.” Orra pockets the tags. “We’ll count people first this time.” Your ledger keeps her account beside the old rule that the works exist for the people.',{alliance:{orra:1},evidence:'Mullinen’s original principle put public life before preserving infrastructure.'})
    ]
  },

  'depths-platform':{
    id:'depths-platform',chapter:'depths',title:'The Ninth Platform',
    objective:'Get eighteen workers through the jammed door.',
    story:`You step onto a service ledge. Across a six-foot gap the Ninth Platform hangs beside the cavern wall. Eighteen pump workers crowd a jammed stair door at its rear. Black water lifts the whole deck without a wave. The chains go slack. When the water falls the deck drops onto its cracked stone bracket. A chip hits your boot.

Orra points up. A hoist on your ledge controls the middle chain. A spare brace lies beside it. At the far wall the door latch is exposed just above the workers’ heads. “Get me a moment when that door stands still,” she says, taking out her wrench.`,
    choices:[
      check('platform-brace','Brace the deck while Orra opens the door. (STR)','STR',14,'Two Wardens slide the brace across with you. You jam it under the deck as the water lifts. This time the bracket holds while Orra levers the door open. Eighteen people file up the stair. The last turns to pull you in.','The brace kicks back into your shoulder. Orra grabs the door as the deck tilts against it. You hold the rail level while the crew scrambles through. The empty platform rolls over, pumps and all. Upstairs, all eighteen answer their names.', 'depths-lower-watch',{success:{repair:'Ninth Platform stabilized long enough for a complete evacuation.',alliance:{orra:2,wardens:1},reputation:{courage:2},attributes:{STR:1}},failure:{consequence:'The Ninth Platform and its pumps were lost after the crew escaped.',hp:-2,hpReason:'struck by the failing platform brace',alliance:{orra:1}}},{bonuses:[{equippedAny:['Mender’s Clamp','Rope Coil'],bonus:2,label:'bracing gear'},{derived:'power',threshold:6,bonus:1,label:'power rating'}]}),
      check('platform-rigging','Reach the exposed latch along the upper chain. (DEX)','DEX',14,'A Warden clips you into the watch sling. Above the crowd you can reach the bent catch. You lift it; Orra pulls the door wide. The forewoman counts eighteen inside before she lets go of the handle.','The chain cuts your palm. Your boot knocks the lower bolt free and the workers prise the door open just wide enough. All eighteen get through before the deck swings away from the stair.', 'depths-lower-watch',{success:{repair:'Ninth Platform stair latch released for a complete evacuation.',alliance:{orra:1,worksfolk:1},reputation:{courage:2},attributes:{DEX:1}},failure:{hp:-1,hpReason:'cut while crossing the Ninth Platform suspension chain',consequence:'The Ninth Platform access route collapsed after the crew escaped.',alliance:{worksfolk:1}}},{bonuses:[{equippedAny:['Rope Coil','Lockpin','Cistern Boots'],bonus:2,label:'crossing gear'},{item:'Surveyor’s Chalk',bonus:1,label:'marked swing timing'}]}),
      check('platform-counterload','Use the hoist to hold the deck level with the door. (INT)','INT',14,'You watch one rise and take up the slack on the next. For a few seconds the deck stays level. Orra frees the latch; the workers reach the stair. The water rose at the near wall and far chain at precisely the same time.','You take up the chain too late. The deck tips against the door. Orra uses its weight to force the latch, and everyone squeezes through. The pumps hang below the sill; no one can reach them now.', 'depths-lower-watch',{success:{repair:'Ninth Platform chains rebalanced against the pressure pulse.',evidence:'The rising water responds as one distributed motion across the reservoir.',reputation:{accuracy:2},attributes:{INT:1},alliance:{orra:1}},failure:{consequence:'The platform could not be rebalanced; its pumps were abandoned.',evidence:'Pressure timing changes near the reservoir wall.'}},{bonuses:[{item:'Echo Key',bonus:2,label:'pattern reference'},{equippedAny:['Surveyor’s Chalk','Mender’s Clamp'],bonus:1,label:'marked chain setting'}]}),
      check('platform-command','Have the workers lift the latch together at the top of the rise. (CHA)','CHA',13,'The forewoman repeats your signal down the line. Eighteen pairs of boots go still as the water rises. Three workers lift the latch, Orra pulls, and the rest pass through in pairs. “Eighteen,” says the forewoman, leaning against dry stone.','Half the line moves early. A Warden catches a falling worker; you catch them both and skin your knee. Orra plants her feet and holds the door. Eighteen workers reach the stair. The Warden needs a sling for her arm.', 'depths-lower-watch',{success:{testimony:'Watch and pump workers completed a shared evacuation under one timed plan.',alliance:{orra:1,worksfolk:2,wardens:1},reputation:{compassion:2},attributes:{CHA:1}},failure:{hp:-1,hpReason:'injured while catching a worker at the stair',consequence:'A Warden was injured during the Ninth Platform evacuation.',alliance:{worksfolk:1}}},{bonuses:[{alliance:'worksfolk',bonus:1,label:'worker trust'},{alliance:'wardens',bonus:1,label:'Watch support'}]})
    ]
  },

  'depths-lower-watch':{
    id:'depths-lower-watch',chapter:'depths',title:'What the Works Are For',
    objective:'Choose where Orra should send her remaining crew.',
    arrivals:{
      'platform-brace:success':'The forewoman stays beside you until you reach the barricade.',
      'platform-brace:failure':'From the barricade you can see an empty stretch of water where the pumps went down.',
      'platform-rigging:success':'The forewoman checks the last worker through the barricade.',
      'platform-rigging:failure':'You reach the barricade by the foundation stair. A medic cleans your palm.',
      'platform-counterload:success':'The rebalanced chains leave the Ninth Platform standing behind you, though no one mistakes the temporary repair for safety.',
      'platform-counterload:failure':'At the barricade the pump forewoman hands Orra eighteen brass tags, one for each worker who came up the stair.',
      'platform-command:success':'Watch members and pump workers arrive together, still repeating the timing that carried them across.',
      'platform-command:failure':'The rescued crew reaches the barricade while a medic binds the Warden injured by the conflicting orders.'
    },
    story:`Orra hangs the eighteenth tag on its hook. Then two messengers come up the stair. The reserve pump has stopped. Water has reached the bottom step of the lower ward. Families are still there.

“I can spare six people,” Orra says. “At the pump we might drain the ward and keep their homes dry. At the ward stair we can get them out now, even if the pump never starts. I can’t send the same six people both ways.”`,
    choices:[
      check('orra-evacuate','Send the crew to evacuate the lower ward. (CHA)','CHA',12,'The forewoman knows the ward by door number. You give her the household list and send a Warden to mark cleared doors.','Two crews have counted some of the same doors. Orra has them start at opposite ends and meet in the middle. It will take longer, but no house will be passed over.', 'depths-door-list',{success:{alliance:{orra:2,worksfolk:1},reputation:{compassion:2},testimony:'Orra assigned her Wardens to the lower households.'},failure:{alliance:{orra:1},repair:'The forewoman set a search order so no door is skipped.'}},{bonuses:[{evidence:'Mullinen’s original principle put public life before preserving infrastructure.',bonus:2,label:'First Register principle'},{reputation:'compassion',threshold:5,bonus:1,label:'humane record'}]}),
      check('orra-reinforce','Send the crew to restart the reserve pump. (INT)','INT',13,'You find a dry approach behind the intake. Orra takes her Wardens that way while a runner warns families to move upstairs.','The old approach is under water. You take the delivery stair instead. Orra closes the flooded gallery behind you and sends a runner to warn the houses.', 'depths-reserve-pump',{success:{repair:'A crew reached the reserve pump by a dry approach.',alliance:{orra:2,wardens:1},reputation:{accuracy:2}},failure:{consequence:'Floodwater closed the short approach to the reserve pump.',alliance:{orra:1}}},{bonuses:[{item:'Surveyor’s Chalk',bonus:1,label:'load marks'},{evidence:'The older steady note is audible beneath newer knocks.',bonus:1,label:'stable reference'}]})
    ]
  },

  'depths-door-list':{
    id:'depths-door-list',chapter:'depths',title:'Six Doors Below the Landing',
    objective:'Choose how to bring the lower households to shelter.',
    story:`Five families stand on the ward stair. The sixth door is shut. A boy in the queue says his grandmother went back for her boots. The forewoman has a key to the back court, but the water is already coming over the sill. Taking the whole queue down to look would put them in danger.`,
    enter:{flag:'wardFirst',route:'lower ward evacuation'},
    choices:[
      advance('ward-search','Send the queue up with a Warden and check the last house.','depths-foundation','The old woman is sitting on her bed with one boot on. “Knew where I left the other,” she says. You carry it while she holds your arm. At the landing the boy takes it from you. Six names, six households accounted for.',{flags:{familiesClear:true},testimony:'The forewoman checked all six households into shelter.'}),
      advance('ward-stair','Move the queue now and leave a guide at the last door.','depths-foundation','The families reach the high landing before the water crosses the stair. Your guide stays at the back court with a lamp. Nobody can yet tell the boy whether his grandmother came out.',{flags:{lastDoor:true},repair:'A lit escape route stays open for late arrivals.'})
    ]
  },
  'depths-reserve-pump':{
    id:'depths-reserve-pump',chapter:'depths',title:'The Reserve Pump',
    objective:'Choose where to send the water the spare pump can move.',
    story:`The spare pump stands on dry stone. Its intake reaches the flooded ward; a second intake serves the foundation stair. The crew has only one sound hose. The mechanic fills its bell with water so it will draw instead of sucking air. “Which inlet? The houses, or the stair we’ll need if we have to get people out?”`,
    enter:{flag:'worksFirst',route:'reserve pump repair'},
    choices:[
      advance('pump-homes','Drain the houses and post a runner at the stair.','depths-foundation','The mechanic fits the hose to the ward inlet. A runner comes back with a wet strip of wallpaper. The water in the first house has dropped that far. The route to the foundation still needs watching.',{flags:{homesPumped:true},repair:'The reserve pump drains the lower homes.'}),
      advance('pump-stair','Keep the escape stair dry until a second hose arrives.','depths-foundation','The pump takes hold. One by one the stair treads rise clear of the water. Orra leaves a Warden there to guide families up. The houses are still flooding; this bought an exit, not dry homes.',{flags:{dryStair:true},repair:'The reserve pump keeps the foundation stair open.'})
    ]
  },

  'depths-foundation':{
    id:'depths-foundation',chapter:'depths',title:'The Stone Test',
    objective:'Test the pier that supports the route to the Brassworks.',
    story:`Three piers support the next landing. Beside each one an iron pointer moves over a scale. Orra sets a stone block in a brass frame. Its pointer moves with the nearest pier. “Stone Key. Tells me how much weight that pier is carrying. Can’t tell me if I’ve picked the right pier.”

A mechanic points to a timber under the middle arch. “I put that in last winter. Temporary work. It isn’t on your drawing.” Beyond this landing lies the supply bridge to the Brassworks. Before anyone crosses, somebody must work out what will hold.`,
    choices:[
      check('stone-strip','Ease the spare braces one at a time and watch the gauges. (STR)','STR',14,'Two braces come loose without moving a pointer. At the third, the middle gauge jumps. You drive that brace home and mark it to stay. Orra clears the center path.','The first gauge sticks. You leave the braces in place and mark only the strip Orra can test with a loaded trolley. Everyone crosses single file.', 'depths-stone-key',{success:{repair:'Founder piers returned to a clear, shared load path.',reputation:{courage:2,accuracy:1},alliance:{orra:1}},failure:{repair:'A narrow safe path was marked through the foundation chamber.',consequence:'Conflicting braces still obscure part of the terrace load.'}},{bonuses:[{item:'Mender’s Clamp',bonus:2,label:'controlled release'},{derived:'power',threshold:6,bonus:1,label:'power rating'}]}),
      check('stone-calculate','Measure the load on the timber missing from the drawing. (INT)','INT',14,'You compare the pointer with and without a trolley on the timber. It carries part of the terrace. The mechanic shows you how to spread that weight onto the center pier.','The trolley gives a good reading at the center but not at either edge. You mark the center safe and leave the side paths closed.', 'depths-stone-key',{success:{evidence:'An undocumented worker repair carried a critical share of the terrace load.',repair:'Terrace load transferred into the center founder pier.',reputation:{accuracy:2},alliance:{worksfolk:1}},failure:{evidence:'The center founder pier is safe, but the full terrace load remains provisional.'}},{bonuses:[{item:'Echo Key',bonus:2,label:'pattern return'},{item:'First Register Rubbing',bonus:1,label:'founder table'}]}),
      check('stone-witness','Have the mechanic and Warden test the crossing together. (CHA)','CHA',13,'The mechanic places the trolley; a Warden calls the reading. They trade places and get the same result. Both sign the maintenance card.','The two disagree about the outer pier. Orra keeps it closed. The crew tests the center together and takes that way across.', 'depths-stone-key',{success:{testimony:'Wardens and workers signed a shared foundation maintenance record.',alliance:{orra:2,wardens:1,worksfolk:1},reputation:{compassion:1}},failure:{alliance:{orra:1},consequence:'The foundation plan proceeds without full Watch agreement.'}},{bonuses:[{alliance:'orra',bonus:1,label:'Orra’s trust'},{alliance:'worksfolk',bonus:1,label:'worker support'}]})
    ]
  },

  'depths-stone-key':{
    id:'depths-stone-key',chapter:'depths',title:'Custody of Stone',
    objective:'Carry the Stone Key toward the Brassworks.',
    story:`Orra releases the Stone Key from its frame. “Take it. At the Gate you’ll need to know what the foundations can stand.” She gives the signed crossing card to the Warden staying on the pier.

From the supply bridge comes a scrape, a pause, then another scrape. The mechanic frowns. “That pump’s on the Brassworks line. Nobody on this side has the switch.”`,
    enter:{key:'Stone',keyReason:'Orra and the lower watch release the load instrument after the foundation is made legible.',milestone:'Earned institutional custody of the Stone Key.',flags:{stoneEarned:true}},
    choices:[
      advance('stone-route','Follow the supply bridge to the Brassworks.','depths-cistern-crossing','The mechanic points you to the bridge rail. “Keep that on your left. Sound carries around corners down here.”',{route:'old supply channel'}),
      advance('stone-send-word','Send the crossing instructions back to the Archives.','depths-cistern-crossing','Orra gives a runner the tested limits and orders copies left at both stairs. Then she shows you the supply bridge.',{repair:'Foundation record distributed to Watch and Archives.',alliance:{orra:1}})
    ]
  },

  'depths-cistern-crossing':{
    id:'depths-cistern-crossing',chapter:'depths',title:'The Breathing Water',
    objective:'Cross the reservoir and test the effect of the scraping pump.',
    story:`The bridge runs out of lamplight before you can see its far end. A damaged pump scrapes against its case. Black water lifts along the whole rail at once. It settles without breaking into waves.

You play the steady reading Lithen copied onto the Echo Key. Beside the stone where you rest it, the water falls a finger’s width. The pump scrapes and it rises again. A chain fixed to the wall offers a way across if the deck goes under.`,
    choices:[
      check('cistern-chord','Play the steady reading at each bridge support. (INT)','INT',14,'At the first support the water falls below your boot. It does the same at the second. You cross on dry stone and mark the supports for the next crew.','The pump drowns out the reading halfway across. Water knocks you against the rail. You catch the wall chain and finish with a bruised side.', 'brassworks-threshold',{success:{evidence:'The distributed water eased around a stable founder interval without receiving a spoken command.',reputation:{accuracy:2},repair:'You marked the supports where the crossing stayed dry.'},failure:{hp:-1,hpReason:'battered by water while reaching the exposed wall chain',consequence:'The cistern crossing required the exposed wall chain.'}},{bonuses:[{item:'Echo Key',bonus:2,label:'stable interval'},{item:'Stone Key',bonus:1,label:'load reading'}]}),
      check('cistern-chain','Cross using the wall chain. (DEX)','DEX',13,'You wait for the water to settle before each step. The chain stays taut to the Brassworks door. You mark its first link for whoever comes next.','The last ring pulls loose. You cut your hand but catch the far rail. From the doorway you signal back that the chain must not be used again.', 'brassworks-threshold',{success:{reputation:{courage:2},route:'quiet wall-chain crossing'},failure:{hp:-1,hpReason:'cut by the wall chain when its last anchor failed',consequence:'The wall-chain route collapsed after the crossing.'}},{bonuses:[{equipped:'Cistern Boots',bonus:2,label:'wet-footing boots'},{item:'Rope Coil',bonus:1,label:'backup line'}]}),
      check('cistern-pump','Stop the pump arm from striking its case. (STR)','STR',14,'The mechanic holds the stop lever while you wedge the arm clear. The scrape stops. All along the bridge water slips down the stone at the same instant.','The arm knocks you against the rail. The mechanic pulls the belt. The pump cannot run, but neither can it strike the case. You make the crossing.', 'brassworks-threshold',{success:{repair:'Damaged cistern pump secured against its housing.',evidence:'Removing one discordant impact calmed water across the full cistern.',reputation:{courage:1}},failure:{hp:-2,hpReason:'thrown against the rail by the damaged pump arm',repair:'Damaged pump disabled after a final pressure surge.'}},{bonuses:[{item:'Mender’s Clamp',bonus:2,label:'housing clamp'},{derived:'power',threshold:6,bonus:1,label:'power rating'}]})
    ]
  },

  'brassworks-threshold':{
    id:'brassworks-threshold',chapter:'brassworks',title:'The Silent Brassworks',
    objective:'Find out why the crews cannot restart the Brassworks.',
    story:`Beyond the bridge, furnace doors stand open on cold ash. Sella Flintwake strikes a bell-shaped brass ring fixed to the floor. Across the room, a washer jumps on a pump housing.

“That ring is the anchor,” she says. “It carries one machine’s vibration to the others. They ran fine on their own tests. Run them together and they shake bolts loose.” The furnace crew wants to replace the ring. The Brass Choir, whose tuners set the machines to run together, wants to check the timing first.`,
    enter:{alliance:{choir:1},milestone:'Reached the Brass Choir team in the silent Brassworks.'},
    choices:[
      advance('works-hear-sella','Ask Sella to show you the timing problem.','brassworks-sella','She turns two hand cranks separately. Both run smoothly. When she turns them together the washer rattles off the housing. “There. Same parts both times.”',{evidence:'Isolated repairs became destructive when their tones were combined.'}),
      advance('works-hear-workers','Ask the furnace crew when the ring began to slip.','brassworks-sella','“After we changed the alloy,” says the founder. “It expands sooner when hot. Nobody told the pump crew we’d changed it.” He takes you to Sella’s bench to compare the pieces.',{testimony:'The new alloy expands sooner; the other crews were not told.',alliance:{worksfolk:1}})
    ]
  },

  'brassworks-sella':{
    id:'brassworks-sella',chapter:'brassworks',title:'Sella’s Salvage Table',
    objective:'Learn to use Sella’s fork before testing the anchor.',
    story:`Sella strikes a two-pronged fork against her palm and holds it beside the anchor. You hear a slow throb between the two notes. She turns an adjusting screw. The throb slows and disappears.

“Now they match. Hear the throb come back, stop turning.” She puts the fork in your hand. Her spare tools are for sale; the fork is a loan. The crews are waiting on the furnace floor.`,
    enter:{item:{name:'Resonance Fork',reason:'Sella lends you the fork recovered from the failed anchor so its last stable setting can guide the repair.'},alliance:{sella:1}},
    choices:[
      merchant('sella-shop','Browse Sella’s spare tools.','sella'),
      advance('sella-anchor','Take the fork to the repair crews.','brassworks-choir','Sella brings a spare ring. “Get that fork back in one piece. It took me a week to file.”',{reputation:{accuracy:1}})
    ]
  },

  'brassworks-choir':{
    id:'brassworks-choir',chapter:'brassworks',title:'A Chord Built by Many Hands',
    objective:'Agree on a restart signal every crew can use.',
    story:`Sella lays a worker’s sketch beside the Choir’s measurements. Four systems share the floor: furnace bellows, pump, gears and anchor. Start the gears before the pump takes the load and a whole turn of the shaft goes through the anchor instead.

“Count four beats after the bellows start,” says a tuner. The pump hand shakes her head. “Five when the water’s cold. Put someone where they can see my gauge.” Neither can see the other from their station. From the service gantry you can see both.`,
    choices:[
      check('choir-plan','Work out the restart order with the pump hand. (INT)','INT',13,'She chalks a mark on the pressure gauge. The crew will wait for the needle, not a fixed count. The tuner copies the mark onto his plan.','You miss the needle on the first trial. The crew adopts a slower signal: nobody starts until the pump hand raises her whole arm.', 'brassworks-anchor',{success:{repair:'Choir and Worksfolk agreed on a coherent full-floor tuning sequence.',alliance:{choir:2,worksfolk:2},reputation:{accuracy:2}},failure:{repair:'A slower Brassworks tuning sequence was adopted with wider safety margins.',alliance:{choir:1,worksfolk:1}}},{bonuses:[{testimony:'The new alloy expands sooner; the other crews were not told.',bonus:1,label:'worker timing'},{item:'Resonance Fork',bonus:1,label:'anchor reference'}]}),
      check('choir-authority','Give each crew a say before signing the restart order. (CHA)','CHA',13,'The furnace worker needs the ring checked hot; the pump hand needs time to build pressure. You put both conditions on the order before asking anyone to sign.','Two chiefs still disagree about the delay. You note who saw what and have them run a cold trial. Nobody has to accept a timing they cannot test.', 'brassworks-anchor',{success:{testimony:'Choir and Worksfolk objections were answered in one public repair record.',alliance:{choir:1,worksfolk:2},reputation:{compassion:2}},failure:{evidence:'A recorded worker objection exposed an unsafe tuning interval.',consequence:'Choir and Worksfolk cooperation remains strained.'}},{bonuses:[{item:'Deep Writ Seal',bonus:1,label:'public authority'},{reputation:'compassion',threshold:5,bonus:1,label:'fair hearing'}]})
    ]
  },

  'brassworks-anchor':{
    id:'brassworks-anchor',chapter:'brassworks',title:'The First Harmonic Anchor',
    objective:'Set the anchor so the crews can run their machines together.',
    story:`The anchor has three rings. The inner two hold their pitch. As the furnace warms, the outer one scrapes its stop. The trough beneath it splashes onto the test floor.

Sella has brought a spare. The tuner can adjust the stop, or each crew can change its speed a little. “If the trough jumps,” Sella says, “cut the drive. We can lose a morning. I’d rather not lose a hand.”`,
    choices:[
      {...advance('anchor-gloves','Stop the drive and fit the spare with your heat-capped gloves.','brassworks-interference','Sella cuts the drive. Heat still rises from the shaft, but the leather palms let you hold the ring steady while she threads the bolts. On the next trial the ring turns without scraping.',{repair:'The hot replacement ring turns clear of its stop.',alliance:{sella:1}}),needsEquipped:'Foundry Gloves'},
      check('anchor-retune','Adjust the outer ring until the throbbing stops. (INT)','INT',15,'You turn the screw and wait for the ring to warm. The notes come together. Water slips down the sides of the trough and stays there.','The third ring runs out of adjustment. You leave the furnace cold. Two rings carry a steady note, enough to test the rest of the line.', 'brassworks-interference',{success:{repair:'All three rings held their note as the furnace warmed.',evidence:'The trough stopped splashing when the rings held one note.',alliance:{choir:1,worksfolk:1},reputation:{accuracy:2}},failure:{repair:'First harmonic anchor stabilized at a partial chord.',consequence:'The furnace remains shut down until the third ring is replaced.'}},{bonuses:[{item:'Resonance Fork',bonus:2,label:'anchor reference'},{item:'Echo Key',bonus:1,label:'pattern'},{item:'Stone Key',bonus:1,label:'load'}]}),
      check('anchor-replace','Fit Sella’s spare ring with the drive stopped. (DEX)','DEX',14,'You fit the spare while the shaft is still. It clears the stop even when hot. A furnace hand gives you heat-capped gloves for the next station.','Heat comes up the shaft sooner than expected. You burn your wrist and pull back. Sella clamps the ring and marks the drive for half speed.', 'brassworks-interference',{success:{repair:'The spare ring clears the stop even when hot.',alliance:{worksfolk:2,sella:1},reputation:{courage:1},item:{name:'Foundry Gloves',reason:'The furnace crew gives you heat-capped gloves after the successful ring change.'}},failure:{repair:'Drifting anchor ring clamped below full power.',hp:-1,hpReason:'burned while withdrawing from the warming anchor'}},{bonuses:[{equippedAny:['Foundry Gloves','Mender’s Clamp','Cistern Boots'],bonus:2,label:'prepared work gear'}]}),
      check('anchor-call','Bring each crew in when its neighbor is ready. (CHA)','CHA',14,'The pump hand raises her arm. You signal the gears and watch the trough. Both run without spilling a drop.','An echo makes the gear crew start early. You stop the trial. On the second run everyone watches your hand; the floor holds at half speed.', 'brassworks-interference',{success:{repair:'First anchor tuned through a witnessed multi-crew sequence.',alliance:{choir:2,worksfolk:2},reputation:{compassion:1}},failure:{repair:'First anchor held at a partial setting after a delayed command.',consequence:'The floor lost time correcting an echoed instruction.'}},{bonuses:[{alliance:'choir',bonus:1,label:'Choir trust'},{alliance:'worksfolk',bonus:1,label:'crew trust'}]})
    ]
  },

  'brassworks-interference':{
    id:'brassworks-interference',chapter:'brassworks',title:'The Returning Beat',
    objective:'Stop the old lift wheel from striking the floor.',
    story:`The anchor runs steadily now, but a dull blow still comes through the floor. You follow it to an old lift. A stoneback crawler, a broad animal with overlapping plates, has curled against the warm wheel. When the machines start it flinches and knocks the rim against a stop.

A furnace hand brings hot sand in a pan to tempt it into the dry slag bay. There is also room to pin the wheel or knock mineral crust off the rim without reaching beneath the animal.`,
    choices:[
      {...advance('crawler-signal','Use your whistle to tell the lift crew exactly when to stop.','brassworks-crawler','The lift operator cannot see the nest from her station. Sella tells her to cut the drive on one whistle. You wait for the crawler to follow the pan, then blow. The wheel stops before the animal can turn back. Sella shuts the bay gate.',{repair:'The crew stopped the wheel with the crawler safely inside the bay.',alliance:{worksfolk:1}}),needsItem:'Salt-Hound Whistle'},
      check('crawler-lure','Lure the crawler into the dry bay with the warm pan. (CHA)','CHA',13,'You move the pan a foot at a time. The crawler follows it into the bay. Sella shuts the gate, then picks up a shed plate from the nest and offers to fit it over your coat.','It follows the sand to the doorway and stops. Its tail clips your shin. The wheel is clear; you take the long way back rather than step over it.', 'brassworks-crawler',{success:{repair:'Stoneback crawler relocated from the lift housing without harm.',reputation:{compassion:2},item:{name:'Stoneback Plate',reason:'Sella recovers a naturally shed plate from the abandoned nest and fits it as armor.'}},failure:{hp:-1,hpReason:'struck while holding the crawler’s attention',consequence:'The crawler was moved from the mechanism but still blocks the slag-bay route.'}},{bonuses:[{item:'Salt-Hound Whistle',bonus:3,label:'animal call'},{item:'Oil Flask',bonus:1,label:'heated lure'}]}),
      check('crawler-wheel','Pin the wheel while the crawler is still. (DEX)','DEX',14,'You wait until it settles. A lift worker passes you the locking bar. You slide it through the spokes. The next flinch makes no sound upstairs.','The worker’s pin bends, but jams the wheel. You keep the bent pin when she fits a bar in its place. The outer gear will need replacing.', 'brassworks-crawler',{success:{repair:'Abandoned lift engine isolated from the tuning network.',reputation:{courage:1,accuracy:1}},failure:{repair:'Lift engine stopped with damage to its outer gear.',item:{name:'Bent Lockpin',reason:'You keep the bent pin as evidence of the force inside the fused flywheel.'}}},{bonuses:[{equipped:'Lockpin',bonus:2,label:'flywheel catch'},{item:'Echo Key',bonus:1,label:'movement pattern'}]}),
      check('crawler-free','Break the mineral crust away from the wheel rim. (STR)','STR',15,'Sella holds a lamp while you knock the crust loose. The wheel turns by hand. The crawler slips from its nest into the warm bay.','The crust comes away in a slab. You take the edge across your back as the animal scrambles clear. Sella disconnects the damaged lift.', 'brassworks-crawler',{success:{repair:'Lift flywheel freed and made available for retuning.',reputation:{courage:2},alliance:{worksfolk:1}},failure:{hp:-2,hpReason:'struck while shielding the crawler from falling stone',consequence:'The abandoned lift engine was damaged while the crawler escaped safely.',reputation:{compassion:1}}},{bonuses:[{derived:'power',threshold:7,bonus:1,label:'power rating'},{equipped:'Warden Pick',bonus:2,label:'controlled breaking'}]})
    ]
  },

  'brassworks-crawler':{
    id:'brassworks-crawler',chapter:'brassworks',title:'The Whole Floor Holds',
    objective:'Test the full floor before releasing the Brass Key.',
    arrivals:{
      'crawler-lure:success':'The furnace hand chalks a warning on the bay gate so nobody opens it during the test.',
      'crawler-lure:failure':'The crew gives the blocked slag bay a wide berth and returns to the tuning controls by the longer route.',
      'crawler-wheel:success':'With the lift engine isolated, the second beat disappears from the floor.',
      'crawler-wheel:failure':'The cracked outer gear is unsafe to run, but the stopped engine can no longer disrupt the tuning sequence.',
      'crawler-free:success':'Workers turn the freed flywheel by hand and match it to the repaired anchor.',
      'crawler-free:failure':'The crew marks the damaged lift engine for removal and closes it out of the active network.'
    },
    story:`At the anchor the trough is still enough to show the lamp upside down. Sella lifts the fork. “Don’t sign for four working machines because one of them sounds pretty. Tell me what happens at the far end.”

A worker goes back to the bridge with a lamp. Two lifts of the lamp will mean the water has fallen. One means stop.`,
    choices:[
      check('whole-floor-hold','Match the fork and wait for the signal from the bridge. (INT)','INT',14,'All four stations hold the note. At the far door the lamp rises twice. You write down the setting and the drop at the bridge.','The notes drift when the furnace heats. At half speed the worker gives the all-clear. You mark that limit on the drive.', 'brassworks-brass-key',{success:{repair:'Brassworks full-floor harmony restored across all four systems.',evidence:'The bridge crew saw the water drop during the four-station test.',alliance:{choir:2,worksfolk:1},reputation:{accuracy:2}},failure:{repair:'Brassworks stabilized within a narrow safe tonal range.',alliance:{choir:1,worksfolk:1}}},{bonuses:[{item:'Resonance Fork',bonus:2,label:'tone reference'},{repair:'All three rings held their note as the furnace warmed.',bonus:1,label:'restored anchor'},{alliance:'choir',bonus:1,label:'Choir support'}]}),
      check('whole-floor-witness','Collect a reading from each station. (CHA)','CHA',13,'The furnace hand gives the temperature. The pump hand gives the pressure. At the bridge the worker measures the fall in water. All sign beside their readings.','Two gauges have no readable numbers. The workers repeat the trial and mark where the needles stopped. You record a safe setting, not a precise measurement.', 'brassworks-brass-key',{success:{testimony:'Every Brassworks crew witnessed the full-floor tuning and recorded unfinished work.',alliance:{choir:1,worksfolk:2},reputation:{compassion:2}},failure:{testimony:'Brassworks crews confirmed the stable tuning despite incomplete testimony.'}},{bonuses:[{alliance:'worksfolk',bonus:1,label:'crew trust'},{reputation:'compassion',threshold:6,bonus:1,label:'shared credit'}]})
    ]
  },

  'brassworks-brass-key':{
    id:'brassworks-brass-key',chapter:'brassworks',title:'Custody of Brass',
    objective:'Take the tested Brass Key to the Gate.',
    story:`The tuner takes a little brass reed out of the anchor. It keeps sounding the note the crews just set. “This is the Brass Key. Play it at the Gate and the other anchors can match ours. No use to you yesterday. Yesterday it would have repeated the fault.”

Sella leaves the crews at their stations. You will need someone here to answer when you try the reed below.`,
    enter:{key:'Brass',keyReason:'The Brass Choir and Works crews release the tonal instrument after the full-floor sequence holds.',milestone:'Earned institutional custody of the Brass Key.',flags:{brassEarned:true,networkImproved:true}},
    choices:[
      advance('brass-gate','Take the reed straight to the Gate.','gate-approach','Sella leads you along the conduit that carries the anchor’s note through the wall.',{route:'Brassworks Gate conduit'}),
      advance('brass-message','Send the safe setting to the pump crews before leaving.','gate-approach','A runner copies the setting and test limits onto a slate. You and Sella take the reed down the conduit stair.',{repair:'Upper pump crews received the Brassworks safe interval.',reputation:{compassion:1}}),
      {...advance('brass-relief','Send the spare furnace crew to check the last houses.','gate-approach','At your request Sella sends two fitters and a medic up the ward stair. They bring back a signed household list. This time the forewoman can put a tick beside every name.',{flags:{familiesClear:true},testimony:'A second crew confirmed the whole ward reached shelter.'}),needsFlag:'worksFirst'},
      {...advance('brass-hose','Send a Brassworks hose and fitter to the reserve pump.','gate-approach','The fitter takes the spare hose upstairs. Before you leave, the pump hand sends word: the new line is drawing from the houses. People in shelter now have a better chance of going home.',{flags:{homesPumped:true},repair:'A Brassworks fitter connected the reserve pump to the houses.'}),needsFlag:'wardFirst'}
    ]
  },

  'gate-approach':{
    id:'gate-approach',chapter:'gate',title:'The Gate of Measures',
    objective:'Find out what each Key controls before opening the Gate.',
    story:`Three sockets surround a bronze map at the Gate of Measures. Cut into the floor below them are working drawings: the same pier you tested with Orra, the ring you tuned with Sella, the dish in Lithen’s Well. These were instructions for the next crews, not a lock meant to keep them out.

A copy of the Founding Covenant is fixed beside the controls. It requires the people who test a public work to record who will bear its weight and who will maintain it. No setting on this desk can sign for them.`,
    enter:{milestone:'Reached the Gate of Measures with all three institutional Keys.',flags:{gateReached:true}},
    choices:[
      advance('gate-seat','Fit each Key to its matching drawing.','gate-weight','Stone fits the outlined pier, Brass the ring, Echo the dish. When the last spindle seats, needles rise across the map. One red needle trembles over the homes below the terrace.',{reputation:{accuracy:1}})
    ]
  },

  'gate-weight':{
    id:'gate-weight',chapter:'gate',title:'The Reading of Weight',
    objective:'Relieve the load on the lower ward or clear the homes still at risk.',
    story:`The Stone dial moves when a Warden rolls a loaded trolley across the foundation. A second needle moves beneath the model of the lower ward. Now you can see what rests on the same pier.

You can spread the load onto the tested center pier. Or you can leave that pier alone and send warnings to the streets above the weakest supports. Orra has runners waiting for street names.`,
    choices:[
      check('gate-weight-public','Transfer part of the ward’s weight onto the tested pier. (INT)','INT',12,'You move the lever until the ward needle drops a notch. The center pier holds. A Warden chalks the new limit on the wall for the next shift.','The center needle rises sooner than expected. You stop after a small transfer. The lowest streets must stay on the watch list.', 'gate-tone',{success:{repair:'Gate load route prioritizes vulnerable public works.',evidence:'The center pier took part of the ward’s weight without shifting.',alliance:{orra:1}},failure:{repair:'Gate load route established at a smaller safe transfer.',consequence:'Several lower districts remain near their load limit.'}},{bonuses:[{item:'Stone Key',bonus:2,label:'Weight instrument'},{repair:'Founder piers returned to a clear, shared load path.',bonus:1,label:'foundation repair'}]}),
      check('gate-weight-evac','Warn the streets above the weakest supports. (CHA)','CHA',12,'You give Orra the street names in order of danger. Runners report back from each door. The last family on the list leaves before the pier starts to shift.','Two lanes have the same old name. By the time the runners sort them out, only the lowest street has been checked. Orra sends another team.', 'gate-tone',{success:{repair:'Gate reading guided targeted evacuations from failing loads.',reputation:{compassion:2},alliance:{wardens:1}},failure:{consequence:'Only the most vulnerable district completed evacuation before calibration.'}},{bonuses:[{alliance:'wardens',bonus:1,label:'Watch network'},{reputation:'compassion',threshold:7,bonus:1,label:'public trust'}]})
    ]
  },

  'gate-tone':{
    id:'gate-tone',chapter:'gate',title:'The Reading of Tone',
    objective:'Decide how far to send the Brassworks setting.',
    story:`Sella seats the Brass reed against a row of little bells. Each bell is connected to a different station. A light strike here repeats the working note there. The crews can signal back by striking their own bell twice.

“Silence doesn’t mean it’s safe,” Sella says. “Could mean the crew had to run.” You can try the setting on tested lines or wait for each crew to answer first.`,
    choices:[
      check('gate-tone-coherent','Send the working note down the tested lines. (INT)','INT',13,'The first anchor holds, then the second. Water slips off a black mark on the Gate wall. You record how far it fell before trying the next line.','One line rattles. You cut it out and keep the others at the last safe note. The water falls on those lines only.', 'gate-pattern',{success:{repair:'A coherent Gate interval reached every repaired anchor.',evidence:'Water fell at the Gate when the tested anchors sounded together.'},failure:{repair:'Gate interval confined to verified anchors.',consequence:'Unrepaired branches remain outside the stable tonal path.'}},{bonuses:[{item:'Brass Key',bonus:2,label:'Tone instrument'},{repair:'Brassworks full-floor harmony restored across all four systems.',bonus:2,label:'full-floor harmony'}]}),
      check('gate-tone-crews','Wait for a reply from each station before tuning it. (CHA)','CHA',13,'Two taps from the Well. Two from the watch. Two from the furnace. Each crew hears the next station join. The last strikes twice as the needle settles.','One bell stays silent. You leave its line untouched and send a runner to find out whether the crew needs help. The other stations hold.', 'gate-pattern',{success:{testimony:'Archive, Watch, Works, and Choir crews answered through one Gate sequence.',alliance:{choir:1,worksfolk:1,wardens:1,lithen:1,orra:1}},failure:{consequence:'One remote repair branch could not join the Gate sequence.'}},{bonuses:[{alliance:'choir',bonus:1,label:'Choir support'},{alliance:'worksfolk',bonus:1,label:'Works support'},{alliance:'orra',bonus:1,label:'Orra’s watch'}]})
    ]
  },

  'gate-pattern':{
    id:'gate-pattern',chapter:'gate',title:'The Reading of Pattern',
    objective:'Check the Gate readings against the crews’ field records.',
    story:`The map at the Gate still shows a dry street where you saw a dye-house. Before you trust the rest of it, you need to know which old connections still exist. Echo can play the older readings beside the measurements in your ledger.

Lithen answers from the Well through a speaking tube. “I have the originals open. Give me a place and a date. If the pages disagree, we will keep both.”`,
    choices:[
      check('gate-pattern-full','Compare your readings with Lithen’s originals. (INT)','INT',13,'The old market reading includes a pipe the newer plan leaves out. Your notes confirm it still runs. You restore the connection to the map and enter the gaps alongside the matches.','Two early readings have no dates. You mark both unverified instead of placing them on the wrong line. The other entries match.', 'gate-counter',{success:{evidence:'The crew put the missing market pipe back on the Gate map.',reputation:{accuracy:2},flags:{fullRecord:true}},failure:{evidence:'Two readings on the Gate map still have no dates.'}},{bonuses:[{item:'Echo Key',bonus:2,label:'Pattern instrument'},{item:'Thread Ledger',bonus:1,label:'joined record'},{reputation:'accuracy',threshold:8,bonus:1,label:'record integrity'}]}),
      check('gate-pattern-witness','Ask the people at each station to check their own entry. (CHA)','CHA',13,'Orra reads the pier markings. Sella gives the final setting, and the archive clerk checks the dates. Each signs for work they actually saw.','Two witnesses remember the order of a repair differently. Both agree on where it stands today. You keep their separate accounts and confirm only the current setting.', 'gate-counter',{success:{testimony:'Orra signed for the piers, Sella for the machines and the archive clerk for the dates.',alliance:{lithen:1,orra:1,choir:1,worksfolk:1},flags:{broadWitness:true}},failure:{testimony:'Two witnesses disagree about the date but confirm the current setting.'}},{bonuses:[{alliance:'lithen',bonus:1,label:'Archive trust'},{alliance:'orra',bonus:1,label:'Watch trust'},{alliance:'choir',bonus:1,label:'Choir trust'}]})
    ]
  },

  'gate-counter':{
    id:'gate-counter',chapter:'gate',title:'The Counter Reading',
    objective:'Read what the crews can safely keep running tonight.',
    arrivals:{
      'gate-pattern-full:success':'Lithen sends the corrected map down to the Counter.',
      'gate-pattern-full:failure':'The Counter marks two early observations as unresolved and continues with the evidence you could verify.',
      'gate-pattern-witness:success':'The witnesses seal their separate statements before the Counter begins its reading.',
      'gate-pattern-witness:failure':'One disputed repair remains visible beside the witnesses’ shared account.'
    },
    story:`The Counter is a bank of dials, not a judge. Stone shows which piers are loaded. Brass shows which stations can hold a setting. Echo distinguishes a recent test from an old entry nobody has checked. The red needles tell you where you must not put more weight.

Brassreach cannot be restored tonight. But when a crew starts a tested machine, the water at the Gate drops. Beneath the Counter, a dry step appears. You can now reach the chamber on the far side.`,
    enter:{flags:{counterRead:true},milestone:'Read the Counter’s limits before choosing the final setting.'},
    choices:[
      advance('counter-enter','Unseat the Keys and take the newly exposed steps.','choice-contact','The dials keep their last readings. Sella stays at the controls. You take the three instruments down to the water.',{reputation:{courage:1}})
    ]
  },

  'choice-contact':{
    id:'choice-contact',chapter:'choice',title:'The Unfathomer’s Nearness',
    objective:'Watch how the lights respond to the working note.',
    story:`The passage widens until you can no longer see either wall. Your lamp catches a few blue points on still black water. You raise it higher. Thousands more come into view. Far overhead their light brushes the tips of stalactites.

You set down the Keys. At the sound of the Brass reed every blue point moves at once. No face waits in the water. No hidden voice explains what the movement means. You think of the pump scraping its case, and of the water settling when it stopped. You set the reed on the last dry step. The lights draw close enough to show the seams in your boots.

Behind you Sella calls, very softly, “I’m at the controls. Tell me which way.”`,
    choices:[
      advance('contact-read','Ask Sella which settings the crews can maintain.','choice-decision','Her answer comes plainly down the stair. The crews can ease the pressure here, send it elsewhere, put a barrier in its way, or cut the old connections. The difference will be felt upstairs, in places where people live.',{milestone:'Reached a nonverbal understanding of the deep network’s distress.'})
    ]
  },

  'choice-decision':{
    id:'choice-decision',chapter:'choice',title:'The Living Choice',
    objective:'Choose the first direction Brassreach will sustain after this night.',
    story:`“The west line goes to the empty tuning quarries at Porkkala,” Sella calls. “We can send some of the pressure there. Or we can close the deep line and tend a barrier here. Cut the line altogether and the old machines it serves will never turn again.”

There is another possibility. If enough crews will stay at the repaired stations, they can keep the chambers in tune together. The Gate can also hold just the weakest piers for tonight while the city decides what to do next. Sella waits with her hand off the lever. The blue lights are close enough now to shine through your fingers.`,
    choices:[
      {id:'ending-concord',type:'ending',ending:'concord',label:'Keep crews at the repaired stations and tune the city together.',sentence:'Begin a Concord.',requirements:{keys:3,evidence:7,repairs:6,alliances:4},requirementText:'Requires all three Keys, strong evidence, six repairs, and four allied institutions.'},
      {id:'ending-channel',type:'ending',ending:'channel',label:'Channel the deep pressure toward Porkkala’s old tuning quarries.',sentence:'Channel the Unfathomer toward Porkkala.',requirements:{keys:3,evidence:5,repairs:4},requirementText:'Requires all three Keys and a credible repaired route.'},
      {id:'ending-bind',type:'ending',ending:'bind',label:'Close the barriers and post crews to monitor both sides.',sentence:'Bind the deepest network.',requirements:{keys:2,repairs:3},requirementText:'Requires at least two Keys and three completed repairs.'},
      {id:'ending-banish',type:'ending',ending:'banish',label:'Sever the deep connections, permanently stopping the old works.',sentence:'Sever the old resonant paths.',requirements:{keys:2},requirementText:'Requires at least two Keys; the cultural and structural cost is severe.'},
      {id:'ending-hold',type:'ending',ending:'hold',label:'Shore the weakest piers for tonight and keep the other lines open.',sentence:'Hold the immediate rise.',requirements:{keys:2},requirementText:'Requires at least two Keys and remains a valid, temporary resolution.'}
    ]
  }
};

export const MERCHANTS = {
  dorrin:{
    id:'dorrin',name:'Quartermaster Dorrin',title:'Institute Field Supplies',
    greeting:'“Buy for the climb back, not just the walk down,” Dorrin says. “Most first-timers forget there are two directions.”',
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
    address:`“I can’t promise you a quiet city,” you say. “But listen.” You set the Brass reed against the step. Through the stone comes the note Sella’s crew is holding. It stays true when the pump takes the load.`,
    strong:`Water slips off the lowest step. Back on the terrace the next morning, you find a pump hand and a Choir tuner eating breakfast on the stair. Neither has gone home yet: they are waiting for the next shift to test both machines together. Brunna brings the pay order for both crews. For the first time their names appear on the same page.`,
    strained:`The water drops at the stations that can hold the note. At the others it keeps rising. Brunna finds beds above the Hall for the families who cannot go back. When the residents ask what happens next she gives them the list of unfinished repairs and her office key.`
  },
  channel:{
    id:'channel',title:'Channel — A Quieter Shore',
    address:`You ask Sella to open the west line one gate at a time. The quarries at Porkkala once carried the same note. If the water there settles, the city will not have to drive the presence away to survive.`,
    strong:`A blue light passes under the west grating. An hour later the first quarry keeper reports still water beneath the old tuning arch. The pressure under the terraces eases. Brunna sends staff to the quarries with orders to keep measuring; an empty quarry is not an empty valley.`,
    strained:`Only one quarry takes the pressure. Water leaves the upper stair and backs up at the narrow west gate. The quarry crew must work through the night. The city owes them another pump before it asks them to take any more.`
  },
  bind:{
    id:'bind',title:'Bind — The Monitored Quiet',
    address:`“Close the barriers in pairs,” you call. “Leave the deep chambers connected to one another.” You wait beside the water while Sella works the levers. You do not know what the darkness will feel when the city grows quiet.`,
    strong:`Behind the barriers a few blue lights remain. On your side the water settles. The watch takes the first readings from both sides and marks the levels on the wall. Someone will have to come back every shift; Orra puts her own name first.`,
    strained:`The barriers stop the rise at the Gate, but one will not stay shut without a crew at its wheel. The lower watch gives up its dry mess room as a relief station. Brassreach has a boundary it can hold, not a permanent cure.`
  },
  banish:{
    id:'banish',title:'Banish — The Severed Wonder',
    address:`You ask Sella to cut the old connections. “Once the teeth come off these shafts, I can’t put them back,” she says. You look once more at the lights and give the order.`,
    strong:`The last shaft slows. The lights pass out of reach and the water goes down. Above, a miller waits for a wheel that will never turn again. Your report gives the district the night it needed and a long list of things it must now build by other means.`,
    strained:`The upper terraces stay dry. Below them the severed works fall silent before the water can drain. The lower district is closed; its residents cannot go home. When someone pins a notice saying the city was saved, a dyer pins her house key beneath it. You enter her address in the report.`
  },
  hold:{
    id:'hold',title:'Hold — Time Honestly Bought',
    address:`“Just the weakest piers for tonight,” you call. The Gate takes enough weight off them for the crews to set shores. You leave the other lines untouched.`,
    strong:`By dawn the water is level with the mark you made at midnight. Brunna lets the first watch go home to sleep. On her desk is a new duty roster, with the drain crews and the Choir on the same shift. The hard decision will still be theirs tomorrow.`,
    strained:`The upper stair holds. The lowest streets do not drain. The Hall opens its doors to sleepers, and nobody can say for how many nights. You give Brunna the readings and stay to help her find places for the families.`
  }
};
