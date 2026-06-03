# Deployment Guide - Render

This guide walks you through deploying the Mchanga Afya platform to Render.

## Prerequisites

- GitHub account with your repository pushed
- Render account (free at https://render.com)

## Deployment Steps

### Step 1: Push to GitHub

Ensure all your code is committed and pushed:

```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### Step 2: Connect GitHub to Render

1. Go to https://dashboard.render.com
2. Click "New +" in the top-right
3. Select "Blueprint" (this uses the `render.yaml` file)
4. Search for and select your GitHub repository
5. Choose the branch (usually `main`)
6. Click "Create resources"

### Step 3: Wait for Deployment

Render will automatically:
- Create a PostgreSQL database
- Build the backend (`npm install`)
- Start the backend service
- Assign a public URL

**Deployment takes 2-5 minutes.** Check the dashboard for progress.

### Step 4: Initialize the Database

Once deployed, seed your database. You have two options:

**Option A: Via Render Shell (Recommended)**

1. Go to your backend service in Render dashboard
2. Click "Shell" tab
3. Run:
   ```bash
   npm run seed
   ```

**Option B: Add Seed to Build (One-time)**

Edit `render.yaml` and change the buildCommand:

```yaml
buildCommand: cd backend && npm install && npm run seed
```

Then redeploy. This only seeds once (first deployment).

### Step 5: Update Frontend Environment

Update your frontend's `.env.local` with your Render backend URL:

```
VITE_API_BASE_URL=https://your-backend-service-name.onrender.com
```

Get your backend URL from the Render dashboard → your backend service → "Endpoints" section.

### Step 6: Deploy Frontend

**On Vercel (Recommended for TanStack Start):**

1. Push to GitHub (already done)
2. Go to https://vercel.com
3. Import your GitHub repository
4. Set environment variable: `VITE_API_BASE_URL=https://your-render-backend.onrender.com`
5. Click "Deploy"

**Or on Netlify:**

1. Connect your GitHub repo
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable with your backend URL
5. Deploy

## Monitoring & Troubleshooting

### Check Logs

```bash
# In Render dashboard, click your service → Logs
# Or via curl:
curl https://your-service-name.onrender.com/
```

### Common Issues

| Issue | Solution |
|-------|----------|
| **503 Service Unavailable** | Check build logs in dashboard. Run database migrations if needed. |
| **Database connection error** | Verify `DATABASE_URL` is set in environment variables. Restart service. |
| **Cold start (slow first request)** | Normal on free tier. First request after inactivity takes 30-60 seconds. |
| **CORS errors** | Ensure `VITE_API_BASE_URL` in frontend matches your Render backend URL. |
| **Empty farmer/farm list** | Run `npm run seed` to populate database. |

### Useful Commands

```bash
# Test your backend is running
curl https://your-service-name.onrender.com/

# Test farmers endpoint
curl https://your-service-name.onrender.com/farmers

# Check logs
curl https://your-service-name.onrender.com/ -v
```

## Scaling & Next Steps

### Free Tier Limitations

- **Inactivity timeout**: Service spins down after 15 minutes → first request is slow
- **1 GB RAM**: Suitable for small-medium apps
- **Shared CPU**: Slower than paid tiers
- **No auto-scaling**: Can't handle traffic spikes

### Upgrade to Paid

For production, consider:

- **Web Service**: Standard ($7/month) or higher
- **PostgreSQL**: Standard ($15/month) or higher
- **No inactivity spindown** on paid plans

### Database Backups

Render includes automatic backups. You can also manually back up via:

1. Dashboard → PostgreSQL instance
2. "Backups" tab
3. Trigger manual backup

### Environment Secrets

For sensitive data (API keys, passwords), use Render's encrypted environment variables:

1. Dashboard → Your service → "Environment"
2. Add new variable
3. Mark as "secret" for sensitive data

## Redeploying After Changes

To redeploy after code changes:

```bash
git add .
git commit -m "Update feature X"
git push origin main
```

Render auto-deploys if `autoDeploy: true` is set in `render.yaml` (it is).

## Useful Links

- [Render Documentation](https://render.com/docs)
- [Render Blueprint Spec](https://render.com/docs/blueprint-spec)
- [PostgreSQL on Render](https://render.com/docs/postgres)
- [Node.js on Render](https://render.com/docs/node-environment)

## Support

- Check Render logs for detailed error messages
- Review your backend `.env` configuration
- Verify GitHub repository is public or you have permission to access it
- Contact Render support at https://support.render.com
