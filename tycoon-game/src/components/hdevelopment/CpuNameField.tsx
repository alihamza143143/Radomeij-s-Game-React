import React, { useEffect } from 'react';
import InputField from '../basic/InputField';
import { generateRandomProductName } from '../../utils/randomNameGenerator';

import image_nazwa from './../../assets/reklama.png';

interface NameFieldProps {
    value: string;
    onChange: (name: string, value: string) => void; // Change the type of onChange
    onRandomName: (name: string) => void;
}

const CpuNameField: React.FC<NameFieldProps> = ({ value, onChange, onRandomName }) => {
    const handleGenerateRandomName = () => {
        const randomName = generateRandomProductName();
        onRandomName(randomName);
    };

    useEffect(() => {
        handleGenerateRandomName();
    }, []);

    const handleChange = (name: string, value: string | number) => {
        onChange(name, value as string);
    };

    return (
        <div className="flex flex-row items-center space-x-2">
            <InputField
                label="Name:"
                name="name"
                value={value}
                onChange={handleChange} // Use the new handleChange method
                imageSrc={image_nazwa}
            />
            <div className="flex">
                <button onClick={handleGenerateRandomName} className="btn btn-secondary btn-sm">
                    Random Name
                </button>
            </div>
        </div>
    );
};

export default CpuNameField;
