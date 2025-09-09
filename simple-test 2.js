// Simple integration test using curl commands
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const API_BASE_URL = 'http://localhost:3000';

async function testEndpoint(endpoint, name) {
  try {
    console.log(`Testing ${name}...`);
    const { stdout, stderr } = await execAsync(`curl -s -w "%{http_code}" -o /dev/null "${API_BASE_URL}${endpoint}"`);
    
    if (stdout.trim() === '200') {
      console.log(`✅ ${name}: OK`);
      return true;
    } else {
      console.log(`❌ ${name}: HTTP ${stdout.trim()}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    return false;
  }
}

async function testIntegration() {
  console.log('🧪 Testing Project W Integration...\n');

  const tests = [
    { endpoint: '/api/health', name: 'Health Check' },
    { endpoint: '/api/status', name: 'Server Status' },
    { endpoint: '/api/analytics', name: 'Analytics' },
    { endpoint: '/api/gallery', name: 'Gallery Images' },
    { endpoint: '/api/birthday/messages', name: 'Birthday Messages' },
    { endpoint: '/api/visitors', name: 'Visitors' },
    { endpoint: '/api/wishes', name: 'Birthday Wishes' }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const success = await testEndpoint(test.endpoint, test.name);
    if (success) {
      passed++;
    } else {
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
    console.log('\nTroubleshooting:');
    console.log('1. Make sure backend is running: cd backend && npm run dev');
    console.log('2. Check database connection: cd backend && npm run test:db');
    console.log('3. Verify MySQL is running and accessible');
  }
}

// Check if backend is running first
async function checkBackend() {
  try {
    const { stdout } = await execAsync(`curl -s -w "%{http_code}" -o /dev/null "${API_BASE_URL}/api/health"`);
    return stdout.trim() === '200';
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
