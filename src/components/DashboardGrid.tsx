
import React, { useEffect } from "react";
import { useDashboard, Widget } from "@/contexts/DashboardContext";
import ChartCard from "./ChartCard";
import MetricCard from "./MetricCard";
import TableCard from "./TableCard";
import StatusCard from "./StatusCard";

const DashboardGrid: React.FC = () => {
  const { filteredWidgets } = useDashboard();

  // Add debug logging
  useEffect(() => {
    console.log("DashboardGrid rendering with filtered widgets count:", filteredWidgets.length);
    console.log("Widget tags:", filteredWidgets.map(w => w.tags));
  }, [filteredWidgets]);

  const getWidgetClasses = (widget: Widget) => {
    let classes = "fade-in widget-card";
    
    // Add animation delay based on index for staggered effect
    const index = filteredWidgets.findIndex(w => w.id === widget.id);
    const delay = (index % 5) * 100; // 100ms increments, reset after 5 widgets
    
    // Add size-specific classes
    if (widget.size === "sm") {
      classes += " widget-size-sm";
    } else if (widget.size === "md") {
      classes += " widget-size-md";
    } else if (widget.size === "lg") {
      classes += " widget-size-lg";
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
          <div className="widget-card">
            <div className="widget-card-header">
              <h3 className="widget-card-title">{widget.title}</h3>
            </div>
            <div className="widget-card-content">
              <p className="response-text">Unsupported widget type</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-grid">
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
        <div className="empty-state">
          <p className="response-text">No widgets match the selected filters</p>
        </div>
      )}
    </div>
  );
};

export default DashboardGrid;
