
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
  category: "survey" | "user"; // Added category to distinguish between survey and user tags
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

export interface Survey {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  tags: string[]; // Survey Tag IDs
  responses: SurveyResponse[];
  npsScore?: number;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  score: number; // 0-10 for NPS
  feedback?: string;
  respondentId: string;
  createdAt: string;
}

export interface Respondent {
  id: string;
  name: string;
  email: string;
  tags: string[]; // User Tag IDs
}

interface DashboardContextType {
  widgets: Widget[];
  tags: Tag[];
  surveys: Survey[];
  respondents: Respondent[];
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
  addSurvey: (survey: Omit<Survey, "id">) => void;
  updateSurvey: (id: string, survey: Partial<Survey>) => void;
  removeSurvey: (id: string) => void;
  addRespondent: (respondent: Omit<Respondent, "id">) => void;
  updateRespondent: (id: string, respondent: Partial<Respondent>) => void;
  removeRespondent: (id: string) => void;
  calculateNpsScore: (surveyId: string) => number;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Sample data for initial state
const sampleTags: Tag[] = [
  { id: "tag-1", name: "Finance", color: "green", category: "survey" },
  { id: "tag-2", name: "Marketing", color: "purple", category: "survey" },
  { id: "tag-3", name: "Sales", color: "blue", category: "survey" },
  { id: "tag-4", name: "Tower A", color: "orange", category: "survey" },
  { id: "tag-5", name: "Zone B", color: "pink", category: "survey" },
  { id: "tag-6", name: "End User", color: "cyan", category: "user" },
  { id: "tag-7", name: "Manager", color: "red", category: "user" },
  { id: "tag-8", name: "Senior Stakeholder", color: "yellow", category: "user" },
  { id: "tag-9", name: "GBS", color: "blue", category: "user" },
  { id: "tag-10", name: "Non-GBS", color: "green", category: "user" }
];

// Sample respondents
const sampleRespondents: Respondent[] = [
  {
    id: "respondent-1",
    name: "John Doe",
    email: "john.doe@example.com",
    tags: ["tag-6", "tag-9"] // End User, GBS
  },
  {
    id: "respondent-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    tags: ["tag-7", "tag-10"] // Manager, Non-GBS
  },
  {
    id: "respondent-3",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    tags: ["tag-8", "tag-9"] // Senior Stakeholder, GBS
  },
  {
    id: "respondent-4",
    name: "Bob Williams",
    email: "bob.williams@example.com",
    tags: ["tag-6", "tag-10"] // End User, Non-GBS
  },
  {
    id: "respondent-5",
    name: "Carol Brown",
    email: "carol.brown@example.com",
    tags: ["tag-7", "tag-9"] // Manager, GBS
  }
];

// Sample surveys with responses
const sampleSurveys: Survey[] = [
  {
    id: "survey-1",
    title: "Q1 Customer Satisfaction",
    description: "Quarterly NPS survey for customer satisfaction",
    createdAt: "2023-03-15",
    tags: ["tag-1", "tag-4"], // Finance, Tower A
    responses: [
      {
        id: "response-1",
        surveyId: "survey-1",
        score: 9,
        feedback: "Great service, very satisfied",
        respondentId: "respondent-1",
        createdAt: "2023-03-16"
      },
      {
        id: "response-2",
        surveyId: "survey-1",
        score: 7,
        feedback: "Good but could improve response time",
        respondentId: "respondent-2",
        createdAt: "2023-03-17"
      },
      {
        id: "response-3",
        surveyId: "survey-1",
        score: 5,
        feedback: "Average service",
        respondentId: "respondent-3",
        createdAt: "2023-03-18"
      }
    ],
    npsScore: 33 // (1 promoter - 1 detractor) / 3 * 100
  },
  {
    id: "survey-2",
    title: "Marketing Campaign Feedback",
    description: "NPS survey for recent marketing campaign",
    createdAt: "2023-04-10",
    tags: ["tag-2", "tag-5"], // Marketing, Zone B
    responses: [
      {
        id: "response-4",
        surveyId: "survey-2",
        score: 8,
        feedback: "Effective campaign, good messaging",
        respondentId: "respondent-4",
        createdAt: "2023-04-11"
      },
      {
        id: "response-5",
        surveyId: "survey-2",
        score: 9,
        feedback: "Very impressive campaign",
        respondentId: "respondent-5",
        createdAt: "2023-04-12"
      }
    ],
    npsScore: 100 // (2 promoters - 0 detractors) / 2 * 100
  },
  {
    id: "survey-3",
    title: "Sales Team Performance",
    description: "NPS survey for sales team interactions",
    createdAt: "2023-05-05",
    tags: ["tag-3", "tag-4"], // Sales, Tower A
    responses: [
      {
        id: "response-6",
        surveyId: "survey-3",
        score: 4,
        feedback: "Sales team was not knowledgeable",
        respondentId: "respondent-1",
        createdAt: "2023-05-06"
      },
      {
        id: "response-7",
        surveyId: "survey-3",
        score: 6,
        feedback: "Decent experience but slow process",
        respondentId: "respondent-3",
        createdAt: "2023-05-07"
      },
      {
        id: "response-8",
        surveyId: "survey-3",
        score: 3,
        feedback: "Poor follow-up after initial contact",
        respondentId: "respondent-4",
        createdAt: "2023-05-08"
      }
    ],
    npsScore: -33 // (0 promoters - 1 detractor) / 3 * 100
  }
];

// Generate NPS widgets based on the sample surveys
const sampleWidgets: Widget[] = [
  {
    id: "widget-1",
    title: "Overall NPS Score Trend",
    type: "line",
    tags: ["tag-1", "tag-2", "tag-3"],
    size: "md",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "NPS Score",
          data: [25, 30, 33, 45, 52, 40],
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
        }
      ]
    }
  },
  {
    id: "widget-2",
    title: "NPS Score by Department",
    type: "pie",
    tags: ["tag-1", "tag-2", "tag-3"],
    size: "md",
    data: {
      labels: ["Finance", "Marketing", "Sales"],
      datasets: [
        {
          data: [33, 100, -33],
          backgroundColor: ["#10B981", "#8B5CF6", "#3B82F6"],
        }
      ]
    }
  },
  {
    id: "widget-3",
    title: "NPS Response Distribution",
    type: "bar",
    tags: ["tag-1", "tag-2", "tag-3"],
    size: "lg",
    data: {
      labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      datasets: [
        {
          label: "Responses",
          data: [0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 0],
          backgroundColor: "#10B981",
        }
      ]
    }
  },
  {
    id: "widget-4",
    title: "Current NPS Score",
    type: "metric",
    tags: ["tag-1", "tag-2", "tag-3"],
    size: "sm",
    data: {
      value: 33,
      change: 5.2,
      changeType: "increase",
      timeframe: "vs. Last Quarter"
    }
  },
  {
    id: "widget-5",
    title: "Total Responses",
    type: "metric",
    tags: ["tag-1", "tag-2", "tag-3"],
    size: "sm",
    data: {
      value: 8,
      change: 3,
      changeType: "increase",
      timeframe: "vs. Last Survey"
    }
  },
  {
    id: "widget-6",
    title: "Recent Responses",
    type: "table",
    tags: ["tag-1", "tag-2", "tag-3"],
    size: "lg",
    data: {
      headers: ["Respondent", "Score", "Date", "Feedback"],
      rows: [
        ["Carol Brown", "9", "Apr 12", "Very impressive campaign"],
        ["Bob Williams", "8", "Apr 11", "Effective campaign, good messaging"],
        ["Bob Williams", "3", "May 08", "Poor follow-up after initial contact"],
        ["Alice Johnson", "6", "May 07", "Decent experience but slow process"]
      ]
    }
  },
  {
    id: "widget-7",
    title: "Response Rate by User Type",
    type: "area",
    tags: ["tag-6", "tag-7", "tag-8"],
    size: "md",
    data: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      datasets: [
        {
          label: "End Users",
          data: [70, 82, 75, 85],
          fill: true,
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderColor: "#3B82F6",
        },
        {
          label: "Managers",
          data: [60, 55, 70, 75],
          fill: true,
          backgroundColor: "rgba(236, 72, 153, 0.1)",
          borderColor: "#EC4899",
        },
        {
          label: "Senior Stakeholders",
          data: [40, 45, 50, 60],
          fill: true,
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          borderColor: "#8B5CF6",
        }
      ]
    }
  },
  {
    id: "widget-8",
    title: "Survey Status",
    type: "status",
    tags: ["tag-1", "tag-2", "tag-3"],
    size: "sm",
    data: {
      systems: [
        { name: "Q1 Customer Satisfaction", status: "completed" },
        { name: "Marketing Campaign Feedback", status: "completed" },
        { name: "Sales Team Performance", status: "completed" },
        { name: "Q2 Customer Satisfaction", status: "in-progress" }
      ]
    }
  }
];

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [widgets, setWidgets] = useState<Widget[]>(sampleWidgets);
  const [tags, setTags] = useState<Tag[]>(sampleTags);
  const [surveys, setSurveys] = useState<Survey[]>(sampleSurveys);
  const [respondents, setRespondents] = useState<Respondent[]>(sampleRespondents);
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

  // Calculate NPS score for a survey
  const calculateNpsScore = (surveyId: string) => {
    const survey = surveys.find(s => s.id === surveyId);
    if (!survey || survey.responses.length === 0) return 0;
    
    const totalResponses = survey.responses.length;
    const promoters = survey.responses.filter(r => r.score >= 9).length;
    const detractors = survey.responses.filter(r => r.score <= 6).length;
    
    return Math.round(((promoters - detractors) / totalResponses) * 100);
  };

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
    // Remove this tag from all widgets, surveys, and respondents
    setWidgets(prev => 
      prev.map(widget => ({
        ...widget,
        tags: widget.tags.filter(tagId => tagId !== id)
      }))
    );
    
    setSurveys(prev => 
      prev.map(survey => ({
        ...survey,
        tags: survey.tags.filter(tagId => tagId !== id)
      }))
    );
    
    setRespondents(prev => 
      prev.map(respondent => ({
        ...respondent,
        tags: respondent.tags.filter(tagId => tagId !== id)
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

  // Add a new survey
  const addSurvey = (survey: Omit<Survey, "id">) => {
    const newSurvey = {
      ...survey,
      id: `survey-${Date.now()}`,
    };
    setSurveys(prev => [...prev, newSurvey]);
    toast.success("Survey added successfully");
  };

  // Update an existing survey
  const updateSurvey = (id: string, updates: Partial<Survey>) => {
    setSurveys(prev => 
      prev.map(survey => 
        survey.id === id ? { ...survey, ...updates } : survey
      )
    );
    toast.success("Survey updated");
  };

  // Remove a survey
  const removeSurvey = (id: string) => {
    setSurveys(prev => prev.filter(survey => survey.id !== id));
    toast.success("Survey removed");
  };

  // Add a new respondent
  const addRespondent = (respondent: Omit<Respondent, "id">) => {
    const newRespondent = {
      ...respondent,
      id: `respondent-${Date.now()}`,
    };
    setRespondents(prev => [...prev, newRespondent]);
    toast.success("Respondent added successfully");
  };

  // Update an existing respondent
  const updateRespondent = (id: string, updates: Partial<Respondent>) => {
    setRespondents(prev => 
      prev.map(respondent => 
        respondent.id === id ? { ...respondent, ...updates } : respondent
      )
    );
    toast.success("Respondent updated");
  };

  // Remove a respondent
  const removeRespondent = (id: string) => {
    setRespondents(prev => prev.filter(respondent => respondent.id !== id));
    toast.success("Respondent removed");
  };

  const value = {
    widgets,
    tags,
    surveys,
    respondents,
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
    addSurvey,
    updateSurvey,
    removeSurvey,
    addRespondent,
    updateRespondent,
    removeRespondent,
    calculateNpsScore,
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
