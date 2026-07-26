/**
 * Editorial notes, kept apart from the spec data.
 *
 * Two reasons for the separation. First, the thin-content guard requires 250
 * words of genuinely non-templated prose on every generated page, and prose is
 * a different kind of work from measurement — mixing them makes both harder to
 * maintain. Second, this file is what a translator touches; the country files
 * are what a miller's data sheet touches. They should not be the same file.
 *
 * Every note has to say something *true and specific* about how this flour
 * behaves in a dough. "A good all-round flour" is not a note.
 */

type Prose = { nl: string; en: string };

export const FLOUR_NOTES: Record<string, Prose> = {
  /* ---- France ---------------------------------------------------- */
  'fr-t110': {
    nl: 'Halverwege tussen T80 en volkoren, en daarmee het punt waarop de zemelen het gedrag gaan bepalen in plaats van alleen de smaak. Reken op vier tot vijf punten meer water dan T65 en een merkbaar snellere fermentatie: de enzymen zitten in de buitenlaag en die is hier grotendeels aanwezig. Boven de veertig procent in een mix heb je een sterke witte bloem nodig om het te dragen.',
    en: 'Halfway between T80 and wholemeal, and therefore the point where the bran starts governing behaviour rather than only flavour. Expect four to five points more water than T65 and a noticeably faster ferment: the enzymes live in the outer layer, and most of it is present here. Above forty per cent of a blend you need a strong white flour to carry it.',
  },
  'fr-t150': {
    nl: 'Volledig uitgemalen Franse tarwe. De zemelen nemen traag water op, dus de hydratatie die je na tien minuten meet is niet de hydratatie die je na een uur hebt — dit is het meel waarbij een lange autolyse het meeste oplevert. De scherpe zemeldeeltjes snijden bovendien door glutenstrengen heen, wat de sterkte drukt ondanks een eiwitgehalte dat op papier hoog lijkt.',
    en: 'Fully extracted French wheat. The bran takes water up slowly, so the hydration you measure after ten minutes is not the hydration you have after an hour — this is the flour a long autolyse pays off on most. The sharp bran particles also cut through gluten strands, which suppresses strength despite a protein figure that looks high on paper.',
  },
  'fr-seigle-t85': {
    nl: 'De lichtste Franse rogge: genoeg om smaak en verzuring te geven, te weinig om de techniek om te gooien. Tot vijftien procent in een tarwedeeg merk je vooral de smaak en de iets snellere bulk. Daarboven wordt het deeg plakkerig op een manier die niet met meer kneden op te lossen is, omdat rogge geen glutennetwerk vormt om te kneden.',
    en: 'The lightest French rye: enough to give flavour and acidity, too little to change the technique. Up to fifteen per cent in a wheat dough you mostly notice the taste and a slightly faster bulk. Above that the dough turns sticky in a way no amount of kneading fixes, because rye forms no gluten network to knead.',
  },
  'fr-seigle-t170': {
    nl: 'Volkoren rogge met een laag valgetal, wat betekent dat het amylase al actief is voordat je begint. Verzuring is hier geen smaakkeuze maar techniek: zuur remt dat enzym, en zonder die rem breekt het zetmeel af voordat het brood in de oven zet — dat is precies waar een gommige roggekruim vandaan komt.',
    en: 'Whole rye with a low falling number, which means the amylase is already active before you begin. Acidification here is not a flavour choice but a technique: acid restrains that enzyme, and without the brake the starch breaks down before the loaf sets in the oven — which is exactly where a gummy rye crumb comes from.',
  },
  'fr-sarrasin': {
    nl: 'Boekweit is geen graan maar een zaadvrucht, en het vormt geen gluten. In een desembrood is het puur smaak en kleur: aards, licht bitter, en zeer aanwezig. Meer dan vijftien procent en het brood houdt geen vorm meer, hoe sterk de rest van je mix ook is. Voor galettes is het het hele verhaal; voor brood is het een accent.',
    en: 'Buckwheat is not a grain but a seed fruit, and it forms no gluten. In a sourdough loaf it is purely flavour and colour: earthy, faintly bitter, and very present. More than fifteen per cent and the loaf holds no shape, however strong the rest of your blend. For galettes it is the whole story; in bread it is an accent.',
  },
  'fr-t55-bio-moulin': {
    nl: 'Biologische T55 van een ambachtelijke molen. Onder de EU-bioregels zijn ascorbinezuur en toegevoegde enzymen niet toegestaan, dus dit meel gedraagt zich trager en eerlijker dan de industriële variant met hetzelfde T-getal. Verwacht minder oven spring en meer smaak, en reken op een langere bulk dan het recept zegt.',
    en: 'Organic T55 from an artisan mill. EU organic rules forbid ascorbic acid and added enzymes, so this flour behaves more slowly and more honestly than the industrial version wearing the same T number. Expect less oven spring and more flavour, and allow a longer bulk than the recipe states.',
  },
  'fr-t65-bio-meule': {
    nl: 'Dezelfde uitmaling als gewone T65, maar op steen gemalen en biologisch. Steenmaling verplettert het graan in plaats van het te scheren, waardoor er minder zetmeel beschadigt — en beschadigd zetmeel is precies wat water bindt. Dat scheelt hier twee tot drie punten wateropname ten opzichte van de industriële T65.',
    en: 'The same extraction as ordinary T65, but stone-milled and organic. Stone milling crushes the grain rather than shearing it, so less starch is damaged — and damaged starch is precisely what binds water. That is worth two to three points of absorption against the industrial T65.',
  },
  'fr-ble-dur-semoule': {
    nl: 'Durumgriesmeel, fijn gemalen. Durum is het hardste graan dat gewoon te koop is, dus de maling beschadigt veel zetmeel en het neemt bovengemiddeld water op. Tegelijk is het gluten kort en taai in plaats van rekbaar: goed voor een dichte, elastische kruim die dagen goed blijft, slecht voor een luchtig open brood.',
    en: 'Durum semolina, finely milled. Durum is the hardest grain in ordinary trade, so milling damages a lot of starch and it takes up above-average water. At the same time its gluten is short and tenacious rather than extensible: good for a dense, elastic crumb that keeps for days, poor for an airy open loaf.',
  },

  /* ---- Germany --------------------------------------------------- */
  'de-812': {
    nl: 'De vergeten tussenmaat van het Duitse systeem, en een van de nuttigste. Genoeg zemelen voor echte smaak en kleur, weinig genoeg om nog een strak gevormd brood te dragen. Wie zonder nadenken van 550 naar 1050 springt, slaat precies de trede over die de meeste broden beter zou maken.',
    en: 'The forgotten middle grade of the German system, and one of the most useful. Enough bran for real flavour and colour, few enough to still carry a tightly shaped loaf. Anyone who jumps from 550 to 1050 without thinking has skipped exactly the step that would improve most of their bread.',
  },
  'de-1600': {
    nl: 'Bijna volkoren, maar de grofste zemeldelen zijn eruit gezeefd. Dat is precies waar dit meel zijn waarde heeft: je houdt de smaak en het grootste deel van de mineralen, maar verliest de scherpste deeltjes die anders je glutennetwerk aan flarden snijden. Merkbaar meer draagvermogen dan echte Vollkorn bij vrijwel dezelfde smaak.',
    en: 'Nearly wholemeal, but the coarsest bran has been sifted out. That is exactly where this flour earns its place: you keep the flavour and most of the mineral, but lose the sharpest particles that otherwise shred your gluten network. Noticeably more carrying capacity than true Vollkorn at almost the same flavour.',
  },
  'de-weizenvollkorn': {
    nl: 'Volledig uitgemalen Duitse tarwe. Het eiwitgehalte ligt hoger dan bij witte bloem, maar de sterkte niet: zemeldeeltjes werken als kleine messen door het glutennetwerk. Dat is de reden dat een volkorenbrood zwaarder uitvalt dan het eiwitgehalte belooft, en waarom vijftig procent volkoren zonder sterke witte bloem ernaast zelden een open kruim geeft.',
    en: 'Fully extracted German wheat. The protein content is higher than white flour but the strength is not: bran particles act as small knives through the gluten network. That is why a wholemeal loaf comes out heavier than its protein promises, and why fifty per cent wholemeal without a strong white alongside rarely gives an open crumb.',
  },
  'de-dinkel-812': {
    nl: 'Halfvolkoren spelt, en daarmee twee problemen tegelijk: het oplosbare speltgluten én de snijdende werking van zemelen. Vouw minder dan je gewend bent, stop de bulk bij zestig tot zeventig procent volumetoename in plaats van bij verdubbeling, en verwacht dat het deeg eerder scheurt dan rekt.',
    en: 'Half-wholemeal spelt, and therefore two problems at once: spelt\'s soluble gluten and the cutting action of bran. Fold less than you are used to, end the bulk at sixty to seventy per cent volume increase rather than at doubling, and expect the dough to tear before it stretches.',
  },
  'de-dinkel-1050': {
    nl: 'Donkere spelt, op steen gemalen. Dit is het punt waarop spelt zonder ondersteuning geen vrijstaand brood meer draagt: het eiwit is hoog, maar het netwerk dat het vormt houdt de vorm niet vast tijdens de laatste rijs. Een busvorm is hier geen compromis maar het juiste gereedschap.',
    en: 'Dark spelt, stone-milled. This is the point where spelt no longer carries a free-standing loaf without support: the protein is high, but the network it forms will not hold shape through the final proof. A tin here is not a compromise but the right tool.',
  },
  'de-roggen-815': {
    nl: 'De lichtste Duitse rogge, grotendeels ontdaan van zemelen. Dit is de rogge die je gebruikt als je roggesmaak wilt zonder roggetechniek: tot vijftien procent in een tarwedeeg verandert er niets aan je werkwijze, alleen aan de smaak en de houdbaarheid.',
    en: 'The lightest German rye, mostly stripped of bran. This is the rye you use when you want rye flavour without rye technique: up to fifteen per cent in a wheat dough nothing about your method changes, only the flavour and the keeping.',
  },
  'de-roggen-997': {
    nl: 'De middenmaat tussen 815 en 1150, en in Duitsland de gebruikelijke keuze voor een Mischbrot dat nog steeds als tarwebrood aanvoelt. Rond de twintig procent in de mix begint het gedrag te kantelen: het deeg wordt plakkeriger en de bulk korter, en beide zijn met techniek niet meer terug te draaien.',
    en: 'The middle grade between 815 and 1150, and in Germany the usual choice for a Mischbrot that still handles like wheat bread. Around twenty per cent of the blend the behaviour starts to tip: the dough turns stickier and the bulk shorter, and neither is reversible with technique.',
  },
  'de-roggen-1370': {
    nl: 'Donkere rogge, dicht tegen volkoren aan. Vanaf hier heeft het deeg geen glutennetwerk meer om op te bouwen en komt de structuur uit de zetmeelgel en de pentosanen. Dat betekent: niet kneden, niet vouwen, wel goed verzuren, en in een vorm bakken.',
    en: 'Dark rye, close to wholemeal. From here the dough has no gluten network to build and the structure comes from the starch gel and the pentosans. Which means: no kneading, no folding, thorough acidification, and a tin.',
  },
  'de-roggen-1740': {
    nl: 'Vrijwel volkoren rogge, op steen gemalen. Het valgetal ligt laag genoeg dat het amylase je grootste zorg is en niet je gist. Bak dit brood langer en donkerder dan je durft, en snijd het pas de volgende dag aan — een roggekruim die op de dag zelf plakt is bijna nooit ondergaar maar bijna altijd te vroeg aangesneden.',
    en: 'Near-wholemeal rye, stone-milled. The falling number is low enough that amylase, not yeast, is your main concern. Bake this longer and darker than you dare, and cut it the next day — a rye crumb that sticks on the day is almost never underbaked and almost always cut too early.',
  },
  'de-emmer-vollkorn': {
    nl: 'Emmer heeft het hoogste eiwitgehalte van vrijwel alle graansoorten en bijna het laagste draagvermogen. Die combinatie verwart mensen die op het etiket afgaan. Behandel het als smaakmaker: tot dertig procent in een mix met sterke tarwe geeft het een nootachtige, bijna zoete diepte zonder het brood plat te slaan.',
    en: 'Emmer has among the highest protein of any grain and among the lowest carrying capacity. That combination confuses anyone reading the label. Treat it as a flavouring: up to thirty per cent in a blend with strong wheat gives a nutty, almost sweet depth without flattening the loaf.',
  },

  /* ---- Italy ------------------------------------------------------ */
  'it-0': {
    nl: 'Tipo 0 zit één stap grover dan 00 en bevat iets meer van de buitenkant van de korrel. In de praktijk is dat het verschil tussen een pizzabodem die naar bloem smaakt en een die naar graan smaakt. Voor desem is het bijna altijd de betere keuze van de twee, ook al staat 00 vaker in recepten.',
    en: 'Tipo 0 sits one step coarser than 00 and carries slightly more of the outside of the kernel. In practice that is the difference between a pizza base that tastes of flour and one that tastes of grain. For sourdough it is almost always the better of the two, even though 00 appears in recipes more often.',
  },
  'it-2': {
    nl: 'De grofste Italiaanse maat vóór integrale, en in Italië de klassieke keuze voor rustiek desembrood. Meer dan de helft van de zemelen is aanwezig, dus reken op merkbaar meer water en een kortere bulk dan bij tipo 1. Het is ook de maat waar de smaakwinst het steilst is.',
    en: 'The coarsest Italian grade before integrale, and in Italy the classic choice for rustic sourdough. More than half the bran is present, so expect noticeably more water and a shorter bulk than tipo 1. It is also the grade where the flavour gain is steepest.',
  },
  'it-integrale': {
    nl: 'Volkoren Italiaanse tarwe, doorgaans op steen gemalen en uit zachter graan dan Noord-Europees volkoren. Dat betekent minder beschadigd zetmeel en dus enkele punten minder wateropname dan je van volkoren verwacht — een van de weinige gevallen waarin volkoren juist minder drinkt dan de buurman.',
    en: 'Wholemeal Italian wheat, usually stone-milled and from softer grain than northern European wholemeal. That means less damaged starch and therefore a few points less absorption than you would expect from a wholemeal — one of the few cases where the wholemeal drinks less than its neighbour.',
  },
  'it-semola-integrale': {
    nl: 'Volkoren durum: zeer hard graan, volledig uitgemalen. De combinatie van hardheid en zemelen geeft de hoogste wateropname van alle tarwesoorten in deze database. Het gluten is kort en taai, dus reken op een deeg dat zich stug laat vormen en een kruim die dagenlang zacht blijft.',
    en: 'Wholemeal durum: very hard grain, fully extracted. The combination of hardness and bran gives the highest absorption of any wheat in this database. The gluten is short and tenacious, so expect a dough that shapes stiffly and a crumb that stays soft for days.',
  },
  'it-farro-dicocco': {
    nl: 'In Italië heet zowel emmer als spelt "farro", wat tot eindeloze verwarring leidt. Dit is dicocco, de emmer. Zeer hoog eiwit, zeer laag draagvermogen, en een uitgesproken smaak die tussen noten en hooi in zit. Boven dertig procent heb je een busvorm nodig.',
    en: 'In Italy both emmer and spelt are called "farro", which causes endless confusion. This is dicocco, the emmer. Very high protein, very low carrying capacity, and a pronounced flavour somewhere between nuts and hay. Above thirty per cent you need a tin.',
  },
  'it-farro-spelta': {
    nl: 'De Italiaanse spelt, half uitgemalen en op steen gemalen. Speltgluten is oplosbaarder dan tarwegluten: het rekt makkelijk en veert nauwelijks terug, wat vormen prettig maakt en overkneden gevaarlijk. Stop eerder dan je gewend bent, bij elke stap.',
    en: 'The Italian spelt, half-extracted and stone-milled. Spelt gluten is more soluble than wheat gluten: it stretches easily and barely springs back, which makes shaping pleasant and over-mixing dangerous. Stop earlier than you are used to, at every step.',
  },
  'it-tipo-1-w300': {
    nl: 'Een sterke tipo 1: ongebruikelijk, want half uitgemalen meel is normaal gesproken juist zwakker. De W van 300 komt uit harder graan en maakt dit een van de weinige melen die tegelijk veel smaak en veel draagvermogen levert. Precies wat je wilt voor een volkorenrijk brood met een open kruim.',
    en: 'A strong tipo 1: unusual, because half-extracted flour is normally weaker. The W of 300 comes from harder grain and makes this one of the few flours that delivers both a lot of flavour and a lot of carrying capacity. Exactly what you want for a wholegrain-heavy loaf with an open crumb.',
  },
  'it-segale-integrale': {
    nl: 'Volkoren rogge, in Italië een nichegraan en daardoor vaak versgemalen te koop. Versheid is hier geen pluspunt: vers gemalen rogge heeft het hoogste enzymgehalte en het kortste tijdvenster. Verzuur goed en houd de bulk kort.',
    en: 'Whole rye, a niche grain in Italy and therefore often sold freshly milled. Freshness is not a virtue here: freshly milled rye carries the highest enzyme load and the shortest window. Acidify thoroughly and keep the bulk short.',
  },

  /* ---- United States and Canada ----------------------------------- */
  'us-high-gluten': {
    nl: 'Het sterkste dat Amerikaanse molens standaard leveren, bedoeld voor bagels en pizza. Voor gewoon desembrood is het meestal te veel: een deeg dat je niet kapot krijgt is ook een deeg dat niet meegeeft, en de kruim wordt taai in plaats van luchtig. Nuttig als kwart van een mix om een zwak volkoren te dragen.',
    en: 'The strongest thing American mills stock as standard, built for bagels and pizza. For ordinary sourdough it is usually too much: a dough you cannot break is also a dough that will not yield, and the crumb turns chewy rather than airy. Useful as a quarter of a blend to carry a weak wholemeal.',
  },
  'us-whole-wheat': {
    nl: 'Amerikaans volkoren komt uit harde rode tarwe en wordt met walsen gemalen, en die combinatie geeft de hoogste wateropname van alle volkorenmelen in deze database. Een Europees volkorenrecept hierop draaien vraagt om fors meer water — het omgekeerde van wat de meeste mensen verwachten.',
    en: 'American wholemeal comes from hard red wheat and is roller-milled, and that combination gives the highest absorption of any wholemeal in this database. Running a European wholemeal recipe on it calls for considerably more water — the opposite of what most people expect.',
  },
  'us-pastry-flour': {
    nl: 'Zachte wintertarwe met een laag eiwitgehalte. Voor desembrood op zichzelf onbruikbaar: het deeg houdt geen vorm en de kruim wordt kruimelig. Als tien tot vijftien procent van een mix maakt het de kruim juist zachter en malser, en dat is precies waar het wél voor deugt.',
    en: 'Soft winter wheat with low protein. Unusable for sourdough on its own: the dough holds no shape and the crumb turns crumbly. As ten to fifteen per cent of a blend it softens and tenderises the crumb, which is exactly what it is good for.',
  },
  'us-artisan-bakers-craft': {
    nl: 'Bewust lager in eiwit dan standaard bread flour: ambachtelijke Amerikaanse molens die de Europese gedachte overnemen dat smaak boven kracht gaat. Het gedraagt zich dichter bij een Duitse 550 dan bij Amerikaanse bread flour, en dat maakt het een van de weinige Amerikaanse melen waarop Europese recepten meteen kloppen.',
    en: 'Deliberately lower in protein than standard bread flour: American artisan mills adopting the European idea that flavour beats strength. It behaves closer to a German 550 than to American bread flour, which makes it one of the few American flours on which European recipes work straight off.',
  },
  'us-sonora': {
    nl: 'Een van de oudste tarwerassen in Noord-Amerika, zacht en eiwitarm. De smaak is uitgesproken zoet en de kleur romig, maar het draagvermogen is laag genoeg dat het onder dertig procent van een mix moet blijven als je een vrijstaand brood wilt. Steengemalen, dus opvallend weinig beschadigd zetmeel.',
    en: 'One of the oldest wheat varieties in North America, soft and low in protein. The flavour is markedly sweet and the colour creamy, but the carrying capacity is low enough that it should stay under thirty per cent of a blend for a free-standing loaf. Stone-milled, so strikingly little damaged starch.',
  },
  'us-durum-semolina': {
    nl: 'Fijn gemalen durum. Tien tot twintig procent in een tarwedeeg geeft de gele kleur, een zoetere smaak en een kruim die merkbaar langer zacht blijft — durum bindt water steviger dan zachte tarwe en geeft het langzamer af.',
    en: 'Finely milled durum. Ten to twenty per cent in a wheat dough gives the yellow colour, a sweeter flavour and a crumb that stays soft noticeably longer — durum binds water more firmly than soft wheat and releases it more slowly.',
  },
  'us-dark-rye': {
    nl: 'De donkerste rogge die Amerikaanse molens standaard leveren, in de praktijk bijna volkoren. Het lage valgetal betekent veel amylase, dus verzuur goed en houd het aandeel onder de dertig procent tenzij je bewust roggebrood maakt met roggetechniek.',
    en: 'The darkest rye American mills stock as standard, in practice close to wholemeal. The low falling number means plenty of amylase, so acidify well and keep the share under thirty per cent unless you are deliberately making rye bread with rye technique.',
  },
  'us-medium-rye': {
    nl: 'De rogge die in de meeste Amerikaanse recepten bedoeld wordt als er alleen "rye flour" staat. Ongeveer half uitgemalen, dus mild genoeg om tot twintig procent in een tarwedeeg te gebruiken zonder je werkwijze aan te passen.',
    en: 'The rye most American recipes mean when they say only "rye flour". About half-extracted, so mild enough to use up to twenty per cent in a wheat dough without adjusting your method.',
  },
  'us-spelt': {
    nl: 'Volkoren spelt: veertien procent eiwit en toch een van de zwakste melen in deze database. Dat is niet tegenstrijdig maar leerzaam — eiwitgehalte meet hoeveel er is, niet wat het doet. Spelt vormt een netwerk dat rekt en niet terugveert, dus het scheurt eerder dan tarwe en het rijst korter.',
    en: 'Whole spelt: fourteen per cent protein and still one of the weakest flours in this database. That is not contradictory but instructive — protein content measures how much is there, not what it does. Spelt forms a network that stretches and does not spring back, so it tears sooner than wheat and proofs shorter.',
  },
  'us-khorasan': {
    nl: 'Khorasan, in de handel meestal onder een merknaam. Grotere korrel dan tarwe, uitgesproken botersmaak en een diep gele kleur. Het gluten is sterker dan dat van eenkoorn maar zwakker dan tarwe: tot veertig procent in een mix werkt, daarboven wordt de vorm een probleem.',
    en: 'Khorasan, usually sold under a brand name. A larger kernel than wheat, a pronounced buttery flavour and a deep yellow colour. The gluten is stronger than einkorn but weaker than wheat: up to forty per cent of a blend works, above that shape becomes a problem.',
  },
  'ca-whole-wheat': {
    nl: 'Canadees volkoren uit harde voorjaarstarwe: het hoogste eiwitgehalte en de hoogste wateropname van alle volkorenmelen hier. Recepten die voor Europees volkoren zijn geschreven vallen hierop droog uit, soms wel acht punten. Dit is precies het geval waarvoor deze site bestaat.',
    en: 'Canadian wholemeal from hard spring wheat: the highest protein and the highest absorption of any wholemeal here. Recipes written for European wholemeal come out dry on it, sometimes by as much as eight points. This is precisely the case this site exists for.',
  },
  'ca-red-fife': {
    nl: 'Het historische Canadese ras waaruit de moderne voorjaarstarwe is voortgekomen. Het eiwitgehalte doet aan moderne tarwe denken, maar de glutenkwaliteit is zwakker en de oven spring bescheidener. De smaak is de reden dat mensen het kopen, en die is het waard.',
    en: 'The heritage Canadian variety that modern spring wheat descends from. The protein reads like modern wheat, but the gluten quality is weaker and the oven spring more modest. Flavour is why people buy it, and the flavour is worth it.',
  },

  /* ---- Netherlands and Belgium ------------------------------------ */
  'nl-tarwebloem': {
    nl: 'De stap tussen patentbloem en bakkersbloem, en voor de meeste thuisbakkers de zinnigste standaardkeuze. Sterk genoeg voor een landbrood van rond de 72 procent, zacht genoeg om vergevingsgezind te blijven. Wie van een Amerikaans recept komt, moet hier drie tot vijf punten water afhalen.',
    en: 'The step between patentbloem and baker\'s flour, and for most home bakers the sensible default. Strong enough for a country loaf around 72 per cent, soft enough to stay forgiving. Anyone coming from an American recipe should take three to five points of water off here.',
  },
  'nl-tarwemeel': {
    nl: 'Halfvolkoren Nederlandse tarwe. Het Nederlandse onderscheid tussen bloem en meel is precies dit: meel bevat de zemelen. Reken op ongeveer drie punten meer water dan tarwebloem en een kortere bulk, want de enzymen zitten in de buitenlaag die hier deels aanwezig is.',
    en: 'Half-wholemeal Dutch wheat. The Dutch distinction between bloem and meel is exactly this: meel contains the bran. Expect about three points more water than tarwebloem and a shorter bulk, because the enzymes live in the outer layer that is partly present here.',
  },
  'nl-volkorenmeel': {
    nl: 'Nederlands volkoren uit doorgaans zachtere tarwe dan het Amerikaanse of Canadese equivalent. Het gevolg: minder eiwit, minder draagvermogen en enkele punten minder wateropname. Een Amerikaans volkorenrecept letterlijk volgen levert hier een deeg op dat uitvloeit.',
    en: 'Dutch wholemeal from generally softer wheat than the American or Canadian equivalent. The consequence: less protein, less carrying capacity and a few points less absorption. Following an American wholemeal recipe literally gives a dough that flows here.',
  },
  'nl-roggebloem': {
    nl: 'Lichte rogge, grotendeels ontdaan van zemelen. Bruikbaar tot vijftien procent in een tarwedeeg zonder dat je iets aan je werkwijze verandert; boven de twintig procent begint het deeg plakkerig te worden op een manier die met techniek niet meer op te lossen is.',
    en: 'Light rye, mostly stripped of bran. Usable up to fifteen per cent in a wheat dough without changing anything about your method; above twenty per cent the dough starts turning sticky in a way technique cannot fix.',
  },
  'nl-roggemeel': {
    nl: 'Volkoren rogge, steengemalen. Voor Nederlands roggebrood in een gesloten vorm, en dan zonder kneden of vouwen: rogge vormt geen gluten, dus je bouwt niets op door eraan te werken. De structuur komt uit de zetmeelgel, en die heeft warmte en tijd nodig, geen handen.',
    en: 'Whole rye, stone-milled. For Dutch rye bread in a closed tin, and then without kneading or folding: rye forms no gluten, so working it builds nothing. The structure comes from the starch gel, and that needs heat and time, not hands.',
  },
  'nl-speltbloem': {
    nl: 'Witte spelt: de speltvorm die het dichtst bij gewone bloem komt en de enige waarmee een vrijstaand brood realistisch is. Toch geldt ook hier: minder water dan tarwe, minder vouwen, kortere bulk. Speltgluten lost sneller op dan het zich opbouwt zodra je te ver gaat.',
    en: 'White spelt: the form of spelt closest to ordinary flour and the only one where a free-standing loaf is realistic. Even so: less water than wheat, fewer folds, shorter bulk. Spelt gluten dissolves faster than it builds the moment you go too far.',
  },
  'nl-speltmeel': {
    nl: 'Volkoren spelt. De combinatie van oplosbaar gluten en snijdende zemelen maakt dit een van de moeilijkste melen om een vrijstaand brood mee te bakken. In een busvorm is het uitstekend, en dat is geen troostprijs — het is waar dit meel voor gemaakt is.',
    en: 'Whole spelt. The combination of soluble gluten and cutting bran makes this one of the hardest flours to bake a free-standing loaf with. In a tin it is excellent, and that is not a consolation prize — it is what this flour is for.',
  },
  'nl-boekweitmeel': {
    nl: 'Boekweit vormt geen gluten en is botanisch geen graan. In desembrood is het een smaakaccent: aards en licht bitter, en het kleurt de kruim grijs-paars. Meer dan tien tot vijftien procent en het brood zakt in, ongeacht hoe sterk de rest is.',
    en: 'Buckwheat forms no gluten and is botanically not a grain. In sourdough it is a flavour accent: earthy and faintly bitter, and it turns the crumb a grey-violet. More than ten to fifteen per cent and the loaf collapses, however strong the rest.',
  },
  'be-bloem-t55': {
    nl: 'België gebruikt in de praktijk zowel de Nederlandse als de Franse indeling, vaak op hetzelfde schap. Deze witte bloem komt qua gedrag het dichtst bij een Franse T55: milder en zwakker dan Nederlandse bakkersbloem, en geschikt voor alles waar rekbaarheid boven kracht gaat.',
    en: 'Belgium uses both the Dutch and the French system in practice, often on the same shelf. This white flour behaves closest to a French T55: milder and weaker than Dutch baker\'s flour, and suited to anything where extensibility beats strength.',
  },
  'be-bruine-bloem': {
    nl: 'De Belgische halfvolkoren, ongeveer gelijk aan Nederlands tarwemeel en Frans T80. Een goede enkele keuze als je maar één zak wilt kopen: genoeg zemelen voor smaak, genoeg endosperm voor structuur.',
    en: 'The Belgian half-wholemeal, roughly equal to Dutch tarwemeel and French T80. A good single choice if you only want to buy one bag: enough bran for flavour, enough endosperm for structure.',
  },
  'be-volkoren': {
    nl: 'Belgisch volkoren, walsgemalen uit doorgaans zachte West-Europese tarwe. Vergelijkbaar met Nederlands volkoren en merkbaar zwakker dan Amerikaans of Canadees volkoren — reken op minder water en een dichtere kruim dan Engelstalige recepten beloven.',
    en: 'Belgian wholemeal, roller-milled from generally soft western European wheat. Comparable to Dutch wholemeal and noticeably weaker than American or Canadian — expect less water and a tighter crumb than English-language recipes promise.',
  },
  'be-spelt-volkoren': {
    nl: 'Volkoren spelt van Belgische molens, doorgaans op steen gemalen. Steenmaling scheelt hier een paar punten wateropname ten opzichte van industrieel gemalen spelt, wat het net iets makkelijker maakt om mee te werken.',
    en: 'Whole spelt from Belgian mills, usually stone-milled. Stone milling is worth a couple of points of absorption against industrially milled spelt, which makes it a little easier to work with.',
  },
  'be-rogge-volkoren': {
    nl: 'Belgische volkoren rogge. Zoals bij alle volkoren rogge geldt: de bulk is korter dan je denkt, de kruim heeft een etmaal nodig om te zetten, en verzuring is techniek en geen smaakkeuze.',
    en: 'Belgian whole rye. As with all whole rye: the bulk is shorter than you think, the crumb needs a full day to set, and acidification is a technique rather than a flavour choice.',
  },

  /* ---- United Kingdom --------------------------------------------- */
  'uk-very-strong-canadian': {
    nl: 'Geïmporteerde Canadese harde voorjaarstarwe, in Britse verpakking. Dit is het sterkste dat een gewone supermarkt verkoopt en het draagt makkelijk acht punten meer water dan Franse T65. Voor een open kruim uitstekend; voor een stokbrood veel te veel.',
    en: 'Imported Canadian hard spring wheat in British packaging. This is the strongest thing an ordinary supermarket sells and it comfortably carries eight points more water than French T65. Excellent for an open crumb; far too much for a baguette.',
  },
  'uk-wholemeal-strong': {
    nl: 'Britse volkoren uit hardere tarwe dan de meeste Europese volkorenmelen, want het Britse systeem selecteert juist op kracht. Het gevolg is een volkoren dat wél een vrijstaand brood draagt — ongebruikelijk genoeg om het te vermelden.',
    en: 'British wholemeal from harder wheat than most European wholemeals, because the British system selects for strength. The result is a wholemeal that will carry a free-standing loaf — unusual enough to be worth saying.',
  },
  'uk-stoneground-wholemeal': {
    nl: 'Steengemalen Brits volkoren. Ten opzichte van de walsgemalen variant met hetzelfde etiket: minder beschadigd zetmeel, dus enkele punten minder wateropname, en een grovere zemelstructuur die het glutennetwerk harder aanpakt. Meer smaak, minder volume.',
    en: 'Stone-ground British wholemeal. Against the roller-milled version with the same label: less damaged starch, so a few points less absorption, and a coarser bran that treats the gluten network more harshly. More flavour, less volume.',
  },
  'uk-white-type-85': {
    nl: 'Britse molens die de continentale uitmalingsgedachte overnemen. Qua gedrag het dichtst bij een Franse T80: half uitgemalen, veel smaak, en nog genoeg draagvermogen voor een strak gevormd brood. Als je één zak wilt die alles redelijk kan, is dit hem.',
    en: 'British mills adopting the continental extraction idea. Behaves closest to a French T80: half-extracted, plenty of flavour, and still enough carrying capacity for a tightly shaped loaf. If you want one bag that does everything reasonably, this is it.',
  },
  'uk-dark-rye': {
    nl: 'Britse donkere rogge, in de praktijk bijna volkoren. Britse recepten gebruiken rogge veel spaarzamer dan Duitse of Scandinavische, dus tien procent is hier al een uitgesproken keuze en niet een basislijn.',
    en: 'British dark rye, in practice close to wholemeal. British recipes use rye far more sparingly than German or Scandinavian ones, so ten per cent here is already a pronounced choice rather than a baseline.',
  },
  'uk-light-rye': {
    nl: 'Lichte rogge zonder de meeste zemelen. Mild genoeg om als smaakaccent te gebruiken zonder dat je iets aan je werkwijze verandert, en de veiligste manier om te ontdekken of je roggesmaak in je brood wilt.',
    en: 'Light rye with most of the bran removed. Mild enough to use as a flavour accent without changing anything in your method, and the safest way to find out whether you want rye in your bread at all.',
  },
  'uk-spelt-white': {
    nl: 'Witte Britse spelt: de vorm van spelt die zich het meest als gewone bloem gedraagt. Ook hier geldt de speltregel — minder water, minder vouwen, korter bulken — maar met witte spelt is een vrijstaand brood realistisch, wat bij volkoren spelt niet zo is.',
    en: 'White British spelt: the form of spelt that behaves most like ordinary flour. The spelt rule still applies — less water, fewer folds, shorter bulk — but with white spelt a free-standing loaf is realistic, which it is not with the wholemeal.',
  },
  'uk-spelt-wholemeal': {
    nl: 'Volkoren spelt met een van de hoogste eiwitgehaltes in deze database en een van de laagste sterktes. Wie op eiwit selecteert koopt dit en is teleurgesteld; wie op smaak selecteert koopt dit en gebruikt een busvorm.',
    en: 'Whole spelt with among the highest protein in this database and among the lowest strength. Anyone selecting on protein buys this and is disappointed; anyone selecting on flavour buys this and uses a tin.',
  },

  /* ---- Nordics ---------------------------------------------------- */
  'dk-hvedemel': {
    nl: 'Deense standaardtarwebloem uit zacht, relatief eiwitarm graan. Deense recepten zijn hierop geschreven en werken dus zoals bedoeld; Amerikaanse recepten vragen op dit meel om drie tot zes punten minder water dan er staat.',
    en: 'Danish standard wheat flour from soft, relatively low-protein grain. Danish recipes are written for it and work as intended; American recipes on this flour want three to six points less water than they state.',
  },
  'dk-manitoba': {
    nl: 'Geïmporteerde Noord-Amerikaanse harde tarwe, in Scandinavië verkocht onder de naam Manitoba. Dit is het meel dat Deense bakkers gebruiken als het Deense meel te zwak is — mengen in plaats van vervangen geeft doorgaans het beste resultaat.',
    en: 'Imported North American hard wheat, sold across Scandinavia as Manitoba. This is what Danish bakers reach for when the Danish flour is too weak — blending rather than replacing usually gives the best result.',
  },
  'dk-sigtemel': {
    nl: 'Gezeefd roggemeel: het Deense equivalent van de Duitse Type 1150. De grofste zemelen zijn eruit, waardoor het deeg hanteerbaar blijft terwijl je het grootste deel van de roggesmaak houdt. De gebruikelijke basis voor een licht Deens roggebrood.',
    en: 'Bolted rye meal: the Danish equivalent of German Type 1150. The coarsest bran is out, which keeps the dough workable while retaining most of the rye flavour. The usual base for a lighter Danish rye.',
  },
  'dk-knaekket-rug': {
    nl: 'Gebroken roggekorrels, geen meel. Deze horen in een weekmassa en niet rechtstreeks in het deeg: droog toegevoegd trekken ze hun water later alsnog uit je kruim, en dan bak je effectief tien punten droger dan het recept zegt.',
    en: 'Cracked rye kernels, not flour. These belong in a soaker rather than straight into the dough: added dry they take their water out of your crumb later, and then you are effectively baking ten points drier than the recipe says.',
  },
  'se-vetemjol-special': {
    nl: 'De Zweedse broodbloem; "special" duidt op een hoger eiwitgehalte dan het gewone vetemjöl. Vergelijkbaar met een Duitse 550 en daarmee de zinnigste standaardkeuze voor desem in Zweden.',
    en: 'Sweden\'s bread flour; "special" indicates higher protein than ordinary vetemjöl. Comparable to a German 550, and therefore the sensible default for sourdough in Sweden.',
  },
  'se-vetemjol': {
    nl: 'Zweedse standaardbloem uit zacht graan, bedoeld voor gebak en dagelijkse baksels. Voor desembrood op zichzelf te zwak: meng met vetemjöl special of Manitoba als je een open kruim wilt.',
    en: 'Swedish standard flour from soft grain, meant for cakes and everyday baking. Too weak for sourdough on its own: blend with vetemjöl special or Manitoba if you want an open crumb.',
  },
  'se-grahamsmjol': {
    nl: 'Zweeds volkoren, grover gemalen dan de meeste Europese volkorenmelen. Die grove zemeldeeltjes nemen trager water op én snijden harder door het gluten: geef dit meel een lange autolyse en verwacht een steviger, dichter brood.',
    en: 'Swedish wholemeal, coarser than most European wholemeals. Those coarse bran particles take water up more slowly and cut through the gluten harder: give this flour a long autolyse and expect a firmer, denser loaf.',
  },
  'se-ragsikt': {
    nl: 'Een kant-en-klaar mengsel van gezeefde rogge en tarwebloem, in Zweden als één product verkocht. Handig, maar let op: je koopt hier een verhouding die iemand anders heeft gekozen, en die is niet zichtbaar op de zak.',
    en: 'A ready-made blend of bolted rye and wheat flour, sold in Sweden as a single product. Convenient, but note that you are buying a ratio someone else chose, and it is not visible on the bag.',
  },
  'se-ragmjol-grovt': {
    nl: 'Grove Zweedse volkoren rogge. Zweedse roggebroden gebruiken hogere roggepercentages dan waar dan ook buiten Denemarken en Duitsland, en de bijbehorende techniek — nat mengen, in de vorm, lang bakken — hoort daarbij.',
    en: 'Coarse Swedish whole rye. Swedish rye breads use higher rye percentages than anywhere outside Denmark and Germany, and the matching technique — mix wet, into the tin, bake long — goes with it.',
  },
  'se-dinkelmjol': {
    nl: 'Volkoren spelt uit Zweedse molens. In Scandinavië populair als "gezonder" alternatief voor tarwe, wat de teleurstelling verklaart bij wie er zonder aanpassing een tarwerecept op draait: minder water, minder vouwen, korter bulken.',
    en: 'Whole spelt from Swedish mills. Popular across Scandinavia as a "healthier" alternative to wheat, which explains the disappointment when people run a wheat recipe on it unchanged: less water, fewer folds, shorter bulk.',
  },

  /* ---- Poland ------------------------------------------------------ */
  'pl-typ-450': {
    nl: 'De Poolse cakebloem, en de zwakste maat in het Poolse systeem. De Poolse typ-getallen volgen dezelfde asdefinitie als de Duitse, dus typ 450 komt overeen met Type 405 — maar het graan is doorgaans zachter.',
    en: 'The Polish cake flour, and the weakest grade in the Polish system. Polish typ numbers follow the same ash definition as the German ones, so typ 450 corresponds to Type 405 — but the grain is generally softer.',
  },
  'pl-typ-550': {
    nl: 'De Poolse standaardbloem, wettelijk gelijk aan de Duitse Type 550. In de praktijk iets zwakker, omdat Poolse tarwe zachter is dan Duitse. Voor desem bruikbaar, maar reken op minder water dan een Duits recept zegt.',
    en: 'The Polish standard flour, legally equal to German Type 550. Slightly weaker in practice, because Polish wheat is softer than German. Usable for sourdough, but expect less water than a German recipe states.',
  },
  'pl-typ-650': {
    nl: 'Poolse broodbloem, met een asgehalte tussen T55 en T65 in. Dit is de maat waarmee de meeste Poolse bakkers hun tarwebrood maken, en de zinnigste keuze als je in Polen een landbrood wilt bakken.',
    en: 'Polish bread flour, with an ash content between T55 and T65. This is the grade most Polish bakers make their wheat bread from, and the sensible choice for a country loaf in Poland.',
  },
  'pl-typ-750': {
    nl: 'De donkerste Poolse witte bloem voordat je bij razowa uitkomt. Een deel van de zemelen is aanwezig, dus reken op twee tot drie punten meer water dan typ 650 en een merkbaar snellere fermentatie.',
    en: 'The darkest Polish white flour before you reach razowa. Some of the bran is present, so expect two to three points more water than typ 650 and a noticeably faster ferment.',
  },
  'pl-typ-1850-razowa': {
    nl: 'Pools volkoren. Het hoge asgetal is geen fout: razowa is volledig uitgemalen en het Poolse systeem loopt hoger door dan het Duitse. Behandel het als elk volkoren — lange autolyse, kortere bulk, en een sterke bloem ernaast als je vorm wilt houden.',
    en: 'Polish wholemeal. The high ash number is not an error: razowa is fully extracted and the Polish system runs further up than the German one. Treat it like any wholemeal — long autolyse, shorter bulk, and a strong flour alongside if you want to hold shape.',
  },
  'pl-zytnia-720': {
    nl: 'Lichte Poolse rogge, grotendeels ontdaan van zemelen. In Polen de gebruikelijke rogge voor een mengbrood waarin tarwe nog de hoofdrol speelt. Tot twintig procent verandert er weinig aan je werkwijze.',
    en: 'Light Polish rye, mostly stripped of bran. In Poland the usual rye for a mixed loaf in which wheat still leads. Up to twenty per cent, little about your method changes.',
  },

  /* ---- Spain -------------------------------------------------------- */
  'es-harina-floja': {
    nl: 'De zwakste Spaanse maat, met een W rond de 100. Voor desembrood onbruikbaar op zichzelf, maar Spanje classificeert tenminste eerlijk: het getal op de zak meet precies de eigenschap die je nodig hebt, wat je van een asgetal niet kunt zeggen.',
    en: 'The weakest Spanish grade, with a W around 100. Unusable for sourdough on its own, but Spain at least classifies honestly: the number on the bag measures precisely the property you need, which is more than an ash number does.',
  },
  'es-harina-media-fuerza': {
    nl: 'Middelsterke Spaanse bloem met een W rond de 200. Dit is het bereik waarin de meeste desembroden thuishoren: sterk genoeg voor structuur, zwak genoeg om niet taai te worden. Voor Spaanse bakkers de standaardkeuze.',
    en: 'Mid-strength Spanish flour with a W around 200. This is the range most sourdough belongs in: strong enough for structure, weak enough not to turn chewy. The default choice for Spanish bakers.',
  },
  'es-harina-integral': {
    nl: 'Spaans volkoren, doorgaans op steen gemalen en uit zachter graan dan Noord-Europees volkoren. Dat betekent minder beschadigd zetmeel en dus minder wateropname dan een Duitse of Amerikaanse volkoren van hetzelfde asgehalte.',
    en: 'Spanish wholemeal, usually stone-milled and from softer grain than northern European wholemeal. That means less damaged starch and therefore less absorption than a German or American wholemeal at the same ash.',
  },
  'es-harina-centeno-integral': {
    nl: 'Spaanse volkoren rogge, een nichegraan in een land waar tarwe domineert. Vaak vers gemalen en daardoor enzymrijk: verzuur goed, houd de bulk kort en bak donkerder dan je gewend bent.',
    en: 'Spanish whole rye, a niche grain in a country dominated by wheat. Often freshly milled and therefore enzyme-rich: acidify well, keep the bulk short and bake darker than you are used to.',
  },
  'es-harina-espelta': {
    nl: 'Volkoren spelt uit Spaanse molens. Zelfde regels als overal: hoog eiwit, laag draagvermogen, en een deeg dat scheurt in plaats van rekt zodra je te ver gaat. Een busvorm lost het meeste op.',
    en: 'Whole spelt from Spanish mills. The same rules as everywhere: high protein, low carrying capacity, and a dough that tears rather than stretches the moment you go too far. A tin solves most of it.',
  },

  /* ---- Australia ---------------------------------------------------- */
  'au-plain-flour': {
    nl: 'Australische plain flour uit zacht graan, zwakker dan zowel de Britse als de Amerikaanse variant met een vergelijkbare naam. Voor desembrood alleen bruikbaar in een mix met bakkersbloem.',
    en: 'Australian plain flour from soft grain, weaker than both the British and American versions carrying a similar name. Only usable for sourdough in a blend with baker\'s flour.',
  },
  'au-wholemeal': {
    nl: 'Australisch volkoren uit tarwe die zachter en eiwitarmer is dan het Noord-Amerikaanse equivalent. Amerikaanse volkorenrecepten hierop draaien vraagt om minder water, niet meer — het omgekeerde van de gebruikelijke correctie.',
    en: 'Australian wholemeal from wheat softer and lower in protein than the North American equivalent. Running American wholemeal recipes on it calls for less water, not more — the reverse of the usual correction.',
  },
  'au-stoneground-wholemeal': {
    nl: 'Steengemalen Australisch volkoren. De combinatie van zacht graan en steenmaling geeft opvallend weinig beschadigd zetmeel, en dus een van de laagste wateropnames van alle volkorenmelen hier.',
    en: 'Stone-ground Australian wholemeal. The combination of soft grain and stone milling gives strikingly little damaged starch, and therefore one of the lowest absorptions of any wholemeal here.',
  },
  'au-rye-wholemeal': {
    nl: 'Australische volkoren rogge, met een hoger valgetal dan de meeste Europese rogge — het klimaat is droger tijdens de oogst. In de praktijk betekent dat iets minder enzymactiviteit en een iets ruimer tijdvenster dan je van rogge gewend bent.',
    en: 'Australian whole rye, with a higher falling number than most European rye — the climate is drier at harvest. In practice that means slightly less enzyme activity and a slightly wider window than rye usually gives you.',
  },
  'au-spelt-wholemeal': {
    nl: 'Volkoren spelt uit Australische molens, doorgaans op steen gemalen. Iets lager in eiwit dan Europese spelt, wat het draagvermogen niet verbetert maar het deeg wel voorspelbaarder maakt.',
    en: 'Whole spelt from Australian mills, usually stone-milled. Slightly lower in protein than European spelt, which does not improve the carrying capacity but does make the dough more predictable.',
  },
};
