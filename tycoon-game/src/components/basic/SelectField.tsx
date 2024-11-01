import React from 'react';

interface SelectFieldProps {
    label: string;
    name: string;
    value: string | number;
    options: Array<{ label: string; value: string | number }>;
    onChange: (name: string, value: string | number) => void; // Updated type for onChange
    imageSrc?: string; // Optional prop for the image
}

const SelectField: React.FC<SelectFieldProps> = ({ label, name, value, options, onChange, imageSrc }) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(name, e.target.value); // Call onChange with name and value
    };

    return (
        <div className="form-control">
            <div className='flex p-2'>
                {imageSrc && (
                    <img src={imageSrc} alt={label} className="w-12 h-12" />
                )}
                <label className="label">
                    <span className="label-text font-bold">{label}</span>
                </label>
            </div>
            <select name={name} value={value} onChange={handleChange} className="select select-bordered">
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectField;
