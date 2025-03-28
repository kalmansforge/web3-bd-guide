
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TemplateActionsConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmWithThresholds: () => void;
  onConfirmWithoutThresholds: () => void;
}

const TemplateActionsConfirmDialog: React.FC<TemplateActionsConfirmDialogProps> = ({
  open,
  onOpenChange,
  onConfirmWithThresholds,
  onConfirmWithoutThresholds
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply Template</DialogTitle>
          <DialogDescription>
            Would you like to update the thresholds based on this template? This will replace your current threshold configurations.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onConfirmWithoutThresholds}>
            Keep Current Thresholds
          </Button>
          <Button onClick={onConfirmWithThresholds}>
            Update Thresholds
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateActionsConfirmDialog;
