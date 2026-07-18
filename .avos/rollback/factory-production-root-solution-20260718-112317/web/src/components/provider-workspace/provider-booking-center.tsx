"use client";

import Link from "next/link";
import { providerBookings, providerBranches, providerStaff } from "@/data/provider-workspace";
import { useProviderWorkspaceStore } from "@/store/provider-workspace-store";

const statusLabels = {
  confirmed: "مؤكد",
  waiting: "انتظار",
  "in-progress": "قيد التنفيذ",
  completed: "مكتمل",
  cancelled: "ملغي",
} as const;

export function ProviderBookingCenter() {
  const branchId = useProviderWorkspaceStore((state) => state.activeBranchId);
  const status = useProviderWorkspaceStore((state) => state.bookingStatus);
  const query = useProviderWorkspaceStore((state) => state.bookingQuery);
  const setActiveBranch = useProviderWorkspaceStore((state) => state.setActiveBranch);
  const setBookingStatus = useProviderWorkspaceStore((state) => state.setBookingStatus);
  const setBookingQuery = useProviderWorkspaceStore((state) => state.setBookingQuery);
  const rescheduledBookings = useProviderWorkspaceStore((state) => state.rescheduledBookings);
  const cancelledBookings = useProviderWorkspaceStore((state) => state.cancelledBookings);
  const rescheduleBooking = useProviderWorkspaceStore((state) => state.rescheduleBooking);
  const cancelBooking = useProviderWorkspaceStore((state) => state.cancelBooking);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleBookings = providerBookings.filter((booking) => {
    const effectiveStatus = cancelledBookings.includes(booking.id) ? "cancelled" : booking.status;
    const matchesBranch = branchId === "all" || booking.branchId === branchId;
    const matchesStatus = status === "all" || effectiveStatus === status;
    const matchesQuery = !normalizedQuery || [booking.id, booking.customer, booking.vehicle, booking.service]
      .join(" ").toLowerCase().includes(normalizedQuery);
    return matchesBranch && matchesStatus && matchesQuery;
  });

  const confirmed = providerBookings.filter((booking) => booking.status === "confirmed").length;
  const waiting = providerBookings.filter((booking) => booking.status === "waiting").length;
  const inProgress = providerBookings.filter((booking) => booking.status === "in-progress").length;
  const revenue = providerBookings.filter((booking) => booking.status !== "cancelled").reduce((sum, booking) => sum + booking.value, 0);

  return (
    <div className="provider-booking-center">
      <section className="booking-center-hero">
        <div>
          <span>AVOS Booking Engine V2</span>
          <h1>إدارة الحجوزات والطوابير بذكاء</h1>
          <p>تحكم في التأكيد وإعادة الجدولة والإلغاء وتوزيع الفنيين من مركز واحد.</p>
        </div>
        <Link href="/provider-workspace" className="button button-secondary">العودة لمساحة المزود</Link>
      </section>

      <section className="booking-center-kpis">
        <article><span>الحجوزات المؤكدة</span><strong>{confirmed}</strong><small>جاهزة للتنفيذ</small></article>
        <article><span>قائمة الانتظار</span><strong>{waiting}</strong><small>تحتاج توزيعًا سريعًا</small></article>
        <article><span>قيد التنفيذ</span><strong>{inProgress}</strong><small>مهام فعالة الآن</small></article>
        <article><span>قيمة الحجوزات</span><strong>{revenue.toLocaleString("ar-AE")} د.إ</strong><small>إجمالي القيمة الحالية</small></article>
      </section>

      <section className="booking-center-controls">
        <input value={query} onChange={(event) => setBookingQuery(event.target.value)} placeholder="ابحث بالعميل أو السيارة أو رقم الحجز" />
        <select value={branchId} onChange={(event) => setActiveBranch(event.target.value)}>
          <option value="all">جميع الفروع</option>
          {providerBranches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
        </select>
        <select value={status} onChange={(event) => setBookingStatus(event.target.value as typeof status)}>
          <option value="all">جميع الحالات</option>
          <option value="confirmed">مؤكد</option>
          <option value="waiting">انتظار</option>
          <option value="in-progress">قيد التنفيذ</option>
          <option value="completed">مكتمل</option>
          <option value="cancelled">ملغي</option>
        </select>
      </section>

      <section className="booking-center-list">
        {visibleBookings.map((booking) => {
          const isCancelled = cancelledBookings.includes(booking.id);
          const effectiveStatus = isCancelled ? "cancelled" : booking.status;
          const newTime = rescheduledBookings[booking.id];
          const staff = providerStaff.find((member) => member.id === booking.staffId);
          const branch = providerBranches.find((item) => item.id === booking.branchId);
          return (
            <article key={booking.id} className="booking-center-card">
              <div className="booking-time-block"><strong>{newTime ?? booking.time}</strong><span>{booking.date}</span></div>
              <div className="booking-main-info"><b>{booking.customer}</b><span>{booking.vehicle}</span><small>{booking.service}</small></div>
              <div className="booking-assignment"><span>{branch?.name}</span><strong>{staff?.name ?? "لم يعيّن فني"}</strong></div>
              <b className={`booking-status ${effectiveStatus}`}>{statusLabels[effectiveStatus]}</b>
              <strong className="booking-value">{booking.value.toLocaleString("ar-AE")} د.إ</strong>
              <div className="booking-actions">
                <button type="button" disabled={isCancelled} onClick={() => rescheduleBooking(booking.id, booking.time === "10:30" ? "12:00" : "16:00")}>إعادة جدولة</button>
                <button type="button" className="danger" disabled={isCancelled} onClick={() => cancelBooking(booking.id)}>إلغاء</button>
              </div>
            </article>
          );
        })}
        {visibleBookings.length === 0 ? <div className="provider-empty-state">لا توجد حجوزات مطابقة للفلاتر الحالية.</div> : null}
      </section>

      <section className="booking-ai-queue">
        <div><span>AI Queue Optimizer</span><h2>توصيات الطابور الذكي</h2></div>
        <article><strong>نقل حجز PB-1025</strong><p>فرع الشارقة يملك سعة أفضل ويمكن تقليل الانتظار 19 دقيقة.</p></article>
        <article><strong>توزيع فني إضافي</strong><p>أضف فني كهرباء في دبي بين 16:00 و19:00 لتفادي التأخير.</p></article>
        <article><strong>موعد بديل ذكي</strong><p>أفضل موعد متاح للحجوزات الجديدة اليوم هو 14:30.</p></article>
      </section>
    </div>
  );
}
