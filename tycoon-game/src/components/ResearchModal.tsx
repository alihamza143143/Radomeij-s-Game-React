import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { ResearchProject, setResearchProject } from '../store/resaearchSlice';
import { getProjectProgress } from '../utils/researchUtils';

interface ResearchModalProps {
    project: ResearchProject | null;
    onClose: () => void;
}

const ResearchModal: React.FC<ResearchModalProps> = ({ project, onClose }) => {
    const dispatch = useDispatch();
    const currentProject = useSelector((state: RootState) => state.research.currentProject);
    const startedResearch = useSelector((state: RootState) => state.research.startedResearch);

    const [showWarning, setShowWarning] = useState(false);

    if (!project) return null;

    const handleReplace = () => {
        const progress = getProjectProgress(startedResearch, project.ID);
        if (currentProject && progress > 0) {
            setShowWarning(true);
        } else {
            dispatch(setResearchProject(project));
            onClose();
        }
    };

    const handleConfirmReplace = () => {
        dispatch(setResearchProject(project));
        onClose();
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Select Research</h3>
                <p className="py-4">
                    {project.name}: Cost {project.cost}, Research Points {project.required_points}
                </p>
                {showWarning ? (
                    <div className="alert alert-warning">
                        <span>You have ongoing research. Are you sure you want to replace it?</span>
                        <div className="modal-action">
                            <button className="btn btn-error" onClick={handleConfirmReplace}>Replace</button>
                            <button className="btn" onClick={onClose}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div className="modal-action">
                        <button className="btn" onClick={handleReplace}>OK</button>
                        <button className="btn" onClick={onClose}>Cancel</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResearchModal;
