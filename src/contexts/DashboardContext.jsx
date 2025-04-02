
import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

// Create context
const DashboardContext = createContext({});

// Sample data
const initialWidgets = [
  {
    id: "widget-1",
    type: "metric",
    title: "Total Users",
    size: "sm",
    tags: ["tag-1", "tag-3"],
    data: {
      value: 8249,
      change: 12.2,
      changeType: "increase",
      timeframe: "vs. last month"
    }
  },
  {
    id: "widget-2",
    type: "line",
    title: "User Growth",
    size: "md",
    tags: ["tag-1"],
    data: {
      chart: [
        { name: 'Jan', users: 4000 },
        { name: 'Feb', users: 3000 },
        { name: 'Mar', users: 5000 },
        { name: 'Apr', users: 7000 },
        { name: 'May', users: 6000 },
        { name: 'Jun', users: 8000 }
      ],
      series: [{ key: 'users', name: 'Active Users' }]
    }
  },
  {
    id: "widget-3",
    type: "bar",
    title: "Revenue by Channel",
    size: "lg",
    tags: ["tag-2", "tag-3"],
    data: {
      chart: [
        { name: 'Direct', value: 5000 },
        { name: 'Affiliate', value: 3000 },
        { name: 'Social', value: 9000 },
        { name: 'Email', value: 7000 }
      ],
      series: [{ key: 'value', name: 'Revenue ($)' }]
    }
  },
  {
    id: "widget-4",
    type: "pie",
    title: "Traffic Sources",
    size: "md",
    tags: ["tag-1", "tag-2"],
    data: {
      chart: [
        { name: 'Organic', value: 400 },
        { name: 'Paid', value: 300 },
        { name: 'Referral', value: 200 },
        { name: 'Social', value: 100 }
      ]
    }
  },
  {
    id: "widget-5",
    type: "table",
    title: "Recent Transactions",
    size: "lg",
    tags: ["tag-2"],
    data: {
      headers: ["Customer", "Date", "Amount", "Status"],
      rows: [
        ["Alex Smith", "2023-06-01", "$156.00", "Completed"],
        ["Emma Johnson", "2023-05-28", "$242.00", "Processing"],
        ["Michael Brown", "2023-05-27", "$98.50", "Completed"],
        ["Olivia Wilson", "2023-05-26", "$531.20", "Failed"]
      ]
    }
  },
  {
    id: "widget-6",
    type: "area",
    title: "Website Traffic",
    size: "md",
    tags: ["tag-3"],
    data: {
      chart: [
        { name: 'Mon', desktop: 4000, mobile: 2400 },
        { name: 'Tue', desktop: 3000, mobile: 1398 },
        { name: 'Wed', desktop: 2000, mobile: 9800 },
        { name: 'Thu', desktop: 2780, mobile: 3908 },
        { name: 'Fri', desktop: 1890, mobile: 4800 },
        { name: 'Sat', desktop: 2390, mobile: 3800 },
        { name: 'Sun', desktop: 3490, mobile: 4300 }
      ],
      series: [
        { key: 'desktop', name: 'Desktop' },
        { key: 'mobile', name: 'Mobile' }
      ]
    }
  },
  {
    id: "widget-7",
    type: "metric",
    title: "Conversion Rate",
    size: "sm",
    tags: ["tag-1", "tag-2"],
    data: {
      value: "3.2%",
      change: -0.8,
      changeType: "decrease",
      timeframe: "vs. last week"
    }
  },
  {
    id: "widget-8",
    type: "status",
    title: "System Status",
    size: "md",
    tags: ["tag-3"],
    data: {
      systems: [
        { name: "API", status: "operational" },
        { name: "Dashboard", status: "operational" },
        { name: "Database", status: "degraded" },
        { name: "Authentication", status: "operational" },
        { name: "Storage", status: "outage" }
      ]
    }
  }
];

const initialTags = [
  { id: "tag-1", name: "Marketing", color: "blue", category: "department" },
  { id: "tag-2", name: "Sales", color: "green", category: "department" },
  { id: "tag-3", name: "Engineering", color: "purple", category: "department" },
  { id: "tag-4", name: "Q1 2023", color: "orange", category: "time" },
  { id: "tag-5", name: "Q2 2023", color: "pink", category: "time" },
  { id: "tag-6", name: "NPS", color: "amber", category: "survey" },
  { id: "tag-7", name: "CSAT", color: "red", category: "survey" }
];

// Sample surveys data
const initialSurveys = [
  {
    id: "survey-1",
    title: "Customer Satisfaction Q1 2023",
    tags: ["tag-4", "tag-7"],
    createdAt: "2023-03-15T12:00:00Z",
    endedAt: "2023-03-31T23:59:59Z",
    responses: [
      { id: "r1", score: 8, comments: "Great service!" },
      { id: "r2", score: 9, comments: "Very helpful staff" },
      { id: "r3", score: 7, comments: "Good, but could improve website navigation" },
      { id: "r4", score: 10, comments: "Exceptional experience" }
    ]
  },
  {
    id: "survey-2",
    title: "Net Promoter Score Q2 2023",
    tags: ["tag-5", "tag-6"],
    createdAt: "2023-06-10T09:00:00Z",
    endedAt: "2023-06-25T23:59:59Z",
    responses: [
      { id: "r5", score: 9, comments: "Would definitely recommend" },
      { id: "r6", score: 10, comments: "Best service ever!" },
      { id: "r7", score: 6, comments: "Customer service needs improvement" },
      { id: "r8", score: 7, comments: "Good product, reasonable price" },
      { id: "r9", score: 8, comments: "Fast delivery" }
    ]
  }
];

// Provider component
export const DashboardProvider = ({ children }) => {
  const [widgets, setWidgets] = useState(initialWidgets);
  const [tags, setTags] = useState(initialTags);
  const [surveys, setSurveys] = useState(initialSurveys);
  const [activeTagIds, setActiveTagIds] = useState([]);
  const [filteredWidgets, setFilteredWidgets] = useState(widgets);

  // Update filtered widgets when activeTagIds changes
  useEffect(() => {
    console.info("Active tag IDs updated:", activeTagIds);
    
    if (activeTagIds.length === 0) {
      setFilteredWidgets(widgets);
    } else {
      const filtered = widgets.filter(widget => {
        return activeTagIds.some(id => widget.tags.includes(id));
      });
      setFilteredWidgets(filtered);
    }
    
    console.info("Filtered widgets count:", filteredWidgets.length);
  }, [activeTagIds, widgets]);

  // Add tag
  const addTag = (tag) => {
    const newTag = {
      id: `tag-${uuidv4()}`,
      ...tag
    };
    setTags([...tags, newTag]);
    return newTag.id;
  };

  // Remove tag
  const removeTag = (id) => {
    // First remove tag from active tags if present
    setActiveTagIds(activeTagIds.filter(tagId => tagId !== id));
    
    // Update widgets to remove this tag reference
    setWidgets(widgets.map(widget => ({
      ...widget,
      tags: widget.tags.filter(tagId => tagId !== id)
    })));
    
    // Finally, remove the tag
    setTags(tags.filter(tag => tag.id !== id));
  };

  // Add widget
  const addWidget = (widget) => {
    const newWidget = {
      id: `widget-${uuidv4()}`,
      ...widget
    };
    setWidgets([newWidget, ...widgets]);
    return newWidget.id;
  };

  // Remove widget
  const removeWidget = (id) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
  };

  // Update widget
  const updateWidget = (id, updatedFields) => {
    setWidgets(widgets.map(widget => {
      if (widget.id === id) {
        return { ...widget, ...updatedFields };
      }
      return widget;
    }));
  };

  // Toggle tag selection
  const toggleTag = (tagId) => {
    setActiveTagIds(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  // Set multiple tags at once
  const setActiveTags = (tagIds) => {
    setActiveTagIds(tagIds);
  };

  // Reset tag selection
  const resetTagSelection = () => {
    setActiveTagIds([]);
  };

  // Calculate NPS score for a survey
  const calculateNpsScore = (surveyId) => {
    const survey = surveys.find(s => s.id === surveyId);
    if (!survey || survey.responses.length === 0) return 0;
    
    const responses = survey.responses;
    const promoters = responses.filter(r => r.score >= 9).length;
    const detractors = responses.filter(r => r.score <= 6).length;
    
    return Math.round(((promoters - detractors) / responses.length) * 100);
  };

  return (
    <DashboardContext.Provider
      value={{
        widgets,
        filteredWidgets,
        tags,
        surveys,
        activeTagIds,
        addTag,
        removeTag,
        addWidget,
        removeWidget,
        updateWidget,
        toggleTag,
        setActiveTags,
        resetTagSelection,
        calculateNpsScore
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

// Custom hook to use the dashboard context
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
};
