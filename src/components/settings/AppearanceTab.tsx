
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Laptop, Moon, Save, Sun, Undo } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AppearanceSettings } from "@/utils/localStorageUtils";

interface AppearanceTabProps {
  appearanceSettings: AppearanceSettings;
  unsavedChanges: boolean;
  updateAppearanceSetting: <K extends keyof AppearanceSettings>(key: K, value: AppearanceSettings[K]) => void;
  saveChanges: () => void;
  resetChanges: () => void;
}

const AppearanceTab: React.FC<AppearanceTabProps> = ({
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
          <h2 className="text-2xl font-semibold">Appearance Settings</h2>
          <p className="text-muted-foreground">Customize the appearance and theme of your application</p>
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
            You have unsaved changes to your appearance settings. Be sure to save them before leaving this page.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>
              Select your preferred color theme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Theme Mode</Label>
              <RadioGroup 
                value={appearanceSettings.theme} 
                onValueChange={(value) => updateAppearanceSetting('theme', value as 'light' | 'dark' | 'system')}
                className="grid grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem value="light" id="theme-light" className="peer sr-only" />
                  <Label
                    htmlFor="theme-light"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Sun className="h-6 w-6 mb-2" />
                    <span>Light</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem value="dark" id="theme-dark" className="peer sr-only" />
                  <Label
                    htmlFor="theme-dark"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Moon className="h-6 w-6 mb-2" />
                    <span>Dark</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem value="system" id="theme-system" className="peer sr-only" />
                  <Label
                    htmlFor="theme-system"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Laptop className="h-6 w-6 mb-2" />
                    <span>System</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>Color Scheme</Label>
              <RadioGroup 
                value={appearanceSettings.colorScheme} 
                onValueChange={(value) => updateAppearanceSetting('colorScheme', value as 'default' | 'purple' | 'blue' | 'green')}
                className="grid grid-cols-4 gap-2"
              >
                <div>
                  <RadioGroupItem value="default" id="color-default" className="peer sr-only" />
                  <Label
                    htmlFor="color-default"
                    className="flex aspect-square flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="h-10 w-10 rounded-full bg-primary" />
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem value="purple" id="color-purple" className="peer sr-only" />
                  <Label
                    htmlFor="color-purple"
                    className="flex aspect-square flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="h-10 w-10 rounded-full bg-purple-500" />
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem value="blue" id="color-blue" className="peer sr-only" />
                  <Label
                    htmlFor="color-blue"
                    className="flex aspect-square flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="h-10 w-10 rounded-full bg-blue-500" />
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem value="green" id="color-green" className="peer sr-only" />
                  <Label
                    htmlFor="color-green"
                    className="flex aspect-square flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="h-10 w-10 rounded-full bg-green-500" />
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>UI Preferences</CardTitle>
            <CardDescription>
              Adjust the user interface to your preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-base">Font Size</Label>
                <RadioGroup 
                  value={appearanceSettings.fontSize} 
                  onValueChange={(value) => updateAppearanceSetting('fontSize', value as 'small' | 'medium' | 'large')}
                  className="grid grid-cols-3 gap-2 mt-2"
                >
                  <div>
                    <RadioGroupItem value="small" id="font-small" className="peer sr-only" />
                    <Label
                      htmlFor="font-small"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary text-sm"
                    >
                      Small
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem value="medium" id="font-medium" className="peer sr-only" />
                    <Label
                      htmlFor="font-medium"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      Medium
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem value="large" id="font-large" className="peer sr-only" />
                    <Label
                      htmlFor="font-large"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary text-lg"
                    >
                      Large
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label className="text-base">Border Radius</Label>
                <RadioGroup 
                  value={appearanceSettings.borderRadius} 
                  onValueChange={(value) => updateAppearanceSetting('borderRadius', value as 'none' | 'small' | 'medium' | 'large')}
                  className="grid grid-cols-4 gap-2 mt-2"
                >
                  <div>
                    <RadioGroupItem value="none" id="radius-none" className="peer sr-only" />
                    <Label
                      htmlFor="radius-none"
                      className="flex aspect-square flex-col items-center justify-center rounded-none border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="h-10 w-10 bg-primary/20" />
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem value="small" id="radius-small" className="peer sr-only" />
                    <Label
                      htmlFor="radius-small"
                      className="flex aspect-square flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="h-10 w-10 rounded-sm bg-primary/20" />
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem value="medium" id="radius-medium" className="peer sr-only" />
                    <Label
                      htmlFor="radius-medium"
                      className="flex aspect-square flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="h-10 w-10 rounded-md bg-primary/20" />
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem value="large" id="radius-large" className="peer sr-only" />
                    <Label
                      htmlFor="radius-large"
                      className="flex aspect-square flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/20" />
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="flex items-center justify-between pt-3">
                <div className="space-y-0.5">
                  <Label htmlFor="animation">Animation Effects</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable UI animation effects
                  </p>
                </div>
                <Switch
                  id="animation"
                  checked={appearanceSettings.animation}
                  onCheckedChange={(checked) => updateAppearanceSetting('animation', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppearanceTab;
