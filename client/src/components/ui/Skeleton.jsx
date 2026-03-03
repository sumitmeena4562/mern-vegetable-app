import React from 'react';

const Skeleton = ({
    variant = 'text',
    width = 'w-full',
    height,
    className = ''
}) => {
    const baseStyle = "animate-pulse bg-slate-100";

    if (variant === 'circular') {
        return <div className={`${baseStyle} rounded-full ${width} ${height || 'h-10'} ${className}`} />;
    }

    if (variant === 'rectangular' || variant === 'card') {
        return <div className={`${baseStyle} rounded-2xl ${width} ${height || 'h-32'} ${className}`} />;
    }

    // default text variant
    return <div className={`${baseStyle} rounded-md ${width} ${height || 'h-4'} ${className}`} />;
};

export default Skeleton;
