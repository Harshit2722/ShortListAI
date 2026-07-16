import { ArrowRight } from "lucide-react";
import Button from "../../components/common/Button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeUp } from "../../utils/animations";
import ShinyText from "../../components/common/ShinyText";


function Hero() {
  return (
    <section className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 text-center">

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative flex flex-col items-center"
      >
        <div
          className="
            absolute
            left-1/2
            top-[35%]
            -translate-x-1/2
            -translate-y-1/2

            h-[320px] w-[520px]
            md:h-[420px] md:w-[700px]

            rounded-full
            bg-indigo-200/[0.18]

            blur-[120px]
            md:blur-[140px]
            -z-10
          "
        />

        <h1 className="max-w-5xl text-5xl font-semibold leading-tight tracking-tight text-white md:text-7xl">
          Shortlist the right candidates
          <br />
          <ShinyText
            text="in minutes, not days."
            speed={1.74}
            color="#d6d6d6e4"
            shineColor="#ffffffff"
          />
        </h1>

        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-400 md:text-xl">
          Upload resumes, identify the strongest candidates,
          and make hiring decisions faster with intelligent resume analysis.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">

          <Link to="/register">
            <Button className="flex items-center gap-2">
              Get Started
              <ArrowRight size={16} />
            </Button>
          </Link>

          <a href="https://github.com/Harshit2722/ShortlistAI"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" className="px-7">
              View GitHub
            </Button>
          </a>

        </div>

      </motion.div>

    </section>
  );
}

export default Hero;