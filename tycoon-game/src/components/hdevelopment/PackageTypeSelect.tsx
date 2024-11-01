import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import SelectField from '../basic/SelectField';
import { RootState } from '../../store/store';
import { getPackageTypes } from '../../utils/packageUtils';

import image_dip from './../../assets/DIP.png';
import image_plcc from './../../assets/PLCC.png';
import image_pga from './../../assets/PGA.png';

interface PackageTypeSelectProps {
    value: string;
    onChange: (key: string, value: string) => void; 
}

const PackageTypeSelect: React.FC<PackageTypeSelectProps> = ({ value, onChange }) => {
    const researchState = useSelector((state: RootState) => state.research);
    const [packageTypes, setPackageTypes] = useState<Array<{ name: string, pinCount: number }>>([]);

    useEffect(() => {
        const types = getPackageTypes(researchState);
        setPackageTypes(types);
    }, [researchState]);

    const handleChange = (name: string, value: string | number) => {
        onChange(name, value as string); // Call onChange with name and value
    };

    const getImageSrc = (packageName: string) => {
        if (packageName.includes('PLCC')) {
            return image_plcc;
        } else if (packageName.includes('PGA')) {
            return image_pga;
        } else {
            return image_dip; // Default image
        }
    };

    const selectedPackageName = packageTypes.find(pt => `${pt.name}_${pt.pinCount}` === value)?.name || '';
    const imageSrc = getImageSrc(selectedPackageName);

    return (
        <SelectField
            label="Package Type:"
            name="packageType"
            value={value}
            options={packageTypes.map((type) => ({ label: `${type.name} (${type.pinCount} pins)`, value: `${type.name}_${type.pinCount}` }))}
            onChange={handleChange} // Use the new handleChange method
            imageSrc={imageSrc} // Dynamically set the image source based on the selected value
        />
    );
};

export default PackageTypeSelect;
