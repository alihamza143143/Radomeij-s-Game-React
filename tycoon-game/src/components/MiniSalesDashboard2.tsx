import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { MarketEntry, HistoricalMarketEntry } from '../models/Market';
import { hideProduct } from '../store/playerHistorySlice';
import { HistogramBarChart, HistogramBarSeries, LinearXAxis, LinearXAxisTickSeries } from 'reaviz';

interface MiniSalesDashboardProps {
  productId: number;
}

const MiniSalesDashboard2: React.FC<MiniSalesDashboardProps> = ({ productId }) => {
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
    const last30DaysSales = getLast30DaysSales(product);
    const dailySales = product.dailySales;
    const totalSales = product.totalSales;
    const totalProfit = product.totalProfit;
    const weeklySales = sumLastSeven(product.weeklySales);

    return { last30DaysSales, dailySales, totalSales, totalProfit, weeklySales };
  };

  const getLast30DaysSales = (product: MarketEntry | HistoricalMarketEntry): number[] => {
    const last30DaysSales = product.weeklySales.slice(-30).flat();
    const outOfStockDays = calculateOutOfStockDays(product);
    
    if (outOfStockDays > 0) {
      for (let i = 0; i < outOfStockDays; i++) {
        last30DaysSales.push(0);
      }
    }
    
    return last30DaysSales.slice(-30);
  };

  const calculateOutOfStockDays = (product: MarketEntry | HistoricalMarketEntry): number => {
    if ('endDate' in product && product.endDate) {
      const endDate = new Date(product.endDate);
      const currentDate = new Date(year, month, day);
      return Math.floor((currentDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const { last30DaysSales, dailySales, totalSales, totalProfit, weeklySales } = getProductData(product);

  const getRealData = (last30DaysSales: number[]) => {
    const data = [];
    let currentDate = new Date(year, month, day);
    currentDate.setDate(currentDate.getDate() - last30DaysSales.length);
    for (let i = 0; i < last30DaysSales.length; i++) {
      data.push({
        key: new Date(currentDate),
        data: last30DaysSales[i]
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
  };

  const realData = getRealData(last30DaysSales);

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
    <div className="relative text-xs bg-white">
      <button
        className="absolute top-0 right-0 text-red-500"
        onClick={() => dispatch(hideProduct(productId))}
      >
        X
      </button>
      <h2 className="text-lg mb-2">Product Overview</h2>
      <div className="mb-4">
        <h3 className="text-md mb-1">{product.productName}</h3>
        <p className="text-xs">Total Sales: {totalSales.toFixed(0)}</p>
        <p className="text-xs">Total Profit: ${totalProfit.toFixed(0)}</p>
        <p className="text-xs">Daily Sales: {dailySales.toFixed(0)}</p>
        <p className="text-xs">Weekly Sales: {isInMarket ? weeklySales.toFixed(0) : 0}</p>
        <p className="text-xs">Status: {statusText}</p>
        <div className='h-6'/>
        <HistogramBarChart 
          width={350} 
          height={250} 
          data={realData} 
          xAxis={<LinearXAxis type="time" tickSeries={<LinearXAxisTickSeries interval={5} />} />} 
          series={<HistogramBarSeries binSize={60 * 60 * 24 * 1000} />}  
        />
      </div>
    </div>
  );
};

export default MiniSalesDashboard2;
