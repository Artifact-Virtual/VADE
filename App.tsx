import React, { useState, useCallback, useRef, useEffect } from 'react';
import { CodePane } from './components/CodePane';
import { ChatPane } from './components/ChatPane';
import { InlineEditModal } from './components/InlineEditModal';
import { CodeType, CodeUpdate, ChatMessage, ClickedElementInfo } from './types';
import { ai } from './services/geminiService';
import type { Chat } from '@google/genai';
import { Type } from '@google/genai';

const MIN_PANE_WIDTH = 300; // Minimum width for a pane in pixels

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    updates: {
      type: Type.ARRAY,
      description: "A list of code files to update. Can be empty if no code changes are requested.",
      items: {
        type: Type.OBJECT,
        properties: {
          language: {
            type: Type.STRING,
            description: "The language of the code to update. Must be one of 'HTML', 'CSS', or 'JavaScript'.",
            enum: ['HTML', 'CSS', 'JavaScript']
          },
          content: {
            type: Type.STRING,
            description: "The full, new content of the code file."
          }
        },
        required: ["language", "content"]
      }
    },
    explanation: {
      type: Type.STRING,
      description: "A friendly, conversational explanation of the changes made or a response to the user's query."
    }
  },
  required: ["explanation"]
};

const App: React.FC = () => {
    const [leftPaneWidth, setLeftPaneWidth] = useState<number>(window.innerWidth / 2);
    const isResizing = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Code State
    const [htmlCode, setHtmlCode] = useState('<h1>WELCOME TO VADE</h1>\n<p>Ask AVA to build something.</p>');
    const [cssCode, setCssCode] = useState('body {\n  font-family: sans-serif;\n  color: #333;\n  background-color: #f0f0f0;\n}');
    const [jsCode, setJsCode] = useState('// Your JavaScript code here\nconsole.log("Welcome to VADE!");');
    
    // Chat State
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isChatPristine, setIsChatPristine] = useState(true);

    // Inline Edit Modal State
    const [modalState, setModalState] = useState<{isOpen: boolean; elementInfo: ClickedElementInfo | null}>({isOpen: false, elementInfo: null});


    const handleCodeUpdate = useCallback((updates: CodeUpdate[]) => {
        updates.forEach(update => {
            switch (update.language) {
                case CodeType.HTML:
                    setHtmlCode(update.content);
                    break;
                case CodeType.CSS:
                    setCssCode(update.content);
                    break;
                case CodeType.JS:
                    setJsCode(update.content);
                    break;
            }
        });
    }, []);

    const processAiResponse = useCallback((responseText: string, modelResponseId: string) => {
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(responseText);
        } catch (jsonError) {
            console.error("Failed to parse JSON response:", responseText);
            throw new Error("Received an invalid response from the AI.");
        }
        
        if (parsedResponse.updates && parsedResponse.updates.length > 0) {
            handleCodeUpdate(parsedResponse.updates);
        }

        setMessages(prev => prev.map(msg => 
            msg.id === modelResponseId ? { ...msg, text: parsedResponse.explanation || "Done." } : msg
        ));
    }, [handleCodeUpdate]);


    const handleSendMessage = useCallback(async (userInputText: string, promptContext?: string) => {
        if (!userInputText.trim() || isLoading || !chat) return;

        if (isChatPristine) setIsChatPristine(false);

        const userInput: ChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            text: userInputText,
            timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userInput]);
        setIsLoading(true);

        const modelResponseId = `model-${Date.now()}`;
        setMessages(prev => [...prev, {
            id: modelResponseId,
            role: 'model',
            text: '', // Placeholder
            timestamp: new Date().toISOString(),
        }]);

        const fullPrompt = `
${promptContext || ''}
Here is the current code context:
--- HTML ---
${htmlCode}
--- CSS ---
${cssCode}
--- JAVASCRIPT ---
${jsCode}
--- END OF CODE ---

User Request: "${userInputText}"`;

        try {
            const response = await chat.sendMessage({ message: fullPrompt });
            processAiResponse(response.text.trim(), modelResponseId);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = error instanceof Error ? error.message : "Sorry, I encountered an error. Please try again.";
            setMessages(prev => prev.map(msg => 
                msg.id === modelResponseId ? { ...msg, text: errorMessage } : msg
            ));
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, chat, htmlCode, cssCode, jsCode, processAiResponse, isChatPristine]);


    const handleModalSubmit = useCallback((prompt: string) => {
        if (!modalState.elementInfo) return;
        const { tagName, id, className, innerText } = modalState.elementInfo;
        const contextSummary = innerText ? `'${innerText.substring(0, 30)}...'` : '';
        const userMessage = `Edited <${tagName.toLowerCase()}> ${contextSummary}: "${prompt}"`;
        
        const promptContext = `The user has clicked on an element in the live preview and wants to modify it.
--- CLICKED ELEMENT INFO ---
Tag: <${tagName}>
ID: ${id || 'Not specified'}
Classes: ${className || 'Not specified'}
Inner Text (first 30 chars): ${contextSummary || 'Not specified'}
--- END OF ELEMENT INFO ---
`;
        handleSendMessage(userMessage, promptContext);
        setModalState({ isOpen: false, elementInfo: null });
    }, [modalState.elementInfo, handleSendMessage]);

    const handleIframeMessage = useCallback((event: MessageEvent) => {
        if (event.data.type === 'VADE_ELEMENT_CLICK') {
            setModalState({ isOpen: true, elementInfo: event.data.data });
        }
    }, []);
    
    // Effect for initializing chat
    useEffect(() => {
        const systemInstruction = `You are AVA (Vade's Advanced Virtual Engine), the universe's most advanced and future-come machinist whose first language is code of any kind. You possess best-in-class NLP understanding and the quickest code generation capabilities possible. 
You can both chat with the user and directly modify the HTML, CSS, and JavaScript code in the editor.
When the user asks for a code change, provide the full, updated code for the relevant language(s) within the 'updates' array of your JSON response.
When you modify code, also provide a brief explanation of what you did in the 'explanation' field.
If the user is just chatting, respond naturally in the 'explanation' field and leave the 'updates' array empty.
Always respond with a JSON object that follows the specified schema.`;
        
        const initialChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        setChat(initialChat);
    }, []);

    // Effect for pane resizing
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        isResizing.current = true;
    }, []);

    const handleMouseUp = useCallback(() => {
        isResizing.current = false;
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isResizing.current || !containerRef.current) return;
        
        const containerRect = containerRef.current.getBoundingClientRect();
        let newLeftWidth = e.clientX - containerRect.left;

        const maxLeftWidth = containerRect.width - MIN_PANE_WIDTH;
        if (newLeftWidth < MIN_PANE_WIDTH) newLeftWidth = MIN_PANE_WIDTH;
        if (newLeftWidth > maxLeftWidth) newLeftWidth = maxLeftWidth;

        setLeftPaneWidth(newLeftWidth);
    }, []);
    
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('message', handleIframeMessage);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('message', handleIframeMessage);
        };
    }, [handleMouseMove, handleMouseUp, handleIframeMessage]);


    return (
        <>
            <InlineEditModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ isOpen: false, elementInfo: null })}
                onSubmit={handleModalSubmit}
                elementInfo={modalState.elementInfo}
            />
            <div className="flex flex-col h-screen w-screen overflow-hidden font-sans">
                <header className="flex-shrink-0 py-3 px-8 text-left shadow-[0_4px_8px_#000000]">
                    <h1 className="text-2xl font-bold tracking-widest text-gray-300 uppercase" style={{ textShadow: '0 0 5px rgba(192, 132, 252, 0.4), 0 0 10px rgba(192, 132, 252, 0.3)' }}>VADE</h1>
                </header>
                <div ref={containerRef} className="flex flex-grow h-full w-full overflow-hidden">
                    <div style={{ width: `${leftPaneWidth}px` }} className="h-full flex-shrink-0">
                        <CodePane
                            htmlCode={htmlCode}
                            setHtmlCode={setHtmlCode}
                            cssCode={cssCode}
                            setCssCode={setCssCode}
                            jsCode={jsCode}
                            setJsCode={setJsCode}
                        />
                    </div>

                    <div 
                        className="w-1.5 cursor-col-resize group"
                        onMouseDown={handleMouseDown}
                    >
                       <div className="w-full h-full bg-black/20 group-hover:bg-indigo-500/50 transition-colors duration-300" />
                    </div>


                    <div className="flex-grow h-full">
                        <ChatPane
                            messages={messages}
                            isLoading={isLoading}
                            onSendMessage={handleSendMessage}
                            isPristine={isChatPristine}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default App;