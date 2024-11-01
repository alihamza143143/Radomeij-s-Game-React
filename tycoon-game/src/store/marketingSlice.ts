// store/marketingSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, AppDispatch } from './store';
import { loadState } from './saves/actions';
import { subtractCash } from './gameSlice';

// Constants for magic numbers
const CAMPAIGN_MAX_DAYS_ACTIVE = 30;
const HYPE_DIVISOR = 1000;
const NO_CAMPAIGN_PENALTY_DAYS = 7;
const DAILY_HYPE_DECREASE_PERCENTAGE = 0.01;
const INITIAL_HYPE_BOOST_DAYS = 10;  // Boost for the first day of the campaign

// Define the enum for advertisement campaign type
export enum CampaignType {
  Flyers = 'Flyers',
  Posters = 'Posters',
  Magazines = 'Magazines',
  Billboards = 'Billboards',
  TV = 'TV',
  Internet = 'Internet',
}

// Define the enum for regions
export enum Region {
  Africa = 'Africa',
  Asia = 'Asia',
  Australia = 'Australia',
  Europe = 'Europe',
  NorthAmerica = 'North America',
  SouthAmerica = 'South America',
}

interface MarketingCampaign {
  type: CampaignType[];  // Updated to be an array of CampaignType
  cost: number;
  regions: Region[];
  size: number;
  startDate: {
    day: number;
    month: number;
    year: number;
  };
}

export interface MarketingState {
  hype: number;
  campaigns: MarketingCampaign[];
  lastActiveDay: {
    day: number;
    month: number;
    year: number;
  };
}

const initialState: MarketingState = {
  hype: 0,
  campaigns: [],
  lastActiveDay: { day: 0, month: 0, year: 0 },
};

export const startCampaignThunk = createAsyncThunk<void, MarketingCampaign, { state: RootState; dispatch: AppDispatch }>(
  'marketing/startCampaignThunk',
  async (campaign, { dispatch, getState }) => {
    const state = getState();
    const playerCash = state.game.cash;

    if (playerCash >= campaign.cost) {
      // Subtract the campaign cost from player's cash
      dispatch(subtractCash(campaign.cost));

      // Start the campaign
      dispatch(startCampaign(campaign));

      // Add initial hype
      const bonusHype = campaign.cost / (HYPE_DIVISOR * CAMPAIGN_MAX_DAYS_ACTIVE) * INITIAL_HYPE_BOOST_DAYS;
      dispatch(addHype(bonusHype));
    } else {
      // Handle insufficient funds (optional)
      console.warn('Not enough cash to start the campaign');
    }
  }
);

export const updateDailyHype = createAsyncThunk<void, void, { state: RootState; dispatch: AppDispatch }>(
  'marketing/updateDailyHype',
  async (_, { dispatch, getState }) => {
    const state = getState();
    const currentDate = new Date(state.game.year, state.game.month, state.game.day);

    let dailyHype = 0;

    state.marketing.campaigns.forEach(campaign => {
      const campaignStartDate = new Date(campaign.startDate.year, campaign.startDate.month - 1, campaign.startDate.day);
      const daysActive = Math.floor((currentDate.getTime() - campaignStartDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysActive < CAMPAIGN_MAX_DAYS_ACTIVE) { // Campaign is active for a maximum of 30 days
        const dailyCampaignHype = campaign.cost / (HYPE_DIVISOR * CAMPAIGN_MAX_DAYS_ACTIVE);
        // Apply regular daily hype
        dailyHype += dailyCampaignHype;
      }
    });

    // Update last active day if there's a campaign active today
    if (state.marketing.campaigns.length > 0) {
      // console.log("Update last active day if there's a campaign active today", { day: state.game.day, month: state.game.month, year: state.game.year })
      await dispatch(setLastActiveDay({ day: state.game.day, month: state.game.month, year: state.game.year }));
    }

    // Check if a week has passed since the last campaign
    const lastActiveDate = new Date(state.marketing.lastActiveDay.year, state.marketing.lastActiveDay.month, state.marketing.lastActiveDay.day);
    const daysSinceLastCampaign = Math.floor((currentDate.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceLastCampaign > NO_CAMPAIGN_PENALTY_DAYS) {
      // console.log("daysSinceLastCampaign", daysSinceLastCampaign)
      dailyHype -= state.marketing.hype * DAILY_HYPE_DECREASE_PERCENTAGE; // Decrease hype by 1% daily after a week with no campaigns
    }

    await dispatch(addHype(dailyHype));
  }
);

const marketingSlice = createSlice({
  name: 'marketing',
  initialState,
  reducers: {
    addHype: (state, action: PayloadAction<number>) => {
      state.hype += action.payload;
    },
    subtractHype: (state, action: PayloadAction<number>) => {
      state.hype = Math.max(0, state.hype - action.payload);
    },
    startCampaign: (state, action: PayloadAction<MarketingCampaign>) => {
      state.campaigns.push(action.payload);
      state.hype += action.payload.size; // Simple hype addition based on campaign size
    },
    resetHype: (state) => {
      state.campaigns = [];
      state.hype = 0;
    },
    setLastActiveDay: (state, action: PayloadAction<{ day: number; month: number; year: number }>) => {
      state.lastActiveDay = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loadState, (state, action: PayloadAction<RootState | undefined>) => {
      return action.payload?.marketing || state;
    });
  },
});

export const { addHype, subtractHype, startCampaign, resetHype, setLastActiveDay } = marketingSlice.actions;
export default marketingSlice.reducer;
