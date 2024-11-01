import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ResearchProject } from '../store/resaearchSlice';
import { RootState } from '../store/store';
import { getProjectProgress } from '../utils/researchUtils';
import ResearchModal from './ResearchModal';
import ReactFlowWrapper from './research/ReactFlowWrapper';
import { IntermediateEdge, IntermediateNode } from './research/models';


import image_research from './../assets/resarge.png';
import InfoCard from './basic/InfoCard';

const Research: React.FC = () => {
    const currentProject = useSelector((state: RootState) => state.research.currentProject);
    const projectCategories = useSelector((state: RootState) => state.research.projectCategories);
    const startedResearch = useSelector((state: RootState) => state.research.startedResearch);
    const currentYear = useSelector((state: RootState) => state.game.year);

    const [selectedProject, setSelectedProject] = useState<ResearchProject | null>(null);
    const [activeTab, setActiveTab] = useState<string>('CPU');

    const findProjectById = (projects: ResearchProject[], id: number): ResearchProject | undefined => {
        return projects.find(project => project.ID === id);
    };

    const getResearchState = (project: ResearchProject): string => {
        if (project.ID === currentProject?.ID) {
            return "current";
        }

        const researchProgress = getProjectProgress(startedResearch, project.ID);
        if (researchProgress >= 100) {
            return "ready";
        }

        const projectAvaiabilityYear = project.availability ? parseInt(project.availability) : 0;
        if (projectAvaiabilityYear > currentYear) {
            return "hidden";
        }

        if (project.ID_Parent === null || project.ID_Parent === -1) {
            if (projectAvaiabilityYear <= currentYear) {
                return "open";
            }
            return "hidden";
        }

        const projects = projectCategories[activeTab].projects;
        const parentProject = findProjectById(projects, project.ID_Parent); //TODO add support for all research projects
        if (parentProject === undefined) {
            throw new Error("Parent should exist");
        }


        const parentResearchProgress = getProjectProgress(startedResearch, parentProject.ID);
        if (parentResearchProgress >= 100) {
            if (project.required_projects.length === 0) {
                return "open";
            }
            let allRequiredProjectAreReady = true;
            project.required_projects.forEach(reqID => {
                if (!allRequiredProjectAreReady) {
                    return;
                }
                const reqResearchProgress = getProjectProgress(startedResearch, project.ID);
                if (reqResearchProgress < 100) {
                    allRequiredProjectAreReady = false;
                }
            });
            if (allRequiredProjectAreReady) {
                return "open";
            }
            return "hidden";
        }

        return "hidden";
    };

    function organizeResearchTree(projects: ResearchProject[]): Map<number, { x: number; y: number }> {
        const positionMap = new Map<number, { x: number; y: number }>();
        const levelMap = new Map<number, number>();

        function calculateLevel(project: ResearchProject): number {
            if (levelMap.has(project.ID)) {
                return levelMap.get(project.ID)!;
            }

            let maxParentLevel = -1;

            if (project.ID_Parent !== null) {
                const parentProject = projects.find(p => p.ID === project.ID_Parent);
                if (parentProject) {
                    maxParentLevel = Math.max(maxParentLevel, calculateLevel(parentProject));
                }
            }

            project.required_projects.forEach(reqID => {
                const requiredProject = projects.find(p => p.ID === reqID);
                if (requiredProject) {
                    maxParentLevel = Math.max(maxParentLevel, calculateLevel(requiredProject));
                }
            });

            const level = maxParentLevel + 1;
            levelMap.set(project.ID, level);
            return level;
        }

        projects.forEach(project => calculateLevel(project));

        const sortedProjects = [...projects].sort((a, b) => levelMap.get(a.ID)! - levelMap.get(b.ID)!);

        const usedPositions = new Set<string>();
        const parentColumnMap = new Map<number, number>();

        sortedProjects.forEach((project) => {
            const y = levelMap.get(project.ID)!;
            let x: number;

            if (project.ID_Parent !== null && parentColumnMap.has(project.ID_Parent)) {
                x = parentColumnMap.get(project.ID_Parent)!;
            } else {
                x = 0;
                while (usedPositions.has(`${x},${y}`)) {
                    x++;
                }
            }

            while (usedPositions.has(`${x},${y}`)) {
                x++;
            }

            usedPositions.add(`${x},${y}`);
            positionMap.set(project.ID, { x, y });

            parentColumnMap.set(project.ID, x);
        });

        return positionMap;
    }

    const organizeProjects = (projects: ResearchProject[]): { nodes: IntermediateNode[], edges: IntermediateEdge[] } => {
        const nodes: IntermediateNode[] = [];
        const edges: IntermediateEdge[] = [];

        const gridPositions = organizeResearchTree(projects);
        gridPositions.forEach((position, projectId) => {
            const project = projects.find(pro => pro.ID === projectId);
            if (project === undefined) {
                throw new Error("Wartość jest undefined");
            }
            const projectState = getResearchState(project);
            if (projectState !== "hidden") {
                nodes.push({
                    id: project.ID,
                    name: project.name,
                    state: projectState as 'ready' | 'open' | 'current',
                    position
                });

                if (project.ID_Parent !== null && project.ID_Parent !== -1) {
                    edges.push({
                        from: project.ID_Parent,
                        to: project.ID
                    });
                }
            }
        });

        return { nodes, edges };
    };

    const projectData = organizeProjects(projectCategories[activeTab]?.projects || []);

    const handleNodeClick = (intermediateNode: IntermediateNode) => {
        const project = findProjectById(projectCategories[activeTab].projects, intermediateNode.id);
        if (project) {
            setSelectedProject(project);
        }
    };

    const handleModalClose = () => {
        setSelectedProject(null);
    };

    return (
        <div className='flex flex-col grow h-full max-h-full '>
            <div className='flex flex-col '>
                <div className='flex flex-row bg-primary justify-center rounded-t-full '>
                    <InfoCard image={image_research} text="Research" />
                    {/* <button className='btn btn-xs btn-secondary self-center'>Planning</button> */}
                </div>
                <div role="tablist" className="tabs tabs-lifted bg-primary-content rounded-none">
                    {Object.keys(projectCategories).map((key) => (
                        <a
                            key={key}
                            role="tab"
                            className={`h-8 mb-1 tab tab-border-3 tab-rounded-none  [--tab-border-color:white] [--tab-bg:orange]  ${activeTab === key ? 'tab-active' : ''} `}
                            onClick={() => setActiveTab(key)}
                        >
                            {key}
                        </a>
                    ))}
                </div>
            </div>

            <div className='flex grow h-full min-h-0 bg-transparent rounded-b-3xl'>
                <ReactFlowWrapper
                    intermediateNodes={projectData.nodes}
                    intermediateEdges={projectData.edges}
                    onNodeClick={handleNodeClick}
                />
            </div>
            {selectedProject && (
                <ResearchModal
                    project={selectedProject}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
};

export default Research;
