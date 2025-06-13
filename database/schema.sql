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

CREATE TABLE IF NOT EXISTS Post (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    publisher_type ENUM('jobseeker', 'employer') NOT NULL, 
    employer_id INT NULL, 
    seeker_id INT NULL,   
    title VARCHAR(255) NOT NULL,
    content TEXT,
    posted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    category ENUM(
        'news_announcements',     -- 新闻/公告
        'company_culture',        -- 公司文化/生活
        'product_updates',        -- 产品/服务更新
        'industry_insights',      -- 行业洞察/知识分享
        'other' -- 其他/通用
    ) NOT NULL DEFAULT 'news_announcements'; 
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (employer_id) REFERENCES Employer(employer_id) ON DELETE CASCADE,
    FOREIGN KEY (seeker_id) REFERENCES JobSeeker(seeker_id) ON DELETE CASCADE,
    -- CHECK 约束：确保只有一个发布者ID被设置，且与 publisher_type 匹配
    CONSTRAINT chk_publisher_id CHECK (
        (publisher_type = 'employer' AND employer_id IS NOT NULL AND seeker_id IS NULL) OR
        (publisher_type = 'jobseeker' AND seeker_id IS NOT NULL AND employer_id IS NULL)
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 帖子媒体文件表 (用于图片、视频、文档)
CREATE TABLE IF NOT EXISTS PostMedia (
    media_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    media_type ENUM('image', 'video', 'document') NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    thumbnail_path VARCHAR(255), -- 用于视频缩略图或文档预览图
    description TEXT,
    uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES Post(post_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Job (
    job_id INT AUTO_INCREMENT PRIMARY KEY,
    employer_id INT NOT NULL,
    company VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    job_type VARCHAR(50) NOT NULL,
    salary_min DECIMAL(10, 2),
    salary_max DECIMAL(10, 2),
    currency VARCHAR(10) DEFAULT 'MYR',
    experience_level VARCHAR(50),
    department VARCHAR(100),
    reporting_to VARCHAR(100),
    start_date DATE,
    application_deadline DATE,
    job_description TEXT NOT NULL,
    key_responsibilities TEXT,
    required_qualifications TEXT,
    preferred_qualifications TEXT,
    benefits TEXT,
    skills TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    status ENUM('active', 'closed') DEFAULT 'active';
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

CREATE TABLE IF NOT EXISTS RefreshTokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(128) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN DEFAULT FALSE,
    device_info VARCHAR(255),
    ip_address VARCHAR(45),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_refresh_token ON RefreshTokens(token);
CREATE INDEX idx_refresh_token_user ON RefreshTokens(user_id);

-- CREATE INDEX idx_user_email ON User(email);
-- CREATE INDEX idx_job_location ON Job(location);
-- 在User表中添加user_type字段
-- ALTER TABLE User 
-- ADD COLUMN user_type ENUM('jobseeker','employer') NOT NULL AFTER user_id;

-- -- 移除原JobSeeker/Employer表的冗余字段
-- ALTER TABLE JobSeeker DROP COLUMN full_name;
-- ALTER TABLE Employer DROP COLUMN company_name;