import React from "react";
import ReactDOM from "react-dom";

const StaticModal = ({ isOpen, onCancel , onConfirm , header , subHeader }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-50 dark:bg-gray-900 dark:opacity-70"
        
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-md mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white dark:bg-gray-800 border-0 rounded-lg shadow-xl outline-none focus:outline-none">
          {/* Modal Header */}
          <div className="flex items-start justify-between p-5 border-b border-gray-300 dark:border-gray-700 rounded-t  ">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              {header}
            </h3>
            
          </div>

          {/* Modal Body */}
          <div className="relative flex-auto p-6">
            <p className="my-4 text-base leading-relaxed text-gray-600 dark:text-gray-300">
              {subHeader}
            </p>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end p-6 border-t border-gray-300 dark:border-gray-700 rounded-b">
            <button
              className="px-6 py-2 mb-1 mr-4 text-sm font-bold text-gray-600 dark:text-gray-300 uppercase transition-all duration-150 ease-linear bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow outline-none hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none"
              type="button"
              onClick={onCancel}
            >
              No
            </button>
            <button
              className="px-6 py-2 mb-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-orange-500 rounded shadow outline-none hover:bg-orange-600 focus:outline-none"
              type="button"
              onClick={onConfirm}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root") // Render the modal outside the parent component
  );
};

export default StaticModal;
