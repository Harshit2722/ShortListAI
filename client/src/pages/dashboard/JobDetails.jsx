import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    MapPin,
    BriefcaseBusiness,
    Clock,
    Calendar,
    Users,
    ChevronRight,
    Trash2,
    Edit3,
    CheckCircle2,
    XCircle,
    AlertCircle,
    IndianRupee,
    GraduationCap,
    FileText,
    Sparkles,
} from "lucide-react";
import { getJobById, updateJobStatus, deleteJob } from "../../api/job.api";
import Card from "../../components/common/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/common/Button";
import Loader from "../../components/ui/Loader";
import EditJobModal from "../../components/jobs/EditJobModal";
import { fadeUp, staggerContainer } from "../../utils/animations";

const JobDetails = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchJob = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await getJobById(jobId);
            setJob(data);
        } catch (err) {
            console.error("Failed to load job:", err);
            setError(err.response?.data?.message || "Job not found or failed to load.");
        } finally {
            setLoading(false);
        }
    }, [jobId]);

    useEffect(() => {
        fetchJob();
    }, [fetchJob]);

    const handleToggleStatus = async () => {
        if (!job) return;
        const newStatus = job.status === "Open" ? "Closed" : "Open";
        try {
            setActionLoading(true);
            await updateJobStatus(job._id || jobId, newStatus);
            setJob((prev) => ({ ...prev, status: newStatus }));
        } catch (err) {
            console.error("Failed to update status:", err);
            alert(err.response?.data?.message || "Failed to update job status.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this job posting? This action cannot be undone.")) {
            return;
        }
        try {
            setActionLoading(true);
            await deleteJob(job._id || jobId);
            navigate("/jobs");
        } catch (err) {
            console.error("Failed to delete job:", err);
            alert(err.response?.data?.message || "Failed to delete job.");
            setActionLoading(false);
        }
    };

    if (loading) {
        return <Loader title="Loading Job Details" subtitle="Fetching information..." />;
    }

    if (error || !job) {
        return (
            <Card className="border-red-500/20 bg-red-500/[0.03] p-8 text-center max-w-lg mx-auto">
                <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400">
                    <AlertCircle size={24} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">Unable to load job</h3>
                <p className="mt-2 text-sm text-zinc-400">{error || "Job does not exist."}</p>
                <div className="mt-6 flex justify-center gap-3">
                    <Link to="/jobs">
                        <Button variant="secondary">Back to Jobs</Button>
                    </Link>
                    <Button onClick={fetchJob} variant="primary">Try Again</Button>
                </div>
            </Card>
        );
    }

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="w-full space-y-6"
        >
            {/* Top Navigation & Action Header */}
            <motion.div variants={fadeUp} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-2">
                <Link
                    to="/jobs"
                    className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition duration-200"
                >
                    <ArrowLeft size={15} />
                    <span>Back to all jobs</span>
                </Link>

                <div className="flex flex-wrap items-center gap-2.5">
                    <Button
                        variant="secondary"
                        disabled={actionLoading}
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex items-center gap-1.5 text-xs py-2 px-3.5"
                    >
                        <Edit3 size={14} />
                        <span>Edit Job</span>
                    </Button>

                    <Button
                        variant="secondary"
                        disabled={actionLoading}
                        onClick={handleToggleStatus}
                        className="flex items-center gap-1.5 text-xs py-2 px-3.5"
                    >
                        {job.status === "Open" ? (
                            <>
                                <XCircle size={14} className="text-yellow-400" />
                                <span>Close Job</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={14} className="text-emerald-400" />
                                <span>Reopen Job</span>
                            </>
                        )}
                    </Button>

                    <Button
                        variant="danger"
                        disabled={actionLoading}
                        onClick={handleDelete}
                        className="flex items-center gap-1.5 text-xs py-2 px-3.5"
                    >
                        <Trash2 size={14} />
                        <span>Delete</span>
                    </Button>
                </div>
            </motion.div>

            {/* Main Content Grid: 2-Column Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Left (Main Details): 2 Columns on LG */}
                <motion.div variants={fadeUp} className="lg:col-span-2">
                    <Card className="p-8 sm:p-10">
                        {/* Title & Metadata Header */}
                        <div className="mb-8 pb-8 border-b border-white/10">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                                    {job.title}
                                </h1>
                                <Badge variant={job.status === "Open" ? "success" : "neutral"}>
                                    {job.status}
                                </Badge>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-zinc-400">
                                <span className="flex items-center gap-1.5 text-zinc-300">
                                    <MapPin size={15} className="text-zinc-500" />
                                    {job.location}
                                </span>
                                <span className="text-zinc-600">•</span>
                                <span className="flex items-center gap-1.5 text-zinc-300">
                                    <Clock size={15} className="text-zinc-500" />
                                    {job.workMode}
                                </span>
                                <span className="text-zinc-600">•</span>
                                <span className="flex items-center gap-1.5 text-zinc-300">
                                    <BriefcaseBusiness size={15} className="text-zinc-500" />
                                    {job.employmentType}
                                </span>
                            </div>
                        </div>

                        {/* Required Skills Section */}
                        <div className="mb-8 pb-8 border-b border-white/10">
                            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">
                                <Sparkles size={14} className="text-zinc-500" />
                                <span>Required Skills</span>
                            </h3>
                            <div className="flex flex-wrap gap-2.5">
                                {job.requiredSkills?.map((skill) => (
                                    <span
                                        key={skill}
                                        className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-zinc-200 transition duration-150 hover:border-white/20 hover:bg-white/[0.08]"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Description Section */}
                        <div>
                            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">
                                <FileText size={14} className="text-zinc-500" />
                                <span>About this role</span>
                            </h3>
                            <p className="text-sm sm:text-base leading-relaxed text-zinc-300 whitespace-pre-line font-normal">
                                {job.description}
                            </p>
                        </div>
                    </Card>
                </motion.div>

                {/* Right (Highlights & Side Info): 1 Column on LG */}
                <motion.div variants={fadeUp} className="space-y-6">
                    {/* Job Overview Card */}
                    <Card className="p-7 sm:p-8">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-6">
                            Job Overview
                        </h3>

                        <div className="space-y-6">
                            {/* Compensation */}
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                                    <IndianRupee size={18} />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-zinc-500 block">Offered Compensation</span>
                                    <p className="text-sm sm:text-base font-semibold text-white">
                                        ₹{job.salary?.min?.toLocaleString("en-IN")} – ₹{job.salary?.max?.toLocaleString("en-IN")}
                                    </p>
                                    <span className="text-[11px] text-zinc-500 block">Per annum ({job.salary?.currency || "INR"})</span>
                                </div>
                            </div>

                            {/* Experience */}
                            <div className="flex items-start gap-4 pt-6 border-t border-white/10">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-400">
                                    <GraduationCap size={18} />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-zinc-500 block">Experience Required</span>
                                    <p className="text-sm sm:text-base font-semibold text-white">
                                        {job.experience} {job.experience === 1 ? "Year" : "Years"} Minimum
                                    </p>
                                </div>
                            </div>

                            {/* Deadline */}
                            <div className="flex items-start gap-4 pt-6 border-t border-white/10">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                                    <Calendar size={18} />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-zinc-500 block">Application Deadline</span>
                                    <p className="text-sm sm:text-base font-semibold text-white">
                                        {new Date(job.applicationDeadline).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Duration */}
                            {job.duration && (
                                <div className="flex items-start gap-4 pt-6 border-t border-white/10">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                                        <Clock size={18} />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs text-zinc-500 block">Job Duration</span>
                                        <p className="text-sm sm:text-base font-semibold text-white">
                                            {job.duration.value} {job.duration.unit}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Candidates Link Card */}
                    <Card className="p-7 sm:p-8 transition-all duration-200 hover:border-white/20">
                        <Link to="/candidates" className="flex items-center justify-between group">
                            <div className="space-y-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                                    Candidates
                                </span>
                                <p className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                                    <Users size={20} className="text-zinc-400" />
                                    <span>{job.candidateCount ?? 0}</span>
                                    <span className="text-xs font-normal text-zinc-400">Applicants</span>
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 transition duration-200 group-hover:border-white/25 group-hover:bg-white/[0.08] group-hover:text-white">
                                <ChevronRight size={18} />
                            </div>
                        </Link>
                    </Card>
                </motion.div>
            </div>

            {/* Edit Job Modal */}
            <EditJobModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                job={job}
                onJobUpdated={(updatedJob) => setJob(updatedJob)}
            />
        </motion.div>
    );
};

export default JobDetails;
