# Deployment Guide

This document provides step-by-step instructions for deploying the Split Lease Message Curation application.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or hosted)
- Twilio account with credentials
- SendGrid or Postmark account for email
- Git

## Environment Setup

1. **Clone the repository**
```bash
git clone https://github.com/splitleasesharath/_message-curation.git
cd _message-curation
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and fill in all required values:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Your application URL
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`: From Twilio console
- `SENDGRID_API_KEY` or `POSTMARK_API_KEY`: From your email provider
- `EMAIL_FROM`: Your sending email address
- `INTERNAL_SUPPORT_EMAIL`: Email for forwarded messages

## Database Setup

1. **Generate Prisma client**
```bash
npm run prisma:generate
```

2. **Run database migrations**
```bash
npm run prisma:migrate
```

3. **Seed the database** (creates Split Bot user and templates)
```bash
npx tsx prisma/seed.ts
```

## Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Set environment variables** in Vercel dashboard or via CLI:
```bash
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
# ... repeat for all env vars
```

5. **Deploy to production**
```bash
vercel --prod
```

### Option 2: Docker

1. **Create Dockerfile** (already included in project)

2. **Build Docker image**
```bash
docker build -t message-curation .
```

3. **Run container**
```bash
docker run -p 3000:3000 --env-file .env message-curation
```

### Option 3: Traditional VPS

1. **SSH into your server**

2. **Clone and setup**
```bash
git clone https://github.com/splitleasesharath/_message-curation.git
cd _message-curation
npm install
```

3. **Build the application**
```bash
npm run build
```

4. **Start with PM2**
```bash
npm install -g pm2
pm2 start npm --name "message-curation" -- start
pm2 save
pm2 startup
```

## Post-Deployment Checklist

- [ ] Database migrations completed
- [ ] Seed data populated (Split Bot user exists)
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] DNS records updated
- [ ] Admin users created with ADMIN or SUPPORT_STAFF role
- [ ] Twilio SMS working (test with sample message)
- [ ] Email sending working (test with forwarded message)
- [ ] Authentication working (test login/logout)
- [ ] Test all CRUD operations (create, read, delete messages)

## Monitoring & Maintenance

### Database Backups

Set up automated PostgreSQL backups:
```bash
# Example cron job for daily backups
0 2 * * * pg_dump $DATABASE_URL > backup-$(date +\%Y\%m\%d).sql
```

### Application Logs

View logs with PM2:
```bash
pm2 logs message-curation
```

Or check Vercel logs in the dashboard.

### Updating the Application

```bash
git pull origin main
npm install
npm run build
pm2 restart message-curation
```

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check PostgreSQL is running and accessible
- Ensure database user has proper permissions

### Authentication Not Working

- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Ensure users have correct role (ADMIN or SUPPORT_STAFF)

### SMS/Email Not Sending

- Verify Twilio/SendGrid credentials
- Check API key permissions
- Review service provider logs

### Build Failures

- Clear `.next` directory: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Ensure TypeScript types are correct: `npm run prisma:generate`

## Security Notes

- Never commit `.env` file
- Rotate API keys regularly
- Use strong `NEXTAUTH_SECRET`
- Keep dependencies updated: `npm audit`
- Enable HTTPS in production
- Implement rate limiting for API endpoints
- Monitor audit logs for suspicious activity

## Support

For issues or questions:
- Create an issue on GitHub: https://github.com/splitleasesharath/_message-curation/issues
- Contact: support@splitlease.com
