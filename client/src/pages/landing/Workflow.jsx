import {
  Briefcase,
  Upload,
  Brain,
  Trophy,
} from "lucide-react";
import Card from "../../components/common/Card";

const steps = [
  {
    number: "01",
    icon: Briefcase,
    title: "Create a Job",
    description:
      "Define the role, required skills, and hiring requirements.",
  },
  {
    number: "02",
    icon: Upload,
    title: "Upload Resumes",
    description:
      "Collect candidate resumes securely for the selected job posting.",
  },
  {
    number: "03",
    icon: Brain,
    title: "Run AI Analysis",
    description:
      "Analyze every resume and generate candidate scores with detailed insights.",
  },
  {
    number: "04",
    icon: Trophy,
    title: "Shortlist Candidates",
    description:
      "Review ranked candidates and move forward with confidence.",
  },
];

import { motion } from "framer-motion"
import { staggerContainer, fadeUp } from "../../utils/animations"

function Workflow() {
  return (
    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.9 }}>
      <section
        id="workflow"
        className="mx-auto max-w-7xl px-6 py-28"
      >
        <div className="mb-16 text-center">
          <h2 className="text-5xl font-semibold text-white">
            From resume to shortlist
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            A simple workflow that helps recruiters evaluate candidates
            faster without compromising hiring quality.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {steps.map(({ number, icon: Icon, title, description }) => (
            <motion.div
              key={number}
              variants={fadeUp}
              className="
              h-full
              transition-all duration-300
            "
            >
              <Card className="p-10 h-full">
                <span className="text-sm font-medium text-zinc-500 mr-3">
                  {number}
                </span>

                <div className="my-6 inline-flex rounded-2xl border border-zinc-700 bg-zinc-900 p-3">
                  <Icon size={24} />
                </div>

                <h3 className="text-2xl font-semibold text-white">
                  {title}
                </h3>

                <p className="mt-4 leading-7 text-zinc-400">
                  {description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

export default Workflow;