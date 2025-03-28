
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Save, Undo } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AppearanceSettings } from "@/utils/localStorageUtils";

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
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="t0-name">Primary Tier (Default: T0)</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Projects that meet higher threshold requirements. Typically strategic partners.
              </p>
              <Input
                id="t0-name"
                placeholder="e.g., T0, P0, Strategic, etc."
                value={appearanceSettings.tierNames.t0}
                onChange={(e) => {
                  updateAppearanceSetting('tierNames', {
                    ...appearanceSettings.tierNames,
                    t0: e.target.value
                  });
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="t1-name">Secondary Tier (Default: T1)</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Projects that meet lower threshold requirements. Typically core or secondary partners.
              </p>
              <Input
                id="t1-name"
                placeholder="e.g., T1, P1, Core, etc."
                value={appearanceSettings.tierNames.t1}
                onChange={(e) => {
                  updateAppearanceSetting('tierNames', {
                    ...appearanceSettings.tierNames,
                    t1: e.target.value
                  });
                }}
              />
            </div>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-md">
            <h3 className="text-sm font-medium mb-2">Preview:</h3>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                {appearanceSettings.tierNames.t0}
              </Badge>
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                {appearanceSettings.tierNames.t1}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TierNamesTab;
