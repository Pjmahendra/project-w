// Initialize SQLite database with schema
import { initDatabase, executeSingle } from './config/sqlite-database.js';
import fs from 'fs';
import path from 'path';

async function initializeDatabase() {
  console.log('🗄️  Initializing Project W SQLite Database...\n');

  try {
    // Initialize database connection
    const isConnected = await initDatabase();
    if (!isConnected) {
      console.error('❌ Failed to initialize database');
      return false;
    }

    // Read and execute schema
    const schemaPath = path.join(process.cwd(), 'database', 'sqlite-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log('📝 Executing database schema...');
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await executeSingle(statement);
        } catch (error) {
          // Ignore errors for statements that might already exist
          if (!error.message.includes('already exists') && !error.message.includes('duplicate')) {
            console.warn('Warning:', error.message);
          }
        }
      }
    }

    console.log('✅ Database schema executed successfully');
    console.log('✅ Database initialization completed');
    
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    return false;
  }
}

// Run initialization
initializeDatabase().then(success => {
  if (success) {
    console.log('\n🎉 Database is ready! You can now start the server.');
    process.exit(0);
  } else {
    console.log('\n❌ Database initialization failed. Please check the errors above.');
    process.exit(1);
  }
});
