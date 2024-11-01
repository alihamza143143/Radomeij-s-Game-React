import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadState } from './saves/actions';
import { RootState } from './store';
import { subtractCash } from './gameSlice';
import { scriptApi } from '@/components/mods/ScriptManager'; // Upewnij się, że masz poprawny import scriptApi

export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    birthYear: number;
    salary: number;
    researchSkill: number;  // Umiejętność badania
    designSkill: number;    // Umiejętność designu
    testingSkill: number;   // Umiejętność testowania
    managementSkill: number; // Umiejętność zarządzania
}

export interface EmployeeState {
    employees: Employee[];
    researchBonus: number; // Bonus do badań
}

const RESEARCH_BONUS_MULTIPLIER = 0.05;

const initialState: EmployeeState = {
    employees: [],
    researchBonus: 0, // Początkowa wartość bonusu do badań
};

export const paySalaries = createAsyncThunk<void, void, { state: RootState }>(
    'employee/paySalaries',
    async (_, { dispatch, getState }) => {
        const state = getState();
        const employees = state.employee.employees;
        const totalSalaries = employees.reduce((total, employee) => total + employee.salary, 0);

        // Odejmij sumę pensji od cash w `gameSlice`
        dispatch(subtractCash(totalSalaries));
    }
);

const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    reducers: {
        setEmployees: (state, action: PayloadAction<Employee[]>) => {
            state.employees = action.payload;
            state.researchBonus = calculateResearchBonus(state.employees);

            // Emitowanie zdarzenia onEmployeesSet po ustawieniu pracowników
            scriptApi.emit('onEmployeesSet', { employees: state.employees });
        },
        addEmployee: (state, action: PayloadAction<Employee>) => {
            console.log("addEmployee", action.payload);
            state.employees.push(action.payload);
            state.researchBonus = calculateResearchBonus(state.employees);

            // Emitowanie zdarzenia onEmployeeAdded po dodaniu pracownika
            scriptApi.emit('onEmployeeAdded', { employee: action.payload });
        },
        removeEmployee: (state, action: PayloadAction<number>) => {
            const removedEmployee = state.employees.find(employee => employee.id === action.payload);
            state.employees = state.employees.filter(employee => employee.id !== action.payload);
            state.researchBonus = calculateResearchBonus(state.employees);

            // Emitowanie zdarzenia onEmployeeRemoved po usunięciu pracownika
            if (removedEmployee) {
                scriptApi.emit('onEmployeeRemoved', { employee: removedEmployee });
            }
        },
        updateEmployee: (state, action: PayloadAction<Employee>) => {
            const index = state.employees.findIndex(employee => employee.id === action.payload.id);
            if (index !== -1) {
                state.employees[index] = action.payload;
                state.researchBonus = calculateResearchBonus(state.employees);

                // Emitowanie zdarzenia onEmployeeUpdated po zaktualizowaniu pracownika
                scriptApi.emit('onEmployeeUpdated', { employee: action.payload });
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadState, (state, action: PayloadAction<RootState | undefined>) => {
            return action.payload?.employee || state;
        });
    },
});

// Funkcja pomocnicza do obliczania bonusu do badań
const calculateResearchBonus = (employees: Employee[]): number => {
    return employees.reduce((total, employee) => total + employee.researchSkill / 100, 0) * RESEARCH_BONUS_MULTIPLIER;
};

export const { setEmployees, addEmployee, removeEmployee, updateEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
