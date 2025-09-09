# Project W Backend Server

A Node.js/Express backend server for the Project W Dome Gallery Birthday App.

## Features

- **Gallery Management**: CRUD operations for gallery images
- **Birthday Messages**: Store and retrieve birthday messages
- **Visitor Tracking**: Track and analyze visitor data
- **Birthday Wishes**: Collect and manage birthday wishes
- **Analytics**: Comprehensive analytics and statistics
- **CORS Support**: Configured for frontend communication
- **Data Persistence**: JSON-based data storage with auto-save

## Quick Start

### Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Copy environment variables:
   ```bash
   cp env.example .env
   ```

4. Start the server:
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000` by default.

## API Endpoints

### Server Information
- `GET /` - Server information and available endpoints
- `GET /api/health` - Health check
- `GET /api/status` - Server status
- `GET /api/analytics` - Analytics and statistics

### Gallery API
- `GET /api/gallery` - Get all gallery images
- `POST /api/gallery` - Add new image
- `PUT /api/gallery/:id` - Update image
- `DELETE /api/gallery/:id` - Delete image

### Birthday Messages
- `GET /api/birthday/messages` - Get all birthday messages
- `POST /api/birthday/messages` - Add new birthday message
- `GET /api/birthday/random-message` - Get random birthday message

### Visitors
- `GET /api/visitors` - Get all visitors
- `POST /api/visitors` - Track new visitor

### Birthday Wishes
- `GET /api/wishes` - Get all birthday wishes
- `POST /api/wishes` - Add new birthday wish

## Data Structure

### Gallery Image
```json
{
  "id": "uuid",
  "src": "image-url",
  "alt": "alt-text",
  "metadata": {},
  "createdAt": "ISO-timestamp",
  "updatedAt": "ISO-timestamp"
}
```

### Birthday Message
```json
{
  "id": "uuid",
  "message": "Happy Birthday!",
  "author": "Author Name",
  "createdAt": "ISO-timestamp",
  "likes": 0
}
```

### Visitor
```json
{
  "id": "uuid",
  "name": "Visitor Name",
  "visitedAt": "ISO-timestamp",
  "ip": "IP-address",
  "userAgent": "User-Agent-String"
}
```

### Birthday Wish
```json
{
  "id": "uuid",
  "name": "Wisher Name",
  "wish": "Birthday wish text",
  "email": "email@example.com",
  "createdAt": "ISO-timestamp",
  "approved": false
}
```

## Configuration

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
DATA_DIR=./data
HELMET_CSP_ENABLED=false
LOG_LEVEL=combined
MAX_IMAGE_SIZE=10485760
ALLOWED_IMAGE_TYPES=jpg,jpeg,png,gif,webp
MAX_MESSAGE_LENGTH=500
MAX_WISH_LENGTH=1000
ANALYTICS_RETENTION_DAYS=30
```

### CORS Configuration

The server is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Backend server)
- `http://127.0.0.1:5173` (Alternative localhost)

## Data Storage

Data is stored in JSON format in the `./data/data.json` file. The server automatically saves data every 30 seconds and on shutdown.

### Data Directory Structure
```
backend/
├── data/
│   └── data.json          # Main data file
├── server.js              # Main server file
├── package.json           # Dependencies
├── env.example           # Environment variables template
└── README.md             # This file
```

## Development

### Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with auto-restart
- `npm test` - Run tests (not implemented yet)

### Adding New Endpoints

1. Add the route handler in `server.js`
2. Update the data structure if needed
3. Add appropriate error handling
4. Update this README with the new endpoint documentation

### Error Handling

The server includes comprehensive error handling:
- 400: Bad Request (invalid input)
- 404: Not Found (resource not found)
- 500: Internal Server Error (server error)

All errors return a consistent JSON format:
```json
{
  "success": false,
  "error": "Error message",
  "message": "Additional details (development only)"
}
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure proper CORS origins
3. Set up proper logging
4. Consider using a proper database instead of JSON files
5. Set up monitoring and health checks
6. Configure reverse proxy (nginx/Apache)

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the PORT environment variable
2. **CORS errors**: Check CORS_ORIGIN configuration
3. **Data not persisting**: Check file permissions for the data directory
4. **Memory issues**: Consider implementing data pagination for large datasets

### Logs

The server uses Morgan for HTTP request logging. Check the console output for request logs and error messages.

## License

MIT License - see the main project README for details.
