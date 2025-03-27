
import React from "react";
import { X, Filter } from "lucide-react";
import { useDashboard, Tag } from "@/contexts/DashboardContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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

  return (
    <div className="flex items-center space-x-3 overflow-x-auto pb-2 max-w-full scrollbar-none">
      <div className="flex items-center space-x-1 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {tags.map((tag) => (
              <DropdownMenuItem
                key={tag.id}
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleTagFilter(tag.id)}
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
        {tags.map((tag) => (
          <TagItem
            key={tag.id}
            tag={tag}
            active={activeTagIds.includes(tag.id)}
            onClick={() => toggleTagFilter(tag.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TagSelector;
