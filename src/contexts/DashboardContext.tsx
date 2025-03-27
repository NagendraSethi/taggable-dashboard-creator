
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Types
export type TagColors = 
  | "blue" 
  | "green" 
  | "purple" 
  | "orange" 
  | "pink" 
  | "cyan" 
  | "red" 
  | "yellow";

export interface Tag {
  id: string;
  name: string;
  color: TagColors;
}

export type WidgetType = 
  | "line" 
  | "bar" 
  | "pie" 
  | "area" 
  | "metric" 
  | "table" 
  | "status";

export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  tags: string[]; // Tag IDs
  data?: any;
  size: "sm" | "md" | "lg"; // sm: 1x1, md: 2x1, lg: 2x2
  position?: { x: number; y: number };
}

interface DashboardContextType {
  widgets: Widget[];
  tags: Tag[];
  activeTagIds: string[];
  filteredWidgets: Widget[];
  addWidget: (widget: Omit<Widget, "id">) => void;
  updateWidget: (id: string, widget: Partial<Widget>) => void;
  removeWidget: (id: string) => void;
  addTag: (tag: Omit<Tag, "id">) => void;
  updateTag: (id: string, tag: Partial<Tag>) => void;
  removeTag: (id: string) => void;
  toggleTagFilter: (id: string) => void;
  clearTagFilters: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Sample data for initial state
const sampleTags: Tag[] = [
  { id: "tag-1", name: "Finance", color: "green" },
  { id: "tag-2", name: "Marketing", color: "purple" },
  { id: "tag-3", name: "Sales", color: "blue" },
  { id: "tag-4", name: "Operations", color: "orange" },
  { id: "tag-5", name: "HR", color: "pink" },
  { id: "tag-6", name: "IT", color: "cyan" }
];

const sampleWidgets: Widget[] = [
  {
    id: "widget-1",
    title: "Monthly Revenue",
    type: "line",
    tags: ["tag-1"],
    size: "md",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "2023",
          data: [5000, 7500, 6500, 8000, 9500, 11000],
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
        }
      ]
    }
  },
  {
    id: "widget-2",
    title: "Sales by Department",
    type: "pie",
    tags: ["tag-1", "tag-3"],
    size: "md",
    data: {
      labels: ["Marketing", "Sales", "Support", "Development"],
      datasets: [
        {
          data: [25, 40, 15, 20],
          backgroundColor: ["#8B5CF6", "#3B82F6", "#EC4899", "#10B981"],
        }
      ]
    }
  },
  {
    id: "widget-3",
    title: "Website Visitors",
    type: "bar",
    tags: ["tag-2"],
    size: "lg",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Visitors",
          data: [2500, 3200, 2800, 3600, 4200, 3800, 2900],
          backgroundColor: "#10B981",
        }
      ]
    }
  },
  {
    id: "widget-4",
    title: "New Customers",
    type: "metric",
    tags: ["tag-3"],
    size: "sm",
    data: {
      value: 1284,
      change: 12.4,
      changeType: "increase",
      timeframe: "This month"
    }
  },
  {
    id: "widget-5",
    title: "Tickets Resolved",
    type: "metric",
    tags: ["tag-4", "tag-6"],
    size: "sm",
    data: {
      value: 384,
      change: 5.2,
      changeType: "increase",
      timeframe: "This week"
    }
  },
  {
    id: "widget-6",
    title: "Active Projects",
    type: "table",
    tags: ["tag-6"],
    size: "lg",
    data: {
      headers: ["Project", "Status", "Deadline", "Progress"],
      rows: [
        ["Website Redesign", "In Progress", "Jun 30", 65],
        ["Mobile App", "Planning", "Aug 15", 25],
        ["CRM Integration", "Completed", "May 10", 100],
        ["Data Migration", "In Progress", "Jul 12", 80]
      ]
    }
  },
  {
    id: "widget-7",
    title: "Employee Satisfaction",
    type: "area",
    tags: ["tag-5"],
    size: "md",
    data: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      datasets: [
        {
          label: "2023",
          data: [75, 82, 80, 85],
          fill: true,
          backgroundColor: "rgba(236, 72, 153, 0.1)",
          borderColor: "#EC4899",
        }
      ]
    }
  },
  {
    id: "widget-8",
    title: "System Status",
    type: "status",
    tags: ["tag-6"],
    size: "sm",
    data: {
      systems: [
        { name: "API", status: "operational" },
        { name: "Database", status: "operational" },
        { name: "Authentication", status: "operational" },
        { name: "Storage", status: "degraded" }
      ]
    }
  }
];

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [widgets, setWidgets] = useState<Widget[]>(sampleWidgets);
  const [tags, setTags] = useState<Tag[]>(sampleTags);
  const [activeTagIds, setActiveTagIds] = useState<string[]>([]);
  
  // Calculate filtered widgets based on active tags
  const filteredWidgets = React.useMemo(() => {
    if (activeTagIds.length === 0) {
      return widgets;
    }
    
    return widgets.filter(widget => 
      widget.tags.some(tagId => activeTagIds.includes(tagId))
    );
  }, [widgets, activeTagIds]);

  // Add a new widget
  const addWidget = (widget: Omit<Widget, "id">) => {
    const newWidget = {
      ...widget,
      id: `widget-${Date.now()}`,
    };
    setWidgets(prev => [...prev, newWidget]);
    toast.success("Widget added successfully");
  };

  // Update an existing widget
  const updateWidget = (id: string, updates: Partial<Widget>) => {
    setWidgets(prev => 
      prev.map(widget => 
        widget.id === id ? { ...widget, ...updates } : widget
      )
    );
    toast.success("Widget updated");
  };

  // Remove a widget
  const removeWidget = (id: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== id));
    toast.success("Widget removed");
  };

  // Add a new tag
  const addTag = (tag: Omit<Tag, "id">) => {
    const newTag = {
      ...tag,
      id: `tag-${Date.now()}`,
    };
    setTags(prev => [...prev, newTag]);
    toast.success("Tag added successfully");
  };

  // Update an existing tag
  const updateTag = (id: string, updates: Partial<Tag>) => {
    setTags(prev => 
      prev.map(tag => 
        tag.id === id ? { ...tag, ...updates } : tag
      )
    );
    toast.success("Tag updated");
  };

  // Remove a tag
  const removeTag = (id: string) => {
    // Also remove this tag from all widgets
    setWidgets(prev => 
      prev.map(widget => ({
        ...widget,
        tags: widget.tags.filter(tagId => tagId !== id)
      }))
    );
    setTags(prev => prev.filter(tag => tag.id !== id));
    // Remove from active filters if present
    if (activeTagIds.includes(id)) {
      setActiveTagIds(prev => prev.filter(tagId => tagId !== id));
    }
    toast.success("Tag removed");
  };

  // Toggle a tag in the filter
  const toggleTagFilter = (id: string) => {
    setActiveTagIds(prev => 
      prev.includes(id)
        ? prev.filter(tagId => tagId !== id)
        : [...prev, id]
    );
  };

  // Clear all tag filters
  const clearTagFilters = () => {
    setActiveTagIds([]);
  };

  const value = {
    widgets,
    tags,
    activeTagIds,
    filteredWidgets,
    addWidget,
    updateWidget,
    removeWidget,
    addTag,
    updateTag,
    removeTag,
    toggleTagFilter,
    clearTagFilters,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
