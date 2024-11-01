// App.tsx
import React, { useState, useEffect } from 'react';
import GameScreen from './components/screens/GameScreen';
import MainMenu from './components/screens/MainMenu';
import GameEditor from './components/screens/GameEditor';
import LoadingScreen from './components/core/LoadingScreen';
import { resetState } from './store/saves/actions';
import { AppDispatch } from './store/store';
import { useDispatch } from 'react-redux';
import AudioPlayer from './components/core/AudioPlayer';
import VersionBanner from './components/core/VersionBanner';

type ViewType = 'mainMenu' | 'gameScreen' | 'gameEditor';

const App: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [view, setView] = useState<ViewType>('mainMenu');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Loading...');

  // Simulate loading progress
  useEffect(() => {
    if (!isLoading) return;

    const duration = 1000; // 1 second loading time
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = (currentStep / steps) * 100;

      if (progress >= 100) {
        setLoadingProgress(100);
        setIsLoading(false);
        clearInterval(timer);
      } else {
        setLoadingProgress(progress);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isLoading]);

  const startLoading = (nextView: ViewType, text: string = 'Loading...') => {
    setLoadingText(text);
    setLoadingProgress(0);
    setIsLoading(true);

    // Change view after a short delay
    setTimeout(() => {
      setView(nextView);
    }, 1000); // Match with loading duration
  };

  const handleStartNewGame = () => {
    dispatch(resetState());
    startLoading('gameScreen', 'Starting new game...');
  };

  const handleLoadGame = () => {
    startLoading('gameScreen', 'Loading saved game...');
  };

  const handleExitToMainMenu = () => {
    startLoading('mainMenu', 'Returning to main menu...');
  };

  const handleOpenGameEditor = () => {
    startLoading('gameEditor', 'Opening game editor...');
  };

  const handleExitGameEditor = () => {
    startLoading('mainMenu', 'Exiting editor...');
  };

  return (
    <div className="relative z-0">
      <VersionBanner version="0.1.2" />
      <AudioPlayer />

      {isLoading ? (
        <LoadingScreen progress={loadingProgress} text={loadingText} />
      ) : (
        <>
          {view === 'mainMenu' && (
            <MainMenu
              onStartNewGame={handleStartNewGame}
              onLoadGame={handleLoadGame}
              onOpenGameEditor={handleOpenGameEditor}
            />
          )}
          {view === 'gameScreen' && (
            <GameScreen onExitToMainMenu={handleExitToMainMenu} />
          )}
          {view === 'gameEditor' && (
            <GameEditor onExitGameEditor={handleExitGameEditor} />
          )}
        </>
      )}
    </div>
  );
};

export default App;