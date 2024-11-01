import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ScriptData {
    id: string;
    name: string;
    version: string;
    path: string;
    hash: string;  // Nowe pole typu string
    data: Record<string, any>;  // Miejsce na dane specyficzne dla skryptu
}

interface ScriptManagerState {
    scripts: ScriptData[];  // Lista skryptów
    sharedSession: Record<string, any>;  // Dane współdzielone pomiędzy skryptami
}

// Inicjalny stan z predefiniowanym skryptem 'customScript'
const initialState: ScriptManagerState = {
    scripts: [
        {
            id: 'customScript',
            name: 'Custom Script',
            version: '1.0.0',
            // path: '/scripts/customScript.js',
            path: '/scripts/script1.js',
            hash: '',
            data: {
                initialData: "This is the initial state of customScript"
            }
        }, 
        // {
        //     id: 'releaseEvents',
        //     name: 'Release Script',
        //     version: '1.0.0',
        //     path: '/scripts/releaseEvents.js',
        //     hash: '',
        //     data: {
        //         initialData: "This is the initial state of releaseEvents"
        //     }
        // }
    ],
    sharedSession: {},
};

const scriptManagerSlice = createSlice({
    name: 'scriptManager',
    initialState,
    reducers: {
        loadScriptData: (state, action: PayloadAction<{ scriptId: string, data: any }>) => {
            const script = state.scripts.find(s => s.id === action.payload.scriptId);
            if (script) {
                script.data = action.payload.data;
            }
        },
        saveScriptData: (state, action: PayloadAction<{ scriptId: string, data: any }>) => {
            const script = state.scripts.find(s => s.id === action.payload.scriptId);
            if (script) {
                script.data = action.payload.data;
            }
        },
        updateSharedSession: (state, action: PayloadAction<{ key: string, value: any }>) => {
            state.sharedSession[action.payload.key] = action.payload.value;
        },
    },
});

export const { loadScriptData, saveScriptData, updateSharedSession } = scriptManagerSlice.actions;

export default scriptManagerSlice.reducer;
