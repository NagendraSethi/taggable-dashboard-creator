
import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useDashboard, Tag } from "@/contexts/DashboardContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  id: string;
  title: string;
  value: number | string;
  change?: number;
  changeType?: "increase" | "decrease" | "neutral";
  timeframe?: string;
  className?: string;
}

export const TagsDisplay: React.FC<{ tagIds: string[] }> = ({ tagIds }) => {
  const { tags } = useDashboard();
  const widgetTags = tags.filter(tag => tagIds.includes(tag.id));

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {widgetTags.map((tag) => (
        <span
          key={tag.id}
          className={`tag-item bg-tag-${tag.color} text-tag-${tag.color}-text text-[10px] px-2 py-0.5`}
        >
          {tag.name}
        </span>
      ))}
    </div>
  );
};

const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  change,
  changeType = "neutral",
  timeframe,
  className = "",
}) => {
  const { widgets } = useDashboard();
  const widget = widgets.find(w => w.id === id);
  const tagIds = widget?.tags || [];
  
  // Format value 
  const formattedValue = typeof value === "number" 
    ? new Intl.NumberFormat().format(value)
    : value;

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex justify-between items-start">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="text-3xl font-semibold mb-1">{formattedValue}</div>
          
          {change !== undefined && (
            <div className="flex items-center text-sm">
              {changeType === "increase" ? (
                <ArrowUp className="h-4 w-4 text-emerald-500 mr-1" />
              ) : changeType === "decrease" ? (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              ) : null}
              
              <span className={
                changeType === "increase" 
                  ? "text-emerald-500" 
                  : changeType === "decrease"
                    ? "text-red-500"
                    : "text-muted-foreground"
              }>
                {change > 0 ? "+" : ""}{change}%
              </span>
              
              {timeframe && (
                <span className="text-muted-foreground ml-1">
                  {timeframe}
                </span>
              )}
            </div>
          )}

          <TagsDisplay tagIds={tagIds} />
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
