type Props = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        padding: 16,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{
          background: "var(--modal-bg, #1f1f1f)",
          color: "var(--modal-text, #f8f8f8)",
          borderRadius: 12,
          maxWidth: 420,
          width: "100%",
          padding: 20,
          boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{title}</div>
          <div style={{ marginTop: 8, lineHeight: 1.4 }}>{message}</div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 8,
              padding: "8px 14px",
              cursor: "pointer",
              color: "white",
              fontWeight: 600,
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              border: "none",
              borderRadius: 8,
              padding: "8px 14px",
              cursor: "pointer",
              background: "#ef4444",
              color: "white",
              fontWeight: 700,
            }}
          >
            {loading ? "Working..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
