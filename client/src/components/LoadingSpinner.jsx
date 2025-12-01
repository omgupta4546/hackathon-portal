import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
            <div className="relative w-24 h-24">
                {/* Outer Ring */}
                <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-ping opacity-75"></div>

                {/* Middle Ring */}
                <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>

                {/* Inner Ring */}
                <div className="absolute top-2 left-2 w-20 h-20 border-4 border-t-transparent border-r-pink-500 border-b-transparent border-l-cyan-500 rounded-full animate-spin-reverse"></div>

                {/* Center Dot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
            </div>
            <div className="mt-8 text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
                Loading...
            </div>
            <style jsx>{`
                @keyframes spin-reverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                .animate-spin-reverse {
                    animation: spin-reverse 1.5s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default LoadingSpinner;
