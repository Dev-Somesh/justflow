import React from "react";

type NodeProps = {
  label: string;
};

export const Node: React.FC<NodeProps> = ({ label }) => {
  return (
    <div className="rounded-md border bg-background px-3 py-2 shadow-sm">
      {label}
    </div>
  );
};

export default Node;


