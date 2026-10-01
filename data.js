/* =====================================================================
   data.js — Données du site « Nature & Moi »
   - 16 espèces de la faune de Belgique
   - Aires de répartition mondiales : codes ISO 3166-1 numériques des pays
     (approximation au niveau du pays, à vérifier avec GBIF ou l'UICN)
   - Présence en Belgique : 0 = absente, 1 = rare, 2 = peu fréquente,
     3 = fréquente, 4 = très fréquente
   - « clip » : nom anglais utilisé par l'IA pour reconnaître l'espèce
   - « credit » : à compléter pour chaque photo (auteur, licence, source)
   ===================================================================== */

export const CATEGORIES = [
  { id: "mammiferes", nom: "Mammifères" },
  { id: "oiseaux", nom: "Oiseaux" },
  { id: "insectes", nom: "Insectes et arachnides" },
  { id: "reptiles", nom: "Amphibiens et reptiles" },
  { id: "poissons", nom: "Poissons" }
];

export const PRESENCE = ["Absente", "Rare", "Peu fréquente", "Fréquente", "Très fréquente"];

/* ---------- Groupes de pays (pour éviter de tout répéter) ---------- */
const EUROPE_OUEST = ["056", "250", "528", "442", "276", "756", "040", "826", "372"];
const EUROPE_NORD = ["208", "578", "752", "246", "233", "428", "440"];
const EUROPE_SUD = ["724", "620", "380", "300", "705", "191", "070", "688", "499", "807", "008"];
const EUROPE_EST = ["616", "203", "703", "348", "642", "100", "112", "804", "498"];
const EUROPE = [...EUROPE_OUEST, ...EUROPE_NORD, ...EUROPE_SUD, ...EUROPE_EST];
const EURASIE_OUEST = ["643", "792", "268", "051", "031"]; // Russie, Turquie, Caucase
const AFRIQUE_NORD = ["504", "012", "788", "434", "818"];
const PROCHE_ORIENT = ["376", "422", "760", "368", "364", "400", "682"];
const ASIE_CENTRALE = ["398", "860", "795", "417", "762", "004"];
const ASIE_EST = ["156", "496", "392", "410", "408"];
const ASIE_SUD = ["356", "586", "524", "064", "050", "144"];
const ASIE_SE = ["764", "704", "104", "418", "116", "458", "360", "608"];
const AMERIQUE_NORD = ["840", "124", "484"];
const AFRIQUE_SUB = ["478", "686", "466", "562", "566", "148", "729", "231", "404", "834", "180",
  "024", "894", "716", "508", "710", "516", "072", "450", "288", "120", "800", "706"];
const sans = (liste, ...retirer) => liste.filter((c) => !retirer.includes(c));

/* ---------- Les espèces ---------- */
export const ANIMAUX = [
  {
    id: "renard-roux", nom: "Renard roux", scientifique: "Vulpes vulpes", categorie: "mammiferes",
    clip: "a red fox",
    description: "Canidé au pelage roux, au ventre blanc et à la queue touffue terminée de blanc. Discret et très adaptable, il vit aussi bien en forêt qu'à la campagne ou en ville.",
    habitat: "Forêts, campagnes, parcs, zones urbaines", alimentation: "Omnivore : petits rongeurs, insectes, fruits, vers de terre",
    taille: "60 à 90 cm (queue non comprise)", poids: "4 à 8 kg", activite: "Crépusculaire et nocturne",
    belgique: { texte: "Présent dans tout le pays, y compris dans les villes et les jardins.", wallonie: 4, flandre: 3, bruxelles: 3, periode: "Toute l'année, surtout à l'aube et au crépuscule." },
    saviezVous: "Le renard entend un rongeur qui gratte sous la neige et plonge dessus pour l'attraper.",
    aire: { naturelle: [...EUROPE, ...EURASIE_OUEST, ...AFRIQUE_NORD, ...PROCHE_ORIENT, ...ASIE_CENTRALE, ...ASIE_EST, "356", "586", "524", "064", "840", "124"], occasionnelle: [], introduite: ["036"] },
    image: "images/renard-roux.jpg", alt: "Renard roux debout dans l'herbe, pelage orange et queue touffue", credit: ""
  },
  {
    id: "chevreuil", nom: "Chevreuil", scientifique: "Capreolus capreolus", categorie: "mammiferes",
    clip: "a roe deer",
    description: "Petit cervidé élancé, brun-roux en été et plus gris en hiver, avec une tache blanche sur l'arrière-train. Seuls les mâles portent des bois.",
    habitat: "Forêts, lisières, bocages, prairies", alimentation: "Herbivore : feuilles, bourgeons, herbes, ronces, glands",
    taille: "1 à 1,3 m de long", poids: "15 à 30 kg", activite: "Crépusculaire",
    belgique: { texte: "Très présent dans les grandes forêts, notamment en Ardenne. Plus rare en Flandre et à Bruxelles.", wallonie: 4, flandre: 2, bruxelles: 1, periode: "Toute l'année, à l'aube et au crépuscule, en lisière de forêt." },
    saviezVous: "Les bois du mâle tombent chaque année, puis repoussent.",
    aire: { naturelle: [...sans(EUROPE_OUEST, "372"), ...EUROPE_NORD, ...EUROPE_SUD, ...EUROPE_EST, ...EURASIE_OUEST], occasionnelle: [], introduite: [] },
    image: "images/chevreuil.jpg", alt: "Chevreuil à la lisière d'une forêt, pelage brun-roux", credit: ""
  },
  {
    id: "herisson", nom: "Hérisson d'Europe", scientifique: "Erinaceus europaeus", categorie: "mammiferes",
    clip: "a hedgehog",
    description: "Petit mammifère recouvert de milliers de piquants. Quand il est inquiet, il se roule en boule pour se protéger.",
    habitat: "Jardins, haies, lisières, parcs", alimentation: "Insectivore : insectes, limaces, vers, escargots",
    taille: "20 à 30 cm", poids: "0,6 à 1,2 kg", activite: "Nocturne ; hiberne en hiver",
    belgique: { texte: "Présent partout, surtout dans les jardins avec haies et coins sauvages.", wallonie: 3, flandre: 3, bruxelles: 3, periode: "De mars à octobre, le soir et la nuit. Il hiberne en hiver." },
    saviezVous: "Il peut parcourir un à deux kilomètres en une seule nuit.",
    aire: { naturelle: [...EUROPE_OUEST, ...EUROPE_NORD, "724", "620", "380", "616", "203", "703", "705"], occasionnelle: [], introduite: ["554"] },
    image: "images/herisson.jpg", alt: "Hérisson marchant dans l'herbe, dos couvert de piquants", credit: ""
  },
  {
    id: "ecureuil-roux", nom: "Écureuil roux", scientifique: "Sciurus vulgaris", categorie: "mammiferes",
    clip: "a red squirrel",
    description: "Petit rongeur des arbres à la queue touffue et aux oreilles ornées de pinceaux de poils. Son pelage va du roux au brun, avec le ventre blanc.",
    habitat: "Forêts de feuillus et de conifères, grands parcs", alimentation: "Graines, noisettes, noix, champignons, bourgeons",
    taille: "20 à 25 cm (queue non comprise)", poids: "250 à 450 g", activite: "Diurne",
    belgique: { texte: "Présent là où il y a des arbres : forêts, grands parcs et jardins boisés.", wallonie: 3, flandre: 3, bruxelles: 2, periode: "Toute l'année, surtout le matin et en fin d'après-midi." },
    saviezVous: "Il enterre des noisettes et des glands, puis en oublie souvent : certains arbres poussent grâce à lui.",
    aire: { naturelle: [...EUROPE, ...EURASIE_OUEST, "398", "496", "156", "392", "410", "408"], occasionnelle: [], introduite: [] },
    image: "images/ecureuil-roux.jpg", alt: "Écureuil roux dans un arbre, queue touffue relevée", credit: ""
  },
  {
    id: "mesange-bleue", nom: "Mésange bleue", scientifique: "Cyanistes caeruleus", categorie: "oiseaux",
    clip: "a blue tit bird",
    description: "Petit oiseau très commun, reconnaissable à son plumage bleu, jaune et blanc. Elle est souvent observée dans les jardins, les parcs et les forêts.",
    habitat: "Jardins, forêts, parcs", alimentation: "Insectes, graines, fruits",
    taille: "10 à 12 cm", poids: "9 à 12 g", activite: "Diurne",
    belgique: { texte: "Présente dans tout le pays, plus fréquente en Wallonie.", wallonie: 4, flandre: 4, bruxelles: 3, periode: "Toute l'année, surtout aux mangeoires en hiver." },
    saviezVous: "Pour nourrir ses petits, un couple fait des centaines d'allers-retours par jour.",
    aire: { naturelle: [...EUROPE, ...EURASIE_OUEST, "376", "422", "760", "368", "364", "504", "012", "788"], occasionnelle: ["352"], introduite: [] },
    image: "images/mesange-bleue.jpg", alt: "Mésange bleue posée sur une branche, plumage bleu et jaune", credit: ""
  },
  {
    id: "rouge-gorge", nom: "Rouge-gorge", scientifique: "Erithacus rubecula", categorie: "oiseaux",
    clip: "a European robin bird",
    description: "Petit oiseau rond à la poitrine orange, au dos brun-olive et au ventre blanc. Très territorial, il chante même en hiver.",
    habitat: "Forêts, haies, jardins, parcs", alimentation: "Insectes, vers, baies, graines",
    taille: "12 à 14 cm", poids: "15 à 22 g", activite: "Diurne",
    belgique: { texte: "Très courant dans les jardins, les parcs et les bois de tout le pays.", wallonie: 4, flandre: 4, bruxelles: 4, periode: "Toute l'année. Il est très visible en automne et en hiver." },
    saviezVous: "Les jeunes n'ont pas de poitrine orange : ils sont tachetés de brun.",
    aire: { naturelle: [...EUROPE, ...EURASIE_OUEST, "504", "012", "788"], occasionnelle: ["352", "434", "818", "376", "422", "760", "368", "364", "400", "682"], introduite: [] },
    image: "images/rouge-gorge.jpg", alt: "Rouge-gorge posé sur une branche, poitrine orange", credit: ""
  },
  {
    id: "heron-cendre", nom: "Héron cendré", scientifique: "Ardea cinerea", categorie: "oiseaux",
    clip: "a grey heron bird",
    description: "Grand échassier gris au long cou et au bec pointu. Il pêche en restant immobile au bord de l'eau.",
    habitat: "Rivières, étangs, marais, prairies humides", alimentation: "Poissons, grenouilles, petits rongeurs, insectes aquatiques",
    taille: "90 à 100 cm de haut", poids: "1 à 2 kg", activite: "Diurne",
    belgique: { texte: "Présent près des cours d'eau, des étangs et des canaux, parfois dans les jardins avec bassin.", wallonie: 3, flandre: 3, bruxelles: 2, periode: "Toute l'année, au bord de l'eau." },
    saviezVous: "En vol, il replie son cou en S, alors que les cigognes et les grues le tendent.",
    aire: { naturelle: [...EUROPE, ...EURASIE_OUEST, ...AFRIQUE_NORD, ...PROCHE_ORIENT, ...ASIE_CENTRALE, ...ASIE_SUD, ...ASIE_SE, "156", "392", "410", "408", ...AFRIQUE_SUB], occasionnelle: ["352"], introduite: [] },
    image: "images/heron-cendre.jpg", alt: "Héron cendré debout au bord de l'eau, cou allongé", credit: ""
  },
  {
    id: "canard-colvert", nom: "Canard colvert", scientifique: "Anas platyrhynchos", categorie: "oiseaux",
    clip: "a mallard duck",
    description: "Le mâle a la tête vert brillant et un collier blanc. La femelle, brune et tachetée, est bien camouflée.",
    habitat: "Étangs, rivières, lacs, mares de parcs", alimentation: "Plantes aquatiques, graines, insectes, petits invertébrés",
    taille: "50 à 65 cm", poids: "0,9 à 1,5 kg", activite: "Diurne",
    belgique: { texte: "Présent sur presque tous les plans d'eau du pays.", wallonie: 4, flandre: 4, bruxelles: 4, periode: "Toute l'année." },
    saviezVous: "Le colvert est l'ancêtre de la plupart des canards domestiques.",
    aire: { naturelle: [...EUROPE, "352", ...EURASIE_OUEST, ...AFRIQUE_NORD, ...PROCHE_ORIENT, ...ASIE_CENTRALE, ...ASIE_EST, ...ASIE_SUD, ...AMERIQUE_NORD], occasionnelle: [...ASIE_SE], introduite: ["036", "554", "710"] },
    image: "images/canard-colvert.jpg", alt: "Canard colvert mâle sur l'eau, tête verte et collier blanc", credit: ""
  },
  {
    id: "coccinelle", nom: "Coccinelle à sept points", scientifique: "Coccinella septempunctata", categorie: "insectes",
    clip: "a seven-spot ladybird",
    description: "Petit coléoptère rouge à sept points noirs. Attention : d'autres coccinelles, comme l'arlequine, peuvent lui ressembler.",
    habitat: "Prairies, jardins, haies, potagers", alimentation: "Carnivore : surtout des pucerons",
    taille: "5 à 8 mm", poids: "Moins de 0,1 g", activite: "Diurne ; hiberne en groupe",
    belgique: { texte: "Courante dans les jardins et les prairies, mais concurrencée par la coccinelle asiatique.", wallonie: 3, flandre: 3, bruxelles: 3, periode: "D'avril à octobre." },
    saviezVous: "Une coccinelle peut manger plusieurs dizaines de pucerons par jour.",
    aire: { naturelle: [...EUROPE, ...EURASIE_OUEST, ...AFRIQUE_NORD, ...PROCHE_ORIENT, ...ASIE_CENTRALE, ...ASIE_EST, ...ASIE_SUD], occasionnelle: [], introduite: ["840", "124"] },
    image: "images/coccinelle.jpg", alt: "Coccinelle rouge à points noirs posée sur une feuille", credit: ""
  },
  {
    id: "abeille", nom: "Abeille mellifère", scientifique: "Apis mellifera", categorie: "insectes",
    clip: "a honey bee",
    description: "Insecte social qui vit en colonie. Son corps brun-orangé est rayé de noir. Elle pollinise de nombreuses fleurs et cultures.",
    habitat: "Ruches, cavités d'arbres ; elle butine dans les jardins, prairies et vergers", alimentation: "Nectar et pollen",
    taille: "12 à 15 mm", poids: "Environ 0,1 g", activite: "Diurne, par beau temps",
    belgique: { texte: "Présente partout, surtout grâce aux ruches des apiculteurs, y compris en ville.", wallonie: 3, flandre: 3, bruxelles: 3, periode: "D'avril à septembre." },
    saviezVous: "Une ouvrière produit environ une douzième de cuillère à café de miel dans toute sa vie.",
    aire: { naturelle: [...EUROPE, "643", "792", "268", "051", "031", ...AFRIQUE_NORD, ...AFRIQUE_SUB, ...PROCHE_ORIENT], occasionnelle: [], introduite: [...AMERIQUE_NORD, "076", "152", "032", "036", "554", ...ASIE_EST, ...ASIE_SUD, ...ASIE_CENTRALE] },
    image: "images/abeille.jpg", alt: "Abeille sur une fleur, corps rayé et pattes chargées de pollen", credit: ""
  },
  {
    id: "paon-du-jour", nom: "Paon-du-jour", scientifique: "Aglais io", categorie: "insectes",
    clip: "a peacock butterfly",
    description: "Papillon aux ailes rouge-brun ornées de quatre grands « yeux » qui effraient les prédateurs. Le dessous de ses ailes, sombre, le camoufle comme une feuille morte.",
    habitat: "Jardins, lisières, prairies fleuries, bords de chemins", alimentation: "Nectar (adulte) ; orties (chenille)",
    taille: "5 à 6 cm d'envergure", poids: "Moins de 1 g", activite: "Diurne ; hiberne à l'état adulte",
    belgique: { texte: "Très répandu dans les jardins fleuris, notamment sur les buddleias.", wallonie: 3, flandre: 3, bruxelles: 3, periode: "De mars à octobre." },
    saviezVous: "Menacé, il ouvre les ailes d'un coup et peut produire un sifflement en les frottant.",
    aire: { naturelle: [...EUROPE, "643", "792", "268", "051", "031", "398", "496", "156", "392", "410", "408"], occasionnelle: [], introduite: [] },
    image: "images/paon-du-jour.jpg", alt: "Paon-du-jour aux ailes ouvertes montrant quatre grandes taches en forme d'yeux", credit: ""
  },
  {
    id: "grenouille-rousse", nom: "Grenouille rousse", scientifique: "Rana temporaria", categorie: "reptiles",
    clip: "a common frog",
    description: "Grenouille brun-roux ou olive, avec une tache sombre derrière l'œil. Elle vit surtout à terre et ne retourne à l'eau que pour se reproduire.",
    habitat: "Prairies humides, forêts, jardins, mares", alimentation: "Insectes, limaces, vers, escargots",
    taille: "6 à 10 cm", poids: "20 à 30 g", activite: "Crépusculaire et nocturne ; hiberne en hiver",
    belgique: { texte: "Présente dans tout le pays, là où il reste des mares et des milieux humides.", wallonie: 3, flandre: 3, bruxelles: 2, periode: "Février-mars pour la reproduction dans les mares, puis sur les sentiers humides au printemps et en été." },
    saviezVous: "Une femelle pond des milliers d'œufs dans un seul amas gélatineux.",
    aire: { naturelle: [...EUROPE_OUEST, ...EUROPE_NORD, ...EUROPE_EST, "724", "380", "705", "191", "070", "688", "499", "643"], occasionnelle: [], introduite: [] },
    image: "images/grenouille-rousse.jpg", alt: "Grenouille rousse dans l'herbe humide, tache sombre derrière l'œil", credit: ""
  },
  {
    id: "lezard-des-murailles", nom: "Lézard des murailles", scientifique: "Podarcis muralis", categorie: "reptiles",
    clip: "a wall lizard",
    description: "Lézard svelte, gris-brun tacheté, à la longue queue. Il adore se chauffer au soleil sur les murs et les rochers.",
    habitat: "Murs de pierre, rochers, talus ensoleillés, voies ferrées", alimentation: "Insectes, araignées, vers",
    taille: "15 à 20 cm (queue comprise)", poids: "4 à 8 g", activite: "Diurne",
    belgique: { texte: "Surtout présent en Wallonie, dans les vallées ensoleillées comme celle de la Meuse. Rare ailleurs.", wallonie: 3, flandre: 1, bruxelles: 1, periode: "De mars à octobre, aux heures ensoleillées." },
    saviezVous: "Il peut perdre sa queue pour échapper à un prédateur ; elle repousse en partie.",
    aire: { naturelle: ["056", "250", "528", "442", "276", "756", "040", "724", "380", "705", "191", "070", "688", "499", "807", "008", "300", "100", "642", "348", "703", "203", "792"], occasionnelle: [], introduite: ["826", "840", "124"] },
    image: "images/lezard-des-murailles.jpg", alt: "Lézard des murailles posé sur une pierre au soleil", credit: ""
  },
  {
    id: "couleuvre-helvetique", nom: "Couleuvre helvétique", scientifique: "Natrix helvetica", categorie: "reptiles",
    clip: "a grass snake",
    description: "Serpent inoffensif, vert-olive à gris, au collier clair souvent visible. Excellente nageuse, elle chasse près de l'eau.",
    habitat: "Bords d'étangs et de rivières, zones humides, prairies", alimentation: "Amphibiens, poissons, petits rongeurs",
    taille: "80 cm à 1,2 m", poids: "Quelques centaines de grammes", activite: "Diurne ; hiberne en hiver",
    belgique: { texte: "Espèce discrète et protégée, présente près des milieux humides. Observation peu fréquente.", wallonie: 2, flandre: 2, bruxelles: 1, periode: "D'avril à septembre, par temps chaud et ensoleillé." },
    saviezVous: "Si elle se sent en danger, elle peut faire la morte ou libérer une odeur désagréable.",
    aire: { naturelle: ["250", "056", "442", "276", "756", "826", "380"], occasionnelle: [], introduite: [] },
    image: "images/couleuvre-helvetique.jpg", alt: "Couleuvre helvétique enroulée dans l'herbe, collier clair derrière la tête", credit: ""
  },
  {
    id: "brochet", nom: "Brochet", scientifique: "Esox lucius", categorie: "poissons",
    clip: "a northern pike fish",
    description: "Poisson allongé à la tête plate en bec de canard et aux mâchoires pleines de dents. Sa robe verte tachetée le camoufle dans les plantes.",
    habitat: "Eaux calmes avec végétation : étangs, lacs, rivières lentes, canaux", alimentation: "Carnivore : poissons, grenouilles, parfois oiseaux d'eau",
    taille: "50 cm à 1 m", poids: "1 à 10 kg", activite: "Diurne ; chasse à l'affût",
    belgique: { texte: "Présent dans les rivières, les canaux et les étangs. Difficile à voir sans eau claire.", wallonie: 3, flandre: 3, bruxelles: 1, periode: "Toute l'année ; il se reproduit de février à avril dans les zones inondées." },
    saviezVous: "Il reste immobile des minutes entières, puis se jette sur sa proie à grande vitesse.",
    aire: { naturelle: [...sans(EUROPE_OUEST, "372"), ...EUROPE_NORD, ...EUROPE_EST, "705", "191", "070", "688", "499", "807", "008", "300", "643", "792", "268", "051", "031", "398", "496", "156", "840", "124"], occasionnelle: [], introduite: ["724", "620", "372"] },
    image: "images/brochet.jpg", alt: "Brochet dans l'eau claire, corps allongé vert tacheté", credit: ""
  },
  {
    id: "truite-fario", nom: "Truite fario", scientifique: "Salmo trutta", categorie: "poissons",
    clip: "a brown trout fish",
    description: "Poisson fuselé aux flancs ponctués de points noirs et rouges. Elle vit dans les eaux fraîches, claires et bien oxygénées.",
    habitat: "Ruisseaux et rivières fraîches, surtout en Ardenne", alimentation: "Insectes aquatiques, larves, petits poissons, crustacés",
    taille: "25 à 50 cm", poids: "0,3 à 2 kg", activite: "Crépusculaire",
    belgique: { texte: "Présente dans les cours d'eau frais du sud du pays. Très rare en Flandre.", wallonie: 3, flandre: 1, bruxelles: 0, periode: "De mars à septembre, dans les eaux claires." },
    saviezVous: "Sa présence est un bon indicateur de la bonne qualité d'une rivière.",
    aire: { naturelle: [...EUROPE, "352", ...EURASIE_OUEST, "504", "012"], occasionnelle: [], introduite: ["840", "124", "036", "554", "710", "152", "032", "392", "356", "404"] },
    image: "images/truite-fario.jpg", alt: "Truite fario dans l'eau claire, flancs ponctués de points rouges et noirs", credit: ""
  }
];