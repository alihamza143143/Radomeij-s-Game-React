import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import SelectField from '../basic/SelectField';
import { RootState } from '../../store/store';
import { getLithographyTypes } from '../../utils/lithographyUtils';

import image_litografia from './../../assets/linie.png';

interface LithographyTypeSelectProps {
    value: string;
    onChange: (key: string, value: string) => void; // Change the type of onChange
}

const LithographyTypeSelect: React.FC<LithographyTypeSelectProps> = ({ value, onChange }) => {
    const researchState = useSelector((state: RootState) => state.research);
    const [lithographyTypes, setLithographyTypes] = useState<Array<{ name: string, size: string }>>([]);

    useEffect(() => {
        const types = getLithographyTypes(researchState);
        setLithographyTypes(types);
    }, [researchState]);

    const handleChange = (name: string, value: string | number) => {
        onChange(name, value as string);
    };

    return (
        <SelectField
            label="Lithography Type:"
            name="lithographyType"
            value={value}
            options={lithographyTypes.map((type) => ({ label: `${type.name} (${type.size})`, value: `${type.size}` }))}
            onChange={handleChange} // Use the new handleChange method
            imageSrc={image_litografia}
        />
    );
};

export default LithographyTypeSelect;
