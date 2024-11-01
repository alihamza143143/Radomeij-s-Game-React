import React from 'react';

interface CardProps {
    image: string;
    text: string;
}

const InfoCard: React.FC<CardProps> = ({ image, text }) => {
    return (
        <div className="p-2 bg-primary rounded-t-box  flex flex-row h-8 justify-center">
            <img src={image} alt={text} className="w-6 h-6 self-center" />
            <h2 className="font-bold self-center text-primary-content">{text}</h2>
        </div>
    );
};

export default InfoCard;
