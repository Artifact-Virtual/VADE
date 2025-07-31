import React, { useState, useEffect, useCallback } from 'react';
import { CodeType } from '../types';
import { PlayIcon, BugIcon, ExportIcon, ExternalLinkIcon } from './icons';
import { ai } from '../services/geminiService';
import JSZip from 'jszip';

interface CodeEditorProps {
    value: string;
    onChange: (value: string) => void;
    language: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, language }) => {
    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full p-4 font-mono text-sm bg-transparent text-gray-200 resize-none outline-none border-none placeholder-gray-500"
            placeholder={`Write your ${language} code here...`}
            spellCheck="false"
        />
    );
};

interface CodePaneProps {
    htmlCode: string;
    setHtmlCode: (code: string) => void;
    cssCode: string;
    setCssCode: (code: string) => void;
    jsCode: string;
    setJsCode: (code: string) => void;
}

const iframeScript = `
    let lastClicked = null;
    document.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (lastClicked) {
            lastClicked.style.outline = '';
        }

        const target = e.target;
        target.style.outline = '2px solid #A855F7';
        lastClicked = target;

        const elementInfo = {
            tagName: target.tagName,
            id: target.id,
            className: target.className,
            innerText: target.innerText,
        };
        window.parent.postMessage({ type: 'VADE_ELEMENT_CLICK', data: elementInfo }, '*');
    }, true);
`;


export const CodePane: React.FC<CodePaneProps> = ({
    htmlCode,
    setHtmlCode,
    cssCode,
    setCssCode,
    jsCode,
    setJsCode,
}) => {
    const [activeTab, setActiveTab] = useState<CodeType>(CodeType.HTML);
    const [srcDoc, setSrcDoc] = useState('');
    const [isDebugging, setIsDebugging] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const updatePreview = useCallback(() => {
        const timeout = setTimeout(() => {
            setSrcDoc(`
                <html>
                    <head>
                        <style>${cssCode}</style>
                    </head>
                    <body>
                        ${htmlCode}
                        <script>${jsCode}</script>
                        <script>${iframeScript}</script>
                    </body>
                </html>
            `);
        }, 300);
        return () => clearTimeout(timeout);
    }, [htmlCode, cssCode, jsCode]);
    
    const openInNewTab = useCallback(() => {
        const blob = new Blob([srcDoc], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        // URL.revokeObjectURL(url) is not called to keep the tab open
    }, [srcDoc]);


    useEffect(() => {
        updatePreview();
    }, [updatePreview]);
    
    const handleExport = useCallback(async () => {
        if (isExporting) return;
        setIsExporting(true);

        try {
            const zip = new JSZip();
            
            const finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VADE Export</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    ${htmlCode}
    <script src="script.js"></script>
</body>
</html>`;

            zip.file("index.html", finalHtml);
            zip.file("style.css", cssCode);
            zip.file("script.js", jsCode);

            const blob = await zip.generateAsync({ type: "blob" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "vade-export.zip";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error("Failed to export files:", error);
        } finally {
            setIsExporting(false);
        }
    }, [htmlCode, cssCode, jsCode, isExporting]);

    const handleDebugCode = useCallback(async () => {
        if (isDebugging) return;
        setIsDebugging(true);

        let codeToDebug = '';
        const language = activeTab;

        if (language === CodeType.HTML) codeToDebug = htmlCode;
        else if (language === CodeType.CSS) codeToDebug = cssCode;
        else codeToDebug = jsCode;

        if (!codeToDebug.trim()) {
            setIsDebugging(false);
            return;
        }

        const systemInstruction = `You are an expert code debugging assistant. Analyze the provided ${language} code snippet, identify any errors, bugs, or logic issues, and provide a corrected version. Your response must contain ONLY the fixed code, without any additional explanations, comments, or markdown formatting (like \`\`\`${language.toLowerCase()}\`). The goal is to produce clean, ready-to-use code that can directly replace the original.`;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: codeToDebug,
                config: {
                    systemInstruction: systemInstruction,
                    temperature: 0,
                }
            });
            const fixedCode = response.text;

            if (language === CodeType.HTML) setHtmlCode(fixedCode);
            else if (language === CodeType.CSS) setCssCode(fixedCode);
            else setJsCode(fixedCode);

        } catch (error) {
            console.error("Error debugging code:", error);
        } finally {
            setIsDebugging(false);
        }
    }, [activeTab, htmlCode, cssCode, jsCode, setHtmlCode, setCssCode, setJsCode, isDebugging]);

    const editors = {
        [CodeType.HTML]: <CodeEditor value={htmlCode} onChange={setHtmlCode} language="HTML" />,
        [CodeType.CSS]: <CodeEditor value={cssCode} onChange={setCssCode} language="CSS" />,
        [CodeType.JS]: <CodeEditor value={jsCode} onChange={setJsCode} language="JavaScript" />,
    };

    return (
        <div className="flex flex-col h-full bg-transparent rounded-l-xl overflow-hidden">
            <div className="flex-1 flex flex-col min-h-0 pt-3 px-3">
                <header className="flex-shrink-0 flex items-center justify-between z-10 mb-3">
                    <div className="flex items-center space-x-2 p-1 rounded-xl shadow-[inset_4px_4px_8px_#000000,inset_-4px_-4px_8px_#1a1a1a] bg-[#0d0d0d]">
                        {(Object.keys(CodeType) as Array<keyof typeof CodeType>).map(key => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(CodeType[key])}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                                    activeTab === CodeType[key]
                                        ? 'text-indigo-300 shadow-[4px_4px_8px_#000000,-4px_-4px_8px_#1a1a1a]'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {CodeType[key]}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center space-x-3">
                         <button
                            onClick={handleDebugCode}
                            disabled={isDebugging}
                            className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 text-orange-300 shadow-[4px_4px_8px_#000000,-4px_-4px_8px_#1a1a1a] hover:text-orange-200 active:shadow-[inset_4px_4px_8px_#000000,inset_-4px_-4px_8px_#1a1a1a] disabled:shadow-none disabled:cursor-wait disabled:text-gray-500"
                        >
                            {isDebugging ? (
                                 <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                            ) : (
                                <BugIcon className="h-5 w-5" />
                            )}
                            <span>{isDebugging ? 'Debugging...' : 'Debug'}</span>
                        </button>
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 text-green-300 shadow-[4px_4px_8px_#000000,-4px_-4px_8px_#1a1a1a] hover:text-green-200 active:shadow-[inset_4px_4px_8px_#000000,inset_-4px_-4px_8px_#1a1a1a] disabled:shadow-none disabled:cursor-wait disabled:text-gray-500"
                        >
                           {isExporting ? (
                                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                           ) : (
                                <ExportIcon className="h-5 w-5" />
                           )}
                            <span>{isExporting ? 'Exporting...' : 'Export'}</span>
                        </button>
                    </div>
                </header>
                <div className="flex-1 relative rounded-xl shadow-[inset_4px_4px_8px_#000000,inset_-4px_-4px_8px_#1a1a1a]">
                    {editors[activeTab]}
                </div>
            </div>
            
            <div className="flex-1 flex flex-col min-h-0 border-t-2 border-black/50 mt-3 p-3">
                 <header className="flex-shrink-0 flex items-center justify-between mb-3">
                    <div className="flex items-center">
                        <PlayIcon className="h-5 w-5 mr-2 text-green-400" />
                        <h2 className="text-md font-semibold text-gray-200">Live Preview</h2>
                    </div>
                    <button onClick={openInNewTab} className="p-1.5 rounded-lg transition-all duration-300 text-gray-400 hover:text-white active:shadow-[inset_2px_2px_4px_#000000,inset_-2px_-2px_4px_#1a1a1a]">
                        <ExternalLinkIcon className="h-5 w-5" />
                    </button>
                </header>
                <div className="flex-1 w-full rounded-xl shadow-[4px_4px_8px_#000000,-4px_-4px_8px_#1a1a1a] overflow-hidden">
                    <iframe
                        srcDoc={srcDoc}
                        title="Live Preview"
                        sandbox="allow-scripts"
                        className="w-full h-full bg-white border-none"
                    />
                </div>
            </div>
        </div>
    );
};