const express = require('express');
const { addTaskController, editTaskController, deleteTaskController, fetchTasksByStatusController, fetchTasksByCategoryController,markTaskCompletedController } = require('../controllers/taskController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/add-task',authMiddleware,addTaskController)
router.post('/fetch-task-byStatus',authMiddleware,fetchTasksByStatusController)
router.post('/fetch-task-byCategory',authMiddleware,fetchTasksByCategoryController)
router.put('/edit-task/:taskId',authMiddleware,editTaskController)
router.delete('/delete-task/:taskId',authMiddleware,deleteTaskController)
router.put('/mark-completed/:taskId',authMiddleware,markTaskCompletedController)
module.exports = router;