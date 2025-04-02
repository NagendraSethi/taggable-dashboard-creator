
import React, { useState, useEffect } from "react";
import { useDashboard, WidgetType } from "@/contexts/DashboardContext";
import Navbar from "@/components/Navbar";
import TagSelector from "@/components/TagFilter";
import DashboardGrid from "@/components/DashboardGrid";
import NpsOverview from "@/components/NpsOverview";
import SurveyList from "@/components/SurveyList";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const Index = () => {
  const { widgets, tags, addWidget } = useDashboard();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  const [newWidget, setNewWidget] = useState({
    title: "",
    type: "line" as WidgetType,
    size: "md" as const,
    tags: [] as string[],
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle checkbox change for multiple tag selection
  const handleTagCheckboxChange = (tagId: string) => {
    setNewWidget(prev => {
      const newTags = [...prev.tags];
      if (newTags.includes(tagId)) {
        // Remove tag if already selected
        return {
          ...prev,
          tags: newTags.filter(id => id !== tagId)
        };
      } else {
        // Add tag if not selected
        return {
          ...prev,
          tags: [...newTags, tagId]
        };
      }
    });
  };

  const handleAddWidget = () => {
    if (!newWidget.title) {
      toast.error("Please provide a widget title");
      return;
    }
    
    if (newWidget.tags.length === 0) {
      toast.error("Please select at least one tag");
      return;
    }
    
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
    
    addWidget({
      title: newWidget.title,
      type: newWidget.type,
      size: newWidget.size,
      tags: newWidget.tags,
      data: sampleData
    });
    
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
            <h1 className="text-2xl font-semibold tracking-tight">NPS Survey Dashboard</h1>
            <p className="text-muted-foreground">
              Track and analyze customer feedback across all departments
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
                      type: value as WidgetType 
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
                  <Label>Tags (select multiple)</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                    {tags.map((tag) => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag.id}`}
                          checked={newWidget.tags.includes(tag.id)}
                          onCheckedChange={() => handleTagCheckboxChange(tag.id)}
                        />
                        <Label 
                          htmlFor={`tag-${tag.id}`}
                          className={`text-sm cursor-pointer tag-item bg-tag-${tag.color} text-tag-${tag.color}-text`}
                        >
                          {tag.name}
                        </Label>
                      </div>
                    ))}
                  </div>
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="widgets">Widgets</TabsTrigger>
            <TabsTrigger value="surveys">Surveys</TabsTrigger>
          </TabsList>
          
          <div className="space-y-4">
            <TagSelector />
            
            <TabsContent value="overview" className="space-y-6">
              <NpsOverview />
              <SurveyList />
            </TabsContent>
            
            <TabsContent value="widgets">
              <DashboardGrid />
            </TabsContent>
            
            <TabsContent value="surveys">
              <div className="space-y-6">
                <SurveyList />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
