import { motion } from "framer-motion";

const getColorClasses = (score) => {
    // 7.0 - 10.0: Green (Strong / Excellent)
    if (score >= 7) {
        return {
            text: "text-emerald-400",
            bg: "bg-emerald-500",
            glow: "shadow-[0_0_12px_rgba(52,211,153,0.3)]"
        };
    }
    // 4.0 - 6.9: Amber (Average / Moderate)
    if (score >= 4) {
        return {
            text: "text-amber-400",
            bg: "bg-amber-500",
            glow: "shadow-[0_0_12px_rgba(251,191,36,0.3)]"
        };
    }
    // 0.0 - 3.9: Red (Poor / Weak)
    return {
        text: "text-rose-400",
        bg: "bg-rose-500",
        glow: "shadow-[0_0_12px_rgba(244,63,94,0.3)]"
    };
};

const ScoreProgress = ({ label, score = 0, max = 10, icon: Icon }) => {
    const numScore = Number(score) || 0;
    const percentage = Math.min(100, Math.max(0, (numScore / max) * 100));
    const colors = getColorClasses(numScore);

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                    {Icon && <Icon size={13} className="text-zinc-500 shrink-0" />}
                    <span>{label}</span>
                </span>
                <span className="font-semibold tabular-nums">
                    <span className={colors.text}>{numScore.toFixed(1)}</span>
                    <span className="text-zinc-500 text-[10px]">/{max}</span>
                </span>
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
    );
};

export default ScoreProgress;
