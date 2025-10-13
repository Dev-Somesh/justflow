import React from "react";
import { useWorkflowBuilderStore } from "@/stores/workflow-builder.store";

const PALETTE: { label: string; type: "trigger" | "action" | "condition" | "delay" | "end" }[] = [
  { label: "Trigger", type: "trigger" },
  { label: "Action", type: "action" },
  { label: "Condition", type: "condition" },
  { label: "Delay", type: "delay" },
  { label: "End", type: "end" },
];

export const NodePalette: React.FC = () => {
  const addNode = useWorkflowBuilderStore((s) => s.addNode);
  return (
    <div className="p-3">
      <h2 className="text-sm font-medium mb-2">Nodes</h2>
      <div className="space-y-2">
        {PALETTE.map((item) => (
          <button
            key={item.type}
            className="w-full text-left rounded border bg-background px-2 py-1 text-sm hover:bg-accent"
            onClick={() => addNode(item.type, item.label)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NodePalette;


