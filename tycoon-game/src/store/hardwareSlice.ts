import { clampToZeroOne } from '@/utils/mathUtils';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Product, ProductAttributes, ProductScores, createProduct } from '../models/Product';
import { resetHype } from './marketingSlice';
import { addProductToMarketThunk } from './marketSlice';
import { addCreatedProduct } from './playerHistorySlice';
import { calculateConsumerRatings } from './productReviewSlice';
import { selectProductById } from './productSlice';
import { loadState } from './saves/actions';
import { AppDispatch, RootState } from './store';
import { scriptApi } from '@/components/mods/ScriptManager'; // Upewnij się, że masz poprawny import scriptApi

export interface HardwareDevelopmentState {
  name: string;
  clockSpeed: number;
  clockSpeedUnit: 'MHz' | 'GHz';
  buildQuality: number;
  progress: number;
  cost: number;
  packageType: 'PGA' | 'DIP';
  cores: number;
  unitCost: number;
  finalPrice: number;
  developmentCost: number;
  developmentInProgress: boolean;
  lithographyType: string;
}

const initialState: HardwareDevelopmentState = {
  name: '',
  clockSpeed: 0,
  clockSpeedUnit: 'MHz',
  buildQuality: 0,
  progress: 0,
  cost: 0,
  packageType: 'PGA',
  cores: 1,
  unitCost: 0,
  finalPrice: 0,
  developmentCost: 0,
  developmentInProgress: false,
  lithographyType: 'NONE'
};

const calculateAttributes = (state: RootState): ProductAttributes => {
  const { products } = state.product;
  const { historicalMarket } = state.market;

  const recentMarketEntries = historicalMarket.slice(-5);
  const recentProducts = recentMarketEntries.map(entry =>
    products.find(product => product.id === entry.productId)
  ).filter(product => product !== undefined) as Product[];

  let avgPrice = recentProducts.length > 0
    ? recentProducts.reduce((sum, prod) => sum + prod.attributes.price, 0) / recentProducts.length
    : 0;

  if (avgPrice === 0) {
    avgPrice = 100;
  }
  avgPrice = 50;

  const priceFactor = (avgPrice * 1.5) - (avgPrice * 0.67);
  const normalizedPrice = (avgPrice * 1.5 - state.hardware.finalPrice) / priceFactor;
  const price = clampToZeroOne(normalizedPrice);

  const brand = state.popularity.popularity + clampToZeroOne(state.marketing.hype / 1000);
  const durability = state.hardware.buildQuality / 100.0;

  return {
    performance: 0, // Obliczane dynamicznie w market thunk
    price,
    brand,
    durability,
  };
};

const calculateScores = (state: RootState): ProductScores => {
  return {
    performance: state.hardware.clockSpeed,
  };
};

export const completeDevelopment = createAsyncThunk<void, void, { state: RootState; dispatch: AppDispatch }>(
  'hardware/completeDevelopment',
  async (_, { dispatch, getState }) => {
    const state = getState();
    const hardware = state.hardware;
    const releaseDate = { month: state.game.month, year: state.game.year };
    const attributes = calculateAttributes(state);
    const scores = calculateScores(state);

    const newProduct: Product = createProduct(hardware.name, releaseDate, attributes, scores);

    const isPlayer = true;
    const price = hardware.finalPrice - hardware.unitCost;

    await dispatch(addProductToMarketThunk({ product: newProduct, isPlayer, price }));

    const updatedState = getState();
    const product = selectProductById(updatedState, newProduct.id);
    if (!product) {
      throw new Error("Product should exist here!");
    }

    await dispatch(addCreatedProduct(product));
    await dispatch(calculateConsumerRatings(product, state.consumers.populations));
    await dispatch(resetHype());

    // Emitowanie zdarzenia po ukończeniu rozwoju
    await scriptApi.emit('onHardwareDevelopmentComplete', { product });
  }
);

const hardwareSlice = createSlice({
  name: 'hardware',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setClockSpeed: (state, action: PayloadAction<number>) => {
      state.clockSpeed = action.payload;
    },
    setClockSpeedUnit: (state, action: PayloadAction<'MHz' | 'GHz'>) => {
      state.clockSpeedUnit = action.payload;
    },
    setBuildQuality: (state, action: PayloadAction<number>) => {
      state.buildQuality = action.payload;
    },
    setPackageType: (state, action: PayloadAction<'PGA' | 'DIP'>) => {
      state.packageType = action.payload;
    },
    setCores: (state, action: PayloadAction<number>) => {
      state.cores = action.payload;
    },
    setFinalPrice: (state, action: PayloadAction<number>) => {
      state.finalPrice = action.payload;
    },
    setLithographyType: (state, action: PayloadAction<string>) => {
      state.lithographyType = action.payload;
    },
    setDevelopmentCost: (state, action: PayloadAction<number>) => {
      state.developmentCost = action.payload;
    },
    startDevelopment: (state) => {
      state.developmentInProgress = true;
      state.progress = 0;
      state.cost = 0;

      // Emitowanie zdarzenia po rozpoczęciu rozwoju
      scriptApi.emit('onHardwareDevelopmentStarted', { hardware: state });
    },
    cancelDevelopment: () => {
      // Emitowanie zdarzenia po anulowaniu rozwoju
      scriptApi.emit('onHardwareDevelopmentCancelled', {});
      return initialState;
    },
    updateProgress: (state, action: PayloadAction<number>) => {
      if (state.progress < 100) {
        state.progress += action.payload;

        // Emitowanie zdarzenia po aktualizacji postępu
        scriptApi.emit('onHardwareDevelopmentProgress', { progress: state.progress });
      }
    },
    setUnitCost: (state, action: PayloadAction<number>) => {
      state.unitCost = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loadState, (state, action: PayloadAction<RootState | undefined>) => {
      return action.payload?.hardware || state;
    });
    builder.addCase(completeDevelopment.fulfilled, () => {
      return initialState; // Reset state after completion
    });
  },
});

export const {
  setName,
  setClockSpeed,
  setClockSpeedUnit,
  setBuildQuality,
  setPackageType,
  setCores,
  setFinalPrice,
  setLithographyType,
  setDevelopmentCost,
  startDevelopment,
  cancelDevelopment,
  updateProgress,
  setUnitCost,
} = hardwareSlice.actions;

export const updateDevelopmentProgress = (progress: number) => (dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState();
  if (!state.hardware.developmentInProgress) {
    return;
  }
  dispatch(updateProgress(progress));
  if (state.hardware.progress >= 100) {
    dispatch(completeDevelopment());
  }
};

export default hardwareSlice.reducer;
