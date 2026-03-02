import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';


const SubmissionSuccess = ({ productName, onComplete }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setShow(true);
        const timer = setTimeout(() => {

            setShow(false);
            setTimeout(onComplete, 500);
        }, 2500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return ReactDOM.createPortal(
        <div className={`fixed inset-0 z-[999] flex items-center justify-center p-4 transition-all duration-500 ${show ? 'opacity-100 backdrop-blur-md bg-slate-900/40' : 'opacity-0 backdrop-blur-0 bg-transparent pointer-events-none'}`}>
            <div className={`bg-white rounded-[48px] p-8 md:p-12 max-w-sm w-full shadow-2xl shadow-green-900/20 transform transition-all duration-500 flex flex-col items-center text-center ${show ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-12 scale-90 opacity-0'}`}>

                {/* Animated Check Circle */}
                <div className="relative mb-8">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-in zoom-in spin-in-12 duration-700 delay-200">
                        <span className="material-symbols-outlined text-white text-5xl font-black">check</span>
                    </div>
                    {/* Decorative Rings */}
                    <div className="absolute inset-0 w-24 h-24 border-4 border-green-500/30 rounded-full animate-ping"></div>
                </div>

                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 italic">Great Success!</h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-6">Product Published Successfully</p>

                <div className="bg-slate-50 w-full p-4 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Listed Product</p>
                    <p className="text-lg font-black text-green-700 truncate">{productName}</p>
                </div>

                <div className="mt-8 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce delay-200"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Redirecting to Dashboard</p>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default SubmissionSuccess;
