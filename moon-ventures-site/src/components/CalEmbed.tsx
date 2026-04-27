"use client";

import { useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

export function CalEmbed() {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cal = await getCalApi();
        if (cancelled) return;
        cal("ui", {
          theme: "light",
          styles: { branding: { brandColor: "#d4b483" } },
        });
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) {
    return (
      <iframe
        title="Réserver un audit Moon Ventures"
        src="https://cal.com/moon-ventures/audit?embed=true"
        loading="lazy"
        className="w-full rounded-2xl border border-mv-mist bg-white"
        style={{ height: 650 }}
      />
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-mv-mist bg-white">
      <Cal
        calLink="moon-ventures/audit"
        style={{ width: "100%", height: 650 }}
        config={{ layout: "month_view" }}
      />
    </div>
  );
}
