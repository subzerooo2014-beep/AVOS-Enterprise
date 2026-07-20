"use client";

import { useEffect, useState } from "react";
import type { RuntimeSnapshot } from "@/lib/ueap/types";
import { saveRuntimeCache } from "@/lib/ueap/offline";

type RuntimeStatusProps = {
  initial: RuntimeSnapshot;
};

export function RuntimeStatus({ initial }: RuntimeStatusProps) {
  const [snapshot, setSnapshot] = useState(initial);
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    const base =
      process.env.NEXT_PUBLIC_AVOS_API_BASE_URL ?? "http://localhost:3000";

    const refresh = async () => {
      try {
        const response = await fetch(`${base}/avos/web-runtime/status`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("runtime unavailable");
        const data = (await response.json()) as RuntimeSnapshot;
        setSnapshot(data);
        saveRuntimeCache(data);
        setConnected(true);
      } catch {
        setConnected(false);
      }
    };

    refresh();
    const timer = window.setInterval(refresh, 15000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="ueap-runtime-status">
      <div>
        <span className={connected ? "ueap-dot online" : "ueap-dot offline"} />
        <strong>{connected ? "Live Runtime Connected" : "Offline Recovery Mode"}</strong>
      </div>
      <p>
        {snapshot.status} · Health {snapshot.healthScore} · Version {snapshot.version}
      </p>
    </section>
  );
}
