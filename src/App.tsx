import { useEffect, useState } from "react";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";
import type { Funds as FundsType, Transaction, NewTransaction, MonthlyBudgets } from "./types";
import { BudgetEditor } from "./BudgetEditor";
import { currentYearMonth } from "./utils";
import { BudgetBars } from "./BudgetBars";


export default function App() {
  const [funds, setFunds] = useState<FundsType | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyBudgets, setMonthlyBudgets] = useState<MonthlyBudgets>({});

  const ym = currentYearMonth();

  async function loadData() {
    const data = await fetch("/api/budget").then((r) => r.json());
    setFunds(data.funds);
    setTransactions(data.transactions);
    setMonthlyBudgets(data.monthlyBudgets ?? {});
  }

  async function addTransaction(tx: Omit<NewTransaction, "id" | "date">) {
    await fetch("/api/transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tx),
    });

    await loadData();
  }

  useEffect(() => {
    loadData();
  }, []);

  if (!funds) return <div>Loading...</div>;

  const thisMonthBudgets = monthlyBudgets[ym];

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Maricle Family Budget</h1>

      <BudgetBars funds={funds} budgets={thisMonthBudgets} />

      <hr />

      <BudgetEditor
        budgets={thisMonthBudgets}
        onSave={async (newBudgets) => {
          await fetch("/api/set-monthly-budget", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              yearMonth: ym,
              budgets: newBudgets,
            }),
          });

          await loadData();
        }}
      />

      <hr />

      <TransactionForm onAdd={addTransaction} />

      <hr />

      <TransactionList transactions={transactions} />
    </div>
  );
}
