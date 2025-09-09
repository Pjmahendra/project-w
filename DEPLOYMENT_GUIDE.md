# Project W - Deployment Guide

This guide covers multiple hosting options for your React + Node.js full-stack application.

## 🚀 Quick Start Options

### Option 1: Vercel (Recommended for Frontend + Serverless Backend)
**Best for**: Quick deployment, automatic scaling, free tier
**Cost**: Free tier available, paid plans start at $20/month

#### Steps:
1. **Deploy Frontend to Vercel:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy frontend
   vercel --prod
   ```

2. **Deploy Backend to Vercel:**
   - Create `vercel.json` in backend folder
   - Deploy backend as serverless functions

#### Vercel Configuration:
Create `vercel.json` in your project root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "dist/$1"
    }
  ]
}
```

### Option 2: Netlify (Frontend) + Railway (Backend)
**Best for**: Easy setup, good free tiers
**Cost**: Free tier available

#### Frontend (Netlify):
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy!

#### Backend (Railway):
1. Connect GitHub repository
2. Select backend folder
3. Add environment variables
4. Deploy!

### Option 3: DigitalOcean App Platform
**Best for**: Full-stack deployment, managed database
**Cost**: $5-12/month

#### Steps:
1. Create new app on DigitalOcean
2. Connect GitHub repository
3. Configure build settings:
   - Frontend: Build command `npm run build`, Output directory `dist`
   - Backend: Build command `cd backend && npm install`, Run command `npm start`
4. Add environment variables
5. Deploy!

### Option 4: Heroku
**Best for**: Traditional hosting, easy database integration
**Cost**: $7-25/month

#### Steps:
1. Install Heroku CLI
2. Create Heroku app
3. Configure Procfile
4. Deploy both frontend and backend

### Option 5: AWS/GCP/Azure
**Best for**: Enterprise, high traffic, custom configurations
**Cost**: Variable, pay-as-you-go

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
Update `backend/env.production` with your actual domain:
```env
CORS_ORIGIN=https://your-actual-domain.com,https://www.your-actual-domain.com
```

### 2. Database Setup
Your app uses SQLite, which works well for:
- Vercel (with serverless functions)
- Railway
- DigitalOcean App Platform

For production with high traffic, consider upgrading to:
- PostgreSQL (Railway, DigitalOcean)
- MongoDB Atlas (free tier available)

### 3. Build Commands
```bash
# Build frontend
npm run build

# Install backend dependencies
cd backend && npm install --production

# Start production server
cd backend && NODE_ENV=production npm start
```

## 🔧 Platform-Specific Configurations

### Vercel Setup
1. Create `vercel.json` (see above)
2. Update `backend/server.js` to handle Vercel's serverless environment
3. Deploy with `vercel --prod`

### Railway Setup
1. Create `railway.json` in backend folder:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health"
  }
}
```

### DigitalOcean App Platform
1. Create `.do/app.yaml`:
```yaml
name: project-w
services:
- name: frontend
  source_dir: /
  github:
    repo: your-username/project-w
    branch: main
  run_command: npm run build
  static_sites:
  - name: frontend
    source_dir: dist
    routes:
    - path: /
- name: backend
  source_dir: /backend
  github:
    repo: your-username/project-w
    branch: main
  run_command: npm start
  http_port: 3000
  routes:
  - path: /api
```

## 🚀 Recommended Deployment Steps

### For Beginners (Easiest):
1. **Vercel** - Deploy everything in one go
2. **Netlify + Railway** - Separate frontend and backend

### For Production:
1. **DigitalOcean App Platform** - Full-stack with managed database
2. **AWS/GCP** - For enterprise needs

## 📊 Monitoring & Maintenance

### Health Checks
Your app includes health check endpoints:
- `GET /api/health` - Basic health check
- `GET /api/status` - Server status
- `GET /api/analytics` - Usage analytics

### Database Backup
For SQLite, regularly backup the `data/project_w.db` file.

### Logs
Monitor application logs through your hosting platform's dashboard.

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **CORS**: Update CORS origins for production
3. **HTTPS**: Ensure SSL certificates are enabled
4. **Database**: Consider upgrading from SQLite for production

## 💰 Cost Comparison

| Platform | Free Tier | Paid Plans | Best For |
|----------|-----------|------------|----------|
| Vercel | Yes | $20/month | Quick deployment |
| Netlify | Yes | $19/month | Static sites |
| Railway | Yes | $5/month | Backend services |
| DigitalOcean | No | $5/month | Full-stack apps |
| Heroku | No | $7/month | Traditional hosting |

## 🆘 Troubleshooting

### Common Issues:
1. **CORS errors**: Update CORS_ORIGIN in environment variables
2. **Build failures**: Check Node.js version compatibility
3. **Database issues**: Ensure database file permissions
4. **Static file serving**: Verify build output directory

### Support:
- Check platform-specific documentation
- Review application logs
- Test locally with production environment variables

## 🎯 Next Steps

1. Choose your hosting platform
2. Update environment variables
3. Deploy following platform-specific instructions
4. Test your deployed application
5. Set up monitoring and backups

Your app is ready for deployment! 🚀
