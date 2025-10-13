import React from "react";
import { NodePalette } from "./NodePalette";
import { Canvas } from "./Canvas";
import { PropertiesPanel } from "./PropertiesPanel";
import { useWorkflowBuilderStore } from "@/stores/workflow-builder.store";
import { useCreateWorkflow, useUpdateWorkflow, useWorkflows } from "@/lib/api/workflows";

export const WorkflowBuilder: React.FC = () => {
  const workflow = useWorkflowBuilderStore((s) => s.workflow);
  const setState = useWorkflowBuilderStore.setState;
  const validate = useWorkflowBuilderStore((s) => s.validate);
  const createMutation = useCreateWorkflow();
  const updateMutation = useUpdateWorkflow();
  const { data: workflows } = useWorkflows();

  const handleSave = async () => {
    if (!workflow.id || workflow.id === "wf-local") {
      const newId = Math.random().toString(36).slice(2);
      await createMutation.mutateAsync({ ...workflow, id: newId, createdAt: new Date().toISOString() });
    } else {
      await updateMutation.mutateAsync({ id: workflow.id, updates: { ...workflow } });
    }
  };
  return (
    <div className="flex h-full w-full">
      <aside className="w-64 border-r border-border bg-card">
        <div className="p-3 border-b">
          <button
            className="w-full rounded bg-primary text-primary-foreground text-sm px-3 py-2"
            onClick={handleSave}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Workflow"}
          </button>
          <button
            className="w-full mt-2 rounded border text-sm px-3 py-2"
            onClick={() => {
              const res = validate();
              if (res.valid) alert("Workflow is valid");
              else alert("Validation errors:\n" + res.errors.join("\n"));
            }}
          >
            Validate Workflow
          </button>
        </div>
        <div className="p-3 border-b">
          <h3 className="text-xs font-medium mb-2">Open Workflow</h3>
          <div className="space-y-1 max-h-48 overflow-auto">
            {(workflows ?? []).length === 0 && (
              <p className="text-xs text-muted-foreground">No saved workflows</p>
            )}
            {(workflows ?? []).map((w) => (
              <button
                key={w.id}
                className="w-full text-left rounded border px-2 py-1 text-xs hover:bg-accent"
                onClick={() => setState({ workflow: w })}
              >
                {w.name} <span className="text-muted-foreground">({w.status})</span>
              </button>
            ))}
          </div>
        </div>
        <NodePalette />
      </aside>
      <main className="flex-1">
        <Canvas />
      </main>
      <aside className="w-80 border-l border-border bg-card">
        <PropertiesPanel />
      </aside>
    </div>
  );
};

export default WorkflowBuilder;


