import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Target, Users, Code, Rocket, CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';

const ExecutionPlan: React.FC = () => {
  const phases = [
    {
      name: 'Phase 1: Foundation',
      weeks: 'Weeks 1-2',
      color: 'blue',
      tasks: [
        { name: 'Setup Development Environment', status: 'completed', assignee: 'Dev Team' },
        { name: 'Backend Foundation (FastAPI)', status: 'completed', assignee: 'Backend Team' },
        { name: 'Frontend Foundation (React)', status: 'completed', assignee: 'Frontend Team' },
        { name: 'Database Schema Design', status: 'completed', assignee: 'Backend Team' },
      ],
      deliverables: ['Git Repository', 'Basic API Endpoints', 'React Project Structure', 'Database Schema'],
    },
    {
      name: 'Phase 2: Core Features',
      weeks: 'Weeks 3-6',
      color: 'green',
      tasks: [
        { name: 'User Authentication System', status: 'in-progress', assignee: 'Backend Team' },
        { name: 'Main Feature Implementation', status: 'pending', assignee: 'Full Stack' },
        { name: 'Dashboard & Analytics', status: 'pending', assignee: 'Frontend Team' },
        { name: 'API Integration', status: 'pending', assignee: 'Backend Team' },
        { name: 'Basic Testing Suite', status: 'pending', assignee: 'QA Team' },
      ],
      deliverables: ['User Registration/Login', 'Core MVP Features', 'Analytics Dashboard', 'API Documentation'],
    },
    {
      name: 'Phase 3: Polish & Launch',
      weeks: 'Weeks 7-12',
      color: 'purple',
      tasks: [
        { name: 'UI/UX Refinement', status: 'pending', assignee: 'Design Team' },
        { name: 'Performance Optimization', status: 'pending', assignee: 'Dev Team' },
        { name: 'Security Audit', status: 'pending', assignee: 'Security Team' },
        { name: 'Deployment Pipeline', status: 'pending', assignee: 'DevOps' },
        { name: 'User Documentation', status: 'pending', assignee: 'Product Team' },
        { name: 'Launch Preparation', status: 'pending', assignee: 'All Teams' },
      ],
      deliverables: ['Polished UI', 'Production Deployment', 'Security Certification', 'User Guide', 'Launch'],
    },
  ];

  const teamMembers = [
    { name: 'Backend Team', count: 3, color: 'bg-blue-100 text-blue-800' },
    { name: 'Frontend Team', count: 2, color: 'bg-green-100 text-green-800' },
    { name: 'Design Team', count: 1, color: 'bg-purple-100 text-purple-800' },
    { name: 'QA Team', count: 2, color: 'bg-yellow-100 text-yellow-800' },
    { name: 'DevOps', count: 1, color: 'bg-red-100 text-red-800' },
    { name: 'Product Team', count: 2, color: 'bg-indigo-100 text-indigo-800' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500 animate-pulse" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">12-Week Execution Plan</h2>
              <p className="text-sm text-gray-600">Detailed roadmap for product development</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">44%</div>
            <div className="text-sm text-gray-600">Overall Progress</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-xl">
            <div className="text-lg font-bold text-blue-600">4</div>
            <div className="text-sm text-gray-600">Weeks Completed</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-xl">
            <div className="text-lg font-bold text-green-600">7</div>
            <div className="text-sm text-gray-600">Tasks Done</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-xl">
            <div className="text-lg font-bold text-purple-600">8</div>
            <div className="text-sm text-gray-600">Tasks Remaining</div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Development Timeline
          </h3>
          <div className="text-sm text-gray-600">3 phases • 12 weeks • 15 tasks</div>
        </div>

        {phases.map((phase, phaseIndex) => (
          <motion.div
            key={phase.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: phaseIndex * 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-${phase.color}-100`}>
                  <Target className={`w-5 h-5 text-${phase.color}-600`} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{phase.name}</h4>
                  <div className="text-sm text-gray-600">{phase.weeks}</div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full bg-${phase.color}-100 text-${phase.color}-800 text-sm font-medium`}>
                {phase.tasks.filter(t => t.status === 'completed').length}/{phase.tasks.length} tasks
              </div>
            </div>

            {/* Tasks */}
            <div className="space-y-3 mb-4">
              {phase.tasks.map((task, taskIndex) => (
                <motion.div
                  key={task.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: phaseIndex * 0.1 + taskIndex * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(task.status)}
                    <div>
                      <div className="font-medium">{task.name}</div>
                      <div className="text-sm text-gray-600">Assigned to: {task.assignee}</div>
                    </div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                    {task.status === 'completed' ? 'Completed' :
                     task.status === 'in-progress' ? 'In Progress' : 'Pending'}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Deliverables */}
            <div>
              <h5 className="font-semibold mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Key Deliverables
              </h5>
              <div className="flex flex-wrap gap-2">
                {phase.deliverables.map((deliverable, index) => (
                  <span
                    key={deliverable}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {deliverable}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Team & Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Team Allocation
            </h3>
            <div className="text-sm text-gray-600">11 team members</div>
          </div>
          
          <div className="space-y-3">
            {teamMembers.map((team, index) => (
              <div key={team.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${team.color.split(' ')[0]}`}></div>
                  <span className="font-medium">{team.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-gray-600">{team.count} members</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${team.color}`}>
                    Active
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Key Metrics
            </h3>
            <div className="text-sm text-gray-600">Success indicators</div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Development Velocity</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Code Quality</span>
                <span className="font-medium">92%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '92%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Team Satisfaction</span>
                <span className="font-medium">78%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: '78%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Budget Utilization</span>
                <span className="font-medium">65%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Definition of Done */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Definition of Done for MVP</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <div className="font-medium">All user stories implemented</div>
              <div className="text-sm text-gray-600">From MVP scope</div>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <div className="font-medium">Security audit passed</div>
              <div className="text-sm text-gray-600">No critical vulnerabilities</div>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <div className="font-medium">Performance benchmarks met</div>
              <div className="text-sm text-gray-600">Load time under 2s</div>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <div className="font-medium">Documentation complete</div>
              <div className="text-sm text-gray-600">API docs, user guide</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionPlan;
