import React from 'react';
import GradientBackground from '../backgrounds/GradientBackground';
import ParticlesBackground from '../backgrounds/ParticlesBackground'; // Import the particles background component

interface LoadingScreenProps {
  text?: string;
  progress?: number;
}



const LoadingScreen: React.FC<LoadingScreenProps> = ({  progress = 0 }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center">
      {/* Backgrounds */}
      <GradientBackground /> {/* Gradient background */}
      <ParticlesBackground /> {/* Particles background */}

      <div className="w-[600px] space-y-8 z-10">
        {/* Loading Text */}
        <div>
  <svg width="0" height="0">
    <defs>
      <filter id="rounded-stroke">
        <feMorphology in="SourceAlpha" operator="dilate" radius="5" result="dilated" />{/* Increase the radius for a thicker outline */}
        <feFlood floodColor="white" result="white-fill" />
        <feComposite in="white-fill" in2="dilated" operator="in" result="outline" />
        <feMerge>
          <feMergeNode in="outline" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  </svg>

  <div className="text1-outline text-center">
    LOADING...
  </div>
</div>


        {/* Progress Bar Container */}
        <div className="w-full h-16 bg-[#FFFFFF80] rounded-full overflow-hidden shadow-inner">
          {/* Progress Bar Fill */}
          <div
            className="h-12 bg-custom-blue bg-opacity-90 rounded-full transition-all duration-5000 ease-in-out"
            style={{
              width: `${Math.min(Math.max(progress, 0), 100)}%`,
              margin: '8px' // Keep the margin to create equal gaps
            }}
          />
        </div>

        {/* Optional Progress Percentage */}
        <div className="text-[#C1E4FF] text-center text-xl font-semibold">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
