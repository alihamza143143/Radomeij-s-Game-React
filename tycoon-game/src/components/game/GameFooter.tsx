import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import DevOptions from '../devs/DevOptions';
import Calendar from './footer/Calendar';
import SpeedButtons from './footer/SpeedButtons';
import SystemButtonGroup from './footer/SystemButtonGroup';
import ActionButtonGroup from './footer/ActionButtonGroup';

interface GameFooterProps {
    setActiveWindow: (window: string | null) => void;
}

const GameFooter: React.FC<GameFooterProps> = ({ setActiveWindow }) => {
    const { day, month, year } = useSelector((state: RootState) => state.game);
    const devMode = useSelector((state: RootState) => state.game.devMode);
    const formattedDate = `D: ${day} M: ${month + 1}, Y: ${year}`;

    return (
        <div className="w-full flex flex-col justify-start items-start pointer-events-auto">
            {devMode && <DevOptions openWindow={(window) => setActiveWindow(window)} />}
            <Calendar formattedDate={formattedDate} />
            <div className="flex justify-between grow w-full">
                <div className="flex flex-row bg-primary pr-5 rounded-tr-full">
                    <ActionButtonGroup setActiveWindow={setActiveWindow} />
                    <SpeedButtons />
                </div>
                <div className="flex flex-col bg-primary pl-12 rounded-tl-full">
                    <SystemButtonGroup setActiveWindow={setActiveWindow} />
                </div>
            </div>
            <div className="h-2 w-full bg-primary " />
        </div>
    );
};

export default GameFooter;
