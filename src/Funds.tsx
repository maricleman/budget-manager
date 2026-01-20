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
          const pct = Math.min(Math.abs(value) / maxAbs, 1) * 50; // 50% max per side

          return (
            <div key={key} className="fund-row">
              <div className="fund-label">
                {icon} {label}
              </div>

              <div className="fund-bar-container center-zero">
                {/* Negative side */}
                <div className="bar-half left">
                  {value < 0 && (
                    <div
                      className="fund-bar negative"
                      style={{ width: `${pct}%` }}
                    />
                  )}
                </div>

                {/* Zero line */}
                <div className="zero-line" />

                {/* Positive side */}
                <div className="bar-half right">
                  {value > 0 && (
                    <div
                      className="fund-bar positive"
                      style={{ width: `${pct}%` }}
                    />
                  )}
                </div>
              </div>

              <div
                className={`fund-amount ${
                  value >= 0 ? "positive" : "negative"
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
