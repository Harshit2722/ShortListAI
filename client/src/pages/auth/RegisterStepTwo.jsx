import StepIndicator from "./StepIndicator";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

function RegisterStepTwo({
    stepTwoData,
    setStepTwoData,
    prevStep,
    submitForm,
    errors,
    setErrors,
}) {

    const handleChange = (e) => {
        setStepTwoData({
            ...stepTwoData,
            [e.target.name]: e.target.value,
        });

        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: "",
            });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!stepTwoData.company.trim()) {
            newErrors.company = "Company name is required";
        } else if (stepTwoData.company.trim().length < 2) {
            newErrors.company = "Company name must be at least 2 characters";
        } else if (stepTwoData.company.trim().length > 100) {
            newErrors.company = "Company name cannot exceed 100 characters";
        }
        else if (!/^[a-zA-Z0-9\s.&-]+$/.test(stepTwoData.company.trim())) {
            newErrors.company = "Company name can only contain letters, numbers, spaces, dots, ampersands and hyphens.";
        }

        if (!stepTwoData.designation.trim()) {
            newErrors.designation = "Designation is required";
        } else if (stepTwoData.designation.trim().length < 2) {
            newErrors.designation = "Designation must be at least 2 characters";
        } else if (stepTwoData.designation.trim().length > 100) {
            newErrors.designation = "Designation cannot exceed 100 characters";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        submitForm();
    };

    return (
        <>
            <StepIndicator step={2} />

            <h1 className="text-4xl font-semibold text-white">
                Tell us about your company
            </h1>

            <p className="mt-3 text-zinc-400">
                Almost done. Just a few more details.
            </p>

            <div className="mt-10 space-y-5">

                <Input
                    name="company"
                    placeholder="Enter your company name"
                    value={stepTwoData.company}
                    onChange={handleChange}
                    error={errors.company}
                />

                <Input
                    name="designation"
                    placeholder="Enter your designation"
                    value={stepTwoData.designation}
                    onChange={handleChange}
                    error={errors.designation}
                />

            </div>

            <div className="mt-8 flex gap-4">

                <Button
                    variant="secondary"
                    onClick={prevStep}
                    className="flex-1"
                >
                    Back
                </Button>

                <Button
                    onClick={handleSubmit}
                    className="flex-1"
                >
                    Create Account
                </Button>

            </div>
        </>
    );
}

export default RegisterStepTwo;