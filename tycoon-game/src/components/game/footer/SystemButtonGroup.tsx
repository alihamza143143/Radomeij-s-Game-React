import React from 'react';

import image_daily_sales from '@/assets/svg/dzisiejszy_market.svg';
import image_market from '@/assets/svg/market.svg';
import image_menu from '@/assets/svg/settings.svg';
import image_created from '@/assets/svg/stworzone_produkty.svg';

interface ButtonGroupSystemProps {
    setActiveWindow: (window: string | null) => void;
}

const SystemButtonGroup: React.FC<ButtonGroupSystemProps> = ({ setActiveWindow }) => {
    return (
        <div className="flex join z-50">
            {/* Market Dropdown */}
            <div className="dropdown dropdown-top dropdown-end">
                <label tabIndex={0} className="btn btn-primary rounded-none">
                    <img src={image_market} alt="Market" className="w-6 h-6" />
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                        <a onClick={() => setActiveWindow('Market')}>
                            <img src={image_market} alt="Market Icon" className="w-4 h-4 inline mr-2" />
                            Market
                        </a>
                    </li>
                    {/* Additional options can be added here */}
                </ul>
            </div>

            {/* Daily Sales Dropdown */}
            <div className="dropdown dropdown-top dropdown-end">
                <label tabIndex={0} className="btn btn-primary rounded-none border-l border-l-white">
                    <img src={image_daily_sales} alt="Daily Sales" className="w-6 h-6" />
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                        <a onClick={() => setActiveWindow('DailyMarket')}>
                            <img src={image_daily_sales} alt="Daily Sales Icon" className="w-4 h-4 inline mr-2" />
                            Daily Sales
                        </a>
                    </li>
                    {/* Additional options can be added here */}
                </ul>
            </div>

            {/* Created Products Dropdown */}
            <div className="dropdown dropdown-top dropdown-end">
                <label tabIndex={0} className="btn btn-primary rounded-none border-l border-l-white">
                    <img src={image_created} alt="Created Products" className="w-6 h-6" />
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                        <a onClick={() => setActiveWindow('CreatedProducts')}>
                            <img src={image_created} alt="Created Products Icon" className="w-4 h-4 inline mr-2" />
                            Created Products
                        </a>
                    </li>
                    {/* Additional options can be added here */}
                </ul>
            </div>

            {/* Menu Dropdown */}
            <div className="dropdown dropdown-top dropdown-end">
                <label tabIndex={0} className="btn btn-primary rounded-none border-l border-l-white">
                    <img src={image_menu} alt="Menu" className="w-6 h-6" />
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                        <a onClick={() => setActiveWindow('MainMenu')}>
                            <img src={image_menu} alt="Menu Icon" className="w-4 h-4 inline mr-2" />
                            Menu
                        </a>
                    </li>
                    {/* Additional options can be added here */}
                </ul>
            </div>
        </div>
    );
};

export default SystemButtonGroup;
