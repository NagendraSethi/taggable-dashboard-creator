
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center space-y-6 animate-fade-in">
        <div className="relative mx-auto w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping-slow"></div>
          <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 backdrop-blur-sm">
            <span className="text-4xl font-bold text-primary">404</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
        
        <p className="text-muted-foreground max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Button asChild className="mt-8 inline-flex items-center gap-2">
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            Return to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
