export type WorkflowStatus = "draft" | "active" | "inactive";

export type WorkflowNodeType = "trigger" | "action" | "condition" | "delay" | "end";

export interface WorkflowNodePosition {
  x: number;
  y: number;
}

export interface WorkflowNodeProperties {
  [key: string]: unknown;
}

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  label?: string;
  position: WorkflowNodePosition;
  properties: WorkflowNodeProperties;
}

export interface WorkflowConnection {
  sourceNodeId: string;
  targetNodeId: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: WorkflowStatus;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  createdAt?: string;
  updatedAt?: string;
}


