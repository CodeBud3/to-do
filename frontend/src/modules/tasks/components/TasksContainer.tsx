import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { AppDispatch, RootState } from '@/store/store';
import { fetchTasks, setViewType } from '../services/tasksSlice';
import TasksList from './TasksList';
import KanbanBoard from './Kanban/KanbanBoard';
import ViewToggle from './ViewToggle';

const TasksContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { viewType } = useSelector((state: RootState) => state.tasks);
  
  const handleViewChange = (newViewType: 'list' | 'kanban') => {
    dispatch(setViewType(newViewType));
    dispatch(fetchTasks({ viewType: newViewType }));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
        
        <ViewToggle view={viewType} onChange={handleViewChange} />
      </div>

      <motion.div
        key={viewType}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {viewType === 'kanban' ? <KanbanBoard /> : <TasksList />}
      </motion.div>
    </div>
  );
};

export default TasksContainer;
