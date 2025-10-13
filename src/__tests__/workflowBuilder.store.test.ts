import { describe, it, expect } from "vitest";
import { useWorkflowBuilderStore } from "@/stores/workflow-builder.store";

describe("workflow builder store", () => {
  it("adds and selects a node", () => {
    const { addNode, workflow, selectedNodeId } = useWorkflowBuilderStore.getState();
    const initialCount = workflow.nodes.length;
    addNode("trigger", "Start");
    const state = useWorkflowBuilderStore.getState();
    expect(state.workflow.nodes.length).toBe(initialCount + 1);
    expect(state.selectedNodeId).toBe(state.workflow.nodes[state.workflow.nodes.length - 1].id);
  });

  it("connects two nodes", () => {
    const s = useWorkflowBuilderStore.getState();
    const [a, b] = s.workflow.nodes.length >= 2 ? s.workflow.nodes : (() => {
      useWorkflowBuilderStore.getState().addNode("trigger", "A");
      useWorkflowBuilderStore.getState().addNode("action", "B");
      return useWorkflowBuilderStore.getState().workflow.nodes.slice(-2);
    })();
    useWorkflowBuilderStore.getState().connect(a.id, b.id);
    const { workflow } = useWorkflowBuilderStore.getState();
    expect(workflow.connections.some(c => c.sourceNodeId === a.id && c.targetNodeId === b.id)).toBe(true);
  });
});


