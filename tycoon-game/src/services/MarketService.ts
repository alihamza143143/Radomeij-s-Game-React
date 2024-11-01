
class MarketService {
    private static instance: MarketService;

    private constructor() { }

    public static getInstance(): MarketService {
        if (!MarketService.instance) {
            MarketService.instance = new MarketService();
        }
        return MarketService.instance;
    }

  

}

export { MarketService };
