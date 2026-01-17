export type FundName =
  | "restaurant"
  | "grocery"
  | "adventure"
  | "david"
  | "hannah";

export type Funds = Record<FundName, number>;

export type Transaction = {
  id: string;
  person: "david" | "hannah";
  fund: FundName;
  description: string;
  amount: number;
  timestamp: number;
};

export type BudgetFile = {
  funds: Funds;
  transactions: Transaction[];
};
