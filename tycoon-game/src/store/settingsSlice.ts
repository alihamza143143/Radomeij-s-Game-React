import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface SettingsState {
    musicEnabled: boolean;
    soundEnabled: boolean;
    musicVolume: number;
    soundVolume: number;
    language: string;
    soundToPlay: string | null;
    nextTrack: boolean; // Nowy stan do wymuszenia następnej piosenki
}

const initialState: SettingsState = {
    musicEnabled: true,
    soundEnabled: true,
    musicVolume: 50,
    soundVolume: 50,
    language: 'en',
    soundToPlay: null,
    nextTrack: false,
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        toggleSound: (state) => {
            state.soundEnabled = !state.soundEnabled;
        },
        toggleMusic: (state) => {
            state.musicEnabled = !state.musicEnabled;
        },
        setMusicVolume: (state, action: PayloadAction<number>) => {
            state.musicVolume = action.payload;
        },
        setSoundVolume: (state, action: PayloadAction<number>) => {
            state.soundVolume = action.payload;
        },
        setLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload;
        },
        setSoundToPlay: (state, action: PayloadAction<string | null>) => {
            state.soundToPlay = action.payload;
        },
        setNextTrack: (state) => {
            state.nextTrack = !state.nextTrack; // Przełącznik wymuszenia następnego utworu
        },
    },
});

export const {
    toggleSound,
    toggleMusic,
    setMusicVolume,
    setSoundVolume,
    setLanguage,
    setSoundToPlay,
    setNextTrack,
} = settingsSlice.actions;

export const selectSettings = (state: RootState) => state.settings;

export default settingsSlice.reducer;
