/**
 * Extended notes for the reference flours.
 *
 * These are the grades people actually search for, so they get the longest
 * treatment. Each one has to earn its page: say what the flour does in a dough,
 * what it costs you, and what a reader coming from another country's recipe
 * should expect. The thin-content guard enforces the length; the standard for
 * what goes *in* those words is editorial.
 */

type Prose = { nl: string; en: string };

export const CORE_NOTES: Record<string, Prose> = {
  /* ---- France ---------------------------------------------------- */
  'fr-t45': {
    nl: 'Patisseriebloem: fijn gemalen, weinig as, uit zachte tarwe. Voor brood op zichzelf te slap — het deeg mist de structuur om gas vast te houden en zakt in tijdens de laatste rijs. In een mix tot vijftien procent maakt het de kruim juist zachter en malser, en dat is precies waar het voor deugt.',
    en: 'Pastry flour: finely milled, low in ash, from soft wheat. Too slack for bread on its own — the dough lacks the structure to hold gas and sinks during the final proof. In a blend up to fifteen per cent it softens and tenderises the crumb, which is exactly what it is good for.',
  },
  'fr-t55': {
    nl: 'De standaardbloem van Frankrijk, en de referentie waar half het Franse bakrepertoire op geschreven is. Middelsterk, laag in as, en gemaakt voor rekbaarheid boven kracht: precies wat een croissant of een pizzabodem nodig heeft. Voor een landbrood met open kruim wil je een stap verder naar T65 of T80.',
    en: 'France\'s standard flour, and the reference half the French baking repertoire is written against. Mid-strength, low in ash, and built for extensibility over strength: exactly what a croissant or a pizza base needs. For a country loaf with an open crumb you want a step further, to T65 or T80.',
  },
  'fr-t65': {
    nl: 'Het broodmeel van Frankrijk en de referentie voor stokbrood. Merkbaar zwakker dan Amerikaanse bread flour — dat is geen gebrek maar het punt: Frans graan is zachter en de maling beschadigt minder zetmeel, dus dit meel draagt ongeveer negen punten minder water. Een Amerikaans recept van 85% hierop draaien geeft geen open kruim maar een plas.',
    en: 'France\'s bread flour and the reference for baguettes. Noticeably weaker than American bread flour — not a defect but the point: French grain is softer and the milling damages less starch, so this flour carries roughly nine points less water. Running an American 85% recipe on it gives you not an open crumb but a puddle.',
  },
  'fr-t65-tradition': {
    nl: 'Wettelijk beschermd onder het décret pain de tradition française: geen ascorbinezuur, geen enzymen buiten de toegestane lijst, alleen bonen- of sojameel binnen limieten. Het gevolg is een meel dat trager fermenteert en meer smaakt, en dat minder vergevingsgezind is dan de industriële T65 omdat er geen verbetermiddel is om je fouten op te vangen.',
    en: 'Legally protected under the décret pain de tradition française: no ascorbic acid, no enzymes beyond the permitted list, only fava or soy flour within limits. The result is a flour that ferments more slowly and tastes of more, and that is less forgiving than industrial T65 because there is no improver to catch your mistakes.',
  },
  'fr-t80': {
    nl: 'Halfvolkoren, vaak op steen gemalen, en de beste enkele bloem als je maar één zak wilt kopen. Genoeg zemelen voor echte smaak en een romige kleur, genoeg endosperm om een strak gevormd brood te dragen. Reken op ongeveer twee punten meer water dan T65 en een iets kortere bulk.',
    en: 'Semi-wholemeal, often stone-milled, and the best single flour if you are only buying one bag. Enough bran for real flavour and a creamy colour, enough endosperm to carry a tightly shaped loaf. Expect about two points more water than T65 and a slightly shorter bulk.',
  },
  'fr-meule-t80': {
    nl: 'Steenmaling verplettert het graan in plaats van het te scheren, en dat beschadigt fors minder zetmeel dan een walsmolen. Beschadigd zetmeel is precies wat water bindt, dus hetzelfde graan op steen gemalen drinkt makkelijk drie punten minder dan industrieel gemalen. Dat is een van de grootste onzichtbare verschillen tussen twee zakken met hetzelfde etiket.',
    en: 'Stone milling crushes the grain rather than shearing it, and that damages considerably less starch than a roller mill. Damaged starch is precisely what binds water, so the same grain stone-milled drinks up to three points less than industrially milled. That is one of the largest invisible differences between two bags wearing the same label.',
  },
  'fr-gruau-t45': {
    nl: 'Gruau betekent: uit harde tarwe, dus hoog eiwit bij een laag asgehalte. Die combinatie is ongebruikelijk en precies wat verrijkte degen nodig hebben — brioche en croissants moeten vet en suiker dragen, en dat kost structuur die deze bloem wel heeft en een gewone T45 niet. De W ligt typisch tussen 280 en 330.',
    en: 'Gruau means: from hard wheat, so high protein at a low ash. That combination is unusual and exactly what enriched doughs need — brioche and croissants have to carry fat and sugar, and that costs structure this flour has and an ordinary T45 does not. The W typically sits between 280 and 330.',
  },
  'fr-seigle-t130': {
    nl: 'De klassieke rogge voor pain de campagne, half tot driekwart uitgemalen. Tien tot twintig procent is genoeg om het brood volledig te veranderen zonder de techniek om te gooien: meer smaak, meer verzuring, een kortere bulk en een kruim die dagen langer vochtig blijft. Boven dertig procent verandert de werkwijze wél.',
    en: 'The classic rye for pain de campagne, half to three-quarters extracted. Ten to twenty per cent is enough to change the loaf completely without changing the technique: more flavour, more acidity, a shorter bulk and a crumb that stays moist for days longer. Above thirty per cent the method does change.',
  },
  'fr-grand-epeautre': {
    nl: 'Hoog eiwit, lage sterkte. Dat lijkt tegenstrijdig tot je het deeg voelt: speltgluten rekt makkelijk en veert nauwelijks terug, dus het scheurt eerder dan tarwe en het houdt de vorm minder goed vast. Minder water, minder vouwen, en stop de bulk bij zestig tot zeventig procent volumetoename in plaats van bij verdubbeling.',
    en: 'High protein, low strength. That looks contradictory until you feel the dough: spelt gluten stretches easily and barely springs back, so it tears sooner than wheat and holds its shape less well. Less water, fewer folds, and end the bulk at sixty to seventy per cent volume increase rather than at doubling.',
  },
  'fr-petit-epeautre': {
    nl: 'Eenkoorn uit de Haute-Provence, het oudste gedomesticeerde graan dat nog gegeten wordt. Het neemt fors minder water op dan tarwe en houdt bijna geen vorm: vijftien procent eiwit en toch een van de zwakste melen in deze database. Boven dertig procent in de mix heb je een busvorm nodig, hoe sterk de rest ook is.',
    en: 'Einkorn from the Haute-Provence, the oldest domesticated grain still eaten. It takes up markedly less water than wheat and holds almost no shape: fifteen per cent protein and still one of the weakest flours in this database. Above thirty per cent of a blend you need a tin, however strong the rest.',
  },

  /* ---- Germany --------------------------------------------------- */
  'de-405': {
    nl: 'De huis-, tuin- en keukenbloem van Duitsland, bedoeld voor cake en saus en niet voor brood. Laag in eiwit en zacht gemalen: het deeg mist de structuur om gas vast te houden. Wie hiermee desem probeert te bakken krijgt een dichte kruim en wijt het aan zijn starter, terwijl het aan de bloem ligt.',
    en: 'Germany\'s everyday household flour, meant for cake and sauce rather than bread. Low in protein and softly milled: the dough lacks the structure to hold gas. Anyone attempting sourdough with it gets a dense crumb and blames their starter, when the flour is the cause.',
  },
  'de-550': {
    nl: 'Het Duitse broodmeel, en sterker dan de Franse T55 waar het qua asgehalte mee overeenkomt — een goed voorbeeld van waarom asgetallen niets over kracht zeggen. Duits graan is harder dan Frans, dus dit meel gedraagt zich eerder als een T65 en draagt ongeveer twee punten meer water dan het Franse equivalent.',
    en: 'Germany\'s bread flour, and stronger than the French T55 it matches on ash — a good illustration of why ash numbers say nothing about strength. German grain is harder than French, so this flour behaves more like a T65 and carries about two points more water than its French counterpart.',
  },
  'de-1050': {
    nl: 'Donkere tarwebloem en de ruggengraat van het Duitse Mischbrot. Ongeveer halfvolkoren in gedrag: merkbaar meer water, een kortere bulk, en een kruim die dichter en donkerder uitvalt dan met 550. Dit is de maat waarop de meeste Duitse desemrecepten geschreven zijn, en waar Engelstalige recepten het vaakst over struikelen.',
    en: 'Dark wheat flour and the backbone of German Mischbrot. Roughly half-wholemeal in behaviour: noticeably more water, a shorter bulk, and a crumb that comes out denser and darker than with 550. This is the grade most German sourdough recipes are written for, and the one English-language recipes trip over most often.',
  },
  'de-dinkel-630': {
    nl: 'De speltbloem die het dichtst bij witte tarwebloem komt, en de enige speltvorm waarmee een vrijstaand brood realistisch is. Toch geldt ook hier de speltregel: minder water dan tarwe, minder vouwen, kortere bulk. Speltgluten lost sneller op dan het zich opbouwt zodra je te ver gaat, en dat punt komt eerder dan je verwacht.',
    en: 'The spelt flour that comes closest to white wheat flour, and the only form of spelt where a free-standing loaf is realistic. Even so the spelt rule applies: less water than wheat, fewer folds, shorter bulk. Spelt gluten dissolves faster than it builds the moment you go too far, and that point arrives sooner than you expect.',
  },
  'de-dinkelvollkorn': {
    nl: 'Veertien procent eiwit en toch geen structuur: dit is het duidelijkste bewijs in de hele database dat eiwitgehalte en sterkte twee verschillende dingen zijn. Eiwit meet hoeveel er is; sterkte meet wat het doet. De combinatie van oplosbaar speltgluten en snijdende zemelen maakt dit een busvormmeel, en dat is geen troostprijs.',
    en: 'Fourteen per cent protein and still no structure: the clearest proof in this whole database that protein content and strength are two different things. Protein measures how much is there; strength measures what it does. The combination of soluble spelt gluten and cutting bran makes this a tin-loaf flour, and that is not a consolation prize.',
  },
  'de-roggen-1150': {
    nl: 'De standaardrogge voor Mischbrot en de meest gebruikte roggemaat van Europa. Onder de twintig procent in de mix merk je vooral de smaak en de iets snellere bulk; daarboven kantelt het gedrag en heb je roggetechniek nodig — natter mengen, niet kneden, en in een vorm bakken in plaats van vrijstaand.',
    en: 'The standard rye for Mischbrot and the most used rye grade in Europe. Below twenty per cent of the blend you mostly notice the flavour and a slightly faster bulk; above that the behaviour tips and you need rye technique — mix wetter, do not knead, and bake in a tin rather than free-standing.',
  },
  'de-roggenvollkorn': {
    nl: 'Hier komt de verzuring niet uit smaakoverwegingen maar uit noodzaak: zuur remt het amylase dat anders je kruim tot pap maakt voordat het brood in de oven zet. Volkoren rogge heeft geen glutennetwerk, dus kneden en vouwen leveren niets op — de structuur komt uit de zetmeelgel en de pentosanen, en die hebben tijd nodig, geen handen.',
    en: 'Here the souring is not a flavour choice but a necessity: acid restrains the amylase that would otherwise reduce your crumb to paste before the loaf sets in the oven. Whole rye has no gluten network, so kneading and folding achieve nothing — the structure comes from the starch gel and the pentosans, and those need time, not hands.',
  },
  'de-manitoba-550': {
    nl: 'Noord-Amerikaans graan in een Europese verpakking, verkocht onder de Duitse Type-indeling. Dit is het meel dat het gat tussen de continenten dicht: het draagt ongeveer evenveel water als Amerikaanse bread flour en maakt Engelstalige recepten meteen werkbaar. Voor een stokbrood is het veel te sterk, voor een open kruim uitstekend.',
    en: 'North American grain in European packaging, sold under the German Type system. This is the flour that closes the gap between the continents: it carries roughly as much water as American bread flour and makes English-language recipes work straight off. Far too strong for a baguette, excellent for an open crumb.',
  },

  /* ---- Italy ------------------------------------------------------ */
  'it-00-pizza': {
    nl: 'Fijn gemalen, middelsterk, gemaakt voor een lange koude rijs. Niet omdat 00 zwak zou zijn — dit type is juist zeer verfijnd én sterk genoeg voor achtenveertig uur. Het getal 00 slaat op de maalfijnheid en het asgehalte, niet op kracht, en dat verschil is precies waar mensen op vastlopen bij Italiaanse bloem.',
    en: 'Finely milled, mid-strength, built for a long cold rise. Not because 00 is weak — this type is both highly refined and strong enough for forty-eight hours. The number 00 refers to grind and ash, not to strength, and that distinction is exactly where people come unstuck with Italian flour.',
  },
  'it-00-pasticceria': {
    nl: 'Zelfde tipo-nummer als de pizzabloem, half de kracht. Dit is precies waarom "00" op zichzelf niets betekent voor brood: de W van 150 houdt een deeg geen achtenveertig uur overeind, en wie hiermee een pizzarecept probeert dat 00 voorschrijft, krijgt een bodem die uitvloeit en scheurt bij het uitrekken.',
    en: 'The same tipo number as the pizza flour, half the strength. This is precisely why "00" on its own tells you nothing about bread: a W of 150 will not hold a dough up for forty-eight hours, and anyone using it for a pizza recipe that specifies 00 gets a base that flows and tears when opened out.',
  },
  'it-00-manitoba': {
    nl: 'Noord-Amerikaans graan, Italiaanse maling, en met een W van rond de 380 een van de sterkste bloemen die je zonder groothandel koopt. Voor panettone en alles wat vierentwintig uur moet blijven staan zonder in te zakken. Voor een gewoon landbrood is dit te veel kracht: de kruim wordt taai in plaats van luchtig.',
    en: 'North American grain, Italian milling, and at a W of around 380 one of the strongest flours you can buy outside a wholesaler. For panettone and anything that has to stand for twenty-four hours without collapsing. For an ordinary country loaf this is too much strength: the crumb turns chewy rather than airy.',
  },
  'it-1': {
    nl: 'Tipo 1 is de Italiaanse T80: half uitgemalen, vaak op steen, en veruit de smaakvolste enkele keuze voor desem. Genoeg zemelen voor kleur en diepte, genoeg endosperm om een strak gevormd brood te dragen. Als je één zak Italiaanse bloem koopt en er brood mee wilt bakken in plaats van pizza, is dit hem.',
    en: 'Tipo 1 is Italy\'s T80: half-extracted, often stone-milled, and by far the most flavourful single choice for sourdough. Enough bran for colour and depth, enough endosperm to carry a tightly shaped loaf. If you buy one bag of Italian flour and want to bake bread rather than pizza, this is the one.',
  },
  'it-semola-rimacinata': {
    nl: 'Geel, korrelig, twee keer gemalen, en de basis van Pane di Altamura. Durum neemt iets meer water op dan zachte tarwe maar rekt minder: verwacht een dichter, elastischer deeg en een kruim die dagenlang zacht blijft. Tien tot twintig procent in een tarwemix geeft de kleur en de houdbaarheid zonder de stugheid.',
    en: 'Yellow, granular, twice-milled, and the basis of Pane di Altamura. Durum takes slightly more water than soft wheat but stretches less: expect a denser, more elastic dough and a crumb that stays soft for days. Ten to twenty per cent in a wheat blend gives the colour and the keeping without the stiffness.',
  },
  'it-00-nuvola': {
    nl: 'Lage P/L-verhouding: extensibel eerder dan taai. Dat is wat een pizzarand luchtig maakt in plaats van rubberig — het deeg geeft mee onder de gasdruk in plaats van terug te duwen. De W van 300 draagt daarbij een lange koude rijs, dus je krijgt allebei: rekbaarheid én genoeg kracht om achtenveertig uur te overleven.',
    en: 'Low P/L ratio: extensible rather than tenacious. That is what makes a pizza rim airy rather than rubbery — the dough yields under gas pressure instead of pushing back. The W of 300 also carries a long cold rise, so you get both: extensibility and enough strength to survive forty-eight hours.',
  },

  /* ---- US and Canada ---------------------------------------------- */
  'us-ap-flour': {
    nl: 'Amerikaanse all-purpose is sterker dan Europese patentbloem met hetzelfde etiket, en dat is de val waar Europese bakkers in trappen als ze een Amerikaans recept letterlijk volgen. Reken op ongeveer vier punten meer wateropname dan Nederlandse patentbloem. De meeste merken bevatten bovendien gerstemout, wat de fermentatie versnelt.',
    en: 'American all-purpose is stronger than European plain flour wearing the same label, and that is the trap European bakers fall into when following an American recipe literally. Expect roughly four points more absorption than Dutch patentbloem. Most brands also carry malted barley, which speeds up fermentation.',
  },
  'us-bread-flour': {
    nl: 'De referentiebloem van vrijwel elk Engelstalig desemrecept. Als een recept 80% hydratatie zegt zonder de bloem te noemen, bedoelt het waarschijnlijk dit. Hard rood graan plus walsmaling geeft veel beschadigd zetmeel, en dat is het grootste deel van het gat met Europese bloem — niet het eiwit, waar iedereen naar kijkt.',
    en: 'The reference flour behind almost every English-language sourdough recipe. If a recipe says 80% hydration without naming its flour, it probably means this. Hard red grain plus roller milling gives plenty of damaged starch, and that is most of the gap against European flour — not the protein everyone looks at.',
  },
  'us-white-whole-wheat': {
    nl: 'Volkoren uit witte tarwe: dezelfde zemelen, dezelfde voedingswaarde, maar zonder de bittere tannines van rode tarwe. De makkelijkste manier om het volkorenaandeel in je brood te verhogen zonder klachten aan tafel. Qua wateropname en sterkte gedraagt het zich vrijwel identiek aan gewoon Amerikaans volkoren.',
    en: 'Wholegrain from white wheat: the same bran, the same nutrition, but without the bitter tannins of red wheat. The easiest way to raise the wholegrain share in your bread without complaints at the table. In absorption and strength it behaves almost identically to ordinary American wholemeal.',
  },
  'us-type-85': {
    nl: 'Amerikaanse ambachtelijke molens die de Europese uitmalingsgedachte overnemen. Qua gedrag het dichtst bij een Franse T80, maar uit harder graan en daardoor met een hogere wateropname. Voor wie in de Verenigde Staten een Europees recept wil bakken is dit doorgaans de beste enkele keuze op het schap.',
    en: 'American artisan mills adopting the European extraction idea. Behaves closest to a French T80, but from harder grain and therefore with higher absorption. For anyone in the United States baking a European recipe, this is usually the best single choice on the shelf.',
  },
  'us-heritage-red-fife': {
    nl: 'Oud ras, steengemalen. Het eiwitgehalte lijkt op moderne tarwe maar de glutenkwaliteit is zwakker: reken op minder oven spring en een compactere kruim. De smaak is de reden dat mensen het kopen, en die is het waard — houd het onder de veertig procent van je mix als je een vrijstaand brood wilt.',
    en: 'A heritage variety, stone-milled. The protein reads like modern wheat but the gluten quality is weaker: expect less oven spring and a more compact crumb. Flavour is why people buy it, and the flavour is worth it — keep it under forty per cent of your blend for a free-standing loaf.',
  },
  'us-einkorn': {
    nl: 'Vijftien procent eiwit en het houdt nog steeds geen vorm. Eenkoorn is het oudste gedomesticeerde graan en zijn gluten vormt nauwelijks een netwerk: het deeg voelt aan als nat zand en vloeit uit zodra je het loslaat. Boven dertig procent in de mix: busvorm, en verwacht een dichte, goudgele kruim.',
    en: 'Fifteen per cent protein and it still holds no shape. Einkorn is the oldest domesticated grain and its gluten barely forms a network: the dough feels like wet sand and flows the moment you let go. Above thirty per cent of a blend: use a tin, and expect a dense, golden crumb.',
  },
  'ca-strong-bakers': {
    nl: 'Canadese harde voorjaarstarwe is ongeveer het sterkste dat je commercieel kunt kopen. Europese recepten hierop draaien vraagt om fors meer water — makkelijk acht punten boven wat er staat — en om langere bulktijden dan je gewend bent, want de sterkte geeft je marge die zwakker meel niet heeft.',
    en: 'Canadian hard spring wheat is about the strongest thing you can buy commercially. Running European recipes on it calls for considerably more water — easily eight points above what is printed — and for longer bulks than you are used to, because the strength gives you margin weaker flour does not.',
  },
  'ca-all-purpose': {
    nl: 'Let op: Canadese all-purpose ligt qua kracht dichter bij Amerikaanse bread flour dan bij Amerikaanse all-purpose. Hetzelfde woord, ander product, en een van de meest verwarrende naamgevingen in het hele bakwezen. Een Amerikaans recept dat om all-purpose vraagt wordt hier meetbaar steviger dan bedoeld.',
    en: 'Careful: Canadian all-purpose sits closer in strength to American bread flour than to American all-purpose. The same word, a different product, and one of the most confusing pieces of naming in all of baking. An American recipe calling for all-purpose comes out measurably firmer here than intended.',
  },

  /* ---- Netherlands ------------------------------------------------ */
  'nl-patentbloem': {
    nl: 'De witte bloem uit de supermarkt: laag in eiwit en zacht gemalen. Bruikbaar voor desem, maar reken op een dichtere kruim en minder oven spring dan met bakkersbloem. Wie een Amerikaans recept letterlijk volgt met patentbloem krijgt een deeg dat uitvloeit — er zit hier zeker tien punten minder draagvermogen in dan het recept aanneemt.',
    en: 'The white flour from the supermarket: low in protein and softly milled. Usable for sourdough, but expect a tighter crumb and less oven spring than with baker\'s flour. Anyone following an American recipe literally with patentbloem gets a dough that flows — there is a good ten points less carrying capacity here than the recipe assumes.',
  },
  'nl-bakkersbloem': {
    nl: 'De sterkste bloem die je in Nederland zonder moeite koopt, en het dichtst bij Amerikaanse bread flour. Toch nog steeds enkele punten minder water, want er zit minder beschadigd zetmeel in: het graan is zachter en de maling minder agressief. Bevat vaak ascorbinezuur als verbetermiddel, wat de oven spring helpt.',
    en: 'The strongest flour you can buy easily in the Netherlands, and the closest to American bread flour. Still a few points less water, because there is less damaged starch: the grain is softer and the milling less aggressive. Often carries ascorbic acid as an improver, which helps the oven spring.',
  },
  'nl-volkoren-steengemalen': {
    nl: 'Hetzelfde graan als industrieel volkoren, maar op steen gemalen: minder beschadigd zetmeel, dus een paar punten minder water en een tragere hydratatie. Geef dit meel een lange autolyse — de zemelen nemen hun water pas na drie kwartier volledig op, en wie te vroeg beoordeelt voegt water toe dat hij later niet meer kwijt kan.',
    en: 'The same grain as industrial wholemeal, but stone-milled: less damaged starch, so a couple of points less water and slower hydration. Give this flour a long autolyse — the bran does not take its water up fully for three-quarters of an hour, and anyone judging too early adds water they cannot get rid of later.',
  },
  'nl-zeeuwse-bloem': {
    nl: 'Nederlandse streektarwe is zacht: goede smaak, weinig kracht. Reken op minder water en een dichtere kruim dan bij importbloem, en meng met bakkersbloem als je een open kruim wilt. Steengemalen, dus opvallend weinig beschadigd zetmeel — het verschil met industriële bloem is hier groter dan het etiket doet vermoeden.',
    en: 'Dutch regional wheat is soft: good flavour, little strength. Expect less water and a tighter crumb than with imported flour, and blend with baker\'s flour if you want an open crumb. Stone-milled, so strikingly little damaged starch — the difference from industrial flour is larger here than the label suggests.',
  },

  /* ---- Belgium ---------------------------------------------------- */
  'be-bruine-bloem': {
    nl: 'De Belgische halfvolkoren, ongeveer gelijk aan Nederlands tarwemeel en Frans T80. Een goede enkele keuze als je maar één zak wilt kopen: genoeg zemelen voor smaak en kleur, genoeg endosperm voor structuur. Reken op ongeveer drie punten meer water dan witte bloem en een merkbaar kortere bulk.',
    en: 'The Belgian half-wholemeal, roughly equal to Dutch tarwemeel and French T80. A good single choice if you are only buying one bag: enough bran for flavour and colour, enough endosperm for structure. Expect about three points more water than white flour and a noticeably shorter bulk.',
  },
  'be-spelt-volkoren': {
    nl: 'Volkoren spelt van Belgische molens, doorgaans op steen gemalen. Steenmaling scheelt hier een paar punten wateropname ten opzichte van industrieel gemalen spelt, wat het net iets makkelijker maakt om mee te werken. De speltregel blijft: minder water, minder vouwen, korter bulken, en een busvorm als je boven de veertig procent gaat.',
    en: 'Whole spelt from Belgian mills, usually stone-milled. Stone milling is worth a couple of points of absorption against industrially milled spelt, which makes it a little easier to work with. The spelt rule still holds: less water, fewer folds, shorter bulk, and a tin above forty per cent.',
  },

  /* ---- United Kingdom --------------------------------------------- */
  'uk-strong-white': {
    nl: 'Britse "strong" zegt iets over eiwit en niets over uitmaling — precies het spiegelbeeld van het Franse T-systeem, dat over uitmaling gaat en niets over kracht zegt. Twee etiketten die elkaars blinde vlek hebben. In gedrag zit deze bloem tussen Duitse 550 en Amerikaanse bread flour in.',
    en: 'British "strong" speaks to protein and says nothing about extraction — the exact mirror of the French T system, which speaks to extraction and says nothing about strength. Two labels with each other\'s blind spot. In behaviour this flour sits between German 550 and American bread flour.',
  },
  'uk-plain-flour': {
    nl: 'Britse plain flour is duidelijk zwakker dan Amerikaanse all-purpose, ondanks de vergelijkbare rol in de keuken. Niet inwisselbaar in broodrecepten: het verschil in eiwitgehalte is meer dan twee punten, en dat vertaalt zich naar een deeg dat de vorm niet houdt. Voor gebak is het uitstekend.',
    en: 'British plain flour is distinctly weaker than American all-purpose despite filling the same role in the kitchen. Not interchangeable in bread recipes: the protein difference is more than two points, and that translates to a dough that will not hold its shape. For pastry it is excellent.',
  },
  'uk-heritage-wholemeal': {
    nl: 'Oude Britse rassen geven veel smaak en weinig structuur. Het eiwitgehalte ligt laag en de glutenkwaliteit nog lager, dus houd het onder de dertig procent in de mix tenzij je een busvorm gebruikt. Wie het als hoofdmeel probeert, krijgt een compact, aromatisch brood — wat prima is als je dat verwacht.',
    en: 'Heritage British varieties give a great deal of flavour and very little structure. The protein is low and the gluten quality lower still, so keep it under thirty per cent of the blend unless you are using a tin. Anyone using it as the main flour gets a compact, aromatic loaf — which is fine if you expect it.',
  },
  'uk-dark-rye': {
    nl: 'Britse donkere rogge, in de praktijk bijna volkoren. Britse recepten gebruiken rogge veel spaarzamer dan Duitse of Scandinavische, dus tien procent is hier al een uitgesproken keuze en geen basislijn. Het lage valgetal betekent veel amylase: verzuur goed en houd de bulk korter dan je gewend bent.',
    en: 'British dark rye, in practice close to wholemeal. British recipes use rye far more sparingly than German or Scandinavian ones, so ten per cent here is already a pronounced choice rather than a baseline. The low falling number means plenty of amylase: acidify well and keep the bulk shorter than usual.',
  },
  'uk-malthouse': {
    nl: 'De moutvlokken voegen enzymen toe, en dat versnelt de fermentatie en verkort het venster waarin het deeg goed is. Hou de bulk korter dan je gewend bent en beoordeel op volume in plaats van op de klok. De smaak is uitgesproken zoet en moutig, en de kruim blijft langer vochtig dan bij gewone volkoren.',
    en: 'The malted flakes add enzymes, which speeds fermentation and narrows the window in which the dough is right. Keep the bulk shorter than you are used to and judge by volume rather than the clock. The flavour is pronouncedly sweet and malty, and the crumb stays moist longer than with plain wholemeal.',
  },

  /* ---- Nordics ---------------------------------------------------- */
  'dk-oland-hvede': {
    nl: 'Een van de smaakvolste tarwes van Noord-Europa en een van de zwakste. Het historische Ølandsras geeft een uitgesproken nootachtige smaak en een romige kruim, maar het gluten draagt weinig: boven de veertig procent in een mix heb je ondersteuning nodig van een sterke bloem of een busvorm.',
    en: 'One of northern Europe\'s most flavourful wheats and one of its weakest. The heritage Öland variety gives a pronounced nutty flavour and a creamy crumb, but the gluten carries little: above forty per cent of a blend you need support from a strong flour or a tin.',
  },
  'dk-rugmel': {
    nl: 'De basis van rugbrød. Hier is desem geen smaakkeuze maar een technische noodzaak: zonder verzuring verzuipt de kruim in zijn eigen amylase en wordt het brood gommig in plaats van stevig. Niet kneden, niet vormen, wel lang bakken en daarna een etmaal laten rusten voordat je aansnijdt.',
    en: 'The basis of rugbrød. Here sourdough is not a flavour choice but a technical necessity: without acidification the crumb drowns in its own amylase and the loaf turns gummy rather than firm. Do not knead, do not shape, bake long, and rest it a full day before cutting.',
  },
  'se-vetemjol-special': {
    nl: 'De Zweedse broodbloem; "special" duidt op een hoger eiwitgehalte dan het gewone vetemjöl. Vergelijkbaar met een Duitse 550 en daarmee de zinnigste standaardkeuze voor desem in Zweden. Zweeds graan is zachter dan Duits, dus reken op iets minder water dan een Duits recept aangeeft.',
    en: 'Sweden\'s bread flour; "special" indicates higher protein than ordinary vetemjöl. Comparable to a German 550, and therefore the sensible default for sourdough in Sweden. Swedish grain is softer than German, so expect slightly less water than a German recipe specifies.',
  },
  'se-vetemjol': {
    nl: 'Zweedse standaardbloem uit zacht graan, bedoeld voor gebak en dagelijkse baksels. Voor desembrood op zichzelf te zwak: het deeg houdt geen vorm en de kruim wordt dicht. Meng met vetemjöl special of met Manitoba als je een open kruim wilt, of accepteer een compacter brood.',
    en: 'Swedish standard flour from soft grain, meant for cakes and everyday baking. Too weak for sourdough on its own: the dough holds no shape and the crumb turns dense. Blend with vetemjöl special or Manitoba if you want an open crumb, or accept a more compact loaf.',
  },

  /* ---- Poland, Spain, Australia ----------------------------------- */
  'pl-typ-750': {
    nl: 'De donkerste Poolse witte bloem voordat je bij razowa uitkomt. Een deel van de zemelen is aanwezig, dus reken op twee tot drie punten meer water dan typ 650 en een merkbaar snellere fermentatie. In Polen de gebruikelijke keuze voor een stevig tarwebrood dat nog steeds licht van kruim is.',
    en: 'The darkest Polish white flour before you reach razowa. Some of the bran is present, so expect two to three points more water than typ 650 and a noticeably faster ferment. In Poland the usual choice for a robust wheat loaf that is still light in the crumb.',
  },
  'pl-zytnia-720': {
    nl: 'Lichte Poolse rogge, grotendeels ontdaan van zemelen. In Polen de gebruikelijke rogge voor een mengbrood waarin tarwe nog de hoofdrol speelt. Tot twintig procent verandert er weinig aan je werkwijze; daarboven wordt het deeg plakkerig op een manier die met kneden niet op te lossen is.',
    en: 'Light Polish rye, mostly stripped of bran. In Poland the usual rye for a mixed loaf in which wheat still leads. Up to twenty per cent little about your method changes; above that the dough turns sticky in a way kneading cannot fix.',
  },
  'pl-zytnia-2000': {
    nl: 'Poolse volkorenrogge voor chleb żytni. Zeer hoog asgehalte, zeer actief, en de bulk is korter dan je denkt — vaak de helft van wat een tarwerecept aangeeft. Verzuur grondig, meng nat, bak in een vorm, en snijd het brood pas de volgende dag aan.',
    en: 'Polish whole rye for chleb żytni. Very high ash, very active, and the bulk is shorter than you think — often half what a wheat recipe states. Acidify thoroughly, mix wet, bake in a tin, and cut the loaf only the next day.',
  },
  'es-harina-fuerza': {
    nl: 'Spanje classificeert op W-waarde, wat eerlijker is dan een asgetal: het meet precies de eigenschap waar een bakker om geeft. Harina de fuerza ligt typisch tussen W 280 en 330 en is bedoeld voor verrijkte degen als roscón en ensaimada, die vet en suiker moeten dragen. Voor gewoon desembrood vaak net te sterk.',
    en: 'Spain classifies by W value, which is more honest than an ash number: it measures precisely the property a baker cares about. Harina de fuerza typically sits between W 280 and 330 and is meant for enriched doughs like roscón and ensaimada that have to carry fat and sugar. Often just too strong for plain sourdough.',
  },
  'es-harina-integral': {
    nl: 'Spaans volkoren, doorgaans op steen gemalen en uit zachter graan dan Noord-Europees volkoren. Dat betekent minder beschadigd zetmeel en dus minder wateropname dan een Duitse of Amerikaanse volkoren van hetzelfde asgehalte — een van de weinige gevallen waarin volkoren juist minder drinkt dan verwacht.',
    en: 'Spanish wholemeal, usually stone-milled and from softer grain than northern European wholemeal. That means less damaged starch and therefore less absorption than a German or American wholemeal at the same ash — one of the few cases where the wholemeal drinks less than expected.',
  },
  'es-harina-centeno-integral': {
    nl: 'Spaanse volkoren rogge, een nichegraan in een land waar tarwe domineert. Vaak vers gemalen en daardoor enzymrijk: verzuur goed, houd de bulk kort en bak donkerder dan je gewend bent. In Spaanse recepten zie je het vooral als tien tot vijftien procent in een tarwedeeg, zelden als hoofdmeel.',
    en: 'Spanish whole rye, a niche grain in a country dominated by wheat. Often freshly milled and therefore enzyme-rich: acidify well, keep the bulk short and bake darker than you are used to. In Spanish recipes it mostly appears as ten to fifteen per cent of a wheat dough, rarely as the main flour.',
  },
  'au-bakers-flour': {
    nl: 'Australische bakkersbloem is merkbaar zwakker dan Amerikaanse bread flour. Amerikaanse recepten hierop draaien vraagt om minder water, niet meer — het omgekeerde van de correctie die de meeste mensen verwachten, en de reden dat Australische bakkers zo vaak klagen dat Amerikaanse desemrecepten bij hen uitvloeien.',
    en: 'Australian baker\'s flour is noticeably weaker than American bread flour. Running American recipes on it calls for less water, not more — the reverse of the correction most people expect, and the reason Australian bakers so often report that American sourdough recipes flow on them.',
  },
  'au-plain-flour': {
    nl: 'Australische plain flour uit zacht graan, zwakker dan zowel de Britse als de Amerikaanse variant met een vergelijkbare naam. Voor desembrood alleen bruikbaar in een mix met bakkersbloem; op zichzelf mist het deeg de structuur om gas vast te houden en valt de kruim dicht uit.',
    en: 'Australian plain flour from soft grain, weaker than both the British and American versions carrying a similar name. Only usable for sourdough blended with baker\'s flour; on its own the dough lacks the structure to hold gas and the crumb comes out dense.',
  },
  'au-wholemeal': {
    nl: 'Australisch volkoren uit tarwe die zachter en eiwitarmer is dan het Noord-Amerikaanse equivalent. Amerikaanse volkorenrecepten hierop draaien vraagt om minder water, niet meer — het omgekeerde van de gebruikelijke correctie, en precies het soort verschil waar deze site voor bestaat.',
    en: 'Australian wholemeal from wheat softer and lower in protein than the North American equivalent. Running American wholemeal recipes on it calls for less water, not more — the reverse of the usual correction, and exactly the kind of difference this site exists for.',
  },
  'au-stoneground-wholemeal': {
    nl: 'Steengemalen Australisch volkoren. De combinatie van zacht graan en steenmaling geeft opvallend weinig beschadigd zetmeel, en dus een van de laagste wateropnames van alle volkorenmelen hier. Geef het toch een lange autolyse: de zemelen hebben tijd nodig, ook als het totale watergehalte laag is.',
    en: 'Stone-ground Australian wholemeal. The combination of soft grain and stone milling gives strikingly little damaged starch, and therefore one of the lowest absorptions of any wholemeal here. Give it a long autolyse anyway: the bran needs time even when the total water is low.',
  },
  'au-spelt-wholemeal': {
    nl: 'Volkoren spelt uit Australische molens, doorgaans op steen gemalen. Iets lager in eiwit dan Europese spelt, wat het draagvermogen niet verbetert maar het deeg wel voorspelbaarder maakt — je hebt iets meer tijd voordat het van ontwikkeld naar kapot gaat. Nog steeds: minder vouwen, kortere bulk, busvorm bij hoge percentages.',
    en: 'Whole spelt from Australian mills, usually stone-milled. Slightly lower in protein than European spelt, which does not improve the carrying capacity but does make the dough more predictable — you get a little more time before it goes from developed to destroyed. Still: fewer folds, shorter bulk, a tin at high percentages.',
  },
};
