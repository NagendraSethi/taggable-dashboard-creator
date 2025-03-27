
import React from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BarChart, Users, ExternalLink } from "lucide-react";

const SurveyList: React.FC = () => {
  const { surveys, tags, calculateNpsScore } = useDashboard();

  // Sort surveys by creation date (newest first)
  const sortedSurveys = [...surveys].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="bg-card rounded-lg border shadow">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">Recent Surveys</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Survey</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Responses</TableHead>
            <TableHead>NPS Score</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedSurveys.map((survey) => {
            const surveyTags = tags.filter(tag => survey.tags.includes(tag.id));
            const npsScore = survey.npsScore || calculateNpsScore(survey.id);
            
            // Determine score color
            let scoreColor = "text-gray-500";
            if (npsScore < 0) scoreColor = "text-red-500";
            else if (npsScore < 30) scoreColor = "text-orange-500";
            else if (npsScore < 50) scoreColor = "text-yellow-500";
            else if (npsScore < 70) scoreColor = "text-blue-500";
            else scoreColor = "text-green-500";
            
            return (
              <TableRow key={survey.id}>
                <TableCell>
                  <div className="font-medium">{survey.title}</div>
                  <div className="text-xs text-muted-foreground">
                    Created on {new Date(survey.createdAt).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {surveyTags.map((tag) => (
                      <span
                        key={tag.id}
                        className={`tag-item bg-tag-${tag.color} text-tag-${tag.color}-text text-[10px] px-2 py-0.5`}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{survey.responses.length}</TableCell>
                <TableCell>
                  <span className={`font-medium ${scoreColor}`}>
                    {npsScore}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <BarChart className="h-4 w-4" />
                      <span className="sr-only">View Results</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <Users className="h-4 w-4" />
                      <span className="sr-only">View Respondents</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">Open Survey</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
          
          {surveys.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No surveys available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SurveyList;
