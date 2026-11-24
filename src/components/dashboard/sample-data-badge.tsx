import { Badge } from "@/components/ui/badge";

/** Makes it impossible to mistake the demo numbers for real business data. */
export function SampleDataBadge() {
  return (
    <Badge variant="outline" className="border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400">
      Sample data
    </Badge>
  );
}
