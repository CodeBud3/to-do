import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  DragOverlay,
  useSensor, 
  useSensors, 
  TouchSensor,
  MouseSensor,
  DragEndEvent
} from '@dnd-kit/core';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { updateTaskStatus, fetchTasks } from '../../services/tasksSlice';
import { motion } from 'framer-motion';
import { Task } from '../../types/task.types';
import { AppDispatch } from '../../../../store/store';

// Import the components directly, not through path imports
// to fix the TS module resolution issues
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';

const KanbanBoard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    groupedTasks = {},
    columns = [],
    loading: isLoading,
    error
  } = useSelector((state: RootState) => state.tasks);
  
  // Active task being dragged
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  // Local state for optimistic updates
  const [localGroupedTasks, setLocalGroupedTasks] = useState<any>(null);
  // Track if we're currently processing a drop
  const [isProcessingDrop, setIsProcessingDrop] = useState(false);
  
  // Update local state when redux state changes
  useEffect(() => {
    if (!isProcessingDrop) {
      setLocalGroupedTasks(groupedTasks);
    }
  }, [groupedTasks, isProcessingDrop]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Press delay of 0 ms
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    // Fetch tasks with kanban view type
    dispatch(fetchTasks({ viewType: 'kanban' }));
  }, [dispatch]);

  // Handle drag start
  const handleDragStart = (event: any) => {
    const { active } = event;
    console.log('Drag start:', active);
    const taskId = active.id as string;
    
    // Find the task in the grouped tasks
    let foundTask = null;
    
    // Iterate through all columns to find the task
    Object.values(groupedTasks).forEach((column: any) => {
      if (column.tasks) {
        const task = column.tasks.find((t: Task) => t.id === taskId);
        if (task) {
          foundTask = task;
        }
      }
    });
    
    if (foundTask) {
      setActiveTask(foundTask);
    }
  };

  // Handle task drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // If dropped outside a droppable area, skip update
    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = active.id as string;
    
    // Get the correct column ID - if dropped on a task, get the column ID from the task's data
    let newStatus: string;
    
    // Check if we dropped on a column or on a task
    if (over.data.current && over.data.current.type === 'task') {
      // If dropped on a task, get the status from the task's data
      newStatus = over.data.current.status;
    } else {
      // If dropped directly on a column, use the column ID
      newStatus = over.id as string;
    }
    
    // Find the task in the grouped tasks
    let foundTask = null;
    let previousStatus = null;
    
    // Iterate through all columns to find the task
    Object.entries(groupedTasks).forEach(([status, column]: [string, any]) => {
      if (column.tasks) {
        const task = column.tasks.find((t: Task) => t.id === taskId);
        if (task) {
          foundTask = task;
          previousStatus = status;
        }
      }
    });
    
    // If same status or task not found, skip update
    if (previousStatus === newStatus || !foundTask) {
      setActiveTask(null);
      return;
    }
    
    // Store task for reference in case of errors
    const originalTask = { ...foundTask as Task };
    
    // Mark as processing to prevent UI flicker
    setIsProcessingDrop(true);
    
    // Clone the grouped tasks to avoid mutation issues
    try {
      // Deep clone grouped tasks for optimistic update
      const updatedGroupedTasks = JSON.parse(JSON.stringify(localGroupedTasks || groupedTasks));
      
      // Remove the task from its previous column
      if (previousStatus && updatedGroupedTasks[previousStatus]) {
        updatedGroupedTasks[previousStatus].tasks = updatedGroupedTasks[previousStatus].tasks.filter(
          (t: Task) => t.id !== taskId
        );
        updatedGroupedTasks[previousStatus].count = updatedGroupedTasks[previousStatus].tasks.length;
      }
      
      // Add the task to its new column
      if (updatedGroupedTasks[newStatus]) {
        // Update the task's status
        const updatedTask = { 
          ...foundTask as Task, 
          fields: { 
            ...(foundTask as Task).fields, 
            status: newStatus 
          } 
        };
        updatedGroupedTasks[newStatus].tasks.push(updatedTask);
        updatedGroupedTasks[newStatus].count = updatedGroupedTasks[newStatus].tasks.length;
      }
      
      // Update local state immediately for a smooth UI transition
      setLocalGroupedTasks(updatedGroupedTasks);
      
      // Call API to update task status
      dispatch(updateTaskStatus({ taskId, status: newStatus }))
        .unwrap()
        .then(() => {
          console.log('Task status updated successfully');
          // Refresh the kanban board data once the update is successful - but don't disrupt the UI
          return dispatch(fetchTasks({ viewType: 'kanban' })).unwrap();
        })
        .then((data) => {
          console.log('Kanban board refreshed');
          // Ensure we have the latest data while maintaining UI consistency
          const newGroupedTasks = data.data.groupedTasks || {};
          
          // Verify the task is properly placed after server refresh
          let taskFoundInCorrectColumn = false;
          if (newGroupedTasks[newStatus]?.tasks) {
            taskFoundInCorrectColumn = newGroupedTasks[newStatus].tasks.some(
              (t: Task) => t.id === taskId
            );
          }
          
          if (!taskFoundInCorrectColumn) {
            console.warn('Task not found in expected column after refresh, correcting...');
            // If the task is missing, re-apply our optimistic update to the new data
            const correctedGroupedTasks = { ...newGroupedTasks };
            
            // Remove from all other columns just in case
            Object.keys(correctedGroupedTasks).forEach(status => {
              if (correctedGroupedTasks[status]?.tasks) {
                correctedGroupedTasks[status].tasks = correctedGroupedTasks[status].tasks.filter(
                  (t: Task) => t.id !== taskId
                );
                correctedGroupedTasks[status].count = correctedGroupedTasks[status].tasks.length;
              }
            });
            
            // Add to the expected column
            if (correctedGroupedTasks[newStatus]?.tasks) {
              const updatedTask = { 
                ...originalTask, 
                fields: { 
                  ...originalTask.fields, 
                  status: newStatus 
                } 
              };
              correctedGroupedTasks[newStatus].tasks.push(updatedTask);
              correctedGroupedTasks[newStatus].count = correctedGroupedTasks[newStatus].tasks.length;
              
              // Update local state with our correction
              setLocalGroupedTasks(correctedGroupedTasks);
            }
          }
        })
        .catch(err => {
          console.error('Failed to update task status:', err);
          // Revert to original state on error
          setLocalGroupedTasks(groupedTasks);
        })
        .finally(() => {
          // Reset active task and processing state
          setActiveTask(null);
          setIsProcessingDrop(false);
        });
    } catch (err) {
      console.error('Error during optimistic update:', err);
      setActiveTask(null);
      setIsProcessingDrop(false);
    }
  };

  // Framer motion variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (isLoading && !localGroupedTasks) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error loading tasks: {error}
      </div>
    );
  }

  if (!groupedTasks || !columns) {
    return (
      <div className="text-center p-4">
        No kanban data available. Please try again.
      </div>
    );
  }

  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="overflow-x-auto pb-4 h-[calc(100vh-180px)]">
        <motion.div 
          className="flex flex-row space-x-4 p-2 min-w-max"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {columns.map((column) => (
            <KanbanColumn
              key={column.key}
              id={column.key}
              column={column}
              tasks={(localGroupedTasks || groupedTasks)[column.key]?.tasks || []}
              count={(localGroupedTasks || groupedTasks)[column.key]?.count || 0}
            />
          ))}
        </motion.div>
      </div>
      
      {/* Drag overlay for visual feedback */}
      <DragOverlay>
        {activeTask ? (
          <div className="opacity-80">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
