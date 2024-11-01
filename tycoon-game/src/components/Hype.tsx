// components/Hype.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

import image_hype from './../assets/hype.png';

const Hype: React.FC = () => {
  const { developmentInProgress } = useSelector((state: RootState) => state.hardware);
  const { hype } = useSelector((state: RootState) => state.marketing);

  // if (!developmentInProgress) {
  //   return null;
  // }

  return (
    <div className="flex flex-col items-center">
      <div className='flex flex-col text-center items-center space-x-2 bg-transparent z-40'>
        <img src={image_hype} alt="popularity" className="w-10 h-10" />
        <h2 className="text-base portrait:pl-0 pl-2 text-primary-content">{hype.toFixed(0)}</h2>
      </div>
    </div>
  );
};

export default Hype;
