import { RootState } from '../store/store';
import { StartedResearch } from '../store/resaearchSlice';
import { isResearchDone } from './researchUtils';




export const getMaxClockSpeedForPlayer = (startedResearch: StartedResearch[]): number => {
    if (isResearchDone(startedResearch, 106)) {
        return 5_700_000;
    }
    if (isResearchDone(startedResearch, 105)) {
        return 5_500_000;
    }
    if (isResearchDone(startedResearch, 104)) {
        return 5_300_000;
    }
    if (isResearchDone(startedResearch, 103)) {
        return 5_000_000;
    }
    if (isResearchDone(startedResearch, 102)) {
        return 4_700_000;
    }
    if (isResearchDone(startedResearch, 101)) {
        return 4_400_000;
    }
    if (isResearchDone(startedResearch, 100)) {
        return 4_200_000;
    }
    if (isResearchDone(startedResearch, 82)) {
        return 4_000_000;
    }
    if (isResearchDone(startedResearch, 79)) {
        return 3_800_000;
    }
    if (isResearchDone(startedResearch, 76)) {
        return 3_400_000;
    }
    if (isResearchDone(startedResearch, 75)) {
        return 3_000_000;
    }
    if (isResearchDone(startedResearch, 74)) {
        return 2_700_000;
    }
    if (isResearchDone(startedResearch, 71)) {
        return 2_500_000;
    }
    if (isResearchDone(startedResearch, 70)) {
        return 2_100_000;
    }
    if (isResearchDone(startedResearch, 68)) {
        return 1_800_000;
    }
    if (isResearchDone(startedResearch, 66)) {
        return 1_400_000;
    }
    if (isResearchDone(startedResearch, 65)) {
        return 1_100_000;
    }
    if (isResearchDone(startedResearch, 64)) {
        return 760_000;
    }
    if (isResearchDone(startedResearch, 60)) {
        return 486_000;
    }
    if (isResearchDone(startedResearch, 59)) {
        return 335_000;
    }
    if (isResearchDone(startedResearch, 57)) {
        return 210_000;
    }
    if (isResearchDone(startedResearch, 56)) {
        return 130_000;
    }
    if (isResearchDone(startedResearch, 55)) {
        return 95_000;
    }
    if (isResearchDone(startedResearch, 53)) {
        return 70_000;
    }
    if (isResearchDone(startedResearch, 51)) {
        return 60_000;
    }
    if (isResearchDone(startedResearch, 49)) {
        return 48_000;
    }
    if (isResearchDone(startedResearch, 48)) {
        return 40_000;
    }
    if (isResearchDone(startedResearch, 46)) {
        return 35_000;
    }
    if (isResearchDone(startedResearch, 43)) {
        return 30_000;
    }
    if (isResearchDone(startedResearch, 41)) {
        return 25_000;
    }
    if (isResearchDone(startedResearch, 36)) {
        return 20_000;
    }
    if (isResearchDone(startedResearch, 30)) {
        return 15_000;
    }
    if (isResearchDone(startedResearch, 24)) {
        return 12_000;
    }
    if (isResearchDone(startedResearch, 22)) {
        return 9_000;
    }
    if (isResearchDone(startedResearch, 18)) {
        return 6_500;
    }
    if (isResearchDone(startedResearch, 16)) {
        return 4_000;
    }
    if (isResearchDone(startedResearch, 11)) {
        return 2_500;
    }
    if (isResearchDone(startedResearch, 8)) {
        return 1_500;
    }
    if (isResearchDone(startedResearch, 7)) {
        return 900;
    }
    if (isResearchDone(startedResearch, 4)) {
        return 750;
    }
    if (isResearchDone(startedResearch, 2)) {
        return 400;
    }
    return 200; // 200 kHz is open standard and free available for all
};

export const getMaxClockSpeed = (unit: 'kHz' | 'MHz' | 'GHz', researchState: RootState['research']): number => {
    let kHzResearchCompleted = getMaxClockSpeedForPlayer(researchState.startedResearch); // Get the clock speed in kHz

    switch (unit) {
        case 'kHz':
            return kHzResearchCompleted;
        case 'MHz':
            return kHzResearchCompleted / 1000; // Convert kHz to MHz
        case 'GHz':
            return kHzResearchCompleted / 1_000_000; // Convert kHz to GHz
        default:
            return kHzResearchCompleted; // Default to kHz if unit is not recognized
    }
};