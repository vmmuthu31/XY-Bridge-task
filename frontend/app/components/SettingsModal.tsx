import React, { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

interface SettingsModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSave: (settings: { slippage: number; gasPrice: string }) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onRequestClose,
  onSave,
}) => {
  const [slippage, setSlippage] = useState(0.5);
  const [gasPrice, setGasPrice] = useState("average");

  const handleSave = () => {
    onSave({ slippage, gasPrice });
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Settings"
      className="max-w-2xl mx-auto bg-white p-4 rounded-lg shadow-lg"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Transaction Settings</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Slippage Tolerance (%)</label>
          <div className="flex items-center space-x-4 mt-2">
            <button
              className={`py-2 px-4 rounded ${
                slippage === 0.1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setSlippage(0.1)}
            >
              0.1%
            </button>
            <button
              className={`py-2 px-4 rounded ${
                slippage === 0.5 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setSlippage(0.5)}
            >
              0.5%
            </button>
            <button
              className={`py-2 px-4 rounded ${
                slippage === 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setSlippage(1)}
            >
              1%
            </button>
            <input
              type="text"
              value={slippage}
              onChange={(e) => setSlippage(parseFloat(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Custom"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Gas Price (Gwei)</label>
          <div className="flex items-center space-x-4 mt-2">
            <button
              className={`py-2 px-4 rounded ${
                gasPrice === "slow" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setGasPrice("slow")}
            >
              Slow
            </button>
            <button
              className={`py-2 px-4 rounded ${
                gasPrice === "average"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setGasPrice("average")}
            >
              Average
            </button>
            <button
              className={`py-2 px-4 rounded ${
                gasPrice === "fast" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setGasPrice("fast")}
            >
              Fast
            </button>
            <button
              className={`py-2 px-4 rounded ${
                gasPrice === "rapid" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setGasPrice("rapid")}
            >
              Rapid
            </button>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onRequestClose}
            className="mr-4 bg-gray-300 py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
