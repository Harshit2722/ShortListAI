import { ArrowUpRight } from "lucide-react";

function FooterSection() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-16">
        <div className="max-w-2xl text-center">

          <h2 className="text-5xl font-bold tracking-tight text-white">
            Shortlist AI
          </h2>

          <p className="mt-5 text-[15px] leading-7 text-zinc-400">
            Analyze resumes faster, identify top candidates, and make smarter hiring decisions with AI-powered resume analysis.
          </p>

          <p className="mt-10 text-sm text-zinc-500">
            Built by{" "}
            <a
              href="https://github.com/Harshit2722"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-zinc-200 transition-all hover:text-white hover:underline"
            >
              Harshit Pushkarna
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </p>

          <p className="mt-4 text-xs tracking-wide text-zinc-600">
            © {new Date().getFullYear()} Shortlist AI. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}

export default FooterSection;