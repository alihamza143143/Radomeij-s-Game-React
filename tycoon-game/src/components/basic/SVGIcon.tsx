import React, { useEffect, useRef, memo } from 'react';

interface SVGIconProps {
  svgPath: string;
  fillColor: string;
  strokeColor: string;
  widthStrokeScale?: number;
}

const SVGIcon: React.FC<SVGIconProps> = ({ svgPath, fillColor, strokeColor, widthStrokeScale = 1 }) => {
  const svgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      fetch(svgPath)
        .then(response => response.text())
        .then(svgText => {
          svgRef.current!.innerHTML = svgText;

          const svgElement = svgRef.current!.querySelector('svg');
          if (svgElement) {
            svgElement.querySelectorAll('[fill="#FFFFFF"]').forEach((element) => {
              (element as HTMLElement).setAttribute('fill', fillColor);
            });
            svgElement.querySelectorAll('[stroke="#FFFFFF"]').forEach((element) => {
              (element as HTMLElement).setAttribute('stroke', strokeColor);
            });
            svgElement.querySelectorAll('[stroke-width]').forEach((element) => {
              const currentStrokeWidth = parseFloat((element as HTMLElement).getAttribute('stroke-width') || '1');
              (element as HTMLElement).setAttribute('stroke-width', (currentStrokeWidth * widthStrokeScale).toString());
            });
          }
        });
    }
  }, [svgPath, fillColor, strokeColor, widthStrokeScale]);

  return <div ref={svgRef} className="w-6 h-6"></div>;
};

export default memo(SVGIcon);
