import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Users, Cpu, Sparkles } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

interface AgentVisualizationProps {
  agents: Agent[];
  agentsStatus: Record<string, string>;
}

const AgentVisualization: React.FC<AgentVisualizationProps> = ({ agents, agentsStatus }) => {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold">Agent Workflow Visualization</h2>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Sparkles className="w-4 h-4" />
          <span>Real-time Collaboration</span>
        </div>
      </div>

      <div className="relative">
        {/* Connection lines */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-green-200 to-purple-200 transform -translate-y-1/2 z-0"></div>
        
        {/* Agent nodes */}
        <div className="relative flex justify-between items-center z-10">
          {agents.map((agent, index) => {
            const status = agentsStatus[agent.id] || 'idle';
            const isActive = status === 'working';
            const isCompleted = status === 'completed';
            
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -10 : 0
                }}
                transition={{ 
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 200
                }}
                className="flex flex-col items-center"
              >
                {/* Agent node */}
                <div className="relative">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all duration-300 ${
                    isActive 
                      ? `bg-${agent.color} scale-110 ring-4 ring-${agent.color}/30`
                      : isCompleted
                      ? `bg-${agent.color} opacity-90`
                      : `bg-gray-100 border-2 border-dashed border-gray-300`
                  }`}>
                    {agent.emoji}
                  </div>
                  
                  {/* Status indicator */}
                  {isActive && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full ring-2 ring-white"
                    />
                  )}
                  
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full ring-2 ring-white flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Agent info */}
                <div className="mt-3 text-center">
                  <div className={`font-semibold text-sm ${
                    isActive ? `text-${agent.color}` : 'text-gray-700'
                  }`}>
                    {agent.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {isActive ? 'Working...' : 
                     isCompleted ? 'Completed' : 'Waiting'}
                  </div>
                </div>
                
                {/* Connection arrow */}
                {index < agents.length - 1 && (
                  <div className="absolute right-[-60px] top-1/2 transform -translate-y-1/2">
                    <motion.div
                      animate={{ 
                        x: isActive ? [0, 5, 0] : 0 
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        delay: index * 0.3
                      }}
                    >
                      <ArrowRight className={`w-6 h-6 ${
                        isActive || isCompleted ? `text-${agent.color}` : 'text-gray-300'
                      }`} />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
        
        {/* Progress bar */}
        <div className="mt-8">
          <div className="flex justify-between text-xs text-gray-600 mb-2">
            <span>Start</span>
            <span>Complete</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-green-500 to-purple-500"
              initial={{ width: '0%' }}
              animate={{ 
                width: `${Object.values(agentsStatus).filter(s => s === 'completed').length / agents.length * 100}%` 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-600">
              {Object.values(agentsStatus).filter(s => s === 'completed').length} of {agents.length} agents completed
            </span>
            <span className="text-xs font-medium">
              {Math.round(Object.values(agentsStatus).filter(s => s === 'completed').length / agents.length * 100)}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center p-3 bg-blue-50 rounded-xl">
          <div className="text-lg font-bold text-blue-600">
            {Object.values(agentsStatus).filter(s => s === 'working').length}
          </div>
          <div className="text-xs text-gray-600">Active Agents</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-xl">
          <div className="text-lg font-bold text-green-600">
            {Object.values(agentsStatus).filter(s => s === 'completed').length}
          </div>
          <div className="text-xs text-gray-600">Completed</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-xl">
          <div className="text-lg font-bold text-purple-600">
            {agents.length}
          </div>
          <div className="text-xs text-gray-600">Total Agents</div>
        </div>
      </div>
    </div>
  );
};

export default AgentVisualization;
