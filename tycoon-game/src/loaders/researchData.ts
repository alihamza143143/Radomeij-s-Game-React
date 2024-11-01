import researchData from '../data/research_data.json';
import { ResearchCategory } from '../store/resaearchSlice';

interface ResearchDataRaw {
    projects: {
        ID: number;
        ID_Parent: number | null;
        availability: string | null;
        points: number;
        required_points: number;
        required_projects: number[];
        cost: number;
        name: string;
        description: string;
        category: string;
    }[];
}

export const loadResearchProjects = (): { [category: string]: ResearchCategory } => {
    const data: ResearchDataRaw = researchData;
    const projects: { [category: string]: ResearchCategory } = {};

    data.projects.forEach(projectData => {
        const category = projectData.category;
        if (!projects[category]) {
            projects[category] = { projects: [] };
        }

        //TODO Temporary solution before fixing balance
        let researchCost = projectData.cost;
        if(researchCost === undefined || researchCost == 0){
            researchCost = 5000;
        }

        let researchPoints = projectData.required_points;
        if(researchPoints === undefined || researchPoints == 0){
            researchPoints = 10;
        }
        projects[category].projects.push({
            ID: projectData.ID,
            ID_Parent: projectData.ID_Parent,
            availability: projectData.availability,
            points: projectData.points,
            cost: researchCost,
            required_points: researchPoints,
            name: projectData.name,
            description: projectData.description,
            category: projectData.category,
            required_projects: projectData.required_projects
        });
    });

    console.log("load research", projects);
    return projects;
};
