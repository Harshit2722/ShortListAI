import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase,
    Users,
    Brain,
    Clock,
    Sparkles,
    Trophy,
    RefreshCw,
    LogOut,
    MapPin,
    Building2,
    Calendar,
    AlertCircle,
    ChevronDown
} from "lucide-react";

import { getDashboard } from "../../api/dashboard.api";
import { useAuth } from "../../hooks/useAuth";
import Silk from "../../components/backgrounds/Silk/Silk";
import Logo from "../../components/layout/Logo";
import Card from "../../components/common/Card";
import StatCard from "../../components/dashboard/StatCard";
import Badge from "../../components/ui/Badge";
import Button from "../../components/common/Button";
import { fadeUp, staggerContainer } from "../../utils/animations";

const Dashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const profileDropdownRef = useRef(null);
    const { user, logout } = useAuth();

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchDashboard = useCallback(async (isManualRefresh = false) => {
        try {
            if (isManualRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);
            const data = await getDashboard();
            setDashboard(data.data);
        } catch (err) {
            console.error("Dashboard fetch error:", err);
            setError(err.response?.data?.message || "Failed to load dashboard data.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line
        fetchDashboard();
    }, [fetchDashboard]);

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

    const getScoreColor = (score) => {
        if (score >= 8) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
        if (score >= 6) return "text-blue-400 border-blue-500/30 bg-blue-500/10";
        if (score >= 4) return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
        return "text-red-400 border-red-500/30 bg-red-500/10";
    };

    return (
        <div className="relative min-h-screen overflow-x-hidden text-white">
            {/* Silk Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Silk
                    speed={10}
                    scale={1}
                    color="#363846"
                    noiseIntensity={0.6}
                    rotation={0}
                />
            </div>

            {/* Dark Backdrop Overlay */}
            <div className="pointer-events-none fixed inset-0 z-10 bg-black/45" />

            {/* Main Content Layout */}
            <div className="relative z-20 flex min-h-screen flex-col">
                {/* Navbar matching common navbar CSS */}
                <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-2xl border-b border-white/8">
                    <div className="grid h-20 grid-cols-[1fr_auto_1fr] items-center px-6 lg:px-10">
                        <div className="justify-self-start">
                            <Logo />
                        </div>

                        <div className="justify-self-center hidden md:block">
                            <span className="text-sm font-medium text-zinc-300">
                                Recruiter Workspace
                            </span>
                        </div>

                        {/* Top Right Profile Icon with Dropdown Tile and Sign Out */}
                        <div className="flex justify-self-end items-center">
                            <div className="relative" ref={profileDropdownRef}>
                                <button
                                    onClick={() => setIsProfileOpen((prev) => !prev)}
                                    className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 pr-3 backdrop-blur-md transition duration-200 hover:border-white/25 hover:bg-white/[0.08] cursor-pointer"
                                    aria-expanded={isProfileOpen}
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-800 text-sm font-semibold text-white shadow-inner">
                                        {user?.name ? user.name.charAt(0).toUpperCase() : "R"}
                                    </div>
                                    <span className="hidden text-xs font-medium text-zinc-200 sm:inline-block max-w-[120px] truncate">
                                        {user?.name || "Recruiter"}
                                    </span>
                                    <ChevronDown
                                        size={14}
                                        className={`text-zinc-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-2.5 w-64 origin-top-right rounded-2xl border border-white/15 bg-zinc-950/90 p-4 shadow-2xl backdrop-blur-2xl z-50"
                                        >
                                            {/* Profile Tile */}
                                            <div className="flex items-center gap-3 pb-3">
                                                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10 text-base font-semibold text-white shadow-inner">
                                                    {user?.name ? user.name.charAt(0).toUpperCase() : "R"}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="truncate text-sm font-semibold text-white">
                                                        {user?.name || "Recruiter"}
                                                    </span>
                                                    <span className="truncate text-xs text-zinc-400">
                                                        {user?.email || "recruiter@shortlist.ai"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="my-2 border-t border-white/10" />

                                            {/* Sign Out Action */}
                                            <button
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                    logout();
                                                }}
                                                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-red-400 transition duration-150 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
                                            >
                                                <LogOut size={15} />
                                                <span>Sign Out</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="mx-auto w-full max-w-7xl flex-1 px-6 pt-28 pb-12 lg:px-10">
                    {/* Welcome Header */}
                    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-white lg:text-4xl">
                                Welcome back, {user?.name ? user.name.split(" ")[0] : "Recruiter"}
                            </h1>
                            <p className="mt-2 text-sm text-zinc-400 lg:text-base">
                                Real-time overview of your hiring pipeline, active job postings, and candidate evaluations.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => fetchDashboard(true)}
                                disabled={refreshing || loading}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-zinc-300 backdrop-blur-md transition duration-200 hover:border-white/30 hover:bg-white/[0.08] hover:text-white disabled:opacity-50 cursor-pointer"
                            >
                                <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                                <span>{refreshing ? "Refreshing..." : "Refresh Data"}</span>
                            </button>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex min-h-[400px] items-center justify-center">
                            <Card className="flex flex-col items-center justify-center p-12 text-center">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md">
                                    <RefreshCw size={22} className="animate-spin text-white" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-white">Loading Dashboard</h3>
                                <p className="mt-2 text-sm text-zinc-400">Fetching the latest metrics and candidate reports...</p>
                            </Card>
                        </div>
                    )}

                    {/* Error State */}
                    {!loading && error && (
                        <Card className="border-red-500/20 bg-red-500/[0.03] p-8 text-center">
                            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400">
                                <AlertCircle size={24} />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-white">Unable to load dashboard</h3>
                            <p className="mt-2 text-sm text-zinc-400">{error}</p>
                            <div className="mt-6">
                                <Button onClick={() => fetchDashboard(false)} variant="secondary">
                                    Try Again
                                </Button>
                            </div>
                        </Card>
                    )}

                    {/* Loaded Dashboard Content */}
                    {!loading && !error && dashboard && (
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="space-y-10"
                        >
                            {/* Key Stats Cards Grid */}
                            <motion.div
                                variants={fadeUp}
                                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
                            >
                                <StatCard
                                    title="Total Job Postings"
                                    value={dashboard.stats?.totalJobs ?? 0}
                                    icon={Briefcase}
                                    subtitle={
                                        <span>
                                            <span className="text-emerald-400 font-medium">{dashboard.stats?.openJobs ?? 0} Open</span>
                                            <span className="mx-1.5 text-zinc-600">·</span>
                                            <span>{dashboard.stats?.closedJobs ?? 0} Closed</span>
                                        </span>
                                    }
                                    badge="Jobs"
                                />

                                <StatCard
                                    title="Candidates Screened"
                                    value={dashboard.stats?.totalCandidates ?? 0}
                                    icon={Users}
                                    subtitle="Resumes submitted across all jobs"
                                    badge="Applicants"
                                />

                                <StatCard
                                    title="Completed Analysis"
                                    value={dashboard.stats?.completedAnalysis ?? 0}
                                    icon={Brain}
                                    subtitle={
                                        dashboard.stats?.totalCandidates > 0
                                            ? `${Math.round(((dashboard.stats?.completedAnalysis || 0) / dashboard.stats.totalCandidates) * 100)}% evaluation rate`
                                            : "Awaiting new submissions"
                                    }
                                    badge="Completed"
                                />

                                <StatCard
                                    title="Pending / Processing"
                                    value={(dashboard.stats?.pendingAnalysis ?? 0) + (dashboard.stats?.processingAnalysis ?? 0)}
                                    icon={Clock}
                                    subtitle={
                                        <span>
                                            <span>{dashboard.stats?.processingAnalysis ?? 0} in progress</span>
                                            {dashboard.stats?.failedAnalysis > 0 && (
                                                <>
                                                    <span className="mx-1.5 text-zinc-600">·</span>
                                                    <span className="text-red-400">{dashboard.stats?.failedAnalysis} failed</span>
                                                </>
                                            )}
                                        </span>
                                    }
                                    badge="In Queue"
                                />
                            </motion.div>

                            {/* Two-Column Grid: Recent Jobs & Top Candidates */}
                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                {/* Recent Job Postings */}
                                <motion.div variants={fadeUp}>
                                    <Card className="flex h-full flex-col p-7">
                                        <div className="flex items-center justify-between border-b border-white/10 pb-5">
                                            <div className="flex items-center gap-3">
                                                <div className="inline-flex rounded-2xl border border-white/10 bg-white/[0.06] p-2.5 text-zinc-200 backdrop-blur-md">
                                                    <Briefcase size={20} />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-semibold text-white">Recent Job Postings</h2>
                                                    <p className="text-xs text-zinc-400">Your latest created recruitment positions</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-5 flex-1">
                                            {dashboard.recentJobs && dashboard.recentJobs.length > 0 ? (
                                                <div className="space-y-3.5">
                                                    {dashboard.recentJobs.map((job) => (
                                                        <div
                                                            key={job._id}
                                                            className="group/item flex flex-col justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4.5 backdrop-blur-md transition-all duration-200 hover:border-white/20 hover:bg-white/[0.05] sm:flex-row sm:items-center"
                                                        >
                                                            <div className="space-y-1.5">
                                                                <div className="flex items-center gap-2.5">
                                                                    <h3 className="font-semibold text-white group-hover/item:text-zinc-100">
                                                                        {job.title}
                                                                    </h3>
                                                                    <Badge variant={job.status === "Open" ? "success" : "neutral"}>
                                                                        {job.status}
                                                                    </Badge>
                                                                </div>

                                                                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                                                                    {job.location && (
                                                                        <span className="flex items-center gap-1">
                                                                            <MapPin size={12} />
                                                                            {job.location}
                                                                        </span>
                                                                    )}
                                                                    {job.workMode && (
                                                                        <span className="flex items-center gap-1">
                                                                            <Building2 size={12} />
                                                                            {job.workMode}
                                                                        </span>
                                                                    )}
                                                                    {job.createdAt && (
                                                                        <span className="flex items-center gap-1">
                                                                            <Calendar size={12} />
                                                                            {new Date(job.createdAt).toLocaleDateString(undefined, {
                                                                                month: "short",
                                                                                day: "numeric"
                                                                            })}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between sm:justify-end gap-3">
                                                                <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-300">
                                                                    <Users size={13} className="text-zinc-400" />
                                                                    <span>{job.candidateCount ?? 0}</span>
                                                                    <span className="text-zinc-500">applicants</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 p-8 text-center">
                                                    <div className="inline-flex rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-zinc-400">
                                                        <Briefcase size={24} />
                                                    </div>
                                                    <p className="mt-3 text-sm font-medium text-white">No jobs posted yet</p>
                                                    <p className="mt-1 text-xs text-zinc-400">Create your first job posting to start receiving applicants.</p>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                </motion.div>

                                {/* Top Evaluated Candidates */}
                                <motion.div variants={fadeUp}>
                                    <Card className="flex h-full flex-col p-7">
                                        <div className="flex items-center justify-between border-b border-white/10 pb-5">
                                            <div className="flex items-center gap-3">
                                                <div className="inline-flex rounded-2xl border border-white/10 bg-white/[0.06] p-2.5 text-zinc-200 backdrop-blur-md">
                                                    <Trophy size={20} />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-semibold text-white">Top Ranked Candidates</h2>
                                                    <p className="text-xs text-zinc-400">Highest AI match scores across active openings</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-5 flex-1">
                                            {dashboard.topCandidates && dashboard.topCandidates.length > 0 ? (
                                                <div className="space-y-3.5">
                                                    {dashboard.topCandidates.map((cand, idx) => {
                                                        const candidateName = cand.candidate?.name || cand.candidate?.email || `Candidate #${idx + 1}`;
                                                        const jobTitle = cand.job?.title || "Role Evaluation";
                                                        const score = cand.analysis?.overallScore ?? 0;
                                                        const recommendation = cand.analysis?.recommendation;

                                                        return (
                                                            <div
                                                                key={cand._id || idx}
                                                                className="group/item flex flex-col justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4.5 backdrop-blur-md transition-all duration-200 hover:border-white/20 hover:bg-white/[0.05] sm:flex-row sm:items-center"
                                                            >
                                                                <div className="flex items-center gap-3.5">
                                                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-sm font-semibold text-white shadow-inner">
                                                                        {candidateName.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <div className="space-y-0.5">
                                                                        <h3 className="font-semibold text-white group-hover/item:text-zinc-100">
                                                                            {candidateName}
                                                                        </h3>
                                                                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                                                                            <span className="truncate max-w-[180px]">{jobTitle}</span>
                                                                            {recommendation && (
                                                                                <>
                                                                                    <span>•</span>
                                                                                    <Badge variant={getRecommendationVariant(recommendation)}>
                                                                                        {recommendation}
                                                                                    </Badge>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-2.5">
                                                                    <div className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold ${getScoreColor(score)}`}>
                                                                        <span>{score.toFixed(1)}</span>
                                                                        <span className="text-[10px] opacity-70">/ 10</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 p-8 text-center">
                                                    <div className="inline-flex rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-zinc-400">
                                                        <Brain size={24} />
                                                    </div>
                                                    <p className="mt-3 text-sm font-medium text-white">No evaluated candidates yet</p>
                                                    <p className="mt-1 text-xs text-zinc-400">Upload candidate resumes to start generating AI candidate match ratings.</p>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;