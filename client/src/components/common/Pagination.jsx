import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ pagination, onPageChange, disabled = false }) => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const { page, limit, total, totalPages } = pagination;

    const getPageNumbers = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        if (page <= 3) return [1, 2, 3, 4, "...", totalPages];
        if (page >= totalPages - 2) return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, "...", page - 1, page, page + 1, "...", totalPages];
    };

    return (
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
            <p className="text-xs text-zinc-400">
                Showing <span className="font-semibold text-white">{(page - 1) * limit + 1}</span> to{" "}
                <span className="font-semibold text-white">{Math.min(page * limit, total)}</span> of{" "}
                <span className="font-semibold text-white">{total}</span> jobs
            </p>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1 || disabled}
                    className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-md transition duration-200 hover:border-white/25 hover:bg-white/[0.08] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                    <ChevronLeft size={15} />
                    <span>Previous</span>
                </button>

                <div className="flex items-center gap-1">
                    {getPageNumbers().map((p, idx) =>
                        p === "..." ? (
                            <span key={`dots-${idx}`} className="px-2 text-xs text-zinc-500">
                                ...
                            </span>
                        ) : (
                            <button
                                key={p}
                                onClick={() => onPageChange(p)}
                                disabled={disabled}
                                className={`h-8 min-w-8 px-2 rounded-xl text-xs font-medium transition duration-200 cursor-pointer ${
                                    p === page
                                        ? "bg-white text-zinc-950 font-semibold shadow-lg shadow-white/10"
                                        : "border border-white/10 bg-white/[0.04] text-zinc-400 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                                }`}
                            >
                                {p}
                            </button>
                        )
                    )}
                </div>

                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages || disabled}
                    className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-md transition duration-200 hover:border-white/25 hover:bg-white/[0.08] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                    <span>Next</span>
                    <ChevronRight size={15} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
