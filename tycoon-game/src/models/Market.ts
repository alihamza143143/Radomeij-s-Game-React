export interface MarketEntry {
    productId: number;
    productName: string;
    totalProfit: number;
    totalSales: number;
    dailySales: number;
    weeklySales: number[];
    daysOnMarket: number;
    productionCost: number;
    tempLikelihood?: number; // Temporary field for calculations
    tmpSureBuyers?: number;  // Temporary field for calculations
    isPlayer: boolean;
    popularity: number;
    price: number;
    hype: number;
}

export interface HistoricalMarketEntry extends MarketEntry {
    endDate: string;
}
