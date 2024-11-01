import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startCampaignThunk, CampaignType, Region } from '../store/marketingSlice';
import { RootState, AppDispatch } from '../store/store';
import { formatCash } from '../utils/numberFormatter';

import image_marketing from './../assets/reklama.png';

import image_flyers from './../assets/svg/marketing_ulotki.svg';
import image_poster from './../assets/svg/marketing_plakaty.svg';
import image_magazines from './../assets/svg/marketing_gazety.svg';
import image_billboards from './../assets/svg/marketing_bilord.svg';
import image_tv from './../assets/svg/marketing_tv.svg';
import image_internet from './../assets/svg/marketing_internet.svg';

import image_africa from './../assets/svg/mapka_afryka.svg';
import image_asia from './../assets/svg/mapka_azja.svg';
import image_australia from './../assets/svg/mapka_australia.svg';
import image_europe from './../assets/svg/mapka_europa.svg';
import image_north_america from './../assets/svg/mapka_ameryka_polnocna.svg';
import image_south_america from './../assets/svg/mapka_ameryka_polodniowa.svg';
import InfoCard from './basic/InfoCard';

const regionIcons = {
  [Region.Africa]: <img src={image_africa} alt="Africa" width="16" height="16" />,
  [Region.Asia]: <img src={image_asia} alt="Asia" width="16" height="16" />,
  [Region.Australia]: <img src={image_australia} alt="Australia" width="16" height="16" />,
  [Region.Europe]: <img src={image_europe} alt="Europe" width="16" height="16" />,
  [Region.NorthAmerica]: <img src={image_north_america} alt="North America" width="16" height="16" />,
  [Region.SouthAmerica]: <img src={image_south_america} alt="South America" width="16" height="16" />,
};

const campaignOptions = [
  { type: CampaignType.Flyers, cost: 5000, image: image_flyers },
  { type: CampaignType.Posters, cost: 13000, image: image_poster },
  { type: CampaignType.Magazines, cost: 50000, image: image_magazines },
  { type: CampaignType.Billboards, cost: 150000, image: image_billboards },
  { type: CampaignType.TV, cost: 400000, image: image_tv, unlockedYear: 1975 },
  { type: CampaignType.Internet, cost: 1000000, image: image_internet, unlockedYear: 2000 },
];

interface MarketingProps {
  onClose: () => void;
}

const Marketing: React.FC<MarketingProps> = ({ onClose }) => {
  const dispatch: AppDispatch = useDispatch();
  const playerCash = useSelector((state: RootState) => state.game.cash);

  const inGameDay = useSelector((state: RootState) => state.game.day);
  const inGameMonth = useSelector((state: RootState) => state.game.month);
  const inGameYear = useSelector((state: RootState) => state.game.year);

  const [campaignTypes, setCampaignTypes] = useState<CampaignType[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [size, setSize] = useState<number>(1);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [canAfford, setCanAfford] = useState<boolean>(true);

  const regionsList = [
    { region: Region.Africa, multiplier: 1.0 },
    { region: Region.Asia, multiplier: 1.1 },
    { region: Region.Australia, multiplier: 1.0 },
    { region: Region.Europe, multiplier: 1.2 },
    { region: Region.NorthAmerica, multiplier: 1.3 },
    { region: Region.SouthAmerica, multiplier: 1.0 },
  ];

  useEffect(() => {
    const baseCost = campaignTypes.reduce((acc, campaignType) => {
      const selectedCampaign = campaignOptions.find(c => c.type === campaignType);
      return selectedCampaign ? acc + selectedCampaign.cost * size : acc;
    }, 0);

    const totalMultiplier = regions.reduce((acc, region) => {
      const regionMultiplier = regionsList.find(r => r.region === region)?.multiplier || 1;
      return acc * regionMultiplier;
    }, 1);

    const finalCost = baseCost * totalMultiplier;
    setTotalCost(finalCost);

    const canStartCampaign = finalCost > 0 && playerCash >= finalCost && playerCash >= 0 && regions.length > 0;
    setCanAfford(canStartCampaign);
  }, [campaignTypes, regions, size, playerCash]);

  const handleStartCampaign = () => {
    if (campaignTypes.length > 0 && regions.length > 0) {
      const baseCost = campaignTypes.reduce((acc, campaignType) => {
        const selectedCampaign = campaignOptions.find(c => c.type === campaignType);
        return selectedCampaign ? acc + selectedCampaign.cost * size : acc;
      }, 0);

      const campaign = {
        type: campaignTypes,
        cost: baseCost,
        regions,
        size,
        startDate: {
          day: inGameDay,
          month: inGameMonth + 1,
          year: inGameYear,
        },
      };

      dispatch(startCampaignThunk(campaign));
      onClose();
    }
  };

  const handleCampaignTypeToggle = (campaignType: CampaignType) => {
    if (campaignTypes.includes(campaignType)) {
      setCampaignTypes(campaignTypes.filter(type => type !== campaignType));
    } else {
      setCampaignTypes([...campaignTypes, campaignType]);
    }
  };

  const handleRegionToggle = (region: Region) => {
    if (regions.includes(region)) {
      setRegions(regions.filter(r => r !== region));
    } else {
      setRegions([...regions, region]);
    }
  };

  return (
    <div className="p-4">
      <InfoCard image={image_marketing} text={'Marketing'} />
      <div className="form-control">
        <label className="label">Campaign Types:</label>
        <div className="flex flex-wrap">
          {campaignOptions.map((option) => (
            <label key={option.type} className="cursor-pointer label">
              <input
                type="checkbox"
                className="checkbox"
                checked={campaignTypes.includes(option.type)}
                onChange={() => handleCampaignTypeToggle(option.type)}
              />
              <span className="label-text ml-2 flex items-center">
                <img src={option.image} alt={option.type} width="16" height="16" className="mr-2" />
                {option.type} ({formatCash(option.cost)})
              </span>
            </label>
          ))}
        </div>
        {campaignTypes.length === 0 && (
          <div role="alert" className="alert alert-warning mt-2">
            <span>Choose at least one campaign type!</span>
          </div>
        )}
      </div>
      <div className="form-control">
        <label className="label">Regions:</label>
        <div className="flex flex-wrap">
          {regionsList.map(({ region, multiplier }) => (
            <label key={region} className="cursor-pointer label">
              <input
                type="checkbox"
                className="checkbox"
                checked={regions.includes(region)}
                onChange={() => handleRegionToggle(region)}
              />
              <span className="label-text ml-2 flex items-center">
                {regionIcons[region]}
                <span className="ml-2">{region} (x{multiplier.toFixed(1)})</span>
              </span>
            </label>
          ))}
        </div>
        {regions.length === 0 && (
          <div role="alert" className="alert alert-warning mt-2">
            <span>Choose at least one region!</span>
          </div>
        )}
      </div>
      <div className="form-control">
        <label className="label">Campaign Size:</label>
        <input
          type="range"
          min="1"
          max="10"
          value={size}
          onChange={e => setSize(Number(e.target.value))}
          className="range"
        />
        <div className="flex justify-between">
          <span>1x</span>
          <span>10x</span>
        </div>
      </div>
      <div className="form-control">
        <label className="label">Total Cost: {formatCash(totalCost)}</label>
        {!canAfford && totalCost > 0 && (
          <div role="alert" className="alert alert-error">
            <span>Missing money for this!</span>
          </div>
        )}
      </div>
      <button
        onClick={handleStartCampaign}
        className="btn btn-primary mt-4"
        disabled={!canAfford}
      >
        Start Campaign
      </button>
    </div>
  );
};

export default Marketing;
