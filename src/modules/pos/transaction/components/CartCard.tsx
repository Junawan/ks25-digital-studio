import EmptyCart from "./EmptyCart";

import type {
  CartItem as CartItemType,
} from "../types/transaction";

import CartItem from "./CartItem";

interface Props {
  cart: CartItemType[];

  onDelete: (
    variantId: string
  ) => void;

  onIncreaseQty: (
    variantId: string
  ) => void;

  onDecreaseQty: (
    variantId: string
  ) => void;

  onUpdateQty: (
    variantId: string,
    qty: number
  ) => void;
}

export default function CartCard({
  cart,
  onDelete,
  onIncreaseQty,
  onDecreaseQty,
  onUpdateQty,
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
        <div className="p-4 space-y-4">
          {cart.map((item) => (
            <CartItem
              key={item.variantId}
              item={item}
              onDelete={onDelete}
              onIncreaseQty={
                onIncreaseQty
              }
              onDecreaseQty={
                onDecreaseQty
              }
              onUpdateQty={
                onUpdateQty
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}