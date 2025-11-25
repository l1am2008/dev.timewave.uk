# Timewave Radio News System Setup

## Database Migration Required

Before using the news system, run this SQL migration on your MySQL database:

\`\`\`sql
-- Create staff_accounts table for authentication
CREATE TABLE IF NOT EXISTS staff_accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staff_id INT NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
);

-- Create news_articles table
CREATE TABLE IF NOT EXISTS news_articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staff_id INT NOT NULL,
  title VARCHAR(500) NOT NULL,
  content LONGTEXT NOT NULL,
  featured_image_url VARCHAR(500),
  tags VARCHAR(255),
  is_approved BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  published_at TIMESTAMP NULL,
  FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
  INDEX idx_approved (is_approved),
  INDEX idx_featured (is_featured),
  INDEX idx_published (published_at)
);

-- Create staff_shows table (for staff to manage their own shows)
CREATE TABLE IF NOT EXISTS staff_shows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staff_id INT NOT NULL,
  schedule_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
  FOREIGN KEY (schedule_id) REFERENCES schedule(id) ON DELETE CASCADE,
  UNIQUE KEY unique_staff_show (staff_id, schedule_id)
);
\`\`\`

## System Overview

### Public Pages
- **/news** - Main news hub with all published articles by category
- **/news/[id]** - Individual article page
- **Homepage** - Features latest/featured article

### Staff Portal (/staff/login)
- Staff can login with email/password
- Create and edit news articles (pending admin approval)
- Manage personal profile (bio, photo)
- View assigned shows

### Admin Panel (/admin)
- **News Approval Tab** - Review, approve, and feature articles
- **Staff Accounts Tab** - Create staff login accounts
- Existing: Schedule, Staff, Jobs management

## Key Features
- ✅ Staff authentication with email/password
- ✅ News article creation with 4 categories
- ✅ Admin approval workflow
- ✅ Featured article system
- ✅ Staff profile & show management
- ✅ Responsive design with persistent radio player

## Next Steps
1. Run the SQL migration via phpMyAdmin
2. Rebuild: `npm run build`
3. Restart: `pm2 restart timewave-radio`
4. Create staff accounts in admin panel
