export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: string;
}

export enum CodeType {
    HTML = 'HTML',
    CSS = 'CSS',
    JS = 'JavaScript'
}

export interface CodeUpdate {
    language: CodeType;
    content: string;
}

export interface ClickedElementInfo {
    tagName: string;
    id: string;
    className: string;
    innerText: string;
}