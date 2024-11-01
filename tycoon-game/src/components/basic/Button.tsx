import React from 'react';

interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    image?: string; // Opcjonalny props image
    disabled?: boolean; // Opcjonalny props disabled
}

const Button: React.FC<ButtonProps> = ({ onClick, children, image, disabled = false }) => {
    return (
        <button 
            className={`btn btn-primary join-item w-42 flex justify-start items-center space-x-1 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={!disabled ? onClick : undefined}
            disabled={disabled}
        >
            {image && <img src={image} alt="Button image" className="w-8 h-8 object-contain" />}
            {/* <span>{children}</span> */}
        </button>
    );
}

export default Button;
