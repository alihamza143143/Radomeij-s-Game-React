import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGameSpeed } from '@/store/gameSlice';
import { AppDispatch, RootState } from '@/store/store';

import image_time_pause from './../../../assets/czas stop.png';
import image_time_2 from './../../../assets/ikona czas 2.png';
import image_time_3 from './../../../assets/ikona czas 3.png';
import image_time_1 from './../../../assets/ikona_czas_1.png';

const SpeedButtons: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { gameSpeed } = useSelector((state: RootState) => state.game);
    const devMode = useSelector((state: RootState) => state.game.devMode);

    const speedButtons = [
        { label: 'x0', speed: 0, icon: image_time_pause, showLabel: false },
        { label: 'x1', speed: 1, icon: image_time_1, showLabel: false },
        { label: 'x5', speed: 5, icon: image_time_2, showLabel: false },
        { label: 'x10', speed: 10, icon: image_time_3, showLabel: false },
        { label: 'x100', speed: 100, icon: image_time_3, showLabel: true, dev: true },
        { label: 'x500', speed: 500, icon: image_time_3, showLabel: true, dev: true },
    ];

    return (
        <div className="flex items-center space-x-2 pr-2 mt-2">
            {speedButtons.map(button => (
                (devMode || (!devMode && !button.dev)) && (
                    <button
                        key={button.speed}
                        className="btn btn-xs flex items-center btn-secondary"
                        onClick={() => dispatch(setGameSpeed(button.speed))}
                        disabled={gameSpeed === button.speed}
                    >
                        <img src={button.icon} alt={`Speed ${button.label}`} className="w-6 h-6" />
                        {button.showLabel && <span className='text-sm'>{button.label}</span>}
                    </button>
                )
            ))}
        </div>
    );
};

export default SpeedButtons;
