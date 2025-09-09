import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import database and services
import { testConnection, initDatabase } from './config/sqlite-database.js';
import { galleryService } from './services/sqlite-galleryService.js';

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the frontend build
app.use(express.static(path.join(__dirname, '../dist')));

// Initialize database on startup
const initializeDatabase = async () => {
  console.log('🔌 Initializing SQLite database...');
  const isConnected = await initDatabase();
  if (!isConnected) {
    console.error('❌ Failed to initialize database.');
    process.exit(1);
  }
  console.log('✅ SQLite database initialized');
};

// Initialize database
initializeDatabase();

// Routes

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Project W Backend Server',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      status: '/api/status',
      analytics: '/api/analytics',
      gallery: '/api/gallery',
      birthday: '/api/birthday',
      visitors: '/api/visitors',
      wishes: '/api/wishes'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version
  });
});

// Server status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    server: 'Project W Backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Analytics
app.get('/api/analytics', async (req, res) => {
  try {
    const galleryStats = await galleryService.getImageStats();
    
    const analytics = {
      totalImages: galleryStats.data?.total_images || 0,
      activeImages: galleryStats.data?.active_images || 0,
      totalVisitors: 0,
      totalMessages: 0,
      totalWishes: 0,
      lastUpdated: new Date().toISOString()
    };
    
    res.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Gallery API
app.get('/api/gallery', async (req, res) => {
  try {
    const result = await galleryService.getAllImages();
    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch gallery images'
      });
    }
    
    res.json({
      images: result.data,
      count: result.data.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Gallery fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.post('/api/gallery', async (req, res) => {
  try {
    const { src, alt, metadata, display_order, file_size, mime_type, width, height } = req.body;
    
    if (!src) {
      return res.status(400).json({
        success: false,
        error: 'Image source is required'
      });
    }
    
    const result = await galleryService.addImage({
      src,
      alt: alt || '',
      metadata: metadata || {},
      display_order: display_order || 0,
      file_size,
      mime_type,
      width,
      height
    });
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to add image'
      });
    }
    
    res.status(201).json({
      success: true,
      image: result.data,
      message: 'Image added successfully'
    });
  } catch (error) {
    console.error('Gallery add error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.put('/api/gallery/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const result = await galleryService.updateImage(id, updateData);
    
    if (!result.success) {
      if (result.error === 'No fields to update') {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to update image'
      });
    }
    
    // Get updated image
    const imageResult = await galleryService.getImageById(id);
    if (!imageResult.success || imageResult.data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Image not found'
      });
    }
    
    res.json({
      success: true,
      image: imageResult.data[0],
      message: 'Image updated successfully'
    });
  } catch (error) {
    console.error('Gallery update error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.delete('/api/gallery/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await galleryService.deleteImage(id);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to delete image'
      });
    }
    
    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Gallery delete error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Birthday Messages API (simplified)
app.get('/api/birthday/messages', (req, res) => {
  const messages = [
    { id: '1', message: 'Happy Birthday! Hope you have an amazing day!', author: 'Sarah', likes: 5 },
    { id: '2', message: 'Wishing you a wonderful year ahead!', author: 'Mike', likes: 3 },
    { id: '3', message: 'Another year older, another year wiser!', author: 'Emma', likes: 7 }
  ];
  
  res.json({
    messages: messages,
    count: messages.length,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/birthday/messages', (req, res) => {
  const { message, author = 'Anonymous' } = req.body;
  
  if (!message || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Message is required'
    });
  }
  
  const newMessage = {
    id: Date.now().toString(),
    message: message.trim(),
    author: author.trim(),
    likes: 0,
    created_at: new Date().toISOString()
  };
  
  res.status(201).json({
    success: true,
    message: newMessage
  });
});

app.get('/api/birthday/random-message', (req, res) => {
  const messages = [
    { id: '1', message: 'Happy Birthday! Hope you have an amazing day!', author: 'Sarah', likes: 5 },
    { id: '2', message: 'Wishing you a wonderful year ahead!', author: 'Mike', likes: 3 },
    { id: '3', message: 'Another year older, another year wiser!', author: 'Emma', likes: 7 }
  ];
  
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  
  res.json({
    success: true,
    message: randomMessage
  });
});

// Visitors API (simplified)
app.get('/api/visitors', (req, res) => {
  const visitors = [
    { id: '1', name: 'Alice Johnson', visited_at: new Date().toISOString() },
    { id: '2', name: 'Bob Smith', visited_at: new Date().toISOString() },
    { id: '3', name: 'Carol Davis', visited_at: new Date().toISOString() }
  ];
  
  res.json({
    visitors: visitors,
    count: visitors.length,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/visitors', (req, res) => {
  const { name = 'Anonymous Visitor' } = req.body;
  
  const newVisitor = {
    id: Date.now().toString(),
    name: name.trim(),
    visited_at: new Date().toISOString()
  };
  
  res.status(201).json({
    success: true,
    visitor: newVisitor
  });
});

// Birthday Wishes API (simplified)
app.get('/api/wishes', (req, res) => {
  const wishes = [
    { id: '1', name: 'David Wilson', wish: 'Hope you have the most wonderful birthday ever!', email: 'david@example.com' },
    { id: '2', name: 'Lisa Brown', wish: 'Wishing you a day as special as you are!', email: 'lisa@example.com' },
    { id: '3', name: 'Tom Anderson', wish: 'Another year of amazing memories!', email: 'tom@example.com' }
  ];
  
  res.json({
    wishes: wishes,
    count: wishes.length,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/wishes', (req, res) => {
  const { name, wish, email = null } = req.body;
  
  if (!name || !wish) {
    return res.status(400).json({
      success: false,
      error: 'Name and wish are required'
    });
  }
  
  const newWish = {
    id: Date.now().toString(),
    name: name.trim(),
    wish: wish.trim(),
    email: email ? email.trim() : null,
    created_at: new Date().toISOString()
  };
  
  res.status(201).json({
    success: true,
    wish: newWish
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Project W Backend Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📈 Analytics: http://localhost:${PORT}/api/analytics`);
  console.log(`🎨 Gallery API: http://localhost:${PORT}/api/gallery`);
  console.log(`🎂 Birthday API: http://localhost:${PORT}/api/birthday/messages`);
  console.log(`👥 Visitors API: http://localhost:${PORT}/api/visitors`);
  console.log(`💝 Wishes API: http://localhost:${PORT}/api/wishes`);
  console.log(`\n🌐 Server accessible from:`);
  console.log(`   - http://localhost:${PORT}`);
  console.log(`   - http://127.0.0.1:${PORT}`);
  console.log(`   - http://192.168.0.116:${PORT} (if on local network)`);
  console.log(`\n🗄️  Database: MySQL (project_w_db)`);
  console.log(`🔗 Frontend: http://localhost:5173`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
