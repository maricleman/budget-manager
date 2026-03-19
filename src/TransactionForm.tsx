import { useState } from "react";
import type { FundName, Transaction, NewTransaction } from "./types";
import { FUNDS } from "./funds";

type Props = {
  onAdd(tx: Omit<Transaction, "id" | "date">): Promise<void>;
  onToast: (message: string, type?: "success" | "error") => void;
};

export function TransactionForm({ onAdd, onToast }: Props) {
  const [person, setPerson] = useState<"david" | "hannah">("david");
  const [fund, setFund] = useState<FundName>("grocery");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const value = parseFloat(amount);
    if (isNaN(value)) {
      onToast("Enter a valid number", "error");
      return;
    }

    const tx: NewTransaction = {
      person: person,
      fund: fund,
      description: description,
      amount: Number(amount),
    };

    try {
      await onAdd(tx);
      onToast("Transaction saved", "success");
      setDescription("");
      setAmount("");
    } catch (err) {
      console.error(err);
      onToast("Unable to save transaction", "error");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Transaction</h2>

      <div>
        <strong>Who:</strong>
        <label style={{ marginLeft: 10 }}>
          <input
            type="radio"
            checked={person === "david"}
            onChange={() => setPerson("david")}
          />
          David
        </label>
        <label style={{ marginLeft: 10 }}>
          <input
            type="radio"
            checked={person === "hannah"}
            onChange={() => setPerson("hannah")}
          />
          Hannah
        </label>
      </div>

      <div style={{ marginTop: 10 }}>
      <label>
        Fund:{" "}
        <select
          value={fund}
          onChange={(e) => setFund(e.target.value as FundName)}
        >
          {FUNDS.map((f) => (
            <option key={f.key} value={f.key}>
              {f.label}
            </option>
        ))}
        </select>
      </label>
</div>


      <div style={{ marginTop: 10 }}>
        <label>
          Description:{" "}
          <input value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
      </div>

      <div style={{ marginTop: 10 }}>
        <label>
          Amount:{" "}
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="-32.15 or 100"
          />
        </label>
      </div>

      <button style={{ marginTop: 15 }}>Add</button>
    </form>
  );
}
