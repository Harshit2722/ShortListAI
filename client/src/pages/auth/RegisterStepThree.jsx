import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import StepIndicator from "./StepIndicator";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { verifyEmail, resendOtp } from "../../api/auth.api";

function RegisterStepThree({
    email,
    prevStep,
    errors,
    setErrors,
    apiError,
    setApiError
}) {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(60);
    const [resendNotice, setResendNotice] = useState("");

    // Cooldown countdown timer
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setInterval(() => {
            setResendCooldown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [resendCooldown]);

    // Auto-dismiss resend notice after 3 seconds
    useEffect(() => {
        if (!resendNotice) return;
        const timer = setTimeout(() => {
            setResendNotice("");
        }, 3000);
        return () => clearTimeout(timer);
    }, [resendNotice]);

    const handleOtpChange = (e) => {
        // Only accept numbers up to 6 digits
        const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
        setOtp(val);
        if (errors.otp) setErrors(prev => ({ ...prev, otp: "" }));
        if (apiError) setApiError(null);
        if (resendNotice) setResendNotice("");
    };

    const handleVerify = async () => {
        if (isVerifying) return;

        if (!otp.trim()) {
            setErrors(prev => ({ ...prev, otp: "Verification code is required" }));
            return;
        }

        if (otp.trim().length !== 6) {
            setErrors(prev => ({ ...prev, otp: "OTP must be 6 digits" }));
            return;
        }

        try {
            setIsVerifying(true);
            setApiError(null);
            setErrors(prev => ({ ...prev, otp: "" }));
            setResendNotice("");

            await verifyEmail({
                email,
                otp: otp.trim()
            });

            // Redirect to login with verified notice
            navigate("/login?verified=true", { replace: true });
        } catch (err) {
            const status = err.response?.status;
            if (status === 429) {
                setApiError("Too many verification attempts. Please try again later.");
            } else {
                setApiError(
                    err.response?.data?.message || "Invalid or expired OTP code."
                );
            }
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        if (isResending || resendCooldown > 0) return;

        try {
            setIsResending(true);
            setApiError(null);
            setResendNotice("");

            await resendOtp({ email });
            setResendNotice("A fresh 6-digit code has been sent to your email.");
            setResendCooldown(60);
        } catch (err) {
            setApiError(
                err.response?.data?.message || "Failed to resend code. Please try again."
            );
        } finally {
            setIsResending(false);
        }
    };

    return (
        <>
            <StepIndicator step={3} totalSteps={3} />

            <h1 className="text-4xl font-semibold text-white">
                Verify your email
            </h1>

            <p className="mt-3 text-zinc-400">
                We sent a 6-digit verification code to{" "}
                <span className="font-medium text-white">{email}</span>.
            </p>

            {/* Error Banner */}
            <AnimatePresence>
                {apiError && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 flex items-center gap-2 text-sm font-medium text-red-400"
                    >
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{apiError}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Resend Notice */}
            <AnimatePresence>
                {resendNotice && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 flex items-center gap-2 text-sm font-medium text-emerald-300"
                    >
                        <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                        <span>{resendNotice}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-10 space-y-5">
                <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter 6-digit code (e.g. 123456)"
                    value={otp}
                    onChange={handleOtpChange}
                    error={errors.otp}
                    label="Verification Code (OTP)"
                    className="tracking-widest font-mono text-center text-lg"
                    maxLength={6}
                    autoFocus
                />

                <div className="flex items-center justify-between text-xs px-1">
                    <span className="text-zinc-500">Didn't receive the code?</span>
                    {resendCooldown > 0 ? (
                        <span className="text-zinc-500 tabular-nums">
                            Resend in <span className="text-zinc-300 font-medium">{resendCooldown}s</span>
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={isResending}
                            className="text-white hover:text-zinc-300 underline underline-offset-2 transition cursor-pointer font-medium disabled:opacity-50"
                        >
                            {isResending ? "Sending..." : "Resend Code"}
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-8 flex gap-4">
                <Button
                    variant="secondary"
                    onClick={prevStep}
                    className="flex-1"
                    disabled={isVerifying}
                >
                    Back
                </Button>

                <Button
                    onClick={handleVerify}
                    className="flex-1"
                    disabled={isVerifying || otp.length !== 6}
                    loading={isVerifying}
                    loadingText="Verifying..."
                >
                    Verify & Finish
                </Button>
            </div>
        </>
    );
}

export default RegisterStepThree;
