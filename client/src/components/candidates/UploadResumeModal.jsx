import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Upload,
    FileText,
    Sparkles,
    CheckCircle2,
    AlertTriangle,
    ArrowRight,
    Loader2
} from "lucide-react";
import { uploadCandidateResume, analyzeCandidate } from "../../api/candidate.api";
import Button from "../common/Button";
import Badge from "../ui/Badge";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const getRecommendationVariant = (recommendation) => {
    switch (recommendation) {
        case "Strong Match":
            return "success";
        case "Good Match":
            return "info";
        case "Average Match":
            return "warning";
        case "Poor Match":
            return "danger";
        default:
            return "neutral";
    }
};

const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const UploadResumeModal = ({
    isOpen,
    onClose,
    jobId,
    jobTitle,
    onSuccess
}) => {
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    // Flow states: "idle" | "uploading" | "analyzing" | "success"
    const [status, setStatus] = useState("idle");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [errorMessage, setErrorMessage] = useState(null);
    const [analyzedCandidate, setAnalyzedCandidate] = useState(null);

    const resetState = () => {
        setFile(null);
        setStatus("idle");
        setUploadProgress(0);
        setErrorMessage(null);
        setAnalyzedCandidate(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleClose = () => {
        if (status === "uploading" || status === "analyzing") return;
        resetState();
        onClose();
    };

    const validateFile = (selectedFile) => {
        setErrorMessage(null);
        if (!selectedFile) return false;

        if (selectedFile.type !== "application/pdf" && !selectedFile.name.toLowerCase().endsWith(".pdf")) {
            setErrorMessage("Only PDF resumes are supported.");
            return false;
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
            setErrorMessage("File size exceeds 5 MB limit.");
            return false;
        }

        return true;
    };

    const handleFileChange = (e) => {
        const selected = e.target.files?.[0];
        if (selected && validateFile(selected)) {
            setFile(selected);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const dropped = e.dataTransfer.files?.[0];
        if (dropped && validateFile(dropped)) {
            setFile(dropped);
        }
    };

    const handleUploadAndAnalyze = async () => {
        if (!file || !jobId) return;

        try {
            setErrorMessage(null);

            // Step 1: Uploading PDF to Cloudinary & creating submission
            setStatus("uploading");
            setUploadProgress(10);

            const uploadRes = await uploadCandidateResume(jobId, file, (progressEvent) => {
                if (progressEvent.total) {
                    const percent = Math.round((progressEvent.loaded * 90) / progressEvent.total);
                    setUploadProgress(percent);
                }
            });

            const createdResume = uploadRes.data;
            const resumeId = createdResume?._id;

            if (!resumeId) {
                throw new Error("Failed to retrieve resume ID after upload.");
            }

            setUploadProgress(100);

            // Step 2: Running Groq AI analysis
            setStatus("analyzing");
            const analyzeRes = await analyzeCandidate(jobId, resumeId);
            const candidateResult = analyzeRes.data;

            setAnalyzedCandidate(candidateResult);
            setStatus("success");

            if (onSuccess) {
                onSuccess(candidateResult);
            }
        } catch (err) {
            console.error("Resume upload/analysis error:", err);
            setStatus("idle");
            setErrorMessage(
                err.response?.data?.message || err.message || "Failed to process resume. Please try again."
            );
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-lg rounded-3xl border border-white/10 bg-zinc-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-white">
                            Upload Candidate Resume
                        </h2>
                        <p className="mt-1 text-xs text-zinc-400">
                            {jobTitle ? `Role: ${jobTitle}` : "Upload a PDF for instant AI parsing and evaluation"}
                        </p>
                    </div>

                    <button
                        onClick={handleClose}
                        disabled={status === "uploading" || status === "analyzing"}
                        className="rounded-xl border border-white/10 bg-white/[0.04] p-1.5 text-zinc-400 hover:text-white hover:bg-white/[0.08] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-5 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-3.5 text-xs text-rose-300 flex items-start gap-2.5"
                    >
                        <AlertTriangle size={16} className="shrink-0 text-rose-400 mt-0.5" />
                        <span className="leading-relaxed">{errorMessage}</span>
                    </motion.div>
                )}

                {/* Content based on status */}
                {status === "success" && analyzedCandidate ? (
                    <div className="space-y-6 py-2 text-center">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.2)]">
                            <CheckCircle2 size={32} />
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-white">
                                {analyzedCandidate.candidate?.name || "Candidate"} Analyzed!
                            </h3>
                            <p className="text-xs text-zinc-400">
                                Resume successfully parsed and evaluated against job requirements.
                            </p>
                        </div>

                        {/* Candidate AI Score Highlight */}
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex items-center justify-around">
                            <div>
                                <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider block mb-1">
                                    AI Match Rating
                                </span>
                                <span className="text-2xl font-black text-emerald-400">
                                    {analyzedCandidate.analysis?.overallScore ?? "N/A"}
                                    <span className="text-xs text-zinc-500 font-normal"> / 10</span>
                                </span>
                            </div>

                            <div className="h-8 w-[1px] bg-white/10" />

                            <div>
                                <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider block mb-1">
                                    Recommendation
                                </span>
                                {analyzedCandidate.analysis?.recommendation ? (
                                    <Badge variant={getRecommendationVariant(analyzedCandidate.analysis.recommendation)}>
                                        {analyzedCandidate.analysis.recommendation}
                                    </Badge>
                                ) : (
                                    <span className="text-xs text-zinc-400">Evaluated</span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                            <Button
                                variant="secondary"
                                onClick={resetState}
                                className="text-xs py-2 px-4"
                            >
                                Upload Another
                            </Button>
                            <a
                                href={`/jobs/${jobId}/candidates/${analyzedCandidate._id}`}
                                className="inline-flex"
                            >
                                <Button
                                    variant="primary"
                                    className="text-xs py-2 px-4 flex items-center gap-1.5"
                                >
                                    <span>View Candidate Profile</span>
                                    <ArrowRight size={13} />
                                </Button>
                            </a>
                        </div>
                    </div>
                ) : status === "uploading" || status === "analyzing" ? (
                    /* Processing State */
                    <div className="space-y-6 py-8 text-center">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10 text-amber-300 shadow-[0_0_24px_rgba(251,191,36,0.15)] animate-pulse">
                            {status === "uploading" ? (
                                <Upload size={28} className="animate-bounce text-amber-300" />
                            ) : (
                                <Sparkles size={28} className="text-amber-300" />
                            )}
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-base font-bold text-white">
                                {status === "uploading"
                                    ? "Uploading Resume to Storage..."
                                    : "Analyzing with Groq AI..."}
                            </h3>
                            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                                {status === "uploading"
                                    ? "Extracting PDF text and generating SHA-256 fingerprint."
                                    : "Evaluating candidate background, skill alignments, and generating scores."}
                            </p>
                        </div>

                        {/* Progress bar */}
                        <div className="max-w-xs mx-auto space-y-1.5">
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                                <motion.div
                                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400"
                                    initial={{ width: "10%" }}
                                    animate={{
                                        width: status === "uploading" ? `${uploadProgress}%` : "95%"
                                    }}
                                    transition={{ duration: 0.4 }}
                                />
                            </div>
                            <span className="text-[10px] text-zinc-500 font-medium">
                                {status === "uploading" ? `Uploading: ${uploadProgress}%` : "AI Processing (~3 seconds)"}
                            </span>
                        </div>
                    </div>
                ) : (
                    /* Idle State: File Selection */
                    <div className="space-y-6">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {!file ? (
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition cursor-pointer ${
                                    isDragging
                                        ? "border-emerald-500/60 bg-emerald-500/[0.06]"
                                        : "border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]"
                                }`}
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-zinc-300 mb-3 shadow-inner">
                                    <Upload size={20} className={isDragging ? "text-emerald-400" : "text-zinc-400"} />
                                </div>
                                <p className="text-xs font-semibold text-white">
                                    Drag and drop your resume here, or{" "}
                                    <span className="text-zinc-300 underline underline-offset-2">browse</span>
                                </p>
                                <p className="mt-1.5 text-[11px] text-zinc-500">
                                    Supported format: PDF up to 5 MB
                                </p>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                                        <FileText size={20} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-semibold text-white truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-[10px] text-zinc-500">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setFile(null);
                                        if (fileInputRef.current) fileInputRef.current.value = "";
                                    }}
                                    className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                                    title="Remove file"
                                >
                                    <X size={15} />
                                </button>
                            </div>
                        )}

                        {/* Footer Controls */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                            <Button
                                variant="secondary"
                                onClick={handleClose}
                                className="text-xs py-2 px-4"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                disabled={!file}
                                onClick={handleUploadAndAnalyze}
                                className="text-xs py-2 px-4 flex items-center gap-1.5"
                            >
                                <Sparkles size={14} className="text-amber-400" />
                                <span>Upload & Analyze</span>
                            </Button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default UploadResumeModal;
