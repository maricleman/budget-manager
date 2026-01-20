import type { Funds as FundsType } from "./types";
import "./Funds.css";

type Props = {
  funds: FundsType;
};

const FUND_META: { key: keyof FundsType; label: string; icon: string }[] = [
  { key: "restaurant", label: "Restaurant", icon: "🍔" },
  { key: "grocery", label: "Grocery", icon: "🛒" },
  { key: "adventure", label: "Adventure", icon: "🏕️" },
  { key: "gift", label: "Gift", icon: "🎁" },
  { key: "david", label: "David", icon: "👨" },
  { key: "hannah", label: "Hannah", icon: "👩" },
];

export function Funds({ funds }: Props) {
  const values = Object.values(funds);
  const maxAbs = Math.max(...values.map(v => Math.abs(v)), 1);

  return (
    <div className="funds">
      <h2>Funds</h2>

      <div className="funds-list">
        {FUND_META.map(({ key, label, icon }) => {
          const value = funds[key];
          const pct = Math.min(Math.abs(value) / maxAbs, 1) * 100;
          const isPositive = value >= 0;

          return (
            <div key={key} className="fund-row">
              <div className="fund-label">
                {icon} {label}
              </div>

              <div className="fund-bar-container">
                <div
                  className={`fund-bar ${isPositive ? "positive" : "negative"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div
                className={`fund-amount ${
                  isPositive ? "positive" : "negative"
                }`}
              >
                ${value.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
