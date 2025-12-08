import React, { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import firebaseApp from "../lib/firebase";
import { FaTint, FaThermometerHalf, FaSeedling, FaWater } from "react-icons/fa";

type SensorData = {
  factor: string;
  status: string;
  value: number;
  min: number;
  max: number;
};

type Time = {
  lastUpdateTime: Date;
  setLastUpdateTime: (date: Date) => void;
};

const getFactorIcon = (factor: string) => {
  switch (factor) {
    case "temperature":
      return <FaThermometerHalf className="text-orange-500" />;
    case "water-level":
      return <FaWater className="text-blue-500" />;
    case "soil-moisture":
      return <FaSeedling className="text-green-600" />;
    default:
      return <FaTint className="text-gray-500" />;
  }
};

const getFactorLabel = (factor: string) => {
  switch (factor) {
    case "temperature":
      return "Temperature (°C)";
    case "water-level":
      return "Water Level (%)";
    case "soil-moisture":
      return "Soil Moisture (centibars)";
    default:
      return factor;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "low":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "normal":
      return "bg-green-100 text-green-700 border-green-300";
    case "high":
      return "bg-red-100 text-red-700 border-red-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

// Skeleton card component for loading state
const SkeletonCard = ({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="text-2xl opacity-30">{icon}</div>
      <h3 className="font-semibold text-gray-400">{label}</h3>
    </div>
    <div className="h-10 bg-gray-200 rounded-lg w-24 mb-3"></div>
    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
    <div className="mt-4 flex justify-between">
      <div className="h-4 bg-gray-100 rounded w-16"></div>
      <div className="h-4 bg-gray-100 rounded w-16"></div>
    </div>
  </div>
);

const skeletonFactors = [
  {
    label: "Temperature",
    icon: <FaThermometerHalf className="text-orange-500" />,
  },
  { label: "Water Level", icon: <FaWater className="text-blue-500" /> },
  { label: "Soil Moisture", icon: <FaSeedling className="text-green-600" /> },
];

const SensorTable: React.FC<Time> = ({ lastUpdateTime, setLastUpdateTime }) => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [shouldWater, setShouldWater] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Removed humidity from factors
    const factors = ["temperature", "water-level", "soil-moisture"];

    const computeStatus = (factor: string, value: number) => {
      // Rules must match the Status Reference (frontend authoritative)
      switch (factor) {
        case "temperature":
          if (value < 15) return "Low";
          if (value > 35) return "High";
          return "Normal";
        case "water-level":
          // value is percentage (0-100)
          if (value < 30) return "Low";
          if (value > 80) return "High";
          return "Normal";
        case "soil-moisture":
          // Note: for this sensor higher value = drier soil
          if (value < 10) return "Low";
          if (value > 60) return "High";
          return "Normal";
        default:
          return "Normal";
      }
    };

    // Use one-time reads to avoid race conditions from multiple onValue callbacks
    const db = getDatabase(firebaseApp);
    const fetchData = async () => {
      const promises = factors.map(async (factor) => {
        const snap = await get(ref(db, factor));
        const data = snap.val();
        if (data) {
          const value = Number(data.value);
          const status = computeStatus(factor, value);
          const newData: SensorData = {
            factor,
            status,
            value,
            min: data.min,
            max: data.max,
          };
          return newData;
        }
        return null;
      });

      const results = await Promise.all(promises);
      const newSensorData = results.filter((r) => r !== null) as SensorData[];

      // Determine watering need: water if water-level is Low OR soil-moisture is High (dry)
      let waterNeeded = false;
      for (const checkData of newSensorData) {
        if (checkData.factor === "water-level" && checkData.status === "Low") {
          waterNeeded = true;
          break;
        }
        if (
          checkData.factor === "soil-moisture" &&
          checkData.status === "Low"
        ) {
          waterNeeded = true;
          break;
        }
        if (checkData.factor === "temperature" && checkData.status === "High") {
          waterNeeded = true;
          break;
        }
      }

      // Always update sensor data and last update time
      setSensorData(newSensorData);
      setLastUpdateTime(new Date());
      setShouldWater(waterNeeded);
      if (newSensorData.length > 0) setIsLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [setLastUpdateTime]);

  return (
    <div className="space-y-8">
      {/* Water Status Card - Moved to top */}
      <div
        className={`rounded-2xl p-8 text-center ${
          shouldWater
            ? "bg-gradient-to-r from-emerald-500 to-teal-500"
            : "bg-gradient-to-r from-slate-400 to-slate-500"
        }`}
      >
        <div className="flex items-center justify-center gap-4">
          <FaTint className="text-white text-3xl" />
          <span className="text-2xl font-bold text-white">
            {shouldWater ? "Time to Water! 💧" : "No Watering Needed"}
          </span>
        </div>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading
          ? // Skeleton loading state
            skeletonFactors.map((item, index) => (
              <SkeletonCard key={index} label={item.label} icon={item.icon} />
            ))
          : // Actual sensor data
            sensorData.map((data, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">{getFactorIcon(data.factor)}</div>
                  <h3 className="font-semibold text-gray-800">
                    {getFactorLabel(data.factor)}
                  </h3>
                </div>

                <div className="text-4xl font-bold text-gray-900 mb-3">
                  {data.value}
                </div>

                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    data.status
                  )}`}
                >
                  {data.status}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default SensorTable;
