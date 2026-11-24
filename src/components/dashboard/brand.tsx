import { Boxes } from "lucide-react";

export function Brand() {
  return (
    <div className="flex items-center gap-2 px-3 font-semibold">
      <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Boxes className="size-4" />
      </span>
      SaaS Starter
    </div>
  );
}
