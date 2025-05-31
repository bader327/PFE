"use client";

import { motion } from "framer-motion";
import { Gauge, Activity, CheckCircle, Target } from "lucide-react";

const iconsMap: Record<string, JSX.Element> = {
  "Débit de production": <Gauge className="text-blue-500 w-8 h-8" />,
  "Taux de rebut": <Activity className="text-red-500 w-8 h-8" />,
  "Taux de conformité": <CheckCircle className="text-green-500 w-8 h-8" />,
  "Atteinte de la production": <Target className="text-yellow-500 w-8 h-8" />,
};

const UserCard = ({ type }: { type: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-4 rounded-2xl shadow-lg w-full sm:w-[48%] lg:w-[23%] flex flex-col items-center justify-center text-center space-y-2 hover:shadow-xl"
    >
      {iconsMap[type] || <Gauge className="w-8 h-8 text-gray-400" />}
      <h3 className="text-lg font-semibold text-gray-700">{type}</h3>
      <p className="text-sm text-gray-500">+12% par rapport à hier</p>
    </motion.div>
  );
};

export default UserCard;
