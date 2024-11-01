// storageUtils.ts

import { RootState } from "../store/store";

export const saveGameState = (stateName: string, state: RootState): void => {
    localStorage.setItem(stateName, JSON.stringify(state));
};

export const loadGameState = (stateName: string): RootState | undefined => {
    try {
        const serializedState = localStorage.getItem(stateName);
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState) as RootState;
    } catch (err) {
        console.error("Error loading game state:", err);
        return undefined;
    }
};

export const getSavedGames = (): string[] => {
    const keys = Object.keys(localStorage);
    return keys.filter(key => key.startsWith('gameState_'));
};

export const deleteGameState = (stateName: string): void => {
    localStorage.removeItem(stateName);
};
