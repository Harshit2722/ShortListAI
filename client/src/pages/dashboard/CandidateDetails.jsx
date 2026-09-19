import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    BrainCircuit,
    Mail,
    Phone,
    Calendar,
    FileText,
    ExternalLink,
    Briefcase,
    GraduationCap,
    CheckCircle2,
    AlertTriangle,
    Trash2,
    X,
    FolderGit2,
    Award
} from "lucide-react";
import { getCandidateById, deleteCandidate } from "../../api/candidate.api";
import { getJobById } from "../../api/job.api";
import Card from "../../components/common/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/common/Button";
import Loader from "../../components/ui/Loader";
import ScoreProgress from "../../components/candidates/ScoreProgress";
import { fadeUp } from "../../utils/animations";

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

const getStatusVariant = (status) => {
    switch (status) {
        case "Completed":
            return "success";
        case "Processing":
            return "info";
        case "Pending":
            return "warning";
        case "Failed":
            return "danger";
        default:
            return "neutral";
    }
};

const CandidateDetails = () => {
    const { jobId, candidateId } = useParams();
    const navigate = useNavigate();

    const [candidate, setCandidate] = useState(null);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Actions
    const [deleting, setDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [actionMessage, setActionMessage] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const [candidateRes, jobRes] = await Promise.allSettled([
                getCandidateById(jobId, candidateId),
                getJobById(jobId)
            ]);

            if (candidateRes.status === "fulfilled") {
                setCandidate(candidateRes.value.data);
            } else {
                throw new Error(candidateRes.reason?.response?.data?.message || "Failed to load candidate details.");
            }

            if (jobRes.status === "fulfilled") {
                setJob(jobRes.value.data);
            }
        } catch (err) {
            console.error("Error fetching candidate data:", err);
            setError(err.message || "Failed to load candidate.");
        } finally {
            setLoading(false);
        }
    }, [jobId, candidateId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    const handleDelete = async () => {
        try {
            setDeleting(true);
            await deleteCandidate(jobId, candidateId);
            navigate(`/jobs/${jobId}/candidates`, { replace: true });
        } catch (err) {
            console.error("Delete failed:", err);
            setActionMessage({
                type: "error",
                text: err.response?.data?.message || "Failed to delete candidate."
            });
            setShowDeleteModal(false);
            setDeleting(false);
        }
    };

    if (loading) {
        return <Loader title="Loading Candidate Details" subtitle="Fetching candidate profile and AI evaluations..." />;
    }

    if (error || !candidate) {
        return (
            <div className="space-y-6 max-w-4xl mx-auto text-center py-16">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 mb-4">
                    <AlertTriangle size={24} />
                </div>
                <h2 className="text-xl font-bold text-white">Candidate Not Found</h2>
                <p className="text-sm text-zinc-400">{error || "Unable to locate this candidate submission."}</p>
                <div className="mt-4">
                    <Link to={`/jobs/${jobId}/candidates`}>
                        <Button variant="secondary">Back to Candidates</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const candidateInfo = candidate.candidate || {};
    const analysis = candidate.analysis || {};
    const resumeDoc = candidate.resume || {};
    const overallScore = analysis.overallScore != null ? Number(analysis.overallScore).toFixed(1) : null;

    const initials = (candidateInfo.name || "Candidate")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join("");

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-12">
            {/* Top Navigation & Action Controls */}
            <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <Link
                    to={`/jobs/${jobId}/candidates`}
                    className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition duration-200"
                >
                    <ArrowLeft size={15} />
                    <span>Back to Candidates</span>
                </Link>

                <div className="flex flex-wrap items-center gap-2.5">
                    {resumeDoc.url && (
                        <a
                            href={resumeDoc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button
                                variant="secondary"
                                className="flex items-center gap-1.5 text-xs py-2 px-3.5"
                            >
                                <FileText size={14} className="text-zinc-400" />
                                <span>View Uploaded Resume</span>
                                <ExternalLink size={12} className="text-zinc-500" />
                            </Button>
                        </a>
                    )}

                    <Button
                        variant="danger"
                        disabled={deleting}
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center gap-1.5 text-xs py-2 px-3.5"
                    >
                        <Trash2 size={14} />
                        <span>Delete</span>
                    </Button>
                </div>
            </motion.div>

            {/* Notification Banner */}
            {actionMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl border p-4 text-xs flex items-center justify-between ${
                        actionMessage.type === "success"
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                            : "border-rose-500/20 bg-rose-500/10 text-rose-300"
                    }`}
                >
                    <span>{actionMessage.text}</span>
                    <button
                        onClick={() => setActionMessage(null)}
                        className="text-zinc-400 hover:text-white cursor-pointer ml-4"
                    >
                        <X size={14} />
                    </button>
                </motion.div>
            )}

            {/* Main Content: 2-Column Responsive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Left Column (Candidate Profile, AI Summary, Strengths, Skills, Experience) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Header Card */}
                    <motion.div variants={fadeUp} initial="hidden" animate="visible">
                        <Card className="p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] text-xl font-bold text-white shadow-inner">
                                    {initials}
                                </div>

                                <div className="space-y-2 flex-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                                            {candidateInfo.name || "Candidate Name"}
                                        </h1>
                                        {analysis.recommendation && (
                                            <Badge variant={getRecommendationVariant(analysis.recommendation)}>
                                                {analysis.recommendation}
                                            </Badge>
                                        )}
                                        {candidate.status && (
                                            <Badge variant={getStatusVariant(candidate.status)}>
                                                {candidate.status}
                                            </Badge>
                                        )}
                                    </div>

                                    {job?.title && (
                                        <p className="text-xs sm:text-sm text-zinc-400">
                                            Applied for <span className="font-semibold text-zinc-200">{job.title}</span>
                                        </p>
                                    )}

                                    {/* Contact row */}
                                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-xs text-zinc-400">
                                        {candidateInfo.email && (
                                            <span className="flex items-center gap-1.5 text-zinc-300">
                                                <Mail size={14} className="text-zinc-500" />
                                                <a href={`mailto:${candidateInfo.email}`} className="hover:underline">
                                                    {candidateInfo.email}
                                                </a>
                                            </span>
                                        )}
                                        {candidateInfo.phone && (
                                            <span className="flex items-center gap-1.5 text-zinc-300">
                                                <Phone size={14} className="text-zinc-500" />
                                                <span>{candidateInfo.phone}</span>
                                            </span>
                                        )}
                                        {candidate.createdAt && (
                                            <span className="flex items-center gap-1.5 text-zinc-400">
                                                <Calendar size={14} className="text-zinc-500" />
                                                <span>{new Date(candidate.createdAt).toLocaleDateString(undefined, {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric"
                                                })}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* AI Executive Summary Card */}
                    <motion.div variants={fadeUp} initial="hidden" animate="visible">
                        <Card className="p-6 sm:p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
                                    <BrainCircuit size={16} />
                                </div>
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
                                    AI Executive Summary
                                </h2>
                            </div>

                            <p className="text-sm leading-relaxed text-zinc-300">
                                {analysis.summary || "No executive summary available for this candidate."}
                            </p>
                        </Card>
                    </motion.div>

                    {/* Strengths & Weaknesses Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Strengths Card */}
                        <motion.div variants={fadeUp} initial="hidden" animate="visible">
                            <Card className="p-6 h-full border-emerald-500/20 bg-emerald-950/[0.04]">
                                <div className="flex items-center gap-2 mb-4 text-emerald-400">
                                    <CheckCircle2 size={16} />
                                    <h3 className="text-xs font-semibold uppercase tracking-wider">
                                        Key Strengths ({analysis.strengths?.length || 0})
                                    </h3>
                                </div>

                                {analysis.strengths?.length > 0 ? (
                                    <ul className="space-y-2.5">
                                        {analysis.strengths.map((strength, index) => (
                                            <li key={index} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                                <span>{strength}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-zinc-500 italic">No specific strengths documented.</p>
                                )}
                            </Card>
                        </motion.div>

                        {/* Weaknesses / Growth Areas Card */}
                        <motion.div variants={fadeUp} initial="hidden" animate="visible">
                            <Card className="p-6 h-full border-amber-500/20 bg-amber-950/[0.04]">
                                <div className="flex items-center gap-2 mb-4 text-amber-400">
                                    <AlertTriangle size={16} />
                                    <h3 className="text-xs font-semibold uppercase tracking-wider">
                                        Areas for Improvement ({analysis.weaknesses?.length || 0})
                                    </h3>
                                </div>

                                {analysis.weaknesses?.length > 0 ? (
                                    <ul className="space-y-2.5">
                                        {analysis.weaknesses.map((weakness, index) => (
                                            <li key={index} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed">
                                                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                                <span>{weakness}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-zinc-500 italic">No major red flags detected.</p>
                                )}
                            </Card>
                        </motion.div>
                    </div>

                    {/* Skills Breakdown Card */}
                    <motion.div variants={fadeUp} initial="hidden" animate="visible">
                        <Card className="p-6 sm:p-8">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-5">
                                Skills Assessment
                            </h3>

                            <div className="space-y-5">
                                {/* Candidate Skills */}
                                <div>
                                    <span className="text-xs font-medium text-zinc-400 block mb-2.5">
                                        Detected Skills ({candidateInfo.skills?.length || 0})
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {candidateInfo.skills?.length > 0 ? (
                                            candidateInfo.skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-200"
                                                >
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-zinc-500">No skills parsed.</span>
                                        )}
                                    </div>
                                </div>

                                {/* Missing Skills */}
                                {analysis.missingSkills?.length > 0 && (
                                    <div className="pt-4 border-t border-white/10">
                                        <span className="text-xs font-medium text-rose-400 block mb-2.5">
                                            Missing Role Requirements ({analysis.missingSkills.length})
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {analysis.missingSkills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-300"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Experience & Education */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Extracted Experience */}
                        <motion.div variants={fadeUp} initial="hidden" animate="visible">
                            <Card className="p-6 h-full">
                                <div className="flex items-center gap-2 mb-4 text-zinc-300">
                                    <Briefcase size={16} className="text-zinc-500" />
                                    <h3 className="text-xs font-semibold uppercase tracking-wider">
                                        Work Experience
                                    </h3>
                                </div>

                                {candidateInfo.experience?.length > 0 ? (
                                    <ul className="space-y-3">
                                        {candidateInfo.experience.map((exp, index) => (
                                            <li key={index} className="text-xs text-zinc-300 leading-relaxed border-l-2 border-white/10 pl-3">
                                                {exp}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-zinc-500 italic">No structured work history parsed.</p>
                                )}
                            </Card>
                        </motion.div>

                        {/* Extracted Education */}
                        <motion.div variants={fadeUp} initial="hidden" animate="visible">
                            <Card className="p-6 h-full">
                                <div className="flex items-center gap-2 mb-4 text-zinc-300">
                                    <GraduationCap size={16} className="text-zinc-500" />
                                    <h3 className="text-xs font-semibold uppercase tracking-wider">
                                        Education & Degrees
                                    </h3>
                                </div>

                                {candidateInfo.education?.length > 0 ? (
                                    <ul className="space-y-3">
                                        {candidateInfo.education.map((edu, index) => (
                                            <li key={index} className="text-xs text-zinc-300 leading-relaxed border-l-2 border-white/10 pl-3">
                                                {edu}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-zinc-500 italic">No formal education entries parsed.</p>
                                )}
                            </Card>
                        </motion.div>
                    </div>
                </div>

                {/* Right Column: Scorecard & Quick Insights */}
                <div className="space-y-6">
                    {/* Overall Score Meter Card */}
                    <motion.div variants={fadeUp} initial="hidden" animate="visible">
                        <Card className="p-6 sm:p-7 text-center relative overflow-hidden">
                            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-4">
                                Overall AI Match Rating
                            </span>

                            <div className="inline-flex flex-col items-center justify-center h-32 w-32 rounded-full border-2 border-emerald-500/30 bg-emerald-500/[0.06] shadow-[0_0_24px_rgba(16,185,129,0.15)] mb-4">
                                <span className="text-4xl font-black text-white tabular-nums tracking-tight">
                                    {overallScore ?? "N/A"}
                                </span>
                                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                                    out of 10
                                </span>
                            </div>

                            {analysis.recommendation && (
                                <div className="mt-2">
                                    <Badge variant={getRecommendationVariant(analysis.recommendation)}>
                                        {analysis.recommendation}
                                    </Badge>
                                </div>
                            )}
                        </Card>
                    </motion.div>

                    {/* Dimensional Scorecard Breakdown */}
                    <motion.div variants={fadeUp} initial="hidden" animate="visible">
                        <Card className="p-6 space-y-4">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 pb-2 border-b border-white/10">
                                Detailed Score Breakdown
                            </h3>

                            <div className="space-y-4 pt-1">
                                <ScoreProgress
                                    label="Skills Match"
                                    score={analysis.skillsScore}
                                    icon={Award}
                                />
                                <ScoreProgress
                                    label="Experience Relevance"
                                    score={analysis.experienceScore}
                                    icon={Briefcase}
                                />
                                <ScoreProgress
                                    label="Projects Quality"
                                    score={analysis.projectsScore}
                                    icon={FolderGit2}
                                />
                                <ScoreProgress
                                    label="Education Background"
                                    score={analysis.educationScore}
                                    icon={GraduationCap}
                                />
                                <ScoreProgress
                                    label="Resume Presentation"
                                    score={analysis.resumeScore}
                                    icon={FileText}
                                />
                            </div>
                        </Card>
                    </motion.div>


                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-2xl"
                        >
                            <div className="flex items-center gap-3 text-red-400 mb-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
                                    <Trash2 size={20} />
                                </div>
                                <h3 className="text-base font-bold text-white">Delete Candidate Submission?</h3>
                            </div>

                            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                                Are you sure you want to delete <span className="font-semibold text-white">{candidateInfo.name || "this candidate"}</span>? This will permanently remove their application, AI analysis, and resume file from Cloudinary.
                            </p>

                            <div className="flex items-center justify-end gap-3">
                                <Button
                                    variant="secondary"
                                    disabled={deleting}
                                    onClick={() => setShowDeleteModal(false)}
                                    className="text-xs py-2 px-4"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="danger"
                                    disabled={deleting}
                                    loading={deleting}
                                    loadingText="Deleting..."
                                    onClick={handleDelete}
                                    className="text-xs py-2 px-4"
                                >
                                    Confirm Delete
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CandidateDetails;
