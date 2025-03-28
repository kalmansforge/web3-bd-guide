
import React, { useEffect } from "react";
import { useTemplateOperations } from "./templates/useTemplateOperations";
import TemplateHeader from "./templates/TemplateHeader";
import TemplateSearch from "./templates/TemplateSearch";
import TemplateTabContent from "./templates/TemplateTabContent";
import TemplateActionsConfirmDialog from "@/components/templates/list/TemplateActionsConfirmDialog";

const TemplatesTab = () => {
  const {
    activeTemplate,
    filteredTemplates,
    searchTerm,
    setSearchTerm,
    fileInputRef,
    confirmDialogOpen,
    setConfirmDialogOpen,
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
