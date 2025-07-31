import React, { useState, useEffect } from 'react';
import { ClickedElementInfo } from '../types';

interface InlineEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (prompt: string) => void;
    elementInfo: ClickedElementInfo | null;
}

export const InlineEditModal: React.FC<InlineEditModalProps> = ({ isOpen, onClose, onSubmit, elementInfo }) => {
    const [prompt, setPrompt] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setPrompt('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            onSubmit(prompt);
        }
    };

    const elementTag = elementInfo?.tagName.toLowerCase() ?? 'element';
    const elementId = elementInfo?.id ? `#${elementInfo.id}`: '';
    const elementClasses = elementInfo?.className ? `.${elementInfo.className.split(' ').join('.')}` : '';

    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-[#0d0d0d] rounded-xl shadow-[8px_8px_16px_#000000,-8px_-8px_16px_#1a1a1a] w-full max-w-lg p-6 mx-4 transform transition-all duration-300 scale-95"
                onClick={(e) => e.stopPropagation()}
                style={{ transform: isOpen ? 'scale(1)' : 'scale(0.95)' }}
            >
                <header className="mb-4">
                    <h2 className="text-xl font-bold text-indigo-300">VADE Edit Assistant</h2>
                    <p className="text-sm text-gray-400">
                        Editing: <code className="bg-black/50 px-1.5 py-0.5 rounded">{`${elementTag}${elementId}${elementClasses}`}</code>
                    </p>
                </header>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={`What should I change about this <${elementTag}>?`}
                        className="w-full p-3 h-28 bg-transparent rounded-lg focus:outline-none placeholder-gray-500 shadow-[inset_4px_4px_8px_#000000,inset_-4px_-4px_8px_#1a1a1a] resize-none mb-4"
                        autoFocus
                    />
                    <div className="flex justify-end space-x-3">
                         <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-sm font-semibold rounded-lg transition-all duration-300 text-gray-400 hover:text-white active:shadow-[inset_4px_4px_8px_#000000,inset_-4px_-4px_8px_#1a1a1a]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!prompt.trim()}
                            className="px-6 py-2 text-sm font-semibold rounded-lg transition-all duration-300 text-indigo-300 shadow-[4px_4px_8px_#000000,-4px_-4px_8px_#1a1a1a] hover:text-indigo-200 active:shadow-[inset_4px_4px_8px_#000000,inset_-4px_-4px_8px_#1a1a1a] disabled:shadow-none disabled:cursor-not-allowed disabled:text-gray-600"
                        >
                            Update Code
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
