import React from 'react';

interface InputFieldProps {
    label: string;
    name: string;
    value: string | number;
    onChange: (key: string, value: string) => void;
    type?: string;
    imageSrc?: string; // Optional prop for image
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, type = 'text', imageSrc }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            <input
                type={type}
                name={name}
                value={value}
                onChange={handleChange} // Use the new handleChange method
                className="input input-bordered w-full max-w-xs"
            />
        </div>
    );
};

export default InputField;
