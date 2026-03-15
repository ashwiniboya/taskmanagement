import { Router, Request, Response } from 'express';
import Task from '../models/Task.model';
import { authMiddleware } from '../middleware/auth.middleware';
import { emitTaskUpdate } from '../config/socket';

const router = Router();

// All task routes require authentication
router.use(authMiddleware);

// GET /api/tasks - List tasks for current user
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const tasks = await Task.find({ userId }).sort({ updatedAt: -1 }).lean();
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: (err as Error).message });
  }
});

// GET /api/tasks/:id - Get single task
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const task = await Task.findOne({ _id: req.params.id, userId }).lean();
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json({ task });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch task', error: (err as Error).message });
  }
});

// POST /api/tasks - Create task
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { title, description, status, dueDate } = req.body;
    if (!title) {
      res.status(400).json({ message: 'Title is required' });
      return;
    }
    const task = await Task.create({
      title,
      description: description || '',
      status: status || 'todo',
      userId,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });
    const taskObj = task.toObject ? task.toObject() : task;
    const io = req.app.get('io');
    if (io) emitTaskUpdate(io, userId, 'task:created', { task: taskObj });
    res.status(201).json({ task: taskObj });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create task', error: (err as Error).message });
  }
});

// PUT /api/tasks/:id - Update task (only allow known fields)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { title, description, status, dueDate } = req.body;
    const update: Record<string, unknown> = {};
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (status !== undefined && ['todo', 'in-progress', 'done'].includes(status)) update.status = status;
    if (dueDate !== undefined) update.dueDate = dueDate === '' || dueDate == null ? null : new Date(dueDate);
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: update },
      { new: true }
    ).lean();
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    const io = req.app.get('io');
    if (io) emitTaskUpdate(io, userId, 'task:updated', { task });
    res.json({ task });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task', error: (err as Error).message });
  }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    const io = req.app.get('io');
    if (io) emitTaskUpdate(io, userId, 'task:deleted', { taskId: req.params.id });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task', error: (err as Error).message });
  }
});

export default router;
