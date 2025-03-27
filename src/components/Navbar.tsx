
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  return (
    <nav className="w-full bg-white/70 backdrop-blur-lg border-b border-border sticky top-0 z-10 transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold text-xl hidden sm:inline-block">Taggable</span>
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          {isMobile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Plus className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/" className={location.pathname === "/" ? "text-primary font-medium" : ""}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className={location.pathname === "/settings" ? "text-primary font-medium" : ""}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button 
                variant={location.pathname === "/" ? "secondary" : "ghost"} 
                size="sm" 
                asChild
                className="transition-all duration-300"
              >
                <Link to="/" className="flex items-center space-x-2">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              </Button>
              
              <Button 
                variant={location.pathname === "/settings" ? "secondary" : "ghost"} 
                size="sm" 
                asChild
                className="transition-all duration-300"
              >
                <Link to="/settings" className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
