import React from 'react';
import SelectField from '../basic/SelectField';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { getCoresTypes } from '../../utils/coresUtils';

import image_cores from './../../assets/core.png';

interface CoreSelectProps {
    value: number;
    onChange: (key: string, value: string) => void;
}

const CoreSelect: React.FC<CoreSelectProps> = ({ value, onChange }) => {
    const researchState = useSelector((state: RootState) => state.research);
    
    const getCores = (): Array<{ name: string, cores: number }> => {
        return getCoresTypes(researchState);
    };

    const handleChange = (name: string, value: string | number) => {
        onChange(name, value as string); // Call onChange with name and value
    };


    return (
        <SelectField
            label="Cores:"
            name="cores"
            value={value}
            options={getCores().map((core) => ({ label: core.name, value: core.cores }))}
            onChange={handleChange}
            imageSrc={image_cores}
        />
    );
};

export default CoreSelect;
