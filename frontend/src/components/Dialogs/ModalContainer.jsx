// ModalContainer.jsx
import React, { useEffect } from "react";
import ReactDOM from "react-dom";

const ModalContainer = ({ isOpen, children, className = "" }) => {
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalRoot = document.getElementById("modal-root");


  return ReactDOM.createPortal(
    <div className={`fixed inset-0 z-50 flex items-center justify-center overflow-auto outline-none focus:outline-none ${className}`}>
      {/* overlay */}
      <div className="absolute inset-0 bg-black opacity-50 dark:bg-gray-900 dark:opacity-70" />

      {/* content wrapper */}
      <div className="relative w-full max-w-md mx-auto my-6 z-10">
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default ModalContainer;
