function StepIndicator({ step, totalSteps = 3 }) {
    const stepLabels = {
        1: "Account",
        2: "Company",
        3: "Verify Email",
    };

    const widthClasses = {
        1: "w-1/3",
        2: "w-2/3",
        3: "w-full",
    };

    return (
        <div className="mb-10">
            <div className="flex items-center justify-between text-sm text-zinc-400">
                <span>Step {step} of {totalSteps}</span>
                <span className="font-medium text-zinc-200">{stepLabels[step] || ""}</span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                    className={`h-full rounded-full bg-white transition-all duration-500 ${
                        widthClasses[step] || "w-full"
                    }`}
                />
            </div>
        </div>
    );
}

export default StepIndicator;