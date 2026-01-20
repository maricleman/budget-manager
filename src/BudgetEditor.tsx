import { useEffect, useState } from "react";
import type { FundName } from "./types";
import { currentYearMonth } from "./date";

const FUNDS: { key: FundName; label: string }[] = [
  { key: "restaurant", label: "Restaurant" },
  { key: "grocery", label: "Grocery" },
  { key: "adventure", label: "Adventure" },
  { key: "gift", label: "Gift" },
  { key: "david", label: "David" },
  { key: "hannah", label: "Hannah" },
];

type Props = {
  budgets: Record<FundName, number> | undefined;
  onSave: (budgets: Record<FundName, number>) => Promise<void>;
};

export function BudgetEditor({ budgets, onSave }: Props) {
  const [local, setLocal] = useState<Record<FundName, number> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (budgets) {
      setLocal({ ...budgets });
    } else {
      // default empty month
      setLocal({
        restaurant: 0,
        grocery: 0,
        adventure: 0,
        gift: 0,
        david: 0,
        hannah: 0,
      });
    }
  }, [budgets]);

  if (!local) return null;

  function setFund(fund: FundName, value: number) {
    setLocal((prev) => ({ ...prev!, [fund]: value }));
  }

  async function save() {
    setSaving(true);
    await onSave(local);
    setSaving(false);
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <h2>Edit This Month’s Budget</h2>

      <div style={{ display: "grid", gridTemplateColumns: "200px 120px", gap: 12 }}>
        {FUNDS.map((f) => (
          <>
            <label key={f.key + "-label"}>{f.label}</label>
            <input
              key={f.key}
              type="number"
              value={local[f.key]}
              onChange={(e) => setFund(f.key, Number(e.target.value))}
            />
          </>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save Budget"}
        </button>
      </div>
    </div>
  );
}
