import React from 'react';

const Badge = ({
    status,
    className = ''
}) => {
    const statusConfig = {
        // Orders
        pending: { color: 'bg-yellow-100 text-yellow-700', icon: 'schedule' },
        processing: { color: 'bg-blue-100 text-blue-700', icon: 'package' },
        shipped: { color: 'bg-indigo-100 text-indigo-700', icon: 'local_shipping' },
        delivered: { color: 'bg-green-100 text-green-700', icon: 'check_circle' },
        cancelled: { color: 'bg-red-100 text-red-700', icon: 'cancel' },
        // Inventory
        available: { color: 'bg-green-100 text-green-700', icon: 'inventory' },
        sold: { color: 'bg-orange-100 text-orange-700', icon: 'remove_shopping_cart' },
        expired: { color: 'bg-slate-100 text-slate-600', icon: 'event_busy' },
        // Custom tags
        organic: { color: 'bg-emerald-100 text-emerald-700', icon: 'eco' },
    };

    const config = statusConfig[status?.toLowerCase()] || { color: 'bg-slate-100 text-slate-700', icon: 'info' };

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize ${config.color} ${className}`}>
            <span className="material-symbols-outlined text-[14px]">
                {config.icon}
            </span>
            {status}
        </span>
    );
};

export default Badge;
