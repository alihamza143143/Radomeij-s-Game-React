import React from 'react';
import { useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { RootState } from '../store/store';
import { MarketEntry } from '../models/Market';

const SalesDashboard: React.FC = () => {
  const currentMarket = useSelector((state: RootState) => state.market.currentMarket);

  const getProductData = (product: MarketEntry) => {
    const last30DaysSales = product.weeklySales.slice(-30).flat(); // Pobranie sprzedaży z ostatnich 30 dni
    const dailySales = product.dailySales;
    const totalSales = product.totalSales;
    const totalProfit = product.totalProfit;
    const weeklySales = product.weeklySales.slice(-1)[0] || 0;

    return { last30DaysSales, dailySales, totalSales, totalProfit, weeklySales };
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Sales Dashboard</h2>
      {currentMarket.map(product => {
        const { last30DaysSales, dailySales, totalSales, totalProfit, weeklySales } = getProductData(product);
        const data = {
          labels: last30DaysSales.map((_, index) => `Day ${index + 1}`),
          datasets: [
            {
              label: `${product.productName} Sales`,
              data: last30DaysSales,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        };

        const options = {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        };

        return (
          <div key={product.productId} className="mb-8">
            <h3 className="text-xl mb-2">{product.productName}</h3>
            <Bar data={data} options={options} />
            <p>Total Sales: {totalSales}</p>
            <p>Total Profit: ${totalProfit.toFixed(2)}</p>
            <p>Daily Sales: {dailySales}</p>
            <p>Weekly Sales: {weeklySales}</p>
          </div>
        );
      })}
    </div>
  );
};

export default SalesDashboard;
