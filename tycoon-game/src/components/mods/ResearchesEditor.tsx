import React, { useEffect, useState } from 'react';
import { loadResearchProjects } from '../../loaders/researchData';
import { paginate } from '../../utils/pagination';
import { ResearchCategory, ResearchProject } from '../../store/resaearchSlice';

type ExtendedResearchProject = ResearchProject & {
    [key: string]: unknown;
};


interface ResearchesEditorProps {
    onClose: () => void;
}

const ResearchesEditor: React.FC<ResearchesEditorProps> = ({ onClose }) => {
    const [researchProjects, setResearchProjects] = useState<{ [category: string]: ResearchCategory }>({});
    const [currentPage, setCurrentPage] = useState<{ [category: string]: number }>({});
    const [newField, setNewField] = useState<{ name: string; type: string }>({ name: '', type: 'string' });
    const pageSize = 5;

    useEffect(() => {
        const projects = loadResearchProjects();
        setResearchProjects(projects);
        const initialPages: { [category: string]: number } = {};
        Object.keys(projects).forEach(category => {
            initialPages[category] = 1;
        });
        setCurrentPage(initialPages);
    }, []);

    const handleAddProject = (category: string) => {
        const newProject: ExtendedResearchProject  = {
            ID: Date.now(),
            ID_Parent: null,
            availability: null,
            points: 0,
            required_points: 0,
            required_projects: [],
            cost: 0,
            name: 'New Project',
            description: 'Description of new project',
            category: category,
        };

        setResearchProjects(prevState => ({
            ...prevState,
            [category]: {
                ...prevState[category],
                projects: [...prevState[category].projects, newProject],
            },
        }));
    };

    const handleDeleteProject = (category: string, projectId: number) => {
        setResearchProjects(prevState => ({
            ...prevState,
            [category]: {
                ...prevState[category],
                projects: prevState[category].projects.filter(project => project.ID !== projectId),
            },
        }));
    };

    const handlePageChange = (category: string, page: number) => {
        setCurrentPage(prevState => ({
            ...prevState,
            [category]: page,
        }));
    };

    const handleCopyToClipboard = () => {
        const dataToCopy = JSON.stringify(researchProjects, null, 2);
        navigator.clipboard.writeText(dataToCopy).then(() => {
            alert('Data copied to clipboard!');
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    };

    const handleAddField = () => {
        const { name, type } = newField;
        if (!name || !type) {
            alert('Please enter both field name and type.');
            return;
        }

        setResearchProjects(prevState => {
            const updatedProjects = { ...prevState };
            Object.keys(updatedProjects).forEach(category => {
                updatedProjects[category].projects = updatedProjects[category].projects.map(project => ({
                    ...project,
                    [name]: type === 'string' ? '' : type === 'number' ? 0 : type === 'boolean' ? false : type === 'array' ? [] : null,
                }));
            });
            return updatedProjects;
        });

        setNewField({ name: '', type: 'string' });
    };

    const handleFieldChange = (category: string, projectId: number, fieldName: string, value: unknown) => {
        setResearchProjects(prevState => ({
            ...prevState,
            [category]: {
                ...prevState[category],
                projects: prevState[category].projects.map(project =>
                    project.ID === projectId ? { ...project, [fieldName]: value } : project
                ),
            },
        }));
    };

    const renderDynamicField = (project: ExtendedResearchProject, field: string) => {
        const value = project[field];
        if (typeof value === 'boolean') {
            return (
                <input
                    type="checkbox"
                    checked={value}
                    onChange={e => handleFieldChange(project.category, project.ID, field, e.target.checked)}
                />
            );
        } else if (typeof value === 'string' || typeof value === 'number') {
            return (
                <input
                    type="text"
                    value={value.toString()}
                    onChange={e => handleFieldChange(project.category, project.ID, field, e.target.value)}
                />
            );
        }
        return null; // Obsłuż inne typy w razie potrzeby
    };

    return (
        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center p-4">
            <h2 className="text-3xl mb-4">Researches Editor</h2>
            <div className="w-full max-w-4xl">
                <div className="mb-6">
                    <h3 className="text-2xl mb-2">Add New Field</h3>
                    <input
                        className="input mb-2"
                        type="text"
                        placeholder="Field Name"
                        value={newField.name}
                        onChange={e => setNewField({ ...newField, name: e.target.value })}
                    />
                    <select
                        className="select mb-2"
                        value={newField.type}
                        onChange={e => setNewField({ ...newField, type: e.target.value })}
                    >
                        <option value="string">String</option>
                        <option value="number">Number</option>
                        <option value="boolean">Boolean</option>
                        <option value="array">Array</option>
                    </select>
                    <button className="btn btn-primary mb-2" onClick={handleAddField}>Add Field</button>
                </div>
                {Object.keys(researchProjects).map(category => (
                    <div key={category} className="mb-6">
                        <h3 className="text-2xl mb-2">{category}</h3>
                        <button className="btn btn-primary mb-2" onClick={() => handleAddProject(category)}>Add Project</button>
                        <table className="table-auto w-full mb-4">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Points</th>
                                    <th>Required Points</th>
                                    <th>Cost</th>
                                    {Object.keys(researchProjects[category].projects[0] || {}).map(field => (
                                        !['ID', 'ID_Parent', 'availability', 'points', 'required_points', 'cost', 'name', 'description', 'category'].includes(field) && <th key={field}>{field}</th>
                                    ))}
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginate(researchProjects[category].projects, pageSize, currentPage[category]).map(project => (
                                    <tr key={project.ID}>
                                        <td>{project.ID}</td>
                                        <td>
                                            <input
                                                type="text"
                                                value={project.name}
                                                onChange={e => handleFieldChange(category, project.ID, 'name', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={project.description}
                                                onChange={e => handleFieldChange(category, project.ID, 'description', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={project.points}
                                                onChange={e => handleFieldChange(category, project.ID, 'points', Number(e.target.value))}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={project.required_points}
                                                onChange={e => handleFieldChange(category, project.ID, 'required_points', Number(e.target.value))}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={project.cost}
                                                onChange={e => handleFieldChange(category, project.ID, 'cost', Number(e.target.value))}
                                            />
                                        </td>
                                        {Object.keys(project).map(field => {
                                            if (!['ID', 'ID_Parent', 'availability', 'points', 'required_points', 'cost', 'name', 'description', 'category'].includes(field)) {
                                                return (
                                                    <td key={field}>
                                                        {renderDynamicField(project as ExtendedResearchProject, field)}
                                                    </td>
                                                );
                                            }
                                            return null;
                                        })}

                                        <td>
                                            <button className="btn btn-danger" onClick={() => handleDeleteProject(category, project.ID)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-between">
                            <button
                                className="btn btn-secondary"
                                onClick={() => handlePageChange(category, currentPage[category] - 1)}
                                disabled={currentPage[category] === 1}
                            >
                                Previous
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => handlePageChange(category, currentPage[category] + 1)}
                                disabled={currentPage[category] * pageSize >= researchProjects[category].projects.length}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <button className="btn btn-primary mb-4" onClick={handleCopyToClipboard}>Copy Data to Clipboard</button>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
    );
};

export default ResearchesEditor;
