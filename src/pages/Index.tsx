
import React, { useState, useEffect } from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import Navbar from "@/components/Navbar";
import TagSelector from "@/components/TagFilter";
import DashboardGrid from "@/components/DashboardGrid";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const Index = () => {
  const { widgets, tags, addWidget } = useDashboard();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // New widget form state
  const [newWidget, setNewWidget] = useState({
    title: "",
    type: "line" as const,
    size: "md" as const,
    tags: [] as string[],
  });

  useEffect(() => {
    // Simulate loading state for smooth animations
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleAddWidget = () => {
    if (!newWidget.title) {
      toast.error("Please provide a widget title");
      return;
    }
    
    // Create sample data based on the widget type
    let sampleData;
    
    switch (newWidget.type) {
      case "line":
        sampleData = {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Data",
              data: [Math.random() * 100, Math.random() * 100, Math.random() * 100, 
                    Math.random() * 100, Math.random() * 100, Math.random() * 100],
              borderColor: "#3B82F6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
            }
          ]
        };
        break;
        
      case "bar":
        sampleData = {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          datasets: [
            {
              label: "Data",
              data: [Math.random() * 100, Math.random() * 100, Math.random() * 100, 
                    Math.random() * 100, Math.random() * 100],
              backgroundColor: "#10B981",
            }
          ]
        };
        break;
        
      case "pie":
        sampleData = {
          labels: ["Category A", "Category B", "Category C", "Category D"],
          datasets: [
            {
              data: [25, 30, 15, 30],
              backgroundColor: ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B"],
            }
          ]
        };
        break;
        
      case "area":
        sampleData = {
          labels: ["Q1", "Q2", "Q3", "Q4"],
          datasets: [
            {
              label: "Data",
              data: [Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100],
              fill: true,
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderColor: "#3B82F6",
            }
          ]
        };
        break;
        
      case "metric":
        sampleData = {
          value: Math.floor(Math.random() * 1000),
          change: +(Math.random() * 20 - 10).toFixed(1),
          changeType: Math.random() > 0.5 ? "increase" : "decrease",
          timeframe: "This month"
        };
        break;
        
      case "table":
        sampleData = {
          headers: ["Name", "Value", "Status"],
          rows: [
            ["Item A", Math.floor(Math.random() * 100), "Active"],
            ["Item B", Math.floor(Math.random() * 100), "Pending"],
            ["Item C", Math.floor(Math.random() * 100), "Completed"]
          ]
        };
        break;
        
      case "status":
        sampleData = {
          systems: [
            { name: "System A", status: "operational" },
            { name: "System B", status: Math.random() > 0.7 ? "degraded" : "operational" },
            { name: "System C", status: "operational" }
          ]
        };
        break;
        
      default:
        sampleData = {};
    }
    
    // Add the new widget
    addWidget({
      title: newWidget.title,
      type: newWidget.type,
      size: newWidget.size,
      tags: newWidget.tags,
      data: sampleData
    });
    
    // Reset form and close dialog
    setNewWidget({
      title: "",
      type: "line",
      size: "md",
      tags: [],
    });
    
    setDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6 md:px-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              {widgets.length} widgets available • {tags.length} tags
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Add Widget</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Widget</DialogTitle>
                <DialogDescription>
                  Create a new widget to display on your dashboard.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Widget Title</Label>
                  <Input 
                    id="title" 
                    value={newWidget.title}
                    onChange={(e) => setNewWidget({ ...newWidget, title: e.target.value })}
                    placeholder="Enter widget title"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="type">Widget Type</Label>
                  <Select 
                    value={newWidget.type}
                    onValueChange={(value) => setNewWidget({ 
                      ...newWidget, 
                      type: value as any 
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select widget type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="pie">Pie Chart</SelectItem>
                        <SelectItem value="area">Area Chart</SelectItem>
                        <SelectItem value="metric">Metric Card</SelectItem>
                        <SelectItem value="table">Table</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="size">Widget Size</Label>
                  <Select 
                    value={newWidget.size}
                    onValueChange={(value) => setNewWidget({ 
                      ...newWidget, 
                      size: value as any 
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select widget size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="sm">Small (1x1)</SelectItem>
                        <SelectItem value="md">Medium (2x1)</SelectItem>
                        <SelectItem value="lg">Large (2x2)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Select 
                    value={newWidget.tags.length ? newWidget.tags[0] : undefined}
                    onValueChange={(value) => setNewWidget({ 
                      ...newWidget, 
                      tags: [value] 
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {tags.map((tag) => (
                          <SelectItem key={tag.id} value={tag.id}>
                            {tag.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddWidget}>
                  Add Widget
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="space-y-6">
          <TagSelector />
          <DashboardGrid />
        </div>
      </main>
    </div>
  );
};

export default Index;
