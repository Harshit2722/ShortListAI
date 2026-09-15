import { useNavigate } from "react-router-dom";
import { ChevronRight, Mail, Calendar, Sparkles } from "lucide-react";
import Badge from "../ui/Badge";

const getRecommendationBadgeVariant = (recommendation, status) => {
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
            if (status === "Processing") return "warning";
            if (status === "Failed") return "danger";
            return "neutral";
    }
};

const getScoreColor = (score) => {
    if (score == null) return "text-zinc-500";
    if (score >= 8) return "text-emerald-400";
    if (score >= 6) return "text-sky-400";
    if (score >= 4) return "text-yellow-400";
    return "text-red-400";
};

const CandidateList = ({ candidates = [], jobId, isSearching = false }) => {
    const navigate = useNavigate();

    const handleRowClick = (candidateId) => {
        navigate(`/jobs/${jobId}/candidates/${candidateId}`);
    };

    return (
        <div className={`overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md transition-opacity duration-200 ${isSearching ? "opacity-60" : "opacity-100"}`}>
            {/* Header */}
            <div className="grid grid-cols-12 items-center gap-4 border-b border-white/10 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                <div className="col-span-6 sm:col-span-6 md:col-span-6">Candidate</div>
                <div className="col-span-3 sm:col-span-3 md:col-span-3 text-center sm:text-left">Score</div>
                <div className="col-span-3 sm:col-span-3 md:col-span-3 text-right sm:text-left">Recommendation</div>
            </div>

            {/* Candidate Rows */}
            <div className="divide-y divide-white/5">
                {candidates.map((item) => {
                    const candidateInfo = item.candidate || {};
                    const analysis = item.analysis || {};
                    const score = analysis.overallScore;
                    const recommendation = analysis.recommendation || item.status;
                    const badgeVariant = getRecommendationBadgeVariant(analysis.recommendation, item.status);
                    const skillsList = candidateInfo.skills && candidateInfo.skills.length > 0
                        ? candidateInfo.skills.slice(0, 5).join(" • ")
                        : null;

                    return (
                        <div
                            key={item._id}
                            onClick={() => handleRowClick(item._id)}
                            className="group grid grid-cols-12 items-center gap-4 px-6 py-4.5 transition duration-150 hover:bg-white/[0.04] cursor-pointer"
                        >
                            {/* Candidate Info */}
                            <div className="col-span-6 sm:col-span-6 md:col-span-6 min-w-0 pr-2">
                                <div className="flex items-center gap-2">
                                    <h4 className="truncate text-sm font-semibold text-white group-hover:text-zinc-100">
                                        {candidateInfo.name || "Unnamed Candidate"}
                                    </h4>
                                </div>

                                {skillsList && (
                                    <p className="mt-1 truncate text-xs font-medium text-zinc-400">
                                        {skillsList}
                                    </p>
                                )}

                                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-zinc-500">
                                    {candidateInfo.email && (
                                        <span className="flex items-center gap-1 truncate">
                                            <Mail size={12} className="text-zinc-500" />
                                            <span className="truncate">{candidateInfo.email}</span>
                                        </span>
                                    )}
                                    {item.createdAt && (
                                        <span className="hidden sm:flex items-center gap-1">
                                            <Calendar size={12} className="text-zinc-500" />
                                            <span>
                                                {new Date(item.createdAt).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Score */}
                            <div className="col-span-3 sm:col-span-3 md:col-span-3 text-center sm:text-left">
                                {score != null ? (
                                    <div className="inline-flex items-baseline gap-1">
                                        <span className={`text-base sm:text-lg font-bold ${getScoreColor(score)}`}>
                                            {Number(score).toFixed(1)}
                                        </span>
                                        <span className="text-[11px] font-medium text-zinc-500">/10</span>
                                    </div>
                                ) : (
                                    <span className="text-xs text-zinc-500 font-medium">
                                        {item.status === "Processing" ? "Processing..." : "Pending"}
                                    </span>
                                )}
                            </div>

                            {/* Recommendation & Arrow */}
                            <div className="col-span-3 sm:col-span-3 md:col-span-3 flex items-center justify-end sm:justify-between">
                                <Badge variant={badgeVariant}>
                                    {recommendation || "Pending"}
                                </Badge>

                                <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition duration-150 group-hover:translate-x-0.5 group-hover:text-white">
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CandidateList;
