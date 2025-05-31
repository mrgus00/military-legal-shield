import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, 
  Send, 
  X,
  AlertTriangle,
  MessageSquare
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ForumPostFormProps {
  onCancel?: () => void;
}

export default function ForumPostForm({ onCancel }: ForumPostFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    branch: "",
    isUrgent: false,
    tags: ""
  });

  const queryClient = useQueryClient();

  const postMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
      
      return await apiRequest('POST', '/api/forum/questions', {
        title: data.title,
        content: data.content,
        category: data.category,
        branch: data.branch,
        isUrgent: data.isUrgent,
        tags,
        userId: 1 // Mock user ID
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forum/questions'] });
      setFormData({
        title: "",
        content: "",
        category: "",
        branch: "",
        isUrgent: false,
        tags: ""
      });
      onCancel?.();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;
    postMutation.mutate(formData);
  };

  const isFormValid = formData.title.trim() && formData.content.trim() && formData.category && formData.branch;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            Ask the Community
          </CardTitle>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Court-Martial">Court-Martial</SelectItem>
                  <SelectItem value="Administrative">Administrative Action</SelectItem>
                  <SelectItem value="Security Clearance">Security Clearance</SelectItem>
                  <SelectItem value="Military Justice">Military Justice</SelectItem>
                  <SelectItem value="Benefits">Benefits & VA</SelectItem>
                  <SelectItem value="General">General Legal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="branch">Your Branch *</Label>
              <Select value={formData.branch} onValueChange={(value) => setFormData(prev => ({ ...prev, branch: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Army">Army</SelectItem>
                  <SelectItem value="Navy">Navy</SelectItem>
                  <SelectItem value="Air Force">Air Force</SelectItem>
                  <SelectItem value="Marines">Marines</SelectItem>
                  <SelectItem value="Coast Guard">Coast Guard</SelectItem>
                  <SelectItem value="Space Force">Space Force</SelectItem>
                  <SelectItem value="Veteran">Veteran</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="title">Question Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Briefly describe your legal question or situation"
              maxLength={150}
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.title.length}/150 characters
            </div>
          </div>
          
          <div>
            <Label htmlFor="content">Detailed Question *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Provide details about your situation, what happened, and what specific advice you're looking for. The more context you provide, the better answers you'll receive."
              rows={6}
              className="resize-none"
            />
            <div className="text-xs text-gray-500 mt-1">
              Be specific but avoid sharing personal identifying information
            </div>
          </div>
          
          <div>
            <Label htmlFor="tags">Tags (optional)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="e.g., Article 15, AWOL, Security Clearance (separate with commas)"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="urgent"
              checked={formData.isUrgent}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isUrgent: !!checked }))}
            />
            <Label htmlFor="urgent" className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              This is time-sensitive or urgent
            </Label>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Community Guidelines:</p>
                <ul className="text-xs space-y-1">
                  <li>• Don't share personal identifying information</li>
                  <li>• Be respectful and professional</li>
                  <li>• Responses are not legal advice - consult an attorney for official guidance</li>
                  <li>• For immediate emergencies, contact your command or military police</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={!isFormValid || postMutation.isPending}
              className="flex items-center gap-2"
            >
              {postMutation.isPending ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Post Question
            </Button>
            
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
          
          {postMutation.error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
              Failed to post question. Please try again.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}