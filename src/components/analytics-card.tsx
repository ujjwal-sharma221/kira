import { TriangleUpIcon, TriangleDownIcon } from "@radix-ui/react-icons";

import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: number;
  increaseValue: number;
  variant: "up" | "down";
}

export function AnalyticsCard({
  increaseValue,
  title,
  value,
  variant,
}: AnalyticsCardProps) {
  const iconColor = variant === "up" ? "text-emerald-500" : "text-red-500";
  const increaseValueColor =
    variant === "up" ? "text-emerald-500" : "text-red-500";
  const Icon = variant === "up" ? TriangleUpIcon : TriangleDownIcon;

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader>
        <div className="flex items-center gap-x-2.5">
          <CardDescription className="flex items-center gap-x-2 overflow-hidden font-medium">
            <span className="truncate text-base">{title}</span>
          </CardDescription>
          <div className="flex items-center gap-x-1">
            <Icon className={cn("size-4", iconColor)} />
            <span
              className={cn(
                "truncate text-base font-medium",
                increaseValueColor,
              )}
            >
              {increaseValue}
            </span>
          </div>
        </div>
        <CardTitle className="3xl font-semibold">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
