
import React from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const NpsScoreIndicator: React.FC<{ score: number }> = ({ score }) => {
  let color = "bg-gray-500";
  let label = "Neutral";
  
  if (score < 0) {
    color = "bg-red-500";
    label = "Needs Improvement";
  } else if (score < 30) {
    color = "bg-orange-500";
    label = "Fair";
  } else if (score < 50) {
    color = "bg-yellow-500";
    label = "Good";
  } else if (score < 70) {
    color = "bg-blue-500";
    label = "Very Good";
  } else {
    color = "bg-green-500";
    label = "Excellent";
  }
  
  // Normalize score for progress (0-100)
  const normalizedScore = Math.max(0, Math.min(100, score + 100)) / 2;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">NPS Score: {score}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs text-white ${color}`}>
          {label}
        </span>
      </div>
      <Progress value={normalizedScore} className="h-2" />
    </div>
  );
};

const NpsOverview: React.FC = () => {
  const { surveys, tags } = useDashboard();
  
  // Calculate overall NPS score
  const totalResponses = surveys.reduce((acc, survey) => acc + survey.responses.length, 0);
  const promoters = surveys.reduce((acc, survey) => 
    acc + survey.responses.filter(r => r.score >= 9).length, 0);
  const detractors = surveys.reduce((acc, survey) => 
    acc + survey.responses.filter(r => r.score <= 6).length, 0);
  
  const overallNps = totalResponses > 0 
    ? Math.round(((promoters - detractors) / totalResponses) * 100) 
    : 0;
  
  // Get survey tags
  const surveyTags = tags.filter(tag => tag.category === "survey");
  
  // Calculate NPS by survey tag
  const npsByTag = surveyTags.map(tag => {
    const surveysWithTag = surveys.filter(survey => survey.tags.includes(tag.id));
    const tagResponses = surveysWithTag.reduce((acc, survey) => acc + survey.responses.length, 0);
    const tagPromoters = surveysWithTag.reduce((acc, survey) => 
      acc + survey.responses.filter(r => r.score >= 9).length, 0);
    const tagDetractors = surveysWithTag.reduce((acc, survey) => 
      acc + survey.responses.filter(r => r.score <= 6).length, 0);
    
    const tagNps = tagResponses > 0 
      ? Math.round(((tagPromoters - tagDetractors) / tagResponses) * 100)
      : 0;
      
    return {
      tag,
      nps: tagNps,
      responses: tagResponses
    };
  }).filter(item => item.responses > 0);
  
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Overall NPS Score</CardTitle>
          <CardDescription>
            Based on {totalResponses} total responses across all surveys
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">{overallNps}</div>
              <div className="text-sm text-muted-foreground">
                {promoters} Promoters, {totalResponses - promoters - detractors} Neutrals, {detractors} Detractors
              </div>
            </div>
            <NpsScoreIndicator score={overallNps} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>NPS by Category</CardTitle>
          <CardDescription>
            Performance across different survey categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {npsByTag.length > 0 ? (
              npsByTag.map(({ tag, nps, responses }) => (
                <div key={tag.id} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium flex items-center">
                      <span 
                        className={`w-3 h-3 rounded-full mr-2 bg-tag-${tag.color}-text`}
                      />
                      {tag.name}
                    </span>
                    <span className="text-sm">{responses} responses</span>
                  </div>
                  <NpsScoreIndicator score={nps} />
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No category data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NpsOverview;
