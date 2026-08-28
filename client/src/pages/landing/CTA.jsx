import { ArrowRight } from "lucide-react";
import Button from "../../components/common/Button";
import { fadeUp } from "../../utils/animations";
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa6";

function CTA() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      <section className="px-6 py-28">
        <div className=" relative overflow-hidden mx-auto max-w-6xl rounded-[32px] border border-white/15 bg-white/[0.035] backdrop-blur-lg px-12 py-18 text-center transition-all duration-300 hover:border-white/30 hover:shadow-[0_10px_30px_rgba(255,255,255,0.08)]"
        >

          <div className=" absolute inset-0 rounded-[32px] bg-gradient-to-b from-white/[0.03] via-transparent to-transparent pointer-events-none z-0" />

          <h2 className="text-5xl font-semibold text-white">
            Ready to hire smarter?
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
            Stop manually reviewing hundreds of resumes. Let AI rank your
            candidates in minutes so you can spend time interviewing the right
            people.
          </p>

          <div className="mt-12 flex justify-center">

            <Link to="/register">
              <Button className="flex items-center gap-2 px-7 py-3 text-base">
                Get Started
                <ArrowRight size={18} />
              </Button>
            </Link>

          </div>

          <div className="my-16 h-px bg-white/10" />

          <h3 className="text-xl font-semibold text-white">
            Let's Connect
          </h3>

          <p className="mt-3 text-zinc-400">
            Questions, feedback, or interested in collaborating?
          </p>

          <div className="mt-8 flex justify-center gap-5">

            <a
              href="mailto:harshitpushkarnais@email.com"
              className="flex items-center gap-2 transition hover:text-white"
            >
              <FaEnvelope size={24} />
            </a>

            <a
              href="https://www.linkedin.com/in/harshit-pushkarna/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition hover:text-white"
            >
              <FaLinkedin size={24} />
            </a>

            <a
              href="https://github.com/Harshit2722/ShortlistAI"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition hover:text-white"
            >
              <FaGithub size={24} />
            </a>

          </div>

        </div>
      </section>
    </motion.div>
  );
}

export default CTA;