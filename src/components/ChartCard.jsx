
import React from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TagsDisplay } from "./MetricCard";
import { LineChart, BarChart, AreaChart, PieChart } from "recharts";
import { Line, Bar, Area, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChartCard = ({ id, onDelete, className = "" }) => {
  const { widgets } = useDashboard();
  const widget = widgets.find(w => w.id === id);
  
  if (!widget) {
    return null;
  }
  
  const { title, type, tags: tagIds, data } = widget;

  if (!data || !data.chart) {
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

  const renderChart = () => {
    const chartData = data.chart;
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {data.series && data.series.map((item, index) => (
                <Line 
                  key={item.name} 
                  type="monotone" 
                  dataKey={item.key}
                  name={item.name}
                  stroke={colors[index % colors.length]}
                  activeDot={{ r: 8 }} 
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {data.series && data.series.map((item, index) => (
                <Bar 
                  key={item.name}
                  dataKey={item.key}
                  name={item.name}
                  fill={colors[index % colors.length]} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case "area":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {data.series && data.series.map((item, index) => (
                <Area 
                  key={item.name}
                  type="monotone" 
                  dataKey={item.key}
                  name={item.name}
                  fill={colors[index % colors.length]}
                  stroke={colors[index % colors.length]}
                  fillOpacity={0.3}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
        
      default:
        return <p>Unsupported chart type</p>;
    }
  };

  return (
    <Card className={`chart-card ${className}`}>
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {onDelete && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="chart-container">
          {renderChart()}
        </div>
        <div className="mt-2">
          <TagsDisplay tagIds={tagIds} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
