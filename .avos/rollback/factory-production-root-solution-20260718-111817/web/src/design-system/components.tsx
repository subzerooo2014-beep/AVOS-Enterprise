import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";

export function AvosButton(
  props: ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const { className = "", ...rest } = props;

  return (
    <button
      className={[
        "inline-flex min-h-11 items-center justify-center rounded-xl",
        "bg-blue-700 px-5 py-3 font-semibold text-white",
        "transition hover:bg-blue-800 focus:outline-none",
        "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      ].join(" ")}
      {...rest}
    />
  );
}

export function AvosCard(
  props: HTMLAttributes<HTMLElement>,
) {
  const { className = "", ...rest } = props;

  return (
    <article
      className={[
        "rounded-2xl border border-slate-200 bg-white p-6",
        "shadow-[0_8px_24px_rgba(15,23,42,0.08)]",
        className,
      ].join(" ")}
      {...rest}
    />
  );
}

export function AvosInput(
  props: InputHTMLAttributes<HTMLInputElement>,
) {
  const { className = "", ...rest } = props;

  return (
    <input
      className={[
        "min-h-11 w-full rounded-xl border border-slate-300",
        "bg-white px-4 py-3 text-slate-900 outline-none",
        "transition focus:border-blue-600 focus:ring-2",
        "focus:ring-blue-200 disabled:opacity-50",
        className,
      ].join(" ")}
      {...rest}
    />
  );
}

export function AvosBadge({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-800">
      {children}
    </span>
  );
}

export function AvosMetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <AvosCard>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>
      {detail ? (
        <p className="mt-2 text-sm text-slate-600">{detail}</p>
      ) : null}
    </AvosCard>
  );
}