CREATE DATABASE IF NOT EXISTS jobpulse_db;


USE jobpulse_db;
CREATE TABLE IF NOT EXISTS User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_type ENUM('jobseeker','employer') NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS JobSeeker (
    seeker_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    preferred_location VARCHAR(100),
    expected_salary DECIMAL(10, 2),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Employer (
    employer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    registration_id VARCHAR(20),
    company_phone VARCHAR(20),
    company_address TEXT,
    website VARCHAR(255),
    industry_type VARCHAR(50),
    company_size VARCHAR(50),
    founded_year YEAR,
    company_description TEXT,
    profile_image VARCHAR(255),
    cover_image VARCHAR(255),
    is_approved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Job (
    job_id INT AUTO_INCREMENT PRIMARY KEY,
    employer_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    salary_range VARCHAR(50),
    location VARCHAR(100) NOT NULL,
    posted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employer_id) REFERENCES Employer(employer_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Resume (
    resume_id INT AUTO_INCREMENT PRIMARY KEY,
    seeker_id INT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seeker_id) REFERENCES JobSeeker(seeker_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Application (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    seeker_id INT NOT NULL,
    applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'invited', 'rejected') DEFAULT 'pending',
    FOREIGN KEY (job_id) REFERENCES Job(job_id) ON DELETE CASCADE,
    FOREIGN KEY (seeker_id) REFERENCES JobSeeker(seeker_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- CREATE INDEX idx_user_email ON User(email);
-- CREATE INDEX idx_job_location ON Job(location);
-- 在User表中添加user_type字段
-- ALTER TABLE User 
-- ADD COLUMN user_type ENUM('jobseeker','employer') NOT NULL AFTER user_id;

-- -- 移除原JobSeeker/Employer表的冗余字段
-- ALTER TABLE JobSeeker DROP COLUMN full_name;
-- ALTER TABLE Employer DROP COLUMN company_name;