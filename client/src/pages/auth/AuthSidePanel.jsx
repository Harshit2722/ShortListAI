import Logo from "../../components/layout/Logo";

function AuthSidePanel() {
  return (
    <div className="relative hidden w-[45%] overflow-hidden border-r border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-[#181818] p-14 lg:flex lg:flex-col lg:justify-between">

      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-white/5 blur-[120px]" />

      <div className="relative z-10">

        <Logo />

        <h1 className="mt-14 text-5xl font-semibold leading-tight text-white">
          Hire smarter,
          <br />
          not harder.
        </h1>

        <p className="mt-8 max-w-md text-lg leading-8 text-zinc-400">
          Screen resumes, rank candidates, and make faster hiring
          decisions with AI-powered recruitment.
        </p>

      </div>

      <div className="relative z-10">

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">

          <p className="text-sm text-zinc-400">
            Recruiters save hours by letting Shortlist AI analyze
            resumes before the interview process begins.
          </p>

        </div>

        <p className="mt-8 text-sm text-zinc-600">
          © 2026 Shortlist AI
        </p>

      </div>

    </div>
  );
}

export default AuthSidePanel;