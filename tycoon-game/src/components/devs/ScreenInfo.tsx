import React, { useState, useEffect } from 'react';

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        physicalWidth: window.screen.availWidth * window.devicePixelRatio,
        physicalHeight: window.screen.availHeight * window.devicePixelRatio,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
                screenWidth: window.screen.width,
                screenHeight: window.screen.height,
                physicalWidth: window.screen.availWidth * window.devicePixelRatio,
                physicalHeight: window.screen.availHeight * window.devicePixelRatio,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
};


const ScreenInfo: React.FC = () => {
    const windowSize = useWindowSize();

    return (
        <div className="flex flex-col bg-primary mt-2">
            <h3>Screen info</h3>
            <span className='text-xs'>Width: {windowSize.width}px, Height: {windowSize.height}px</span>
            <span className='text-xs'>Screen Width: {windowSize.screenWidth}px, Screen Height: {windowSize.screenHeight}px</span>
            <span className='text-xs'>Physical Width: {windowSize.physicalWidth}px, Physical Height: {windowSize.physicalHeight}px</span>
        </div>
    );
};

export default ScreenInfo;
