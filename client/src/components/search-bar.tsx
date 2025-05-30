import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ 
  onSearch, 
  placeholder = "Search legal resources, attorneys, or topics..." 
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = () => {
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        // Default behavior: navigate to resources with search
        setLocation(`/resources?search=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        className="block w-full pl-10 pr-20 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-500 focus:border-transparent text-lg"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        <Button 
          onClick={handleSearch}
          className="bg-navy-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-navy-900 transition-colors"
        >
          Search
        </Button>
      </div>
    </div>
  );
}
