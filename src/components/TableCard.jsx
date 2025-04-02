
import React from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TagsDisplay } from "./MetricCard";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

const TableCard = ({ id, className = "" }) => {
  const { widgets } = useDashboard();
  const widget = widgets.find(w => w.id === id);
  const { title, tags: tagIds, data } = widget;

  if (!data || !data.headers || !data.rows) {
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

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {data.headers.map((header, index) => (
                  <TableHead key={index} className="text-xs font-medium">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex} className="py-2">
                      {typeof cell === 'number' && data.headers[cellIndex] === 'Progress' ? (
                        <div className="flex items-center space-x-2">
                          <Progress value={cell} className="h-2" />
                          <span className="text-xs text-muted-foreground">{cell}%</span>
                        </div>
                      ) : (
                        <span className="text-sm">{cell}</span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4">
          <TagsDisplay tagIds={tagIds} />
        </div>
      </CardContent>
    </Card>
  );
};

export default TableCard;
