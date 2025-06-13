"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import CalendarEventsAndAnnouncements from "../../components/CalendarEventsAndAnnouncements"; // ✅ NOUVEAU

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
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-100 via-sky-100 to-white animate-gradient bg-[length:400%_400%]" />

      <motion.div
        initial="hidden"
        animate="visible"
        className="p-6 flex flex-col md:flex-row gap-6"
      >
        <div className="w-full lg:w-2/3 flex flex-col gap-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-3xl font-bold text-slate-700"
          >
            Tableau de bord - KPI industriels
          </motion.h1>

          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 place-items-center">
            {cardsData.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.3, duration: 0.6 }}
                whileHover={{ scale: 1.05, rotate: 1 }}
                className="bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden transform transition duration-300 w-72 hover:shadow-blue-200"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-40 w-full object-cover rounded-t-2xl"
                />
                <div className="p-5 flex flex-col justify-between h-full">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600 flex-grow">
                    {card.description}
                  </p>
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "#2563eb",
                      color: "#fff",
                      transition: { duration: 0.3 },
                    }}
                    onClick={() => router.push(card.link)}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-xl shadow-md hover:bg-blue-600 transition font-medium"
                  >
                    View Details
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full lg:w-1/2 flex flex-col gap-8"
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
