import StepIndicator from "./StepIndicator";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

function RegisterStepOne({
    stepOneData,
    setStepOneData,
    nextStep,
    errors,
    setErrors,
}) {

    const handleChange = (e) => {
        setStepOneData({
            ...stepOneData,
            [e.target.name]: e.target.value,
        })

        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ""
            })
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
        } else if (
            !/^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+.-]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$/
                .test(stepOneData.email)
        ) {
            newErrors.email = "Please enter a valid email address";
        }


        if (!stepOneData.password) {
            newErrors.password = "Password is required";
        } else if (stepOneData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        } else if (!/[A-Z]/.test(stepOneData.password)) {
            newErrors.password = "Password must contain at least one uppercase letter";
        } else if (!/[a-z]/.test(stepOneData.password)) {
            newErrors.password = "Password must contain at least one lowercase letter";
        } else if (!/[0-9]/.test(stepOneData.password)) {
            newErrors.password = "Password must contain at least one number";
        } else if (!/[!@#$%^&*]/.test(stepOneData.password)) {
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
            <StepIndicator step={1} />

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
                //   className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-4 outline-none focus:border-white"
                />

                <Input
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={stepOneData.email}
                    onChange={handleChange}
                    error={errors.email}
                //   className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-4 outline-none focus:border-white"
                />

                <Input
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    value={stepOneData.password}
                    onChange={handleChange}
                    error={errors.password}
                //   className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-4 outline-none focus:border-white"
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