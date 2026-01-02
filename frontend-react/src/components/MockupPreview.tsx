import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Tablet, Monitor, Code, Eye, Download, Maximize2 } from 'lucide-react';

const MockupPreview: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [selectedScreen, setSelectedScreen] = useState(0);

  const mockupData = {
    product_name: "Fitness Pro App",
    screens: [
      {
        name: "Dashboard",
        route: "/dashboard",
        layout: "dashboard",
        components: [
          {
            type: "header",
            title: "Welcome to Fitness Pro",
            text: "Track your workout progress and achieve your goals"
          },
          {
            type: "card",
            title: "Today's Summary",
            text: "You have completed 3 workouts today",
            cta: "View Details"
          },
          {
            type: "chart",
            title: "Weekly Progress",
            text: "Visual representation of your workout completion"
          },
          {
            type: "list",
            title: "Recent Activity",
            text: "Your latest workout entries"
          }
        ]
      },
      {
        name: "Create Workout",
        route: "/create",
        layout: "form",
        components: [
          {
            type: "header",
            title: "Create New Workout",
            text: "Fill out the form to add a new workout"
          },
          {
            type: "form",
            title: "Workout Details",
            fields: [
              { label: "Workout Name", placeholder: "Enter workout name" },
              { label: "Duration", placeholder: "Enter duration in minutes" },
              { label: "Intensity", placeholder: "Select intensity level" }
            ],
            cta: "Save Workout"
          }
        ]
      },
      {
        name: "Workout List",
        route: "/workouts",
        layout: "table",
        components: [
          {
            type: "header",
            title: "All Workouts",
            text: "View and manage your workout collection"
          },
          {
            type: "table",
            title: "Workouts",
            columns: ["Name", "Duration", "Intensity", "Actions"],
            rows: [
              ["Morning Run", "30 min", "Medium", "Edit, Delete"],
              ["Evening Yoga", "45 min", "Low", "Edit, Delete"]
            ]
          },
          {
            type: "button",
            title: "Add New Workout",
            cta: "Create Workout"
          }
        ]
      }
    ]
  };

  const deviceSizes = {
    mobile: 'w-64 h-[500px]',
    tablet: 'w-80 h-[600px]',
    desktop: 'w-full h-[400px]'
  };

  const renderComponent = (component: any, index: number) => {
    const baseClasses = "rounded-lg border p-4 mb-3";
    
    switch (component.type) {
      case 'header':
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${baseClasses} bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200`}
          >
            <h3 className="font-bold text-lg text-gray-800">{component.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{component.text}</p>
          </motion.div>
        );
      
      case 'card':
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${baseClasses} bg-white border-gray-200 shadow-sm`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-800">{component.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{component.text}</p>
              </div>
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                {component.cta}
              </button>
            </div>
          </motion.div>
        );
      
      case 'form':
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${baseClasses} bg-white border-gray-200`}
          >
            <h4 className="font-semibold text-gray-800 mb-3">{component.title}</h4>
            <div className="space-y-3">
              {component.fields.map((field: any, fieldIndex: number) => (
                <div key={fieldIndex}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
              {component.cta}
            </button>
          </motion.div>
        );
      
      case 'table':
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${baseClasses} bg-white border-gray-200 overflow-hidden`}
          >
            <h4 className="font-semibold text-gray-800 mb-3">{component.title}</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    {component.columns.map((col: string, colIndex: number) => (
                      <th key={colIndex} className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {component.rows.map((row: string[], rowIndex: number) => (
                    <tr key={rowIndex} className="border-t border-gray-200">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-3 text-sm text-gray-700">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Device selector */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedDevice('mobile')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              selectedDevice === 'mobile'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile</span>
          </button>
          <button
            onClick={() => setSelectedDevice('tablet')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              selectedDevice === 'tablet'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Tablet className="w-4 h-4" />
            <span>Tablet</span>
          </button>
          <button
            onClick={() => setSelectedDevice('desktop')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              selectedDevice === 'desktop'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Desktop</span>
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2">
            <Code className="w-4 h-4" />
            <span>View JSON</span>
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Screen selector */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {mockupData.screens.map((screen, index) => (
          <button
            key={screen.name}
            onClick={() => setSelectedScreen(index)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              selectedScreen === index
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {screen.name}
          </button>
        ))}
      </div>

      {/* Mockup preview */}
      <div className="relative">
        <div className={`${deviceSizes[selectedDevice]} mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-300`}>
          {/* Device frame */}
          {selectedDevice === 'mobile' && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-300 rounded-full"></div>
          )}
          
          {/* Screen content */}
          <div className="h-full overflow-y-auto p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {mockupData.screens[selectedScreen].name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Route: {mockupData.screens[selectedScreen].route}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <Maximize2 className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {mockupData.screens[selectedScreen].components.map((component, index) =>
                renderComponent(component, index)
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Component info */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Screen Details</h3>
          <div className="text-sm text-gray-600">
            {mockupData.screens[selectedScreen].components.length} components
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Screen Name</div>
            <div className="font-medium">{mockupData.screens[selectedScreen].name}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Route</div>
            <div className="font-medium">{mockupData.screens[selectedScreen].route}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Layout</div>
            <div className="font-medium">{mockupData.screens[selectedScreen].layout}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Device</div>
            <div className="font-medium">{selectedDevice.charAt(0).toUpperCase() + selectedDevice.slice(1)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockupPreview;
