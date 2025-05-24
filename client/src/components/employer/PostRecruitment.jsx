import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './PostRecruitment.module.css';

const PostRecruitment = () => {
  // ... (你的 jobPostings 和其他 state)
    const [jobPostings, setJobPostings] = useState([
      {
        id: '1',
        position: 'Senior Environmental Engineer',
        location: 'No 1, Jalan Satu, Taman Satu, 47000 Sungai Buloh Selangor, Malaysia.',
        time: 'Full-time',
        salary: 'MYR 5,000 - 7,000',
        skill: 'Environmental Engineering',
        employmentType: 'Full-time',
        postedAt: '20/4/2025',
        status: 'active',
        applicantsCount: 12,
        city: 'Kuala Lumpur'
      },
      {
        id: '2',
        position: 'Waste Management Specialist',
        location: 'No 1, Jalan Satu, Taman Satu, 47000 Sungai Buloh Selangor, Malaysia.',
        time: '8:00 - 17:00',
        salary: 'MYR 3,500 - 5,000',
        skill: 'Waste Management',
        employmentType: 'Contract',
        postedAt: '18/4/2025',
        status: 'active',
        applicantsCount: 5,
        city: 'Petaling Jaya'
      },
      {
        id: '3',
        position: 'Environmental Compliance Officer',
        location: 'No 1, Jalan Satu, Taman Satu, 47000 Sungai Buloh Selangor, Malaysia.',
        time: '9:00 - 18:00',
        salary: 'MYR 4,000 - 6,000',
        skill: 'Environmental Law',
        employmentType: 'Full-time',
        postedAt: '15/4/2025',
        status: 'active',
        applicantsCount: 3,
        city: 'Shah Alam'
      },
      {
        id: '4',
        position: 'Recycling Program Manager',
        location: 'No 1, Jalan Satu, Taman Satu, 47000 Sungai Buloh Selangor, Malaysia.',
        time: 'Any',
        salary: 'MYR 4,000 - 6,000',
        skill: 'Management skill',
        employmentType: 'Full-time',
        postedAt: '15/3/2025',
        status: 'closed',
        applicantsCount: 8,
        city: 'Kuala Lumpur'
      },
      {
        id: '5',
        position: 'Logistics Driver',
        location: 'No 1, Jalan Satu, Taman Satu, 47000 Sungai Buloh Selangor, Malaysia.',
        time: '8:00 - 17:00',
        salary: 'MYR 4,000 - 5,000',
        skill: "Driver's License",
        employmentType: 'Full-time',
        postedAt: '15/3/2025',
        status: 'closed',
        applicantsCount: 15,
        city: 'Petaling Jaya'
      },
      {
        id: '6',
        position: 'Administrative Staff',
        location: 'No 1, Jalan Satu, Taman Satu, 47000 Sungai Buloh Selangor, Malaysia.',
        time: '9:00 - 18:00',
        salary: 'MYR 2,500 - 4,000',
        skill: 'Any',
        employmentType: 'Full-time',
        postedAt: '13/3/2025',
        status: 'closed',
        applicantsCount: 20,
        city: 'Shah Alam'
      },
      {
        id: '7',
        position: 'Senior Environmental Engineer',
        location: 'No 1, Jalan Satu, Taman Satu, 47000 Sungai Buloh Selangor, Malaysia.',
        time: 'Full-time',
        salary: 'MYR 5,000 - 7,000',
        skill: 'Environmental Engineering',
        employmentType: 'Full-time',
        postedAt: '20/4/2025',
        status: 'active',
        applicantsCount: 12,
        city: 'Kuala Lumpur'
      },
      {
        id: '8',
        position: 'Waste Management Specialist',
        location: 'No 1, Jalan Satu, Taman Satu, 47000 Sungai Buloh Selangor, Malaysia.',
        time: '8:00 - 17:00',
        salary: 'MYR 3,500 - 5,000',
        skill: 'Waste Management',
        employmentType: 'Contract',
        postedAt: '18/4/2025',
        status: 'active',
        applicantsCount: 5,
        city: 'Petaling Jaya'
      },
      {
        id: '9',
        position: 'Environmental Compliance Officer',
        location: 'No 1, Jalan Satu, Taman Satu, 47000 Sungai Buloh Selangor, Malaysia.',
        time: '9:00 - 18:00',
        salary: 'MYR 4,000 - 6,000',
        skill: 'Environmental Law',
        employmentType: 'Full-time',
        postedAt: '15/4/2025',
        status: 'active',
        applicantsCount: 3,
        city: 'Shah Alam'
      },
    ]);

  const [showActive, setShowActive] = useState(true); // 新增 state 来控制显示哪个部分
  const [searchTerm, setSearchTerm] = useState('');

  
  const filteredJobs = jobPostings.filter(job => 
    job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.skill.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const activeJobs = filteredJobs.filter(job => job.status === 'active');
  const closedJobs = filteredJobs.filter(job => job.status === 'closed');


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (jobId, newStatus) => {
    setJobPostings(jobPostings.map(job => 
      job.id === jobId ? { ...job, status: newStatus } : job
    ));
  };

  const toggleView = () => { // 新增函数来切换显示状态
    setShowActive(!showActive);
    setSearchTerm(''); // Clear search when toggling view
  };

  return (
    <div className={styles.postRecruitmentContainer}>
      <div className={styles.jobPostingsSection}>

        <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle} onClick={toggleView}>
              {showActive ? 'Active Job Postings' : 'Closed Job Postings'} ⏷
            </h3>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder={showActive ? "SEARCH FOR ACTIVE JOB POST" : "SEARCH FOR CLOSED JOB POST"} // 根据显示状态更改 placeholder
              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
            <button className={styles.searchButton}>🔍</button>
          </div>
        </div>

        <div className={styles.jobGrid}>
          {showActive ? (
            activeJobs.map(job => (
              // ... (你的 activeJobs 的 JSX)
              <div key={job.id} className={styles.jobCard}>
                <div className={styles.jobHeader}>
                  <h3>Position: {job.position}</h3>
                </div>
                <div className={styles.jobDetails}>
                  <div className={styles.jobDetail}>
                    <strong>Location:</strong>
                    <p>{job.location}</p>
                  </div>
                  <div className={styles.jobDetail}>
                    <strong>Time:</strong>
                    <p>{job.time}</p>
                  </div>
                  <div className={styles.jobDetail}>
                    <strong>Salary:</strong>
                    <p>{job.salary}</p>
                  </div>
                  <div className={styles.jobDetail}>
                    <strong>Skill:</strong>
                    <p>{job.skill}</p>
                  </div>
                  <div className={styles.jobDetail}>
                    <strong>Employment type:</strong>
                    <p>{job.employmentType}</p>
                  </div>
                  <div className={styles.jobDetail}>
                    <strong>Post at:</strong>
                    <p>{job.postedAt}</p>
                  </div>
                </div>
                
                <div className={styles.jobActions}>
                  <Link to={`/view-applicants/${job.id}`} className={styles.viewApplicantsBtn}>
                    View Applicants ({job.applicantsCount})
                  </Link>
                  <div className={styles.actionButtons}>
                    <button 
                      className={styles.closeButton}
                      onClick={() => handleStatusChange(job.id, 'closed')}
                    >
                      Close
                    </button>
                    <Link to={`/edit-job/${job.id}`} className={styles.editButton}>
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            closedJobs.map(job => (
              // ... (你的 closedJobs 的 JSX)
              <div key={job.id} className={`${styles.jobCard} ${styles.closedJob}`}>
                <div className={styles.jobHeader}>
                  <h3>Position: {job.position}</h3>
                  <span className={styles.statusBadge}>Closed</span>
                </div>
                <div className={styles.jobDetails}>
                  <div className={styles.jobDetail}>
                    <strong>Location:</strong>
                    <p>{job.location}</p>
                  </div>
                  <div className={styles.jobDetail}>
                    <strong>Time:</strong>
                    <p>{job.time}</p>
                  </div>
                  <div className={styles.jobDetail}>
                    <strong>Salary:</strong>
                    <p>{job.salary}</p>
                  </div>
                  <div className={styles.jobDetail}>
                    <strong>Skill:</strong>
                    <p>{job.skill}</p>
                  </div>
                  <div className={styles.jobDetail}>
                    <strong>Employment type:</strong>
                    <p>{job.employmentType}</p>
                  </div>
                  <div className={styles.jobDetail}>
                    <strong>Post at:</strong>
                    <p>{job.postedAt}</p>
                  </div>
                </div>
                
                <div className={styles.jobActions}>
                  <Link to={`/view-applicants/${job.id}`} className={styles.viewApplicantsBtn}>
                    View Applicants ({job.applicantsCount})
                  </Link>
                  <div className={styles.actionButtons}>
                    <button 
                      className={styles.reopenButton}
                      onClick={() => handleStatusChange(job.id, 'active')}
                    >
                      Re-open
                    </button>
                    <Link to={`/edit-job/${job.id}`} className={styles.editButton}>
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {showActive && activeJobs.length === 0 && (
          <div className={styles.emptyState}>
            <p>No active job postings found</p>
          </div>
        )}

        {!showActive && closedJobs.length === 0 && (
          <div className={styles.emptyState}>
            <p>No closed job postings found</p>
          </div>
        )}
      </div>

      <div className={styles.floatingActionButton}>
        <Link to="/post-new-job" className={styles.fabButton}>
          Post new Recruitment
        </Link>
      </div>
    </div>
  );
};

export default PostRecruitment;