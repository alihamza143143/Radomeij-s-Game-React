import React from 'react';
import { Pie } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { formatAmount, formatCash } from '@/utils/numberFormatter';

import image_market from './../assets/svg/market.svg';
import InfoCard from './basic/InfoCard';
import { generateWarmColorFromSeed } from '@/utils/colorUtils';

const TotalMarket: React.FC = () => {
  const currentMarket = useSelector((state: RootState) => state.market.currentMarket);
  const historicalMarket = useSelector((state: RootState) => state.market.historicalMarket);

  // Combine current and historical market entries
  const allMarketEntries = [...currentMarket, ...historicalMarket];

  // Calculate percentage share of each product and ensure percentages sum to 100%
  const productShares = allMarketEntries.map(product => ({
    name: product.productName,
    sales: Math.round(product.totalSales),
  }));

  const totalSalesInt = productShares.reduce((acc, product) => acc + product.sales, 0);
  const playerSalesInt = productShares.filter(product => allMarketEntries.find(p => p.productName === product.name)?.isPlayer).reduce((acc, product) => acc + product.sales, 0);

  const productPercentages = productShares.map(product => ({
    ...product,
    percentage: ((product.sales / totalSalesInt) * 100),
  }));

  // Sort products by sales in descending order and take top 10
  const top10Products = productPercentages.sort((a, b) => b.sales - a.sales).slice(0, 10);

  // Adjust percentages to ensure they sum to 100% in the top 10
  const totalTop10Percentage = top10Products.reduce((acc, product) => acc + Math.round(product.percentage), 0);
  const adjustedTop10Percentages = top10Products.map((product, index, arr) => {
    const adjustedPercentage = Math.round(product.percentage);
    if (index === arr.length - 1 && totalTop10Percentage !== 100) {
      const difference = 100 - totalTop10Percentage;
      return { ...product, percentage: adjustedPercentage + difference };
    }
    return { ...product, percentage: adjustedPercentage };
  });

  // Prepare data for Pie chart
  const pieData = {
    labels: adjustedTop10Percentages.map(product => `${product.name} (${product.percentage}%)`),
    datasets: [
      {
        data: adjustedTop10Percentages.map(product => product.sales),
        backgroundColor: adjustedTop10Percentages.map(product => generateWarmColorFromSeed(product.name)),
        borderColor: adjustedTop10Percentages.map(product => generateWarmColorFromSeed(product.name)),
        borderWidth: 1,
      },
    ],
  };

  const playerMarketShare = totalSalesInt > 0 ? ((playerSalesInt / totalSalesInt) * 100).toFixed(2) : "N/A";

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
    <div className="flex flex-col justify-center">
      <InfoCard image={image_market} text={'Total Market Sales'} />
      <div className="flex justify-around w-full">
        <div className="flex flex-col">
          {allMarketEntries.length > 0 ? (
            <div className="h-64">
              <Pie data={pieData} options={pieOptions} />
            </div>
          ) : (
            <p>No data available</p>
          )}
        </div>
        <div className="ml-8 p-4 bg-gray-300 rounded-lg">
          <h3 className="text-lg md:text-xl mb-2 md:mb-4">Player's Market Share</h3>
          <p className="text-xs mb-2"><strong>Total Market Sales:</strong> {formatAmount(totalSalesInt)}</p>
          <p className="text-xs mb-2"><strong>Player's Sales:</strong> {formatAmount(playerSalesInt)}</p>
          <p className="text-xs mb-2"><strong>Player's Market Share:</strong> {playerMarketShare}%</p>
        </div>
      </div>
    </div >
  );
};

export default TotalMarket;
