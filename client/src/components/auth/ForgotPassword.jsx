import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { sendForgotPasswordOtp, verifyResetOtp, resetPasswordWithOtp } from '../../api/userApi';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Identifier, 2: OTP, 3: New Password
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [tempToken, setTempToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    // Password Strength Logic (Same as Login)
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
        if (passwordStrength <= 2) return "bg-red-500";
        if (passwordStrength === 3) return "bg-yellow-500";
        return "bg-green-500";
    };

    // OTP Timer State
    const [timer, setTimer] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    // Step 1: Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!identifier) return toast.error("Please enter Mobile or Email");

        setLoading(true);
        try {
            const res = await sendForgotPasswordOtp(identifier);
            if (res.success) {
                toast.success(res.message);
                setStep(2);
                setTimer(300); // 5 minutes
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
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

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) return toast.error("Password must be at least 6 chars");
        if (newPassword !== confirmPassword) return toast.error("Passwords do not match");

        setLoading(true);
        try {
            const res = await resetPasswordWithOtp(tempToken, newPassword);
            if (res.success) {
                toast.success("Password Reset Successfully! Login now.");
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen font-display antialiased text-gray-900 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 relative">
            <Toaster position="top-center" />

            {/* Background Pattern - same as Login */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6 relative z-10">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg mb-4">
                    <span className="material-symbols-outlined text-3xl">lock_reset</span>
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Forgot Password?</h2>
                <p className="mt-2 text-sm font-medium text-emerald-700">
                    {step === 1 && "Enter your details to receive OTP"}
                    {step === 2 && "Enter the OTP sent to your device"}
                    {step === 3 && "Create your new password"}
                </p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-[480px] relative z-10">
                <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl px-4 py-8 sm:px-10 relative overflow-hidden border border-white/60">

                    {/* Stepper Progress */}
                    <div className="flex justify-between mb-8 px-2 relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
                        <div className="absolute top-1/2 left-0 h-1 bg-green-500 -z-10 rounded-full transition-all duration-300" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${s <= step ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-110' : 'bg-gray-200 text-gray-500'}`}>
                                {s < step ? <span className="material-symbols-outlined text-base">check</span> : s}
                            </div>
                        ))}
                    </div>

                    {/* STEP 1: Enter Email/Mobile */}
                    {step === 1 && (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Registered Mobile or Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-gray-400">person_search</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        className="w-full rounded-xl py-3 pl-10 pr-4 bg-white border border-gray-300 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all font-medium"
                                        placeholder="Enter email or mobile"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/30 transition-all flex justify-center items-center"
                            >
                                {loading ? "Sending..." : "Send OTP"}
                            </button>
                        </form>
                    )}

                    {/* STEP 2: Enter OTP */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-4">OTP sent to <strong>{identifier}</strong></p>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Enter 4-Digit OTP</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    className="w-full text-center text-3xl tracking-[0.5em] font-bold py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                                    placeholder="XXXX"
                                    required
                                />
                                <div className="mt-4 text-sm text-gray-500">
                                    Time remaining: <span className="font-bold text-green-600">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/30 transition-all"
                            >
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-gray-500 text-sm font-medium hover:text-gray-700"
                            >
                                Wrong number? Go Back
                            </button>
                        </form>
                    )}

                    {/* STEP 3: New Password */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            checkPasswordStrength(e.target.value);
                                        }}
                                        className="w-full rounded-xl py-3 px-4 bg-white border border-gray-300 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                                        placeholder="Minimum 6 characters"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                                    >
                                        <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
                                    </button>
                                </div>
                                {/* Strength Indicator */}
                                {newPassword && (
                                    <div className="mt-2">
                                        <div className="flex gap-1 h-1 mb-1">
                                            {[1, 2, 3, 4, 5].map((item) => (
                                                <div
                                                    key={item}
                                                    className={`flex-1 rounded-full transition-all duration-300 ${item <= passwordStrength ? getStrengthColor() : "bg-gray-200"}`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-400 text-right">{['Weak', 'Fair', 'Good', 'Strong', 'Excellent'][passwordStrength - 1] || ''}</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-xl py-3 px-4 bg-white border border-gray-300 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                                    placeholder="Re-enter password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/30 transition-all"
                            >
                                {loading ? "Updating..." : "Reset Password"}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <Link to="/login" className="text-green-700 font-bold hover:underline flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Login
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
