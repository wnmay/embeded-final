import React from "react";
import { FaTimes } from "react-icons/fa";

// Removed Humidity from the data
// Note: For soil moisture sensors, higher value = drier soil
const data = [
  { var: "Temperature", low: "< 15°C", normal: "15°C - 35°C", high: "> 35°C" },
  { var: "Water Level", low: "< 10%", normal: "10% - 90%", high: "> 90%" },
  {
    var: "Soil Moisture",
    low: "< 2800",
    normal: "2800 - 3500",
    high: "> 3500",
  },
];

const Modal = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 w-screen h-screen   bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            Status Reference
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Table */}
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="pb-3 font-medium">Variable</th>
                <th className="pb-3 font-medium">Low</th>
                <th className="pb-3 font-medium">Normal</th>
                <th className="pb-3 font-medium">High</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {data.map((item) => (
                <tr key={item.var} className="border-t border-gray-50">
                  <td className="py-3 font-medium text-gray-800">{item.var}</td>
                  <td className="py-3 text-yellow-600">{item.low}</td>
                  <td className="py-3 text-green-600">{item.normal}</td>
                  <td className="py-3 text-red-600">{item.high}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Modal;
