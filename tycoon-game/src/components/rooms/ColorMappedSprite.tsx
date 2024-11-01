import * as PIXI from 'pixi.js';
import React, { useEffect, useRef } from 'react';

interface ColorRange {
  hue: [number, number];
  tolerance: number;
}

interface ColorMapping {
  oldColorRange: ColorRange;
  newColor: string;
}

interface ColorMappedSpriteProps {
  image: string;
  colorMappings: ColorMapping[];
  assetKey: string; // Klucz pod którym tekstura zostanie zarejestrowana
  onTextureReady?: (texture: PIXI.Texture) => void;
}

const ColorMappedSprite: React.FC<ColorMappedSpriteProps> = ({
  image,
  colorMappings,
  assetKey,
  onTextureReady,
}) => {
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

          // Apply the HSV color mapping
          mapColorsHSV(data, colorMappings);

          // Update the canvas with the new image data
          context.putImageData(imageData, 0, 0);

          // Create a texture from the canvas
          const texture = PIXI.Texture.from(canvas);

          // Register the texture in the Assets system
          PIXI.Texture.addToCache(texture, assetKey);

          // If a callback is provided, pass the texture back
          if (onTextureReady) {
            onTextureReady(texture);
          }
        };
      }
    }
  }, [image, colorMappings, assetKey, onTextureReady]);

  // Function to map colors using HSV space
  const mapColorsHSV = (
    data: Uint8ClampedArray,
    mappings: ColorMapping[]
  ) => {
    // Precompute new colors in HSV
    const precomputedMappings = mappings.map((mapping) => ({
      ...mapping,
      newColorHsv: rgbToHsv(...hexToRgb(mapping.newColor)),
    }));

    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b, a] = [
        data[i],
        data[i + 1],
        data[i + 2],
        data[i + 3],
      ];

      // Skip transparent pixels
      if (a === 0) continue;

      const [h, s, v] = rgbToHsv(r, g, b);

      // Special case for black and white to preserve shading
      if (v === 0 || s === 0) {
        continue; // Skip pure black or white pixels
      }

      for (const { oldColorRange, newColorHsv } of precomputedMappings) {
        const { hue, tolerance } = oldColorRange;

        const hueMatch = isHueInRange(h, hue, tolerance);

        if (hueMatch) {
          const [newH, newS, newV] = [
            newColorHsv[0],
            s * newColorHsv[1], // Optional: Adjust saturation
            v * newColorHsv[2], // Optional: Adjust brightness
          ];

          const [newR, newG, newB] = hsvToRgb(newH, newS, newV);

          data[i] = newR;
          data[i + 1] = newG;
          data[i + 2] = newB;
          break; // Stop after first match
        }
      }
    }
  };

  // Helper function to check if hue is within range considering tolerance
  const isHueInRange = (
    hue: number,
    range: [number, number],
    tolerance: number
  ) => {
    const [start, end] = range;
    const adjustedStart = (start - tolerance + 360) % 360;
    const adjustedEnd = (end + tolerance) % 360;

    if (adjustedStart <= adjustedEnd) {
      return hue >= adjustedStart && hue <= adjustedEnd;
    } else {
      // Range crosses the 0 degree point
      return hue >= adjustedStart || hue <= adjustedEnd;
    }
  };

  // Helper function to convert RGB to HSV
  const rgbToHsv = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    let s = max === 0 ? 0 : delta / max;
    let v = max;

    if (delta !== 0) {
      if (max === r) {
        h = ((g - b) / delta) % 6;
      } else if (max === g) {
        h = (b - r) / delta + 2;
      } else {
        h = (r - g) / delta + 4;
      }

      h *= 60;
      if (h < 0) h += 360;
    }

    return [h, s, v];
  };

  // Helper function to convert HSV to RGB
  const hsvToRgb = (h: number, s: number, v: number): [number, number, number] => {
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;

    let r = 0,
      g = 0,
      b = 0;

    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return [r, g, b];
  };

  // Helper function to convert hex color to RGB
  const hexToRgb = (hex: string): [number, number, number] => {
    const normalizedHex = hex.replace('#', '');
    const bigint = parseInt(normalizedHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  };

  return <canvas ref={canvasRef} style={{ display: 'none' }} />;
};

export default ColorMappedSprite;
