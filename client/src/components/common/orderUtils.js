/**
 * Shared order status badge utility.
 * Used by LeftPanel, RightPanel, OrderManagement, etc.
 */
export const getStatusBadge = (status) => {
    const map = {
        'pending': { label: 'New', color: 'bg-orange-100 text-orange-700' },
        'confirmed': { label: 'Confirmed', color: 'bg-blue-100 text-blue-700' },
        'processing': { label: 'Packing', color: 'bg-indigo-100 text-indigo-700' },
        'ready_for_pickup': { label: 'Ready', color: 'bg-green-100 text-green-700' },
        'in_transit': { label: 'In Transit', color: 'bg-purple-100 text-purple-700' },
        'delivered': { label: 'Done', color: 'bg-emerald-100 text-emerald-700' },
        'cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
        'refunded': { label: 'Refunded', color: 'bg-slate-100 text-slate-700' },
    };
    return map[status] || { label: status, color: 'bg-slate-100 text-slate-700' };
};

export const getTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just Now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
};
