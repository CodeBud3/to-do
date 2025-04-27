import React, { useCallback } from 'react';
import { format, differenceInDays, isBefore } from 'date-fns';
import { Task } from '../../types/task.types';
import { motion } from 'framer-motion';
import { useSheet } from '@/contexts/SheetContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import TaskForm from '../TaskForm/TaskForm';
import { fetchTasks } from '../../services/tasksSlice';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isDragging = false }) => {
  // Access the Sheet context to open the edit form
  const { openSheet, closeSheet } = useSheet();
  const { forms } = useSelector((state: RootState) => state.forms);
  const dispatch = useDispatch<AppDispatch>();

  // Custom close handler that refreshes Kanban view after editing
  const handleCloseSheet = useCallback(() => {
    closeSheet();
    // Refresh tasks to ensure Kanban view is up to date
    dispatch(fetchTasks({ viewType: 'kanban' }));
  }, [closeSheet, dispatch]);

  // Handle double click to edit
  const handleDoubleClick = (e: React.MouseEvent) => {
    // Prevent event from propagating to parent elements
    e.stopPropagation();
    
    // Open the task edit form if the form is available
    if (forms.taskForm) {
      openSheet(
        <TaskForm<Task>
          closeSheet={handleCloseSheet}
          taskForm={forms.taskForm}
          action="edit-task"
          record={task}
        />,
        "Edit Task"
      );
    } else {
      console.warn('Task form not available for editing');
    }
  };

  // Priority color mapping
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-l-red-500';
      case 'medium':
        return 'bg-white text-gray-800 border-l-yellow-500';
      case 'low':
        return 'bg-green-100 text-green-800 border-l-green-500';
      default:
        return 'bg-gray-100 text-gray-800 border-l-gray-500';
    }
  };

  // Format due date
  const formatDueDate = (dueDate: string | undefined) => {
    if (!dueDate) return '';
    try {
      return format(new Date(dueDate), 'MMM d, yyyy');
    } catch (error) {
      return '';
    }
  };

  // Calculate deadline proximity and set animation parameters
  const getDeadlineStatus = (dueDate: string | undefined, status: string | undefined) => {
    // If the task is completed, don't show deadline warnings
    if (status === 'completed') {
      return { isNearDeadline: false, isCompleted: true };
    }
    
    if (!dueDate) return { isNearDeadline: false };
    
    try {
      const today = new Date();
      const deadline = new Date(dueDate);
      
      // Reset hours to compare calendar days, not exact hours
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const deadlineDate = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
      
      // Calculate difference in calendar days
      const daysRemaining = differenceInDays(deadlineDate, todayDate);
      const isOverdue = isBefore(deadline, today);
      
      // Return different animation parameters based on deadline proximity
      if (isOverdue) {
        return {
          isNearDeadline: true,
          pulseIntensity: 1.03, // Moderate scale for overdue
          pulseSpeed: 1.2,      // Medium pulse for overdue
          textColor: 'text-red-600',
          badgeText: 'Overdue',
          badgeColor: 'bg-red-100 text-red-800',
          isOverdue: true       // Flag for special overdue animation
        };
      } else if (daysRemaining === 0) {
        // Due today - same calendar day
        return {
          isNearDeadline: true,
          pulseIntensity: 1.03,
          pulseSpeed: 1,
          textColor: 'text-orange-600',
          badgeText: 'Due today',
          badgeColor: 'bg-orange-100 text-orange-800'
        };
      } else if (daysRemaining === 1) {
        // Due tomorrow - next calendar day
        return {
          isNearDeadline: true,
          pulseIntensity: 1.02,
          pulseSpeed: 1.5,
          textColor: 'text-yellow-600',
          badgeText: 'Due tomorrow',
          badgeColor: 'bg-yellow-100 text-yellow-800'
        };
      } else if (daysRemaining <= 3) {
        // Due within next few days
        return {
          isNearDeadline: true,
          pulseIntensity: 1.02,
          pulseSpeed: 1.5,
          textColor: 'text-yellow-600',
          badgeText: 'Due soon',
          badgeColor: 'bg-yellow-100 text-yellow-800'
        };
      }
    } catch (error) {
      console.error('Error calculating deadline status:', error);
    }
    
    return { isNearDeadline: false };
  };

  // Get priority class
  const priorityClass = task.fields.priority 
    ? getPriorityColor(task.fields.priority as string)
    : 'border-l-gray-500';
  
  // Get deadline status and check if task is completed
  const status = task.fields.status as string | undefined;
  const deadlineStatus = getDeadlineStatus(task.fields.due_date as string | undefined, status);
  const isCompleted = status === 'completed';

  // Pulse animation variants
  const pulseVariants = {
    pulse: (custom: any) => ({
      scale: [1, custom.pulseIntensity || 1.02, 1],
      boxShadow: custom.isOverdue 
        ? [
            '0 1px 3px rgba(220,38,38,0.2), 0 0 0 1px rgba(220,38,38,0.1)',
            '0 4px 10px rgba(220,38,38,0.4), 0 0 0 1px rgba(220,38,38,0.2)',
            '0 1px 3px rgba(220,38,38,0.2), 0 0 0 1px rgba(220,38,38,0.1)'
          ]
        : [
            '0 1px 2px rgba(0,0,0,0.1)',
            '0 4px 8px rgba(0,0,0,0.15)',
            '0 1px 2px rgba(0,0,0,0.1)'
          ],
      backgroundColor: custom.isOverdue 
        ? ['rgba(254,242,242,0)', 'rgba(254,242,242,0.7)', 'rgba(254,242,242,0)']
        : undefined,
      transition: {
        repeat: Infinity,
        repeatType: 'loop' as const,
        duration: custom.pulseSpeed || 2
      }
    }),
    noPulse: {
      scale: 1,
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      className={`mb-2 p-3 rounded shadow-sm border-l-4 ${priorityClass} ${
        isDragging ? 'shadow-md' : ''
      } ${deadlineStatus.isOverdue ? 'relative overflow-hidden' : ''} ${
        isCompleted ? 'bg-gray-50 opacity-80' : 'bg-white'
      } cursor-pointer`}
      variants={pulseVariants}
      animate={deadlineStatus.isNearDeadline ? 'pulse' : 'noPulse'}
      custom={deadlineStatus}
      onDoubleClick={handleDoubleClick}
    >
      {deadlineStatus.isOverdue && (
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          animate={{
            backgroundColor: ['rgba(254,202,202,0)', 'rgba(254,202,202,0.3)', 'rgba(254,202,202,0)'],
          }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: 1.5,
            ease: "easeInOut"
          }}
        />
      )}
      <div className={`flex items-center ${isCompleted ? 'line-through text-gray-500' : ''}`}>
        {isCompleted && (
          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        <h4 className={`font-medium ${isCompleted ? 'text-gray-500' : 'text-gray-800'} mb-1`}>
          {task.fields.title as string}
        </h4>
      </div>
      <p className={`text-sm ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-600'} mb-2 line-clamp-2`}>
        {task.fields.description as string}
      </p>
      <div className="flex justify-between items-center mt-2">
        {task.fields.priority && (
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              task.fields.priority === 'high'
                ? 'bg-red-100 text-red-800'
                : task.fields.priority === 'medium'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {task.fields.priority as string}
          </span>
        )}
        
        {task.fields.due_date && (
          <div className="flex items-center">
            {deadlineStatus.isNearDeadline && deadlineStatus.badgeText && (
              <span className={`text-xs px-2 py-1 rounded-full mr-2 ${deadlineStatus.badgeColor}`}>
                {deadlineStatus.badgeText}
              </span>
            )}
            <span className={`text-xs ${deadlineStatus.textColor || 'text-gray-500'}`}>
              {formatDueDate(task.fields.due_date as string)}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskCard;
