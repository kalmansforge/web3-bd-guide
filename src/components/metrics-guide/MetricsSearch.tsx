
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MetricsSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MetricsSearch: React.FC<MetricsSearchProps> = ({ 
  value, 
  onChange,
  placeholder = "Search metrics..." 
}) => {
  return (
    <div className="relative mb-8">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default MetricsSearch;
