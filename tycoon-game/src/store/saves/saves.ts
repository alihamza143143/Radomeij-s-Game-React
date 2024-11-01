// saves.ts

import { RootState } from "../store";

// Funkcja do zapisywania stanu w localStorage pod podaną nazwą
export const saveState = (name: string, state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(`appState_${name}`, serializedState);

    // Dodaj nazwę zapisu do listy zapisów
    const saves = getSavesList();
    if (!saves.includes(name)) {
      saves.push(name);
      localStorage.setItem('savesList', JSON.stringify(saves));
    }
  } catch (err) {
    console.error("Could not save state", err);
  }
};

// Funkcja do odczytu stanu z localStorage pod podaną nazwą
export const loadState = (name: string): RootState | undefined => {
  try {
    const serializedState = localStorage.getItem(`appState_${name}`);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState) as RootState;
  } catch (err) {
    console.error("Could not load state", err);
    return undefined;
  }
};

// Funkcja do pobrania listy zapisów
export const getSavesList = (): string[] => {
  try {
    const serializedList = localStorage.getItem('savesList');
    if (serializedList === null) {
      return [];
    }
    return JSON.parse(serializedList) as string[];
  } catch (err) {
    console.error("Could not get saves list", err);
    return [];
  }
};

// Funkcja do usuwania zapisu
export const deleteState = (name: string) => {
  try {
    localStorage.removeItem(`appState_${name}`);
    const saves = getSavesList().filter(save => save !== name);
    localStorage.setItem('savesList', JSON.stringify(saves));
  } catch (err) {
    console.error("Could not delete state", err);
  }
};
