const variants = {
  primary:
    "bg-white text-black hover:bg-zinc-200",

  secondary:
    "bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800",

  danger:
    "bg-red-600 text-white hover:bg-red-700",

  ghost:
    "bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white",
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
        transition-all
        cursor-pointer
        duration-200
        disabled:cursor-not-allowed
        disabled:opacity-50
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