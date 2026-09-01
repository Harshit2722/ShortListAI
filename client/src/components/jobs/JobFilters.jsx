import { Search, X, Loader2, ArrowUpDown, RotateCcw } from "lucide-react";

const SORT_OPTIONS = [
    { label: "Date Created", value: "createdAt" },
    { label: "Deadline", value: "applicationDeadline" },
    { label: "Job Title", value: "title" },
    { label: "Min Salary", value: "salaryMin" },
    { label: "Max Salary", value: "salaryMax" },
    { label: "Experience", value: "experience" },
];

const WORK_MODES = [
    { label: "All Modes", value: "" },
    { label: "On-Site", value: "On-Site" },
    { label: "Remote", value: "Remote" },
    { label: "Hybrid", value: "Hybrid" },
];

const EMPLOYMENT_TYPES = [
    { label: "All Types", value: "" },
    { label: "Full-Time", value: "Full-Time" },
    { label: "Part-Time", value: "Part-Time" },
    { label: "Contract", value: "Contract" },
    { label: "Internship", value: "Internship" },
];

const STATUSES = [
    { label: "All Status", value: "" },
    { label: "Open", value: "Open" },
    { label: "Closed", value: "Closed" },
];

const selectClasses = "rounded-xl border border-white/10 bg-zinc-900/90 px-3 py-2 text-xs text-zinc-300 outline-none transition duration-200 focus:border-white/30 cursor-pointer";

const JobFilters = ({ filters, onChange, onReset, isSearching = false }) => {
    const { search, status, workMode, employmentType, sort, order } = filters;

    const hasActiveFilters = Boolean(
        search || status || workMode || employmentType || sort !== "createdAt" || order !== "desc"
    );

    return (
        <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                {/* Search */}
                <div className="relative w-full lg:max-w-sm">
                    {isSearching ? (
                        <Loader2 size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 animate-spin text-zinc-400" />
                    ) : (
                        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    )}
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onChange("search", e.target.value)}
                        placeholder="Search title or location..."
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-9 py-2 text-xs text-white placeholder:text-zinc-500 outline-none transition duration-200 focus:border-white/30 focus:bg-white/[0.08]"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => onChange("search", "")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
                        >
                            <X size={15} />
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2.5">
                    <select value={status} onChange={(e) => onChange("status", e.target.value)} className={selectClasses}>
                        {STATUSES.map((opt) => (
                            <option key={opt.label} value={opt.value} className="bg-zinc-900">{opt.label}</option>
                        ))}
                    </select>

                    <select value={workMode} onChange={(e) => onChange("workMode", e.target.value)} className={selectClasses}>
                        {WORK_MODES.map((opt) => (
                            <option key={opt.label} value={opt.value} className="bg-zinc-900">{opt.label}</option>
                        ))}
                    </select>

                    <select value={employmentType} onChange={(e) => onChange("employmentType", e.target.value)} className={selectClasses}>
                        {EMPLOYMENT_TYPES.map((opt) => (
                            <option key={opt.label} value={opt.value} className="bg-zinc-900">{opt.label}</option>
                        ))}
                    </select>

                    <select value={sort} onChange={(e) => onChange("sort", e.target.value)} className={selectClasses}>
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-zinc-900">Sort: {opt.label}</option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={() => onChange("order", order === "asc" ? "desc" : "asc")}
                        title={`Order: ${order === "asc" ? "Ascending" : "Descending"}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-zinc-300 transition duration-200 hover:border-white/25 hover:bg-white/[0.08] hover:text-white cursor-pointer"
                    >
                        <ArrowUpDown size={14} className={order === "asc" ? "rotate-180 transition-transform" : "transition-transform"} />
                        <span className="uppercase">{order}</span>
                    </button>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={onReset}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 transition duration-200 hover:bg-red-500/20 cursor-pointer"
                        >
                            <RotateCcw size={13} />
                            <span>Reset</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobFilters;
