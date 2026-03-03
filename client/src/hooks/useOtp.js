import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

/**
 * Custom hook for OTP verification flow.
 * Shared between FarmerRegistration, VendorRegistration, and Login.
 *
 * @param {string}   mobile     - The mobile number to send OTP to
 * @param {string}   email      - The email to send OTP to (optional, for registration)
 * @param {Function} onVerified - Callback when OTP is successfully verified
 */
const useOtp = (mobile, email, onVerified) => {
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otpInput, setOtpInput] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpValues, setOtpValues] = useState(["", "", "", ""]);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [otpError, setOtpError] = useState("");
    const otpRefs = useRef([]);

    // Timer Logic for Resend
    useEffect(() => {
        let interval;
        if (showOtpModal && timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [showOtpModal, timer]);

    const handleSendOtp = async () => {
        if (!mobile || mobile.length !== 10) {
            toast.error("Please enter a valid 10-digit mobile number");
            return;
        }

        setOtpLoading(true);
        try {
            const payload = { mobile };
            if (email) payload.email = email;

            const res = await api.post('/auth/send-otp', payload);

            if (res.data.success) {
                toast.success("OTP sent to your mobile" + (email ? " and email!" : "!"));
                setShowOtpModal(true);
                setTimer(60);
                setCanResend(false);
                setOtpError("");
                setTimeout(() => otpRefs.current[0]?.focus(), 100);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Failed to send OTP";
            toast.error(errorMsg);
            return errorMsg; // Return error for parent to handle
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otpInput.length !== 4) {
            setOtpError("Please enter complete 4-digit OTP");
            return;
        }

        setOtpLoading(true);
        setOtpError("");

        try {
            const res = await api.post('/auth/verify-otp', {
                mobile,
                otp: otpInput,
            });

            if (res.data.success) {
                setShowOtpModal(false);
                resetOtp();
                toast.success("✅ Mobile verified successfully!");
                onVerified?.();
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Invalid OTP";
            setOtpError(errorMsg);
            toast.error("❌ " + errorMsg);
            resetOtp();
            otpRefs.current[0]?.focus();
        } finally {
            setOtpLoading(false);
        }
    };

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return;
        let newOtp = [...otpValues];
        newOtp[index] = element.value;
        setOtpValues(newOtp);
        const joinedOtp = newOtp.join("");
        setOtpInput(joinedOtp);
        setOtpError("");

        if (element.value && index < 3 && element.nextSibling) {
            element.nextSibling.focus();
        }
        if (joinedOtp.length === 4) {
            // Auto-verify when 4 digits entered — delay to let state update
            setTimeout(() => handleVerifyOtp(), 300);
        }
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otpValues[index] && index > 0) {
            e.preventDefault();
            otpRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowLeft" && index > 0) {
            e.preventDefault();
            otpRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < 3) {
            e.preventDefault();
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handlePasteOtp = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();
        if (/^\d{4}$/.test(pastedData)) {
            const digits = pastedData.split('');
            setOtpValues(digits);
            setOtpInput(pastedData);
            otpRefs.current[3]?.focus();
        }
    };

    const resetOtp = () => {
        setOtpValues(["", "", "", ""]);
        setOtpInput("");
    };

    const handleResend = () => {
        handleSendOtp();
        setTimer(60);
        setCanResend(false);
    };

    return {
        showOtpModal,
        setShowOtpModal,
        otpInput,
        otpLoading,
        otpValues,
        otpError,
        timer,
        canResend,
        otpRefs,
        handleSendOtp,
        handleVerifyOtp,
        handleOtpChange,
        handleOtpKeyDown,
        handlePasteOtp,
        handleResend,
    };
};

export default useOtp;
