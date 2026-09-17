import StepIndicator from "./StepIndicator";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

function RegisterStepTwo({
    stepTwoData,
    setStepTwoData,
    prevStep,
    nextStep,
    stepOneData,
    errors,
    setErrors,
    apiError,
    setApiError,
    isSubmitting,
    setIsSubmitting,
    register
}) {

    const handleChange = (e) => {
        setStepTwoData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
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

        const companyRegex = /^[a-zA-Z0-9\s.&-]+$/;
        const designationRegex = /^[a-zA-Z0-9\s.&-]+$/;

        if (!stepTwoData.company.trim()) {
            newErrors.company = "Company is required";
        } else if (stepTwoData.company.trim().length < 2) {
            newErrors.company = "Company must be at least 2 characters long";
        } else if (stepTwoData.company.trim().length > 100) {
            newErrors.company = "Company must be at most 100 characters long";
        } else if (!companyRegex.test(stepTwoData.company)) {
            newErrors.company =
                "Company can only contain letters, numbers, spaces, dots, ampersands and hyphens";
        }

        if (!stepTwoData.designation.trim()) {
            newErrors.designation = "Designation is required";
        } else if (stepTwoData.designation.trim().length < 2) {
            newErrors.designation = "Designation must be at least 2 characters long";
        } else if (stepTwoData.designation.trim().length > 100) {
            newErrors.designation = "Designation must be at most 100 characters long";
        } else if (!designationRegex.test(stepTwoData.designation)) {
            newErrors.designation =
                "Designation can only contain letters, numbers, spaces, dots, ampersands and hyphens";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {

        if (isSubmitting) return

        if (!validate()) return;

        try {
            setApiError(null);
            setIsSubmitting(true);

            const payload = {
                name: stepOneData.fullName,
                email: stepOneData.email,
                password: stepOneData.password,
                company: stepTwoData.company,
                designation: stepTwoData.designation
            }

            await register(payload);

            // Advance to Step 3 (Verify Email OTP)
            if (nextStep) {
                nextStep();
            }

        } catch (err) {

            const status = err.response?.status;

            if (status === 429) {
                setApiError(
                    "Too many registration requests. Please try again later."
                );
            } else {
                setApiError(
                    err.response?.data?.message ||
                    "Something went wrong. Please try again."
                );
            }

        } finally {

            setIsSubmitting(false);

        }
    };

    return (
        <>
            <StepIndicator step={2} totalSteps={3} />

            <h1 className="text-4xl font-semibold text-white">
                Tell us about your company
            </h1>

            <p className="mt-3 text-zinc-400">
                Almost done. Just a few more details.
            </p>

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

            <div className="mt-10 space-y-5">

                <Input
                    name="company"
                    placeholder="Enter your company name"
                    value={stepTwoData.company}
                    onChange={handleChange}
                    error={errors.company}
                    label="Company Name"
                />

                <Input
                    name="designation"
                    placeholder="Enter your designation"
                    value={stepTwoData.designation}
                    onChange={handleChange}
                    error={errors.designation}
                    label="Designation"
                />

            </div>

            <div className="mt-8 flex gap-4">

                <Button
                    variant="secondary"
                    onClick={prevStep}
                    className="flex-1"
                    disabled={isSubmitting}
                >
                    Back
                </Button>

                <Button
                    onClick={handleSubmit}
                    className="flex-1"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    loadingText="Creating Account..."
                >
                    Create Account
                </Button>

            </div>
        </>
    );
}

export default RegisterStepTwo;