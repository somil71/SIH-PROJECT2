import React from 'react';

const TestApp = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Healthcare App Test
        </h1>
        <p className="text-gray-700 text-lg">
          If you can see this, the basic app is working!
        </p>
        <div className="mt-8 space-x-4">
          <button 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            onClick={() => alert('Button clicked!')}
          >
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestApp;
