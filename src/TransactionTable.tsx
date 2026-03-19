import { useState } from "react";
import { FUNDS } from "./funds";
import type { Transaction, FundName } from "./types";
import { currentYearMonth } from "./utils";
import { ConfirmModal } from "./ConfirmModal";

type Props = {
  transactions: Transaction[];
  onUpdateTransaction: (
    id: string,
    updates: Partial<{ fund: FundName; description: string }>
  ) => Promise<void>;
  onDeleteTransaction: (id: string) => Promise<void>;
  onRestoreTransaction: (tx: Transaction) => Promise<void>;
  onToast: (message: string, type?: "success" | "error", actionLabel?: string, action?: () => void) => void;
};

export function TransactionTable({
  transactions,
  onUpdateTransaction,
  onDeleteTransaction,
  onRestoreTransaction,
  onToast,
}: Props) {
  const ym = currentYearMonth();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDescription, setEditingDescription] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  async function saveDescription() {
    if (!editingId) return;
    if (updatingId === editingId) return;

    const tx = transactions.find((t) => t.id === editingId);
    if (!tx) {
      setEditingId(null);
      return;
    }

    const trimmed = editingDescription.trim();
    if (trimmed === tx.description) {
      setEditingId(null);
      return;
    }

    setUpdatingId(editingId);
    try {
      await onUpdateTransaction(editingId, { description: trimmed });
      onToast("Transaction updated", "success");
    } catch (err) {
      console.error(err);
      onToast("Unable to update description", "error");
    } finally {
      setUpdatingId(null);
      setEditingId(null);
    }
  }

  async function confirmDelete(tx: Transaction) {
    setPendingDelete(tx);
  }

  async function performDelete() {
    if (!pendingDelete) return;

    setModalLoading(true);
    setDeletingId(pendingDelete.id);

    const deletedTx = pendingDelete;

    try {
      await onDeleteTransaction(deletedTx.id);
      onToast(
        "Transaction deleted",
        "success",
        "Undo",
        async () => {
          try {
            await onRestoreTransaction(deletedTx);
            onToast("Transaction restored", "success");
          } catch (err) {
            console.error(err);
            onToast("Unable to restore transaction", "error");
          }
        }
      );
    } catch (err) {
      console.error(err);
      onToast("Unable to delete transaction", "error");
    } finally {
      setDeletingId(null);
      setModalLoading(false);
      setPendingDelete(null);
    }
  }

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
            <th align="right">Actions</th>
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
                      await onUpdateTransaction(t.id, { fund: newFund });
                      onToast("Transaction updated", "success");
                    } catch (err) {
                      console.error(err);
                      onToast("Unable to update fund", "error");
                    } finally {
                      setUpdatingId(null);
                    }
                  }}
                  disabled={updatingId === t.id || deletingId === t.id}
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
              <td>
                {editingId === t.id ? (
                  <input
                    value={editingDescription}
                    onChange={(e) => setEditingDescription(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        await saveDescription();
                      }
                      if (e.key === "Escape") {
                        setEditingId(null);
                      }
                    }}
                    onBlur={async () => {
                      await saveDescription();
                    }}
                    disabled={updatingId === t.id || deletingId === t.id}
                    style={{ width: "100%" }}
                    autoFocus
                  />
                ) : (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    {t.description || "(no description)"}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(t.id);
                        setEditingDescription(t.description);
                      }}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: 14,
                        padding: 2,
                        color: "#4b5563",
                      }}
                      aria-label="Edit description"
                      disabled={updatingId === t.id || deletingId === t.id}
                    >
                      ✏️
                    </button>
                  </span>
                )}
              </td>
              <td
                align="right"
                style={{
                  color: t.amount < 0 ? "#dc2626" : "#16a34a",
                  fontWeight: "bold",
                }}
              >
                ${t.amount.toFixed(2)}
              </td>
              <td align="right">
                <button
                  type="button"
                  onClick={() => confirmDelete(t)}
                  disabled={updatingId === t.id || deletingId === t.id}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: 18,
                    padding: 4,
                    color: "#a11",
                  }}
                  aria-label="Delete transaction"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {pendingDelete && (
        <ConfirmModal
          title="Delete transaction?"
          message={`Are you sure you want to delete this transaction for ${pendingDelete.person} (${pendingDelete.fund})?`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          loading={modalLoading}
          onConfirm={performDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
