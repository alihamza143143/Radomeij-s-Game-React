import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadConsumerPopulations } from '../../loaders/consumerData';
import { loadProductsData } from '../../loaders/productsData';
import { loadConsumers } from '../../store/consumerSlice';
import { AppDispatch, RootState } from '../../store/store';
import NotificationList from '../core/NotificationList';
import DynamicUpdater from '../DynamicUpdater';
import TycoonRoomManager from '../rooms/TycoonRoomManager';

import { loadOffices } from '@/loaders/officeData';
import { loadResearchProjects } from '@/loaders/researchData';
import { loadProducts } from '@/store/competitorSlice';
import { setAvailableOffices } from '@/store/officeSlice';
import { loadProjects } from '@/store/resaearchSlice';
import GradientBackground from '../backgrounds/GradientBackground';
import GameFooter from '../game/GameFooter';
import GameHeader from '../game/GameHeader';
import GameHeaderPortrait from '../game/GameHeaderPortrait';
import GameWindows from '../game/GameWindows';
import MiniSalesDashboardV3 from '../MiniSalesDashboardV3';
import ScriptManager from '../mods/ScriptManager';

interface GameScreenProps {
  onExitToMainMenu: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ onExitToMainMenu }) => {
  const [activeWindow, setActiveWindow] = useState<string | null>(null);

  const dispatch: AppDispatch = useDispatch();
  const developmentInProgress = useSelector((state: RootState) => state.hardware.developmentInProgress);
  const devMode = useSelector((state: RootState) => state.game.devMode);
  const visibleProducts = useSelector((state: RootState) => state.playerHistory.visibleProducts);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  useEffect(() => {
    const consumerPopulations = loadConsumerPopulations();
    const products = loadProductsData();
    const loadedProjects = loadResearchProjects();
    const offices = loadOffices();

    dispatch(loadConsumers(consumerPopulations));
    dispatch(loadProducts(products));
    dispatch(loadProjects(loadedProjects));
    dispatch(setAvailableOffices(offices));

  }, [dispatch]);

  return (
    <div className="relative min-h-screen bg-transparent flex flex-col items-center overflow-hidden pointer-events-none">
      <ScriptManager />
      <GradientBackground />

      {/* PixiJS Canvas Layer */}
      <div className="absolute inset-0 -z-40 pointer-events-auto">
        <TycoonRoomManager />
      </div>

      <DynamicUpdater />


      <div className="flex flex-col grow w-full justify-between ">
        <div className="flex flex-col">
          {isPortrait ? <GameHeaderPortrait /> : <GameHeader />}
        </div>

        <div className="flex flex-col w-52 mt-2 bg-transparent pointer-events-none">
          {visibleProducts.map(productId => (
            <MiniSalesDashboardV3 key={productId} productId={productId} />
          ))}
        </div>

        <div className="flex flex-col grow w-full justify-end">
          <GameFooter setActiveWindow={(window) => setActiveWindow(window)} />
        </div>
      </div>

      {/* Windows */}
      <div className='pointer-events-auto'>
        <GameWindows activeWindow={activeWindow} setActiveWindow={setActiveWindow} onExitToMainMenu={onExitToMainMenu} />
      </div>

      {/* Notifications */}
      <NotificationList />
    </div>
  );
};

export default GameScreen;
