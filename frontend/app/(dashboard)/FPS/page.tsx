"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const fpsCards = [
  {
    title: "FPS Analysis",
    description: "Analyse de la performance des équipements industriels.",
    image: "https://images.unsplash.com/photo-1581091870622-81f2f2c5780d",
    pdf: "/fps-pdfs/FPSAnalysis.pdf",
  },
  {
    title: "Formulaire FPS",
    description: "État de disponibilité des machines et ressources.",
    image: "https://images.unsplash.com/photo-1605902711622-cfb43c4437d2",
    pdf: "/fps-pdfs/FormulaireFPS.pdf",
  },
  {
    title: "FPS PROCESS",
    description: "Niveau d'efficacité opérationnelle des lignes de production.",
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786",
    pdf: "/fps-pdfs/FPSPROCESS.pdf",
  },
  {
    title: "FPS Metal Analysis",
    description: "Contrôle qualité des produits finis et semi-finis.",
    image: "https://images.unsplash.com/photo-1590650046871-48d20fe7d5e0",
    pdf: "/fps-pdfs/FPSMetalAnalysis.pdf",
  },
  {
    title: "Instruction FPS",
    description: "Plan de maintenance préventive et curative.",
    image: "https://images.unsplash.com/photo-1581093448795-68105247f03d",
    pdf: "/fps-pdfs/InstructionFPS.pdf",
  },
];

const FPSPage = () => {
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 py-12 px-6">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl font-bold text-slate-800 text-center mb-12"
      >
        Fiches de Performance du Système (FPS)
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {fpsCards.map((card, index) => (
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
                onClick={() => setSelectedPDF(card.pdf)}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#1d4ed8",
                  color: "#fff",
                }}
                className="mt-4 text-center bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition duration-300 ease-in-out"
              >
                View PDF
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedPDF && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPDF(null)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg w-[90%] h-[90%] overflow-hidden relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPDF(null)}
                className="absolute top-4 right-4 text-gray-700 hover:text-red-500 text-2xl font-bold z-10"
              >
                &times;
              </button>
              <iframe
                src={selectedPDF}
                title="PDF Viewer"
                className="w-full h-full"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FPSPage;
