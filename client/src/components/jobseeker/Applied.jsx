import React, { useState } from 'react';
import styles from './Applied.module.css';
import { PaperClipIcon, XCircleIcon, EyeIcon } from '@heroicons/react/24/outline';

const Applied = () => {
  // Sample job application data
  // In a real application, this would come from an API or context
  const [applications, setApplications] = useState([
    {
      id: 1,
      position: "Presenter",
      company: "JustDoIt",
      applicationDate: "17/3/2025",
      status: "Pending",
      canCancel: true
    },
    {
      id: 2,
      position: "Manager",
      company: "KL Recycle Station",
      applicationDate: "14/3/2025",
      status: "Invited",
      canCancel: true
    },
    {
      id: 3,
      position: "Staff",
      company: "CBAking",
      applicationDate: "3/3/2025",
      status: "Invited",
      canCancel: true
    },
    {
      id: 4,
      position: "Staff",
      company: "HaDeliver",
      applicationDate: "28/2/2025",
      status: "Rejected",
      canCancel: false
    }
  ]);

  // Function to handle cancellation of job application
  const handleCancelApplication = (id) => {
    const updatedApplications = applications.map(app => 
      app.id === id ? { ...app, status: "Cancelled", canCancel: false } : app
    );
    setApplications(updatedApplications);
  };

  // Function to view job details
  const handleViewDetails = (id) => {
    // In a real application, this would navigate to job details page or open a modal
    console.log(`Viewing details for job application ${id}`);
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
      case "Cancelled":
        return styles.statusCancelled;
      default:
        return "";
    }
  };

  return (
    <div className={styles.appliedContainer}>
      <h1 className={styles.pageTitle}>Job Applications</h1>
      
      {applications.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.applyTable}>
            <thead>
              <tr>
                <th>No</th>
                <th>Job Position</th>
                <th>Company Name</th>
                <th>Application Date</th>
                <th>Current Status</th>
                <th>Action</th>
                <th>View Details</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application, index) => (
                <tr key={application.id}>
                  <td>{index + 1}</td>
                  <td>{application.position}</td>
                  <td>{application.company}</td>
                  <td>{application.applicationDate}</td>
                  <td>
                    <span className={getStatusClass(application.status)}>
                      {application.status}
                    </span>
                  </td>
                  <td>
                    {application.canCancel ? (
                      <button 
                        className={styles.cancelButton}
                        onClick={() => handleCancelApplication(application.id)}
                      >
                        <XCircleIcon className={styles.buttonIcon} />
                        Cancel
                      </button>
                    ) : (
                      <span className={styles.noAction}>None</span>
                    )}
                  </td>
                  <td>
                    <button 
                      className={styles.detailButton}
                      onClick={() => handleViewDetails(application.id)}
                    >
                      <EyeIcon className={styles.buttonIcon} />
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.noApplications}>
          <PaperClipIcon className={styles.noAppIcon} />
          <p>You haven't applied to any jobs yet.</p>
          <button className={styles.browseJobsButton}>
            Browse Available Jobs
          </button>
        </div>
      )}
      
      <div className={styles.applicationTips}>
        <h3>Application Tips</h3>
        <ul>
          <li>Keep your resume updated and tailored for each application</li>
          <li>Follow up on your "Pending" applications after 1-2 weeks</li>
          <li>Prepare well for interviews when you receive an "Invited" status</li>
          <li>Don't be discouraged by rejections - keep improving and applying!</li>
        </ul>
      </div>
    </div>
  );
};

export default Applied;