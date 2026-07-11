import { useState, useEffect} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import AuthLayout from "./AuthLayout";
import RegisterStepOne from "./RegisterStepOne";
import RegisterStepTwo from "./RegisterStepTwo";

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

function Register() {
    const [stepOneData, setStepOneData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const [stepTwoData, setStepTwoData] = useState({
        company: "",
        designation: ""
    });

    const [errors, setErrors] = useState({});
    const [step, setStep] = useState(1);

    const [apiError, setApiError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();

    const [direction, setDirection] = useState(1);

    useEffect(() => {
    if (!apiError) return;

    const timer = setTimeout(() => {
        setApiError(null);
    }, 2500);

    return () => clearTimeout(timer);
}, [apiError]);

    function nextStep() {
        setDirection(1);
        setStep(2);
    }

    function prevStep() {
        setDirection(-1);
        setStep(1);
    }

    return (
        <AuthLayout>
            <div className="w-full max-w-md min-h-[520px]">
                <AnimatePresence mode="wait" custom={direction}>

                    <motion.div
                        key={step}
                        custom={direction}
                        variants={variants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >

                        {step === 1 ? (
                            <RegisterStepOne
                                stepOneData={stepOneData}
                                setStepOneData={setStepOneData}
                                nextStep={nextStep}
                                errors={errors}
                                setErrors={setErrors}
                                apiError={apiError}
                                setApiError={setApiError}
                            />
                        ) : (
                            <RegisterStepTwo
                                stepTwoData={stepTwoData}
                                setStepTwoData={setStepTwoData}
                                prevStep={prevStep}
                                stepOneData={stepOneData}
                                errors={errors}
                                setErrors={setErrors}
                                apiError={apiError}
                                setApiError={setApiError}
                                isSubmitting={isSubmitting}
                                setIsSubmitting={setIsSubmitting}
                                register={register}
                            />
                        )}

                    </motion.div>

                </AnimatePresence>

                <p className="mt-8 text-center text-zinc-400">
                    Already have an account?{" "}
                {isSubmitting ? (
                    <span className="font-medium text-white transition hover:text-zinc-300">Sign in</span>
                ): (
                    <Link
                        to="/login"
                        className="font-medium text-white transition hover:text-zinc-300"
                    >
                        Sign in
                    </Link>

                )}
                </p>
            </div>
        </AuthLayout>
    );
}

export default Register;