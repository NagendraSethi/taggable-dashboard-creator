
import React, { useState } from "react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  TooltipProps
} from "recharts";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { TagsDisplay } from "./MetricCard";
import { useDashboard, Widget } from "@/contexts/DashboardContext";
import "../styles/charts.css";

interface ChartCardProps {
  id: string;
  className?: string;
  onDelete?: () => void;
}

// Custom tooltip component with clean styling
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="custom-tooltip-label">{label}</p>
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} className="custom-tooltip-item">
            <div 
              className="custom-tooltip-color" 
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.name}: {entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Custom activeDot for line charts
const CustomActiveDot = (props: any) => {
  const { cx, cy, stroke, strokeWidth } = props;
  
  return (
    <g>
      <circle 
        cx={cx} 
        cy={cy} 
        r={5} 
        stroke={stroke} 
        strokeWidth={strokeWidth} 
        fill="white" 
        className="custom-active-dot-outer"
      />
      <circle 
        cx={cx} 
        cy={cy} 
        r={2.5} 
        stroke="none" 
        fill={stroke} 
      />
    </g>
  );
};

// Create palette for the pie chart
const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4', '#EF4444', '#F97316'];

// Custom pie chart label
const renderCustomizedPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor="middle" 
      dominantBaseline="central"
      className="recharts-pie-label-text"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ChartCard: React.FC<ChartCardProps> = ({ id, className = "", onDelete }) => {
  const { widgets, removeWidget } = useDashboard();
  const widget = widgets.find(w => w.id === id) as Widget;
  const { title, type, tags: tagIds, data } = widget;

  const [timeRange, setTimeRange] = useState("all");

  // Function to handle chart data filtering by time range
  const getFilteredData = () => {
    if (!data || !data.labels || !data.datasets) return data;
    
    if (timeRange === "all") return data;
    
    // Sample filtering logic - in a real app, this would filter based on dates
    let filteredLabels;
    let filteredDatasets = [...data.datasets];
    
    if (timeRange === "week") {
      // For demo, just take the last 7 items or fewer
      const length = data.labels.length;
      const start = Math.max(0, length - 7);
      filteredLabels = data.labels.slice(start);
      
      filteredDatasets = filteredDatasets.map(dataset => ({
        ...dataset,
        data: dataset.data.slice(start)
      }));
    } else if (timeRange === "month") {
      // For demo, take the last 30 items or fewer
      const length = data.labels.length;
      const start = Math.max(0, length - 30);
      filteredLabels = data.labels.slice(start);
      
      filteredDatasets = filteredDatasets.map(dataset => ({
        ...dataset,
        data: dataset.data.slice(start)
      }));
    }
    
    return {
      ...data,
      labels: filteredLabels,
      datasets: filteredDatasets
    };
  };

  // Transform data for recharts if needed
  const transformData = () => {
    if (!data) return [];
    
    const chartData = getFilteredData();
    
    if (type === "pie") {
      // Transform pie data to the correct format
      if (chartData.labels && chartData.datasets && chartData.datasets[0]) {
        return chartData.labels.map((label, i) => ({
          name: label,
          value: chartData.datasets[0].data[i] || 0
        }));
      }
      return [];
    }
    
    // For line, area, bar charts convert to recharts format
    if (chartData.labels && chartData.datasets) {
      return chartData.labels.map((label: string, index: number) => {
        const dataPoint: any = { name: label };
        
        chartData.datasets.forEach((dataset: any, datasetIndex: number) => {
          dataPoint[dataset.label || `dataset${datasetIndex}`] = dataset.data[index];
        });
        
        return dataPoint;
      });
    }
    
    return chartData;
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this widget?")) {
      removeWidget(id);
      if (onDelete) onDelete();
    }
  };

  // Function to render the appropriate chart based on type
  const renderChart = () => {
    const chartData = transformData();
    
    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              className="chart-container"
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="chart-grid" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                tickLine={false} 
                axisLine={{ stroke: 'var(--chart-axis-color)' }}
                className="chart-axis"
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false} 
                axisLine={false}
                width={35}
                className="chart-axis"
              />
              <Tooltip content={<CustomTooltip />} />
              {data.datasets.map((dataset: any, index: number) => (
                <Line
                  key={`line-${index}`}
                  type="monotone"
                  dataKey={dataset.label || `dataset${index}`}
                  stroke={dataset.borderColor || COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={<CustomActiveDot />}
                  className="chart-line"
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              className="chart-container"
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="chart-grid" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                tickLine={false} 
                axisLine={{ stroke: 'var(--chart-axis-color)' }}
                className="chart-axis"
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false} 
                axisLine={false}
                width={35}
                className="chart-axis"
              />
              <Tooltip content={<CustomTooltip />} />
              {data.datasets.map((dataset: any, index: number) => (
                <Bar
                  key={`bar-${index}`}
                  dataKey={dataset.label || `dataset${index}`}
                  fill={dataset.backgroundColor || COLORS[index % COLORS.length]}
                  radius={[4, 4, 0, 0]}
                  className="chart-bar"
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case "area":
        return (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              className="chart-container"
            >
              <defs>
                {data.datasets.map((dataset: any, index: number) => (
                  <linearGradient 
                    key={`gradient-${index}`} 
                    id={`colorGradient${index}`} 
                    x1="0" y1="0" x2="0" y2="1"
                  >
                    <stop 
                      offset="5%" 
                      stopColor={dataset.borderColor || COLORS[index % COLORS.length]} 
                      stopOpacity={0.8}
                    />
                    <stop 
                      offset="95%" 
                      stopColor={dataset.borderColor || COLORS[index % COLORS.length]} 
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="chart-grid" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                tickLine={false} 
                axisLine={{ stroke: 'var(--chart-axis-color)' }}
                className="chart-axis"
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
                width={35}
                className="chart-axis"
              />
              <Tooltip content={<CustomTooltip />} />
              {data.datasets.map((dataset: any, index: number) => (
                <Area
                  key={`area-${index}`}
                  type="monotone"
                  dataKey={dataset.label || `dataset${index}`}
                  stroke={dataset.borderColor || COLORS[index % COLORS.length]}
                  fillOpacity={1}
                  fill={`url(#colorGradient${index})`}
                  className="chart-area"
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart className="chart-container">
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedPieLabel}
                outerRadius={80}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                className="chart-pie"
                animationDuration={1500}
                animationEasing="ease-in-out"
              >
                {chartData.map((_: any, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={data.datasets[0]?.backgroundColor[index] || COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                iconSize={8}
                iconType="circle"
                className="chart-legend"
                formatter={(value) => (
                  <span className="chart-legend-label">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        );
        
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <Card className={`chart-card ${className}`}>
      <CardHeader className="chart-card-header">
        <div className="chart-card-title-row">
          <CardTitle className="chart-card-title">{title}</CardTitle>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="chart-card-menu-trigger">
              <div className="chart-card-menu-button">
                <MoreHorizontal className="chart-card-menu-icon" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="chart-card-menu-content">
              <DropdownMenuItem 
                onClick={() => setTimeRange("week")}
                className={timeRange === "week" ? "chart-card-menu-item-active" : ""}
              >
                Last Week
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setTimeRange("month")}
                className={timeRange === "month" ? "chart-card-menu-item-active" : ""}
              >
                Last Month
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setTimeRange("all")}
                className={timeRange === "all" ? "chart-card-menu-item-active" : ""}
              >
                All Time
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDelete}
                className="chart-card-menu-item-delete"
              >
                <Trash2 className="chart-card-delete-icon" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="chart-card-content">
        {renderChart()}
        
        <div className="chart-card-tags">
          <TagsDisplay tagIds={tagIds} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
