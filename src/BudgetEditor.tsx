import { useEffect, useState } from "react";
import type { FundName } from "./types";
import { FUNDS } from "./funds";


type Props = {
  budgets: Record<FundName, number> | undefined;
  onSave: (budgets: Record<FundName, number>) => Promise<void>;
};

export function BudgetEditor({ budgets, onSave }: Props) {
  const [local, setLocal] = useState<Record<FundName, string>>({
    restaurant: "",
    grocery: "",
    adventure: "",
    gift: "",
    david: "",
    hannah: "",
    homeSupplies: "",
    clothing: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
  if (budgets) {
    const asStrings = Object.fromEntries(
      Object.entries(budgets).map(([k, v]) => [k, String(v)])
    ) as Record<FundName, string>;

      setLocal(asStrings);
    }
  }, [budgets]);


  function setFund(fund: FundName, value: string) {
    setLocal((prev) => ({ ...prev, [fund]: value }));
  }

  async function save() {
  setSaving(true);

  const numeric: Record<FundName, number> = {
    restaurant: Number(local.restaurant) || 0,
    grocery: Number(local.grocery) || 0,
    adventure: Number(local.adventure) || 0,
    gift: Number(local.gift) || 0,
    david: Number(local.david) || 0,
    hannah: Number(local.hannah) || 0,
    homeSupplies: Number(local.homeSupplies) || 0,
    clothing: Number(local.clothing) || 0,
  };

  await onSave(numeric);
  setSaving(false);
}


  return (
    <div style={{ marginBottom: 24 }}>
      <h2>Edit This Month’s Budget</h2>

      <div style={{ display: "grid", gridTemplateColumns: "200px 120px", gap: 12 }}>
        {FUNDS.map((f) => (
          <div key={f.key} style={{ display: "contents" }}>
            <label>{f.label}</label>
            <input
              type="number"
              value={local[f.key]}
              onChange={(e) => setFund(f.key, e.target.value)}
            />
          </div>
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
