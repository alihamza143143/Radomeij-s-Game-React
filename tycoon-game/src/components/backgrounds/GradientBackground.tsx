import React from 'react';
import bgImage from '../../assets/bg.png'; // Ensure the correct path to the image

const GradientBackground: React.FC = () => {
    return (
        <div
            className="absolute inset-0 -z-20  bg-custom-blue"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover', // Add background size to ensure it covers the area
                backgroundRepeat: 'no-repeat', // Avoid repeating the image
            }}
        ></div>
    );
};

export default GradientBackground;
