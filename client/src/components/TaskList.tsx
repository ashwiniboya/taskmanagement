import { tasksApi } from '../api/client';
import type { Task, TaskStatus } from '../types/task';
import { Pencil, Trash2, Calendar } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (task: Task) => void;
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'done': 'Done',
};

export default function TaskList({ tasks, onEdit, onDelete, onStatusChange }: TaskListProps) {
  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    if (task.status === newStatus) return;
    try {
      const { data } = await tasksApi.update(task._id, { status: newStatus });
      onStatusChange(data.task);
    } catch {
      // keep UI unchanged on error
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await tasksApi.delete(id);
      onDelete(id);
    } catch {
      // could show toast
    }
  };

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li
          key={task._id}
          className="bg-surface border border-border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-4 hover:border-accent/40 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-white ${
                task.status === 'done' ? 'line-through text-muted' : ''
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-muted mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
            {task.dueDate && (
              <p className="flex items-center gap-1.5 text-xs text-muted mt-2">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-shrink-0">
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(task, e.target.value as TaskStatus)}
              className="px-3 py-2 rounded-lg text-sm font-medium border border-border bg-[#0f0f12] text-white focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer"
            >
              {(['todo', 'in-progress', 'done'] as const).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onEdit(task)}
                className="p-2 rounded-lg text-muted hover:bg-border hover:text-white transition-colors"
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(task._id)}
                className="p-2 rounded-lg text-muted hover:bg-red-500/20 hover:text-red-400 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
