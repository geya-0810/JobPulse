import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ViewRecruitment = () => {
  const [jobPostings, setJobPostings] = useState([
    {
      id: "1",
      position: "Senior Environmental Engineer",
      location:
        "No 1, Jalan Satu, Taman Satu, 47000 Sungai Buloh Selangor, Malaysia.",
      salary: "MYR 5,000 - 7,000",
      skill: "Environmental Engineering",
      employmentType: "Full-time",
      postedAt: "20/4/2025",
      status: "active",
      applicantsCount: 12,
      city: "Kuala Lumpur",
      // Complete job details for popup
      company: "EcoTech Solutions",
      experienceLevel: "Senior Level",
      department: "Environmental Services",
      startDate: "2025-05-01",
      applicationDeadline: "2025-04-30",
      jobDescription:
        "We are seeking a Senior Environmental Engineer to lead our sustainability initiatives and ensure compliance with environmental regulations.",
      keyResponsibilities:
        "• Lead environmental impact assessments\n• Develop and implement environmental management systems\n• Ensure regulatory compliance\n• Collaborate with cross-functional teams",
      requiredQualifications:
        "• Bachelor's degree in Environmental Engineering\n• 5+ years of experience\n• Professional Engineer (PE) license preferred\n• Strong analytical and problem-solving skills",
      benefits:
        "• Comprehensive health insurance\n• Flexible working hours\n• Professional development opportunities\n• Annual bonus",
      contactEmail: "hr@ecotech.com",
      contactPhone: "+60 3-1234 5678",
    },
    {
      id: "2",
      position: "Waste Management Specialist",
      location:
        "No 1, Jalan Satu, Taman Satu, 47000 Sungai Buloh Selangor, Malaysia.",
      salary: "MYR 3,500 - 5,000",
      skill: "Waste Management",
      employmentType: "Contract",
      postedAt: "18/4/2025",
      status: "active",
      applicantsCount: 5,
      city: "Petaling Jaya",
      company: "Green Solutions Ltd",
      experienceLevel: "Mid Level",
      department: "Operations",
      startDate: "2025-05-15",
      applicationDeadline: "2025-05-01",
      jobDescription:
        "Join our team as a Waste Management Specialist to develop and implement comprehensive waste reduction strategies.",
      keyResponsibilities:
        "• Design waste management systems\n• Monitor waste disposal processes\n• Conduct site inspections\n• Prepare compliance reports",
      requiredQualifications:
        "• Degree in Environmental Science or related field\n• 3+ years in waste management\n• Knowledge of local regulations\n• Strong communication skills",
      benefits:
        "• Health insurance\n• Training opportunities\n• Performance bonuses",
      contactEmail: "careers@greensolutions.com",
      contactPhone: "+60 3-2345 6789",
    },
    {
      id: "3",
      position: "Environmental Compliance Officer",
      location:
        "No 1, Jalan Satu, Taman Satu, 47000 Sungai Buloh Selangor, Malaysia.",
      salary: "MYR 4,000 - 6,000",
      skill: "Environmental Law",
      employmentType: "Full-time",
      postedAt: "15/4/2025",
      status: "active",
      applicantsCount: 3,
      city: "Shah Alam",
      company: "Compliance Corp",
      experienceLevel: "Mid Level",
      department: "Legal & Compliance",
      startDate: "2025-05-01",
      applicationDeadline: "2025-04-25",
      jobDescription:
        "Seeking an Environmental Compliance Officer to ensure adherence to environmental regulations and standards.",
      keyResponsibilities:
        "• Monitor regulatory compliance\n• Conduct environmental audits\n• Prepare regulatory submissions\n• Liaise with regulatory bodies",
      requiredQualifications:
        "• Degree in Environmental Law or related field\n• 2+ years compliance experience\n• Knowledge of environmental regulations\n• Attention to detail",
      benefits:
        "• Competitive salary\n• Health benefits\n• Career advancement opportunities",
      contactEmail: "jobs@compliancecorp.com",
      contactPhone: "+60 3-3456 7890",
    },
    {
      id: "4",
      position: "Recycling Program Manager",
      location:
        "No 1, Jalan Satu, Taman Satu, 47000 Sungai Buloh Selangor, Malaysia.",
      salary: "MYR 4,000 - 6,000",
      skill: "Management skill",
      employmentType: "Full-time",
      postedAt: "15/3/2025",
      status: "closed",
      applicantsCount: 800000,
      city: "Kuala Lumpur",
      company: "RecycleTech",
      experienceLevel: "Senior Level",
      department: "Operations",
      startDate: "2025-04-01",
      applicationDeadline: "2025-03-30",
      jobDescription:
        "Lead our recycling programs and drive sustainable waste management initiatives across the organization.",
      keyResponsibilities:
        "• Manage recycling operations\n• Develop program strategies\n• Coordinate with stakeholders\n• Monitor program performance",
      requiredQualifications:
        "• Bachelor's degree in relevant field\n• 5+ years management experience\n• Strong leadership skills\n• Project management experience",
      benefits:
        "• Executive benefits package\n• Stock options\n• Flexible schedule",
      contactEmail: "hr@recycletech.com",
      contactPhone: "+60 3-4567 8901",
    },
  ]);

  const [showActive, setShowActive] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Mock applicants data
  const mockApplicants = [
    {
      id: 1,
      name: "Ahmad Rahman",
      email: "ahmad.rahman@email.com",
      phone: "+60 12-345 6789",
      experience: "5 years",
      education: "Bachelor's in Environmental Engineering",
      appliedDate: "2025-04-22",
      status: "Under Review",
      resume: "ahmad_rahman_resume.pdf",
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      email: "siti.nurhaliza@email.com",
      phone: "+60 13-456 7890",
      experience: "3 years",
      education: "Master's in Environmental Science",
      appliedDate: "2025-04-21",
      status: "Shortlisted",
      resume: "siti_nurhaliza_resume.pdf",
    },
    {
      id: 3,
      name: "Lee Wei Ming",
      email: "lee.weiming@email.com",
      phone: "+60 14-567 8901",
      experience: "7 years",
      education: "Bachelor's in Chemical Engineering",
      appliedDate: "2025-04-20",
      status: "Interview Scheduled",
      resume: "lee_weiming_resume.pdf",
    },
  ];

  const filteredJobs = jobPostings.filter(
    (job) =>
      job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeJobs = filteredJobs.filter((job) => job.status === "active");
  const closedJobs = filteredJobs.filter((job) => job.status === "closed");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (jobId, newStatus) => {
    setJobPostings(
      jobPostings.map((job) =>
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    );
  };

  const toggleView = () => {
    setShowActive(!showActive);
    setSearchTerm("");
  };

  const handleShowDetails = (job) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
    setShowApplicantsModal(false);
  };

  const handleShowApplicants = (job) => {
    setSelectedJob(job);
    setShowApplicantsModal(true);
    setShowDetailsModal(false);
  };

  const handleCloseModals = () => {
    setShowDetailsModal(false);
    setShowApplicantsModal(false);
    setSelectedJob(null);
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      setJobPostings(jobPostings.filter((job) => job.id !== jobId));
      handleCloseModals();
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-MY", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      position: "relative",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      padding: "15px",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      position: "sticky",
      top: "20px",
      zIndex: 10,
    },
    title: {
      margin: 0,
      color: "#333",
      cursor: "pointer",
      padding: "10px 20px",
      border: "2px solid #007bff",
      borderRadius: "6px",
      backgroundColor: "white",
      transition: "all 0.3s ease",
    },
    titleHover: {
      backgroundColor: "#007bff",
      color: "white",
    },
    searchContainer: {
      display: "flex",
      alignItems: "center",
      border: "1px solid #ddd",
      borderRadius: "6px",
      overflow: "hidden",
      width: "400px",
    },
    searchInput: {
      flex: 1,
      padding: "10px 15px",
      border: "none",
      outline: "none",
      fontSize: "14px",
    },
    searchButton: {
      padding: "10px 15px",
      border: "none",
      backgroundColor: "#007bff",
      color: "white",
      cursor: "pointer",
    },
    tableContainer: {
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      overflow: "hidden",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    thead: {
      backgroundColor: "#f8f9fa",
      borderBottom: "2px solid #dee2e6",
    },
    th: {
      padding: "15px 12px",
      textAlign: "left",
      fontWeight: "600",
      color: "#495057",
      fontSize: "14px",
    },
    td: {
      padding: "15px 12px",
      borderBottom: "1px solid #dee2e6",
      fontSize: "14px",
      verticalAlign: "middle",
    },
    tr: {
      transition: "background-color 0.2s ease",
    },
    trHover: {
      backgroundColor: "#f8f9fa",
    },
    jobTitle: {
      fontWeight: "600",
      color: "#333",
      marginBottom: "4px",
    },
    postDate: {
      color: "#6c757d",
      fontSize: "12px",
    },
    location: {
      color: "#666",
      fontSize: "13px",
    },
    salary: {
      fontWeight: "500",
      color: "#28a745",
    },
    employmentType: {
      padding: "4px 8px",
      backgroundColor: "#e9ecef",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "500",
    },
    statusBadge: {
      padding: "4px 8px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "500",
      textTransform: "capitalize",
    },
    statusActive: {
      backgroundColor: "#d4edda",
      color: "#155724",
    },
    statusClosed: {
      backgroundColor: "#f8d7da",
      color: "#721c24",
    },
    actionButtons: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
    },
    button: {
      padding: "6px 12px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "500",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "80px",
      transition: "all 0.2s ease",
    },
    viewButton: {
      backgroundColor: "#17a2b8",
      color: "white",
    },
    detailsButton: {
      backgroundColor: "#6c757d",
      color: "white",
    },
    closeButton: {
      backgroundColor: "#dc3545",
      color: "white",
    },
    reopenButton: {
      backgroundColor: "#28a745",
      color: "white",
    },
    emptyState: {
      textAlign: "center",
      padding: "40px",
      color: "#6c757d",
    },
    fab: {
      position: "fixed",
      bottom: "30px",
      right: "30px",
      backgroundColor: "#17a2b8",
      color: "white",
      padding: "15px 25px",
      borderRadius: "30px",
      textDecoration: "none",
      fontWeight: "500",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      zIndex: 100,
      transition: "all 0.3s ease",
    },
    // Modal styles
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
    },
    modal: {
      backgroundColor: "white",
      borderRadius: "12px",
      maxWidth: "800px",
      width: "100%",
      maxHeight: "90vh",
      overflow: "auto",
      position: "relative",
    },
    modalHeader: {
      padding: "20px 24px",
      borderBottom: "1px solid #dee2e6",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    modalTitle: {
      margin: 0,
      fontSize: "18px",
      fontWeight: "600",
      color: "#333",
    },
    closeBtn: {
      background: "none",
      border: "none",
      fontSize: "24px",
      cursor: "pointer",
      color: "#666",
      padding: "0",
      width: "30px",
      height: "30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    modalBody: {
      padding: "24px",
    },
    detailSection: {
      marginBottom: "20px",
    },
    detailLabel: {
      fontWeight: "600",
      color: "#495057",
      marginBottom: "8px",
      fontSize: "14px",
    },
    detailValue: {
      color: "#666",
      fontSize: "14px",
      lineHeight: "1.5",
      whiteSpace: "pre-line",
    },
    modalFooter: {
      padding: "20px 24px",
      borderTop: "1px solid #dee2e6",
      display: "flex",
      justifyContent: "flex-end",
      gap: "10px",
    },
    deleteButton: {
      backgroundColor: "#dc3545",
      color: "white",
      padding: "8px 16px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: "500",
    },
    // Applicants modal styles
    applicantCard: {
      border: "1px solid #dee2e6",
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "16px",
    },
    applicantHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "12px",
    },
    applicantName: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#333",
      margin: 0,
    },
    applicantStatus: {
      padding: "4px 8px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "500",
    },
    applicantInfo: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "8px",
      fontSize: "14px",
      color: "#666",
    },
    applicantActions: {
      marginTop: "12px",
      display: "flex",
      gap: "8px",
    },
    downloadBtn: {
      backgroundColor: "#007bff",
      color: "white",
      padding: "6px 12px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "12px",
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2
          style={styles.title}
          onClick={toggleView}
          onMouseEnter={(e) => Object.assign(e.target.style, styles.titleHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.title)}
        >
          {showActive ? "Active Job Postings" : "Closed Job Postings"} ⏷
        </h2>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder={
              showActive
                ? "SEARCH FOR ACTIVE JOB POST"
                : "SEARCH FOR CLOSED JOB POST"
            }
            value={searchTerm}
            onChange={handleSearchChange}
            style={styles.searchInput}
          />
          <button style={styles.searchButton}>🔍</button>
        </div>
      </div>

      {/* Job Listings Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={{ ...styles.th, width: "25%" }}>Job Title & Date</th>
              <th style={{ ...styles.th, width: "20%" }}>Location</th>
              <th style={{ ...styles.th, width: "15%" }}>Salary</th>
              <th style={{ ...styles.th, width: "12%" }}>Type</th>
              <th style={{ ...styles.th, width: "10%" }}>Status</th>
              <th style={{ ...styles.th, width: "18%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(showActive ? activeJobs : closedJobs).map((job) => (
              <tr
                key={job.id}
                style={styles.tr}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f8f9fa")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <td style={styles.td}>
                  <div style={styles.jobTitle}>{job.position}</div>
                  <div style={styles.postDate}>Posted: {job.postedAt}</div>
                </td>
                <td style={styles.td}>
                  <div style={styles.location}>
                    {truncateText(job.city, 20)}
                  </div>
                </td>
                <td style={styles.td}>
                  <div style={styles.salary}>{job.salary}</div>
                </td>
                <td style={styles.td}>
                  <span style={styles.employmentType}>
                    {job.employmentType}
                  </span>
                </td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      ...(job.status === "active"
                        ? styles.statusActive
                        : styles.statusClosed),
                    }}
                  >
                    {job.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.actionButtons}>
                    <button
                      onClick={() => handleShowApplicants(job)}
                      style={{ ...styles.button, ...styles.viewButton }}
                    >
                      View ({job.applicantsCount})
                    </button>
                    <button
                      onClick={() => handleShowDetails(job)}
                      style={{ ...styles.button, ...styles.detailsButton }}
                    >
                      Details
                    </button>
                    {job.status === "active" ? (
                      <button
                        onClick={() => handleStatusChange(job.id, "closed")}
                        style={{ ...styles.button, ...styles.closeButton }}
                      >
                        Close
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(job.id, "active")}
                        style={{ ...styles.button, ...styles.reopenButton }}
                      >
                        Re-open
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {((showActive && activeJobs.length === 0) ||
          (!showActive && closedJobs.length === 0)) && (
          <div style={styles.emptyState}>
            <p>No {showActive ? "active" : "closed"} job postings found</p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <a href="/post-recruitment" style={styles.fab}>
        Post new Recruitment
      </a>

      {/* Job Details Modal */}
      {showDetailsModal && selectedJob && (
        <div style={styles.modalOverlay} onClick={handleCloseModals}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                Job Details - {selectedJob.position}
              </h3>
              <button style={styles.closeBtn} onClick={handleCloseModals}>
                ×
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.detailSection}>
                <div style={styles.detailLabel}>Company</div>
                <div style={styles.detailValue}>{selectedJob.company}</div>
              </div>
              <div style={styles.detailSection}>
                <div style={styles.detailLabel}>Location</div>
                <div style={styles.detailValue}>{selectedJob.location}</div>
              </div>
              <div style={styles.detailSection}>
                <div style={styles.detailLabel}>Salary Range</div>
                <div style={styles.detailValue}>{selectedJob.salary}</div>
              </div>
              <div style={styles.detailSection}>
                <div style={styles.detailLabel}>Employment Type</div>
                <div style={styles.detailValue}>
                  {selectedJob.employmentType}
                </div>
              </div>
              <div style={styles.detailSection}>
                <div style={styles.detailLabel}>Experience Level</div>
                <div style={styles.detailValue}>
                  {selectedJob.experienceLevel}
                </div>
              </div>
              <div style={styles.detailSection}>
                <div style={styles.detailLabel}>Department</div>
                <div style={styles.detailValue}>{selectedJob.department}</div>
              </div>
              <div style={styles.detailSection}>
                <div style={styles.detailLabel}>Start Date</div>
                <div style={styles.detailValue}>
                  {formatDate(selectedJob.startDate)}
                </div>
              </div>
              <div style={styles.detailSection}>
                <div style={styles.detailLabel}>Application Deadline</div>
                <div style={styles.detailValue}>
                  {formatDate(selectedJob.applicationDeadline)}
                </div>
              </div>
              <div style={styles.detailSection}>
                <div style={styles.detailLabel}>Job Description</div>
                <div style={styles.detailValue}>
                  {selectedJob.jobDescription}
                </div>
              </div>
              <div style={styles.detailSection}>
                <div style={styles.detailLabel}>Key Responsibilities</div>
                <div style={styles.detailValue}>
                  {selectedJob.keyResponsibilities}
                </div>
              </div>
              <div style={styles.detailSection}>
                <div style={styles.detailLabel}>Required Qualifications</div>
                <div style={styles.detailValue}>
                  {selectedJob.requiredQualifications}
                </div>
              </div>
              <div style={styles.detailSection}>
                <div style={styles.detailLabel}>Benefits</div>
                <div style={styles.detailValue}>{selectedJob.benefits}</div>
              </div>
              <div style={styles.detailSection}>
                <div style={styles.detailLabel}>Contact Information</div>
                <div style={styles.detailValue}>
                  Email: {selectedJob.contactEmail}
                  <br />
                  Phone: {selectedJob.contactPhone}
                </div>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button
                style={styles.deleteButton}
                onClick={() => handleDeleteJob(selectedJob.id)}
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Applicants Modal */}
      {showApplicantsModal && selectedJob && (
        <div style={styles.modalOverlay} onClick={handleCloseModals}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                Applicants for {selectedJob.position} (
                {selectedJob.applicantsCount})
              </h3>
              <button style={styles.closeBtn} onClick={handleCloseModals}>
                ×
              </button>
            </div>
            <div style={styles.modalBody}>
              {mockApplicants.map((applicant) => (
                <div key={applicant.id} style={styles.applicantCard}>
                  <div style={styles.applicantHeader}>
                    <h4 style={styles.applicantName}>{applicant.name}</h4>
                    <span
                      style={{
                        ...styles.applicantStatus,
                        backgroundColor:
                          applicant.status === "Interview Scheduled"
                            ? "#d4edda"
                            : applicant.status === "Shortlisted"
                            ? "#fff3cd"
                            : "#e2e3e5",
                        color:
                          applicant.status === "Interview Scheduled"
                            ? "#155724"
                            : applicant.status === "Shortlisted"
                            ? "#856404"
                            : "#495057",
                      }}
                    >
                      {applicant.status}
                    </span>
                  </div>
                  <div style={styles.applicantInfo}>
                    <div>
                      <strong>Email:</strong> {applicant.email}
                    </div>
                    <div>
                      <strong>Phone:</strong> {applicant.phone}
                    </div>
                    <div>
                      <strong>Experience:</strong> {applicant.experience}
                    </div>
                    <div>
                      <strong>Education:</strong> {applicant.education}
                    </div>
                    <div>
                      <strong>Applied:</strong> {applicant.appliedDate}
                    </div>
                  </div>
                  <div style={styles.applicantActions}>
                    <button style={styles.downloadBtn}>
                      📄 Download Resume
                    </button>
                    <button
                      style={{
                        ...styles.downloadBtn,
                        backgroundColor: "#28a745",
                      }}
                    >
                      📧 Send Email
                    </button>
                    <button
                      style={{
                        ...styles.downloadBtn,
                        backgroundColor: "#6c757d",
                      }}
                    >
                      📝 Add Notes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewRecruitment;
