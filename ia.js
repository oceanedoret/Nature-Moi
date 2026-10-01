/* =====================================================================
   ia.js — Identification d'un animal à partir d'une photo
   Principe : le modèle CLIP compare la photo à une liste de descriptions
   (nos 16 espèces + quelques « intrus »). Tout se passe dans le navigateur :
   aucune image n'est envoyée à un serveur, aucune clé d'API n'est utilisée.
   Le modèle (plusieurs dizaines de Mo) est téléchargé au premier usage
   depuis Hugging Face, puis gardé en cache par le navigateur.
   ===================================================================== */

import { ANIMAUX } from "./data.js";

const LIBRAIRIE = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3";
const MODELE = "Xenova/clip-vit-base-patch32";

// En dessous de ce score (0 à 1), on dit qu'on n'est pas sûr. À ajuster après vos tests.
const SEUIL = 0.5;

// Intrus : sans eux, le modèle choisirait toujours l'une de nos 16 espèces,
// même pour une photo de chat ou de paysage.
const INTRUS = [
  "a cat", "a dog", "a person", "a cow", "a horse", "a sheep", "a rabbit",
  "a pigeon", "a sparrow", "a seagull", "a swan", "a goose",
  "a landscape", "a building", "a car", "a flower", "a plate of food"
];

const LABELS = [...ANIMAUX.map((a) => a.clip), ...INTRUS];

let chargement = null; // le modèle n'est chargé qu'une seule fois

function charger(onProgress) {
  if (!chargement) {
    chargement = import(LIBRAIRIE)
      .then(({ pipeline }) => {
        const fichiers = {};
        return pipeline("zero-shot-image-classification", MODELE, {
          progress_callback: (p) => {
            if (p.status !== "progress" || !p.total) return;
            fichiers[p.file] = { loaded: p.loaded, total: p.total };
            const liste = Object.values(fichiers);
            const total = liste.reduce((s, f) => s + f.total, 0);
            const charge = liste.reduce((s, f) => s + f.loaded, 0);
            onProgress?.(Math.round((charge / total) * 100));
          }
        });
      })
      .catch((erreur) => {
        chargement = null; // permet de réessayer
        throw erreur;
      });
  }
  return chargement;
}

/**
 * @param {string} urlImage  adresse de l'image (URL d'objet créée depuis le fichier)
 * @param {(pourcentage:number)=>void} onProgress  suivi du téléchargement du modèle
 * @returns {Promise<{statut:"ok"|"incertain"|"inconnu", propositions:{animal:object, score:number}[]}>}
 */
export async function identifier(urlImage, onProgress) {
  const classifieur = await charger(onProgress);
  const sortie = await classifieur(urlImage, LABELS);
  sortie.sort((a, b) => b.score - a.score);

  const propositions = sortie
    .map((r) => ({ animal: ANIMAUX.find((a) => a.clip === r.label), score: r.score }))
    .filter((p) => p.animal)
    .slice(0, 3);

  const meilleur = ANIMAUX.find((a) => a.clip === sortie[0].label);
  let statut = "ok";
  if (!meilleur) statut = "inconnu";            // un intrus arrive en tête
  else if (sortie[0].score < SEUIL) statut = "incertain";

  return { statut, propositions };
}