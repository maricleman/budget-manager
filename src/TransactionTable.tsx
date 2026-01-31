import type { Transaction } from "./types";
import { currentYearMonth } from "./utils";

type Props = {
  transactions: Transaction[];
};

export function TransactionTable({ transactions }: Props) {
  const ym = currentYearMonth();

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
              <td>{new Date(t.date).toLocaleDateString()}</td>
              <td>{capitalize(t.person)}</td>
              <td>{capitalize(t.fund)}</td>
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
