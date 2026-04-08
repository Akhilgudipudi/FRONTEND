import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: string;
  variant?: "default" | "warning" | "danger" | "success";
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  variant = "default",
}: StatsCardProps) {
  const variantStyles = {
    default: "bg-blue-100 text-blue-600",
    warning: "bg-yellow-100 text-yellow-600",
    danger: "bg-red-100 text-red-600",
    success: "bg-green-100 text-green-600",
  };

  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          
          {/* LEFT CONTENT */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">{title}</p>

            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              {value}
            </h2>

            {description && (
              <p className="text-xs text-gray-400">{description}</p>
            )}

            {trend && (
              <p className="text-xs font-medium text-indigo-500">{trend}</p>
            )}
          </div>

          {/* ICON */}
          <div
            className={`p-3 rounded-xl ${variantStyles[variant]} shadow-inner`}
          >
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
