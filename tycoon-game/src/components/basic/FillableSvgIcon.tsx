import React from 'react';
import SVGIcon from './SVGIcon';

interface FillableSvgIconProps {
  countur: string;
  fillShape: string;
  fillColor: string;
  strokeColor: string;
  strokeWidthScale: number;
}

const FillableSvgIcon: React.FC<FillableSvgIconProps> = ({ countur, fillShape, fillColor, strokeColor, strokeWidthScale: strokeWidth }) => {
  return (
    <div className="relative w-6 h-6">
      <div className="absolute inset-0">
        <SVGIcon svgPath={countur} fillColor="none" strokeColor={strokeColor} widthStrokeScale={strokeWidth} />
      </div>
      <div className="absolute inset-0">
        <SVGIcon svgPath={fillShape} fillColor={fillColor} strokeColor="none" />
      </div>
    </div>
  );
};

export default FillableSvgIcon;
