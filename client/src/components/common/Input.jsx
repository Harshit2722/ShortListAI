
function Input({
  label,
  error,
  className = "",
  endElement,
  ...props
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-zinc-200">
          {label}
        </label>
      )}

      <div className="relative w-full">
        <input
          className={`
            w-full
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
            ${endElement ? "pr-11" : ""}
            ${className}
          `}
          {...props}
        />
        {endElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center text-zinc-400">
            {endElement}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;