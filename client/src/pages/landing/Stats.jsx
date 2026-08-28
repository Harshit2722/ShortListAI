function Stats() {
  const stats = [
    {
      value: "10×",
      label: "Faster candidate screening",
    },
    {
      value: "AI",
      label: "Resume analysis & scoring",
    },
    {
      value: "<60s",
      label: "From upload to shortlist",
    },
  ];

  return (
    <section className="pb-28 px-6">
      <div className="mx-auto grid max-w-6xl grid-cols-1 overflow-hidden rounded-3xl border border-zinc-800 md:grid-cols-3">

        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border-b border-zinc-800 bg-white/[0.03] backdrop-blur-lg p-10 text-center transition duration-300 hover:bg-zinc-900 md:border-b-0 md:border-r last:border-r-0"
          >
            <h3 className="text-4xl font-semibold text-white">
              {stat.value}
            </h3>

            <p className="mt-3 text-zinc-400">
              {stat.label}
            </p>
          </div>
        ))}

      </div>
    </section>
  );
}

export default Stats;