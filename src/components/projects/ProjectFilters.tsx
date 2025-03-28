
import React from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getTierDisplayName } from "@/utils/storage";

interface ProjectFiltersProps {
  searchTerm: string;
  filterTier: string | null;
  setSearchTerm: (term: string) => void;
  setFilterTier: (tier: string | null) => void;
}

const ProjectFilters = ({ 
  searchTerm, 
  filterTier, 
  setSearchTerm, 
  setFilterTier 
}: ProjectFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 whitespace-nowrap">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">
              {filterTier ? `Tier: ${getTierDisplayName(filterTier as 'T0' | 'T1')}` : 'Filter by Tier'}
            </span>
            <span className="sm:hidden">Filter</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Filter by Tier</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setFilterTier(null)}>
              All Projects
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterTier('T0')}>
              {getTierDisplayName('T0')} Only
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterTier('T1')}>
              {getTierDisplayName('T1')} Only
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProjectFilters;
