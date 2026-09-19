import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X } from "lucide-react";
import { updatePassword } from "../../api/user.api";
import Card from "../common/Card";
import Button from "../common/Button";
import PasswordInput from "../common/PasswordInput";

export default function SecurityTab({ setUser, setApiError }) {
    const navigate = useNavigate();
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
        setApiError(null);
    };

    // Current password minimum validation (must be 8-64 chars with lower, upper, digit, special char)
    const cp = passwordData.currentPassword;
    const isCurrentPasswordValid =
        cp.length >= 8 &&
        cp.length <= 64 &&
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(cp);

    // Real-time password criteria for the visual table
    const np = passwordData.newPassword;
    const passwordRules = [
        { label: "8 to 64 characters", valid: np.length >= 8 && np.length <= 64 },
        { label: "At least 1 uppercase letter", valid: /[A-Z]/.test(np) },
        { label: "At least 1 lowercase letter", valid: /[a-z]/.test(np) },
        { label: "At least 1 numeric digit", valid: /\d/.test(np) },
        { label: "At least 1 special character", valid: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(np) },
        { label: "Different from current password", valid: np.length > 0 && np !== passwordData.currentPassword },
    ];
    const isNewPasswordValid = passwordRules.every((r) => r.valid);

    const validate = () => {
        const newErrors = {};

        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = "Confirm password is required";
        } else if (passwordData.newPassword && passwordData.confirmPassword !== passwordData.newPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0 && isCurrentPasswordValid && isNewPasswordValid;
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (isSubmitting || !validate()) return;

        try {
            setIsSubmitting(true);
            setApiError(null);
            setErrors({});

            await updatePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            setUser(null);
            navigate("/login?reset=true", { replace: true });
        } catch (err) {
            setApiError(err.response?.data?.message || "Failed to update password.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isButtonDisabled =
        isSubmitting ||
        !isCurrentPasswordValid ||
        !isNewPasswordValid ||
        !passwordData.confirmPassword ||
        passwordData.newPassword !== passwordData.confirmPassword;

    return (
        <Card className="p-7">
            <div className="border-b border-white/10 pb-5">
                <h2 className="text-xl font-semibold text-white">Password & Security</h2>
                <p className="mt-1 text-xs text-zinc-400">
                    Update your authentication password. Changing passwords automatically signs you out of active sessions.
                </p>
            </div>

            <form onSubmit={handleUpdatePassword} className="mt-6 space-y-5">
                <PasswordInput
                    label="Current Password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter your current password"
                />

                <div>
                    <PasswordInput
                        label="New Password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handleChange}
                        placeholder="Enter strong new password"
                        error={errors.newPassword}
                    />

                    {/* Visual Password Requirements Checklist */}
                    <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                        <span className="text-xs font-medium text-zinc-400">
                            Password Requirements:
                        </span>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {passwordRules.map((rule, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center gap-1.5 transition-colors ${
                                        rule.valid ? "text-emerald-400" : "text-zinc-500"
                                    }`}
                                >
                                    {rule.valid ? <Check size={14} /> : <X size={14} />}
                                    <span>{rule.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <PasswordInput
                    label="Confirm New Password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your new password"
                    error={errors.confirmPassword}
                />

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <p className="text-xs text-zinc-500">
                        You will be redirected to sign in upon changing password.
                    </p>
                    <Button
                        type="submit"
                        disabled={isButtonDisabled}
                        loading={isSubmitting}
                        loadingText="Updating Password..."
                    >
                        Update Password
                    </Button>
                </div>
            </form>
        </Card>
    );
}
