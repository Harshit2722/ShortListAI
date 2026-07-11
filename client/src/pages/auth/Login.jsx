import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../../components/ui/Loader"

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

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();

    useEffect(() => {
        if (!apiError) return;

        const timer = setTimeout(() => {
            setApiError(null);
        }, 2500);

        return () => clearTimeout(timer);
    }, [apiError]);

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
    };

    const validate = () => {
        const newErrors = {};

        if (!loginData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (
            !/^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+.-]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$/
                .test(loginData.email)
        ) {
            newErrors.email = "Please enter a valid email address";
        }
        if (!loginData.password) {
            newErrors.password = "Password is required";
        } else if (loginData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        } else if (!/[A-Z]/.test(loginData.password)) {
            newErrors.password = "Password must contain at least one uppercase letter";
        } else if (!/[a-z]/.test(loginData.password)) {
            newErrors.password = "Password must contain at least one lowercase letter";
        } else if (!/[0-9]/.test(loginData.password)) {
            newErrors.password = "Password must contain at least one number";
        } else if (!/[!@#$%^&*]/.test(loginData.password)) {
            newErrors.password = "Password must contain at least one special character";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {

        if (isSubmitting) return

        if (!validate()) return;

        try {
            setApiError(null);
            setIsSubmitting(true);

            await login(loginData);

            navigate("/dashboard", { replace: true });
        }
        catch (err) {
            const status = err.response?.status;

            if (status === 429) {
                setApiError("Too many login requests. Please try again later.")
            } else {
                setApiError(err.response?.data?.message || "Something went wrong. Please try again later");
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

                    <AnimatePresence>
                        {apiError && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                                className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3"
                            >
                                <p className="text-sm font-medium text-red-400">
                                    {apiError}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-10 space-y-5">

                        <Input
                            type="email"
                            name="email"
                            value={loginData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            error={errors.email}
                            label="Email"
                        />

                        <Input
                            type="password"
                            name="password"
                            value={loginData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            error={errors.password}
                            label="Password"
                        />

                    </div>

                    <Button className="mt-8 w-full" onClick={handleLogin} disabled={isSubmitting}>
                        {isSubmitting ? <Loader /> : "Sign In"}
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