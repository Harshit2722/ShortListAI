
import { Briefcase, Plus } from "lucide-react";
import Button from "../../components/common/Button";

const Jobs = () => {
    return (
        <div>
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-white lg:text-4xl">
                        Job Postings
                    </h1>
                    <p className="mt-2 text-sm text-zinc-400 lg:text-base">
                        Manage active job openings, view applicants, and screen resumes.
                    </p>
                </div>

                <Button className="flex items-center gap-2">
                    <Plus size={16} />
                    <span>Create Job</span>
                </Button>
            </div>

            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center backdrop-blur-xl shadow-2xl">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-zinc-400 shadow-inner">
                    <Briefcase size={28} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">No active job postings</h3>
                <p className="mt-2 max-w-sm text-sm text-zinc-400">
                    Create a new job posting to start uploading candidate resumes and scoring match percentages.
                </p>
            </div>
        </div>
    );
};

export default Jobs;