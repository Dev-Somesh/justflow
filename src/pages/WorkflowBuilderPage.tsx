import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { WorkflowBuilder } from "@/components/features/workflow-builder/WorkflowBuilder";

const WorkflowBuilderPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="h-[calc(100vh-80px)]">
        <WorkflowBuilder />
      </div>
    </AppLayout>
  );
};

export default WorkflowBuilderPage;


