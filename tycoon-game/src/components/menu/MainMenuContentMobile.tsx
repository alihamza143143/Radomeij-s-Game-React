import React from 'react';
import image_logo from '../../assets/logo_gry.png';
import FullScreenButton from '../core/FullScreenButton';
import { toggleMusic } from '@/store/settingsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import GradientBackground from '../backgrounds/GradientBackground';
import buttonNormal from '../../assets/buttonNormal.png';
import buttonHover from '../../assets/buttonHover.png';

interface MainMenuContentMobileProps {
    onStartNewGame: () => void;
    onLoadGame: () => void;
    onOpenSettings: () => void;
}

const MainMenuContentMobile: React.FC<MainMenuContentMobileProps> = ({ onStartNewGame, onLoadGame, onOpenSettings }) => {
    const dispatch = useDispatch();
    const { musicEnabled } = useSelector((state: RootState) => state.settings);

    const handleToggleMusic = () => {
        dispatch(toggleMusic());
    };

    return (
        <div className="relative flex flex-col items-center justify-center h-screen w-screen bg-transparent">
            {/* Background Image */}
            <GradientBackground />

            {/* Top Left: Fullscreen Button and Music Toggle */}
            <div className="fixed top-4 left-4 z-[1100] flex flex-col space-y-4">
                <FullScreenButton />
                <button
                    onClick={handleToggleMusic}
                    className="text-white bg-transparent hover:text-yellow-400 text-3xl"
                    aria-label={musicEnabled ? "Mute Music" : "Enable Music"}
                >
                    {musicEnabled ? '🔊' : '🔇'}
                </button>
            </div>

            {/* Logo Section */}
            <div className="flex items-center justify-center w-full py-4">
                <img
                    src={image_logo}
                    alt="Game logo"
                    className="w-60 sm:w-80 md:w-92 lg:w-[30rem] xl:w-[28rem] z-20 bg-transparent" // Increased sizes for larger, responsive logo
                />
            </div>


            {/*Buttons Section*/}
            <div className="flex flex-col items-center space-y-6 bg-white bg-opacity-35 p-10 rounded-[50px] shadow-lg w-[340px] max-w-[50%] sm:max-w-xs md:max-w-sm lg:max-w-md relative z-10 -mt-20 h-[350px]"> {/* Adjusted rounded corners */}
                <button
                    style={{ backgroundImage: `url(${buttonNormal})` }}
                    className="bg-cover bg-no-repeat bg-center font-bold py-4 px-8 rounded-lg w-[250px] h-[80px] transition duration-200 transform hover:scale-105 active:scale-105 text-lg"
                    onClick={onStartNewGame}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundImage = `url(${buttonHover})`)}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundImage = `url(${buttonNormal})`)}
                >
                    <span className="text-outline">NEW GAME</span>
                </button>

                <button
                    style={{ backgroundImage: `url(${buttonNormal})` }}
                    className="bg-cover bg-no-repeat bg-center font-bold py-4 px-8 rounded-lg w-[250px] h-[80px] transition duration-200 transform hover:scale-105 active:scale-105 text-lg"
                    onClick={onLoadGame}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundImage = `url(${buttonHover})`)}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundImage = `url(${buttonNormal})`)}
                >
                    <span className="text-outline">LOAD GAME</span>
                </button>

                <button
                    style={{ backgroundImage: `url(${buttonNormal})` }}
                    className="bg-cover bg-no-repeat bg-center font-bold py-4 px-8 rounded-lg w-[250px] h-[80px] transition duration-200 transform hover:scale-105 active:scale-105 text-lg"
                    onClick={onOpenSettings}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundImage = `url(${buttonHover})`)}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundImage = `url(${buttonNormal})`)}
                >
                    <span className="text-outline">SETTINGS</span>
                </button>
            </div>

        </div>
    );
};

export default MainMenuContentMobile;
