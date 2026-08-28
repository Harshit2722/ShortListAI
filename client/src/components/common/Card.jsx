
function Card({ children, className = "" }) {
  return (
    <div
      className={`
        group
        relative overflow-hidden

        rounded-[30px]

        border border-white/15
        bg-white/[0.035]
        backdrop-blur-lg

        transition-all duration-300 ease-out

        hover:-translate-y-1
        hover:border-white/45
        hover:bg-white/[0.02]
        hover:shadow-[0_12px_28px_rgba(255,255,255,0.08)]

        ${className}
      `}
    >
      <div
        className="
          absolute inset-0
          rounded-[30px]
          bg-gradient-to-b
          from-white/[0.03]
          via-transparent
          to-transparent
          pointer-events-none
          z-0
        "
      />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default Card;