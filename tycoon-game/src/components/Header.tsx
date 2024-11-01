import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { setGameSpeed } from '../store/gameSlice';
import { formatCash } from '../utils/numberFormatter';

import image_time_pause from './../assets/czas stop.png';
import image_time_1 from './../assets/ikona_czas_1.png';
import image_time_2 from './../assets/ikona czas 2.png';
import image_time_3 from './../assets/ikona czas 3.png';

import image_calendar from './../assets/czas.png';

import image_cash from './../assets/ikona dolar.png';
import image_popularity from './../assets/rozpoznawalnosc.png';
import image_fans from './../assets/fani.png';
import Hype from './Hype';

const Header: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();

    const devMode = useSelector((state: RootState) => state.game.devMode);

    const { day, month, year, cash, previousDayCash, gameSpeed } = useSelector((state: RootState) => state.game);
    const { popularity, fans } = useSelector((state: RootState) => state.popularity); // Updated line
    const { currentProgress, currentProject } = useSelector((state: RootState) => state.research);
    const { progress: hardwareProgress, developmentInProgress, name: developmentName } = useSelector((state: RootState) => state.hardware);
    const formattedDate = `Day: ${day} Month: ${month + 1}, Year: ${year}`;

    const cashDifference = cash - previousDayCash;

    const researchProgress = currentProgress ? currentProgress.progress : 0;
    const developmentProgress = developmentInProgress ? hardwareProgress : 0;

    const researchProgressBar = {
        labels: ['Progress', 'Remaining'],
        datasets: [
            {
                data: [researchProgress, 100 - researchProgress],
                backgroundColor: ['#4caf50', '#e0e0e0'],
                hoverBackgroundColor: ['#66bb6a', '#f5f5f5'],
                borderWidth: 0,
            },
        ],
    };

    const developmentProgressBar = {
        labels: ['Progress', 'Remaining'],
        datasets: [
            {
                data: [developmentProgress, 100 - developmentProgress],
                backgroundColor: ['#4caf50', '#e0e0e0'],
                hoverBackgroundColor: ['#66bb6a', '#f5f5f5'],
                borderWidth: 0,
            },
        ],
    };

    const options = {
        cutout: '70%',
        plugins: {
            tooltip: {
                enabled: false,
            },
            legend: {
                display: false,
            },
            datalabels: {
                display: false,
            },
        },
    };

    const speedButtons = [
        { label: 'x0', speed: 0, icon: image_time_pause, showLabel: false },
        { label: 'x1', speed: 1, icon: image_time_1, showLabel: false },
        { label: 'x5', speed: 5, icon: image_time_2, showLabel: false },
        { label: 'x10', speed: 10, icon: image_time_3, showLabel: false },
        { label: 'x100', speed: 100, icon: image_time_3, showLabel: true, dev: true },
        { label: 'x500', speed: 500, icon: image_time_3, showLabel: true, dev: true },
    ];

    return (
        <header className="bg-primary text-white p-4 w-full flex justify-between items-center">
            <div className='w-56'>
                <h1 className="text-2xl">TycoonR: Electronic</h1>
                <div className="flex items-center justify-start w-72">
                    <img src={image_calendar} alt="calendar" className="w-16 h-16" />
                    <p className='text-2xl font-bold'>{formattedDate}</p>
                </div>
                <div className="flex items-center space-x-2">
                    {speedButtons.map(button => (
                        (devMode || (!devMode && !button.dev)) && <  button
                            key={button.speed}
                            className="btn btn-sm flex items-center btn-secondary"
                            onClick={() => dispatch(setGameSpeed(button.speed))}
                            disabled={gameSpeed === button.speed}
                        >
                            <img src={button.icon} alt={`Speed ${button.label}`} className="w-6 h-6 mr-1" />
                            {button.showLabel && <span className='text-sm'>{button.label}</span>}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex items-center space-x-4">
                {currentProject && (
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 relative">
                            <Pie data={researchProgressBar} options={options} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl text-black">{researchProgress}%</span>
                            </div>
                        </div>
                        <p>Research: {currentProject.name}</p>
                    </div>
                )}
                {developmentInProgress && (
                    <div className="flex flex-col items-center relative">
                        <div className="w-24 h-24 relative">
                            <Pie data={developmentProgressBar} options={options} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl text-black">{developmentProgress}%</span>
                            </div>
                        </div>
                        <p>Development: {developmentName}</p>
                        <div className="absolute top-[-50px] left-28">
                            <Hype />
                        </div>
                    </div>

                )}
            </div>
            <div className="flex items-center w-48">
                <div>
                    <div className="flex items-center justify-start space-x-2">
                        <img src={image_cash} alt="cash" className="w-8 h-8" />
                        <p className='text-2xl font-bold'>{formatCash(cash)}</p>
                        <p className={`text-sm ${cashDifference >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {formatCash(cashDifference)}
                        </p>
                    </div>

                    <div className="flex items-center justify-start space-x-2">
                        <img src={image_popularity} alt="popularity" className="w-8 h-8" />
                        <p className='text-2xl font-bold'>{(popularity * 100).toFixed(2)}%</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <img src={image_fans} alt="fans" className="w-8 h-8" />
                        <p className='text-2xl font-bold'>{fans}</p> {/* Updated line to show fans */}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
