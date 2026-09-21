import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown} from "lucide-react";

const getColorClasses = (score) => {
    // 7.0 - 10.0: Green (Strong / Excellent)
    if (score >= 7) {
        return {
            text: "text-emerald-400",
            bg: "bg-emerald-500",
            glow: "shadow-[0_0_12px_rgba(52,211,153,0.3)]",
            badge: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
        };
    }
    // 4.0 - 6.9: Amber (Average / Moderate)
    if (score >= 4) {
        return {
            text: "text-amber-400",
            bg: "bg-amber-500",
            glow: "shadow-[0_0_12px_rgba(251,191,36,0.3)]",
            badge: "border-amber-500/20 bg-amber-500/10 text-amber-300"
        };
    }
    // 0.0 - 3.9: Red (Poor / Weak)
    return {
        text: "text-rose-400",
        bg: "bg-rose-500",
        glow: "shadow-[0_0_12px_rgba(244,63,94,0.3)]",
        badge: "border-rose-500/20 bg-rose-500/10 text-rose-300"
    };
};

const ScoreProgress = ({ label, score = 0, max = 10, icon: Icon, reason = "" }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const numScore = Number(score) || 0;
    const percentage = Math.min(100, Math.max(0, (numScore / max) * 100));
    const colors = getColorClasses(numScore);

    return (
        <div
            onClick={() => setIsExpanded(prev => !prev)}
            className="group cursor-pointer rounded-xl p-2 -m-2 transition-colors duration-200 hover:bg-white/[0.04] select-none"
            title="Click to view AI reasoning"
        >
            <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-zinc-300 group-hover:text-white transition-colors">
                        {Icon && <Icon size={13} className="text-zinc-500 group-hover:text-zinc-400 transition-colors shrink-0" />}
                        <span>{label}</span>
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold tabular-nums">
                            <span className={colors.text}>{numScore.toFixed(1)}</span>
                            <span className="text-zinc-500 text-[10px]">/{max}</span>
                        </span>
                        <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-zinc-500 group-hover:text-zinc-300"
                        >
                            <ChevronDown size={13} />
                        </motion.div>
                    </div>
                </div>

                {/* Track remains clearly visible with high contrast border even when score is 0.0 */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800/90 border border-white/10 p-[1px]">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className={`h-full rounded-full ${colors.bg} ${colors.glow}`}
                    />
                </div>
            </div>

            {/* Expandable Explanation Accordion */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="mt-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs leading-relaxed text-zinc-300 shadow-inner flex items-start gap-2.5">
                            <div className="space-y-1">
                                <p className="text-zinc-200">
                                    {reason ? reason : "Evaluation based on candidate skills, experience, and job requirements match."}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ScoreProgress;
