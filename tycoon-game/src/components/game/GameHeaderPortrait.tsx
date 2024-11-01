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
import CircularProgress from '../basic/CircularProgress';

const GameHeaderPortrait: React.FC = () => {


    const { cash, previousDayCash } = useSelector((state: RootState) => state.game);
    const { popularity, fans } = useSelector((state: RootState) => state.popularity); // Updated line
    const { currentProgress, currentProject } = useSelector((state: RootState) => state.research);
    const { progress: hardwareProgress, developmentInProgress, name: developmentName } = useSelector((state: RootState) => state.hardware);

    const cashDifference = cash - previousDayCash;

    const researchProgress = currentProgress ? currentProgress.progress : 0;
    const developmentProgress = developmentInProgress ? hardwareProgress : 0;





    return (
        <div className="w-full flex flex-col justify-around items-start">
            <div className="flex flex-col bg-primary py-2 w-full">
                <div className="flex flex-row space-x-6 grow">
                    <div className="flex items-center justify-start space-x-2">
                        <img src={image_cash} alt="cash" className="w-8 h-8" />
                        <p className='text font-bold text-primary-content'>{formatCash(cash)}</p>
                        <p className={`text-sm ${cashDifference >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {formatCash(cashDifference)}
                        </p>
                    </div>

                    <div className="flex items-center justify-start space-x-2">
                        <img src={image_popularity} alt="popularity" className="w-8 h-8" />
                        <p className='text font-bold text-primary-content'>{(popularity * 100).toFixed(2)}%</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <img src={image_fans} alt="fans" className="w-8 h-8" />
                        <p className='text font-bold text-primary-content'>{fans}</p> {/* Updated line to show fans */}
                    </div>
                </div>
            </div>

            <div className="flex flex-row w-full space-x-2 justify-between">
                <div className="flex flex-row bg-primary rounded-r-full pr-8 p-2 max-w-72">
                    <CircularProgressBaner
                        progress={developmentProgress}
                        label={`Development: ${developmentName}`}
                    />
                    <Hype />
                </div>


                <div className="flex flex-col bg-primary rounded-l-full pl-8 p-2 max-w-72">
                    <CircularProgressBaner
                        progress={researchProgress}
                        label={`Research: ${currentProject?.name ?? ""}`}
                    />
                </div>
            </div>
        </div>
    );
};

export default GameHeaderPortrait;
