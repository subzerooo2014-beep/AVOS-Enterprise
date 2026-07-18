export default function TransactionLifecyclePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-medium text-neutral-500">AVOS Enterprise</p>
      <h1 className="mt-2 text-3xl font-bold">
        Transaction & Ownership Lifecycle
      </h1>
      <p className="mt-3 max-w-4xl text-neutral-600">
        End-to-end reservation, identity, inspection, contracting, escrow,
        ownership transfer, delivery, disputes, after-sales, and trade-in.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Reservation Engine</h2>
          <p className="mt-2 text-sm text-neutral-600">holds, deposits, expiry, availability, buyer-lock, seller-confirmation, cancellation, audit.</p>
        </article>
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Identity & KYC</h2>
          <p className="mt-2 text-sm text-neutral-600">identity-check, document-check, liveness, sanctions, pep, risk-score, consent, audit.</p>
        </article>
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Inspection & Certification</h2>
          <p className="mt-2 text-sm text-neutral-600">booking, checklist, media, diagnostics, grading, certificate, reinspection, audit.</p>
        </article>
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Contracting & E-Sign</h2>
          <p className="mt-2 text-sm text-neutral-600">templates, clauses, offers, acceptance, esign, versioning, witness, audit.</p>
        </article>
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Escrow & Settlement</h2>
          <p className="mt-2 text-sm text-neutral-600">funding, holds, release, split, fees, refund, reconciliation, audit.</p>
        </article>
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Ownership Transfer</h2>
          <p className="mt-2 text-sm text-neutral-600">eligibility, documents, fees, government-submit, status, approval, handover, audit.</p>
        </article>
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Delivery & Handover</h2>
          <p className="mt-2 text-sm text-neutral-600">pickup, delivery, tracking, handover-checklist, signature, proof, exceptions, audit.</p>
        </article>
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Digital Vehicle Passport</h2>
          <p className="mt-2 text-sm text-neutral-600">identity, history, inspection, ownership, service, insurance, export, audit.</p>
        </article>
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Dispute Resolution</h2>
          <p className="mt-2 text-sm text-neutral-600">case-open, evidence, mediation, decision, refund, appeal, sla, audit.</p>
        </article>
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">After-Sales Care</h2>
          <p className="mt-2 text-sm text-neutral-600">warranty, service-plan, reminders, support, claims, retention, feedback, audit.</p>
        </article>
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Trade-In Engine</h2>
          <p className="mt-2 text-sm text-neutral-600">valuation, condition, offer, balance, settlement, inventory, handover, audit.</p>
        </article>
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Transaction Command Center</h2>
          <p className="mt-2 text-sm text-neutral-600">pipeline, risk, approvals, revenue, exceptions, sla, alerts, forecast.</p>
        </article>
      </section>
    </main>
  );
}