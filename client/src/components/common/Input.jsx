
function Input({
  label,
  error,
  className = "",
  ...props
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-zinc-200">
          {label}
        </label>
      )}

      <input
        className={`
          rounded-xl
          border
          border-zinc-700
          bg-zinc-900
          px-4
          py-3
          text-white
          placeholder:text-zinc-500
          outline-none
          transition-all
          focus:border-white
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;