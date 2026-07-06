import { ArrowRight} from "lucide-react";
import Button from "../../components/common/Button";

function CTA() {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-zinc-800 bg-gradient-to-b from-[#1d1d1d] to-[#171717] px-12 py-18 text-center">

        <h2 className="text-5xl font-semibold text-white">
          Ready to hire smarter?
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
          Stop manually reviewing hundreds of resumes. Let AI rank your
          candidates in minutes so you can spend time interviewing the right
          people.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-5">

          <a href="/register">
            <Button className="flex items-center gap-2">
              Get Started
              <ArrowRight size={18} />
            </Button>
          </a>

        </div>

        <div className="my-14 h-px bg-zinc-800" />

        <p className="mb-8 text-zinc-400">
          Questions or feedback?
        </p>

        <div className="flex flex-wrap justify-center gap-8 text-zinc-300">

          <a
            href="mailto:harshitpushkarnais@email.com"
            className="flex items-center gap-2 transition hover:text-white"
          >
            Email
          </a>

          <a
            href="https://www.linkedin.com/in/harshit-pushkarna/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition hover:text-white"
          >
            LinkedIn
          </a>

          <a
            href="https://github.com/Harshit2722/ShortlistAI"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition hover:text-white"
          >
            GitHub
          </a>

        </div>

      </div>
    </section>
  );
}

export default CTA;