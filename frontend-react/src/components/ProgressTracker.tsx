import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, TrendingUp, BarChart3 } from 'lucide-react';

const ProgressTracker: React.FC = () => {
  const phases = [
    {
      name: 'Phase 1: Foundation',
      weeks: 'Weeks 1-2',
      tasks: [
        { name: 'Setup Development Environment', status: 'completed' },
        { name: 'Backend Foundation', status: 'completed' },
        { name: 'Frontend Foundation', status: 'completed' },
      ],
      progress: 100,
    },
    {
      name: 'Phase 2: Core Features',
      weeks: 'Weeks 3-6',
      tasks: [
        { name: 'User Management', status: 'in-progress' },
        { name: 'Main Use Case Implementation', status: 'pending' },
        { name: 'Dashboard & Analytics', status: 'pending' },
      ],
      progress: 33,
    },
    {
      name: 'Phase 3: Polish & Launch',
      weeks: 'Weeks 7-12',
      tasks: [
        { name: 'UI/UX Refinement', status: 'pending' },
        { name: 'Performance & Security', status: 'pending' },
        { name: 'Deployment & Monitoring', status: 'pending' },
      ],
      progress: 0,
    },
  ];

  const overallProgress = 44; // (100 + 33 + 0) / 3

  return (
    <div className="space-y-6">
      {/* Overall progress */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">Overall Progress</h3>
          </div>
          <div className="text-2xl font-bold text-blue-600">{overallProgress}%</div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>12-week execution plan</span>
            <span>{overallProgress}% complete</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500"
              initial={{ width: '0%' }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Start</span>
            <span>Week 4 of 12</span>
            <span>Launch</span>
          </div>
        </div>
      </div>

      {/* Phase progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Phase Progress
          </h3>
          <div className="text-sm text-gray-600">3 phases • 12 weeks</div>
        </div>

        {phases.map((phase, index) => (
          <motion.div
            key={phase.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold">{phase.name}</h4>
                <div className="text-sm text-gray-600">{phase.weeks}</div>
              </div>
              <div className="text-lg font-bold text-blue-600">{phase.progress}%</div>
            </div>

            <div className="space-y-2">
              {phase.tasks.map((task) => (
                <div key={task.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {task.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : task.status === 'in-progress' ? (
                      <Clock className="w-4 h-4 text-blue-500 animate-pulse" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                    )}
                    <span className={`text-sm ${
                      task.status === 'completed' ? 'text-gray-700' :
                      task.status === 'in-progress' ? 'text-blue-700' :
                      'text-gray-500'
                    }`}>
                      {task.name}
                    </span>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status === 'completed' ? 'Completed' :
                     task.status === 'in-progress' ? 'In Progress' :
                     'Pending'}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                  initial={{ width: '0%' }}
                  animate={{ width: `${phase.progress}%` }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">7</div>
          <div className="text-sm text-gray-600">Tasks Completed</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">3</div>
          <div className="text-sm text-gray-600">Tasks In Progress</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">5</div>
          <div className="text-sm text-gray-600">Tasks Remaining</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">4</div>
          <div className="text-sm text-gray-600">Weeks Elapsed</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
