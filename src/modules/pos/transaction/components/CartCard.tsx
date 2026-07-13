import EmptyCart from "./EmptyCart";

import { CartItem }
from "../types/transaction";

interface Props {
  cart: CartItem[];
}

export default function CartCard({
  cart,
}: Props) {
  return (
    <div
      className="
      rounded-xl
      border
      bg-card
      "
    >
      {cart.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="p-4">

          Cart List

        </div>
      )}
    </div>
  );
}