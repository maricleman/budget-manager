export type FundName =
  | "restaurant"
  | "grocery"
  | "adventure"
  | "gift"
  | "homeSupplies"
  | "clothing"
  | "health"
  | "david"
  | "hannah";

export type Funds = Record<FundName, number>;

export type Transaction = {
  id: string;
  person: "david" | "hannah";
  fund: FundName;
  description: string;
  amount: number;
  date: string;
};

export type BudgetFile = {
  funds: Funds;
  transactions: Transaction[];
};

export type NewTransaction = Omit<Transaction, "id" | "date">;

export type MonthlyBudgets = {
  [yearMonth: string]: Record<FundName, number>;
};

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  monthlyContribution: number;
  currentAmount: number;
  createdAt: string;
};

export type BudgetData = {
  funds: Record<string, number>;
  transactions: any[];
  monthlyBudgets?: Record<string, Record<string, number>>;
  goals?: Goal[];
};