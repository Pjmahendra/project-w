// Simple API test script for Project W Backend
// Run with: node test-api.js

const API_BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing Project W Backend API...\n');

  try {
    // Test server health
    console.log('1. Testing server health...');
    const healthResponse = await fetch(`${API_BASE_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.status);

    // Test server status
    console.log('\n2. Testing server status...');
    const statusResponse = await fetch(`${API_BASE_URL}/api/status`);
    const statusData = await statusResponse.json();
    console.log('✅ Server status:', statusData.status);

    // Test analytics
    console.log('\n3. Testing analytics...');
    const analyticsResponse = await fetch(`${API_BASE_URL}/api/analytics`);
    const analyticsData = await analyticsResponse.json();
    console.log('✅ Analytics:', {
      totalVisitors: analyticsData.totalVisitors,
      totalMessages: analyticsData.totalMessages,
      totalWishes: analyticsData.totalWishes
    });

    // Test gallery API
    console.log('\n4. Testing gallery API...');
    const galleryResponse = await fetch(`${API_BASE_URL}/api/gallery`);
    const galleryData = await galleryResponse.json();
    console.log('✅ Gallery images count:', galleryData.count);

    // Test adding a birthday message
    console.log('\n5. Testing birthday message creation...');
    const messageResponse = await fetch(`${API_BASE_URL}/api/birthday/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Happy Birthday! This is a test message.',
        author: 'API Tester'
      })
    });
    const messageData = await messageResponse.json();
    console.log('✅ Birthday message created:', messageData.success);

    // Test adding a visitor
    console.log('\n6. Testing visitor tracking...');
    const visitorResponse = await fetch(`${API_BASE_URL}/api/visitors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Visitor'
      })
    });
    const visitorData = await visitorResponse.json();
    console.log('✅ Visitor tracked:', visitorData.success);

    // Test adding a birthday wish
    console.log('\n7. Testing birthday wish creation...');
    const wishResponse = await fetch(`${API_BASE_URL}/api/wishes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Wisher',
        wish: 'Hope you have an amazing birthday!',
        email: 'test@example.com'
      })
    });
    const wishData = await wishResponse.json();
    console.log('✅ Birthday wish created:', wishData.success);

    // Test random birthday message
    console.log('\n8. Testing random birthday message...');
    const randomResponse = await fetch(`${API_BASE_URL}/api/birthday/random-message`);
    const randomData = await randomResponse.json();
    console.log('✅ Random message:', randomData.success ? 'Retrieved' : 'No messages available');

    console.log('\n🎉 All API tests completed successfully!');
    console.log('\n📊 Final analytics:');
    const finalAnalytics = await fetch(`${API_BASE_URL}/api/analytics`);
    const finalData = await finalAnalytics.json();
    console.log(`   - Total Visitors: ${finalData.totalVisitors}`);
    console.log(`   - Total Messages: ${finalData.totalMessages}`);
    console.log(`   - Total Wishes: ${finalData.totalWishes}`);

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('\n💡 Make sure the backend server is running on port 3000');
    console.log('   Run: cd backend && npm run dev');
  }
}

// Run the test
testAPI();
