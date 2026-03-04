import { useState } from "react";
import type { Goal } from "./types";

function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default function GoalBar({ goal, onDelete, onUpdate }: { goal: Goal; onDelete?: (id: string) => void; onUpdate?: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState(String(goal.currentAmount));
  const [isEditingMonthly, setIsEditingMonthly] = useState(false);
  const [editMonthly, setEditMonthly] = useState(String(goal.monthlyContribution));
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(goal.name);

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

  async function handleSaveAmount() {
    const newAmount = Number(editAmount);
    await fetch("/api/update-goal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: goal.id, currentAmount: newAmount }),
    });
    setIsEditing(false);
    onUpdate?.();
  }

  async function handleSaveMonthly() {
    const newMonthly = Number(editMonthly);
    await fetch("/api/update-goal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: goal.id, monthlyContribution: newMonthly }),
    });
    setIsEditingMonthly(false);
    onUpdate?.();
  }

  async function handleSaveName() {
    const newName = editName.trim();
    if (newName && newName !== goal.name) {
      await fetch("/api/update-goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: goal.id, name: newName }),
      });
      onUpdate?.();
    }
    setIsEditingName(false);
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ cursor: "pointer", flex: 1 }} onClick={() => setIsEditingName(true)}>
          {!isEditingName ? (
            goal.name
          ) : (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveName();
                if (e.key === "Escape") {
                  setEditName(goal.name);
                  setIsEditingName(false);
                }
              }}
              autoFocus
              onClick={(e) => e.stopPropagation()}
              style={{
                padding: "4px 8px",
                fontSize: "inherit",
                fontWeight: "inherit",
                border: "2px solid #2563eb",
                borderRadius: "4px",
              }}
            />
          )}
        </div>
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
            cursor: "pointer",
          }}
          onClick={() => setIsEditing(true)}
        >
          {!isEditing ? (
            <>
              ${formatCurrency(goal.currentAmount)} / $
              {formatCurrency(goal.targetAmount)}
            </>
          ) : (
            <input
              type="number"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              onBlur={handleSaveAmount}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveAmount();
                if (e.key === "Escape") setIsEditing(false);
              }}
              autoFocus
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "80px",
                padding: "4px",
                fontSize: "inherit",
                fontWeight: "inherit",
                border: "2px solid #2563eb",
                borderRadius: "4px",
              }}
            />
          )}
        </div>
      </div>

      <div style={{ fontSize: 14, marginTop: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          ${formatCurrency(remaining)} remaining
          {monthsRemaining !== null && dateString
            ? ` • ~${monthsRemaining} months / ${dateString}`
            : ""}
        </div>
        <div style={{ cursor: "pointer", color: "#666" }} onClick={() => setIsEditingMonthly(true)}>
          {!isEditingMonthly ? (
            <span style={{ fontSize: 12 }}>${formatCurrency(goal.monthlyContribution)}/mo</span>
          ) : (
            <input
              type="number"
              value={editMonthly}
              onChange={(e) => setEditMonthly(e.target.value)}
              onBlur={handleSaveMonthly}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveMonthly();
                if (e.key === "Escape") setIsEditingMonthly(false);
              }}
              autoFocus
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "60px",
                padding: "4px",
                fontSize: 12,
                border: "2px solid #2563eb",
                borderRadius: "4px",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}