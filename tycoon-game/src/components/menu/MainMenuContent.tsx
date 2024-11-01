import React from 'react';
import MainMenuContentDesktop from './MainMenuContentDesktop';
import MainMenuContentMobile from './MainMenuContentMobile';

interface MainMenuContentProps {
    onStartNewGame: () => void;
    onLoadGame: () => void;
    onOpenSettings: () => void;
}

const MainMenuContent: React.FC<MainMenuContentProps> = (props) => {
    const isMobile = window.innerWidth < 768; // Przykładowy breakpoint dla mobilnych urządzeń

    return (
        <>
            {isMobile ? (
                <MainMenuContentMobile {...props} />
            ) : (
                <MainMenuContentMobile {...props} />
            )}
        </>
    );
};

export default MainMenuContent;
