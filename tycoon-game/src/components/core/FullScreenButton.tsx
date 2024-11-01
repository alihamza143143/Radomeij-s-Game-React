import React, { useState, useEffect } from 'react';

const FullScreenButton: React.FC = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const enterFullScreen = () => {
    const elem = document.documentElement as any; // Casting to `any` to access older methods

    if (!isFullScreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, Opera
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
      }
    } else {
      const doc = document as any; // Casting to `any` to access older methods
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.mozCancelFullScreen) { // Firefox
        doc.mozCancelFullScreen();
      } else if (doc.webkitExitFullscreen) { // Chrome, Safari, Opera
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) { // IE/Edge
        doc.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement || !!(document as any).webkitFullscreenElement || !!(document as any).mozFullScreenElement || !!(document as any).msFullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', handleFullScreenChange);
    document.addEventListener('MSFullscreenChange', handleFullScreenChange);

    // Check the initial fullscreen status when the component mounts
    handleFullScreenChange();

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
    };
  }, []);

  return (
    <div className="flex justify-center items-center">
      <button 
        className="btn btn-primary"
        onClick={enterFullScreen}
      >
        {isFullScreen ? '🗖' : '⛶'} {/* Toggle icon based on fullscreen mode */}
      </button>
    </div>
  );
};

export default FullScreenButton;
