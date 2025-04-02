
import React from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TagsDisplay } from "./MetricCard";
import { CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";

const StatusCard = ({ id, className = "" }) => {
  const { widgets } = useDashboard();
  const widget = widgets.find(w => w.id === id);
  const { title, tags: tagIds, data } = widget;

  if (!data || !data.systems) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "outage":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "operational":
        return "Operational";
      case "degraded":
        return "Degraded";
      case "outage":
        return "Outage";
      default:
        return "Unknown";
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.systems.map((system, index) => (
            <div key={index} className="flex items-center justify-between border-b border-border last:border-0 pb-2 last:pb-0">
              <div className="font-medium text-sm">{system.name}</div>
              <div className="flex items-center space-x-1.5">
                {getStatusIcon(system.status)}
                <span
                  className={`text-xs font-medium ${
                    system.status === "operational"
                      ? "text-emerald-500"
                      : system.status === "degraded"
                      ? "text-amber-500"
                      : "text-red-500"
                  }`}
                >
                  {getStatusText(system.status)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <TagsDisplay tagIds={tagIds} />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
