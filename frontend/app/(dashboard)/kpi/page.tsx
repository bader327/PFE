"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const kpiCards = [
  {
    title: "FTQ",
    slug: "ftq",
    description: "First Time Quality : mesure la qualité dès le premier essai.",
    image: "https://images.unsplash.com/photo-1581090700227-1e8f2b79fba1",
  },
  {
    title: "Taux de production",
    slug: "taux-production",
    description: "Volume de production réelle par rapport au planifié.",
    image: "https://images.unsplash.com/photo-1581090700005-0b0b2c14e38e",
  },
  {
    title: "Production cible",
    slug: "production-cible",
    description: "Objectif de production défini pour une période donnée.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
  },
  {
    title: "Taux de rejets",
    slug: "taux-rejets",
    description: "Pourcentage des produits non conformes ou rejetés.",
    image: "https://images.unsplash.com/photo-1612197521773-64fbe7c8e927",
  },
];

export default function KpiPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-100 to-blue-100 py-12 px-6">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl font-bold text-slate-800 text-center mb-12"
      >
        Indicateurs de performance (KPI)
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
        {kpiCards.map((card, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            className="bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col"
          >
            <img
              src={card.image}
              alt={card.title}
              className="h-40 w-full object-cover"
            />
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-xl font-bold text-slate-700 mb-2">
                {card.title}
              </h2>
              <p className="text-sm text-gray-600 flex-grow">
                {card.description}
              </p>
              <motion.button
                onClick={() => router.push(`/kpis/${card.slug}`)}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "#1d4ed8",
                  color: "#fff",
                }}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition duration-300 ease-in-out"
              >
                View More
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
