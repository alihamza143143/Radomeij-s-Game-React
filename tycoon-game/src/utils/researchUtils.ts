// utils/researchUtils.ts

import { StartedResearch } from "../store/resaearchSlice";

export const getProjectProgress = (startedResearch: StartedResearch[], projectId: number): number => {
    const research = startedResearch.find(research => research.ID === projectId);
    return research ? research.progress : 0; // 0 - 100%
};


export const isResearchDone = (startedResearch: StartedResearch[], projectId: number): boolean => {
    return startedResearch.some(research => research.ID === projectId && research.progress >= 100);
};