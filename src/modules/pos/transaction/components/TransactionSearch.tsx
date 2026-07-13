import { Search } from "lucide-react";

import { Input }
from "@/shared/components/ui/input";

export default function TransactionSearch() {
  return (
    <div className="
rounded-2xl
border
border-zinc-200
bg-white
shadow-sm
">

      <Search
        className="
        absolute
        left-3
        top-3
        h-4
        w-4
        text-muted-foreground
        "
      />

      <Input
  className="
    h-12
    border-zinc-300
    bg-white
    text-zinc-900
    placeholder:text-zinc-500
  "
/>

    </div>
  );
}