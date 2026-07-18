import Link from "next/link";

type VehicleCardProps = {
  id: string;
  title: string;
  price: string;
  location: string;
  year: number;
  mileage: string;
  trust: number;
  badge?: string;
};

export function VehicleCard(props: VehicleCardProps) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-52 bg-gradient-to-br from-slate-200 to-slate-300">
        {props.badge ? (
          <span className="absolute right-4 top-4 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
            {props.badge}
          </span>
        ) : null}
        <button
          aria-label="إضافة إلى المفضلة"
          className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-2 text-lg shadow"
        >
          ♡
        </button>
      </div>

      <div className="p-5">
        <Link href={`/vehicles/${props.id}`} className="text-lg font-black hover:text-emerald-600">
          {props.title}
        </Link>

        <div className="mt-2 text-xl font-black text-emerald-600">{props.price}</div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-500">
          <span>السنة: {props.year}</span>
          <span>الممشى: {props.mileage}</span>
          <span>{props.location}</span>
          <span>الثقة: {props.trust}%</span>
        </div>
      </div>
    </article>
  );
}