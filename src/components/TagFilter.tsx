
import React, { useState, useEffect } from "react";
import { X, Filter } from "lucide-react";
import { useDashboard, Tag } from "@/contexts/DashboardContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TagItem: React.FC<{ tag: Tag; active: boolean; onClick: () => void }> = ({ tag, active, onClick }) => {
  return (
    <button
      className={`tag-item bg-tag-${tag.color} text-tag-${tag.color}-text ${
        active ? "ring-2 ring-tag-" + tag.color + "-text ring-opacity-50" : ""
      }`}
      onClick={onClick}
      type="button"
    >
      {tag.name}
    </button>
  );
};

export const TagSelector: React.FC = () => {
  const { tags, activeTagIds, toggleTagFilter, clearTagFilters } = useDashboard();
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Log changes to activeTagIds for debugging
  useEffect(() => {
    console.log("TagSelector - Active tag IDs:", activeTagIds);
  }, [activeTagIds]);

  const filteredTags = tags.filter(tag => {
    if (activeTab === "all") return true;
    return tag.category === activeTab;
  });

  const surveyTags = tags.filter(tag => tag.category === "survey");
  const userTags = tags.filter(tag => tag.category === "user");
  
  // Handler for tag click to ensure the event is properly handled
  const handleTagClick = (tagId: string) => {
    console.log("Tag clicked:", tagId);
    toggleTagFilter(tagId);
  };

  return (
    <div className="space-y-2">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="all">All Tags</TabsTrigger>
          <TabsTrigger value="survey">Survey Tags</TabsTrigger>
          <TabsTrigger value="user">User Tags</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex items-center space-x-3 overflow-x-auto pb-2 max-w-full scrollbar-none">
        <div className="flex items-center space-x-1 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-background">
              {surveyTags.length > 0 && (
                <>
                  <DropdownMenuLabel>Survey Tags</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    {surveyTags.map((tag) => (
                      <DropdownMenuItem
                        key={tag.id}
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => handleTagClick(tag.id)}
                      >
                        <span className="flex items-center">
                          <span
                            className={`w-2 h-2 rounded-full mr-2 bg-tag-${tag.color}-text`}
                          />
                          {tag.name}
                        </span>
                        {activeTagIds.includes(tag.id) && (
                          <span className="text-primary text-xs">Active</span>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                </>
              )}
              
              {userTags.length > 0 && (
                <>
                  <DropdownMenuLabel>User Tags</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    {userTags.map((tag) => (
                      <DropdownMenuItem
                        key={tag.id}
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => handleTagClick(tag.id)}
                      >
                        <span className="flex items-center">
                          <span
                            className={`w-2 h-2 rounded-full mr-2 bg-tag-${tag.color}-text`}
                          />
                          {tag.name}
                        </span>
                        {activeTagIds.includes(tag.id) && (
                          <span className="text-primary text-xs">Active</span>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </>
              )}
              
              {activeTagIds.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onClick={clearTagFilters}
                  >
                    Clear all filters
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {activeTagIds.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={clearTagFilters}
            >
              Clear
              <X className="ml-1 h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none">
          {filteredTags.map((tag) => (
            <TagItem
              key={tag.id}
              tag={tag}
              active={activeTagIds.includes(tag.id)}
              onClick={() => handleTagClick(tag.id)}
            />
          ))}
          
          {filteredTags.length === 0 && (
            <span className="text-sm text-muted-foreground">No tags in this category</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagSelector;
