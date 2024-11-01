import React from 'react';

interface ProductEditorProps {
    onClose: () => void;
}

const ProductEditor: React.FC<ProductEditorProps> = ({ onClose }) => {
    return (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center">
            <h2 className="text-3xl mb-4">Product Editor</h2>
            {/* Dodaj logikę edytora produktów tutaj */}
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
    );
};

export default ProductEditor;
