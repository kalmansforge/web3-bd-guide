
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAllTierNames } from '@/utils/storage';
import { MetricEvaluation, Metric } from '@/types/metrics';
import { X } from 'lucide-react';

interface MetricEvaluationFormProps {
  metric: Metric;
  categoryId: string;
  evaluation?: MetricEvaluation;
  onSave: (categoryId: string, metricId: string, evaluation: MetricEvaluation) => void;
  onCancel: () => void;
}

const MetricEvaluationForm: React.FC<MetricEvaluationFormProps> = ({
  metric,
  categoryId,
  evaluation,
  onSave,
  onCancel
}) => {
  const [selectedTier, setSelectedTier] = useState<string | null>(evaluation?.tier || null);
  const [notes, setNotes] = useState(evaluation?.notes || '');
  const tierNames = getAllTierNames();
  
  const handleSave = () => {
    if (!selectedTier) return;
    
    const newEvaluation: MetricEvaluation = {
      tier: selectedTier,
      value: '',
      notes: notes.trim()
    };
    
    onSave(categoryId, metric.id, newEvaluation);
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2" 
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardTitle>{metric.name}</CardTitle>
        <CardDescription>{metric.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tier">Classification</Label>
          <Select 
            value={selectedTier || ''} 
            onValueChange={setSelectedTier}
          >
            <SelectTrigger id="tier">
              <SelectValue placeholder="Select a classification" />
            </SelectTrigger>
            <SelectContent>
              {tierNames.map((tier) => (
                <SelectItem 
                  key={tier.internalName} 
                  value={tier.internalName}
                >
                  {tier.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="pt-2">
            <div className="text-sm font-medium mb-1">Classification Thresholds:</div>
            <div className="space-y-1 text-sm text-muted-foreground">
              {Object.entries(metric.thresholds).map(([tier, description]) => (
                <div key={tier} className="flex items-start gap-2">
                  <div className="font-medium">{tier}:</div>
                  <div>{description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Evaluation Notes</Label>
          <Textarea
            id="notes"
            placeholder="Enter any notes or justification for this classification..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
      <CardFooter className="justify-end space-x-2 border-t pt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave} disabled={!selectedTier}>Save</Button>
      </CardFooter>
    </Card>
  );
};

export default MetricEvaluationForm;
