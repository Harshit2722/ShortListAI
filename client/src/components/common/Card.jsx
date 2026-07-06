
function Card({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900
        p-6
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;