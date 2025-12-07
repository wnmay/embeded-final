import React, { useEffect, useState } from "react";
import Sensor from "./sensor";
import { FaQuestion, FaLeaf } from "react-icons/fa";
import Modal from "./tools/modal";
import dynamic from "next/dynamic";

// Dynamic import for Time component
const DynamicTime = dynamic(() => import("./tools/time"), { ssr: false });

const Main = () => {
  const [showModal, setShowModal] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  return (
    <div className="font-poppins bg-gradient-to-br from-slate-50 to-emerald-50 min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 text-2xl font-semibold text-emerald-700">
            <FaLeaf className="text-emerald-500" />
            <span>PlantCare</span>
          </div>

          {/* Group Name */}
          <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
            MaMaTomYam
          </div>

          {/* Help Button */}
          <button
            className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-md"
            onClick={() => setShowModal(true)}
            title="How we determine status"
          >
            <FaQuestion size={16} />
          </button>
          <Modal isVisible={showModal} onClose={() => setShowModal(false)} />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Sensor
          lastUpdateTime={lastUpdateTime}
          setLastUpdateTime={setLastUpdateTime}
        />

        {/* Time Display */}
        <div className="mt-8">
          <DynamicTime lastUpdateTime={lastUpdateTime} />
        </div>
      </main>
    </div>
  );
};

export default Main;
