import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { getMaxClockSpeed } from '../../utils/clockSpeedUtils';

import image_cpu_clock from './../../assets/taktowanie.png';

interface CpuClockRangeSliderProps {
    value: number;
    onChange: (key: string, value: number) => void;
}

const CpuClockRangeSlider: React.FC<CpuClockRangeSliderProps> = ({ value, onChange }) => {
    const researchState = useSelector((state: RootState) => state.research);

    // Use useMemo to get the max speed once
    const maxSpeedKHz = useMemo(() => getMaxClockSpeed('kHz', researchState), [researchState]);
    const initialValue = maxSpeedKHz * 0.5;

    // Initialize local state
    const [localValue, setLocalValue] = useState(initialValue);
    const [localUnit, setLocalUnit] = useState<'kHz' | 'MHz' | 'GHz'>('kHz');

    // Update local value when the value prop changes
    useEffect(() => {
        const newValue = convertClockSpeed(value, 'kHz', localUnit);
        setLocalValue(newValue);
    }, [value, localUnit]);

    // Update initial value once maxSpeedKHz is known
    useEffect(() => {
        setLocalValue(initialValue);
        onChange('clockSpeed', initialValue);
    }, [initialValue]);


    const convertClockSpeed = (value: number, fromUnit: 'kHz' | 'MHz' | 'GHz', toUnit: 'kHz' | 'MHz' | 'GHz'): number => {
        if (fromUnit === toUnit) return value;
        let baseValue: number;

        // Convert from any unit to base kHz first
        if (fromUnit === 'GHz') {
            baseValue = value * 1_000_000;
        } else if (fromUnit === 'MHz') {
            baseValue = value * 1000;
        } else {
            baseValue = value;
        }

        // Convert from base kHz to target unit
        if (toUnit === 'GHz') {
            return baseValue / 1_000_000;
        } else if (toUnit === 'MHz') {
            return baseValue / 1000;
        } else {
            return baseValue;
        }
    };

    const handleMaxClockSpeed = () => {
        setLocalValue(maxSpeedKHz);
        onChange('clockSpeed', maxSpeedKHz);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        const convertedValue = convertClockSpeed(newValue, localUnit, 'kHz');
        setLocalValue(convertedValue);
        onChange('clockSpeed', convertedValue);
    };

    const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newUnit = e.target.value as 'kHz' | 'MHz' | 'GHz';
        const newValue = convertClockSpeed(localValue, localUnit, newUnit);
        setLocalUnit(newUnit);
        setLocalValue(newValue);
    };

    const getMaxSpeedPercentage = (): number => {
        return (localValue / maxSpeedKHz) * 100;
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

    const isMHzAvailable = maxSpeedKHz >= 1000; // 1 MHz = 1000 kHz
    const isGHzAvailable = maxSpeedKHz >= 1_000_000; // 1 GHz = 1,000,000 kHz

    return (
        <div className="flex form-control">
            <div className="flex flex-row">
                <img src={image_cpu_clock} alt="cpu_clock" className="w-12 h-12" />
                <label className="label">
                    <span className="label-text font-bold">Clock Speed: {convertClockSpeed(localValue, 'kHz', localUnit)} {localUnit}</span>
                </label>
            </div>
            <div className="flex items-center">
                <input
                    type="range"
                    name="clockSpeed"
                    min={0}
                    max={convertClockSpeed(maxSpeedKHz, 'kHz', localUnit)}
                    value={convertClockSpeed(localValue, 'kHz', localUnit)}
                    onChange={handleInputChange}
                    className="range"
                    style={{ '--range-shdw': getQualityColor(100 - getMaxSpeedPercentage()) } as React.CSSProperties}
                />
                <button onClick={handleMaxClockSpeed} className="btn btn-primary btn-sm ml-2">Max</button>
            </div>
            <div className="flex items-center mt-2">
                <input
                    type="number"
                    name="clockSpeed"
                    value={convertClockSpeed(localValue, 'kHz', localUnit)}
                    onChange={handleInputChange}
                    className="input input-bordered w-full max-w-xs mr-2"
                />
                <select name="clockSpeedUnit" value={localUnit} onChange={handleUnitChange} className="select select-bordered">
                    <option value="kHz">kHz</option>
                    <option value="MHz" disabled={!isMHzAvailable}>MHz</option>
                    <option value="GHz" disabled={!isGHzAvailable}>GHz</option>
                </select>
            </div>
        </div>
    );
};

export default CpuClockRangeSlider;
