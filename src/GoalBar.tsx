import type { Goal } from "./types";

export default function GoalBar({ goal }: { goal: Goal }) {
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

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontWeight: "bold" }}>{goal.name}</div>

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
        {monthsRemaining !== null &&
          ` • ~${monthsRemaining} months to goal`}
      </div>
    </div>
  );
}