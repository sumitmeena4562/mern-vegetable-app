import React from 'react';

/**
 * Global Loader component — replaces all manual animate-spin patterns.
 *
 * Variants:
 *   - "fullPage"  → centered spinner on full viewport (ProtectedRoute, Overview, Invoice)
 *   - "section"   → centered spinner inside a container (Settings save, data sections)
 *   - "inline"    → small inline spinner (inside text, next to labels)
 *
 * @param {string}  variant      "fullPage" | "section" | "inline"  (default: "section")
 * @param {string}  text         optional loading text below/beside spinner
 * @param {string}  color        tailwind color base  (e.g. "green", "indigo", "slate")
 * @param {string}  size         "sm" | "md" | "lg"
 * @param {string}  className    extra wrapper classes
 */
const Loader = ({
    variant = 'section',
    text,
    color = 'green',
    size = 'md',
    className = ''
}) => {
    const sizeMap = {
        sm: { spinner: 'w-6 h-6 border-2', text: 'text-[10px]' },
        md: { spinner: 'w-10 h-10 border-3', text: 'text-xs' },
        lg: { spinner: 'w-16 h-16 border-4', text: 'text-xs' },
    };

    const s = sizeMap[size] || sizeMap.md;

    const spinner = (
        <div className={`${s.spinner} border-${color}-100 border-t-${color}-600 rounded-full animate-spin`} />
    );

    /* ─── fullPage: vh-centered ─── */
    if (variant === 'fullPage') {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center gap-4 ${className}`}>
                <div className={`${sizeMap.lg.spinner} border-${color}-100 border-t-${color}-600 rounded-full animate-spin`} />
                {text && <p className={`text-slate-400 font-black uppercase tracking-widest ${sizeMap.lg.text}`}>{text}</p>}
            </div>
        );
    }

    /* ─── inline: horizontal beside text ─── */
    if (variant === 'inline') {
        return (
            <span className={`inline-flex items-center gap-2 ${className}`}>
                <div className={`${sizeMap.sm.spinner} border-${color}-200 border-t-${color}-600 rounded-full animate-spin`} />
                {text && <span className={`text-slate-500 font-medium ${sizeMap.sm.text}`}>{text}</span>}
            </span>
        );
    }

    /* ─── section (default): centered inside a box ─── */
    return (
        <div className={`flex flex-col items-center justify-center p-12 gap-4 ${className}`}>
            {spinner}
            {text && <p className={`text-slate-400 font-black uppercase tracking-widest ${s.text}`}>{text}</p>}
        </div>
    );
};

export default Loader;
