
import { Star, Activity, CloudLightning, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

// Get category styling
export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'foundational':
      return "text-blue-600 dark:text-blue-400";
    case 'product':
      return "text-purple-600 dark:text-purple-400";
    case 'financial':
      return "text-green-600 dark:text-green-400";
    case 'strategic':
      return "text-amber-600 dark:text-amber-400";
    case 'ecosystem':
      return "text-rose-600 dark:text-rose-400";
    case 'risk':
      return "text-red-600 dark:text-red-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};

// Get category icon
export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'foundational':
      return <Star className="h-4 w-4" />;
    case 'product':
      return <Activity className="h-4 w-4" />;
    case 'financial':
      return <Star className="h-4 w-4" />;
    case 'strategic':
      return <Star className="h-4 w-4" />;
    case 'ecosystem':
      return <Activity className="h-4 w-4" />;
    case 'risk':
      return <CloudLightning className="h-4 w-4" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

// Get importance styling
export const getImportanceColor = (importance: string) => {
  if (importance.includes("High") || importance.includes("Strong")) {
    return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
  }
  if (importance.includes("Medium") || importance.includes("Moderate")) {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
  }
  return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
};
