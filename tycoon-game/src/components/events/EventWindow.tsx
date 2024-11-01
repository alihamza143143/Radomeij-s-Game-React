import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { animated, useSpring } from '@react-spring/web';

import image_event from '@/assets/znak jakosci.png'; // Replace this with your event image asset
import { executeResponse } from '@/store/eventSlice';
import { AppDispatch, RootState } from '@/store/store';
import { setGameSpeed } from '@/store/gameSlice'; // Import the action to control game speed
import InfoCard from '../basic/InfoCard';

interface EventWindowProps {
    eventId: string;
    onClose: () => void;
}

const EventWindow: React.FC<EventWindowProps> = ({ eventId, onClose }) => {
    const dispatch: AppDispatch = useDispatch();
    const event = useSelector((state: RootState) =>
        state.events.events.find(e => e.id === eventId)
    );

    const gameSpeed = useSelector((state: RootState) => state.game.gameSpeed);

    useEffect(() => {
        if (event?.stopTime) {
            dispatch(setGameSpeed(0)); // Stop the game time if stopTime is true
        }

        return () => {
            if (event?.stopTime && gameSpeed !== 0) {
                dispatch(setGameSpeed(1)); // Resume the game time only if the current speed is not 0
            }
        };
    }, [event, gameSpeed, dispatch]);

    if (!event) {
        console.error("Event is null during event display!");
        return null;
    }

    const { value } = useSpring({
        from: { value: 0 },
        to: { value: 100 },
        config: { duration: 500 },
        reset: false,
        loop: false,
    });

    const handleResponseClick = (responseId: number) => {
        dispatch(executeResponse({ eventId, responseId }));
        onClose();
    };

    return (
        <div className="flex items-center justify-center bg-transparent z-[1000] fixed inset-0 glass">
            <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full">
                <InfoCard image={image_event} text={event.message} />
                <div className="flex flex-col justify-center items-center px-2 py-4">
                    <h3 className="mb-4 text-xl text-center">{event.message}</h3>
                    <div className="w-full flex flex-col space-y-2">
                        {event.responses.map(response => (
                            <button
                                key={response.id}
                                onClick={() => handleResponseClick(response.id)}
                                className="btn btn-secondary text-left px-4 py-2"
                            >
                                {response.message}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventWindow;
