import { useCallback, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { AlertCircle, SlidersHorizontal, RotateCcw, Plus } from "lucide-react";
import { getJobs } from "../../api/job.api";
import JobCard from "../../components/jobs/JobCard";
import JobFilters from "../../components/jobs/JobFilters";
import CreateJobModal from "../../components/jobs/CreateJobModal";
import Pagination from "../../components/common/Pagination";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/ui/Loader";
import useDebounce from "../../hooks/useDebounce";
import { fadeUp, staggerContainer } from "../../utils/animations";

const INITIAL_FILTERS = {
    search: "",
    status: "",
    workMode: "",
    employmentType: "",
    sort: "createdAt",
    order: "desc",
};

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(1);
    const limit = 6;

    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const debouncedSearch = useDebounce(filters.search, 400);
    const isFirstMount = useRef(true);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const handleReset = () => {
        setFilters(INITIAL_FILTERS);
        setPage(1);
    };

    const fetchJobs = useCallback(async (isInitial = false) => {
        try {
            if (isInitial) setInitialLoading(true);
            else setIsSearching(true);
            setError(null);

            const { data } = await getJobs({
                page,
                limit,
                search: debouncedSearch || undefined,
                status: filters.status || undefined,
                workMode: filters.workMode || undefined,
                employmentType: filters.employmentType || undefined,
                sort: filters.sort,
                order: filters.order,
            });

            setJobs(data.jobs);
            setPagination(data.pagination);
        } catch (err) {
            console.error("Failed to fetch jobs:", err);
            setError(err.response?.data?.message || "Failed to load jobs.");
        } finally {
            setInitialLoading(false);
            setIsSearching(false);
        }
    }, [page, limit, debouncedSearch, filters.status, filters.workMode, filters.employmentType, filters.sort, filters.order]);

    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            fetchJobs(true);
        } else {
            fetchJobs(false);
        }
    }, [fetchJobs]);

    const hasActiveFilters = Boolean(
        filters.search || filters.status || filters.workMode ||
        filters.employmentType || filters.sort !== "createdAt" || filters.order !== "desc"
    );

    return (
        <div>
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-white lg:text-4xl">Jobs</h1>
                    <p className="mt-2 text-sm text-zinc-400 lg:text-base">
                        Manage active openings, track candidate requirements, and view job statuses.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200 shadow-lg cursor-pointer shrink-0"
                >
                    <Plus size={15} />
                    <span>Create Job</span>
                </button>
            </div>

            {/* Filter Bar */}
            <JobFilters
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleReset}
                isSearching={isSearching || filters.search !== debouncedSearch}
            />

            {/* Loading */}
            {initialLoading && <Loader title="Loading Jobs" subtitle="Fetching the latest active job postings..." />}

            {/* Error */}
            {!initialLoading && error && (
                <Card className="border-red-500/20 bg-red-500/[0.03] p-8 text-center">
                    <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400">
                        <AlertCircle size={24} />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">Unable to load jobs</h3>
                    <p className="mt-2 text-sm text-zinc-400">{error}</p>
                    <div className="mt-6">
                        <Button onClick={() => fetchJobs(true)} variant="secondary">Try Again</Button>
                    </div>
                </Card>
            )}

            {/* Empty State */}
            {!initialLoading && !error && jobs.length === 0 && (
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-center backdrop-blur-md"
                >
                    <SlidersHorizontal size={28} className="text-zinc-500" />
                    <h3 className="mt-3 text-base font-semibold text-white">No jobs found</h3>
                    <p className="mt-1 max-w-sm text-xs text-zinc-400">
                        {hasActiveFilters
                            ? "Try adjusting your search terms or clearing some filters to find matching jobs."
                            : "No jobs are currently available. Create a new job posting to get started."}
                    </p>
                    {hasActiveFilters ? (
                        <button
                            onClick={handleReset}
                            className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-medium text-white transition hover:bg-white/[0.12] cursor-pointer"
                        >
                            <RotateCcw size={13} />
                            <span>Clear all filters</span>
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition shadow-lg cursor-pointer"
                        >
                            <Plus size={14} />
                            <span>Create First Job</span>
                        </button>
                    )}
                </motion.div>
            )}

            {/* Job Grid & Pagination */}
            {!initialLoading && !error && jobs.length > 0 && (
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-10"
                >
                    <motion.div
                        variants={fadeUp}
                        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 transition-opacity duration-200 ${isSearching ? "opacity-60" : "opacity-100"}`}
                    >
                        {jobs.map((job) => (
                            <JobCard key={job._id || job.id} job={job} />
                        ))}
                    </motion.div>

                    <motion.div variants={fadeUp}>
                        <Pagination
                            pagination={pagination}
                            onPageChange={setPage}
                            disabled={isSearching}
                        />
                    </motion.div>
                </motion.div>
            )}

            {/* Create Job Modal */}
            <CreateJobModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onJobCreated={() => {
                    setPage(1);
                    fetchJobs(false);
                }}
            />
        </div>
    );
};

export default Jobs;