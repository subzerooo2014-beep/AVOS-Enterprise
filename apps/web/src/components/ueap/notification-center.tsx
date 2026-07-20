"use client";

import { useState } from "react";
import type { RuntimeNotification } from "@/lib/ueap/types";

export function NotificationCenter({
  notifications,
}: {
  notifications: RuntimeNotification[];
}) {
  const [items, setItems] = useState(notifications);
  const unread = items.filter((item) => !item.read).length;

  return (
    <section className="ueap-panel">
      <header>
        <div>
          <span>Real-time Notification Center</span>
          <h2>التنبيهات الحية</h2>
        </div>
        <strong>{unread} غير مقروء</strong>
      </header>

      <div className="ueap-notifications">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() =>
              setItems((current) =>
                current.map((entry) =>
                  entry.id === item.id ? { ...entry, read: true } : entry,
                ),
              )
            }
          >
            <span>{item.priority}</span>
            <strong>{item.title}</strong>
            <p>{item.message}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
