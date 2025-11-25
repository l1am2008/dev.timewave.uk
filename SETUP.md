# Timewave Radio - Setup Guide

## MySQL Database Configuration

To use your MySQL database with this application, follow these steps:

### 1. Set Environment Variables

Add the following environment variables to your Vercel project or `.env.local` file:

\`\`\`
MYSQL_HOST=liamradford.me
MYSQL_PORT=3306
MYSQL_DATABASE=liamradf_timewavesite
MYSQL_USER=liamradf_timewaveuser
MYSQL_PASSWORD=S125u9_&0cB*Ry{r
\`\`\`

**For Vercel Deployment:**
1. Go to your project settings in Vercel
2. Navigate to **Settings → Environment Variables**
3. Add each variable above
4. Redeploy your application

### 2. Initialize Database Schema

The database tables will be created automatically when the application starts. The schema includes:

- **schedule** - Radio show schedule with day, time, host info
- **staff** - Staff members organized by department
- **jobs** - Current job vacancies
- **admin_users** - For future multi-user admin support

### 3. Access the Admin Portal

**URL:** `https://yourdomain.com/admin` (or `http://localhost:3000/admin` locally)

**Default Password:** `admin123`

**To change the password:**
1. Go to Vercel project settings
2. Add environment variable: `NEXT_PUBLIC_ADMIN_PASSWORD=yourNewPassword`
3. Redeploy the application

### Admin Portal Features

The admin portal allows you and select individuals to manage:

- **Schedule** - Add, edit, delete radio shows with times and host information
- **Staff** - Manage team members by department with bios and contact info
- **Jobs** - Post and manage job vacancies with links to Google Docs and Forms

All changes are saved directly to your MySQL database and appear immediately on the public site.

### API Endpoints

The following API endpoints are available for managing content:

- `GET /api/schedule` - Fetch all shows
- `POST /api/schedule` - Create new show
- `PUT /api/schedule` - Update show
- `DELETE /api/schedule` - Delete show

- `GET /api/staff` - Fetch all staff
- `POST /api/staff` - Create new staff member
- `PUT /api/staff` - Update staff member
- `DELETE /api/staff` - Delete staff member

- `GET /api/jobs` - Fetch all vacancies
- `POST /api/jobs` - Create new vacancy
- `PUT /api/jobs` - Update vacancy
- `DELETE /api/jobs` - Delete vacancy

- `GET /api/nowplaying` - Fetch current now playing and recently played songs from streaming API

### First Time Setup Checklist

- [ ] Add MySQL environment variables to Vercel
- [ ] Deploy the application
- [ ] Visit `/admin` and log in with password `admin123`
- [ ] Update admin password via environment variable
- [ ] Add your radio schedule
- [ ] Add your staff members
- [ ] Add current job vacancies with Google Docs/Forms links
- [ ] Test the homepage, staff, and jobs pages
- [ ] Share admin portal access with team members who need it
