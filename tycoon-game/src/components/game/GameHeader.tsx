import 'chart.js/auto';
import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '@/store/store';
import { formatCash } from '@/utils/numberFormatter';
import Hype from '../Hype';
import CircularProgressBaner from '../basic/CircularProgressBaner';
import image_fans from './../../assets/fani.png';
import image_cash from './../../assets/ikona dolar.png';
import image_popularity from './../../assets/rozpoznawalnosc.png';

const GameHeader: React.FC = () => {
    const { cash, previousDayCash } = useSelector((state: RootState) => state.game);
    const { popularity, fans } = useSelector((state: RootState) => state.popularity);
    const { currentProgress, currentProject } = useSelector((state: RootState) => state.research);
    const { progress: hardwareProgress, developmentInProgress, name: developmentName } = useSelector((state: RootState) => state.hardware);

    const cashDifference = cash - previousDayCash;

    const researchProgress = currentProgress ? currentProgress.progress : 0;
    const developmentProgress = developmentInProgress ? hardwareProgress : 0;

    return (
        <div className="w-full flex justify-between items-start">
            <div className="flex flex-row bg-primary rounded-r-full pr-8 p-1 max-w-48">
                {developmentInProgress ? (
                    <div className='flex w-32'>
                        <div className='flex w-20'>
                            <CircularProgressBaner
                                progress={developmentProgress}
                                label={`${developmentName}`}
                            />
                        </div>
                        <Hype />
                    </div>
                ) : (
                    <div className="flex items-center text-primary-content">
                        <span>No Development</span>
                    </div>
                )}
            </div>

            <div className="flex flex-col bg-primary rounded-b-full px-6 py-0">
                <div className="flex flex-row space-x-6">
                    <div className="flex items-center justify-start">
                        <img src={image_cash} alt="cash" className="w-8 h-8" />
                        <p className='text-primary-content'>{formatCash(cash)}</p>
                        <p className={`text-sm ${cashDifference >= 0 ? 'text-green-300' : 'text-red-500'}`}>
                            ({formatCash(cashDifference)})
                        </p>
                    </div>

                    <div className="flex items-center justify-start space-x-2">
                        <img src={image_popularity} alt="popularity" className="w-8 h-8" />
                        <p className='text-primary-content'>{(popularity * 100).toFixed(2)}%</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <img src={image_fans} alt="fans" className="w-8 h-8" />
                        <p className='text-primary-content'>{fans}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col bg-primary rounded-l-full pl-8 p-1 max-w-40">
                {currentProgress ? (
                    <CircularProgressBaner
                        progress={researchProgress}
                        label={`${currentProject?.name ?? ""}`}
                    />
                ) : (
                    <div className="flex items-center text-primary-content">
                        <span>No Research</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameHeader;
