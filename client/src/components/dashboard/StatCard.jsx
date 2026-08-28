import Card from "../common/Card";

const StatCard = ({
    title,
    value,
    icon: Icon,
    subtitle,
    badge,
    badgeVariant = "info",
    className = ""
}) => {
    return (
        <Card className={`p-6 sm:p-7 ${className}`}>
            <div className="flex items-center justify-between">
                {Icon && (
                    <div className="inline-flex rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-zinc-200 backdrop-blur-md transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/[0.1] group-hover:text-white">
                        <Icon size={22} />
                    </div>
                )}

                {badge && (
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs font-medium text-zinc-300">
                        {badge}
                    </span>
                )}
            </div>

            <div className="mt-5">
                <p className="text-sm font-medium text-zinc-400">
                    {title}
                </p>

                <h3 className="mt-1.5 text-3xl font-semibold tracking-tight text-white lg:text-4xl">
                    {value ?? 0}
                </h3>

                {subtitle && (
                    <p className="mt-2.5 flex items-center gap-1.5 text-xs text-zinc-400">
                        {subtitle}
                    </p>
                )}
            </div>
        </Card>
    );
};

export default StatCard;