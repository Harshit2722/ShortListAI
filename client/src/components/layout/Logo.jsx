import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-700 bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-lg">
        <span className="text-xl font-bold">S</span>
      </div>

      <div className="flex flex-col leading-none">
        <span className="text-base font-semibold text-white">
          Shortlist AI
        </span>

        <span className="text-xs text-zinc-500">
          Recruitment Assistant
        </span>
      </div>
    </Link>
  );
}

export default Logo;