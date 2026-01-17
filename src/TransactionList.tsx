import type { Transaction } from "./types";

type Props = {
  transactions: Transaction[];
};

export function TransactionList({ transactions }: Props) {
  return (
    <div>
      <h2>History</h2>

      {transactions.length === 0 && <p>No transactions yet.</p>}

      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            {new Date(t.date).toLocaleString()} —{" "}
            <strong>{t.person}</strong> — {t.fund} — {t.description || "(no desc)"} —{" "}
            <strong>{t.amount >= 0 ? "+" : ""}${t.amount.toFixed(2)}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
