"use client";

import Link from "next/link";
import { providerAiInsights, providerBookings, providerBranches, providerStaff } from "@/data/provider-workspace";
import { useProviderWorkspaceStore } from "@/store/provider-workspace-store";

const statusLabels = {
  confirmed: "مؤكد",
  waiting: "انتظار",
  "in-progress": "قيد التنفيذ",
  completed: "مكتمل",
  cancelled: "ملغي",
} as const;

export function ProviderWorkspaceDashboard() {
  const activeBranchId = useProviderWorkspaceStore((state) => state.activeBranchId);
  const selectedDate = useProviderWorkspaceStore((state) => state.selectedDate);
  const setActiveBranch = useProviderWorkspaceStore((state) => state.setActiveBranch);
  const setSelectedDate = useProviderWorkspaceStore((state) => state.setSelectedDate);

  const visibleBookings = providerBookings.filter((booking) =>
    (activeBranchId === "all" || booking.branchId === activeBranchId) && booking.date === selectedDate,
  );

  const totalRevenue = visibleBookings.reduce((total, booking) => total + booking.value, 0);
  const activeStaff = providerStaff.filter((member) => member.available).length;
  const averageUtilization = Math.round(providerStaff.reduce((total, member) => total + member.utilization, 0) / providerStaff.length);

  return (
    <div className="provider-workspace-dashboard">
      <section className="provider-workspace-toolbar">
        <div>
          <span>AVOS Provider OS</span>
          <h1>مركز تشغيل مزود الخدمة</h1>
          <p>إدارة الفروع والموظفين والحجوزات والطاقة الاستيعابية من لوحة واحدة.</p>
        </div>
        <div className="provider-toolbar-controls">
          <select value={activeBranchId} onChange={(event) => setActiveBranch(event.target.value)}>
            <option value="all">جميع الفروع</option>
            {providerBranches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
          </select>
          <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
        </div>
      </section>

      <section className="provider-kpi-grid">
        <article><span>حجوزات اليوم</span><strong>{visibleBookings.length}</strong><small>إجمالي الحجوزات المطابقة</small></article>
        <article><span>قيمة الحجوزات</span><strong>{totalRevenue.toLocaleString("ar-AE")} د.إ</strong><small>قبل الخصومات والعمولات</small></article>
        <article><span>الفنيون المتاحون</span><strong>{activeStaff}/{providerStaff.length}</strong><small>جاهزون لاستقبال مهام جديدة</small></article>
        <article><span>متوسط الإشغال</span><strong>{averageUtilization}%</strong><small>عبر جميع الفروع</small></article>
      </section>

      <section className="provider-branch-grid">
        {providerBranches.map((branch) => {
          const occupancy = Math.round((branch.bookedToday / branch.capacity) * 100);
          return (
            <article key={branch.id} className="provider-branch-card">
              <div><span>{branch.city}</span><b className={`branch-status ${branch.status}`}>{branch.status === "open" ? "مفتوح" : branch.status === "busy" ? "مزدحم" : "مغلق"}</b></div>
              <h2>{branch.name}</h2><p>{branch.address}</p>
              <div className="branch-capacity"><span>الإشغال اليوم</span><strong>{branch.bookedToday}/{branch.capacity}</strong></div>
              <div className="capacity-meter"><i style={{ width: `${occupancy}%` }} /></div>
              <footer><span>انتظار {branch.waitMinutes} دقيقة</span><span>{branch.openingHours}</span></footer>
            </article>
          );
        })}
      </section>

      <section className="provider-workspace-content-grid">
        <div className="provider-bookings-panel">
          <div className="provider-section-heading"><div><span>Booking Engine V2</span><h2>جدول الحجوزات</h2></div><Link className="provider-heading-link" href="/provider-workspace/bookings">إدارة الحجوزات</Link></div>
          <div className="provider-booking-table">
            {visibleBookings.map((booking) => (
              <article key={booking.id}>
                <div><strong>{booking.time}</strong><span>{booking.id}</span></div>
                <div><strong>{booking.customer}</strong><span>{booking.vehicle}</span></div>
                <div><strong>{booking.service}</strong><span>{providerBranches.find((branch) => branch.id === booking.branchId)?.name}</span></div>
                <b className={`booking-status ${booking.status}`}>{statusLabels[booking.status]}</b>
                <strong>{booking.value.toLocaleString("ar-AE")} د.إ</strong>
              </article>
            ))}
            {visibleBookings.length === 0 ? <div className="provider-empty-state">لا توجد حجوزات مطابقة لهذا التاريخ والفرع.</div> : null}
          </div>
        </div>

        <aside className="provider-ai-panel">
          <span>AI Provider Assistant</span><h2>توصيات تشغيلية</h2>
          {providerAiInsights.map((insight) => <article key={insight.title}><div><span>{insight.title}</span><strong>{insight.value}</strong></div><p>{insight.detail}</p></article>)}
        </aside>
      </section>

      <section className="provider-staff-panel">
        <div className="provider-section-heading"><div><span>Staff Management</span><h2>الفريق والأداء</h2></div><button type="button">إضافة موظف</button></div>
        <div className="provider-staff-grid">
          {providerStaff.map((member) => (
            <article key={member.id}>
              <div className="staff-avatar">{member.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div>
              <div><h3>{member.name}</h3><p>{member.role} · {member.specialty}</p><span>★ {member.rating} · {member.completedJobs} مهمة</span></div>
              <div className="staff-utilization"><strong>{member.utilization}%</strong><span>إشغال</span></div>
              <b className={member.available ? "available" : "unavailable"}>{member.available ? "متاح" : "مشغول"}</b>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
