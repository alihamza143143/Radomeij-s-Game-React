import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { ConsumerPopulation, updateMonthlyPopulation } from '../models/ConsumerPopulation';
import { loadState } from './saves/actions';
import { scriptApi } from '@/components/mods/ScriptManager'; // Upewnij się, że masz poprawny import scriptApi

export interface ConsumerState {
    populations: ConsumerPopulation[];
}

const initialState: ConsumerState = {
    populations: [],
};

const consumerSlice = createSlice({
    name: 'consumer',
    initialState,
    reducers: {
        addConsumer: (state, action: PayloadAction<ConsumerPopulation>) => {
            state.populations.push(action.payload);

            // Emitowanie zdarzenia onConsumerAdded po dodaniu nowego konsumenta
            scriptApi.emit('onConsumerAdded', { consumer: action.payload });
        },
        loadConsumers: (state, action: PayloadAction<ConsumerPopulation[]>) => {
            state.populations = action.payload;

            // Emitowanie zdarzenia onConsumersLoaded po załadowaniu konsumentów
            scriptApi.emit('onConsumersLoaded', { consumers: state.populations });
        },
        incrementMonthly: (state, action: PayloadAction<{ year: number, month: number }>) => {
            const { year, month } = action.payload;
            state.populations = state.populations.map(population => updateMonthlyPopulation(population, year, month));
        },
        updateExhausted: (state, action: PayloadAction<{ consumerId: string; newExhaused: number }>) => {
            const { consumerId, newExhaused } = action.payload;
            const consumer = state.populations.find(c => c.name === consumerId);
            if (consumer) {
                consumer.exhaused = newExhaused;

                // Emitowanie zdarzenia onConsumerExhaustedUpdated po aktualizacji wyczerpania konsumenta
                scriptApi.emit('onConsumerExhaustedUpdated', { consumerId, newExhaused });
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadState, (state, action: PayloadAction<RootState | undefined>) => {
            return action.payload?.consumers || state;
        });
    },
});

export const { addConsumer, loadConsumers, incrementMonthly, updateExhausted } = consumerSlice.actions;
export default consumerSlice.reducer;
