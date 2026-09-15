import { useCallback, useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Users, AlertCircle, RotateCcw } from "lucide-react";
import { getJobById } from "../../api/job.api";
import { getJobCandidates } from "../../api/candidate.api";
import CandidateFilters from "../../components/candidates/CandidateFilters";
import CandidateList from "../../components/candidates/CandidateList";
import Pagination from "../../components/common/Pagination";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/ui/Loader";
import useDebounce from "../../hooks/useDebounce";
import { fadeUp, staggerContainer } from "../../utils/animations";

const INITIAL_FILTERS = {
    search: "",
    recommendation: "",
    status: "",
    sort: "overallScore",
    order: "desc",
};

const JobCandidates = () => {
    const { jobId } = useParams();

    const [job, setJob] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(1);
    const limit = 10;

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

    // Fetch Job metadata
    const fetchJobDetails = useCallback(async () => {
        try {
            const { data } = await getJobById(jobId);
            setJob(data);
        } catch (err) {
            console.error("Failed to load job details:", err);
        }
    }, [jobId]);

    // Fetch Candidates
    const fetchCandidates = useCallback(async (isInitial = false) => {
        try {
            if (isInitial) setInitialLoading(true);
            else setIsSearching(true);
            setError(null);

            const { data } = await getJobCandidates(jobId, {
                page,
                limit,
                search: debouncedSearch || undefined,
                recommendation: filters.recommendation || undefined,
                status: filters.status || undefined,
                sort: filters.sort,
                order: filters.order,
            });

            setCandidates(data.resumes || []);
            setPagination(data.pagination);
        } catch (err) {
            console.error("Failed to fetch candidates:", err);
            setError(err.response?.data?.message || "Failed to load candidates.");
        } finally {
            setInitialLoading(false);
            setIsSearching(false);
        }
    }, [jobId, page, limit, debouncedSearch, filters.recommendation, filters.status, filters.sort, filters.order]);

    useEffect(() => {
        fetchJobDetails();
    }, [fetchJobDetails]);

    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            fetchCandidates(true);
        } else {
            fetchCandidates(false);
        }
    }, [fetchCandidates]);

    const hasActiveFilters = Boolean(
        filters.search || filters.recommendation || filters.status ||
        filters.sort !== "overallScore" || filters.order !== "desc"
    );

    const totalApplicants = pagination?.total ?? job?.candidateCount ?? 0;

    return (
        <div className="space-y-6">
            {/* Back to Job link */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <Link
                    to={`/jobs/${jobId}`}
                    className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition duration-200"
                >
                    <ArrowLeft size={15} />
                    <span>Back to Job</span>
                </Link>
            </motion.div>

            {/* Header: Job Title & Applicant Count */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                    {job?.title || "Candidates"}
                </h1>
                <p className="text-sm font-medium text-zinc-400">
                    {totalApplicants} {totalApplicants === 1 ? "Applicant" : "Applicants"}
                </p>
            </motion.div>

            {/* Filter Bar */}
            <CandidateFilters
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleReset}
                isSearching={isSearching || filters.search !== debouncedSearch}
            />

            {/* Initial Loading */}
            {initialLoading && (
                <Loader title="Loading Candidates" subtitle="Fetching applicant rankings and AI scores..." />
            )}

            {/* Error State */}
            {!initialLoading && error && (
                <Card className="border-red-500/20 bg-red-500/[0.03] p-8 text-center max-w-lg mx-auto">
                    <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400">
                        <AlertCircle size={24} />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">Unable to load candidates</h3>
                    <p className="mt-2 text-sm text-zinc-400">{error}</p>
                    <div className="mt-6">
                        <Button onClick={() => fetchCandidates(true)} variant="secondary">Try Again</Button>
                    </div>
                </Card>
            )}

            {/* Empty State */}
            {!initialLoading && !error && candidates.length === 0 && (
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="flex min-h-[280px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-center backdrop-blur-md"
                >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-zinc-400 shadow-inner">
                        <Users size={24} />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-white">
                        {hasActiveFilters ? "No matching candidates" : "No candidates found"}
                    </h3>
                    <p className="mt-1.5 max-w-sm text-xs text-zinc-400">
                        {hasActiveFilters
                            ? "No candidates matched your search criteria. Try adjusting your filters or search terms."
                            : "No resumes have been uploaded for this job yet."}
                    </p>
                    {hasActiveFilters && (
                        <button
                            onClick={handleReset}
                            className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-medium text-white transition hover:bg-white/[0.12] cursor-pointer"
                        >
                            <RotateCcw size={13} />
                            <span>Clear all filters</span>
                        </button>
                    )}
                </motion.div>
            )}

            {/* Candidate List & Pagination */}
            {!initialLoading && !error && candidates.length > 0 && (
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    <motion.div variants={fadeUp}>
                        <CandidateList
                            candidates={candidates}
                            jobId={jobId}
                            isSearching={isSearching}
                        />
                    </motion.div>

                    <motion.div variants={fadeUp}>
                        <Pagination
                            pagination={pagination}
                            onPageChange={setPage}
                            disabled={isSearching}
                            itemLabel="candidates"
                        />
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default JobCandidates;
