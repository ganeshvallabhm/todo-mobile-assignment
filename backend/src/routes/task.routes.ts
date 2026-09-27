import { Router } from 'express';
import {
  getTasks,
  createTask,
  getTask,
  updateTask,
  toggleTask,
  deleteTask,
} from '../controllers/task.controller';
import { protect } from '../middleware/auth';

const router = Router();

// All task routes require authentication
router.use(protect);

router.route('/').get(getTasks).post(createTask);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);
router.patch('/:id/toggle', toggleTask);

export default router;
