
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useTemplatePageActions } from "@/hooks/useTemplatePageActions";
import TemplatePageHeader from "@/components/templates/TemplatePageHeader";
import TemplateSearch from "@/components/templates/TemplateSearch";
import TemplatesList from "@/components/templates/TemplatesList";
import ImportFileInput from "@/components/templates/ImportFileInput";

const Templates = () => {
  const {
    activeTemplate,
    filteredTemplates,
    searchTerm,
    setSearchTerm,
    isImporting,
    fileInputRef,
    handleCreateTemplate,
    handleSetActive,
    handleDuplicate,
    handleEdit,
    handleExport,
    handleDelete,
    handleImportClick,
    handleFileChange
  } = useTemplatePageActions();

  return (
    <AppLayout>
      <TemplatePageHeader
        onCreateTemplate={handleCreateTemplate}
        onImportClick={handleImportClick}
        isImporting={isImporting}
      />
      
      <ImportFileInput
        onChange={handleFileChange}
        inputRef={fileInputRef}
      />
      
      <TemplateSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <TemplatesList
        templates={filteredTemplates}
        activeTemplateId={activeTemplate.id}
        searchTerm={searchTerm}
        onSetActive={handleSetActive}
        onDuplicate={handleDuplicate}
        onEdit={handleEdit}
        onExport={handleExport}
        onDelete={handleDelete}
        onCreateTemplate={handleCreateTemplate}
        onImportClick={handleImportClick}
      />
    </AppLayout>
  );
};

export default Templates;
