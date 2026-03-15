import { useState, useEffect } from 'react';
import { tasksApi } from '../api/client';
import { useSocket } from '../hooks/useSocket';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import type { Task } from '../types/task';
import { Plus, ListTodo, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchTasks = async () => {
    try {
      const { data } = await tasksApi.list();
      setTasks(data.tasks);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useSocket({
    onTaskCreated: (payload) => {
      setTasks((prev) => {
        const id = payload.task._id;
        if (prev.some((t) => t._id === id)) return prev;
        return [payload.task as Task, ...prev];
      });
    },
    onTaskUpdated: (payload) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === payload.task._id ? (payload.task as Task) : t))
      );
      setEditingTask((current) =>
        current?._id === payload.task._id ? (payload.task as Task) : current
      );
    },
    onTaskDeleted: (payload) => {
      setTasks((prev) => prev.filter((t) => t._id !== payload.taskId));
      setEditingTask((current) => (current?._id === payload.taskId ? null : current));
    },
  });

  const handleCreate = (task: Task) => {
    setTasks((prev) => {
      if (prev.some((t) => t._id === task._id)) return prev;
      return [task, ...prev];
    });
    setShowForm(false);
  };

  const handleUpdate = (task: Task) => {
    setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
    setEditingTask(null);
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
    if (editingTask?._id === id) setEditingTask(null);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="flex items-center gap-2 text-xl font-bold text-white">
          <ListTodo className="w-6 h-6 text-accent" />
          My Tasks
        </h1>
        <button
          type="button"
          onClick={() => {
            setEditingTask(null);
            setShowForm(!showForm);
          }}
          className="flex items-center justify-center gap-2 w-full sm:w-auto py-2.5 px-4 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          {showForm ? 'Cancel' : 'New Task'}
        </button>
      </div>

      {showForm && (
        <TaskForm
          onSave={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingTask && (
        <TaskForm
          task={editingTask}
          onSave={handleUpdate}
          onCancel={() => setEditingTask(null)}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-muted">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading tasks...</span>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-xl bg-surface border border-border text-muted">
          <ListTodo className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No tasks yet</p>
          <p className="text-sm mt-1">Create one using the button above.</p>
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          onEdit={setEditingTask}
          onDelete={handleDelete}
          onStatusChange={(task) => {
            setTasks((prev) =>
              prev.map((t) => (t._id === task._id ? task : t))
            );
          }}
        />
      )}
    </div>
  );
}
