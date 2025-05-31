"use client"; // nécessaire pour framer-motion

import { notFound } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

type KpiSlug = "ftq" | "taux-production" | "production-cible" | "taux-rejets";

type KpiInfo = {
  title: string;
  definition: string;
  importance: string;
  formula: string;
  causes: string[];
  solutions: string[];
  image: string;
};

const kpiData: Record<KpiSlug, KpiInfo> = {
  ftq: {
    title: "FTQ",
    definition:
      "Le FTQ (First Time Quality) mesure la qualité obtenue dès le premier essai sans retouche ni rejet. Il reflète la capacité de l'entreprise à produire des articles conformes dès le premier passage en production.",
    importance:
      "Un FTQ élevé garantit une efficacité optimale, réduit les coûts liés aux retouches, déchets, et améliore la satisfaction client. C'est un indicateur clé de performance qualité.",
    formula:
      "FTQ (%) = (Nombre de produits conformes au premier passage / Nombre total de produits) × 100",
    causes: [
      "Erreur humaine lors de la production",
      "Défaut matière première",
      "Réglage incorrect des machines",
    ],
    solutions: [
      "Former régulièrement les opérateurs",
      "Mettre en place des contrôles matières à réception",
      "Effectuer une maintenance préventive et un réglage précis des équipements",
    ],
    image:
      "https://images.unsplash.com/photo-1581090700227-1e8f2b79fba1?auto=format&fit=crop&w=800&q=80",
  },
  "taux-production": {
    title: "Taux de production",
    definition:
      "Le taux de production est le volume réel produit rapporté au volume planifié sur une période donnée. Il reflète la performance globale des lignes de production.",
    importance:
      "Il mesure l'efficacité globale de la production et la capacité à atteindre les objectifs fixés par la planification.",
    formula:
      "Taux de production (%) = (Volume réel produit / Volume planifié) × 100",
    causes: [
      "Manque de matières premières",
      "Arrêts machine fréquents",
      "Organisation de travail inefficace",
    ],
    solutions: [
      "Optimiser la gestion des stocks",
      "Réduire les temps d'arrêt par maintenance et planification",
      "Améliorer les processus et la planification de la production",
    ],
    image:
      "https://images.unsplash.com/photo-1581090700005-0b0b2c14e38e?auto=format&fit=crop&w=800&q=80",
  },
  "production-cible": {
    title: "Production cible",
    definition:
      "La production cible est l'objectif fixé en termes de quantité à produire sur une période donnée. Elle sert de référence pour piloter l'activité.",
    importance:
      "Permet de planifier la production efficacement et de répondre à la demande client en temps voulu.",
    formula:
      "Production cible = Quantité planifiée à produire sur une période donnée",
    causes: [
      "Objectifs mal définis ou irréalistes",
      "Ressources insuffisantes",
      "Problèmes de communication entre services",
    ],
    solutions: [
      "Fixer des objectifs SMART (spécifiques, mesurables, atteignables, réalistes, temporels)",
      "Allouer correctement les ressources",
      "Améliorer la communication et coordination inter-services",
    ],
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
  },
  "taux-rejets": {
    title: "Taux de rejets",
    definition:
      "Le taux de rejets correspond au pourcentage de produits non conformes ou rejetés lors du contrôle qualité. C’est un indicateur clé pour la maîtrise qualité.",
    importance:
      "Un taux de rejets élevé entraîne une augmentation des coûts, des pertes et une insatisfaction client.",
    formula:
      "Taux de rejets (%) = (Nombre de produits rejetés / Nombre total de produits) × 100",
    causes: [
      "Défauts matières premières",
      "Erreurs opérateurs",
      "Machines mal réglées ou usées",
    ],
    solutions: [
      "Mettre en place un contrôle qualité rigoureux",
      "Former et sensibiliser les opérateurs",
      "Effectuer une maintenance régulière et ajuster les machines",
    ],
    image:
      "https://images.unsplash.com/photo-1612197521773-64fbe7c8e927?auto=format&fit=crop&w=800&q=80",
  },
};

interface PageProps {
  params: {
    slug: KpiSlug;
  };
}

export default function KpiDetailPage({ params }: PageProps) {
  const { slug } = params;

  if (!(slug in kpiData)) {
    notFound(); // page 404 Next.js si slug invalide
  }

  const kpi = kpiData[slug];

  return (
    <motion.div
      className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-4xl font-bold mb-8 text-blue-700 text-center">
        {kpi.title}
      </h1>

      <div className="mb-8 flex flex-col md:flex-row gap-6 items-center">
        <motion.div
          className="relative w-full md:w-1/2 h-64 rounded-lg overflow-hidden shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <Image
            src={kpi.image}
            alt={kpi.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
            priority
          />
        </motion.div>
        <motion.div
          className="md:w-1/2"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3 border-b-4 border-blue-500 inline-block">
              Définition
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              {kpi.definition}
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3 border-b-4 border-blue-500 inline-block">
              Importance
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              {kpi.importance}
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3 border-b-4 border-blue-500 inline-block">
              Formule
            </h2>
            <p className="text-gray-900 font-mono bg-gray-100 p-4 rounded-md text-lg">
              {kpi.formula}
            </p>
          </section>
        </motion.div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-semibold mb-4 border-b-4 border-blue-500 inline-block">
          Causes de diminution
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2 text-lg">
          {kpi.causes.map((cause, i) => (
            <li key={i}>{cause}</li>
          ))}
        </ul>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
      >
        <h2 className="text-2xl font-semibold mb-4 border-b-4 border-blue-500 inline-block">
          Actions d'amélioration
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2 text-lg">
          {kpi.solutions.map((sol, i) => (
            <li key={i}>{sol}</li>
          ))}
        </ul>
      </motion.section>
    </motion.div>
  );
}
   