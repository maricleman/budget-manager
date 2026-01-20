import type { Funds } from "./types";

type Props = {
  funds: Funds;          // current balances
  budgets?: Funds;       // this month's budgets
};

export function BudgetBars({ funds, budgets }: Props) {
  if (!budgets) {
    return (
      <div>
        <h2>This Month's Budgets</h2>
        <p>No budget set for this month yet.</p>
      </div>
    );
  }

  const entries = Object.keys(budgets) as (keyof Funds)[];

  return (
    <div>
      <h2>This Month's Budgets</h2>

      {entries.map((key) => {
        const budget = budgets[key];
        const remaining = funds[key];
        const spent = budget - remaining;

        const percent =
          budget <= 0 ? 0 : Math.min(100, Math.max(0, (spent / budget) * 100));

        const overspent = remaining < 0;

        return (
          <div key={key} style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: "bold", marginBottom: 4 }}>
              {labelFor(key)}
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
              {/* Filled bar */}
              <div
                style={{
                  height: "100%",
                  width: `${percent}%`,
                  background: overspent ? "#dc2626" : "#16a34a",
                  transition: "width 0.3s",
                }}
              />

              {/* Text overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: overspent ? "white" : "black",
                  textShadow: overspent ? "0 0 4px rgba(0,0,0,0.5)" : "none",
                }}
              >
                ${spent.toFixed(0)} / ${budget.toFixed(0)}{" "}
                {remaining < 0
                  ? ` (Over by $${Math.abs(remaining).toFixed(0)})`
                  : ` ($${remaining.toFixed(0)} left)`}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function labelFor(key: string) {
  const map: Record<string, string> = {
    grocery: "🛒 Grocery",
    restaurant: "🍔 Restaurant",
    adventure: "🏕️ Adventure",
    gift: "🎁 Gift",
    david: "👨 David",
    hannah: "👩 Hannah",
  };

  return map[key] ?? key;
}
