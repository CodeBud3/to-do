import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Task } from '../../types/task.types';
import TaskCard from './TaskCard';

interface SortableTaskProps {
  task: Task;
  status: string;
}

const SortableTask: React.FC<SortableTaskProps> = ({ task, status }) => {
  // Add custom sensors to enable drag
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      task,
      status,
      type: 'task',
    },
  });

  // Framer motion animation variants
  const taskVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 }
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    position: 'relative' as const,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      variants={taskVariants}
      initial="hidden"
      animate="visible"
      className="touch-manipulation mb-2"
    >
      <TaskCard task={task} isDragging={isDragging} />
    </motion.div>
  );
};

export default SortableTask;
