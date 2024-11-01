import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCash, nextDay, subtractCash, setLose } from '../../store/gameSlice';
import { addNotificationWithGameDate } from '../../store/notificationSlice';
import { selectProduct } from '../../store/productReviewSlice';
import { AppDispatch, RootState } from '../../store/store';
import { playSound } from '@/utils/soundUtils';
import { setNextTrack } from '@/store/settingsSlice';
import { v4 as uuidv4 } from 'uuid';
import { addEvent, Event, EventResponse } from '../../store/eventSlice'; // Import Event and EventResponse types

interface DevOptionsProps {
    openWindow: (window: string) => void;
}

const DevOptions: React.FC<DevOptionsProps> = ({ openWindow }) => {
    const dispatch: AppDispatch = useDispatch();
    const products = useSelector((state: RootState) => state.product.products);
    const { day, month, year, cash, previousDayCash, gameSpeed } = useSelector((state: RootState) => state.game);
    
    const handleNextDay = () => {
        dispatch(nextDay());
    };

    const handleAddCash = () => {
        dispatch(addCash(100));
    };

    const handleSubtractCash = () => {
        dispatch(subtractCash(50));
    };

    const handleShowCompletionModal = () => {
        if (products.length > 0) {
            dispatch(selectProduct(products[0].id));
        }
    };

    const handleSendTestNotification = () => {
        dispatch(addNotificationWithGameDate("Test"));
    };

    const handlePlayTestSound = () => {
        console.log("handlePlayTestSound");
        dispatch(playSound(4)); // Odtwarza dźwięk z indeksem 4
    };

    const handleNextTrack = () => {
        console.log("handleNextTrack");
        dispatch(setNextTrack()); // Wywołuje zmianę na następną piosenkę
    };

    const handleLoseGame = () => {
        dispatch(setLose(true)); // Sets the lose flag to true
    };

    const handleGenerateRandomEvent = () => {
        const newEvent: Event = {
            id: uuidv4(),
            title: "My fancy test event",
            message: 'A random event has occurred!',
            date: { day: day, month: month, year: year }, // This should be replaced with the current game date
            priority: Math.floor(Math.random() * 10), // Random priority between 0 and 9
            stopTime: true,
            responses: [
                {
                    id: 1,
                    message: 'Respond positively',
                    data: {},
                },
                {
                    id: 2,
                    message: 'Ignore the event',
                    data: {},
                }
            ]
        };
        dispatch(addEvent(newEvent)); // Dispatch the event to add it to the state
    };

    return (
        <div className="flex space-x-2 mb-2 flex-wrap w-1/2">
            <button className="btn btn-xs btn-warning" onClick={handleNextDay}>Next Day</button>
            <button className="btn btn-xs btn-warning" onClick={handleAddCash}>+ $10000</button>
            <button className="btn btn-xs btn-warning" onClick={handleSubtractCash}>- $5000</button>
            <button className="btn btn-xs btn-warning" onClick={handlePlayTestSound}>Play Test Sound</button>
            <button className="btn btn-xs btn-warning" onClick={handleNextTrack}>Next Track</button>
            <button className="btn btn-xs btn-warning" onClick={handleSendTestNotification}>Send Test Notification</button>
            <button className="btn btn-xs btn-warning" onClick={handleLoseGame}>Set Lose</button>
            <button className="btn btn-xs btn-warning" onClick={handleGenerateRandomEvent}>Generate Random Event</button> {/* New button */}
            <button className="btn btn-xs btn-warning" onClick={() => openWindow('ProductList')}>Competitors Product List</button>
            <button className="btn btn-xs btn-warning" onClick={() => openWindow('CurrentProductList')}>Released Products</button>
            <button className="btn btn-xs btn-warning" onClick={() => openWindow('ConsumentsList')}>Consuments</button>
        </div>
    );
};

export default DevOptions;
