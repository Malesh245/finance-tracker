import React, { Children } from "react";

function Modal({ show, onClose, children }) {
  return (
    <div
      style={{
        transform: show ? "translateX(0%)" : "translateX(-200%)",
      }}
      className="absolute w-full h-full top-0 left-0 z-10 transition-all duration-500"
    >
      <div className="container max-w-2xl px-6 py-4 mx-auto rounded-3xl bg-slate-800 ">
        <button
          onClick={() => onClose(false)}
          className="w-10 h-10 mb-4 font-bold rounded-full bg-slate-500"
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;