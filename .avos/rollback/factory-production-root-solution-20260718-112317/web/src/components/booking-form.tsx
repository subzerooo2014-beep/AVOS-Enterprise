"use client";

import { useState } from "react";
import {
  BookingType,
  bookingTypeLabels,
} from "@/data/bookings";
import {
  useBuyerAccountStore,
} from "@/store/buyer-account-store";

export function BookingForm({
  vehicleTitle,
  provider,
}: {
  vehicleTitle: string;
  provider: string;
}) {
  const addBooking =
    useBuyerAccountStore(
      (state) => state.addBooking,
    );

  const [type, setType] =
    useState<BookingType>("test-drive");

  const [date, setDate] =
    useState("2026-07-16");

  const [time, setTime] =
    useState("18:30");

  const [submitted, setSubmitted] =
    useState(false);

  return (
    <section className="booking-form">
      <div>
        <span>AVOS Booking Center</span>
        <h2>احجز موعدك فورًا</h2>
        <p>
          تجربة قيادة، فحص، أو مكالمة
          فيديو مع البائع.
        </p>
      </div>

      <div className="booking-form-grid">
        <label>
          <span>نوع الموعد</span>
          <select
            value={type}
            onChange={(event) =>
              setType(
                event.target
                  .value as BookingType,
              )
            }
          >
            {Object.entries(
              bookingTypeLabels,
            ).map(([value, label]) => (
              <option
                key={value}
                value={value}
              >
                {label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>التاريخ</span>
          <input
            type="date"
            value={date}
            onChange={(event) =>
              setDate(
                event.target.value,
              )
            }
          />
        </label>

        <label>
          <span>الوقت</span>
          <input
            type="time"
            value={time}
            onChange={(event) =>
              setTime(
                event.target.value,
              )
            }
          />
        </label>
      </div>

      <button
        className="button button-primary"
        type="button"
        onClick={() => {
          addBooking({
            id:
              "booking-local-" +
              Date.now(),
            type,
            vehicleTitle,
            provider,
            date,
            time,
            location:
              type === "video-call"
                ? "مكالمة فيديو داخل AVOS"
                : "الموقع يحدده المزود",
            status: "pending",
            reference:
              "AVOS-" +
              Date.now()
                .toString()
                .slice(-6),
          });

          setSubmitted(true);
        }}
      >
        {submitted
          ? "تم إرسال الطلب"
          : "تأكيد الحجز"}
      </button>
    </section>
  );
}
