import React, { useState } from 'react';
import styles from './Application.module.css';
import { ChevronDownIcon, ChevronUpIcon, EyeIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const Application = () => {
  // Sample job postings data with applicants
  // In a real application, this would come from an API or context
  const [jobPostings, setJobPostings] = useState([
    {
      id: 1,
      position: "Manager",
      status: "In Progress",
      numberOfApplicants: 3,
      isExpanded: false,
      applicants: [
        {
          id: 101,
          name: "Yi Er San",
          applicationTime: "10/3/2025",
          status: "Pending",
          resumeFile: "abc.pdf"
        },
        {
          id: 102,
          name: "San Er Yi",
          applicationTime: "14/3/2025",
          status: "Invited",
          resumeFile: "cba.docx"
        },
        {
          id: 103,
          name: "Jiu Shi Syi",
          applicationTime: "11/3/2025",
          status: "Rejected",
          resumeFile: null
        }
      ]
    },
    {
      id: 2,
      position: "Driver",
      status: "In Progress",
      numberOfApplicants: 2,
      isExpanded: false,
      applicants: [
        {
          id: 201,
          name: "Liu Wei",
          applicationTime: "15/3/2025",
          status: "Pending",
          resumeFile: "liu.pdf"
        },
        {
          id: 202,
          name: "Ma Long",
          applicationTime: "16/3/2025",
          status: "Pending",
          resumeFile: "ma.pdf"
        }
      ]
    },
    {
      id: 3,
      position: "Staff",
      status: "In Progress",
      numberOfApplicants: 0,
      isExpanded: false,
      applicants: []
    },
    {
      id: 4,
      position: "Receptionist",
      status: "Close",
      numberOfApplicants: 5,
      isExpanded: false,
      applicants: [
        {
          id: 401,
          name: "Chen Min",
          applicationTime: "1/3/2025",
          status: "Invited",
          resumeFile: "chen.pdf"
        },
        {
          id: 402,
          name: "Wang Lei",
          applicationTime: "2/3/2025",
          status: "Rejected",
          resumeFile: "wang.pdf"
        },
        {
          id: 403,
          name: "Zhang Wei",
          applicationTime: "3/3/2025",
          status: "Invited",
          resumeFile: "zhang.pdf"
        },
        {
          id: 404,
          name: "Li Jun",
          applicationTime: "4/3/2025",
          status: "Rejected",
          resumeFile: "li.pdf"
        },
        {
          id: 405,
          name: "Zhao Ming",
          applicationTime: "5/3/2025",
          status: "Pending",
          resumeFile: "zhao.pdf"
        }
      ]
    },
    {
      id: 5,
      position: "Designer",
      status: "Close",
      numberOfApplicants: 0,
      isExpanded: false,
      applicants: []
    },
    {
      id: 6,
      position: "Developer",
      status: "Close",
      numberOfApplicants: 4,
      isExpanded: false,
      applicants: [
        {
          id: 601,
          name: "Sarah Chen",
          applicationTime: "10/2/2025",
          status: "Invited",
          resumeFile: "sarah.pdf"
        },
        {
          id: 602,
          name: "John Smith",
          applicationTime: "11/2/2025",
          status: "Rejected",
          resumeFile: "john.pdf"
        },
        {
          id: 603,
          name: "Ali Mohammed",
          applicationTime: "12/2/2025",
          status: "Invited",
          resumeFile: "ali.pdf"
        },
        {
          id: 604,
          name: "Maria Garcia",
          applicationTime: "13/2/2025",
          status: "Pending",
          resumeFile: "maria.pdf"
        }
      ]
    }
  ]);

  // Toggle job posting expansion
  const toggleJobPostingExpansion = (id) => {
    setJobPostings(prevPostings =>
      prevPostings.map(posting =>
        posting.id === id 
          ? { ...posting, isExpanded: !posting.isExpanded } 
          : { ...posting, isExpanded: false }
      )
    );
  };

  // Handle invite or reject action
  const handleStatusChange = (jobId, applicantId, newStatus) => {
    setJobPostings(prevPostings =>
      prevPostings.map(posting =>
        posting.id === jobId
          ? {
              ...posting,
              applicants: posting.applicants.map(applicant =>
                applicant.id === applicantId
                  ? { ...applicant, status: newStatus }
                  : applicant
              )
            }
          : posting
      )
    );
  };

  // Function to view resume
  const handleViewResume = (resumeFile) => {
    // In a real application, this would open the resume file
    console.log(`Opening resume: ${resumeFile}`);
    alert(`Opening resume: ${resumeFile}`);
  };
  
  // Function to determine status class for styling
  const getStatusClass = (status) => {
    switch(status) {
      case "Pending":
        return styles.statusPending;
      case "Invited":
        return styles.statusInvited;
      case "Rejected":
        return styles.statusRejected;
      default:
        return "";
    }
  };

  // Function to determine job status class
  const getJobStatusClass = (status) => {
    switch(status) {
      case "In Progress":
        return styles.jobStatusInProgress;
      case "Close":
        return styles.jobStatusClosed;
      default:
        return "";
    }
  };

  return (
    <div className={styles.applicationContainer}>
      <h1 className={styles.pageTitle}>Job Applications</h1>
      
      <div className={styles.tableContainer}>
        <table className={styles.jobsTable}>
          <thead>
            <tr>
              <th>No</th>
              <th>Job Position</th>
              <th>Status</th>
              <th>Number of Applications</th>
              <th>View Applications</th>
            </tr>
          </thead>
          <tbody>
            {jobPostings.map((job, index) => (
              <React.Fragment key={job.id}>
                <tr className={styles.jobRow}>
                  <td>{index + 1}</td>
                  <td>{job.position}</td>
                  <td>
                    <span className={getJobStatusClass(job.status)}>
                      {job.status}
                    </span>
                  </td>
                  <td>{job.numberOfApplicants}</td>
                  <td>
                    <button 
                      className={`${styles.dropdownButton} ${job.numberOfApplicants === 0 ? styles.disabledButton : ''}`}
                      onClick={() => job.numberOfApplicants > 0 && toggleJobPostingExpansion(job.id)}
                      disabled={job.numberOfApplicants === 0}
                    >
                      {job.isExpanded ? 
                        <ChevronUpIcon className={styles.buttonIcon} /> :
                        <ChevronDownIcon className={styles.buttonIcon} />
                      }
                      {job.isExpanded ? 'HIDE DETAILS' : 'VIEW DETAILS'}
                    </button>
                  </td>
                </tr>
                {job.isExpanded && (
                  <tr>
                    <td colSpan="5" className={styles.expandedContent}>
                      <table className={styles.applicantsTable}>
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Candidate Name</th>
                            <th>Application Time</th>
                            <th>Current Status</th>
                            <th>Action</th>
                            <th>View Resume</th>
                          </tr>
                        </thead>
                        <tbody>
                          {job.applicants.map((applicant, appIndex) => (
                            <tr key={applicant.id}>
                              <td>{appIndex + 1}</td>
                              <td>{applicant.name}</td>
                              <td>{applicant.applicationTime}</td>
                              <td>
                                <span className={getStatusClass(applicant.status)}>
                                  {applicant.status}
                                </span>
                              </td>
                              <td>
                                {applicant.status === "Pending" ? (
                                  <div className={styles.actionButtons}>
                                    <button 
                                      className={styles.inviteButton}
                                      onClick={() => handleStatusChange(job.id, applicant.id, "Invited")}
                                    >
                                      <CheckCircleIcon className={styles.buttonIcon} />
                                      Invite
                                    </button>
                                    <button 
                                      className={styles.rejectButton}
                                      onClick={() => handleStatusChange(job.id, applicant.id, "Rejected")}
                                    >
                                      <XCircleIcon className={styles.buttonIcon} />
                                      Reject
                                    </button>
                                  </div>
                                ) : applicant.status === "Invited" ? (
                                  <button 
                                    className={styles.rejectButton}
                                    onClick={() => handleStatusChange(job.id, applicant.id, "Rejected")}
                                  >
                                    <XCircleIcon className={styles.buttonIcon} />
                                    Reject
                                  </button>
                                ) : applicant.status === "Rejected" ? (
                                  <button 
                                    className={styles.inviteButton}
                                    onClick={() => handleStatusChange(job.id, applicant.id, "Invited")}
                                  >
                                    <CheckCircleIcon className={styles.buttonIcon} />
                                    Invite
                                  </button>
                                ) : (
                                  <span className={styles.noAction}>None</span>
                                )}
                              </td>
                              <td>
                                {applicant.resumeFile ? (
                                  <button 
                                    className={styles.resumeButton}
                                    onClick={() => handleViewResume(applicant.resumeFile)}
                                  >
                                    <EyeIcon className={styles.buttonIcon} />
                                    {applicant.resumeFile}
                                  </button>
                                ) : (
                                  <span className={styles.noResume}>None</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.applicationTips}>
        <h3>Recruitment Tips</h3>
        <ul>
          <li>Review applications within 7 days to keep candidates engaged</li>
          <li>Schedule interviews promptly after sending invitations</li>
          <li>Provide feedback to rejected candidates when possible</li>
          <li>Check candidate resumes thoroughly before making decisions</li>
        </ul>
      </div>
    </div>
  );
};

export default Application;