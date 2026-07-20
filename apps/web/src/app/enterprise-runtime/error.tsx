"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="ueap-page">
      <h1>تعذر تحميل Enterprise Runtime</h1>
      <button type="button" onClick={reset}>إعادة المحاولة</button>
    </main>
  );
}
