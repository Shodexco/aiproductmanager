import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Rocket, Users, Zap, Sparkles, 
  Brain, Layout, PenTool, Palette, FileText,
  Send, Bot, User, Loader2, ChevronRight,
  Moon, Sun, Settings, Download, Share2, Bell,
  Globe, Cpu, Shield, Cloud, Database
} from 'lucide-react';
import AgentChat from './components/AgentChat';
import AgentVisualization from './components/AgentVisualization';
import ProgressTracker from './components/ProgressTracker';
import MockupPreview from './components/MockupPreview';
import ExecutionPlan from './components/ExecutionPlan';

const AGENTS = [
  { 
    id: 'strategist', 
    name: 'Alex Sterling', 
    emoji: '🎯', 
    color: 'strategist', 
    icon: Brain, 
    description: 'Ex-McKinsey Strategist | Market Analysis & Business Strategy',
    title: 'Product Strategist',
    expertise: 'Porter\'s Five Forces, Blue Ocean Strategy, Business Model Canvas',
    bgColor: 'from-blue-500/10 to-blue-600/5',
    darkBgColor: 'from-blue-400/10 to-blue-500/5'
  },
  { 
    id: 'architect', 
    name: 'Dr. Maya Chen', 
    emoji: '🏗️', 
    color: 'architect', 
    icon: Layout, 
    description: 'Google Cloud Principal Architect | Scalable Systems Design',
    title: 'Technical Architect',
    expertise: 'Cloud-native Architecture, Microservices, Database Design',
    bgColor: 'from-green-500/10 to-green-600/5',
    darkBgColor: 'from-green-400/10 to-green-500/5'
  },
  { 
    id: 'ux-writer', 
    name: 'Jordan Rivera', 
    emoji: '✍️', 
    color: 'ux-writer', 
    icon: PenTool, 
    description: 'Apple Design Team | User Experience & Microcopy',
    title: 'UX Writer',
    expertise: 'Information Architecture, Accessibility, Voice & Tone',
    bgColor: 'from-purple-500/10 to-purple-600/5',
    darkBgColor: 'from-purple-400/10 to-purple-500/5'
  },
  { 
    id: 'mockup-designer', 
    name: 'Sofia Rossi', 
    emoji: '🎨', 
    color: 'mockup-designer', 
    icon: Palette, 
    description: 'IDEO Creative Director | Visual Design & Design Systems',
    title: 'Mockup Designer',
    expertise: 'Design Thinking, Component Libraries, Responsive Design',
    bgColor: 'from-pink-500/10 to-pink-600/5',
    darkBgColor: 'from-pink-400/10 to-pink-500/5'
  },
  { 
    id: 'synthesizer', 
    name: 'Prof. David Park', 
    emoji: '📋', 
    color: 'synthesizer', 
    icon: FileText, 
    description: 'Stanford Professor | PRD Synthesis & Requirements',
    title: 'PRD Synthesizer',
    expertise: 'PRD Best Practices, Stakeholder Alignment, Risk Assessment',
    bgColor: 'from-yellow-500/10 to-yellow-600/5',
    darkBgColor: 'from-yellow-400/10 to-yellow-500/5'
  },
];

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [productIdea, setProductIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  const [agentsStatus, setAgentsStatus] = useState<Record<string, string>>({});
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSubmitIdea = async () => {
    if (!productIdea.trim()) return;
    
    setIsGenerating(true);
    setRunId('demo-' + Date.now());
    
    // Simulate agent progression
    const agents = AGENTS.map(a => a.id);
    for (let i = 0; i < agents.length; i++) {
      setAgentsStatus(prev => ({
        ...prev,
        [agents[i]]: 'working'
      }));
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const nextAgent = i === agents.length - 1 ? agents[i] : agents[i + 1];
      setAgentsStatus(prev => ({
        ...prev,
        [agents[i]]: 'completed',
        [nextAgent]: 'working'
      }));
    }
    
    setIsGenerating(false);
  };

  return (
    <div className={`min-h-screen theme-transition ${darkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30'}`}>
      {/* Header */}
      <header className="glass-card sticky top-0 z-50 border-b border-border/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div 
                className="relative"
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Rocket className="w-8 h-8 text-primary" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold gradient-text gradient-text-dark">AI Product Manager</h1>
                <p className="text-sm text-muted-foreground">Generate PRDs with expert AI agent collaboration</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary/10">
                <Cpu className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">5 Expert Agents</span>
              </div>
              
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
              
              <button className="btn-primary flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Team Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input & Agents */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Idea Input */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6 card-hover"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-primary/10 mr-3">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Start Your Product Journey</h2>
                    <p className="text-sm text-muted-foreground">Describe your idea and watch our expert agents collaborate</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">Enterprise Secure</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Describe your product idea
                  </label>
                  <textarea
                    value={productIdea}
                    onChange={(e) => setProductIdea(e.target.value)}
                    placeholder="Example: A mobile app that helps people track their daily water intake with gamification elements and social accountability features..."
                    className="input-field h-32 resize-none"
                    disabled={isGenerating}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {productIdea.length > 0 && (
                      <span>{productIdea.length} characters • Ready for expert analysis</span>
                    )}
                  </div>
                  <button
                    onClick={handleSubmitIdea}
                    disabled={isGenerating || !productIdea.trim()}
                    className="btn-primary px-6 py-3 flex items-center"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate PRD with Experts
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Agent Visualization */}
            <AgentVisualization agents={AGENTS} agentsStatus={agentsStatus} />

            {/* Tabs for different views */}
            <div className="glass-card rounded-2xl overflow-hidden card-hover">
              <div className="border-b border-border/20">
                <nav className="flex space-x-1 px-4">
                  {[
                    { id: 'chat', label: 'Expert Chat', icon: MessageSquare },
                    { id: 'progress', label: 'Progress', icon: ChevronRight },
                    { id: 'mockup', label: 'Mockups', icon: Palette },
                    { id: 'plan', label: 'Execution Plan', icon: FileText },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-3 font-medium text-sm transition-colors relative ${
                        activeTab === tab.id
                          ? 'text-primary'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <tab.icon className="w-4 h-4 inline mr-2" />
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        />
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'chat' && (
                    <motion.div
                      key="chat"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <AgentChat />
                    </motion.div>
                  )}
                  
                  {activeTab === 'progress' && (
                    <motion.div
                      key="progress"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ProgressTracker />
                    </motion.div>
                  )}
                  
                  {activeTab === 'mockup' && (
                    <motion.div
                      key="mockup"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <MockupPreview />
                    </motion.div>
                  )}
                  
                  {activeTab === 'plan' && (
                    <motion.div
                      key="plan"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ExecutionPlan />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Column - Agent Team & Stats */}
          <div className="space-y-8">
            {/* Agent Team */}
            <div className="glass-card rounded-2xl p-6 card-hover">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  Expert Agent Team
                </h2>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                  Live Collaboration
                </span>
              </div>
              
              <div className="space-y-4">
                {AGENTS.map((agent, index) => {
                  const Icon = agent.icon;
                  const status = agentsStatus[agent.id] || 'idle';
                  
                  return (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border-2 transition-all card-hover ${
                        status === 'working'
                          ? `border-primary/30 bg-gradient-to-br ${agent.bgColor} dark:${agent.darkBgColor}`
                          : status === 'completed'
                          ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                          : 'border-border bg-card'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`relative p-2 rounded-lg ${
                            status === 'working' 
                              ? 'bg-primary/20 animate-pulse-slow' 
                              : 'bg-secondary'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              status === 'working' 
                                ? 'text-primary' 
                                : 'text-muted-foreground'
                            }`} />
                            {status === 'working' && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              <span className="font-semibold truncate">{agent.name}</span>
                              <span className="ml-2 text-lg">{agent.emoji}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{agent.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{agent.expertise}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                            status === 'working'
                              ? 'bg-primary/20 text-primary'
                              : status === 'completed'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                              : 'bg-secondary text-muted-foreground'
                          }`}>
                            {status === 'working' ? 'Analyzing...' : 
                             status === 'completed' ? 'Completed' : 'Ready'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Stats */}
            <div className="glass-card rounded-2xl p-6 card-hover">
              <h2 className="text-xl font-bold mb-6">Live Analytics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 dark:from-blue-400/10 dark:to-blue-500/5">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">5</div>
                  <div className="text-sm text-muted-foreground">Expert Agents</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 dark:from-green-400/10 dark:to-green-500/5">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">12</div>
                  <div className="text-sm text-muted-foreground">PRD Sections</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 dark:from-purple-400/10 dark:to-purple-500/5">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">3-5</div>
                  <div className="text-sm text-muted-foreground">Mockup Screens</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 dark:from-yellow-400/10 dark:to-yellow-500/5">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">12</div>
                  <div className="text-sm text-muted-foreground">Week Plan</div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-border/20">
                <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button className="btn-secondary text-sm py-2">
                    <Download className="w-3 h-3 mr-1 inline" />
                    Export PRD
                  </button>
                  <button className="btn-secondary text-sm py-2">
                    <Share2 className="w-3 h-3 mr-1 inline" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-border/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <Rocket className="w-5 h-5 text-primary" />
                <span className="font-medium">AI Product Manager</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Generate professional PRDs with expert AI collaboration
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </button>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </button>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </button>
              <div className="text-xs text-muted-foreground">
                v1.0.0 • Expert Edition
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
