import React from 'react';
import image_bank from '@/assets/bank.png';
import image_hardware_development from '@/assets/CPU.png';
import image_marketing from '@/assets/reklama.png';
import image_research from '@/assets/resarge.png';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

interface ButtonGroupProps {
    setActiveWindow: (window: string | null) => void;
}

const ActionButtonGroup: React.FC<ButtonGroupProps> = ({ setActiveWindow }) => {
    const { developmentInProgress } = useSelector((state: RootState) => state.hardware);

    return (
        <div className="flex join">
            {/* Research Dropdown */}
            <div className="dropdown dropdown-top">
                <label tabIndex={0} className="btn btn-primary rounded-none">
                    <img src={image_research} alt="Research" className="w-6 h-6 " />
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                        <a onClick={() => setActiveWindow('Research')}>
                            <img src={image_research} alt="Research Icon" className="w-4 h-4 inline mr-2" />
                            Research
                        </a>
                    </li>
                    {/* Additional options can be added here */}
                </ul>
            </div>

            {/* Hardware Development Dropdown */}
            <div className="dropdown dropdown-top">
                <label tabIndex={0} className="btn btn-primary rounded-none border-l border-l-white">
                    <img src={image_hardware_development} alt="Hardware Development" className="w-6 h-6" />
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li className={developmentInProgress ? "disabled" : ""}>
                        <a onClick={() => !developmentInProgress && setActiveWindow('HardwareDevelopment')}>
                            <img src={image_hardware_development} alt="Hardware Development Icon" className="w-4 h-4 inline mr-2" />
                            Hardware Development
                        </a>
                    </li>
                    {/* Additional options can be added here */}
                </ul>
            </div>

            {/* Marketing Dropdown */}
            <div className="dropdown dropdown-top">
                <label tabIndex={0} className="btn btn-primary rounded-none border-l border-l-white">
                    <img src={image_marketing} alt="Marketing" className="w-6 h-6" />
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li className={!developmentInProgress ? "disabled" : ""}>
                        <a onClick={() => developmentInProgress && setActiveWindow('Marketing')}>
                            <img src={image_marketing} alt="Marketing Icon" className="w-4 h-4 inline mr-2" />
                            Marketing
                        </a>
                    </li>
                    {/* Additional options can be added here */}
                </ul>
            </div>

            {/* Bank Dropdown */}
            <div className="dropdown dropdown-top">
                <label tabIndex={0} className="btn btn-primary rounded-none border-l border-l-white border-r border-r-white mr-2">
                    <img src={image_bank} alt="Bank" className="w-6 h-6" />
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                        <a onClick={() => setActiveWindow('Bank')}>
                            <img src={image_bank} alt="Bank Icon" className="w-4 h-4 inline mr-2" />
                            Bank
                        </a>
                    </li>
                    <li>
                        <a onClick={() => setActiveWindow('MoveOffice')}>
                            <img src={image_bank} alt="Office Icon" className="w-4 h-4 inline mr-2" />
                            Move Office
                        </a>
                    </li>
                    <li>
                        <a onClick={() => setActiveWindow('ListOfEmployees')}>
                            <img src={image_bank} alt="Office Icon" className="w-4 h-4 inline mr-2" />
                            Employees
                        </a>
                    </li>
                    <li>
                        <a onClick={() => setActiveWindow('HireEmployee')}>
                            <img src={image_bank} alt="Office Icon" className="w-4 h-4 inline mr-2" />
                            Hire
                        </a>
                    </li>
                    {/* Additional options can be added here */}
                </ul>
            </div>
        </div>
    );
};

export default ActionButtonGroup;
