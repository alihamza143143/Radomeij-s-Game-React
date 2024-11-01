// ImageBackground.tsx
import React from 'react';

interface ImageBackgroundProps {
  backgroundImage: string;
  children: React.ReactNode;
}

const ImageBackground: React.FC<ImageBackgroundProps> = ({ backgroundImage, children }) => {
  return (
    <div
      className="relative w-full h-full flex flex-col justify-end -z-25"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="flex justify-center space-x-4 p-4">
        {children}
      </div>
    </div>
  );
};

export default ImageBackground;
