// Test database connection script
import { testConnection } from './config/database.js';
import { galleryService } from './services/galleryService.js';
import { birthdayService } from './services/birthdayService.js';
import { visitorService } from './services/visitorService.js';
import { analyticsService } from './services/analyticsService.js';

async function testDatabaseConnection() {
  console.log('🧪 Testing Project W Database Connection...\n');

  try {
    // Test basic connection
    console.log('1. Testing database connection...');
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Database connection failed');
      return;
    }
    console.log('✅ Database connection successful\n');

    // Test gallery service
    console.log('2. Testing gallery service...');
    const galleryResult = await galleryService.getAllImages();
    if (galleryResult.success) {
      console.log(`✅ Gallery service working - ${galleryResult.data.length} images found`);
    } else {
      console.error('❌ Gallery service failed:', galleryResult.error);
    }

    // Test birthday service
    console.log('\n3. Testing birthday service...');
    const birthdayResult = await birthdayService.getAllMessages();
    if (birthdayResult.success) {
      console.log(`✅ Birthday service working - ${birthdayResult.data.length} messages found`);
    } else {
      console.error('❌ Birthday service failed:', birthdayResult.error);
    }

    // Test visitor service
    console.log('\n4. Testing visitor service...');
    const visitorResult = await visitorService.getAllVisitors();
    if (visitorResult.success) {
      console.log(`✅ Visitor service working - ${visitorResult.data.length} visitors found`);
    } else {
      console.error('❌ Visitor service failed:', visitorResult.error);
    }

    // Test analytics service
    console.log('\n5. Testing analytics service...');
    const analyticsResult = await analyticsService.getDashboardData();
    if (analyticsResult.success) {
      console.log('✅ Analytics service working');
      console.log('   Dashboard data:', analyticsResult.data[0]);
    } else {
      console.error('❌ Analytics service failed:', analyticsResult.error);
    }

    // Test random birthday message
    console.log('\n6. Testing random birthday message...');
    const randomMessageResult = await birthdayService.getRandomMessage();
    if (randomMessageResult.success && randomMessageResult.data.length > 0) {
      console.log('✅ Random message service working');
      console.log('   Random message:', randomMessageResult.data[0].message);
    } else {
      console.log('⚠️  No random messages available (this is normal if no messages exist)');
    }

    console.log('\n🎉 Database connection test completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Gallery Images: ${galleryResult.success ? galleryResult.data.length : 'Error'}`);
    console.log(`   - Birthday Messages: ${birthdayResult.success ? birthdayResult.data.length : 'Error'}`);
    console.log(`   - Visitors: ${visitorResult.success ? visitorResult.data.length : 'Error'}`);
    console.log(`   - Analytics: ${analyticsResult.success ? 'Working' : 'Error'}`);

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure MySQL is running');
    console.log('   2. Check database credentials in .env file');
    console.log('   3. Verify project_w_db database exists');
    console.log('   4. Run the schema.sql script in MySQL Workbench');
  }
}

// Run the test
testDatabaseConnection();
