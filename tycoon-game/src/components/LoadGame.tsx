import { deleteState } from '@/store/saves/saves';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch, getGameSaves, loadGameState } from '../store/store';

interface LoadGameProps {
    onClose: () => void;
    onGameLoaded: () => void;
}

const LoadGame: React.FC<LoadGameProps> = ({ onClose, onGameLoaded }) => {
    const dispatch: AppDispatch = useDispatch();
    const [existingSaves, setExistingSaves] = useState<string[]>([]);

    useEffect(() => {
        refreshSaves();
    }, []);

    const handleLoadGame = (name: string) => {
        const state = loadGameState(name);
        if (state) {
            dispatch({ type: 'LOAD_GAME', payload: state });
            onGameLoaded();
            onClose();
        } else {
            alert('Failed to load the game state.');
        }
    };

    const handleDeleteGame = (name: string) => {
        deleteState(name);
        refreshSaves();
    };

    const refreshSaves = () => {
        const saves = getGameSaves();
        setExistingSaves(saves);
    };

    return (
        <div className="flex flex-col justify-between grow bg-white bg-opacity-30 rounded-3xl p-4 m-4">
            <div className='flex flex-col justify-start'>
                <h2 className="font-extrabold text-4xl text-blue-900 btn-text-outline mb-4">LOAD GAME</h2>
                <ul>
                    {existingSaves.map((name) => (
                        <li key={name} className="mb-2 flex justify-between items-center text-white">
                            {name}
                            <div>
                                <button className="btn btn-danger ml-2" onClick={() => handleDeleteGame(name)}>Delete</button>
                                <button className="btn btn-primary ml-2" onClick={() => handleLoadGame(name)}>Load</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="modal-action">
                <button className="btn" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default LoadGame;
