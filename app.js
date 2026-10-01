/* =====================================================================
   app.js — Logique du site « Nature & Moi »
   1. Outils          4. Favoris           7. Carte du monde
   2. Réglages        5. Navigation        8. Identification (photo)
   3. Listes          6. Fiche animal
   ===================================================================== */

import { ANIMAUX, CATEGORIES, PRESENCE } from "./data.js";
import { identifier } from "./ia.js";

/* ---------- 1. Outils ---------- */
const $ = (sel, racine = document) => racine.querySelector(sel);
const parId = (id) => ANIMAUX.find((a) => a.id === id);
const nomCategorie = (id) => CATEGORIES.find((c) => c.id === id)?.nom ?? "";
const pct = (x) => `${Math.round(x * 100)} %`;
const normaliser = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const annoncer = (texte) => { $("#annonces").textContent = texte; };

// Lecture / écriture sécurisées (le stockage peut être indisponible)
function lire(cle, defaut) {
  try { return JSON.parse(localStorage.getItem(cle)) ?? defaut; } catch { return defaut; }
}
function ecrire(cle, valeur) {
  try { localStorage.setItem(cle, JSON.stringify(valeur)); } catch { /* ignoré */ }
}

// Si une photo d'animal est introuvable, on masque l'image sans casser la mise en page
document.addEventListener("error", (e) => {
  if (e.target.tagName === "IMG" && e.target.id !== "apercu") e.target.style.visibility = "hidden";
}, true);

/* ---------- 2. Réglages d'accessibilité ---------- */
const TAILLES = { "-1": "Petite", "0": "Normale", "1": "Grande", "2": "Très grande" };
const DEFAUT = { taille: 0, contraste: false, animations: false };
let reglages = { ...DEFAUT, ...lire("nm-reglages", {}) };

function appliquerReglages() {
  const html = document.documentElement;
  html.dataset.taille = reglages.taille;
  html.dataset.contraste = reglages.contraste ? "eleve" : "normal";
  html.dataset.animations = reglages.animations ? "reduites" : "normales";
  $("#taille-valeur").textContent = TAILLES[reglages.taille];
  $("#contraste").checked = reglages.contraste;
  $("#animations").checked = reglages.animations;
  ecrire("nm-reglages", reglages);
}

function initReglages() {
  $("#taille-moins").addEventListener("click", () => { reglages.taille = Math.max(-1, reglages.taille - 1); appliquerReglages(); });
  $("#taille-plus").addEventListener("click", () => { reglages.taille = Math.min(2, reglages.taille + 1); appliquerReglages(); });
  $("#contraste").addEventListener("change", (e) => { reglages.contraste = e.target.checked; appliquerReglages(); });
  $("#animations").addEventListener("change", (e) => { reglages.animations = e.target.checked; appliquerReglages(); });
  $("#reinitialiser").addEventListener("click", () => { reglages = { ...DEFAUT }; appliquerReglages(); annoncer("Réglages rétablis."); });
  appliquerReglages();
}

/* ---------- 3. Listes d'animaux (explorer et favoris) ---------- */
const carte = (a) => `
  <li class="carte-animal">
    <a href="#animal/${a.id}">
      <img src="${a.image}" alt="" loading="lazy">
      <span class="nom">${a.nom}</span>
      <span class="cat">${nomCategorie(a.categorie)}</span>
    </a>
  </li>`;

let filtre = "tous";

function creerFiltres() {
  $("#filtres").innerHTML = [{ id: "tous", nom: "Tous" }, ...CATEGORIES]
    .map((c) => `<button type="button" data-cat="${c.id}">${c.nom}</button>`).join("");
  $("#compteur").setAttribute("role", "status");
}

function majFiltres() {
  document.querySelectorAll("#filtres button").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.cat === filtre));
  });
}

function rendreListe() {
  const terme = normaliser($("#recherche").value.trim());
  const liste = ANIMAUX.filter((a) =>
    (filtre === "tous" || a.categorie === filtre) &&
    normaliser(`${a.nom} ${a.scientifique}`).includes(terme));
  $("#liste").innerHTML = liste.map(carte).join("");
  $("#compteur").textContent = liste.length === 0
    ? "Aucun animal ne correspond à votre recherche."
    : `${liste.length} ${liste.length > 1 ? "animaux affichés" : "animal affiché"}`;
}

function initExplorer() {
  creerFiltres();
  $("#filtres").addEventListener("click", (e) => {
    const bouton = e.target.closest("button");
    if (!bouton) return;
    filtre = bouton.dataset.cat;
    majFiltres();
    rendreListe();
  });
  $("#recherche").addEventListener("input", rendreListe);
}

/* ---------- 4. Favoris ---------- */
let favoris = lire("nm-favoris", []);
const estFavori = (id) => favoris.includes(id);

function basculerFavori(id) {
  favoris = estFavori(id) ? favoris.filter((f) => f !== id) : [...favoris, id];
  ecrire("nm-favoris", favoris);
  annoncer(estFavori(id) ? `${parId(id).nom} ajouté aux favoris.` : `${parId(id).nom} retiré des favoris.`);
}

function rendreFavoris() {
  const liste = ANIMAUX.filter((a) => estFavori(a.id));
  $("#liste-favoris").innerHTML = liste.map(carte).join("");
  $("#favoris-vide").hidden = liste.length > 0;
}

/* ---------- 5. Navigation (une seule page, vues selon l'adresse #...) ---------- */
const VUES = ["accueil", "explorer", "animal", "favoris", "accessibilite"];
const TITRES = { accueil: "Accueil", explorer: "Explorer les animaux", favoris: "Mes favoris", accessibilite: "Accessibilité" };

function naviguer(premiereFois = false) {
  const [nom, param] = location.hash.slice(1).split("/");
  const vue = VUES.includes(nom) ? nom : "accueil";
  let titre = TITRES[vue];

  VUES.forEach((v) => { $(`#vue-${v}`).hidden = v !== vue; });
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const actif = a.dataset.nav === (vue === "animal" ? "explorer" : vue);
    if (actif) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  });

  if (vue === "explorer") {
    filtre = CATEGORIES.some((c) => c.id === param) ? param : "tous";
    majFiltres();
    rendreListe();
  }
  if (vue === "favoris") rendreFavoris();
  if (vue === "animal") {
    const animal = parId(param);
    rendreFiche(animal);
    if (animal) titre = animal.nom;
    else titre = "Animal introuvable";
  }

  document.title = `${titre} — Nature & Moi`;
  if (!premiereFois) {
    window.scrollTo(0, 0);
    $(`#vue-${vue} h1`)?.focus({ preventScroll: true });
  }
}

/* ---------- 6. Fiche animal ---------- */
const REGIONS = [["Wallonie", "wallonie"], ["Flandre", "flandre"], ["Bruxelles", "bruxelles"]];
const points = (n) =>
  `<span class="points" aria-hidden="true">${[1, 2, 3, 4].map((i) => `<span class="${i <= n ? "plein" : ""}"></span>`).join("")}</span>`;
const texteFavori = (id) => (estFavori(id) ? "Retirer des favoris" : "Ajouter aux favoris");

function rendreFiche(a) {
  const fiche = $("#fiche");
  if (!a) {
    fiche.innerHTML = `<h1 tabindex="-1">Animal introuvable</h1><p>Cet animal n'existe pas dans la liste. <a href="#explorer">Parcourir tous les animaux</a>.</p>`;
    return;
  }
  const b = a.belgique;
  fiche.innerHTML = `
    <img class="fiche-photo" src="${a.image}" alt="${a.alt}">
    ${a.credit ? `<p class="credit">Photo : ${a.credit}</p>` : ""}
    <div class="fiche-entete">
      <div>
        <h1 tabindex="-1">${a.nom}</h1>
        <p class="scientifique">${a.scientifique} — ${nomCategorie(a.categorie)}</p>
      </div>
      <button type="button" class="btn btn-clair" data-fav="${a.id}">${texteFavori(a.id)}</button>
    </div>

    <h2>Description</h2>
    <p>${a.description}</p>

    <h2>Caractéristiques</h2>
    <dl class="caracteristiques">
      <dt>Habitat</dt><dd>${a.habitat}</dd>
      <dt>Alimentation</dt><dd>${a.alimentation}</dd>
      <dt>Taille</dt><dd>${a.taille}</dd>
      <dt>Poids</dt><dd>${a.poids}</dd>
      <dt>Activité</dt><dd>${a.activite}</dd>
    </dl>

    <h2>En Belgique</h2>
    <p>${b.texte}</p>
    <ul class="presence">
      ${REGIONS.map(([nom, cle]) => `<li><strong>${nom}</strong>${points(b[cle])}<span>${PRESENCE[b[cle]]}</span></li>`).join("")}
    </ul>
    <p><strong>Où et quand l'observer :</strong> ${b.periode}</p>

    <h2>Où vit cet animal dans le monde ?</h2>
    <p id="carte-statut" class="note">Chargement de la carte…</p>
    <div id="carte-zone" class="carte-monde" hidden></div>
    <div id="carte-legende"></div>
    <div id="carte-liste"></div>

    <h2>Le saviez-vous ?</h2>
    <div class="saviez-vous"><p>${a.saviezVous}</p></div>`;
  afficherCarte(a);
}

function initFiche() {
  $("#fiche").addEventListener("click", (e) => {
    const bouton = e.target.closest("[data-fav]");
    if (!bouton) return;
    basculerFavori(bouton.dataset.fav);
    bouton.textContent = texteFavori(bouton.dataset.fav);
  });
}

/* ---------- 7. Carte du monde (D3 + TopoJSON) ---------- */
const URL_MONDE = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
let monde = null; // les données sont téléchargées une seule fois

function chargerMonde() {
  monde ??= fetch(URL_MONDE)
    .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then((topo) => topojson.feature(topo, topo.objects.countries).features)
    .catch((erreur) => { monde = null; throw erreur; });
  return monde;
}

async function afficherCarte(a) {
  const zone = $("#carte-zone");
  const statut = $("#carte-statut");
  try {
    const pays = await chargerMonde();
    if (!zone.isConnected) return; // l'utilisateur a changé de fiche entre-temps

    const nat = new Set(a.aire.naturelle);
    const occ = new Set(a.aire.occasionnelle);
    const int = new Set(a.aire.introduite);
    const trace = d3.geoPath(d3.geoNaturalEarth1().fitSize([960, 500], { type: "Sphere" }));
    const noms = { nat: [], occ: [], int: [] };

    const chemins = pays.map((f) => {
      const id = String(f.id).padStart(3, "0");
      const type = nat.has(id) ? "nat" : occ.has(id) ? "occ" : int.has(id) ? "int" : null;
      if (type) noms[type].push(f.properties.name);
      return `<path class="pays${type ? ` pays-${type}` : ""}" d="${trace(f)}"/>`;
    }).join("");

    // Motifs (rayures, points) : l'information ne dépend pas que de la couleur
    zone.innerHTML = `
      <svg viewBox="0 0 960 500" role="img" aria-label="Carte du monde des zones où vit : ${a.nom}. La liste des pays est disponible sous la carte.">
        <defs>
          <pattern id="motif-occ" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#fff"/><rect width="3" height="6" fill="#8a6d1f"/>
          </pattern>
          <pattern id="motif-int" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="#fff"/><circle cx="3" cy="3" r="1.8" fill="#a23b2a"/>
          </pattern>
        </defs>
        ${chemins}
      </svg>`;

    const types = [["nat", "Présence naturelle"], ["occ", "Présence occasionnelle"], ["int", "Introduite par l'humain"]]
      .filter(([cle]) => noms[cle].length);
    $("#carte-legende").innerHTML = `<ul class="legende">${types.map(([cle, t]) => `<li><i class="leg-${cle}"></i>${t}</li>`).join("")}</ul>`;
    $("#carte-liste").innerHTML = `
      <details>
        <summary>Liste des pays en texte</summary>
        ${types.map(([cle, t]) => `<p><strong>${t} :</strong> <span lang="en">${noms[cle].sort().join(", ")}</span></p>`).join("")}
        <p class="note">Noms des pays en anglais. Carte simplifiée : chaque pays est coloré en entier, même si l'animal n'en occupe qu'une partie.</p>
      </details>`;
    zone.hidden = false;
    statut.hidden = true;
  } catch {
    statut.textContent = "La carte n'a pas pu être chargée. Vérifiez votre connexion puis rechargez la page.";
  }
}

/* ---------- 8. Identification par photo ---------- */
let enCours = false;
let urlApercu = null;

function montrerErreur(message) {
  const e = $("#erreur");
  e.textContent = message;
  e.hidden = false;
}

function rendreResultat({ statut, propositions }) {
  const [premier, ...autres] = propositions;
  const liens = (liste) => `<ul class="alternatives">${liste
    .map((p) => `<li><a href="#animal/${p.animal.id}">${p.animal.nom}</a> (${pct(p.score)})</li>`).join("")}</ul>`;
  let html;

  if (statut === "ok") {
    const a = premier.animal;
    html = `
      <div class="resultat-principal">
        <h3>${a.nom}</h3>
        <span class="confiance">Confiance : ${pct(premier.score)}</span>
      </div>
      <p class="scientifique">${a.scientifique} — ${nomCategorie(a.categorie)}</p>
      <p>${a.description}</p>
      <p><a class="btn" href="#animal/${a.id}">Voir la fiche</a></p>`;
    const alternatives = autres.filter((p) => p.score >= 0.05);
    if (alternatives.length) html += `<p>Autres possibilités :</p>${liens(alternatives)}`;
    annoncer(`Résultat : ${a.nom}, confiance ${pct(premier.score)}.`);
  } else if (statut === "incertain") {
    html = `<p>Je ne suis pas sûr de l'identification. Voici les espèces les plus proches :</p>${liens(propositions)}`;
    annoncer("Identification incertaine. Plusieurs espèces proposées.");
  } else {
    html = `<p>Aucun des animaux que je connais n'a été reconnu sur cette photo. Ce site ne couvre que ${ANIMAUX.length} espèces de Belgique.</p>`;
    annoncer("Aucun animal reconnu sur cette photo.");
  }

  html += `<p class="note">Suggestion automatique, qui peut se tromper : vérifiez avec la fiche.</p>
           <p><a href="#explorer">Parcourir tous les animaux</a></p>`;
  $("#resultat-contenu").innerHTML = html;
}

async function analyser(fichier) {
  $("#erreur").hidden = true;
  if (!fichier || enCours) return;
  if (!fichier.type.startsWith("image/")) {
    montrerErreur("Ce fichier n'est pas une image. Choisissez une photo (JPG, PNG…).");
    return;
  }

  enCours = true;
  if (urlApercu) URL.revokeObjectURL(urlApercu);
  urlApercu = URL.createObjectURL(fichier);
  $("#apercu").src = urlApercu;
  $("#resultat").hidden = true;
  $("#analyse").hidden = false;
  const barre = $("#progression");
  barre.hidden = false;
  barre.removeAttribute("value"); // barre indéterminée
  $("#statut").textContent = "Chargement du modèle d'identification (une seule fois, patientez)…";
  annoncer("Analyse en cours. Cela peut prendre quelques instants.");

  try {
    const resultat = await identifier(urlApercu, (p) => {
      if (p < 100) {
        barre.value = p;
        $("#statut").textContent = `Chargement du modèle d'identification : ${p} %`;
      } else {
        barre.removeAttribute("value");
        $("#statut").textContent = "Analyse de la photo…";
      }
    });
    barre.hidden = true;
    $("#statut").textContent = "Analyse terminée.";
    rendreResultat(resultat);
    $("#resultat").hidden = false;
    const titre = $("#resultat h2");
    titre.tabIndex = -1;
    titre.focus();
  } catch {
    $("#analyse").hidden = true;
    montrerErreur("L'analyse a échoué. Le modèle se télécharge à la première utilisation : vérifiez votre connexion et réessayez.");
  } finally {
    enCours = false;
  }
}

function initPhoto() {
  ["#photo-camera", "#photo-import"].forEach((sel) => {
    $(sel).addEventListener("change", (e) => {
      const fichier = e.target.files[0];
      e.target.value = ""; // permet de rechoisir la même photo
      analyser(fichier);
    });
  });
}

/* ---------- Démarrage ---------- */
initReglages();
initExplorer();
initFiche();
initPhoto();
window.addEventListener("hashchange", () => naviguer());
naviguer(true);