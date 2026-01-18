import type { Funds as FundsType } from "./types";

type Props = {
  funds: FundsType;
};

export function Funds({ funds }: Props) {
  return (
    <div>
      <h2>Funds</h2>
      <ul>
        <li>🍔 Restaurant: ${funds.restaurant.toFixed(2)}</li>
        <li>🛒 Grocery: ${funds.grocery.toFixed(2)}</li>
        <li>🏕️ Adventure: ${funds.adventure.toFixed(2)}</li>
        <li>🎁 Gift: ${funds.gift.toFixed(2)}</li>
        <li>👨 David: ${funds.david.toFixed(2)}</li>
        <li>👩 Hannah: ${funds.hannah.toFixed(2)}</li>
      </ul>
    </div>
  );
}
