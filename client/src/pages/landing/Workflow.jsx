import {
  Briefcase,
  Upload,
  Brain,
  Trophy,
} from "lucide-react";

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

function Workflow() {
  return (
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
          <div
            key={number}
            className="rounded-3xl border border-zinc-800 bg-[#181818] p-8 transition duration-300 hover:-translate-y-2 hover:border-zinc-600 hover:shadow-[0_15px_40px_rgba(255,255,255,0.05)] transition-all duration-300"
          >
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
          </div>
        ))}
      </div>
    </section>
  );
}

export default Workflow;