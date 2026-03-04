import { useState } from "react";

export default function AddGoalForm({ onAdd }: { onAdd: () => void }) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [monthly, setMonthly] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/add-goal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        targetAmount: Number(target),
        monthlyContribution: Number(monthly),
      }),
    });

    setName("");
    setTarget("");
    setMonthly("");
    onAdd();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Goal</h3>
      <input
        placeholder="Goal Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Target Amount"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
      />
      <input
        type="number"
        placeholder="Monthly Contribution"
        value={monthly}
        onChange={(e) => setMonthly(e.target.value)}
      />
      <button type="submit">Add Goal</button>
    </form>
  );
}