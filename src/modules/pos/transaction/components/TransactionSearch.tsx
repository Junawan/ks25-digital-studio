import { Search } from "lucide-react";

import { Input }
from "@/shared/components/ui/input";

export default function TransactionSearch() {
  return (
    <div className="relative">

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
    bg-zinc-900
    border-zinc-700
    text-white
    placeholder:text-zinc-500
"
/>

    </div>
  );
}