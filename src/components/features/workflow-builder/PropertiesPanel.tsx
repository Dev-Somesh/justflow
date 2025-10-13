import React from "react";
import { useWorkflowBuilderStore } from "@/stores/workflow-builder.store";

export const PropertiesPanel: React.FC = () => {
  const selectedNodeId = useWorkflowBuilderStore((s) => s.selectedNodeId);
  const node = useWorkflowBuilderStore((s) => s.workflow.nodes.find(n => n.id === s.selectedNodeId));
  const updateNodeProps = useWorkflowBuilderStore((s) => s.updateNodeProps);
  const removeNode = useWorkflowBuilderStore((s) => s.removeNode);

  if (!selectedNodeId || !node) {
    return (
      <div className="p-3">
        <h2 className="text-sm font-medium mb-2">Properties</h2>
        <p className="text-xs text-muted-foreground">Select a node to edit its properties.</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      <h2 className="text-sm font-medium">Properties</h2>
      <div className="space-y-2">
        <label className="block text-xs text-muted-foreground">Label</label>
        <input
          className="w-full rounded border bg-background px-2 py-1 text-sm"
          value={node.label ?? ""}
          onChange={(e) => updateNodeProps(node.id, { label: e.target.value })}
        />
      </div>
      <button
        className="rounded border bg-destructive text-destructive-foreground px-2 py-1 text-sm"
        onClick={() => removeNode(node.id)}
      >
        Delete node
      </button>
    </div>
  );
};

export default PropertiesPanel;


