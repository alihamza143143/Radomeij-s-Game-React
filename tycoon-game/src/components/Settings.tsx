import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { toggleDevMode } from '../store/gameSlice';
import { toggleMusic, toggleSound, setMusicVolume, setSoundVolume, setLanguage } from '../store/settingsSlice';
import FullScreenButton from './core/FullScreenButton';
import ScreenInfo from './devs/ScreenInfo';

const Settings: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { devMode } = useSelector((state: RootState) => state.game);
    const { musicEnabled, soundEnabled, musicVolume, soundVolume, language } = useSelector((state: RootState) => state.settings);

    const handleMusicVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setMusicVolume(Number(event.target.value)));
    };

    const handleSoundVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSoundVolume(Number(event.target.value)));
    };

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setLanguage(event.target.value));
    };

    return (
        <div className="p-4 landscape:pt-12 flex flex-col grow items-stretch relative">
            <div className="flex w-8">
                <h2 className="text-2xl mb-4">Settings</h2>
            </div>
            <div className="flex flex-wrap grow gap-4 ">
                <div className="flex flex-col w-[calc(50%-1rem)]">
                    <div className="form-control">
                        <label className="label label-text">Developer Mode:</label>
                        <input
                            type="checkbox"
                            checked={devMode}
                            onChange={() => dispatch(toggleDevMode())}
                            className="toggle toggle-primary"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label label-text">Sound:</label>
                        <input
                            type="checkbox"
                            checked={soundEnabled}
                            onChange={() => dispatch(toggleSound())}
                            className="toggle toggle-primary"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label label-text">Sound Volume:</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={soundVolume}
                            onChange={handleSoundVolumeChange}
                            className="range range-primary"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label label-text">Music:</label>
                        <input
                            type="checkbox"
                            checked={musicEnabled}
                            onChange={() => dispatch(toggleMusic())}
                            className="toggle toggle-primary"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label label-text">Music Volume:</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={musicVolume}
                            onChange={handleMusicVolumeChange}
                            className="range range-primary"
                        />
                    </div>
                </div>

                <div className="flex flex-col w-[calc(50%-1rem)]">
                    <div className="form-control">
                        <label className="label label-text">Language:</label>
                        <select value={language} onChange={handleLanguageChange} className="select select-bordered">
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="pl">Polish</option>
                            <option value="ar">Arabic</option>
                            <option value="ko">Korean</option>
                            <option value="ja">Japanese</option>
                            <option value="it">Italian</option>
                        </select>
                    </div>
                </div>
                <div className="mt-4">
                    <FullScreenButton /> {/* FullScreenButton component */}
                </div>
            </div>

            {devMode && <ScreenInfo />} {/* Conditionally render ScreenInfo based on devMode */}
        </div>
    );
};

export default Settings;
