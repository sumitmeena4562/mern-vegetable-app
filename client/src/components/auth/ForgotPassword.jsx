import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { sendForgotPasswordOtp, verifyResetOtp, resetPasswordWithOtp } from '../../api/userApi';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [tempToken, setTempToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [timer, setTimer] = useState(0);

    const navigate = useNavigate();

    // Timer Logic
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const checkPasswordStrength = (pass) => {
        let score = 0;
        if (pass.length > 5) score++;
        if (pass.length > 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        setPasswordStrength(Math.min(score, 5));
    };

    const getStrengthColor = () => {
        if (passwordStrength <= 2) return "bg-red-400";
        if (passwordStrength === 3) return "bg-amber-400";
        return "bg-green-500";
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!identifier) return toast.error("Please enter a valid Mobile or Email");

        setLoading(true);
        try {
            const res = await sendForgotPasswordOtp(identifier);
            if (res.success) {
                toast.success(res.message);
                setStep(2);
                setTimer(300);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp || otp.length < 4) return toast.error("Please enter valid OTP");

        setLoading(true);
        try {
            const res = await verifyResetOtp(identifier, otp);
            if (res.success) {
                toast.success("OTP Verified!");
                setTempToken(res.tempToken);
                setStep(3);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) return toast.error("Password must be at least 6 chars");
        if (newPassword !== confirmPassword) return toast.error("Passwords do not match");

        setLoading(true);
        try {
            const res = await resetPasswordWithOtp(tempToken, newPassword);
            if (res.success) {
                toast.success("Password Reset Successfully!");
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-50">
            <Toaster position="top-center" toastOptions={{
                style: { background: '#333', color: '#fff', borderRadius: '12px' }
            }} />

            {/* Background Animations */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-slate-50 to-emerald-50 pointer-events-none" />
            <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-200/20 to-blue-200/20 blur-[100px] animate-pulse" />
            <div className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-green-200/20 to-teal-200/20 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <Link to="/login" className="absolute -top-16 left-0 text-slate-500 hover:text-slate-800 flex items-center gap-2 font-bold text-sm transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Back to Login
                </Link>

                <div className="text-center mb-10">
                    <div className="inline-block relative">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200/50 mb-4 border border-slate-100">
                            <span className="material-symbols-outlined text-3xl text-emerald-600">lock_reset</span>
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                        Forgot Password?
                    </h2>
                    <p className="mt-2 text-slate-500 font-medium">
                        {step === 1 && "Start by entering your registered ID"}
                        {step === 2 && "Enter the verification code"}
                        {step === 3 && "Secure your account with a new password"}
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 p-8 sm:p-10 border border-white/60 relative overflow-hidden">
                    {/* Top Progress Bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
                        <div
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-600 transition-all duration-500 ease-out"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>

                    {/* STEP 1 */}
                    {step === 1 && (
                        <form onSubmit={handleSendOtp} className="space-y-6 mt-4">
                            <div className="group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Email or Mobile</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-green-500 transition-colors">person_search</span>
                                    <input
                                        type="text"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 font-medium text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all shadow-inner"
                                        placeholder="Enter registered ID"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-green-500/20 text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:to-emerald-500 transition-all hover:-translate-y-0.5"
                            >
                                {loading ? "Sending..." : "Send Reset Code"}
                            </button>
                        </form>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp} className="space-y-6 mt-4">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start">
                                <span className="material-symbols-outlined text-blue-500 text-xl mt-0.5">sms</span>
                                <div>
                                    <p className="text-xs font-bold text-blue-800">Code Sent</p>
                                    <p className="text-xs text-blue-600 mt-1">We sent a 4-digit code to <br /><span className="font-mono font-bold text-blue-800">{identifier}</span></p>
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1 text-center">Verification Code</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    className="w-full bg-slate-50 border-none rounded-2xl py-4 font-mono text-3xl font-black text-center tracking-[0.5em] text-slate-800 placeholder-slate-300 focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all shadow-inner"
                                    placeholder="••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-green-500/20 text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:to-emerald-500 transition-all hover:-translate-y-0.5"
                            >
                                {loading ? "Verifying..." : "Verify Code"}
                            </button>

                            <div className="flex justify-between items-center text-xs font-bold px-1">
                                <button type="button" onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-600">Wrong ID?</button>
                                {timer > 0 ? (
                                    <span className="text-slate-400">Resend in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
                                ) : (
                                    <button type="button" onClick={handleSendOtp} className="text-green-600 hover:text-green-700">Resend Code</button>
                                )}
                            </div>
                        </form>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-6 mt-4">
                            <div className="space-y-4">
                                <div className="group">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">New Password</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">lock</span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => {
                                                setNewPassword(e.target.value);
                                                checkPasswordStrength(e.target.value);
                                            }}
                                            className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-12 font-medium text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all shadow-inner"
                                            placeholder="Min 6 characters"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                        </button>
                                    </div>
                                    {/* Strength Meter */}
                                    {newPassword && (
                                        <div className="flex gap-1 h-1 mt-3 px-1">
                                            {[1, 2, 3, 4, 5].map((item) => (
                                                <div key={item} className={`flex-1 rounded-full transition-all duration-300 ${item <= passwordStrength ? getStrengthColor() : "bg-slate-200"}`} />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="group">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Confirm Password</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">lock_clock</span>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 font-medium text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all shadow-inner"
                                            placeholder="Re-enter password"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-green-500/20 text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:to-emerald-500 transition-all hover:-translate-y-0.5"
                            >
                                {loading ? "Updating..." : "Reset Password"}
                            </button>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
