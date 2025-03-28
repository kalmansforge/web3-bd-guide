
import React, { useEffect } from "react";
import { useTemplateOperations } from "./templates/useTemplateOperations";
import TemplateHeader from "./templates/TemplateHeader";
import TemplateSearch from "./templates/TemplateSearch";
import TemplateTabContent from "./templates/TemplateTabContent";
import TemplateActionsConfirmDialog from "@/components/templates/list/TemplateActionsConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";

const TemplatesTab = () => {
  const {
    activeTemplate,
    filteredTemplates,
    searchTerm,
    setSearchTerm,
    fileInputRef,
    confirmDialogOpen,
    setConfirmDialogOpen,
    loading,
    refreshData,
    handleCreateTemplate,
    handleSetActive,
    confirmSetActive,
    handleDuplicate,
    handleEdit,
    handleExport,
    handleImportClick,
    handleFileChange,
    handleDelete
  } = useTemplateOperations();
  
  // Refresh data when component mounts to ensure we have the latest templates
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  if (loading || !activeTemplate) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Templates</h2>
            <p className="text-muted-foreground">Manage your evaluation templates</p>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <Skeleton className="h-12 w-full max-w-md mb-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TemplateHeader 
        onImportClick={handleImportClick}
        onCreateTemplate={handleCreateTemplate}
      />
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
      
      <TemplateSearch 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <TemplateTabContent
        filteredTemplates={filteredTemplates}
        searchTerm={searchTerm}
        activeTemplateId={activeTemplate.id}
        onCreateTemplate={handleCreateTemplate}
        onImportClick={handleImportClick}
        onSetActive={handleSetActive}
        onDuplicate={handleDuplicate}
        onEdit={handleEdit}
        onExport={handleExport}
        onDelete={handleDelete}
      />
      
      <TemplateActionsConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirmWithThresholds={() => confirmSetActive(true)}
        onConfirmWithoutThresholds={() => confirmSetActive(false)}
      />
    </div>
  );
};

export default TemplatesTab;
