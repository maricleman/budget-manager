import { useEffect, useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { TransactionForm } from "./TransactionForm";
import { TransactionTable } from "./TransactionTable";
import { Toast } from "./Toast";
import type { Funds as FundsType, Transaction, NewTransaction, MonthlyBudgets, FundName } from "./types";
import { BudgetEditor } from "./BudgetEditor";
import { currentYearMonth } from "./utils";
import { BudgetBars } from "./BudgetBars";
import { GoalsPage } from "./GoalsPage";


type ToastState = {
  message: string;
  type?: "success" | "error";
  actionLabel?: string;
  action?: () => void;
};

export default function App() {
  const [funds, setFunds] = useState<FundsType | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyBudgets, setMonthlyBudgets] = useState<MonthlyBudgets>({});
  const [toast, setToast] = useState<ToastState | null>(null);

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

  async function updateTransaction(
    id: string,
    updates: Partial<{ fund: FundName; description: string }>
  ) {
    await fetch("/api/update-transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });

    await loadData();
  }

  async function deleteTransaction(id: string) {
    await fetch("/api/delete-transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    await loadData();
  }

  async function restoreTransaction(tx: Transaction) {
    await fetch("/api/restore-transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tx),
    });

    await loadData();
  }

  function showToast(
    message: string,
    type: "success" | "error" = "success",
    actionLabel?: string,
    action?: () => void | Promise<void>
  ) {
    setToast({ message, type, actionLabel, action });
  }

  // Clear toasts automatically
  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    loadData();
  }, []);

  if (!funds) return <LoadingSpinner />;

  const thisMonthBudgets = monthlyBudgets[ym];

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Maricle Family Budget</h1>

      <BudgetBars funds={funds} budgets={thisMonthBudgets} />

      <hr />

      <TransactionForm onAdd={addTransaction} onToast={showToast} />

      <hr />

      <TransactionTable
        transactions={transactions}
        onUpdateTransaction={updateTransaction}
        onDeleteTransaction={deleteTransaction}
        onRestoreTransaction={restoreTransaction}
        onToast={showToast}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          actionLabel={toast.actionLabel}
          onAction={toast.action}
        />
      )}

      <hr />

      <GoalsPage />

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
    </div>
  );
}
