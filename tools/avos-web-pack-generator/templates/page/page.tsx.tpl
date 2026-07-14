import { {{ComponentName}} } from "./components/{{componentFile}}";

export default function {{PageComponent}}Page() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-black">{{Title}}</h1>
        <p className="mt-3 text-slate-600">{{Description}}</p>
        <div className="mt-8">
          <{{ComponentName}} />
        </div>
      </div>
    </main>
  );
}