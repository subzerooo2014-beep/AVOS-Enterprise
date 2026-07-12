"use client";

import { useState } from "react";
import {
  AutomotiveService,
} from "@/data/services";

export function ServiceBookingPanel({
  service,
}: {
  service: AutomotiveService;
}) {
  const [date, setDate] =
    useState("2026-07-16");

  const [time, setTime] =
    useState("17:00");

  const [location, setLocation] =
    useState("المركز");

  const [submitted, setSubmitted] =
    useState(false);

  return (
    <aside className="service-booking-panel">
      <span>AVOS Booking</span>
      <h2>احجز الخدمة</h2>

      <label>
        <span>التاريخ</span>
        <input
          type="date"
          value={date}
          onChange={(event) =>
            setDate(event.target.value)
          }
        />
      </label>

      <label>
        <span>الوقت</span>
        <input
          type="time"
          value={time}
          onChange={(event) =>
            setTime(event.target.value)
          }
        />
      </label>

      <label>
        <span>مكان الخدمة</span>
        <select
          value={location}
          onChange={(event) =>
            setLocation(
              event.target.value,
            )
          }
        >
          <option value="المركز">
            في المركز
          </option>
          {service.mobileService ? (
            <option value="موقعي">
              في موقعي
            </option>
          ) : null}
        </select>
      </label>

      <div className="service-booking-price">
        <span>السعر الابتدائي</span>
        <strong>
          {service.priceFrom} د.إ
        </strong>
      </div>

      <button
        className="button button-primary"
        type="button"
        onClick={() =>
          setSubmitted(true)
        }
      >
        {submitted
          ? "تم إرسال طلب الحجز"
          : "تأكيد الحجز"}
      </button>

      <small>
        سيتم تأكيد السعر النهائي بعد مراجعة
        تفاصيل السيارة والخدمة.
      </small>
    </aside>
  );
}
