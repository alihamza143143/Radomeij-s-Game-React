import React from 'react';

interface ConsumersEditorProps {
    onClose: () => void;
}

const ConsumersEditor: React.FC<ConsumersEditorProps> = ({ onClose }) => {
    return (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center">
            <h2 className="text-3xl mb-4">Consumers Editor</h2>
            {/* Dodaj logikę edytora konsumentów tutaj */}
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
    );
};

export default ConsumersEditor;
