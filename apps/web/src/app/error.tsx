'use client';

export default function ErrorPage({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <main className="state-page">
      <span className="eyebrow">AVOS Error Boundary</span>
      <h1>حدث خطأ غير متوقع</h1>
      <button
        className="button button-primary"
        onClick={reset}
        type="button"
      >
        المحاولة مرة أخرى
      </button>
    </main>
  );
}