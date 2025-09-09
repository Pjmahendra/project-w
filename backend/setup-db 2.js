// Database setup script for Project W
import mysql from 'mysql2/promise';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupDatabase() {
  console.log('🔧 Project W Database Setup');
  console.log('==========================\n');

  try {
    // Get database credentials
    const host = await question('MySQL Host (localhost): ') || 'localhost';
    const port = await question('MySQL Port (3306): ') || '3306';
    const user = await question('MySQL Username (root): ') || 'root';
    const password = await question('MySQL Password: ');
    const database = await question('Database Name (project_w_db): ') || 'project_w_db';

    console.log('\n🔌 Testing database connection...');

    // Test connection
    const connection = await mysql.createConnection({
      host,
      port: parseInt(port),
      user,
      password,
      charset: 'utf8mb4'
    });

    console.log('✅ Connected to MySQL server');

    // Create database if it doesn't exist
    console.log('📁 Creating database...');
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    console.log(`✅ Database '${database}' ready`);

    // Switch to the database
    await connection.execute(`USE \`${database}\``);

    // Check if tables exist
    const [tables] = await connection.execute('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('⚠️  No tables found. Please run the schema.sql script in MySQL Workbench first.');
      console.log('   You can find it at: backend/database/schema.sql');
    } else {
      console.log(`✅ Found ${tables.length} tables in database`);
      
      // Show table info
      for (const table of tables) {
        const tableName = Object.values(table)[0];
        const [count] = await connection.execute(`SELECT COUNT(*) as count FROM \`${tableName}\``);
        console.log(`   - ${tableName}: ${count[0].count} records`);
      }
    }

    await connection.end();

    // Create .env file
    const envContent = `# Project W Backend Environment Variables
# Database Configuration
DB_HOST=${host}
DB_PORT=${port}
DB_USER=${user}
DB_PASSWORD=${password}
DB_NAME=${database}

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173

# Data Storage
DATA_DIR=./data

# Security
HELMET_CSP_ENABLED=false

# Logging
LOG_LEVEL=combined

# Gallery Configuration
MAX_IMAGE_SIZE=10485760
ALLOWED_IMAGE_TYPES=jpg,jpeg,png,gif,webp

# Birthday Messages
MAX_MESSAGE_LENGTH=500
MAX_WISH_LENGTH=1000

# Analytics
ANALYTICS_RETENTION_DAYS=30`;

    const fs = await import('fs');
    fs.writeFileSync('.env', envContent);
    console.log('✅ Created .env file with your database configuration');

    console.log('\n🎉 Database setup completed!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run test:db (to test the connection)');
    console.log('2. Run: npm run dev (to start the backend server)');
    console.log('3. In another terminal, run: npm run dev (from project root to start frontend)');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure MySQL is running');
    console.log('2. Check your MySQL credentials');
    console.log('3. Ensure you have permission to create databases');
  } finally {
    rl.close();
  }
}

setupDatabase();
