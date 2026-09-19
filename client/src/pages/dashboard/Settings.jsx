import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Trash2, CheckCircle2, AlertCircle, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import ProfileTab from "../../components/settings/ProfileTab";
import EmailTab from "../../components/settings/EmailTab";
import SecurityTab from "../../components/settings/SecurityTab";
import DangerTab from "../../components/settings/DangerTab";
import { fadeUp } from "../../utils/animations";

const TABS = [
    { id: "profile", label: "Profile & Role", icon: User },
    { id: "email", label: "Email Address", icon: Mail },
    { id: "security", label: "Security & Password", icon: Lock },
    { id: "danger", label: "Danger Zone", icon: Trash2 },
];

export default function Settings() {
    const { user, setUser, refreshUser } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");

    // Notification banners outside forms
    const [apiError, setApiError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        if (!apiError) return;
        const timer = setTimeout(() => setApiError(null), 4000);
        return () => clearTimeout(timer);
    }, [apiError]);

    useEffect(() => {
        if (!successMessage) return;
        const timer = setTimeout(() => setSuccessMessage(null), 4000);
        return () => clearTimeout(timer);
    }, [successMessage]);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setApiError(null);
        setSuccessMessage(null);
    };

    return (
        <div className="mx-auto max-w-5xl space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white lg:text-4xl">
                    Settings & Profile
                </h1>
                <p className="mt-2 text-sm text-zinc-400 lg:text-base">
                    Manage your personal information, credentials, security settings, and account preferences.
                </p>
            </div>

            {/* Notification Banners: Kept outside forms at top */}
            <AnimatePresence>
                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-300 backdrop-blur-md"
                    >
                        <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
                        <span className="flex-1">{successMessage}</span>
                        <button
                            type="button"
                            onClick={() => setSuccessMessage(null)}
                            className="text-zinc-400 hover:text-white cursor-pointer p-1"
                        >
                            <X size={15} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {apiError && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-400 backdrop-blur-md"
                    >
                        <AlertCircle size={18} className="shrink-0 text-red-400" />
                        <span className="flex-1">{apiError}</span>
                        <button
                            type="button"
                            onClick={() => setApiError(null)}
                            className="text-zinc-400 hover:text-white cursor-pointer p-1"
                        >
                            <X size={15} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Tabs Layout */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            const isDanger = tab.id === "danger";

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition duration-200 cursor-pointer text-left whitespace-nowrap lg:whitespace-normal ${
                                        isActive
                                            ? isDanger
                                                ? "border border-red-500/30 bg-red-500/10 text-red-300 shadow-lg"
                                                : "border border-white/20 bg-white/[0.08] text-white shadow-lg backdrop-blur-md"
                                            : isDanger
                                            ? "text-red-400/80 hover:bg-red-500/[0.06] hover:text-red-300"
                                            : "border border-transparent text-zinc-400 hover:border-white/10 hover:bg-white/[0.03] hover:text-zinc-200"
                                    }`}
                                >
                                    <Icon
                                        size={17}
                                        className={
                                            isActive
                                                ? isDanger
                                                    ? "text-red-400"
                                                    : "text-white"
                                                : isDanger
                                                ? "text-red-400/70"
                                                : "text-zinc-500"
                                        }
                                    />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Tab Content Area */}
                <div className="lg:col-span-3">
                    <motion.div
                        key={activeTab}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                    >
                        {activeTab === "profile" && (
                            <ProfileTab
                                user={user}
                                setUser={setUser}
                                setApiError={setApiError}
                                setSuccessMessage={setSuccessMessage}
                            />
                        )}

                        {activeTab === "email" && (
                            <EmailTab
                                user={user}
                                refreshUser={refreshUser}
                                setApiError={setApiError}
                                setSuccessMessage={setSuccessMessage}
                            />
                        )}

                        {activeTab === "security" && (
                            <SecurityTab
                                setUser={setUser}
                                setApiError={setApiError}
                            />
                        )}

                        {activeTab === "danger" && (
                            <DangerTab
                                setUser={setUser}
                            />
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
