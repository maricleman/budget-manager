import type { Goal } from "./types";

export default function GoalBar({ goal, onDelete }: { goal: Goal; onDelete?: (id: string) => void }) {
  const percent =
    goal.targetAmount <= 0
      ? 0
      : Math.min(
          100,
          (goal.currentAmount / goal.targetAmount) * 100
        );

  const remaining = goal.targetAmount - goal.currentAmount;

  const monthsRemaining =
    goal.monthlyContribution > 0
      ? Math.ceil(remaining / goal.monthlyContribution)
      : null;

  const projectedDate = monthsRemaining !== null ? new Date(new Date().getFullYear(), new Date().getMonth() + monthsRemaining, 1) : null;
  const dateString = projectedDate
    ? projectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {goal.name}
        {onDelete && (
          <button
            onClick={() => onDelete(goal.id)}
            style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: 4,
              padding: "4px 8px",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            Delete
          </button>
        )}
      </div>

      <div
        style={{
          position: "relative",
          height: 28,
          background: "#eee",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            background: "#2563eb",
            transition: "width 0.3s",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          ${goal.currentAmount.toFixed(0)} / $
          {goal.targetAmount.toFixed(0)}
        </div>
      </div>

      <div style={{ fontSize: 14, marginTop: 4 }}>
        ${remaining.toFixed(0)} remaining
        {monthsRemaining !== null && dateString
          ? ` • ~${monthsRemaining} months / ${dateString}`
          : ""}
      </div>
    </div>
  );
}