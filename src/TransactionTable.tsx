import { useState } from "react";
import { FUNDS } from "./funds";
import type { Transaction, FundName } from "./types";
import { currentYearMonth } from "./utils";

type Props = {
  transactions: Transaction[];
  onUpdateFund: (id: string, fund: FundName) => Promise<void>;
  onToast: (message: string, type?: "success" | "error") => void;
};

export function TransactionTable({ transactions, onUpdateFund, onToast }: Props) {
  const ym = currentYearMonth();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = transactions
    .filter((t) => t.date.startsWith(ym))
    .sort((a, b) => b.date.localeCompare(a.date));

  if (filtered.length === 0) {
    return (
      <div>
        <h2>This Month’s Transactions</h2>
        <p style={{ fontStyle: "italic" }}>No transactions yet this month.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>This Month’s Transactions</h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: 8,
        }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid #ddd" }}>
            <th align="left">Date</th>
            <th align="left">Person</th>
            <th align="left">Fund</th>
            <th align="left">Description</th>
            <th align="right">Amount</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((t) => (
            <tr key={t.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ paddingRight: '5px' }}>{new Date(t.date).toLocaleDateString()}</td>
              <td style={{ paddingRight: '5px' }}>{capitalize(t.person)}</td>
              <td style={{ paddingRight: "5px" }}>
                <select
                  value={t.fund}
                  onChange={async (e) => {
                    const newFund = e.target.value as FundName;
                    if (newFund === t.fund) return;

                    setUpdatingId(t.id);
                    try {
                      await onUpdateFund(t.id, newFund);
                      onToast("Transaction updated", "success");
                    } catch (err) {
                      console.error(err);
                      onToast("Unable to update fund", "error");
                    } finally {
                      setUpdatingId(null);
                    }
                  }}
                  disabled={updatingId === t.id}
                >
                  {FUNDS.map((f) => (
                    <option key={f.key} value={f.key}>
                      {f.label}
                    </option>
                  ))}
                </select>
                {updatingId === t.id && (
                  <span
                    style={{
                      marginLeft: 8,
                      fontStyle: "italic",
                      color: "#666",
                      fontSize: 12,
                    }}
                  >
                    Saving...
                  </span>
                )}
              </td>
              <td>{t.description}</td>
              <td
                align="right"
                style={{
                  color: t.amount < 0 ? "#dc2626" : "#16a34a",
                  fontWeight: "bold",
                }}
              >
                ${t.amount.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
