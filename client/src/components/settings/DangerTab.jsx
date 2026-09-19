import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShieldAlert } from "lucide-react";
import { deleteAccount } from "../../api/user.api";
import Card from "../common/Card";
import Button from "../common/Button";
import PasswordInput from "../common/PasswordInput";

export default function DangerTab({ setUser }) {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!password) {
            setError("Password is required to confirm deletion");
            return;
        }

        try {
            setIsDeleting(true);
            setError("");
            await deleteAccount({ password });
            setUser(null);
            navigate("/login", { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "Account deletion failed. Incorrect password.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <Card className="border-red-500/30 bg-red-500/[0.02] p-7">
                <div className="border-b border-red-500/20 pb-5">
                    <div className="flex items-center gap-3">
                        <div className="inline-flex rounded-2xl border border-red-500/30 bg-red-500/10 p-2.5 text-red-400">
                            <ShieldAlert size={22} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-red-400">Danger Zone</h2>
                            <p className="text-xs text-zinc-400">
                                Irreversible actions related to your account and data.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 space-y-6">
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-5">
                        <h3 className="text-sm font-semibold text-white">
                            Permanently Delete Account
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                            Deleting your account will immediately and permanently remove all your personal data, job postings, candidate applications, AI-analyzed evaluations, and resumes stored on Cloudinary. This action cannot be undone.
                        </p>

                        <div className="mt-5">
                            <Button
                                type="button"
                                variant="danger"
                                onClick={() => {
                                    setIsModalOpen(true);
                                    setPassword("");
                                    setError("");
                                }}
                            >
                                Delete Account
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-w-md rounded-3xl border border-red-500/30 bg-zinc-950/95 p-6 shadow-2xl backdrop-blur-2xl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400">
                                    <Trash2 size={22} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Confirm Account Deletion</h3>
                                    <p className="text-xs text-zinc-400">This action cannot be undone</p>
                                </div>
                            </div>

                            <p className="mt-4 text-xs text-zinc-300 leading-relaxed">
                                Enter your current password to confirm. All your recruitment records and uploaded candidate files will be purged.
                            </p>

                            <div className="mt-5 space-y-4">
                                <PasswordInput
                                    label="Current Password"
                                    name="deletePassword"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (error) setError("");
                                    }}
                                    placeholder="Enter your password"
                                    error={error}
                                />
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setPassword("");
                                        setError("");
                                    }}
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="button"
                                    variant="danger"
                                    onClick={handleDelete}
                                    disabled={isDeleting || !password}
                                    loading={isDeleting}
                                    loadingText="Deleting..."
                                >
                                    Delete Permanently
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
