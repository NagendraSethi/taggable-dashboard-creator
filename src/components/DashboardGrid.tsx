
import React, { useEffect } from "react";
import { useDashboard, Widget } from "@/contexts/DashboardContext";
import ChartCard from "./ChartCard";
import MetricCard from "./MetricCard";
import TableCard from "./TableCard";
import StatusCard from "./StatusCard";
import "../styles/dashboard.css"; // We'll create this file for custom styling

const DashboardGrid: React.FC = () => {
  const { filteredWidgets, removeWidget } = useDashboard();

  // Add debug logging
  useEffect(() => {
    console.log("DashboardGrid rendering with filtered widgets count:", filteredWidgets.length);
    console.log("Widget tags:", filteredWidgets.map(w => w.tags));
  }, [filteredWidgets]);

  // Group widgets by type for organizing in the grid
  const metricWidgets = filteredWidgets.filter(w => w.type === "metric");
  const otherWidgets = filteredWidgets.filter(w => w.type !== "metric");

  const getWidgetClasses = (widget: Widget) => {
    let classes = "widget-card";
    
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
        return <ChartCard id={id} onDelete={() => handleDeleteWidget(id)} className="h-full" />;
      
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
          <div className="widget-card-default">
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

  const handleDeleteWidget = (id: string) => {
    if (window.confirm("Are you sure you want to delete this widget?")) {
      removeWidget(id);
    }
  };

  return (
    <div className="space-y-6">
      {metricWidgets.length > 0 && (
        <div className="dashboard-overview">
          {metricWidgets.map((widget, index) => (
            <div 
              key={widget.id} 
              className={getWidgetClasses(widget)}
              style={{ 
                animationDelay: `${index * 50}ms`,
                visibility: 'visible' 
              }}
            >
              {renderWidget(widget)}
            </div>
          ))}
        </div>
      )}
      
      <div className="dashboard-grid">
        {otherWidgets.length > 0 ? (
          otherWidgets.map((widget, index) => (
            <div 
              key={widget.id} 
              className={getWidgetClasses(widget)}
              style={{ 
                animationDelay: `${index * 50}ms`,
                visibility: 'visible' 
              }}
            >
              {renderWidget(widget)}
            </div>
          ))
        ) : (
          metricWidgets.length === 0 && (
            <div className="empty-state">
              <p className="response-text">No widgets match the selected filters</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DashboardGrid;
