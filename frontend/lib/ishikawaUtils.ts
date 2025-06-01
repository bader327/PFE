// lib/ishikawaUtils.ts
import { CauseCategory } from '../app/components/IshikawaDiagram';

export const generate5MCauses = (fps: any) => {
  if (!fps || !fps.fps2) return [];
  
  const categories: CauseCategory[] = [
    {
      name: "Main d'oeuvre",
      causes: fps.fps2.cause1 ? [fps.fps2.cause1] : []
    },
    {
      name: "Matière",
      causes: fps.fps2.cause2 ? [fps.fps2.cause2] : []
    },
    {
      name: "Méthode",
      causes: fps.fps2.cause3 ? [fps.fps2.cause3] : []
    },
    {
      name: "Machine",
      causes: fps.fps2.cause4 ? [fps.fps2.cause4] : []
    },
    {
      name: "Milieu",
      causes: [] // Pas de valeur par défaut dans le modèle actuel
    }
  ];
  
  return categories;
};

export const formatCausesFor5M = (fps: any) => {
  if (!fps || !fps.fps2) {
    return {
      mainOeuvre: "Non spécifié",
      matiere: "Non spécifié",
      methode: "Non spécifié",
      machine: "Non spécifié",
      milieu: "Non spécifié"
    };
  }
  
  return {
    mainOeuvre: fps.fps2.cause1 || "Non spécifié",
    matiere: fps.fps2.cause2 || "Non spécifié",
    methode: fps.fps2.cause3 || "Non spécifié",
    machine: fps.fps2.cause4 || "Non spécifié",
    milieu: "Non spécifié" // Pas présent dans le modèle actuel
  };
};
