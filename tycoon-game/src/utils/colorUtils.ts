export const generateWarmColorFromSeed = (seed: string): string => {
    // Simple hash function to generate a number from a string
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Convert hash to a warm color (Hue: 0-60, 240-360, Saturation and Lightness fixed for warmth)
    const hue = Math.abs(hash % 360);
    const warmHue = hue < 60 ? hue : hue > 240 ? hue : hue % 60;
    return `hsl(${warmHue}, 70%, 60%)`;
  };