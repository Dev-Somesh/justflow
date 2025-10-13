import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, Ban } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';

interface AttentionWidgetProps {
  projectId?: string;
}

const AttentionWidget: React.FC<AttentionWidgetProps> = ({ projectId }) => {
  const { tasks } = useProject();

  const highPriority = tasks.filter(t => t && t.priority === 'high' && t.status !== 'done');
  const overdue = tasks.filter(t => t && t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done');
  const blocked = tasks.filter(t => t && (t.blocked === true || (t.labels && t.labels.includes('blocked'))) && t.status !== 'done');

  const items = [
    { icon: <AlertTriangle className="h-4 w-4 text-red-600" />, label: 'High priority', count: highPriority.length, color: 'text-red-700', bg: 'bg-red-50' },
    { icon: <Clock className="h-4 w-4 text-amber-600" />, label: 'Overdue', count: overdue.length, color: 'text-amber-700', bg: 'bg-amber-50' },
    { icon: <Ban className="h-4 w-4 text-purple-600" />, label: 'Blocked', count: blocked.length, color: 'text-purple-700', bg: 'bg-purple-50' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Needs Attention</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {items.map((it) => (
            <div key={it.label} className={`rounded-md ${it.bg} px-3 py-3 flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                {it.icon}
                <span className="text-sm">{it.label}</span>
              </div>
              <span className={`text-sm font-semibold ${it.color}`}>{it.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AttentionWidget;


