export function LoadingSpinner() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: 14,
        color: "var(--loading-text, #4b5563)",
      }}
    >
      <div className="spinner" />
      <div style={{ fontWeight: 600 }}>Loading budget data…</div>
    </div>
  );
}
