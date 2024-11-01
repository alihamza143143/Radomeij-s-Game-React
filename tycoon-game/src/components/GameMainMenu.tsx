import React from 'react';

interface GameMainMenuProps {
    onSwitch: (windowName: string) => void;
    onExitToMainMenu: () => void;
}

const GameMainMenu: React.FC<GameMainMenuProps> = ({ onSwitch, onExitToMainMenu }) => {
    const handleResume = () => {
        onSwitch('Resume');
    };

    const handleSaveGame = () => {
        onSwitch('SaveGame')
    };

    const handleSettings = () => {
        onSwitch('Settings');
    };

    const handleExit = () => {
        onExitToMainMenu();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
            <div className="glass p-8 rounded shadow-lg max-w-3xl w-full">
                <h2 className="text-white text-lg mb-4">Game Menu</h2>
                <ul className="space-y-4">
                    <li>
                        <button 
                            onClick={handleResume} 
                            className="btn btn-primary w-full py-2 text-xl"
                        >
                            Resume Game
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={handleSaveGame} 
                            className="btn btn-secondary w-full py-2 text-xl"
                        >
                            Save Game
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={handleSettings} 
                            className="btn btn-secondary w-full py-2 text-xl"
                        >
                            Settings
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={handleExit} 
                            className="btn btn-danger w-full py-2 text-xl"
                        >
                            Exit to Main Menu
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default GameMainMenu;
