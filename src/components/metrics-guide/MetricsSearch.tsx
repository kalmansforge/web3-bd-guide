
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MetricsSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const MetricsSearch: React.FC<MetricsSearchProps> = ({ value, onChange }) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search metrics..."
        className="pl-9"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default MetricsSearch;
