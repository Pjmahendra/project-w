import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database configuration
const dbPath = process.env.DB_PATH || './data/project_w.db';

// Create database connection
let db = null;

export const initDatabase = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    console.log('✅ SQLite database connected');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Test database connection
export const testConnection = async () => {
  try {
    if (!db) {
      await initDatabase();
    }
    
    // Test with a simple query
    await db.get('SELECT 1 as test');
    console.log('✅ Database connection test successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    return false;
  }
};

// Execute query with error handling
export const executeQuery = async (query, params = []) => {
  try {
    if (!db) {
      await initDatabase();
    }
    
    const result = await db.all(query, params);
    return { success: true, data: result };
  } catch (error) {
    console.error('Database query error:', error);
    return { success: false, error: error.message };
  }
};

// Execute single query (for INSERT, UPDATE, DELETE)
export const executeSingle = async (query, params = []) => {
  try {
    if (!db) {
      await initDatabase();
    }
    
    const result = await db.run(query, params);
    return { success: true, data: result };
  } catch (error) {
    console.error('Database query error:', error);
    return { success: false, error: error.message };
  }
};

// Get single row
export const getSingle = async (query, params = []) => {
  try {
    if (!db) {
      await initDatabase();
    }
    
    const result = await db.get(query, params);
    return { success: true, data: result };
  } catch (error) {
    console.error('Database query error:', error);
    return { success: false, error: error.message };
  }
};

// Close database connection
export const closeDatabase = async () => {
  try {
    if (db) {
      await db.close();
      console.log('Database connection closed');
    }
  } catch (error) {
    console.error('Error closing database:', error);
  }
};

export default db;
