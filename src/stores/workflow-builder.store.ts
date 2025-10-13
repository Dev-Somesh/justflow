import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Workflow, WorkflowConnection, WorkflowNode, WorkflowNodeType } from "@/lib/types/workflow";

type WorkflowBuilderState = {
  workflow: Workflow;
  selectedNodeId: string | null;
  validate: () => { valid: boolean; errors: string[] };
  addNode: (type: WorkflowNodeType, label?: string) => void;
  removeNode: (nodeId: string) => void;
  moveNode: (nodeId: string, x: number, y: number) => void;
  selectNode: (nodeId: string | null) => void;
  connect: (sourceNodeId: string, targetNodeId: string) => void;
  disconnect: (sourceNodeId: string, targetNodeId: string) => void;
  updateNodeProps: (nodeId: string, props: Record<string, unknown>) => void;
  reset: () => void;
};

const createInitialWorkflow = (): Workflow => ({
  id: "wf-local",
  name: "Untitled Workflow",
  status: "draft",
  nodes: [],
  connections: [],
});

export const useWorkflowBuilderStore = create<WorkflowBuilderState>()(
  devtools((set, get) => ({
    workflow: createInitialWorkflow(),
    selectedNodeId: null,
    validate: () => {
      const { nodes, connections } = get().workflow;
      const errors: string[] = [];
      const triggers = nodes.filter(n => n.type === "trigger");
      if (triggers.length !== 1) {
        errors.push("Workflow must have exactly one Trigger node");
      }
      // Reachability from trigger
      if (triggers.length >= 1) {
        const start = triggers[0].id;
        const adj: Record<string, string[]> = {};
        nodes.forEach(n => { adj[n.id] = []; });
        connections.forEach(c => { (adj[c.sourceNodeId] ||= []).push(c.targetNodeId); });
        const visited = new Set<string>();
        const stack = [start];
        while (stack.length) {
          const v = stack.pop()!;
          if (visited.has(v)) continue;
          visited.add(v);
          (adj[v] || []).forEach(n => stack.push(n));
        }
        const unreachable = nodes.filter(n => !visited.has(n.id));
        if (unreachable.length) {
          errors.push(`Unreachable nodes: ${unreachable.map(n => n.label || n.id).join(", ")}`);
        }
        // Cycle detection using DFS colors
        const color: Record<string, 0 | 1 | 2> = {};
        nodes.forEach(n => { color[n.id] = 0; });
        let hasCycle = false;
        const dfs = (v: string) => {
          color[v] = 1;
          for (const nxt of adj[v] || []) {
            if (color[nxt] === 0) dfs(nxt);
            else if (color[nxt] === 1) { hasCycle = true; }
          }
          color[v] = 2;
        };
        dfs(start);
        if (hasCycle) errors.push("Workflow contains a cycle");
      }
      return { valid: errors.length === 0, errors };
    },
    addNode: (type, label) => {
      const id = Math.random().toString(36).slice(2);
      const newNode: WorkflowNode = {
        id,
        type,
        label: label ?? type,
        position: { x: 100, y: 100 },
        properties: {},
      };
      set((state) => ({
        workflow: { ...state.workflow, nodes: [...state.workflow.nodes, newNode] },
        selectedNodeId: id,
      }), false, "addNode");
    },
    removeNode: (nodeId) => {
      set((state) => ({
        workflow: {
          ...state.workflow,
          nodes: state.workflow.nodes.filter((n) => n.id !== nodeId),
          connections: state.workflow.connections.filter(
            (c) => c.sourceNodeId !== nodeId && c.targetNodeId !== nodeId
          ),
        },
        selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
      }), false, "removeNode");
    },
    moveNode: (nodeId, x, y) => {
      set((state) => ({
        workflow: {
          ...state.workflow,
          nodes: state.workflow.nodes.map((n) =>
            n.id === nodeId ? { ...n, position: { x, y } } : n
          ),
        },
      }), false, "moveNode");
    },
    selectNode: (nodeId) => set({ selectedNodeId: nodeId }, false, "selectNode"),
    connect: (sourceNodeId, targetNodeId) => {
      const connection: WorkflowConnection = { sourceNodeId, targetNodeId };
      set((state) => ({
        workflow: {
          ...state.workflow,
          connections: [...state.workflow.connections, connection],
        },
      }), false, "connect");
    },
    disconnect: (sourceNodeId, targetNodeId) => {
      set((state) => ({
        workflow: {
          ...state.workflow,
          connections: state.workflow.connections.filter(
            (c) => !(c.sourceNodeId === sourceNodeId && c.targetNodeId === targetNodeId)
          ),
        },
      }), false, "disconnect");
    },
    updateNodeProps: (nodeId, props) => {
      set((state) => ({
        workflow: {
          ...state.workflow,
          nodes: state.workflow.nodes.map((n) =>
            n.id === nodeId ? { ...n, properties: { ...n.properties, ...props } } : n
          ),
        },
      }), false, "updateNodeProps");
    },
    reset: () => set({ workflow: createInitialWorkflow(), selectedNodeId: null }, false, "reset"),
  }), { name: "workflow-builder" })
);


