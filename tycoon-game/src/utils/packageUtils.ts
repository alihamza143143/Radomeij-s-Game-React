import { RootState } from '../store/store';
import { isResearchDone } from './researchUtils';

interface PackageType {
    name: string;
    pinCount: number;
}


const packageTypeMapping: Record<number, PackageType> = {
    1: { name: 'DIP', pinCount: 14 },
    3: { name: 'DIP', pinCount: 18 },
    5: { name: 'DIP', pinCount: 24 },
    6: { name: 'DIP', pinCount: 32 },
    9: { name: 'DIP', pinCount: 48 },
    14: { name: 'DIP', pinCount: 56 },
    15: { name: 'DIP', pinCount: 64 },
    20: { name: 'DIP', pinCount: 72 },
    10: { name: 'PLCC', pinCount: 24 },
    12: { name: 'PLCC', pinCount: 32 },
    13: { name: 'PLCC', pinCount: 48 },
    17: { name: 'PLCC', pinCount: 56 },
    19: { name: 'PLCC', pinCount: 64 },
    21: { name: 'PLCC', pinCount: 72 },
    23: { name: 'PLCC', pinCount: 84 },
    27: { name: 'PLCC', pinCount: 96 },
    28: { name: 'PLCC', pinCount: 116 },
    34: { name: 'PLCC', pinCount: 136 },
    35: { name: 'PLCC', pinCount: 156 },
    40: { name: 'PLCC', pinCount: 182 },
    42: { name: 'PLCC', pinCount: 208 },
    45: { name: 'PLCC', pinCount: 240 },
    25: { name: 'PGA', pinCount: 48 },
    26: { name: 'PGA', pinCount: 60 },
    29: { name: 'PGA', pinCount: 78 },
    31: { name: 'PGA', pinCount: 96 },
    32: { name: 'PGA', pinCount: 112 },
    33: { name: 'PGA', pinCount: 136 },
    37: { name: 'PGA', pinCount: 152 },
    39: { name: 'PGA', pinCount: 176 },
    41: { name: 'PGA', pinCount: 200 },
    44: { name: 'PGA', pinCount: 224 },
    47: { name: 'PGA', pinCount: 248 },
    50: { name: 'PGA', pinCount: 282 },
    52: { name: 'PGA', pinCount: 320 },
    54: { name: 'PGA', pinCount: 380 },
    58: { name: 'PGA', pinCount: 456 },
    61: { name: 'PGA', pinCount: 544 },
    63: { name: 'PGA', pinCount: 618 },
    69: { name: 'PGA', pinCount: 754 },
    72: { name: 'PGA', pinCount: 870 },
    77: { name: 'PGA', pinCount: 940 },
    81: { name: 'PGA', pinCount: 1207 },
    84: { name: 'PGA', pinCount: 1366 },
    118: { name: 'LGA', pinCount: 775 },
    119: { name: 'LGA', pinCount: 940 },
    120: { name: 'LGA', pinCount: 1366 },
    121: { name: 'LGA', pinCount: 1567 },
    122: { name: 'LGA', pinCount: 2011 },
    123: { name: 'LGA', pinCount: 2066 },
    124: { name: 'LGA', pinCount: 3647 },
    125: { name: 'LGA', pinCount: 4189 },
    126: { name: 'LGA', pinCount: 4677 },
    127: { name: 'LGA', pinCount: 5000 },
};

export const getPackageTypes = (researchState: RootState['research']): Array<{ name: string, pinCount: number }> => {
    const startedResearch = researchState.startedResearch;
    console.log("getPackageTypes", startedResearch);
    const result = Object.entries(packageTypeMapping)
        .filter(([id, _]) => isResearchDone(startedResearch, parseInt(id)))
        .map(([_, pkg]) => pkg);

    if (result.length === 0) {
        result.push({ name: 'NONE', pinCount: 0 });
    }

    return result;
};
