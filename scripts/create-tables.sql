-- Create schedule table
CREATE TABLE IF NOT EXISTS schedule (
  id INT AUTO_INCREMENT PRIMARY KEY,
  day VARCHAR(20) NOT NULL,
  start_time VARCHAR(5) NOT NULL,
  end_time VARCHAR(5) NOT NULL,
  show_name VARCHAR(255) NOT NULL,
  host VARCHAR(255),
  bio TEXT,
  picture_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_schedule (day, start_time, show_name)
);

-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  bio TEXT,
  email VARCHAR(255),
  photo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  department VARCHAR(255),
  salary_range VARCHAR(100),
  application_link VARCHAR(500),
  job_description_link VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO schedule (day, start_time, end_time, show_name, host, bio, picture_url) VALUES
('Monday', '09:00', '12:00', 'Morning Drive', 'John Smith', 'Your morning companion with the best hits', 'https://placeholder.svg?height=200&width=200'),
('Monday', '12:00', '15:00', 'Afternoon Mix', 'Sarah Jones', 'Keep the energy up in the afternoon', 'https://placeholder.svg?height=200&width=200'),
('Tuesday', '09:00', '12:00', 'Morning Drive', 'John Smith', 'Your morning companion with the best hits', 'https://placeholder.svg?height=200&width=200');

INSERT INTO staff (name, role, department, bio, email, photo_url) VALUES
('Sarah Johnson', 'Executive Director', 'governance & strategic leadership', 'Leading Timewave Radio with vision and mission', 'sarah@timewave.uk', 'https://placeholder.svg?height=200&width=200'),
('Mike Chen', 'Head of Volunteers', 'volunteer & people management', 'Coordinating our amazing volunteer team', 'mike@timewave.uk', 'https://placeholder.svg?height=200&width=200'),
('Emma Wilson', 'Compliance Officer', 'data protection & compliance', 'Ensuring we meet all regulatory requirements', 'emma@timewave.uk', 'https://placeholder.svg?height=200&width=200');

INSERT INTO jobs (title, description, department, salary_range, application_link, job_description_link, is_active) VALUES
('Full-Time Presenter', 'We are looking for an experienced radio presenter to join our team', 'on-air programming', '£25,000 - £35,000', 'https://forms.google.com/your-form', 'https://docs.google.com/document/your-doc', TRUE),
('Volunteer Coordinator', 'Help manage and coordinate our volunteer programs', 'volunteer & people management', 'Volunteer', 'https://forms.google.com/your-form', 'https://docs.google.com/document/your-doc', TRUE);
