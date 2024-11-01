import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import {
    setName,
    setClockSpeed,
    setBuildQuality,
    setPackageType,
    setCores,
    setFinalPrice,
    setLithographyType,
    setDevelopmentCost,
    setUnitCost,
    startDevelopment,
    cancelDevelopment,
} from '../store/hardwareSlice';
import 'daisyui';
import InputField from './basic/InputField';
import CpuNameField from './hdevelopment/CpuNameField';
import CoreSelect from './hdevelopment/CoreSelect';
import CpuBuildQualityRangeSlider from './hdevelopment/CpuBuildQualityRangeSlider';
import CpuClockRangeSlider from './hdevelopment/CpuClockRangeSlider';
import PackageTypeSelect from './hdevelopment/PackageTypeSelect';
import LithographyTypeSelect from './hdevelopment/LithographyTypeSelect'; // Import the new LithographyTypeSelect component

import image_cpu from './../assets/CPU.png';
import image_dollars from './../assets/ikona dolar.png';
import { isResearchDone } from '../utils/researchUtils'; // Import the isResearchDone function
import { subtractCash } from '../store/gameSlice';
import InfoCard from './basic/InfoCard';
import InfoCardDesktop from './basic/InfoCardDesktop';

interface HardwareDevelopmentProps {
    onClose: () => void; // Add the onClose prop
}

const HardwareDevelopment: React.FC<HardwareDevelopmentProps> = ({ onClose }) => {
    const dispatch = useDispatch();
    const playerCash = useSelector((state: RootState) => state.game.cash);
    const researchState = useSelector((state: RootState) => state.research);

    const [localState, setLocalState] = useState({
        name: '',
        clockSpeed: 0,
        buildQuality: 0,
        packageType: 'PGA' as 'PGA' | 'DIP',
        lithographyType: '', // Add lithographyType to the state
        cores: 1,
        finalPrice: 0,
        developmentCost: 0,
        unitCost: 0,
    });

    const [showOutOfMoney, setShowOutOfMoney] = useState(false);
    const [finalPriceManuallyChanged, setFinalPriceManuallyChanged] = useState(false);
    const [startDevelopmentEnabled, setStartDevelopmentEnabled] = useState(false);

    useEffect(() => {
        const developmentCost = calculateDevelopmentCost(localState);
        const unitCost = developmentCost / 400;
        setLocalState((prevState) => ({
            ...prevState,
            developmentCost,
            unitCost,
        }));
    }, [localState.clockSpeed, localState.buildQuality, localState.cores]);

    useEffect(() => {
        if (!finalPriceManuallyChanged) {
            setLocalState((prevState) => ({
                ...prevState,
                finalPrice: prevState.unitCost + 1,
            }));
        }
    }, [localState.unitCost, finalPriceManuallyChanged]);

    useEffect(() => {
        const researchDone = isResearchDone(researchState.startedResearch, 1);
        setStartDevelopmentEnabled(researchDone && localState.developmentCost <= playerCash);
    }, [researchState, localState.developmentCost, playerCash]); // Add dependencies

    const handleInputChange = (key: string, value: string | number) => {
        setLocalState((prevState) => ({
            ...prevState,
            [key]: key === "clockSpeed" || key === "buildQuality" || key === "finalPrice" ? parseFloat(value as string) : value,
        }));
        if (key === "finalPrice") {
            setFinalPriceManuallyChanged(true);
        }
    };

    const handleStartDevelopment = () => {
        if (localState.developmentCost > playerCash) {
            setShowOutOfMoney(true);
            setTimeout(() => setShowOutOfMoney(false), 3000); // Hide the notification after 3 seconds
            return;
        }
        dispatch(setName(localState.name));
        dispatch(setClockSpeed(localState.clockSpeed));
        dispatch(setBuildQuality(localState.buildQuality));
        dispatch(setPackageType(localState.packageType));
        dispatch(setCores(localState.cores));
        dispatch(setFinalPrice(localState.finalPrice));
        dispatch(setLithographyType(localState.lithographyType));
        dispatch(setDevelopmentCost(localState.developmentCost));
        dispatch(setUnitCost(localState.unitCost));
        dispatch(startDevelopment());
        dispatch(subtractCash(localState.developmentCost));

        onClose();
    };

    const handleCancelDevelopment = () => {
        setLocalState({
            name: '',
            clockSpeed: 0,
            buildQuality: 0,
            packageType: 'PGA',
            lithographyType: '', // Reset lithographyType
            cores: 1,
            finalPrice: 0,
            developmentCost: 0,
            unitCost: 0,
        });
        setFinalPriceManuallyChanged(false);
        dispatch(cancelDevelopment());
    };

    const handleRandomName = (name: string) => {
        setLocalState({
            ...localState,
            name: name,
        });
    };

    const calculateDevelopmentCost = (state: typeof localState) => {
        // Example development cost calculation
        const totalCost = state.clockSpeed * 10 * (state.cores * state.cores) * (1 + state.buildQuality / 100 * 4);
        if (totalCost > playerCash) {
            setShowOutOfMoney(true);
        } else {
            setShowOutOfMoney(false);
        }
        return totalCost;
    };

    return (
        <div className="p-4 space-y-2 ">
            <InfoCard image={image_cpu} text={'CPU Development'}/>
            <CpuNameField
                value={localState.name}
                onChange={handleInputChange}
                onRandomName={handleRandomName}
            />

            <LithographyTypeSelect // Add the LithographyTypeSelect component
                value={localState.lithographyType}
                onChange={handleInputChange}
            />
            <CpuClockRangeSlider
                value={localState.clockSpeed}
                onChange={handleInputChange}
            />
            <CpuBuildQualityRangeSlider
                value={localState.buildQuality}
                onChange={handleInputChange}
            />
            <PackageTypeSelect
                value={localState.packageType}
                onChange={handleInputChange}
            />
            <CoreSelect
                value={localState.cores}
                onChange={handleInputChange}
            />
            <InputField
                label="Final Price:"
                name="finalPrice"
                value={localState.finalPrice}
                onChange={handleInputChange}
                type="number"
                imageSrc={image_dollars}
            />
            <div className="mt-4">
                <p>Development Cost: ${localState.developmentCost.toFixed(2)}</p>
                <p>Unit Cost: ${localState.unitCost.toFixed(2)}</p>
            </div>
            <div className="mt-4">
                <button onClick={handleStartDevelopment} className="btn btn-primary mr-2" disabled={!startDevelopmentEnabled}>Start Development</button>
                <button onClick={handleCancelDevelopment} className="btn btn-secondary">Cancel</button>
            </div>
            {
                showOutOfMoney && (
                    <div className="alert alert-error mt-4">
                        <div>
                            <span>Out of Money! You don't have enough cash to start this development.</span>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default HardwareDevelopment;
