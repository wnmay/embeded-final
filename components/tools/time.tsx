import React, { useState, useEffect } from "react";
import { FaClock, FaSync } from "react-icons/fa";

type Props = {
  lastUpdateTime: Date;
};

const Time: React.FC<Props> = ({ lastUpdateTime }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
        <div className="flex items-center gap-3">
          <FaClock className="text-emerald-500" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Current Time
            </p>
            <p className="text-lg font-medium text-gray-800">
              {formatDateTime(currentDateTime)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FaSync className="text-blue-500" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Last Updated
            </p>
            <p className="text-lg font-medium text-gray-800">
              {formatDateTime(lastUpdateTime)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Time;
