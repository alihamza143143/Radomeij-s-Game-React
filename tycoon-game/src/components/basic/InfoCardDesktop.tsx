import React from 'react';

interface CardProps {
    image: string;
    text: string;
}

const InfoCardDesktop: React.FC<CardProps> = ({ image, text }) => {
    return (
        <div className="p-2 bg-base-200 rounded-box shadow-xl flex flex-col items-center">
            <img src={image} alt={text} className="w-8 h-8 object-contain" />
            <h2 className="">{text}</h2>
        </div>
    );
};

export default InfoCardDesktop;
