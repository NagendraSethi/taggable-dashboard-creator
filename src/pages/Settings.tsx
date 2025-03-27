
import React, { useState } from "react";
import { useDashboard, Tag, TagColors } from "@/contexts/DashboardContext";
import Navbar from "@/components/Navbar";
import { Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const { tags, widgets, addTag, updateTag, removeTag, removeWidget } = useDashboard();
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  
  // New tag form state with added category field
  const [newTag, setNewTag] = useState<{
    name: string;
    color: TagColors;
    category: "survey" | "user";
  }>({
    name: "",
    color: "blue",
    category: "survey", // Default category
  });

  const handleAddTag = () => {
    if (!newTag.name) return;
    
    if (editingTag) {
      updateTag(editingTag.id, newTag);
    } else {
      addTag(newTag);
    }
    
    setNewTag({
      name: "",
      color: "blue",
      category: "survey",
    });
    setEditingTag(null);
    setTagDialogOpen(false);
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setNewTag({
      name: tag.name,
      color: tag.color,
      category: tag.category,
    });
    setTagDialogOpen(true);
  };

  const colorOptions: { value: TagColors; label: string }[] = [
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "purple", label: "Purple" },
    { value: "orange", label: "Orange" },
    { value: "pink", label: "Pink" },
    { value: "cyan", label: "Cyan" },
    { value: "red", label: "Red" },
    { value: "yellow", label: "Yellow" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6 md:px-6 animate-fade-in">
        <h1 className="text-2xl font-semibold tracking-tight mb-6">Settings</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Manage tags to organize and filter your dashboard widgets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-1" onClick={() => {
                      setEditingTag(null);
                      setNewTag({ name: "", color: "blue", category: "survey" });
                    }}>
                      <Plus className="h-4 w-4" />
                      <span>Add Tag</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingTag ? "Edit Tag" : "Add New Tag"}</DialogTitle>
                      <DialogDescription>
                        {editingTag 
                          ? "Update the tag details below."
                          : "Create a new tag to organize your dashboard widgets."}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Tag Name</Label>
                        <Input 
                          id="name" 
                          value={newTag.name}
                          onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                          placeholder="Enter tag name"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="color">Tag Color</Label>
                        <Select 
                          value={newTag.color}
                          onValueChange={(value) => setNewTag({ 
                            ...newTag, 
                            color: value as TagColors 
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select tag color" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {colorOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex items-center">
                                    <div 
                                      className={`w-3 h-3 rounded-full mr-2 bg-tag-${option.value}-text`}
                                    />
                                    {option.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="category">Tag Category</Label>
                        <Select 
                          value={newTag.category}
                          onValueChange={(value) => setNewTag({ 
                            ...newTag, 
                            category: value as "survey" | "user" 
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select tag category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="survey">Survey Tag</SelectItem>
                              <SelectItem value="user">User Tag</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setTagDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddTag}>
                        {editingTag ? "Update" : "Add"} Tag
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tag</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Used In</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tags.map((tag) => {
                      const widgetCount = widgets.filter(w => w.tags.includes(tag.id)).length;
                      
                      return (
                        <TableRow key={tag.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div 
                                className={`w-3 h-3 rounded-full bg-tag-${tag.color}-text`}
                              />
                              <span className={`tag-item bg-tag-${tag.color} text-tag-${tag.color}-text px-2 py-0.5`}>
                                {tag.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="capitalize">{tag.category}</span>
                          </TableCell>
                          <TableCell>{widgetCount} widgets</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditTag(tag)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Tag</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete the tag "{tag.name}"? 
                                      This will remove the tag from {widgetCount} widgets.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      onClick={() => removeTag(tag.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    
                    {tags.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                          No tags created yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Widgets</CardTitle>
              <CardDescription>
                Manage all widgets on your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Widget</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {widgets.map((widget) => {
                      const widgetTags = tags.filter(tag => widget.tags.includes(tag.id));
                      
                      return (
                        <TableRow key={widget.id}>
                          <TableCell>
                            <div className="font-medium">{widget.title}</div>
                          </TableCell>
                          <TableCell>
                            <div className="capitalize">{widget.type}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {widgetTags.map((tag) => (
                                <span
                                  key={tag.id}
                                  className={`tag-item bg-tag-${tag.color} text-tag-${tag.color}-text text-[10px] px-2 py-0.5`}
                                >
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Widget</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete the widget "{widget.title}"?
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    onClick={() => removeWidget(widget.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    
                    {widgets.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                          No widgets created yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
