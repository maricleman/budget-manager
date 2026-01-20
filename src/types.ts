export type FundName =
  | "restaurant"
  | "grocery"
  | "adventure"
  | "gift"
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