function StepIndicator({ step }) {
    return (
        <div className="mb-10">

            <div className="flex items-center justify-between text-sm text-zinc-400">
                <span>Step {step} of 2</span>
                <span>{step === 1 ? "Account" : "Company"}</span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                    className={`h-full rounded-full bg-white transition-all duration-500 ${step === 1 ? "w-1/2" : "w-full"
                        }`}
                />
            </div>

        </div>
    );
}

export default StepIndicator;