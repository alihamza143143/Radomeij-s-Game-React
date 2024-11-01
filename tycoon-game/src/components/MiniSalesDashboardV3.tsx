import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { RootState } from '../store/store';
import { MarketEntry, HistoricalMarketEntry } from '../models/Market';
import { hideProduct } from '../store/playerHistorySlice';
import { formatAmount } from '@/utils/numberFormatter';

interface MiniSalesDashboardProps {
  productId: number;
  daysToShow?: number; // Nowy opcjonalny parametr
}

const MiniSalesDashboardV3: React.FC<MiniSalesDashboardProps> = ({ productId, daysToShow = 14 }) => {
  const dispatch = useDispatch();
  const currentMarket = useSelector((state: RootState) => state.market.currentMarket);
  const historicalMarket = useSelector((state: RootState) => state.market.historicalMarket);
  const { day, month, year } = useSelector((state: RootState) => state.game);

  const product = currentMarket.find(product => product.productId === productId) ||
    historicalMarket.find(product => product.productId === productId);

  if (!product) {
    return <p className="text-xs">Product not found.</p>;
  }

  const sumLastSeven = (sales: number[]): number => {
    const lastSeven = sales.slice(-7);
    return lastSeven.reduce((sum, value) => sum + value, 0);
  };

  const getProductData = (product: MarketEntry | HistoricalMarketEntry) => {
    const lastDaysSales = getLastDaysSales(product, daysToShow);
    const dailySales = product.dailySales;
    const totalSales = product.totalSales;
    const totalProfit = product.totalProfit;
    const weeklySales = sumLastSeven(product.weeklySales);

    return { lastDaysSales, dailySales, totalSales, totalProfit, weeklySales };
  };

  const getLastDaysSales = (product: MarketEntry | HistoricalMarketEntry, days: number): number[] => {
    const lastDaysSales = product.weeklySales.slice(-days).flat();
    const outOfStockDays = calculateOutOfStockDays(product);
    const totalSalesDays = lastDaysSales.length + outOfStockDays;

    if (totalSalesDays < days) {
      const daysToFill = days - totalSalesDays;
      for (let i = 0; i < daysToFill; i++) {
        lastDaysSales.unshift(0);
      }
    }

    if (outOfStockDays > 0) {
      for (let i = 0; i < outOfStockDays; i++) {
        lastDaysSales.push(0);
      }
    }

    return lastDaysSales.slice(-days);
  };

  const calculateOutOfStockDays = (product: MarketEntry | HistoricalMarketEntry): number => {
    if ('endDate' in product && product.endDate) {
      const endDate = new Date(product.endDate);
      const currentDate = new Date(year, month, day);
      return Math.floor((currentDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const { lastDaysSales, dailySales, totalSales, totalProfit, weeklySales } = getProductData(product);

  const getLabels = (lastDaysSales: number[]) => {
    const labels = [];
    let currentDate = new Date(year, month, day);
    currentDate.setDate(currentDate.getDate() - lastDaysSales.length);
    for (let i = 0; i < lastDaysSales.length; i++) {
      labels.push(currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })); // Formatowanie daty (DD/MM)
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return labels;
  };

  const data = {
    labels: getLabels(lastDaysSales),
    datasets: [
      {
        label: `${product.productName} Sales`,
        data: lastDaysSales,
        backgroundColor: '#f1913c',
        borderColor: '#f1913c',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        grid: {
          display: false, // Ukrywa linie pionowe
        },
        ticks: {
          display: false,
          font: {
            size: 8, // Zmiana wielkości czcionki na osi X
            color: 'white',
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          display: true,
          font: {
            size: 10, // Zmiana wielkości czcionki na osi X
            weight: 700,
          },
          color: 'white',
          // callback: function (value: number | string): string {
          //   // Zakładając, że value jest typu number
          //   const numValue = typeof value === 'string' ? parseFloat(value) : value;
          //   return formatAmount(numValue); // Dodaje znak dolara przed wartością
          // },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        labels: {
          font: {
            size: 8,
          },
        },
      },
    },
  };

  const isInMarket = currentMarket.some(p => p.productId === productId);

  let statusText = 'In Market';
  if (!isInMarket) {
    const historicalProduct = historicalMarket.find(p => p.productId === productId);
    if (historicalProduct && historicalProduct.endDate) {
      const endDate = new Date(historicalProduct.endDate);
      const currentDate = new Date(year, month, day);
      const daysOutOfMarket = Math.floor((currentDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
      statusText = `Out of Market for ${daysOutOfMarket} days`;
    }
  }

  return (
    <div className="relative flex flex-col bg-primary bg-opacity-80 rounded ml-1">
      <button
        className="absolute top-0 right-0 text-red-500"
        onClick={() => dispatch(hideProduct(productId))}
      >
        X
      </button>
      <div className=" mb-4">
        <div className="flex">
          <span className="text-xs">{product.productName}</span>
          <span className="text-xs self-center">({statusText})</span>
        </div>
        <div className="flex space-x-2 hidden">
          <p className="text-xs">Total Sales: {totalSales.toFixed(0)}</p>
          <p className="text-xs">Total Profit: ${totalProfit.toFixed(0)}</p>
          <p className="text-xs">Daily Sales: {dailySales.toFixed(0)}</p>
          <p className="text-xs">Weekly Sales: {isInMarket ? weeklySales.toFixed(0) : 0}</p>
        </div>
        <div className="flex space-x-2 w-48">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default MiniSalesDashboardV3;
