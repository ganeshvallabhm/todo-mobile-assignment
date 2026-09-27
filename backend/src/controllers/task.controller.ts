import { Response } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/auth';

// GET /api/tasks
// Returns all tasks for the authenticated user, sorted so urgent (nearest deadline) tasks appear first.
// Tasks with no deadline are pushed to the end.
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({
      deadline: 1,    // ascending: nearest deadline first; null/undefined values sort last in Mongo
      createdAt: -1,  // tie-break by creation time (newest first)
    });
    res.json({ success: true, data: tasks });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/tasks
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, dateTime, deadline, priority } = req.body;

    if (!title || title.trim() === '') {
      res.status(400).json({ success: false, message: 'Title is required' });
      return;
    }

    const validPriorities = ['low', 'medium', 'high'];
    if (priority && !validPriorities.includes(priority)) {
      res.status(400).json({ success: false, message: 'Priority must be low, medium, or high' });
      return;
    }

    // Validate dates if provided
    if (dateTime && isNaN(Date.parse(dateTime))) {
      res.status(400).json({ success: false, message: 'Invalid dateTime value' });
      return;
    }
    if (deadline && isNaN(Date.parse(deadline))) {
      res.status(400).json({ success: false, message: 'Invalid deadline value' });
      return;
    }

    const task = await Task.create({
      userId: req.userId,
      title,
      description,
      dateTime,
      deadline,
      priority,
    });

    res.status(201).json({ success: true, data: task });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/tasks/:id
export const getTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    // Ensure the task belongs to the requesting user
    if (String(task.userId) !== req.userId) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    res.json({ success: true, data: task });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/tasks/:id
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    if (String(task.userId) !== req.userId) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    const { title, description, dateTime, deadline, priority, completed } = req.body;

    if (title !== undefined && title.trim() === '') {
      res.status(400).json({ success: false, message: 'Title cannot be empty' });
      return;
    }

    const validPriorities = ['low', 'medium', 'high'];
    if (priority && !validPriorities.includes(priority)) {
      res.status(400).json({ success: false, message: 'Priority must be low, medium, or high' });
      return;
    }

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, dateTime, deadline, priority, completed },
      { new: true, runValidators: true, omitUndefined: true }
    );

    res.json({ success: true, data: updated });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PATCH /api/tasks/:id/toggle
export const toggleTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    if (String(task.userId) !== req.userId) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    task.completed = !task.completed;
    await task.save();

    res.json({ success: true, data: task });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    if (String(task.userId) !== req.userId) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    await task.deleteOne();
    res.json({ success: true, message: 'Task deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
