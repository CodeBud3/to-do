import React from 'react';
import { motion } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task } from '../../types/task.types';
import SortableTask from './SortableTask';

// Define a column type that matches the API response
interface ColumnInfo {
  key: string;
  label: string;
}

interface KanbanColumnProps {
  id: string;
  column: ColumnInfo;
  tasks: Task[];
  count: number;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, column, tasks, count }) => {
  // Set up droppable area with improved configuration
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: {
      type: 'column',
      accepts: ['task']
    }
  });

  // Generate task IDs for SortableContext
  const taskIds = tasks.map(task => task.id);

  // Framer motion animation variants
  const columnVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };

  return (
    <motion.div
      className="flex-1 min-w-[280px] max-w-[320px] bg-gray-50 rounded-lg shadow flex flex-col h-[calc(100vh-200px)]"
      variants={columnVariants}
    >
      <div className="p-4 bg-white rounded-t-lg border-b-2 border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-800">{column.label}</h3>
          <span className="px-3 py-1 text-sm bg-gray-100 rounded-full font-medium">
            {count}
          </span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`p-3 overflow-y-auto flex-1 transition-colors ${
          isOver ? 'bg-blue-100' : 'bg-gray-50'
        }`}
        style={{ minHeight: '100px' }}
      >
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-gray-500 text-sm italic">
            No tasks
          </div>
        ) : (
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <SortableTask 
                key={task.id} 
                task={task} 
                status={id}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </motion.div>
  );
};

export default KanbanColumn;
