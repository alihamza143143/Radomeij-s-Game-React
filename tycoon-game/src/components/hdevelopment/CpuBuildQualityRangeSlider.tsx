import React from 'react';

import image_quality from './../../assets/znak jakosci.png';

interface CpuBuildQualityRangeSliderProps {
    value: number;
    onChange: (key: string, value: number) => void;
}

const CpuBuildQualityRangeSlider: React.FC<CpuBuildQualityRangeSliderProps> = ({ value, onChange }) => {
    const getMaxBuildQuality = (): number => {
        return 100;
    };

    const getMinBuildQuality = (): number => {
        return 0;
    };

    const getQualityColor = (quality: number): string => {
        // Clamp the quality value between 0 and 100
        quality = Math.max(0, Math.min(100, quality));

        let red, green;

        if (quality < 50) {
            // From red to yellow (255, 0, 0) to (255, 255, 0)
            red = 255;
            green = Math.round((quality / 50) * 255);
        } else {
            // From yellow to dark green (255, 255, 0) to (0, 128, 0)
            red = Math.round(255 - ((quality - 50) / 50) * 255);
            green = 255 - Math.round(((quality - 50) / 50) * 127);
        }

        // Convert RGB to hex
        const toHex = (value: number) => {
            const hex = Math.round(value).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        const redHex = toHex(red);
        const greenHex = toHex(green);
        const blueHex = '00';  // blue is always 0 in this gradient

        return `#${redHex}${greenHex}${blueHex}`;
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        onChange('buildQuality', newValue);
    };

    return (
        <div className="form-control">
            <div className="flex flex-row">
                <img src={image_quality} alt="product_quality" className="w-12 h-12" />
                <label className="label">
                    <span className="label-text font-bold">Build Quality: {value}%</span>
                </label>
            </div>
            <input
                type="range"
                name="buildQuality"
                min={getMinBuildQuality()}
                max={getMaxBuildQuality()}
                value={value}
                onChange={handleInputChange}
                className="range"
                style={{ '--range-shdw': getQualityColor(value) } as React.CSSProperties}
            />
        </div>
    );
};

export default CpuBuildQualityRangeSlider;
