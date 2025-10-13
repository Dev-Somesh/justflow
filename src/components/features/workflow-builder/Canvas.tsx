import React from "react";
import { useWorkflowBuilderStore } from "@/stores/workflow-builder.store";

export const Canvas: React.FC = () => {
  const nodes = useWorkflowBuilderStore((s) => s.workflow.nodes);
  const selectNode = useWorkflowBuilderStore((s) => s.selectNode);
  const selectedNodeId = useWorkflowBuilderStore((s) => s.selectedNodeId);
  const moveNode = useWorkflowBuilderStore((s) => s.moveNode);
  const connections = useWorkflowBuilderStore((s) => s.workflow.connections);
  const connect = useWorkflowBuilderStore((s) => s.connect);

  const [pendingSourceId, setPendingSourceId] = React.useState<string | null>(null);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    moveNode(id, x, y);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="h-full w-full relative bg-[radial-gradient(circle,rgba(0,0,0,0.03)_1px,transparent_1px)] [background-size:20px_20px]"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
        {connections.map((c, idx) => {
          const source = nodes.find(n => n.id === c.sourceNodeId);
          const target = nodes.find(n => n.id === c.targetNodeId);
          if (!source || !target) return null;
          const x1 = source.position.x + 60; // approximate center offset
          const y1 = source.position.y + 16;
          const x2 = target.position.x + 60;
          const y2 = target.position.y + 16;
          return (
            <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
          );
        })}
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#94a3b8" />
          </marker>
        </defs>
      </svg>
      {nodes.map((n) => (
        <div
          key={n.id}
          draggable
          onDragStart={(e) => onDragStart(e, n.id)}
          onClick={() => selectNode(n.id)}
          onDoubleClick={() => {
            if (!pendingSourceId) {
              setPendingSourceId(n.id);
            } else if (pendingSourceId && pendingSourceId !== n.id) {
              const already = connections.some(c => c.sourceNodeId === pendingSourceId && c.targetNodeId === n.id);
              if (!already) connect(pendingSourceId, n.id);
              setPendingSourceId(null);
            } else {
              setPendingSourceId(null);
            }
          }}
          className={`absolute rounded border px-3 py-2 text-sm cursor-move ${selectedNodeId === n.id ? "ring-2 ring-primary" : ""} ${pendingSourceId === n.id ? "border-primary" : ""}`}
          style={{ left: n.position.x, top: n.position.y }}
        >
          {n.label ?? n.type}
        </div>
      ))}
    </div>
  );
};

export default Canvas;


