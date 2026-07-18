export function ReviewCard({
  name,
  rating,
  comment,
}: {
  name: string;
  rating: number;
  comment: string;
}) {
  return (
    <article className="rounded-3xl border bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-black">{name}</h3>
        <div className="text-amber-500">{"★".repeat(rating)}</div>
      </div>
      <p className="mt-3 leading-7 text-slate-600">{comment}</p>
    </article>
  );
}