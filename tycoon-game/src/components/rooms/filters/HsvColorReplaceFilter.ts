import * as PIXI from 'pixi.js';

interface ColorMapping {
  oldColorRange: { hue: [number, number], tolerance: number };
  newColor: string;
}

export class HsvColorReplaceFilter extends PIXI.Filter {
  constructor(colorMappings: ColorMapping[]) {
    // Shader fragment
    const fragmentSrc = `
      varying vec2 vTextureCoord;
      uniform sampler2D uSampler;
      uniform vec3 newColors[${colorMappings.length}];
      uniform vec3 oldHues[${colorMappings.length}];
      uniform float tolerances[${colorMappings.length}];

      vec3 rgb2hsv(vec3 c) {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs((q.z + (q.w - q.y) / (6.0 * d + e))), d / (q.x + e), q.x);
      }

      vec3 hsv2rgb(vec3 c) {
        vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
        return c.z * mix(vec3(1.0), rgb, c.y);
      }

      void main(void) {
        vec4 color = texture2D(uSampler, vTextureCoord);
        vec3 hsv = rgb2hsv(color.rgb);

        // Skip conversion if the color is close to grayscale (low saturation)
        if (hsv.y < 0.1) {
          gl_FragColor = color;
          return;
        }

        for (int i = 0; i < ${colorMappings.length}; i++) {
          float hue = hsv.x * 360.0;
          if (hue >= oldHues[i].x - tolerances[i] && hue <= oldHues[i].y + tolerances[i]) {
            // Use hue and saturation from the target color
            hsv.x = newColors[i].x / 360.0;
            hsv.y = newColors[i].y;

            // Adjust the value (brightness) to combine original and target brightness
            hsv.z = hsv.z * newColors[i].z;  // Multiply original brightness by target brightness
            break;
          }
        }

        vec3 newRgb = hsv2rgb(hsv);
        gl_FragColor = vec4(newRgb, color.a);
      }
    `;

    // Initialize arrays with explicit types
    const newColors: [number, number, number][] = [];
    const oldHues: [number, number, number][] = [];
    const tolerances: number[] = [];

    colorMappings.forEach(mapping => {
      const [newR, newG, newB] = hexToRgb(mapping.newColor);
      const [newH, newS, newV] = rgbToHsv(newR, newG, newB); // Take full HSV

      newColors.push([newH, newS, newV]); // Use full HSV values for replacement
      oldHues.push([mapping.oldColorRange.hue[0], mapping.oldColorRange.hue[1], 1.0]);
      tolerances.push(mapping.oldColorRange.tolerance);
    });

    // Pass uniforms to the shader
    super(undefined, fragmentSrc, {
      newColors: newColors.flat(),
      oldHues: oldHues.flat(),
      tolerances: tolerances,
    });
  }
}

// Helper function to convert hex color to RGB
const hexToRgb = (hex: string): [number, number, number] => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
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
  const s = max === 0 ? 0 : delta / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }
    h /= 6;
  }

  return [h * 360, s, v];
};
