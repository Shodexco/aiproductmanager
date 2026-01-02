import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Send, Brain, Layout, PenTool, Palette, FileText, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  agent?: string;
  timestamp: Date;
  isTyping?: boolean;
}

const AGENT_ICONS = {
  strategist: Brain,
  architect: Layout,
  'ux-writer': PenTool,
  'mockup-designer': Palette,
  synthesizer: FileText,
};

const AGENT_COLORS = {
  strategist: 'bg-blue-100 text-blue-800 border-blue-200',
  architect: 'bg-green-100 text-green-800 border-green-200',
  'ux-writer': 'bg-purple-100 text-purple-800 border-purple-200',
  'mockup-designer': 'bg-pink-100 text-pink-800 border-pink-200',
  synthesizer: 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

const AGENT_NAMES = {
  strategist: 'Alex Sterling',
  architect: 'Dr. Maya Chen',
  'ux-writer': 'Jordan Rivera',
  'mockup-designer': 'Sofia Rossi',
  synthesizer: 'Prof. David Park',
};

const AGENT_TITLES = {
  strategist: 'Product Strategist',
  architect: 'Technical Architect',
  'ux-writer': 'UX Writer',
  'mockup-designer': 'Mockup Designer',
  synthesizer: 'PRD Synthesizer',
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    content: "Hi! I'm Alex Sterling, ex-McKinsey Product Strategist. I'll analyze your product idea through multiple strategic lenses. First, let's understand the core problem and market opportunity. What's the primary target audience and their key pain points?",
    sender: 'agent',
    agent: 'strategist',
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: '2',
    content: "I'm thinking of building a fitness app for busy professionals who want quick, effective workouts they can do anywhere.",
    sender: 'user',
    timestamp: new Date(Date.now() - 240000),
  },
  {
    id: '3',
    content: "Excellent. Using the Jobs-to-be-Done framework, what specific 'job' are busy professionals hiring this app to do? Are they looking for time efficiency, motivation, expert guidance, or all three?",
    sender: 'agent',
    agent: 'strategist',
    timestamp: new Date(Date.now() - 180000),
  },
  {
    id: '4',
    content: "Primarily time efficiency and expert guidance. They know they should exercise but struggle with planning effective short workouts.",
    sender: 'user',
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: '5',
    content: "Perfect analysis. Based on Porter's Five Forces, I see a competitive but growing market. I'll now pass this to Dr. Maya Chen, our Technical Architect, to translate this into a scalable technical approach. She'll consider cloud-native architecture and optimal tech stack for your target users.",
    sender: 'agent',
    agent: 'strategist',
    timestamp: new Date(Date.now() - 60000),
  },
];

const AgentChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thanks for that information! I'll incorporate it into the product strategy. What are the key success metrics you're aiming for?",
        sender: 'agent',
        agent: 'strategist',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      {/* Chat header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Bot className="w-5 h-5 text-blue-600" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <h3 className="font-semibold">Live Agent Conversation</h3>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Sparkles className="w-4 h-4" />
          <span>5 AI Agents Collaborating</span>
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2">
        <AnimatePresence>
          {messages.map((message) => {
            const AgentIcon = message.agent ? AGENT_ICONS[message.agent as keyof typeof AGENT_ICONS] : Bot;
            const agentColor = message.agent ? AGENT_COLORS[message.agent as keyof typeof AGENT_COLORS] : 'bg-gray-100 text-gray-800 border-gray-200';

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'glass-card border'
                  }`}
                >
                  {message.sender === 'agent' && message.agent && (
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`p-1 rounded-lg ${agentColor.split(' ')[0]}`}>
                        <AgentIcon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${agentColor}`}>
                          {AGENT_NAMES[message.agent as keyof typeof AGENT_NAMES]}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          {AGENT_TITLES[message.agent as keyof typeof AGENT_TITLES]}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="glass-card border rounded-2xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-1 rounded-lg bg-blue-100">
                    <Brain className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      Alex Sterling
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      Product Strategist
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
                    <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">Analyzing with strategic frameworks...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="mt-4">
        <div className="flex space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your response to the AI agent..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
            rows={2}
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default AgentChat;
