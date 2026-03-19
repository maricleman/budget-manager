type Props = {
  message: string;
  type?: "success" | "error";
  actionLabel?: string;
  onAction?: () => void | Promise<void>;
};

export function Toast({
  message,
  type = "success",
  actionLabel,
  onAction,
}: Props) {
  const background =
    type === "error" ? "rgba(220, 38, 38, 0.95)" : "rgba(16, 185, 129, 0.95)";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        padding: "10px 16px",
        borderRadius: 10,
        background,
        color: "white",
        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
        zIndex: 9999,
        minWidth: 260,
        textAlign: "center",
        fontWeight: 500,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>{message}</span>
        {actionLabel && onAction ? (
          <button
            onClick={onAction}
            style={{
              marginLeft: 12,
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.4)",
              borderRadius: 6,
              color: "white",
              cursor: "pointer",
              padding: "4px 10px",
              fontWeight: 600,
            }}
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
