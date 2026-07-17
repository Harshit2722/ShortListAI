const variants = {
  primary:
"bg-gradient-to-b from-white to-zinc-100 text-zinc-950 font-semibold border border-zinc-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_0_0_1px_rgba(255,255,255,0.15)_inset] hover:bg-zinc-100 hover:shadow-lg",

  secondary:
"border border-white/15 bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-lg text-zinc-300 hover:border-white/25 hover:text-white hover:bg-white/[0.05] hover:shadow-[0_8px_20px_rgba(255,255,255,0.08)]",

danger:
"bg-gradient-to-b from-red-500 to-red-600 border border-red-500 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] hover:from-red-600 hover:to-red-700 hover:shadow-[0_12px_24px_-10px_rgba(239,68,68,0.35),inset_0_1px_0_0_rgba(255,255,255,0.25)]",

  ghost:
"bg-transparent text-zinc-400 hover:bg-white/[0.04] hover:text-white",
};

function Button({
  children,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-xl
        px-5
        py-2.5
        text-sm
        font-medium
        transition duration-300 ease-out
        cursor-pointer
        active:scale-[0.98]
        hover:-translate-y-[1px]
        disabled:cursor-not-allowed
        disabled:opacity-50
        disabled:pointer-events-none
        disabled:transform-none
        disabled:shadow-none
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;