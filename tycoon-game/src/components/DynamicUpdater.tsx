import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { nextDay } from '../store/gameSlice';

const DynamicUpdater: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const gameSpeed = useSelector((state: RootState) => state.game.gameSpeed);
    const processing = useSelector((state: RootState) => state.game.processing); // Pobranie flagi przetwarzania

    const handleNextDay = () => {
        if (!processing) { // Sprawdzenie flagi przetwarzania
            dispatch(nextDay());
        }else{
            console.error("pominieto dzien z powodu aktywnego przetwarzania");
        }
    };

    useEffect(() => {
        if (gameSpeed <= 0) return; // Do not run the timer if game speed is 0 or less

        const interval = setInterval(() => {
            handleNextDay();
        }, 1000 / gameSpeed); // Adjust the interval time based on gameSpeed

        return () => clearInterval(interval); // Cleanup on unmount or gameSpeed change
    }, [gameSpeed, dispatch, processing]); // Dodanie processing do zależności useEffect

    return null; // This component doesn't render anything
};

export default DynamicUpdater;
