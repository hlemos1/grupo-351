"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="pt">
      <body>
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#0B1D32",
          color: "#fff",
          padding: "2rem",
        }}>
          <div style={{ textAlign: "center", maxWidth: "480px" }}>
            <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
              Algo correu mal
            </h1>
            <p style={{ opacity: 0.6, marginBottom: "2rem", fontSize: "0.9rem" }}>
              Ocorreu um erro inesperado. A nossa equipa já foi notificada.
            </p>
            <button
              onClick={reset}
              style={{
                background: "#D97706",
                color: "#fff",
                border: "none",
                padding: "0.75rem 2rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
