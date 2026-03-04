import { useEffect, useState } from "react";
import type { Goal } from "./types";
import AddGoalForm from "./AddGoalForm";
import GoalBar from "./GoalBar";

export function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);

  async function loadGoals() {
    const resp = await fetch("/api/goals");
    const data = await resp.json();
    setGoals(data.goals ?? []);
  }

  useEffect(() => {
    loadGoals();
  }, []);

  return (
    <div>
      <h2>Goals</h2>

      <AddGoalForm onAdd={loadGoals} />

      {goals.map((g: Goal) => (
        <GoalBar key={g.id} goal={g} />
      ))}
    </div>
  );
}