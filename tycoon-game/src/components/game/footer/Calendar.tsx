import React from 'react';
import image_calendar from '@/assets/czas.png';

interface CalendarProps {
    formattedDate: string;
}

const Calendar: React.FC<CalendarProps> = ({ formattedDate }) => {
    return (
        <div className="bg-primary pr-5 rounded-tr-full">
            <div className="flex items-center justify-start space-x-1">
                <img src={image_calendar} alt="calendar" className="w-7 h-7" />
                <p className='text-xs text-primary-content'>{formattedDate}</p>
            </div>
        </div>
    );
};

export default Calendar;
