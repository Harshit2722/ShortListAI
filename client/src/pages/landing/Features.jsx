import {
  Brain,
  Briefcase,
  Trophy,
  ShieldCheck,
  FileSearch,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Resume Analysis",
    description:
      "Extract skills, experience, projects, education, and evaluate every resume automatically.",
  },
  {
    icon: Briefcase,
    title: "Job Management",
    description:
      "Create, update, and manage job postings from a single recruiter dashboard.",
  },
  {
    icon: Trophy,
    title: "Candidate Ranking",
    description:
      "Rank applicants based on job requirements and AI-generated candidate scores.",
  },
  {
    icon: FileSearch,
    title: "Duplicate Detection",
    description:
      "Prevent duplicate resume submissions using secure SHA-256 file hashing.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by Design",
    description:
      "JWT authentication, HTTP-only cookies, validation, and secure file handling built in.",
  },
  {
    icon: BarChart3,
    title: "Hiring Insights",
    description:
      "Get structured candidate summaries and recommendations to speed up hiring decisions.",
  },
];

function Features() {
  return (
    <section
      id="features"
      className="mx-auto max-w-7xl px-6 py-28"
    >
      <div className="mb-16 text-center">
        <h2 className="text-5xl font-semibold text-white">
          Everything you need to hire faster
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-400">
          From creating jobs to AI-powered candidate evaluation,
          Shortlist AI simplifies every step of the recruitment process.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-3xl border border-zinc-800 bg-[#181818] p-8 transition duration-300 hover:-translate-y-2 hover:border-zinc-600 hover:shadow-[0_15px_40px_rgba(255,255,255,0.05)] transition-all duration-300"
          >
            <div className="mb-8 inline-flex rounded-2xl border border-zinc-700 bg-zinc-900 p-3">
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

export default Features;