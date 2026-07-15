import {
  Trash2,
} from "lucide-react";

import { Button }
from "@/shared/components/ui/button";

import { CartItem as Item }
from "../types/transaction";

interface Props {

  item: Item;

  onDelete: (
    id: string
  ) => void;

}

export default function CartItem({

  item,

  onDelete,

}: Props) {

  return (

<div
className="
flex
items-center
justify-between
border-b
p-4
"
>

<div>

<p className="font-medium">

{item.productName}

</p>

<p
className="
text-sm
text-muted-foreground
"
>

{item.variantName}

</p>

</div>

<div
className="
flex
items-center
gap-4
"
>

<div
className="text-right"
>

<p>

{item.qty}
× Rp{" "}
{item.price.toLocaleString(
"id-ID"
)}

</p>

<p
className="
font-semibold
"
>

Rp{" "}
{item.subtotal.toLocaleString(
"id-ID"
)}

</p>

</div>

<Button

size="icon"

variant="ghost"

onClick={()=>

onDelete(
item.variantId
)

}

>

<Trash2
className="h-4 w-4"
/>

</Button>

</div>

</div>

);

}