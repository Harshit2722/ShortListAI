import { useState } from "react";
import { Mail, KeyRound } from "lucide-react";
import { requestEmailChange, verifyEmailChange } from "../../api/user.api";
import Card from "../common/Card";
import Button from "../common/Button";
import Input from "../common/Input";
import PasswordInput from "../common/PasswordInput";
import Badge from "../ui/Badge";

export default function EmailTab({ user, refreshUser, setApiError, setSuccessMessage }) {
    const [step, setStep] = useState(1);
    const [emailData, setEmailData] = useState({
        newEmail: "",
        password: "",
        otp: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmailData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
        setApiError(null);
    };

    const validateStepOne = () => {
        const newErrors = {};
        const email = emailData.newEmail.trim().toLowerCase();

        if (!email) {
            newErrors.newEmail = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.newEmail = "Enter a valid email address";
        } else if (email === user?.email?.toLowerCase()) {
            newErrors.newEmail = "New email cannot match current email";
        }

        if (!emailData.password) {
            newErrors.password = "Current password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRequestEmail = async (e) => {
        e.preventDefault();
        if (isSubmitting || !validateStepOne()) return;

        try {
            setIsSubmitting(true);
            setApiError(null);
            setSuccessMessage(null);

            const res = await requestEmailChange({
                newEmail: emailData.newEmail.trim().toLowerCase(),
                password: emailData.password,
            });
            setStep(2);
            setSuccessMessage(res.message || "OTP sent to your new email.");
        } catch (err) {
            setApiError(err.response?.data?.message || "Failed to request email change.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        const trimmedOtp = emailData.otp.trim();
        if (!trimmedOtp || trimmedOtp.length !== 6) {
            setErrors({ otp: "Enter the 6-digit verification code" });
            return;
        }

        try {
            setIsSubmitting(true);
            setApiError(null);
            setSuccessMessage(null);

            const res = await verifyEmailChange({ otp: trimmedOtp });
            await refreshUser();
            setSuccessMessage(res.message || "Email updated successfully!");
            setStep(1);
            setEmailData({ newEmail: "", password: "", otp: "" });
        } catch (err) {
            setErrors({ otp: err.response?.data?.message || "Invalid or expired verification code." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="p-7">
            <div className="border-b border-white/10 pb-5">
                <h2 className="text-xl font-semibold text-white">Email Address</h2>
                <p className="mt-1 text-xs text-zinc-400">
                    Your primary authentication email. Updating requires 2-step verification.
                </p>
            </div>

            <div className="mt-6 space-y-6">
                {/* Current Verified Email Banner */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                Current Verified Email
                            </span>
                            <div className="mt-1 flex items-center gap-2">
                                <span className="text-base font-semibold text-white">
                                    {user?.email || "No email detected"}
                                </span>
                                <Badge variant="success">Verified</Badge>
                            </div>
                        </div>
                        <span className="text-xs text-zinc-500">
                            Account ID: {user?._id?.slice(-8) || "—"}
                        </span>
                    </div>
                </div>

                {/* Step 1: Request Email Change */}
                {step === 1 ? (
                    <form onSubmit={handleRequestEmail} className="space-y-5">
                        <h3 className="text-sm font-semibold text-white">
                            Request Email Address Change
                        </h3>

                        <div className="space-y-4">
                            <Input
                                type="email"
                                label="New Email Address"
                                name="newEmail"
                                value={emailData.newEmail}
                                onChange={handleChange}
                                placeholder="Enter your new email address"
                                error={errors.newEmail}
                                endElement={<Mail size={18} />}
                            />

                            <PasswordInput
                                label="Confirm Current Password"
                                name="password"
                                value={emailData.password}
                                onChange={handleChange}
                                placeholder="Enter current password to verify identity"
                                error={errors.password}
                                helperText="A 6-digit confirmation code will be dispatched to the new email address."
                            />
                        </div>

                        <div className="pt-3 border-t border-white/10 flex justify-end">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                loading={isSubmitting}
                                loadingText="Sending OTP..."
                            >
                                Send Verification Code
                            </Button>
                        </div>
                    </form>
                ) : (
                    /* Step 2: Verify OTP */
                    <form onSubmit={handleVerifyEmail} className="space-y-5">
                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4 text-sm text-emerald-300">
                            Verification code has been dispatched to{" "}
                            <strong className="text-white">{emailData.newEmail}</strong>. Enter the 6-digit code below.
                        </div>

                        <Input
                            type="text"
                            maxLength={6}
                            label="Enter 6-Digit OTP"
                            name="otp"
                            value={emailData.otp}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "");
                                setEmailData((prev) => ({ ...prev, otp: val }));
                                if (errors.otp) setErrors((p) => ({ ...p, otp: "" }));
                            }}
                            placeholder="123456"
                            error={errors.otp}
                            endElement={<KeyRound size={18} />}
                        />

                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                            <button
                                type="button"
                                onClick={() => {
                                    setStep(1);
                                    setErrors({});
                                }}
                                className="text-xs font-medium text-zinc-400 hover:text-white transition cursor-pointer"
                            >
                                Cancel / Change Email
                            </button>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                loading={isSubmitting}
                                loadingText="Verifying..."
                            >
                                Confirm & Update Email
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </Card>
    );
}
