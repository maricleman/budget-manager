type Props = {
  message: string;
  type?: "success" | "error";
};

export function Toast({ message, type = "success" }: Props) {
  const background = type === "error" ? "rgba(220, 38, 38, 0.95)" : "rgba(16, 185, 129, 0.95)";

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
      {message}
    </div>
  );
}
