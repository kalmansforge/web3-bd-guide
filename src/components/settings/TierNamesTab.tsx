
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Save, Undo, Plus, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AppearanceSettings, TierName } from "@/utils/localStorageUtils";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface TierNamesTabProps {
  appearanceSettings: AppearanceSettings;
  unsavedChanges: boolean;
  updateAppearanceSetting: <K extends keyof AppearanceSettings>(key: K, value: AppearanceSettings[K]) => void;
  saveChanges: () => void;
  resetChanges: () => void;
}

const TierNamesTab: React.FC<TierNamesTabProps> = ({
  appearanceSettings,
  unsavedChanges,
  updateAppearanceSetting,
  saveChanges,
  resetChanges
}) => {
  // Ensure tierNames exists with default values if not present
  const tierNames = appearanceSettings?.tierNames || [];
  
  const handleTierNameChange = (index: number, field: keyof TierName, value: string) => {
    const updatedTierNames = [...tierNames];
    updatedTierNames[index] = {
      ...updatedTierNames[index],
      [field]: value
    };
    
    updateAppearanceSetting('tierNames', updatedTierNames);
  };
  
  const addNewTier = () => {
    const existingIds = tierNames.map(tier => tier.id);
    
    // Generate a new tier ID that doesn't conflict with existing ones
    let newId = 't' + tierNames.length;
    while (existingIds.includes(newId)) {
      newId = 't' + Math.floor(Math.random() * 1000);
    }
    
    const newTier: TierName = {
      id: newId,
      displayName: `T${tierNames.length}`,
      internalName: `T${tierNames.length}`,
      color: 'blue'
    };
    
    updateAppearanceSetting('tierNames', [...tierNames, newTier]);
  };
  
  const removeTier = (index: number) => {
    if (tierNames.length <= 1) {
      return; // Prevent removing the last tier
    }
    
    const updatedTierNames = tierNames.filter((_, i) => i !== index);
    updateAppearanceSetting('tierNames', updatedTierNames);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Classification Tier Names</h2>
          <p className="text-muted-foreground">Customize how classification tiers are displayed throughout the application</p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={resetChanges}
            disabled={!unsavedChanges}
            className="flex items-center gap-2"
          >
            <Undo className="h-4 w-4" />
            Reset
          </Button>
          
          <Button
            onClick={saveChanges}
            disabled={!unsavedChanges}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
      
      {unsavedChanges && (
        <Alert className="mb-6 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unsaved Changes</AlertTitle>
          <AlertDescription>
            You have unsaved changes to your tier name settings. Be sure to save them before leaving this page.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Project Classification Tiers</CardTitle>
          <CardDescription>
            Customize the names of your classification tiers. These will be used throughout the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {tierNames.map((tier, index) => (
              <div key={tier.id} className="grid gap-4 md:grid-cols-2 p-4 border rounded-md relative">
                <div className="space-y-2">
                  <Label htmlFor={`${tier.id}-display-name`}>Display Name</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    The name that will be shown to users in the UI.
                  </p>
                  <Input
                    id={`${tier.id}-display-name`}
                    placeholder="e.g., T0, P0, Strategic, etc."
                    value={tier.displayName}
                    onChange={(e) => handleTierNameChange(index, 'displayName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`${tier.id}-internal-name`}>Internal Name</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    The name used internally for this tier. Usually matches the tier index.
                  </p>
                  <Input
                    id={`${tier.id}-internal-name`}
                    placeholder="e.g., T0, T1, etc."
                    value={tier.internalName}
                    onChange={(e) => handleTierNameChange(index, 'internalName', e.target.value)}
                  />
                </div>
                
                {tierNames.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                    onClick={() => removeTier(index)}
                    aria-label={`Remove tier ${tier.displayName}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            onClick={addNewTier}
            className="w-full flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Tier
          </Button>
          
          <div className="p-4 bg-muted/50 rounded-md">
            <h3 className="text-sm font-medium mb-2">Preview:</h3>
            <div className="flex items-center gap-3 flex-wrap">
              {tierNames.map((tier, index) => (
                <Badge 
                  key={tier.id}
                  className={cn(
                    index === 0 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
                    index === 1 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" :
                    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                  )}
                >
                  {tier.displayName}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TierNamesTab;
