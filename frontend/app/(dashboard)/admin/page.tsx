"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import CalendarEventsAndAnnouncements from "../../components/CalendarEventsAndAnnouncements";

const AdminPage = () => {
  const router = useRouter();

  const cardsData = [
    {
      title: "FPS",
      description: "Suivi précis de la fréquence de production standard.",
      image: "https://images.unsplash.com/photo-1581093588401-70cfb1908c0b",
      link: "/FPS",
    },
    {
      title: "KPI's",
      description: "Indicateurs clés de performance pour la production.",
      image: "https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5",
      link: "/kpi",
    },
    {
      title: "USINE DONNÉES",
      description:
        "Toutes les données critiques de l'usine en un seul endroit.",
      image: "https://images.unsplash.com/photo-1617727553252-65863c156ebf",
      link: "/usine",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-100 via-sky-100 to-white animate-gradient bg-[length:400%_400%]">
      <motion.div
        initial="hidden"
        animate="visible"
        className="p-6 flex flex-col lg:flex-row gap-10"
      >
        {/* Left side - Cards */}
        <div className="w-full lg:w-2/3 flex flex-col gap-10 items-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl font-extrabold text-slate-800 text-center"
          >
            Tableau de bord - KPI industriels
          </motion.h1>

          {cardsData.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.03 }}
              className="w-full max-w-xl bg-white/90 backdrop-blur-md shadow-xl rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-blue-200"
            >
              <img
                src={card.image}
                alt={card.title}
                className="h-56 w-full object-cover rounded-t-3xl"
              />
              <div className="p-6 flex flex-col gap-4">
                <h3 className="text-2xl font-bold text-slate-800">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-base">{card.description}</p>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "#1d4ed8",
                    color: "#fff",
                  }}
                  onClick={() => router.push(card.link)}
                  className="self-start mt-2 bg-blue-600 text-white py-2 px-6 rounded-xl shadow hover:bg-blue-700 transition font-semibold"
                >
                  Voir Détails
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right side - Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full lg:w-1/3 flex flex-col gap-8"
        >
          <CalendarEventsAndAnnouncements />
        </motion.div>
      </motion.div>

      <style jsx>{`
        .animate-gradient {
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminPage;
