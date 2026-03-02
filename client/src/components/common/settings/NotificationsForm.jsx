import React from 'react';

const NotificationsForm = ({ notifications, toggleNotification, themeColor = 'blue' }) => {
    const themes = {
        green: { iconBg: 'bg-blue-50', iconColor: 'text-blue-600', toggleBg: 'bg-green-500' },
        blue: { iconBg: 'bg-blue-50', iconColor: 'text-blue-600', toggleBg: 'bg-blue-500' },
        indigo: { iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', toggleBg: 'bg-indigo-500' }
    };
    const theme = themes[themeColor] || themes.blue;

    const notifOptions = [
        { key: 'email', label: 'Email Notifications', desc: 'Receive order updates and reports via email', icon: 'mail' },
        { key: 'sms', label: 'SMS Notifications', desc: 'Get text alerts for urgent updates', icon: 'sms' },
        { key: 'push', label: 'Push Notifications', desc: 'Browser and mobile push alerts', icon: 'notifications_active' },
    ];

    return (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 ${theme.iconBg} rounded-2xl flex items-center justify-center ${theme.iconColor}`}>
                    <span className="material-symbols-outlined text-3xl">notifications</span>
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Notification Preferences</h3>
                    <p className="text-xs text-slate-400 font-medium">Control how you receive alerts</p>
                </div>
            </div>

            <div className="space-y-4">
                {notifOptions.map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                                <span className="material-symbols-outlined text-slate-500 text-lg">{item.icon}</span>
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-800">{item.label}</p>
                                <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => toggleNotification(item.key)}
                            className={`relative w-12 h-7 rounded-full transition-all shrink-0 ${notifications[item.key] ? theme.toggleBg : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all ${notifications[item.key] ? 'left-6' : 'left-1'}`}></div>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationsForm;
