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
