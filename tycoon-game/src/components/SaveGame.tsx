import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch, getGameSaves, saveGameState } from '../store/store';

const SaveGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const dispatch: AppDispatch = useDispatch();
    const [saveName, setSaveName] = useState<string>('');
    const [existingSaves, setExistingSaves] = useState<string[]>([]);
    const [showNotification, setShowNotification] = useState<boolean>(false);

    useEffect(() => {
        refreshSaves();
    }, []);

    const handleSaveGame = () => {
        if (saveName) {
            saveGameState(saveName);
            refreshSaves();
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
            onClose();
        } else {
            alert('Please enter a name for the save.');
        }
    };

    const handleOverwriteSave = (name: string) => {
        setSaveName(name);
        saveGameState(name);
        refreshSaves();
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        onClose();
    };

    const refreshSaves = () => {
        const saves = getGameSaves();
        setExistingSaves(saves);
    };

    const isOverwrite = existingSaves.includes(saveName);

    return (
        <div className="p-4">
            <h2 className="text-2xl mb-4">Save Game</h2>
            <div className="form-control">
                <label className="label">Save Name:</label>
                <input
                    type="text"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    className="input input-bordered w-full mb-4"
                />
                <button
                    className={`btn w-full mb-4 ${isOverwrite ? 'btn-warning' : 'btn-primary'}`}
                    onClick={handleSaveGame}
                >
                    {isOverwrite ? 'Overwrite' : 'Save'}
                </button>
            </div>
            <h3 className="text-xl mb-2">Existing Saves:</h3>
            <ul>
                {existingSaves.map((name) => (
                    <li key={name} className="mb-2 flex justify-between items-center">
                        {name}
                        <button className="btn btn-secondary ml-2" onClick={() => handleOverwriteSave(name)}>Overwrite</button>
                    </li>
                ))}
            </ul>
            <div className="modal-action">
                <button className="btn" onClick={onClose}>Close</button>
            </div>
            {showNotification && (
                <div className="fixed bottom-4 right-4 p-4 bg-green-500 text-white rounded shadow">
                    Save completed successfully!
                </div>
            )}
        </div>
    );
};

export default SaveGame;
