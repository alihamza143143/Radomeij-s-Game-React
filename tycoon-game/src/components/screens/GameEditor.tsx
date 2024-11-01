import React, { useState } from 'react';
import ParticlesBackground from '../backgrounds/ParticlesBackground';
import ConsumersEditor from '../mods/ConsumersEditor';
import ProductEditor from '../mods/ProductEditor';
import ResearchesEditor from '../mods/ResearchesEditor';

interface GameEditorProps {
    onExitGameEditor: () => void;
}

const GameEditor: React.FC<GameEditorProps> = ({ onExitGameEditor }) => {
    const [activeEditor, setActiveEditor] = useState<'researches' | 'products' | 'consumers' | null>(null);

    const handleOpenEditor = (editor: 'researches' | 'products' | 'consumers') => {
        setActiveEditor(editor);
    };

    const handleCloseEditor = () => {
        setActiveEditor(null);
    };

    return (
        <div className="relative min-h-screen bg-base-200 flex flex-col items-center justify-center">
            <ParticlesBackground />
           {activeEditor == null && <div className="relative z-10 bg-blue-700 p-4">
                <h1 className="text-4xl mb-4">Game Editor</h1>
                <button className="btn btn-primary w-36 mb-4" onClick={() => handleOpenEditor('researches')}>Researches Editor</button>
                <button className="btn btn-primary w-36 mb-4" onClick={() => handleOpenEditor('products')}>Product Editor</button>
                <button className="btn btn-primary w-36 mb-4" onClick={() => handleOpenEditor('consumers')}>Consumers Editor</button>
                <button className="btn btn-secondary w-36 mb-4" onClick={onExitGameEditor}>Back to Main Menu</button>
            </div> }
            {activeEditor === 'researches' && <ResearchesEditor onClose={handleCloseEditor} />}
            {activeEditor === 'products' && <ProductEditor onClose={handleCloseEditor} />}
            {activeEditor === 'consumers' && <ConsumersEditor onClose={handleCloseEditor} />}
        </div>
    );
};

export default GameEditor;
