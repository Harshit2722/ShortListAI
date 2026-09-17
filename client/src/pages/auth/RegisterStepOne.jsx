import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import StepIndicator from "./StepIndicator";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

function RegisterStepOne({
    stepOneData,
    setStepOneData,
    nextStep,
    errors,
    setErrors,
    apiError,
    setApiError
}) {
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setStepOneData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))

        if (errors[e.target.name]) {
            setErrors(prev => ({
                ...prev,
                [e.target.name]: ""
            }))
        }

        if (apiError) {
            setApiError(null);
        }
    }

    const validate = () => {
        const newErrors = {};

        if (!stepOneData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        } else if (stepOneData.fullName.trim().length < 2) {
            newErrors.fullName = "Full name must be at least 2 characters";
        }
        else if (stepOneData.fullName.trim().length > 30) {
            newErrors.fullName = "Full name cannot exceed 30 characters";
        }
        else if (/\d/.test(stepOneData.fullName.trim())) {
            newErrors.fullName = "Full name can only contain alphabets";
        }
        else if (!/^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(stepOneData.fullName)) {
            newErrors.fullName = "Full name can only contain alphabets";
        }

        if (!stepOneData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stepOneData.email)) {
            newErrors.email = "Enter a valid email address";
        }

        if (!stepOneData.password) {
            newErrors.password = "Password is required";
        } else if (stepOneData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long";
        } else if (stepOneData.password.length > 64) {
            newErrors.password = "Password must be at most 64 characters long";
        } else if (!/[A-Z]/.test(stepOneData.password)) {
            newErrors.password = "Password must contain at least one uppercase letter";
        } else if (!/[a-z]/.test(stepOneData.password)) {
            newErrors.password = "Password must contain at least one lowercase letter";
        } else if (!/[0-9]/.test(stepOneData.password)) {
            newErrors.password = "Password must contain at least one number";
        } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(stepOneData.password)) {
            newErrors.password = "Password must contain at least one special character";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = () => {
        if (!validate()) return;

        nextStep();
    }

    return (
        <>
            <StepIndicator step={1} totalSteps={3} />

            <h1 className="text-4xl font-semibold text-white">
                Create your account
            </h1>

            <p className="mt-3 text-zinc-400">
                Let's get started with your recruiter account.
            </p>

            <div className="mt-10 space-y-5">

                <Input
                    type="text"
                    placeholder="Enter your full name"
                    name="fullName"
                    value={stepOneData.fullName}
                    onChange={handleChange}
                    error={errors.fullName}
                    label="Full Name"
                />

                <Input
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={stepOneData.email}
                    onChange={handleChange}
                    error={errors.email}
                    label="Email"
                />

                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    name="password"
                    value={stepOneData.password}
                    onChange={handleChange}
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

            </div>

            <Button
                onClick={handleContinue}
                className="mt-8 w-full"
            >
                Continue
            </Button>
        </>
    );
}

export default RegisterStepOne;