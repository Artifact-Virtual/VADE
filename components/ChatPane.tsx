import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { SendIcon, UserIcon, BotIcon } from './icons';


interface ChatPaneProps {
    messages: ChatMessage[];
    isLoading: boolean;
    onSendMessage: (message: string) => void;
    isPristine: boolean;
}

const AnimatedHeader = () => (
    <div className="p-4 text-center h-24 flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold text-gray-200 animate-welcome">WELCOME</h2>
        <h3 className="text-xl font-medium text-gray-400 animate-build-prompt">What do we build today?</h3>
    </div>
);

export const ChatPane: React.FC<ChatPaneProps> = ({ messages, isLoading, onSendMessage, isPristine }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSendMessage(input);
        setInput('');
    };

    return (
        <div className="flex flex-col h-full bg-transparent text-gray-200">
            {isPristine ? <AnimatedHeader /> : <div className="p-3 border-b-2 border-black/50 shadow-md"><h2 className="text-xl font-bold text-center text-gray-300">VADE</h2></div>}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && <BotIcon className="h-10 w-10 flex-shrink-0" />}
                        <div className={`max-w-xl p-4 rounded-xl text-gray-200 ${msg.role === 'model' ? 'shadow-[4px_4px_8px_#000000,-4px_-4px_8px_#1a1a1a] bg-gradient-to-br from-[#1e1e1e] to-[#141414]' : 'shadow-[4px_4px_8px_#000000,-4px_-4px_8px_#1a1a1a] bg-gradient-to-br from-[#2a2f33] to-[#212529]'}`}>
                           <p className="whitespace-pre-wrap">{msg.text || <span className="animate-pulse">...</span>}</p>
                        </div>
                         {msg.role === 'user' && <UserIcon className="h-10 w-10 flex-shrink-0" />}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t-2 border-black/50">
                <form onSubmit={handleFormSubmit} className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Chat with AVA..."
                        disabled={isLoading}
                        className="w-full p-3 bg-transparent rounded-lg focus:outline-none placeholder-gray-500 shadow-[inset_4px_4px_8px_#000000,inset_-4px_-4px_8px_#1a1a1a]"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-3 rounded-full hover:text-white active:shadow-[inset_4px_4px_8px_#000000,inset_-4px_-4px_8px_#1a1a1a] transition-all duration-200 shadow-[4px_4px_8px_#000000,-4px_-4px_8px_#1a1a1a] disabled:shadow-none disabled:cursor-not-allowed text-indigo-400"
                    >
                        <SendIcon className="h-6 w-6" />
                    </button>
                </form>
            </div>
        </div>
    );
};