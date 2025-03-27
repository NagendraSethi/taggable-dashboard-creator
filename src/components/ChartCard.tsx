
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
import { MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TagsDisplay } from "./MetricCard";
import { useDashboard, Widget } from "@/contexts/DashboardContext";

interface ChartCardProps {
  id: string;
  className?: string;
}

// Custom tooltip component with clean styling
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-3 rounded-md shadow-lg border border-border text-sm">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} className="flex items-center space-x-2">
            <div 
              className="w-2 h-2 rounded-full" 
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
        className="drop-shadow-sm"
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

const ChartCard: React.FC<ChartCardProps> = ({ id, className = "" }) => {
  const { widgets } = useDashboard();
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
    
    if (type === "pie") return chartData;
    
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
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                tickLine={false} 
                axisLine={{ stroke: '#eaeaea' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false} 
                axisLine={false}
                width={35}
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
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                tickLine={false} 
                axisLine={{ stroke: '#eaeaea' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false} 
                axisLine={false}
                width={35}
              />
              <Tooltip content={<CustomTooltip />} />
              {data.datasets.map((dataset: any, index: number) => (
                <Bar
                  key={`bar-${index}`}
                  dataKey={dataset.label || `dataset${index}`}
                  fill={dataset.backgroundColor || COLORS[index % COLORS.length]}
                  radius={[4, 4, 0, 0]}
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
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                tickLine={false} 
                axisLine={{ stroke: '#eaeaea' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
                width={35}
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
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data.datasets[0].data.map((value: number, index: number) => ({
                  name: data.labels[index],
                  value
                }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={30}
                fill="#8884d8"
                dataKey="value"
              >
                {data.datasets[0].data.map((_: any, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={data.datasets[0].backgroundColor[index] || COLORS[index % COLORS.length]} 
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
                formatter={(value) => (
                  <span className="text-xs">{value}</span>
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
    <Card className={`overflow-hidden relative ${className}`}>
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="p-1 rounded-md hover:bg-secondary transition-colors">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => setTimeRange("week")}
                className={timeRange === "week" ? "bg-secondary/50" : ""}
              >
                Last Week
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setTimeRange("month")}
                className={timeRange === "month" ? "bg-secondary/50" : ""}
              >
                Last Month
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setTimeRange("all")}
                className={timeRange === "all" ? "bg-secondary/50" : ""}
              >
                All Time
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {renderChart()}
        
        <div className="mt-2">
          <TagsDisplay tagIds={tagIds} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
