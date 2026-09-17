import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

import AuthLayout from "./AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const variants = {
    initial: {
        x: 80,
        opacity: 0,
    },
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.35,
            ease: "easeOut",
        },
    },
    exit: {
        x: -80,
        opacity: 0,
        transition: {
            duration: 0.35,
            ease: "easeIn",
        },
    },
};

function Login() {
    const [searchParams] = useSearchParams();
    const [successMessage, setSuccessMessage] = useState(() => {
        if (searchParams.get("verified") === "true") {
            return "Email verified successfully! You can now log in.";
        }
        if (searchParams.get("reset") === "true") {
            return "Password reset successfully! Log in with your new password.";
        }
        return null;
    });

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();

    useEffect(() => {
        if (!apiError) return;

        const timer = setTimeout(() => {
            setApiError(null);
        }, 3000);

        return () => clearTimeout(timer);
    }, [apiError]);

    useEffect(() => {
        if (!successMessage) return;

        const timer = setTimeout(() => {
            setSuccessMessage(null);
        }, 3000);

        return () => clearTimeout(timer);
    }, [successMessage]);

    const handleChange = (e) => {
        setLoginData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

        if (errors[e.target.name]) {
            setErrors(prev => ({
                ...prev,
                [e.target.name]: ""
            }));
        }

        if (apiError) {
            setApiError(null);
        }

        if (successMessage) {
            setSuccessMessage(null);
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!loginData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
            newErrors.email = "Enter a valid email address";
        }

        if (!loginData.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {

        if (isSubmitting) return

        if (!validate()) return;

        try {
            setApiError(null);
            setSuccessMessage(null);
            setIsSubmitting(true);

            await login(loginData);

            navigate("/dashboard", { replace: true });
        }
        catch (err) {
            const status = err.response?.status;
            setSuccessMessage(null);

            if (status === 429) {
                setApiError("Too many login requests. Please try again later.");
            } else if (status === 403) {
                setApiError("Your account is not verified. Please register or check your email for the verification code.");
            } else {
                setApiError(err.response?.data?.message || "Invalid credentials.");
            }
            console.error(err);
        }
        finally {
            setIsSubmitting(false);
        }

    };


    return (
        <AuthLayout>
            <AnimatePresence mode="wait">
                <motion.div
                    key="login"
                    className="w-full max-w-md"
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >

                    <h1 className="text-4xl font-semibold text-white">
                        Welcome back
                    </h1>

                    <p className="mt-3 text-zinc-400">
                        Sign in to continue managing your recruitment pipeline.
                    </p>

                    {/* Verified/Reset Notification Banner */}
                    <AnimatePresence>
                        {successMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                                className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300"
                            >
                                <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                                <span>{successMessage}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

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
                            value={loginData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            error={errors.email}
                            label="Email"
                        />

                        <div>
                            <Input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={loginData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                error={errors.password}
                                label="Password"
                                endElement={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
                                        tabIndex={-1}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                }
                            />
                            <div className="mt-2 text-right">
                                <Link
                                    to="/forgot-password"
                                    className="text-xs font-medium text-zinc-400 hover:text-white transition"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                    </div>

                    <Button
                        className="mt-8 w-full"
                        onClick={handleLogin}
                        disabled={isSubmitting}
                        loading={isSubmitting}
                        loadingText="Signing In..."
                    >
                        Sign In
                    </Button>

                    <p className="mt-8 text-center text-zinc-400">
                        Don't have an account?{" "}
                        {isSubmitting ? (
                            <span className="font-medium text-zinc-500 cursor-not-allowed">
                                Create one
                            </span>
                        ) : (
                            <Link
                                to="/register"
                                className="font-medium text-white transition hover:text-zinc-300"
                            >
                                Create one
                            </Link>
                        )}
                    </p>

                </motion.div>
            </AnimatePresence>
        </AuthLayout>
    );
}

export default Login;