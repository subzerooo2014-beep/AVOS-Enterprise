import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "glass";
};

export function AvosButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: Props) {
  const styles = {
    primary: "bg-emerald-700 text-white hover:bg-emerald-800",
    secondary: "border border-emerald-200 bg-white text-emerald-800",
    glass: "border border-white/50 bg-white/70 text-slate-900 backdrop-blur",
  };

  return (
    <button
      {...props}
      className={`rounded-2xl px-5 py-3 font-black transition ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}