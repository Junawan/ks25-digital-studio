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
}

export default function CartCard({
  cart,
  onDelete,
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

          {cart.map((item) => (

<CartItem

key={item.variantId}

item={item}

onDelete={onDelete}

/>

))}

        </div>
      )}
    </div>
  );
}