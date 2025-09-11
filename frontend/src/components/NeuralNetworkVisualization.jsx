import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const NeuralNetworkVisualization = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Generate random data points for visualization
    const generateData = () => {
      const points = [];
      for (let i = 0; i < 50; i++) {
        points.push({
          id: i,
          x: Math.random() * 400,
          y: Math.random() * 300,
          value: Math.random(),
          category: Math.random() > 0.5 ? 'positive' : 'negative'
        });
      }
      setData(points);
    };

    generateData();
    const interval = setInterval(generateData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            AI Neural Network Visualization
          </h1>
          <p className="text-xl text-purple-200">
            Real-time machine learning model for medical diagnosis
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Neural Network Layers</h3>
            <div className="space-y-4">
              {['Input Layer', 'Hidden Layer 1', 'Hidden Layer 2', 'Output Layer'].map((layer, index) => (
                <motion.div
                  key={layer}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-4 border border-purple-400/30"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{layer}</span>
                    <div className="flex space-x-1">
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-3 h-3 bg-purple-400 rounded-full"
                          animate={{
                            scale: isAnimating ? [1, 1.2, 1] : 1,
                            opacity: isAnimating ? [0.5, 1, 0.5] : 1
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.1
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Data Visualization</h3>
            <div className="relative h-64 bg-black/20 rounded-lg overflow-hidden">
              <svg className="w-full h-full">
                {data.map((point) => (
                  <motion.circle
                    key={point.id}
                    cx={point.x}
                    cy={point.y}
                    r={4}
                    fill={point.category === 'positive' ? '#10B981' : '#EF4444'}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                ))}
              </svg>
            </div>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {isAnimating ? 'Stop' : 'Start'} Animation
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-semibold text-white mb-4">AI Diagnosis Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { condition: 'Normal', probability: 85, color: 'text-green-400' },
              { condition: 'Risk Factor', probability: 12, color: 'text-yellow-400' },
              { condition: 'Attention Required', probability: 3, color: 'text-red-400' }
            ].map((result, index) => (
              <motion.div
                key={result.condition}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-black/20 rounded-lg p-4"
              >
                <div className="text-white font-medium mb-2">{result.condition}</div>
                <div className={`text-2xl font-bold ${result.color}`}>
                  {result.probability}%
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${result.probability}%` }}
                    transition={{ duration: 1, delay: 1 + index * 0.2 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NeuralNetworkVisualization;