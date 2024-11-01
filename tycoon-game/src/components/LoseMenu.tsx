import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setGameSpeed } from '@/store/gameSlice';

interface LoseMenuProps {
    onExitToMainMenu: () => void;
}

const LoseMenu: React.FC<LoseMenuProps> = ({ onExitToMainMenu }) => {
    const dispatch = useDispatch();
    
    // Fetch fans count from the Redux store
    const { fans } = useSelector((state: RootState) => state.popularity);
    const lose = useSelector((state: RootState) => state.game.lose);

    // Use useEffect to set game speed to 0 when lose is true
    useEffect(() => {
        if (lose) {
            dispatch(setGameSpeed(0));
        }
    }, [lose, dispatch]);

    const handleExit = () => {
        onExitToMainMenu();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
            <div className="glass p-8 rounded shadow-lg max-w-3xl w-full">
                <h2 className="text-white text-lg mb-4">Game Over</h2>
                <p className="text-white text-xl mb-6">
                    You have gone bankrupt! Your final fan count is: <strong>{fans}</strong>
                </p>
                <ul className="space-y-4">
                    <li>
                        <button 
                            onClick={handleExit} 
                            className="btn btn-danger w-full py-2 text-xl"
                        >
                            Exit to Main Menu
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default LoseMenu;
