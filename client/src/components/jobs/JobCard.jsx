import { Link } from "react-router-dom";
import { Calendar, MapPin, BriefcaseBusiness, Clock } from "lucide-react";
import Card from "../common/Card";
import Badge from "../ui/Badge";

const JobCard = ({ job, className = "" }) => {
    return (
        <Link to={`/jobs/${job._id || job.id}`} className="block h-full cursor-pointer">
            <Card className={`p-5 transition-all duration-200 hover:border-white/30 h-full flex flex-col justify-between ${className}`}>
            <div className="flex flex-col gap-4">
                {/* Top */}
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <h2 className="truncate text-base sm:text-lg font-semibold text-white" title={job.title}>
                            {job.title}
                        </h2>

                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-zinc-400">
                            <span className="flex items-center gap-1.5">
                                <MapPin size={14} />
                                {job.location}
                            </span>

                            <span className="flex items-center gap-1.5">
                                <BriefcaseBusiness size={14} />
                                {job.employmentType}
                            </span>

                            <span className="flex items-center gap-1.5">
                                {job.workMode}
                            </span>
                        </div>
                    </div>

                    <Badge
                        variant={job.status === "Open" ? "success" : "neutral"}
                    >
                        {job.status}
                    </Badge>
                </div>

                {/* Details */}
                <div className="flex flex-wrap gap-2">
                    <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300">
                        ₹{job.salary?.min?.toLocaleString("en-IN")} - ₹
                        {job.salary?.max?.toLocaleString("en-IN")}
                    </span>

                    <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300">
                        {job.experience}{" "}
                        {job.experience === 1 ? "year" : "years"} exp
                    </span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                    {job.requiredSkills?.slice(0, 5).map((skill) => (
                        <span
                            key={skill}
                            className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-zinc-400"
                        >
                            {skill}
                        </span>
                    ))}

                    {job.requiredSkills?.length > 5 && (
                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-zinc-500">
                            +{job.requiredSkills.length - 5}
                        </span>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <Calendar size={14} />
                    {new Date(job.applicationDeadline).toLocaleDateString(
                        "en-IN",
                        {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        }
                    )}
                </span>

                <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <Clock size={14} />
                    {job.duration
                        ? `${job.duration.value} ${job.duration.unit}`
                        : "Permanent"}
                </span>
            </div>
        </Card>
        </Link>
    );
};

export default JobCard;