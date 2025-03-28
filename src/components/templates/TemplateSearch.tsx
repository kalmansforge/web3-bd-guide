
import React from "react";
import { Input } from "@/components/ui/input";

interface TemplateSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const TemplateSearch = ({ searchTerm, setSearchTerm }: TemplateSearchProps) => {
  return (
    <div className="mb-8 mt-6">
      <Input
        placeholder="Search templates..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />
    </div>
  );
};

export default TemplateSearch;
