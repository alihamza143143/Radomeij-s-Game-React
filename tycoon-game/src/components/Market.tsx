import React from 'react';
import { Pie } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const Market: React.FC = () => {
  const currentMarket = useSelector((state: RootState) => state.market.currentMarket);

  // Calculate percentage share of each product and ensure percentages sum to 100%
  const productShares = currentMarket.map(product => ({
    name: product.productName,
    sales: Math.round(product.totalSales),
  }));

  const totalSalesInt = productShares.reduce((acc, product) => acc + product.sales, 0);
  const playerSalesInt = productShares.filter(product => currentMarket.find(p => p.productName === product.name)?.isPlayer).reduce((acc, product) => acc + product.sales, 0);

  const productPercentages = productShares.map(product => ({
    ...product,
    percentage: ((product.sales / totalSalesInt) * 100),
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
    labels: adjustedPercentages.map(product => `${product.name} - ${product.sales} units (${product.percentage}%)`),
    datasets: [
      {
        data: adjustedPercentages.map(product => product.sales),
        backgroundColor: adjustedPercentages.map((_, index) => `rgba(${(index * 30) % 255}, ${(index * 60) % 255}, ${(index * 90) % 255}, 0.2)`),
        borderColor: adjustedPercentages.map((_, index) => `rgba(${(index * 30) % 255}, ${(index * 60) % 255}, ${(index * 90) % 255}, 1)`),
        borderWidth: 1,
      },
    ],
  };

  const playerMarketShare = totalSalesInt > 0 ? ((playerSalesInt / totalSalesInt) * 100).toFixed(2) : "N/A";

  return (
    <div className="flex">
      <div className="w-2/3">
        <h2 className="text-2xl mb-4">Market Overview</h2>
        {currentMarket.length > 0 ? (
          <div className="mb-8">
            <Pie data={pieData} />
          </div>
        ) : (
          <p>No data available</p>
        )}
      </div>
      <div className="w-1/3 ml-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-xl mb-4">Player's Market Share</h3>
        <p className="mb-2"><strong>Total Market Sales:</strong> {totalSalesInt}</p>
        <p className="mb-2"><strong>Player's Sales:</strong> {playerSalesInt}</p>
        <p className="mb-2"><strong>Player's Market Share:</strong> {playerMarketShare}%</p>
      </div>
    </div>
  );
};

export default Market;
