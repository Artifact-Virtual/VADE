import React from 'react';

export const BugIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.182 15.182 1.5-1.5m-3.03 3.03-1.5-1.5m-3.03 3.03-1.5-1.5m1.5-3.03-1.5-1.5m3.03-3.03-1.5-1.5m-1.5 9 .03-.03m-.03.03-.03-.03m9-6 .03.03m-.03-.03.03-.03m-6 9 .03-.03m-.03.03-.03-.03m-3-6 .03.03m-.03-.03.03-.03m3-3 .03.03m-.03-.03.03-.03m6 6 .03.03m-.03-.03.03-.03M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);


export const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

export const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 0 1 0 1.971l-11.54 6.347a1.125 1.125 0 0 1-1.667-.985V5.653Z" />
    </svg>
);

export const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="userGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#868f96', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#596164', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="userShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
                <feOffset dx="1" dy="1" result="offsetblur" />
                <feFlood floodColor="#000000" floodOpacity="0.4" />
                <feComposite in2="offsetblur" operator="in" />
                <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <g filter="url(#userShadow)">
            <circle cx="16" cy="16" r="14" fill="url(#userGrad)" />
            <path d="M16 8 C18.761 8 21 10.239 21 13 C21 15.761 18.761 18 16 18 C13.239 18 11 15.761 11 13 C11 10.239 13.239 8 16 8 Z M 6.8847656 24.316406 C 7.8017578 22.519531 9.7744141 21 12 21 L 20 21 C 22.225586 21 24.198242 22.519531 25.115234 24.316406 C 22.955078 26.046875 20.101562 27 17 27 L 15 27 C 11.898438 27 9.0449219 26.046875 6.8847656 24.316406 Z" fill="#2d3032"/>
            <path d="M16 8 C18.761 8 21 10.239 21 13 C21 14.5 20.2 15.8 19 16.5 C 19.5 15.5 20 14.3 20 13 C 20 10.791 18.209 9 16 9 C 13.791 9 12 10.791 12 13 C 12 14.3 12.5 15.5 13 16.5 C 11.8 15.8 11 14.5 11 13 C 11 10.239 13.239 8 16 8 Z" fill="rgba(255,255,255,0.1)"/>
        </g>
    </svg>
);

export const BotIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="botGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
            <linearGradient id="botGradSecondary" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3a3a3a" />
                <stop offset="100%" stopColor="#2c2c2c" />
            </linearGradient>
             <linearGradient id="botGloss" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0.15" />
                <stop offset="50%" stopColor="white" stopOpacity="0.0" />
            </linearGradient>
            <filter id="botShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
                <feOffset dx="1" dy="2" result="offsetblur" />
                <feFlood floodColor="#000000" floodOpacity="0.5" />
                <feComposite in2="offsetblur" operator="in" />
                <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <g filter="url(#botShadow)">
            <path d="M16 2 C8.268 2 2 8.268 2 16 S 8.268 30 16 30 S 30 23.732 30 16 S 23.732 2 16 2 Z" fill="url(#botGradSecondary)"/>
            <path d="M22,12 v-2 h-4 v-2 h-4 v2 h-4 v2 h-2 v4 h2 v4 h-2 v2 h2 v-2 h4 v2 h4 v-2 h4 v-2 h-2 v-4 h2 Z" fill="#222"/>
            
            <path d="M16,7 a9,9 0 0,1 9,9 h-2 a7,7 0 0,0 -7,-7 Z" fill="rgba(255,255,255,0.05)"/>

            {/* Visor */}
            <rect x="9" y="13" width="14" height="6" rx="2" fill="url(#botGradPrimary)" />
            <rect x="9" y="13" width="14" height="6" rx="2" fill="url(#botGloss)" />
            <rect x="10" y="14" width="12" height="4" rx="1" fill="#111" />
            <rect x="10.5" y="14.5" width="11" height="3" rx="0.5" fill="url(#botGradPrimary)" opacity="0.6"/>

            {/* Antenna */}
            <path d="M22,10 a1,1 0 0,1 -1,-1 v-2 a1,1 0 0,1 2,0 v2 a1,1 0 0,1 -1,1 Z" fill="#444"/>
            <circle cx="22" cy="6" r="1.5" fill="url(#botGradPrimary)" />
        </g>
    </svg>
);


export const ExportIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

export const ExternalLinkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-4.5 0V6.375c0-.621.504-1.125 1.125-1.125H18m-4.5 0-5.625 5.625" />
    </svg>
);