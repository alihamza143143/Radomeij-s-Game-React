import React from 'react';
import image_logo from '../../assets/logo_gry.png';

interface MainMenuContentDesktopProps {
    onStartNewGame: () => void;
    onLoadGame: () => void;
    onOpenSettings: () => void;
}

const MainMenuContentDesktop: React.FC<MainMenuContentDesktopProps> = ({ onStartNewGame, onLoadGame, onOpenSettings }) => {
    return (
        <div className="relative z-10 justify-center items-center content-center">
            <div className="absolute inset-0 bg-white opacity-50 top-36 w-6/12 translate-x-1/2 rounded-b-[90px]"></div>
            <div className="relative">
                <img src={image_logo} alt="Game logo" className="z-100 w-8/12 translate-x-1/4 pb-4 " />
            </div>
            <div className="flex flex-col justify-center items-center relative -translate-y-1/4">
                <button
                    className="btn btn-primary w-72 mb-4 font-extrabold text-4xl text-blue-900 btn-text-outline"
                    onClick={onStartNewGame}
                >
                    New Game
                </button>
                <button
                    className="btn btn-primary w-72 mb-4 font-extrabold text-4xl text-blue-900 btn-text-outline"
                    onClick={onLoadGame}
                >
                    Load Game
                </button>
                <button
                    className="btn btn-primary w-72 mb-4 font-extrabold text-4xl text-blue-900 btn-text-outline"
                    onClick={onOpenSettings}
                >
                    Settings
                </button>
            </div>
        </div>
    );
};

export default MainMenuContentDesktop;
