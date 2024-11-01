import React from 'react';

interface RangeSliderProps {
    label: string;
    name: string;
    value: number;
    min: number;
    max: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    style?: React.CSSProperties;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ label, name, value, min, max, onChange, style }) => (
    <div className="form-control">
        <label className="label">
            <span className="label-text">{label}</span>
        </label>
        <input
            type="range"
            name={name}
            min={min}
            max={max}
            value={value}
            onChange={onChange}
            className="range"
            style={style}
        />
    </div>
);

export default RangeSlider;
