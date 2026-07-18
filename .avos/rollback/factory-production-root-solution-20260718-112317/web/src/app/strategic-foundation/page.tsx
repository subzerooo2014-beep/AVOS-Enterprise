const foundations = [
  "Core Platform",
  "Business Foundation",
  "Governance Foundation",
  "Executive Foundation",
  "Growth Foundation",
  "Trust Foundation",
];

const rules = [
  "Align with the five AVOS constitutions",
  "Create value across multiple industries",
  "Build on the current foundation",
  "Preserve scalability and governance",
  "Prevent uncontrolled complexity",
];

export default function StrategicFoundationPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-medium text-neutral-500">
        AVOS Enterprise
      </p>
      <h1 className="mt-2 text-3xl font-bold">
        Strategic Foundation Execution
      </h1>
      <p className="mt-3 max-w-4xl text-neutral-600">
        Shared strategic execution layer governing all future industries,
        capabilities, and enterprise expansion.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {foundations.map((foundation) => (
          <article key={foundation} className="rounded-2xl border p-5">
            <h2 className="font-semibold">{foundation}</h2>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border p-6">
        <h2 className="text-xl font-semibold">
          Future Development Admission Rules
        </h2>
        <ul className="mt-4 space-y-2 text-neutral-600">
          {rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}