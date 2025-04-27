import React from 'react';
import { motion } from 'framer-motion';

interface ViewToggleProps {
  view: 'list' | 'kanban';
  onChange: (view: 'list' | 'kanban') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, onChange }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="bg-gray-100 p-1 rounded-lg flex">
        <button
          onClick={() => onChange('list')}
          className={`relative px-4 py-2 rounded-md transition-all ${
            view === 'list' ? 'text-gray-800' : 'text-gray-500'
          }`}
          aria-label="List view"
        >
          {view === 'list' && (
            <motion.div
              layoutId="viewToggleBubble"
              className="absolute inset-0 bg-white rounded-md shadow-sm"
              initial={false}
              transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
            />
          )}
          <span className="relative flex items-center">
            <motion.svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
              animate={{ rotate: view === 'list' ? 0 : 0 }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </motion.svg>
            <span>List</span>
          </span>
        </button>
        
        <button
          onClick={() => onChange('kanban')}
          className={`relative px-4 py-2 rounded-md transition-all ${
            view === 'kanban' ? 'text-gray-800' : 'text-gray-500'
          }`}
          aria-label="Kanban view"
        >
          {view === 'kanban' && (
            <motion.div
              layoutId="viewToggleBubble"
              className="absolute inset-0 bg-white rounded-md shadow-sm"
              initial={false}
              transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
            />
          )}
          <span className="relative flex items-center">
            <motion.svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
              animate={{ rotate: view === 'kanban' ? 0 : 0 }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </motion.svg>
            <span>Kanban</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default ViewToggle;
