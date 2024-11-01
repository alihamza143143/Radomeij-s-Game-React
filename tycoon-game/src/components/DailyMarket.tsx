import React from 'react';
import { Pie } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { formatAmount } from '@/utils/numberFormatter';

import image_daily_sales from './../assets/svg/dzisiejszy_market.svg';
import InfoCard from './basic/InfoCard';
import { generateWarmColorFromSeed } from '@/utils/colorUtils';

const DailyMarket: React.FC = () => {
  const currentMarket = useSelector((state: RootState) => state.market.currentMarket);

  // Calculate percentage share of each product's daily sales and ensure percentages sum to 100%
  const productShares = currentMarket.map(product => ({
    name: product.productName,
    sales: Math.round(product.dailySales),
  }));

  const totalDailySalesInt = productShares.reduce((acc, product) => acc + product.sales, 0);
  const playerDailySalesInt = productShares.filter(product => currentMarket.find(p => p.productName === product.name)?.isPlayer).reduce((acc, product) => acc + product.sales, 0);

  const productPercentages = productShares.map(product => ({
    ...product,
    percentage: ((product.sales / totalDailySalesInt) * 100),
  }));

  // Adjust percentages to ensure they sum to 100%
  const adjustedPercentages = productPercentages.map((product, index, arr) => {
    const adjustedPercentage = Math.round(product.percentage);
    const totalPercentage = arr.reduce((acc, p) => acc + Math.round(p.percentage), 0);
    if (index === arr.length - 1 && totalPercentage !== 100) {
      const difference = 100 - totalPercentage;
      return { ...product, percentage: adjustedPercentage + difference };
    }
    return { ...product, percentage: adjustedPercentage };
  });

  // Prepare data for Pie chart
  const pieData = {
    labels: adjustedPercentages.map(product => `${product.name} (${product.percentage}%)`),
    datasets: [
      {
        data: adjustedPercentages.map(product => product.sales),
        backgroundColor: adjustedPercentages.map(product => generateWarmColorFromSeed(product.name)),
        borderColor: adjustedPercentages.map(product => generateWarmColorFromSeed(product.name)),
        borderWidth: 1,
      },
    ],
  };


  const playerMarketShare = totalDailySalesInt > 0 ? ((playerDailySalesInt / totalDailySalesInt) * 100).toFixed(2) : "N/A";

  const pieOptions = {
    plugins: {
      legend: {
        labels: {
          color: 'black', // Set legend font color to black
        },
      },
    },
    maintainAspectRatio: false,
  };


  return (
    <div className="flex flex-col justify-center w-full">
      <InfoCard image={image_daily_sales} text={'Daily Sales'} />
      <div className="flex justify-around w-full">
        <div className="flex flex-col">
          {currentMarket.length > 0 ? (
            <div className="h-64 ">
              <Pie data={pieData} options={pieOptions} />
            </div>
          ) : (
            <p>No data available</p>
          )}
        </div>
        <div className="ml-8 p-4 bg-gray-300 rounded-lg">
          <h3 className="mb-4">Player's Market Share</h3>
          <p className="text-xs mb-2"><strong>Total Daily Sales:</strong> {formatAmount(totalDailySalesInt)}</p>
          <p className="text-xs mb-2"><strong>Player's Daily Sales:</strong> {formatAmount(playerDailySalesInt)}</p>
          <p className="text-xs mb-2"><strong>Player's Market Share:</strong> {playerMarketShare}%</p>
        </div>
      </div>
    </div>
  );
};

export default DailyMarket;
