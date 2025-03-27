
import React from "react";
import { useDashboard, Widget } from "@/contexts/DashboardContext";
import ChartCard from "./ChartCard";
import MetricCard from "./MetricCard";
import TableCard from "./TableCard";
import StatusCard from "./StatusCard";

const DashboardGrid: React.FC = () => {
  const { filteredWidgets } = useDashboard();

  const getWidgetClasses = (widget: Widget) => {
    let classes = "animate-fade-in transition-all duration-300";
    
    // Add animation delay based on index for staggered effect
    const index = filteredWidgets.findIndex(w => w.id === widget.id);
    const delay = (index % 5) * 100; // 100ms increments, reset after 5 widgets
    classes += ` animation-delay-${delay}`;
    
    // Add size-specific classes
    if (widget.size === "sm") {
      classes += " col-span-1 row-span-1";
    } else if (widget.size === "md") {
      classes += " col-span-1 row-span-1 md:col-span-2 md:row-span-1";
    } else if (widget.size === "lg") {
      classes += " col-span-1 row-span-1 md:col-span-2 md:row-span-2";
    }
    
    return classes;
  };

  const renderWidget = (widget: Widget) => {
    const { id, type, data } = widget;
    
    switch (type) {
      case "line":
      case "bar":
      case "pie":
      case "area":
        return <ChartCard id={id} className="h-full" />;
      
      case "metric":
        return (
          <MetricCard 
            id={id}
            title={widget.title}
            value={data.value}
            change={data.change}
            changeType={data.changeType}
            timeframe={data.timeframe}
            className="h-full"
          />
        );
      
      case "table":
        return <TableCard id={id} className="h-full" />;
      
      case "status":
        return <StatusCard id={id} className="h-full" />;
      
      default:
        return (
          <div className="bg-card rounded-lg p-4 shadow">
            <h3 className="font-medium">{widget.title}</h3>
            <p className="text-sm text-muted-foreground">Unsupported widget type</p>
          </div>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-4">
      {filteredWidgets.length > 0 ? (
        filteredWidgets.map((widget) => (
          <div 
            key={widget.id} 
            className={getWidgetClasses(widget)}
            style={{ animationDelay: `${filteredWidgets.indexOf(widget) * 50}ms` }}
          >
            {renderWidget(widget)}
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-10">
          <p className="text-muted-foreground">No widgets match the selected filters</p>
        </div>
      )}
    </div>
  );
};

export default DashboardGrid;
