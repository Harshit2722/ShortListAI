const variants = {
  success:
    "bg-green-500/10 text-green-400 border-green-500/20",

  warning:
    "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

  danger:
    "bg-red-500/10 text-red-400 border-red-500/20",

  info:
    "bg-blue-500/10 text-blue-400 border-blue-500/20",

  neutral:
    "bg-zinc-800 text-zinc-300 border-zinc-700",
};

function Badge({
  children,
  variant = "neutral",
}) {
  return (
    <span
      className={`
        inline-flex
        rounded-full
        border
        px-3
        py-1
        text-xs
        font-medium
        ${variants[variant]}
      `}
    >
      {children}
    </span>
  );
}

export default Badge;