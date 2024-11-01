import { RootState } from '../store/store';
import { isResearchDone } from './researchUtils';

export interface LithographyType {
    name: string;
    size: string;
    value: number;
}

const lithographyTypeMapping: Record<number, LithographyType> = {
    1: { name: '15 µm process', size: '15 µm', value: 1 },
    85: { name: '10 µm process', size: '10 µm', value: 2 },
    86: { name: '6 µm process', size: '6 µm', value: 3 },
    87: { name: '3 µm process', size: '3 µm', value: 4 },
    88: { name: '1.5 µm process', size: '1.5 µm', value: 5 },
    89: { name: '1 µm process', size: '1 µm', value: 6 },
    90: { name: '800 nm process', size: '800 nm', value: 7 },
    91: { name: '600 nm process', size: '600 nm', value: 8 },
    92: { name: '350 nm process', size: '350 nm', value: 9 },
    93: { name: '250 nm process', size: '250 nm', value: 10 },
    94: { name: '180 nm process', size: '180 nm', value: 11 },
    95: { name: '130 nm process', size: '130 nm', value: 12 },
    96: { name: '90 nm process', size: '90 nm', value: 13 },
    97: { name: '65 nm process', size: '65 nm', value: 14 },
    98: { name: '45 nm process', size: '45 nm', value: 15 },
    107: { name: '32 nm process', size: '32 nm', value: 16 },
    108: { name: '22 nm process', size: '22 nm', value: 17 },
    109: { name: '20 nm process', size: '20 nm', value: 18 },
    110: { name: '16 nm process', size: '16 nm', value: 19 },
    111: { name: '14 nm process', size: '14 nm', value: 20 },
    112: { name: '10 nm process', size: '10 nm', value: 21 },
    113: { name: '10+ nm process', size: '10+ nm', value: 22 },
    114: { name: '7 nm process', size: '7 nm', value: 23 },
    115: { name: '5 nm process', size: '5 nm', value: 24 },
    116: { name: '4 nm process', size: '4 nm', value: 25 },
    117: { name: '3 nm process', size: '3 nm', value: 26 },
};

export const getLithographyTypes = (researchState: RootState['research']): Array<{ name: string, size: string, value: number }> => {
    const startedResearch = researchState.startedResearch;
    const result = Object.entries(lithographyTypeMapping)
        .filter(([id, _]) => isResearchDone(startedResearch, parseInt(id)))
        .map(([_, litho]) => litho);

    if (result.length === 0) {
        result.push({ name: 'NONE', size: 'N/A', value: 0 });
    }

    return result;
};

export const getLithographyValueBySize = (size: string): number => {
    const lithography = Object.values(lithographyTypeMapping).find(litho => litho.size === size);
    return lithography ? lithography.value : 1;
};