import React from 'react';

import image_exit from './../assets/svg/exit.svg';

interface WindowProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({ title, onClose, children }) => {
  return (
    <div className="modal modal-open flex justify-center items-center z-[900] glass bg-transparent ">
      <div className="modal-box bg-opacity-60 relative max-h-none w-10/12 max-w-none overflow-y-hidden h-full">
        <button className="btn btn-sm btn-circle  absolute right-2 portrait:right-2 top-0" onClick={onClose}>
          <img src={image_exit} alt="Exit button" className="w-6 h-6" />
        </button>
        <div className="h-full max-h-screen overflow-y-auto overflow-x-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Window;
