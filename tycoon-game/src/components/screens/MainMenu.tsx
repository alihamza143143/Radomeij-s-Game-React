// MainMenu.tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import ParticlesBackground from '../backgrounds/ParticlesBackground';
import Settings from '../Settings';
import LoadGame from '../LoadGame';
import MainMenuContent from '../menu/MainMenuContent';
import GradientBackground from '../backgrounds/GradientBackground';
import FullScreenWindowMobile from '../basic/FullScreenWindowMobile';

interface MainMenuProps {
    onStartNewGame: () => void;
    onLoadGame: () => void;
    onOpenGameEditor: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartNewGame, onLoadGame, onOpenGameEditor }) => {
    const dispatch: AppDispatch = useDispatch();
    const devMode = useSelector((state: RootState) => state.game.devMode);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isLoadGameScreenOpen, setIsLoadGameScreenOpen] = useState(false);

    const handleToggleSettings = () => {
        setIsSettingsOpen(!isSettingsOpen);
    };

    const handleOpenLoadGameScreen = () => {
        setIsLoadGameScreenOpen(true);
    };

    const handleCloseLoadGameScreen = () => {
        setIsLoadGameScreenOpen(false);
    };

    const handleGameLoaded = () => {
        setIsLoadGameScreenOpen(false);
        onLoadGame();
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center">
            <GradientBackground />
            <ParticlesBackground />

            {!isSettingsOpen && !isLoadGameScreenOpen && (
                <MainMenuContent
                    onStartNewGame={onStartNewGame}
                    onLoadGame={handleOpenLoadGameScreen}
                    onOpenSettings={handleToggleSettings}
                />
            )}


            {isSettingsOpen && (
                <FullScreenWindowMobile onClose={handleToggleSettings}>
                    <Settings />
                    <button className="btn btn-secondary py-4" onClick={handleToggleSettings}>Close</button>
                </FullScreenWindowMobile>
            )}


            {isLoadGameScreenOpen && (
                <FullScreenWindowMobile onClose={handleToggleSettings}>
                    <LoadGame onClose={handleCloseLoadGameScreen} onGameLoaded={handleGameLoaded} />
                </FullScreenWindowMobile>
            )}
        </div>
    );
};

export default MainMenu;
