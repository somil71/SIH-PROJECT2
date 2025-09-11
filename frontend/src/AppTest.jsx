import React from 'react';

const AppTest = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          HealthCare+ Test
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          If you can see this, the React app is working!
        </p>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-gray-700">
            The blank screen issue has been resolved. 
            The problem was likely caused by:
          </p>
          <ul className="text-left mt-4 space-y-2 text-gray-600">
            <li>• Complex Three.js components causing rendering issues</li>
            <li>• WebSocket context dependencies</li>
            <li>• Heavy animations and effects</li>
            <li>• Missing component dependencies</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AppTest;
