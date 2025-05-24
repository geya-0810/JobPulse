import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [jobs, setJobs] = useState([]);

  // Mock data for companies
  useEffect(() => {
    // This would be replaced with an API call in a real application
    const mockCompanies = [
      {
        id: 1,
        name: 'AEON Co. (M) Bhd.',
        logo: '/images/aeon-logo.png',
        category: 'Retail / Merchandise',
        employees: '201-500 Employees',
        companySSM: '126926-H',
        followers: 2305,
        jobVacancies: 137,
        verified: true,
        banner: '/images/aeon-banner.jpg',
        description: 'Enriching Your Lifestyle',
      },
      {
        id: 2,
        name: 'Chagee (M) Sdn Bhd',
        logo: '/images/chagee-logo.png',
        category: 'Food & Beverage',
        employees: '51-200 Employees',
        jobVacancies: 32,
        verified: true,
      },
      {
        id: 3,
        name: 'KL Recycle Station',
        logo: '/images/recycle-logo.png',
        category: 'Environmental Services',
        employees: '10-50 Employees',
        email: 'klrecycles@gmail.com',
        phone: '03-456 7891',
        address: 'No 1, Jalan Satu, Taman Satu, 47000 Sungai Buloh Selangor, Malaysia.',
        jobVacancies: 3,
        verified: false,
      },
      {
        id: 4,
        name: 'Tech Innovate Solutions',
        logo: '/images/tech-logo.png',
        category: 'Information Technology',
        employees: '101-200 Employees',
        jobVacancies: 18,
        verified: true,
      },
      {
        id: 5,
        name: 'Global Logistics Holdings',
        logo: '/images/logistics-logo.png',
        category: 'Transportation & Logistics',
        employees: '501-1000 Employees',
        jobVacancies: 45,
        verified: true,
      },
    ];

    setCompanies(mockCompanies);
  }, []);

  // Mock data for jobs
  useEffect(() => {
    if (selectedCompany) {
      // This would be replaced with an API call in a real application
      const mockJobs = [
        {
          id: 1,
          title: 'Sorter (Afpc Shah Alam) Immediately!!!',
          company: selectedCompany.name,
          companyId: selectedCompany.id,
          salary: 'MYR1,700 - MYR2,300 Per Month',
          employmentType: 'Full Time',
          level: 'Fresh Graduates',
          location: 'Shah Alam, Selangor',
          skills: ['Any Skill'],
          description: [
            'Menjalankan semua tugasan yang diarahkan oleh Sorting Supervisor',
            'Menyediakan semua peralatan untuk penghantaran seperti tray, cart rack dan dokumen sorting...'
          ],
          posted: 'a day ago',
          earlyApplicant: true,
        },
        {
          id: 2,
          title: 'Fleet Officer - Aeon Food Processing Centre (Shah Alam)',
          company: selectedCompany.name,
          companyId: selectedCompany.id,
          salary: 'MYR2,500 - MYR3,900 Per Month',
          employmentType: 'Full Time',
          level: 'Fresh Graduates',
          location: 'Shah Alam, Selangor',
          skills: ['Communication Skills'],
          posted: 'a day ago',
          earlyApplicant: true,
        },
        {
          id: 3,
          title: 'Chargeman - Aeon Queensbay',
          company: selectedCompany.name,
          companyId: selectedCompany.id,
          salary: 'MYR4,500 - MYR5,500 Per Month',
          employmentType: 'Full Time',
          location: 'Bayan Lepas, Pulau Pinang',
          skills: ['Technical Skills'],
          posted: '2 days ago',
        },
        {
          id: 4,
          title: 'Security Executive (Aeon Setia Alam)',
          company: selectedCompany.name,
          companyId: selectedCompany.id,
          salary: 'MYR2,800 - MYR3,500 Per Month',
          employmentType: 'Full Time',
          location: 'Setia Alam, Selangor',
          skills: ['Security Management'],
          posted: '3 days ago',
        },
      ];

      // Filter jobs for the selected company
      setJobs(mockJobs.filter(job => job.companyId === selectedCompany.id));
    }
  }, [selectedCompany]);

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    window.scrollTo(0, 0);
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.contentContainer}>
        {/* Left column - Company list */}
        <div className={styles.leftColumn}>
          {/* <h2 className={styles.columnTitle}>Featured Companies</h2> */}
          {companies.map((company) => (
            <div 
              key={company.id} 
              className={`${styles.companyCard} ${selectedCompany && selectedCompany.id === company.id ? styles.selectedCompany : ''}`}
              onClick={() => handleCompanySelect(company)}
            >
              <div className={styles.companyLogo}>
                <div className={styles.logoPlaceholder}>
                  {company.name.charAt(0)}
                </div>
              </div>
              <div className={styles.companyInfo}>
                <h3 className={styles.companyName}>
                  {company.name}
                  {company.verified && (
                    <span className={styles.verifiedBadge} title="Verified">
                      ✓
                    </span>
                  )}
                </h3>
                <p className={styles.companyCategory}>{company.category}</p>
                <p className={styles.companyEmployees}>{company.employees}</p>
                <div className={styles.companyJobCount}>
                  <span className={styles.jobCount}>
                    {company.jobVacancies} jobs
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right column - Company details and jobs */}
        <div className={styles.rightColumn}>
          {selectedCompany ? (
            <>
            <div className={styles.container}>
              {/* Company Profile Section */}
              <div className={styles.companyProfile}>
                <div className={styles.profileHeader}>
                  <div className={styles.profileLogoContainer}>
                    <div className={styles.profileLogo}>
                      {selectedCompany.name.charAt(0)}
                    </div>
                  </div>
                  
                  <div className={styles.profileInfo}>
                    <h1 className={styles.profileName}>
                      {selectedCompany.name}
                      {selectedCompany.verified && (
                        <span className={styles.profileVerifiedBadge}>
                          <span className={styles.verifiedIcon}>✓</span> Verified
                        </span>
                      )}
                    </h1>
                    
                    <div className={styles.profileDetails}>
                      {selectedCompany.companySSM && (
                        <p className={styles.profileDetail}>Company SSM No {selectedCompany.companySSM}</p>
                      )}
                      <p className={styles.profileDetail}>{selectedCompany.employees}</p>
                      <p className={styles.profileDetail}>{selectedCompany.category}</p>
                    </div>
                    
                    {selectedCompany.followers && (
                      <p className={styles.profileFollowers}>{selectedCompany.followers.toLocaleString()} Followers</p>
                    )}
                    
                    <p className={styles.profileJobCount}>{selectedCompany.jobVacancies} Job Vacancies</p>
                    
                    <div className={styles.profileActions}>
                      <Link to="/upload-resume" className={styles.uploadResumeButton}>
                        Upload Resume
                      </Link>
                      {/* <button className={styles.shareButton}>
                        <i className="fas fa-share-alt"></i>
                      </button> */}
                    </div>
                  </div>
                </div>
                
                <div className={styles.profileNavigation}>
                  <ul className={styles.navList}>
                    <li className={styles.navItem}>
                      <Link to="#" className={`${styles.navLink} ${styles.active}`}>Company Profile</Link>
                    </li>
                    <li className={styles.navItem}>
                      <Link to="#" className={styles.navLink}>
                        Job Vacancies <span className={styles.jobCount}>{selectedCompany.jobVacancies}</span>
                      </Link>
                    </li>
                    <li className={styles.navItem}>
                      <Link to="#" className={styles.navLink}>Photos & Videos</Link>
                    </li>
                    <li className={styles.navItem}>
                      <Link to="#" className={styles.navLink}>Review</Link>
                    </li>
                    <li className={styles.navItem}>
                      <Link to="#" className={styles.navLink}>Salaries</Link>
                    </li>
                    <li className={styles.navItem}>
                      <Link to="#" className={styles.navLink}>
                        Q&A <span className={styles.newBadge}>New</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Jobs Section */}
              <div className={styles.jobsSection}>
                <div className={styles.jobsHeader}>
                  <h2 className={styles.jobsTitle}>{selectedCompany.jobVacancies} Jobs Available at {selectedCompany.name}</h2>
                  <button className={styles.filterButton}>
                    Filter <i className="fas fa-filter"></i>
                  </button>
                </div>
                
                <div className={styles.jobsList}>
                  {jobs.map((job) => (
                    <div key={job.id} className={styles.jobCard}>
                      <div className={styles.jobHeader}>
                        <div className={styles.jobCompanyLogo}>
                          {selectedCompany.name.charAt(0)}
                        </div>
                        <div className={styles.jobInfo}>
                          <h3 className={styles.jobTitle}>{job.title}</h3>
                          <p className={styles.jobCompany}>
                            {job.company}
                            {selectedCompany.verified && (
                              <span className={styles.jobVerifiedBadge}>✓</span>
                            )}
                          </p>
                        </div>
                        <button className={styles.saveJobButton}>
                          <i className="far fa-heart"></i>
                        </button>
                      </div>
                      
                      <div className={styles.jobDetails}>
                        <div className={styles.jobSalary}>
                          <span className={styles.salaryIcon}>$</span> {job.salary}
                        </div>
                        <div className={styles.jobType}>
                          <span className={styles.typeIcon}>
                            <i className="far fa-clock"></i>
                          </span> {job.employmentType}
                        </div>
                        {job.level && (
                          <div className={styles.jobLevel}>
                            <span className={styles.levelIcon}>
                              <i className="fas fa-user-graduate"></i>
                            </span> {job.level}
                          </div>
                        )}
                        <div className={styles.jobLocation}>
                          <span className={styles.locationIcon}>
                            <i className="fas fa-map-marker-alt"></i>
                          </span> {job.location}
                        </div>
                      </div>
                      
                      {job.description && (
                        <ul className={styles.jobDescription}>
                          {job.description.map((item, index) => (
                            <li key={index} className={styles.descriptionItem}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      <div className={styles.jobSkills}>
                        {job.skills.map((skill, index) => (
                          <span key={index} className={styles.skillTag}>
                            {skill}
                          </span>
                        ))}
                      </div>
                      
                      <div className={styles.jobFooter}>
                        {job.earlyApplicant && (
                          <div className={styles.earlyApplicant}>
                            <span className={styles.earlyIcon}>
                              <i className="fas fa-user-clock"></i>
                            </span>
                            Be an early applicant!
                          </div>
                        )}
                        <div className={styles.jobPosted}>
                          Posted {job.posted}
                        </div>
                        <button className={styles.applyButton}>
                          APPLY NOW
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyContainer}>
              <div className={styles.emptyContent}>
                <div className={styles.emptyIcon}>
                  <i className="fas fa-briefcase"></i>
                </div>
                <h3 className={styles.emptyTitle}>Select a company</h3>
                <p className={styles.emptyText}>Display details here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;