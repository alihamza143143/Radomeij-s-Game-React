import React, { useState } from 'react';
import { Stage, Sprite } from '@pixi/react';
import * as PIXI from 'pixi.js';
import ludzik from '@/assets/bg/human_write_animationnew.png';
import ColorMappedSprite from './ColorMappedSprite';

const LoadTextures: React.FC = () => {
  const [textureKey, setTextureKey] = useState<string | null>(null);

  const handleSpriteReady = (texture: PIXI.Texture) => {
    // Po załadowaniu sprite'a ustawiamy klucz tekstury
    setTextureKey('ludzik-texture');
  };

  const colorMappings = [
    // Bluza (na niebiesko)
    { oldColorRange: { hue: [0, 0] as [number, number], tolerance: 10 }, newColor: '#0000ff' },    // Odcienie czerwieni na niebiesko
    // { oldColorRange: { hue: [350, 360], tolerance: 10 }, newColor: '#00008b' }, // Cień czerwieni na ciemnoniebiesko
  
    // // Spodnie (na zielono)
    // { oldColorRange: { hue: [60, 90], tolerance: 10 }, newColor: '#00ff00' },   // Odcienie zieleni na jasną zieleń
    // { oldColorRange: { hue: [60, 90], tolerance: 10 }, newColor: '#008b00' },   // Cień zieleni na ciemną zieleń
    // { oldColorRange: { hue: [350, 360], tolerance: 10 }, newColor: '#00ff00' }, // Dodatkowy czerwony zamieniany na zieleń
  
    // // Buty (na czerwono)
    // { oldColorRange: { hue: [50, 60], tolerance: 10 }, newColor: '#ff0000' },   // Odcienie żółci na czerwień
    // { oldColorRange: { hue: [50, 60], tolerance: 10 }, newColor: '#8b0000' },   // Cień żółci na ciemnoczerwień
  
    // // Skóra (na brązowo)
    // { oldColorRange: { hue: [200, 220], tolerance: 10 }, newColor: '#8b4513' }, // Odcienie niebieskiego na brąz
    // { oldColorRange: { hue: [200, 220], tolerance: 10 }, newColor: '#5c3317' }, // Cień niebieskiego na ciemny brąz
  
    // // Włosy (na różowo)
    // { oldColorRange: { hue: [270, 290], tolerance: 10 }, newColor: '#ff69b4' }, // Odcienie fioletowego na różowy
    // { oldColorRange: { hue: [270, 290], tolerance: 10 }, newColor: '#db7093' }, // Cień fioletowego na ciemnoróżowy
  ];
  

  return (
    <>
      {/* Komponent do załadowania i mapowania kolorów */}
      <ColorMappedSprite
        image={ludzik}
        colorMappings={colorMappings}
        assetKey="ludzik-texture"
        onTextureReady={handleSpriteReady}
      />

      {/* Stage, który wyświetli załadowany sprite */}
      {textureKey && (
        <Stage width={800} height={600}>
          <Sprite image={textureKey} x={0} y={0} />
        </Stage>
      )}
    </>
  );
};

export default LoadTextures;
