import * as PIXI from 'pixi.js';
import React, { useEffect, useRef } from 'react';

interface ColorMapping {
  oldColor: string;
  newColor: string;
}

interface ColorMappedSpritePropsRgb {
  image: string;
  colorMappings: ColorMapping[];
  assetKey: string; // Klucz pod którym tekstura zostanie zarejestrowana
  onTextureReady?: (sprite: PIXI.Texture) => void;
}

const ColorMappedSpriteRgb: React.FC<ColorMappedSpritePropsRgb> = ({ image, colorMappings, assetKey, onTextureReady: onTextureReady }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        const img = new Image();
        img.src = image;
        img.crossOrigin = 'anonymous'; // Ensure that the image can be used in canvas
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);

          // Get image data
          const imageData = context.getImageData(0, 0, img.width, img.height);
          const data = imageData.data;

          // Replace colors based on the mapping
          colorMappings.forEach(({ oldColor, newColor }) => {
            const oldRgb = hexToRgb(oldColor);
            const newRgb = hexToRgb(newColor);
            if (!oldRgb || !newRgb) return;

            for (let i = 0; i < data.length; i += 4) {
              if (
                data[i] === oldRgb.r &&
                data[i + 1] === oldRgb.g &&
                data[i + 2] === oldRgb.b
              ) {
                data[i] = newRgb.r;
                data[i + 1] = newRgb.g;
                data[i + 2] = newRgb.b;
              }
            }
          });

          // Create a texture from the modified buffer
          const baseTexture = PIXI.BaseTexture.fromBuffer(data, img.width, img.height, {
            format: PIXI.FORMATS.RGBA,
            type: PIXI.TYPES.UNSIGNED_BYTE,
            scaleMode: PIXI.SCALE_MODES.NEAREST,
          });
          const texture = new PIXI.Texture(baseTexture);

          // Register the texture in the Assets system
          PIXI.Texture.addToCache(texture, assetKey);

          // If a callback is provided, pass the sprite back
          if (onTextureReady) {
            onTextureReady(texture); // Pass the sprite back if needed
          }
        };
      }
    }
  }, [image, colorMappings, assetKey, onTextureReady]);

  // Helper function to convert hex color to RGB
  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };

  return <canvas ref={canvasRef} style={{ display: 'none' }} />;
};

export default ColorMappedSpriteRgb;
