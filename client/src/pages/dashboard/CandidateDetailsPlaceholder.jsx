import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, User, Mail, Calendar, FileText, CheckCircle2 } from "lucide-react";
import { getCandidateById } from "../../api/candidate.api";
import Card from "../../components/common/Card";
import Badge from "../../components/ui/Badge";
import Loader from "../../components/ui/Loader";
import { fadeUp } from "../../utils/animations";

const CandidateDetailsPlaceholder = () => {
    const { jobId, candidateId } = useParams();
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                setLoading(true);
                const { data } = await getCandidateById(jobId, candidateId);
                setCandidate(data);
            } catch (err) {
                console.error("Failed to load candidate details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCandidate();
    }, [jobId, candidateId]);

    if (loading) {
        return <Loader title="Loading Candidate" subtitle="Fetching candidate details..." />;
    }

    const candidateInfo = candidate?.candidate || {};
    const analysis = candidate?.analysis || {};

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Back to Candidates */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <Link
                    to={`/jobs/${jobId}/candidates`}
                    className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition duration-200"
                >
                    <ArrowLeft size={15} />
                    <span>Back to Candidates</span>
                </Link>
            </motion.div>

            {/* Candidate Header Card */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <Card className="p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                                    {candidateInfo.name || "Candidate Profile"}
                                </h1>
                                {analysis.recommendation && (
                                    <Badge variant="success">{analysis.recommendation}</Badge>
                                )}
                            </div>
                            <p className="mt-1 text-sm text-zinc-400">
                                Candidate ID: <span className="font-mono text-xs text-zinc-300">{candidateId}</span>
                            </p>
                        </div>

                        {analysis.overallScore != null && (
                            <div className="flex items-baseline gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 self-start">
                                <span className="text-xs text-zinc-400 uppercase font-medium">Score</span>
                                <span className="text-2xl font-bold text-emerald-400">
                                    {Number(analysis.overallScore).toFixed(1)}
                                </span>
                                <span className="text-xs text-zinc-500">/10</span>
                            </div>
                        )}
                    </div>

                    {/* Basic details */}
                    <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-300">
                        {candidateInfo.email && (
                            <div className="flex items-center gap-2">
                                <Mail size={14} className="text-zinc-500" />
                                <span>{candidateInfo.email}</span>
                            </div>
                        )}
                        {candidate?.createdAt && (
                            <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-zinc-500" />
                                <span>Applied on {new Date(candidate.createdAt).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                </Card>
            </motion.div>

            {/* AI Analysis Placeholder Notice */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-12 text-center backdrop-blur-md">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white shadow-inner">
                        <Sparkles size={24} className="text-amber-300" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">AI Analysis View Coming Soon</h3>
                    <p className="mt-2 max-w-md text-xs sm:text-sm text-zinc-400">
                        The detailed AI evaluation breakdown, skill gap radar, and recruiter notes interface will be built in the next step.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default CandidateDetailsPlaceholder;
