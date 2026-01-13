import React from 'react';

export const Skeleton = ({ className = "" }) => {
    return (
        <div className={`animate-pulse bg-slate-200/50 dark:bg-slate-700/50 rounded-lg ${className}`}></div>
    );
};

export const SkeletonCircle = ({ size = "w-12 h-12", className = "" }) => {
    return (
        <div className={`animate-pulse bg-slate-200/50 dark:bg-slate-700/50 rounded-full ${size} ${className}`}></div>
    );
};
