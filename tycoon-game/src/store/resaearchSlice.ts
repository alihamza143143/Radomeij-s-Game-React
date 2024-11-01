import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from './store';
import { loadState } from './saves/actions';
import { subtractCash } from './gameSlice';
import { playSound } from '@/utils/soundUtils';

export interface ResearchProject {
    ID: number;
    ID_Parent: number | null;
    availability: string | null;
    points: number;
    cost: number;
    required_points: number;
    required_projects: number[];
    name: string;
    description: string;
    category: string;
}

export interface ResearchCategory {
    projects: ResearchProject[];
}

export interface StartedResearch {
    ID: number;
    progress: number; // 0 - 100%
}

export interface ResearchState {
    currentProject: ResearchProject | null;
    currentProgress: StartedResearch | null;
    startedResearch: StartedResearch[];
    projectCategories: { [category: string]: ResearchCategory };
    researchPower: number;
}

const initialState: ResearchState = {
    currentProject: null,
    currentProgress: null,
    startedResearch: [],
    projectCategories: {},
    researchPower: 0.05,
};

// Thunk to increase research progress based on research power and deduct corresponding cost

export const advanceResearchProgress = createAsyncThunk<
    void,
    void,
    { state: RootState; dispatch: AppDispatch }
>(
    'research/advanceResearchProgress',
    async (_, { dispatch, getState }) => {
        const state = getState();
        const { currentProject, currentProgress, researchPower } = state.research;
        const researchBonus = state.employee.researchBonus; // Pobranie researchBonus z employeeSlice

        console.log("advanceResearchProgress", researchPower, researchBonus);
        if (currentProject && currentProgress) {
            // Uwzględnienie researchBonus w obliczeniach
            const totalResearchPower = researchPower + researchBonus;

            // Oblicz deltaProgressChange na podstawie totalResearchPower i required_points
            const deltaProgressChange = (totalResearchPower / currentProject.required_points) * 100;

            // Oblicz odpowiadający częściowy koszt dla deltaProgressChange
            const partialCost = (currentProject.cost * deltaProgressChange) / 100;

            // Odejmij częściowy koszt od gotówki
            await dispatch(subtractCash(partialCost));

            // Oblicz nowy postęp
            let newProgress = currentProgress.progress + deltaProgressChange;

            // Sprawdź, czy postęp osiągnął lub przekroczył 100%
            if (newProgress >= 100) {
                newProgress = 100;

                await dispatch(setResearchProgress(newProgress));
                // Zakończ badanie i zresetuj currentProject oraz currentProgress
                await dispatch(resetResearchProject());

                dispatch(playSound(4));
            } else {
                // Zaktualizuj postęp w reduktorze
                await dispatch(setResearchProgress(newProgress));
            }
        }
    }
);

const researchSlice = createSlice({
    name: 'research',
    initialState,
    reducers: {
        setResearchProgress: (state, action: PayloadAction<number>) => {
            if (state.currentProgress) {
                const newProgress = action.payload;

                // Aktualizacja currentProgress.progress
                state.currentProgress.progress = newProgress;

                // Aktualizacja odpowiedniego wpisu w startedResearch
                const existingResearch = state.startedResearch.find(
                    research => research.ID === state.currentProgress!.ID
                );

                if (existingResearch) {
                    existingResearch.progress = newProgress;
                }
            }
        },
        setResearchProject: (state, action: PayloadAction<ResearchProject>) => {
            state.currentProject = action.payload;

            // Create a key in startedResearch if it doesn't exist
            const existingResearch = state.startedResearch.find(
                research => research.ID === action.payload.ID
            );

            // Restore progress from startedResearch for the given project to currentProgress
            if (existingResearch) {
                state.currentProgress = existingResearch;
            } else {
                const newResearch = { ID: action.payload.ID, progress: 0 };
                state.startedResearch.push(newResearch);
                state.currentProgress = newResearch;
            }
        },
        resetResearchProject: (state) => {
            state.currentProject = null; // Reset the research project
            state.currentProgress = null; // Reset the progress of the current project
        },
        loadProjects: (state, action: PayloadAction<{ [category: string]: ResearchCategory }>) => {
            state.projectCategories = action.payload; // Load research projects
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadState, (state, action: PayloadAction<RootState | undefined>) => {
            return action.payload?.research || state;
        });
    },
});

export const { setResearchProgress, setResearchProject, resetResearchProject, loadProjects } = researchSlice.actions;
export default researchSlice.reducer;
