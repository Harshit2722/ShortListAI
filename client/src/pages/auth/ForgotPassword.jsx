import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import AuthLayout from "./AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { forgotPassword, verifyResetOtp, resetPassword } from "../../api/auth.api";

const variants = {
    initial: (direction) => ({
        x: direction > 0 ? 80 : -80,
        opacity: 0,
    }),
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.35,
            ease: "easeOut",
        },
    },
    exit: (direction) => ({
        x: direction > 0 ? -80 : 80,
        opacity: 0,
        transition: {
            duration: 0.35,
            ease: "easeIn",
        },
    }),
};

function ForgotPassword() {
    const navigate = useNavigate();

    // Steps: 1 (Email), 2 (OTP), 3 (Passwords: newPassword & confirmPassword)
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(1);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Resend OTP state
    const [resendCooldown, setResendCooldown] = useState(0);
    const [resendNotice, setResendNotice] = useState("");

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setInterval(() => {
            setResendCooldown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [resendCooldown]);

    // Auto-dismiss API error after 3 seconds (matching Login and Register)
    useEffect(() => {
        if (!apiError) return;
        const timer = setTimeout(() => {
            setApiError(null);
        }, 3000);
        return () => clearTimeout(timer);
    }, [apiError]);

    // Auto-dismiss resend notice after 3 seconds
    useEffect(() => {
        if (!resendNotice) return;
        const timer = setTimeout(() => {
            setResendNotice("");
        }, 3000);
        return () => clearTimeout(timer);
    }, [resendNotice]);

    const clearBanners = () => {
        if (apiError) setApiError(null);
        if (resendNotice) setResendNotice("");
    };

    // Step 1: Submit email to send OTP
    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();
        if (isSubmitting) return;

        const newErrors = {};
        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Enter a valid email address";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setIsSubmitting(true);
            setApiError(null);
            setResendNotice("");
            setErrors({});

            await forgotPassword({ email: email.trim().toLowerCase() });

            setResendCooldown(60);
            setDirection(1);
            setStep(2);
        } catch (err) {
            const status = err.response?.status;
            if (status === 429) {
                setApiError("Too many attempts. Please try again later.");
            } else if (status === 404) {
                setApiError("No account found with this email address.");
            } else {
                setApiError(
                    err.response?.data?.message || "Failed to send reset code. Please try again."
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Step 2: Verify OTP directly on this screen before moving forward
    const handleVerifyOtp = async (e) => {
        if (e) e.preventDefault();
        if (isSubmitting) return;

        const trimmedOtp = otp.trim();

        if (!trimmedOtp) {
            setErrors({ otp: "Verification code is required" });
            return;
        }
        if (trimmedOtp.length !== 6 || !/^[0-9]+$/.test(trimmedOtp)) {
            setErrors({ otp: "OTP must be 6 digits" });
            return;
        }

        try {
            setIsSubmitting(true);
            setApiError(null);
            setResendNotice("");
            setErrors({});

            const data = await verifyResetOtp({
                email: email.trim().toLowerCase(),
                otp: trimmedOtp,
            });

            if (data?.data?.resetToken) {
                setResetToken(data.data.resetToken);
            }

            // Advanced only upon successful OTP verification from backend
            setDirection(1);
            setStep(3);
        } catch (err) {
            const status = err.response?.status;
            if (status === 429) {
                setApiError("Too many verification attempts. Please try again later.");
            } else {
                setApiError(
                    err.response?.data?.message || "Invalid or expired OTP code. Please check and try again."
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const validatePasswordStep = () => {
        const newErrors = {};

        if (!newPassword) {
            newErrors.newPassword = "New password is required";
        } else if (newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters long";
        } else if (newPassword.length > 64) {
            newErrors.newPassword = "Password must be at most 64 characters long";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])/.test(newPassword)) {
            newErrors.newPassword =
                "Password must contain at least one lowercase letter, one uppercase letter, one number and one special character";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Confirm password is required";
        } else if (newPassword && confirmPassword !== newPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Step 3: Reset password using verified resetToken and newPassword
    const handleResetPassword = async (e) => {
        if (e) e.preventDefault();
        if (isSubmitting) return;

        if (!validatePasswordStep()) return;

        try {
            setIsSubmitting(true);
            setApiError(null);
            setResendNotice("");
            setErrors({});

            await resetPassword({
                resetToken,
                newPassword,
            });

            navigate("/login?reset=true", { replace: true });
        } catch (err) {
            const status = err.response?.status;
            const msg = err.response?.data?.message || "Failed to reset password. Please try again.";

            if (status === 429) {
                setApiError("Too many attempts. Please try again later.");
            } else if (msg.toLowerCase().includes("session") || msg.toLowerCase().includes("expired") || msg.toLowerCase().includes("otp")) {
                setApiError(msg);
                setDirection(-1);
                setStep(2);
            } else {
                setApiError(msg);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;

        try {
            setApiError(null);
            setResendNotice("");

            await forgotPassword({ email: email.trim().toLowerCase() });
            setResendNotice("A fresh 6-digit code has been sent to your email.");
            setResendCooldown(60);
        } catch (err) {
            setApiError(err.response?.data?.message || "Failed to resend code.");
        }
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-md min-h-[520px]">
                {/* Back Link */}
                <div className="mb-6">
                    {step === 1 ? (
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition"
                        >
                            <ArrowLeft size={14} />
                            <span>Back to Sign In</span>
                        </Link>
                    ) : (
                        <button
                            type="button"
                            onClick={() => {
                                setDirection(-1);
                                setStep((prev) => prev - 1);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition cursor-pointer"
                        >
                            <ArrowLeft size={14} />
                            <span>Back to Step {step - 1}</span>
                        </button>
                    )}
                </div>

                <AnimatePresence mode="wait" custom={direction}>
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            custom={direction}
                            variants={variants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <h1 className="text-4xl font-semibold text-white">
                                Forgot password?
                            </h1>

                            <p className="mt-3 text-zinc-400">
                                Enter your registered email address to receive a 6-digit reset code.
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

                            <div className="mt-8 space-y-5">
                                <Input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                                        clearBanners();
                                    }}
                                    placeholder="Enter your email"
                                    error={errors.email}
                                    label="Email"
                                    autoFocus
                                />

                                <Button
                                    className="mt-8 w-full"
                                    onClick={handleSendOtp}
                                    disabled={isSubmitting}
                                    loading={isSubmitting}
                                    loadingText="Sending Code..."
                                >
                                    Send Verification Code
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            custom={direction}
                            variants={variants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <h1 className="text-4xl font-semibold text-white">
                                Enter reset code
                            </h1>

                            <p className="mt-3 text-zinc-400">
                                We sent a 6-digit code to <span className="font-medium text-white">{email}</span>.
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

                            <div className="mt-8 space-y-5">
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    value={otp}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
                                        setOtp(val);
                                        if (errors.otp) setErrors((prev) => ({ ...prev, otp: "" }));
                                        clearBanners();
                                    }}
                                    placeholder="Enter 6-digit code"
                                    error={errors.otp}
                                    label="Verification Code (OTP)"
                                    className="tracking-widest font-mono text-center text-lg"
                                    maxLength={6}
                                    autoFocus
                                />

                                <div className="flex items-center justify-between text-xs px-1">
                                    <span className="text-zinc-500">Didn't get code?</span>
                                    {resendCooldown > 0 ? (
                                        <span className="text-zinc-500 tabular-nums">
                                            Resend in <span className="text-zinc-300 font-medium">{resendCooldown}s</span>
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleResendOtp}
                                            className="text-white hover:text-zinc-300 underline underline-offset-2 transition cursor-pointer font-medium"
                                        >
                                            Resend Code
                                        </button>
                                    )}
                                </div>

                                <Button
                                    className="mt-8 w-full"
                                    onClick={handleVerifyOtp}
                                    disabled={otp.length !== 6 || isSubmitting}
                                    loading={isSubmitting}
                                    loadingText="Verifying Code..."
                                >
                                    Continue
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            custom={direction}
                            variants={variants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <h1 className="text-4xl font-semibold text-white">
                                Set new password
                            </h1>

                            <p className="mt-3 text-zinc-400">
                                Choose a secure password with at least 8 characters, uppercase, and numbers.
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

                            <div className="mt-8 space-y-5">
                                <Input
                                    type={showNewPassword ? "text" : "password"}
                                    name="newPassword"
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: "" }));
                                        clearBanners();
                                    }}
                                    placeholder="Enter new password"
                                    error={errors.newPassword}
                                    label="New Password"
                                    autoFocus
                                    endElement={
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword((prev) => !prev)}
                                            className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
                                            tabIndex={-1}
                                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                                        >
                                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    }
                                />

                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                                        clearBanners();
                                    }}
                                    placeholder="Confirm new password"
                                    error={errors.confirmPassword}
                                    label="Confirm Password"
                                    endElement={
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
                                            tabIndex={-1}
                                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    }
                                />

                                <Button
                                    className="mt-8 w-full"
                                    onClick={handleResetPassword}
                                    disabled={isSubmitting}
                                    loading={isSubmitting}
                                    loadingText="Resetting Password..."
                                >
                                    Reset Password & Sign In
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AuthLayout>
    );
}

export default ForgotPassword;
