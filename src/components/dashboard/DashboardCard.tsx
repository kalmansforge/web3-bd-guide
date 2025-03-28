
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface DashboardCardProps { 
  title: string; 
  value: string | number; 
  description?: string;
  icon: React.ElementType;
  trend?: { value: number; positive: boolean };
  onClick?: () => void;
}

const DashboardCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon,
  trend,
  onClick
}: DashboardCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md animate-scale-in" onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs ${trend.positive ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
            {trend.positive ? '+' : ''}{trend.value}%
          </p>
        )}
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
      {onClick && (
        <CardFooter className="p-2 pt-0 border-t">
          <Button variant="ghost" size="sm" className="w-full justify-between" onClick={onClick}>
            <span>View details</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default DashboardCard;
