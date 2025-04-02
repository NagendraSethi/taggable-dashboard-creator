
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
      {active && <X className="ml-1 h-3 w-3" />}
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
      
      <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  <span>Filter</span>
                  {activeTagIds.length > 0 && (
                    <span className="ml-1 rounded-full bg-primary w-5 h-5 text-[10px] flex items-center justify-center text-primary-foreground">
                      {activeTagIds.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 bg-background">
                {surveyTags.length > 0 && (
                  <>
                    <DropdownMenuLabel>Survey Tags</DropdownMenuLabel>
                    <DropdownMenuGroup className="max-h-48 overflow-y-auto">
                      {surveyTags.map((tag) => (
                        <DropdownMenuItem
                          key={tag.id}
                          className="flex items-center justify-between cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleTagClick(tag.id);
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`filter-${tag.id}`} 
                              checked={activeTagIds.includes(tag.id)}
                              onCheckedChange={() => handleTagClick(tag.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <Label 
                              htmlFor={`filter-${tag.id}`}
                              className="flex items-center cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span
                                className={`w-2 h-2 rounded-full mr-2 bg-tag-${tag.color}-text`}
                              />
                              {tag.name}
                            </Label>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                  </>
                )}
                
                {userTags.length > 0 && (
                  <>
                    <DropdownMenuLabel>User Tags</DropdownMenuLabel>
                    <DropdownMenuGroup className="max-h-48 overflow-y-auto">
                      {userTags.map((tag) => (
                        <DropdownMenuItem
                          key={tag.id}
                          className="flex items-center justify-between cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleTagClick(tag.id);
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`filter-${tag.id}`} 
                              checked={activeTagIds.includes(tag.id)}
                              onCheckedChange={() => handleTagClick(tag.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <Label 
                              htmlFor={`filter-${tag.id}`}
                              className="flex items-center cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span
                                className={`w-2 h-2 rounded-full mr-2 bg-tag-${tag.color}-text`}
                              />
                              {tag.name}
                            </Label>
                          </div>
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
                Clear all
                <X className="ml-1 h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {activeTagIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {activeTagIds.map(tagId => {
              const tag = tags.find(t => t.id === tagId);
              if (!tag) return null;
              return (
                <TagItem 
                  key={tag.id} 
                  tag={tag} 
                  active={true} 
                  onClick={() => handleTagClick(tag.id)} 
                />
              );
            })}
          </div>
        )}
        
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {filteredTags.length === 0 ? (
            <span className="text-sm text-muted-foreground">No tags in this category</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TagSelector;
