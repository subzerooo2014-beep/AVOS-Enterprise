import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  AccountNavigation,
} from "@/components/account-navigation";
import {
  bookingTypeLabels,
  buyerBookings,
} from "@/data/bookings";
import { getApiStatus } from "@/lib/api";

export default async function BookingsPage() {
  const apiStatus = await getApiStatus();

  return (
    <main>
      <Header apiOnline={apiStatus.online} />
      <div className="shell account-page">
        <AccountNavigation />

        <div className="account-section-heading">
          <span>AVOS Booking Center</span>
          <h1>الحجوزات والمواعيد</h1>
          <p>
            تابع تجربة القيادة، الفحص
            والمكالمات المجدولة.
          </p>
        </div>

        <div className="booking-list">
          {buyerBookings.map(
            (booking) => (
              <article key={booking.id}>
                <div className="booking-date">
                  <strong>
                    {booking.date
                      .split("-")
                      .at(-1)}
                  </strong>
                  <span>
                    {booking.date}
                  </span>
                </div>

                <div>
                  <span>
                    {
                      bookingTypeLabels[
                        booking.type
                      ]
                    }
                  </span>
                  <h2>
                    {booking.vehicleTitle}
                  </h2>
                  <p>
                    {booking.provider} ·{" "}
                    {booking.location}
                  </p>
                </div>

                <div>
                  <span>الوقت</span>
                  <strong>
                    {booking.time}
                  </strong>
                </div>

                <div>
                  <span>الحالة</span>
                  <strong>
                    {booking.status}
                  </strong>
                </div>

                <small>
                  {booking.reference}
                </small>
              </article>
            ),
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
