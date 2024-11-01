import { RootState } from '../store/store';
import { isResearchDone } from './researchUtils';

interface PackageType {
    name: string;
    cores: number;
}

const packageTypeMapping: Record<number, PackageType> = {
    1: { name: 'Single', cores: 1 },
    62: { name: 'Experimental Dual', cores: 2 },
    67: { name: 'Hyper-Threading Dual', cores: 2 },
    73: { name: 'Dual-core', cores: 2 },
    80: { name: 'Triple-core', cores: 3 },
    83: { name: 'Quad-core', cores: 4 },
    128: { name: 'Hexa-core', cores: 6 },
    129: { name: 'Octa-core', cores: 8 },
    130: { name: '16-core', cores: 16 },
    131: { name: '32-core', cores: 32 },
    132: { name: '56-core', cores: 56 },
    133: { name: '64-core', cores: 64 },
};

export const getCoresTypes = (researchState: RootState['research']): Array<{ name: string, cores: number }> => {
    const startedResearch = researchState.startedResearch;
    const result = Object.entries(packageTypeMapping)
        .filter(([id, _]) => isResearchDone(startedResearch, parseInt(id)))
        .map(([_, pkg]) => pkg);

    if (result.length === 0) {
        result.push({ name: 'NONE', cores: 0 });
    }

    return result;
};
