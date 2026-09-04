import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Loader2, Sparkles, Briefcase } from "lucide-react";
import { createJob } from "../../api/job.api";

const WORK_MODES = ["On-Site", "Remote", "Hybrid"];
const EMPLOYMENT_TYPES = ["Full-Time", "Part-Time", "Contract", "Internship"];
const DURATION_UNITS = ["days", "weeks", "months", "years"];

const inputClasses = "w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white placeholder:text-zinc-500 outline-none transition duration-200 focus:border-white/30 focus:bg-white/[0.08]";
const selectClasses = "w-full rounded-xl border border-white/10 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-200 outline-none transition duration-200 focus:border-white/30 cursor-pointer";

const INITIAL_FORM_STATE = {
    title: "",
    description: "",
    location: "",
    workMode: "Hybrid",
    employmentType: "Full-Time",
    experience: 0,
    salaryMin: "",
    salaryMax: "",
    currency: "INR",
    applicationDeadline: "",
    requiredSkills: [],
    hasDuration: false,
    durationValue: 1,
    durationUnit: "months",
};

const CreateJobModal = ({ isOpen, onClose, onJobCreated }) => {
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [skillInput, setSkillInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleClose = () => {
        setFormData(INITIAL_FORM_STATE);
        setSkillInput("");
        setError(null);
        onClose();
    };

    const handleAddSkill = (e) => {
        e?.preventDefault();
        const trimmed = skillInput.trim();
        if (trimmed && !formData.requiredSkills.includes(trimmed)) {
            setFormData((prev) => ({
                ...prev,
                requiredSkills: [...prev.requiredSkills, trimmed],
            }));
            setSkillInput("");
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData((prev) => ({
            ...prev,
            requiredSkills: prev.requiredSkills.filter((s) => s !== skillToRemove),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.title || formData.title.trim().length < 3) {
            setError("Job title must be at least 3 characters.");
            return;
        }

        if (!formData.description || formData.description.trim().length < 50) {
            setError("Job description must be at least 50 characters.");
            return;
        }

        if (formData.requiredSkills.length === 0) {
            setError("Please add at least one required skill.");
            return;
        }

        if (!formData.applicationDeadline) {
            setError("Please select an application deadline.");
            return;
        }

        const minSalary = Number(formData.salaryMin) || 0;
        const maxSalary = Number(formData.salaryMax) || 0;

        if (minSalary < 0 || maxSalary < 0) {
            setError("Salary values cannot be negative.");
            return;
        }

        if (maxSalary > 0 && minSalary > maxSalary) {
            setError("Minimum salary cannot be greater than maximum salary.");
            return;
        }

        const payload = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            location: formData.location.trim(),
            workMode: formData.workMode,
            employmentType: formData.employmentType,
            experience: Number(formData.experience) || 0,
            salary: {
                min: minSalary,
                max: maxSalary,
                currency: (formData.currency || "INR").trim().toUpperCase(),
            },
            applicationDeadline: new Date(formData.applicationDeadline).toISOString(),
            requiredSkills: formData.requiredSkills,
        };

        if (formData.hasDuration) {
            payload.duration = {
                value: Number(formData.durationValue) || 1,
                unit: formData.durationUnit,
            };
        }

        try {
            setLoading(true);
            const { data } = await createJob(payload);
            onJobCreated(data);
            handleClose();
        } catch (err) {
            console.error("Failed to create job:", err);
            setError(err.response?.data?.message || "Failed to create job.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal Window */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 10 }}
                    transition={{ duration: 0.16 }}
                    className="relative z-10 w-full max-w-2xl flex flex-col rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-2xl backdrop-blur-xl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-white">
                                <Briefcase size={16} />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-white tracking-tight">
                                    Create New Job
                                </h2>
                                <p className="text-[11px] text-zinc-400">
                                    Set role details, requirements, and candidate criteria.
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-lg p-1 text-zinc-400 hover:bg-white/[0.08] hover:text-white transition cursor-pointer"
                        >
                            <X size={15} />
                        </button>
                    </div>

                    {/* Form: Compact 2-Column Grid */}
                    <form onSubmit={handleSubmit} className="py-3 space-y-3">
                        {error && (
                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-300">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-start">
                            {/* Left Column: Basic Info & Compensation */}
                            <div className="space-y-2.5">
                                {/* Title */}
                                <div className="space-y-0.5">
                                    <label className="text-[11px] font-medium text-zinc-400">Job Title</label>
                                    <input
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Full Stack Engineer"
                                        className={inputClasses}
                                        required
                                    />
                                </div>

                                {/* Location & Work Mode */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-0.5">
                                        <label className="text-[11px] font-medium text-zinc-400">Location</label>
                                        <input
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="e.g. Bangalore, India"
                                            className={inputClasses}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-0.5">
                                        <label className="text-[11px] font-medium text-zinc-400">Work Mode</label>
                                        <select
                                            value={formData.workMode}
                                            onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                                            className={selectClasses}
                                        >
                                            {WORK_MODES.map((m) => (
                                                <option key={m} value={m} className="bg-zinc-900">{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Type & Experience */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-0.5">
                                        <label className="text-[11px] font-medium text-zinc-400">Employment</label>
                                        <select
                                            value={formData.employmentType}
                                            onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                                            className={selectClasses}
                                        >
                                            {EMPLOYMENT_TYPES.map((t) => (
                                                <option key={t} value={t} className="bg-zinc-900">{t}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-0.5">
                                        <label className="text-[11px] font-medium text-zinc-400">Exp (Years)</label>
                                        <input
                                            type="number"
                                            min={0}
                                            max={50}
                                            value={formData.experience}
                                            onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })}
                                            className={inputClasses}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Salary Range & Currency */}
                                <div className="grid grid-cols-3 gap-1.5">
                                    <div className="space-y-0.5">
                                        <label className="text-[11px] font-medium text-zinc-400">Min (₹)</label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={formData.salaryMin}
                                            onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                                            placeholder="500000"
                                            className={inputClasses}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-0.5">
                                        <label className="text-[11px] font-medium text-zinc-400">Max (₹)</label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={formData.salaryMax}
                                            onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                                            placeholder="1200000"
                                            className={inputClasses}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-0.5">
                                        <label className="text-[11px] font-medium text-zinc-400">Currency</label>
                                        <input
                                            maxLength={3}
                                            value={formData.currency}
                                            onChange={(e) => setFormData({ ...formData, currency: e.target.value.toUpperCase() })}
                                            className={inputClasses}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Deadline */}
                                <div className="space-y-0.5">
                                    <label className="text-[11px] font-medium text-zinc-400">Application Deadline</label>
                                    <input
                                        type="date"
                                        value={formData.applicationDeadline}
                                        onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                                        className={inputClasses}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Right Column: Skills & Description */}
                            <div className="space-y-2.5">
                                {/* Skills */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                                        <Sparkles size={12} className="text-zinc-500" />
                                        <span>Required Skills</span>
                                    </label>
                                    <div className="flex gap-1.5">
                                        <input
                                            type="text"
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                                            placeholder="Type skill & press +"
                                            className={inputClasses}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddSkill}
                                            className="rounded-xl border border-white/10 bg-white/[0.06] px-2.5 text-xs text-white hover:bg-white/[0.12] transition cursor-pointer"
                                        >
                                            <Plus size={13} />
                                        </button>
                                    </div>

                                    {formData.requiredSkills.length > 0 ? (
                                        <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto pt-0.5">
                                            {formData.requiredSkills.map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-zinc-300"
                                                >
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveSkill(skill)}
                                                        className="text-zinc-500 hover:text-red-400 cursor-pointer"
                                                    >
                                                        <X size={10} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-[10px] text-zinc-500 italic pt-0.5">
                                            Add skills like React, Node.js, SQL...
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-0.5">
                                    <label className="text-[11px] font-medium text-zinc-400">
                                        Job Description (Min 50 chars)
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe role expectations, requirements, and responsibilities..."
                                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-xs text-white placeholder:text-zinc-500 outline-none transition focus:border-white/30 focus:bg-white/[0.08] resize-none"
                                        required
                                    />
                                </div>

                                {/* Fixed Duration toggle */}
                                <label className="flex items-center gap-2 pt-1 text-[11px] text-zinc-300 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={formData.hasDuration}
                                        onChange={(e) => setFormData({ ...formData, hasDuration: e.target.checked })}
                                        className="h-3 w-3 rounded border-zinc-700 bg-zinc-900 cursor-pointer"
                                    />
                                    <span>Fixed Duration Job</span>
                                </label>

                                {formData.hasDuration && (
                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                        <input
                                            type="number"
                                            min={1}
                                            value={formData.durationValue}
                                            onChange={(e) => setFormData({ ...formData, durationValue: Number(e.target.value) })}
                                            placeholder="Duration"
                                            className={inputClasses}
                                        />
                                        <select
                                            value={formData.durationUnit}
                                            onChange={(e) => setFormData({ ...formData, durationUnit: e.target.value })}
                                            className={selectClasses}
                                        >
                                            {DURATION_UNITS.map((u) => (
                                                <option key={u} value={u} className="bg-zinc-900">{u}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/[0.08] hover:text-white transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="rounded-xl bg-white px-4 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition shadow-lg cursor-pointer"
                        >
                            {loading ? (
                                <span className="flex items-center gap-1.5">
                                    <Loader2 size={12} className="animate-spin" />
                                    <span>Creating...</span>
                                </span>
                            ) : (
                                "Create Job"
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CreateJobModal;
