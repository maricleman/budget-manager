import { useState } from "react";
import { Funds } from "./Funds";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";
import type { Funds as FundsType, Transaction } from "./types";


const initialFunds: FundsType = {
  restaurant: 500,
  grocery: 600,
  adventure: 300,
  david: 200,
  hannah: 200,
};

export default function App() {
  const [funds, setFunds] = useState<FundsType>(initialFunds);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  function addTransaction(tx: Omit<Transaction, "id" | "timestamp">) {
    const newTx: Transaction = {
      ...tx,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    setTransactions((prev) => [newTx, ...prev]);

    setFunds((prev) => ({
      ...prev,
      [tx.fund]: parseFloat((prev[tx.fund] + tx.amount).toFixed(2)),
    }));
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Maricle Family Budget</h1>

      <Funds funds={funds} />

      <hr />

      <TransactionForm onAdd={addTransaction} />

      <hr />

      <TransactionList transactions={transactions} />
    </div>
  );
}
