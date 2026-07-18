import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  AccountNavigation,
} from "@/components/account-navigation";
import { buyerActivities } from "@/data/buyer-activity";
import { buyerBookings } from "@/data/bookings";
import { vehicles } from "@/data/vehicles";
import { getApiStatus } from "@/lib/api";

export default async function AccountPage() {
  const apiStatus = await getApiStatus();

  return (
    <main>
      <Header apiOnline={apiStatus.online} />

      <div className="shell account-page">
        <AccountNavigation />

        <section className="account-hero">
          <div>
            <span>مرحبًا بك في AVOS</span>
            <h1>
              كل رحلتك الشرائية في مكان واحد.
            </h1>
            <p>
              السيارات المحفوظة، المحادثات،
              الحجوزات، العروض والتنبيهات.
            </p>
          </div>

          <div className="account-score">
            <span>ملفك الذكي</span>
            <strong>92%</strong>
            <small>
              تفضيلاتك أصبحت أدق
            </small>
          </div>
        </section>

        <section className="account-kpi-grid">
          <article>
            <span>المفضلة</span>
            <strong>4</strong>
            <small>سيارات محفوظة</small>
          </article>
          <article>
            <span>المحادثات</span>
            <strong>2</strong>
            <small>رسالتان غير مقروءتين</small>
          </article>
          <article>
            <span>الحجوزات</span>
            <strong>
              {buyerBookings.length}
            </strong>
            <small>موعدان قادمان</small>
          </article>
          <article>
            <span>التنبيهات</span>
            <strong>
              {
                buyerActivities.filter(
                  (item) => item.unread,
                ).length
              }
            </strong>
            <small>تحديثات جديدة</small>
          </article>
        </section>

        <section className="account-dashboard-grid">
          <div className="account-panel">
            <div className="account-panel-heading">
              <div>
                <span>نشاطك</span>
                <h2>آخر التحديثات</h2>
              </div>
            </div>

            <div className="activity-list">
              {buyerActivities.map(
                (activity) => (
                  <Link
                    key={activity.id}
                    href={activity.href}
                  >
                    <i
                      className={
                        activity.unread
                          ? "unread"
                          : ""
                      }
                    />
                    <div>
                      <strong>
                        {activity.title}
                      </strong>
                      <span>
                        {
                          activity.description
                        }
                      </span>
                    </div>
                  </Link>
                ),
              )}
            </div>
          </div>

          <div className="account-panel">
            <div className="account-panel-heading">
              <div>
                <span>مقترحة لك</span>
                <h2>فرص قد تعجبك</h2>
              </div>
              <Link href="/vehicles">
                عرض السوق
              </Link>
            </div>

            <div className="account-vehicle-list">
              {vehicles
                .slice(0, 3)
                .map((vehicle) => (
                  <Link
                    key={vehicle.id}
                    href={`/vehicles/${vehicle.slug}`}
                  >
                    <img
                      src={vehicle.image}
                      alt={vehicle.title}
                    />
                    <div>
                      <strong>
                        {vehicle.title}
                      </strong>
                      <span>
                        تطابق{" "}
                        {90 +
                          (vehicle.year %
                            7)}
                        %
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
