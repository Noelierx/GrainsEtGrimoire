import { ClientType } from "./types";

export const typesClients: ClientType[] = [
  {
    nom: "Marie, étudiante",
    boissons: ["cafe", "the"],
    nourritures: ["croissant", "muffin"],
    genresLivres: ["Philosophie", "Roman", "Poesie"],
    patience: 3,
    budget: 15,
    description: "Une étudiante en philo qui cherche de quoi réfléchir"
  },
  {
    nom: "Pierre, retraité",
    boissons: ["the", "chocolat"],
    nourritures: ["muffin", "croissant"],
    genresLivres: ["Polar", "Roman"],
    patience: 5,
    budget: 25,
    description: "Un retraité amateur de mystères et d'énigmes"
  },
  {
    nom: "Sarah, développeuse",
    boissons: ["cafe"],
    nourritures: ["muffin"],
    genresLivres: ["Science-Fiction", "Philosophie"],
    patience: 2,
    budget: 20,
    description: "Une développeuse pressée, fan de SF"
  },
  {
    nom: "Tom, chef cuisinier",
    boissons: ["chocolat", "cafe"],
    nourritures: ["muffin", "croissant"],
    genresLivres: ["Cuisine", "Roman"],
    patience: 4,
    budget: 30,
    description: "Un chef qui cherche l'inspiration culinaire"
  },
  {
    nom: "Alice, bibliothécaire",
    boissons: ["the", "chocolat"],
    nourritures: ["croissant"],
    genresLivres: ["Roman", "Philosophie", "Polar"],
    patience: 6,
    budget: 18,
    description: "Une bibliothécaire qui adore les belles histoires"
  },
  {
    nom: "Lucas, étudiant en informatique",
    boissons: ["cafe", "chocolat"],
    nourritures: ["muffin"],
    genresLivres: ["Science-Fiction"],
    patience: 3,
    budget: 12,
    description: "Un étudiant qui code tard le soir"
  },
  {
    nom: "Camille, artiste",
    boissons: ["the", "chocolat"],
    nourritures: ["croissant", "muffin"],
    genresLivres: ["Roman", "Philosophie"],
    patience: 4,
    budget: 22,
    description: "Une artiste en quête d'inspiration"
  }
];

export const prixAchat = {
  cafe: 3,
  the: 2,
  chocolat: 4,
  croissant: 2,
  muffin: 3,
  livres: 12,
  matcha: 4,
  latteMarron: 5,
  cookie: 2,
};

export const prixVente = {
  cafe: 3,
  the: 2,
  chocolat: 4,
  croissant: 2,
  muffin: 3,
  livres: 18,
  matcha: 4,
  latteMarron: 5,
  cookie: 2,
};

export const allBoissons = ["cafe", "the", "chocolat", "Matcha", "latteMarron"];
export const allNourritures = ["croissant", "muffin", "cookie"];
export const allGenresLivres = ["Roman", "Science-Fiction", "Polar", "Philosophie", "Cuisine", "Poesie"];