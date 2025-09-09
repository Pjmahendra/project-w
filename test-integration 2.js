// Simple integration test for Project W
// Using built-in fetch (Node.js 18+)

const API_BASE_URL = 'http://localhost:3000';

async function testIntegration() {
  console.log('🧪 Testing Project W Integration...\n');

  const tests = [
    {
      name: 'Health Check',
      url: '/api/health',
      method: 'GET'
    },
    {
      name: 'Server Status',
      url: '/api/status',
      method: 'GET'
    },
    {
      name: 'Analytics',
      url: '/api/analytics',
      method: 'GET'
    },
    {
      name: 'Gallery Images',
      url: '/api/gallery',
      method: 'GET'
    },
    {
      name: 'Birthday Messages',
      url: '/api/birthday/messages',
      method: 'GET'
    },
    {
      name: 'Visitors',
      url: '/api/visitors',
      method: 'GET'
    },
    {
      name: 'Birthday Wishes',
      url: '/api/wishes',
      method: 'GET'
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`Testing ${test.name}...`);
      const response = await fetch(`${API_BASE_URL}${test.url}`, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${test.name}: OK`);
        if (data.count !== undefined) {
          console.log(`   Records: ${data.count}`);
        }
        passed++;
      } else {
        console.log(`❌ ${test.name}: HTTP ${response.status}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`);
      failed++;
    }
  }

  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! Your integration is working perfectly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check your backend server and database connection.');
  }
}

// Check if backend is running
async function checkBackend() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function main() {
  console.log('🔍 Checking if backend is running...');
  
  if (await checkBackend()) {
    console.log('✅ Backend is running, starting tests...\n');
    await testIntegration();
  } else {
    console.log('❌ Backend is not running.');
    console.log('\nPlease start the backend first:');
    console.log('1. cd backend');
    console.log('2. npm run setup (if first time)');
    console.log('3. npm run dev');
    console.log('\nThen run this test again.');
  }
}

main();
