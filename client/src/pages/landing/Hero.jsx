import { ArrowRight} from "lucide-react";
import Button from "../../components/common/Button";
import { Link } from "react-router-dom";


function Hero() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-96px)] max-w-7xl flex-col items-center justify-center px-6 text-center">
      
      <h1 className="max-w-5xl text-5xl font-semibold leading-tight tracking-tight text-white md:text-7xl">
       Shortlist the right candidates
       <br />
       in minutes, not days.
      </h1>

      <p className="mt-8 max-w-3xl text-lg leading-8 text-zinc-400 md:text-xl">
       Upload resumes, identify the strongest candidates,
       and make hiring decisions faster with intelligent resume analysis.
      </p>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-4">

        <Link to="/register">
            <Button className="flex items-center gap-2">
            Get Started
            <ArrowRight size={18} />
            </Button>
        </Link>

        <a href="https://github.com/Harshit2722/ShortlistAI"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-zinc-700 px-7 py-3 text-white transition hover:border-zinc-500 hover:bg-zinc-900"
            >
            View GitHub
        </a>

      </div>

    </section>
  );
}

export default Hero;