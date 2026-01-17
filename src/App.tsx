import { useEffect, useState } from "react";
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
  const [funds, setFunds] = useState<FundsType | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

async function addTransaction(tx: Omit<Transaction, "id" | "timestamp">) {
  await fetch("/api/transaction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tx)
  });

  const data = await fetch("/api/budget").then((r) => r.json());
  setFunds(data.funds);
  setTransactions(data.transactions);
}

  useEffect(() => {
  fetch("/api/budget")
    .then((r) => r.json())
    .then((data) => {
      setFunds(data.funds);
      setTransactions(data.transactions);
    });
}, []);

if (!funds) return <div>Loading...</div>;

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
