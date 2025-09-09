import React, { useState, useEffect } from 'react';
import customApi from './services/customApi';

const IntegrationTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('unknown');

  const runTests = async () => {
    setIsLoading(true);
    const results = {};

    try {
      // Test 1: Server Health
      console.log('Testing server health...');
      const health = await customApi.getHealthCheck();
      results.health = { success: true, data: health };
    } catch (error) {
      results.health = { success: false, error: error.message };
    }

    try {
      // Test 2: Server Status
      console.log('Testing server status...');
      const status = await customApi.getServerStatus();
      results.status = { success: true, data: status };
      setServerStatus(status.status);
    } catch (error) {
      results.status = { success: false, error: error.message };
    }

    try {
      // Test 3: Analytics
      console.log('Testing analytics...');
      const analytics = await customApi.getAnalytics();
      results.analytics = { success: true, data: analytics };
    } catch (error) {
      results.analytics = { success: false, error: error.message };
    }

    try {
      // Test 4: Gallery Images
      console.log('Testing gallery images...');
      const gallery = await customApi.getGalleryImages();
      results.gallery = { success: true, data: gallery };
    } catch (error) {
      results.gallery = { success: false, error: error.message };
    }

    try {
      // Test 5: Birthday Messages
      console.log('Testing birthday messages...');
      const messages = await customApi.getBirthdayMessages();
      results.messages = { success: true, data: messages };
    } catch (error) {
      results.messages = { success: false, error: error.message };
    }

    try {
      // Test 6: Random Message
      console.log('Testing random message...');
      const randomMessage = await customApi.getRandomBirthdayMessage();
      results.randomMessage = { success: true, data: randomMessage };
    } catch (error) {
      results.randomMessage = { success: false, error: error.message };
    }

    try {
      // Test 7: Visitors
      console.log('Testing visitors...');
      const visitors = await customApi.getVisitors();
      results.visitors = { success: true, data: visitors };
    } catch (error) {
      results.visitors = { success: false, error: error.message };
    }

    try {
      // Test 8: Birthday Wishes
      console.log('Testing birthday wishes...');
      const wishes = await customApi.getBirthdayWishes();
      results.wishes = { success: true, data: wishes };
    } catch (error) {
      results.wishes = { success: false, error: error.message };
    }

    // Test 9: Add Test Data
    try {
      console.log('Testing data creation...');
      const testMessage = await customApi.addBirthdayMessage(
        'This is a test message from the frontend!',
        'Frontend Tester'
      );
      results.addMessage = { success: true, data: testMessage };
    } catch (error) {
      results.addMessage = { success: false, error: error.message };
    }

    try {
      const testVisitor = await customApi.trackVisitor('Frontend Test Visitor');
      results.addVisitor = { success: true, data: testVisitor };
    } catch (error) {
      results.addVisitor = { success: false, error: error.message };
    }

    try {
      const testWish = await customApi.addBirthdayWish(
        'Frontend Tester',
        'This is a test wish from the frontend!',
        'test@example.com'
      );
      results.addWish = { success: true, data: testWish };
    } catch (error) {
      results.addWish = { success: false, error: error.message };
    }

    setTestResults(results);
    setIsLoading(false);
  };

  useEffect(() => {
    // Auto-run tests on component mount
    runTests();
  }, []);

  const getStatusIcon = (success) => {
    return success ? '✅' : '❌';
  };

  const getStatusColor = (success) => {
    return success ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🔗 Frontend-Backend-Database Integration Test
      </h1>
      
      <div className="mb-6 text-center">
        <button
          onClick={runTests}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? '🔄 Running Tests...' : '🧪 Run Tests Again'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Server Status */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">🖥️ Server Status</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Health Check:</span>
              <span className={getStatusColor(testResults.health?.success)}>
                {getStatusIcon(testResults.health?.success)}
                {testResults.health?.success ? 'OK' : 'Failed'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Server Status:</span>
              <span className={getStatusColor(testResults.status?.success)}>
                {getStatusIcon(testResults.status?.success)}
                {serverStatus || 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        {/* Database Connection */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">🗄️ Database Connection</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Analytics:</span>
              <span className={getStatusColor(testResults.analytics?.success)}>
                {getStatusIcon(testResults.analytics?.success)}
                {testResults.analytics?.success ? 'Connected' : 'Failed'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Gallery:</span>
              <span className={getStatusColor(testResults.gallery?.success)}>
                {getStatusIcon(testResults.gallery?.success)}
                {testResults.gallery?.success ? `${testResults.gallery.data?.count || 0} images` : 'Failed'}
              </span>
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">🔌 API Endpoints</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Messages:</span>
              <span className={getStatusColor(testResults.messages?.success)}>
                {getStatusIcon(testResults.messages?.success)}
                {testResults.messages?.success ? `${testResults.messages.data?.count || 0} messages` : 'Failed'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Visitors:</span>
              <span className={getStatusColor(testResults.visitors?.success)}>
                {getStatusIcon(testResults.visitors?.success)}
                {testResults.visitors?.success ? `${testResults.visitors.data?.count || 0} visitors` : 'Failed'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Wishes:</span>
              <span className={getStatusColor(testResults.wishes?.success)}>
                {getStatusIcon(testResults.wishes?.success)}
                {testResults.wishes?.success ? `${testResults.wishes.data?.count || 0} wishes` : 'Failed'}
              </span>
            </div>
          </div>
        </div>

        {/* Data Creation */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">✏️ Data Creation</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Add Message:</span>
              <span className={getStatusColor(testResults.addMessage?.success)}>
                {getStatusIcon(testResults.addMessage?.success)}
                {testResults.addMessage?.success ? 'Success' : 'Failed'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Add Visitor:</span>
              <span className={getStatusColor(testResults.addVisitor?.success)}>
                {getStatusIcon(testResults.addVisitor?.success)}
                {testResults.addVisitor?.success ? 'Success' : 'Failed'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Add Wish:</span>
              <span className={getStatusColor(testResults.addWish?.success)}>
                {getStatusIcon(testResults.addWish?.success)}
                {testResults.addWish?.success ? 'Success' : 'Failed'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Details */}
      {Object.keys(testResults).some(key => !testResults[key]?.success) && (
        <div className="mt-6 bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-2">❌ Error Details</h3>
          <div className="space-y-2">
            {Object.entries(testResults).map(([key, result]) => (
              !result?.success && (
                <div key={key} className="text-sm">
                  <span className="font-medium">{key}:</span>
                  <span className="text-red-600 ml-2">{result.error}</span>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Success Summary */}
      {Object.keys(testResults).length > 0 && (
        <div className="mt-6 bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">📊 Test Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Object.values(testResults).filter(r => r?.success).length}
              </div>
              <div className="text-sm text-green-700">Passed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {Object.values(testResults).filter(r => !r?.success).length}
              </div>
              <div className="text-sm text-red-700">Failed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {Object.keys(testResults).length}
              </div>
              <div className="text-sm text-blue-700">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((Object.values(testResults).filter(r => r?.success).length / Object.keys(testResults).length) * 100)}%
              </div>
              <div className="text-sm text-purple-700">Success Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Random Message Display */}
      {testResults.randomMessage?.success && testResults.randomMessage.data?.message && (
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">🎲 Random Birthday Message</h3>
          <p className="text-blue-700 italic">"{testResults.randomMessage.data.message.message}"</p>
          <p className="text-sm text-blue-600 mt-1">- {testResults.randomMessage.data.message.author}</p>
        </div>
      )}
    </div>
  );
};

export default IntegrationTest;
