export function VehicleShowcase() {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(145deg,#ffffff,#edf8f4)] p-8 shadow-[0_28px_80px_rgba(16,35,31,0.14)]">
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-emerald-100/70 to-transparent" />
      <div className="relative mx-auto h-64 max-w-2xl rounded-[32px] bg-[linear-gradient(160deg,#dbe6e2,#f9fbfa)]">
        <div className="absolute inset-x-16 bottom-8 h-24 rounded-[50%] bg-slate-300/70 blur-xl" />
        <div className="absolute inset-x-20 bottom-14 h-24 rounded-[40px] bg-gradient-to-r from-slate-500 via-slate-700 to-slate-500 shadow-2xl" />
        <div className="absolute left-24 bottom-8 h-12 w-12 rounded-full border-8 border-slate-800 bg-slate-300" />
        <div className="absolute right-24 bottom-8 h-12 w-12 rounded-full border-8 border-slate-800 bg-slate-300" />
      </div>
    </div>
  );
}