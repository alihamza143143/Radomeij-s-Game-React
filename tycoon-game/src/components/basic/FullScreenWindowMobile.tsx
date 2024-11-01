import React, { useEffect, useState } from 'react';

interface FullScreenWindowMobileProps {
    onClose: () => void;
    children: React.ReactNode;
}

const FullScreenWindowMobile: React.FC<FullScreenWindowMobileProps> = ({ onClose, children }) => {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        physicalWidth: window.screen.width * window.devicePixelRatio,
        physicalHeight: window.screen.height * window.devicePixelRatio,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
                screenWidth: window.screen.width,
                screenHeight: window.screen.height,
                physicalWidth: window.screen.width * window.devicePixelRatio,
                physicalHeight: window.screen.height * window.devicePixelRatio,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="bg-blue-400 bg-opacity-50 flex items-center justify-center z-20 max-h-screen h-screen w-screen">
            <div className="flex flex-col justify-evenly h-screen w-full overflow-y-auto ">
                {children}
            </div>
        </div>
    );
};

export default FullScreenWindowMobile;
