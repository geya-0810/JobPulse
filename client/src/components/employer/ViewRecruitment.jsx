import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./ViewRecruitment.module.css";
import { useApi } from "../../services/Api";
import {
  getJobPostings,
  updateJobStatus,
  deleteJob
} from "../../services/EmployerService";

const PostRecruitment = () => {
  const [jobPostings, setJobPostings] = useState([]);
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
  const api = useApi();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showActive, setShowActive] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const jobs = await getJobPostings(api);
        // 转换数据格式匹配前端
        const transformedJobs = jobs.data.map(job => ({
          id: job.job_id.toString(),
          position: job.title,
          location: job.location,
          salary: `${job.currency} ${job.salary_min} - ${job.salary_max}`,
          skill: job.skills,
          employmentType: job.job_type,
          status: job.status,
          applicantsCount: job.applicants_count || 0,
          city: job.location.split(',')[0]?.trim(),
          company: job.company,
          experienceLevel: job.experience_level,
          department: job.department,
          startDate: job.start_date,
          applicationDeadline: job.application_deadline,
          jobDescription: job.job_description,
          keyResponsibilities: job.key_responsibilities,
          requiredQualifications: job.required_qualifications,
          preferredQualifications: job.preferred_qualifications || '',
          benefits: job.benefits,
          contactEmail: job.contact_email,
          contactPhone: job.contact_phone
        }));
        setJobPostings(transformedJobs);
        setError(null);
      } catch (err) {
        setError("Failed to load job postings");
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [api]);

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

  // const handleStatusChange = (jobId, newStatus) => {
  //   setJobPostings(
  //     jobPostings.map((job) =>
  //       job.id === jobId ? { ...job, status: newStatus } : job
  //     )
  //   );
  // };
  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await updateJobStatus(api, jobId, newStatus);
      setJobPostings(
        jobPostings.map((job) =>
          job.id === jobId ? { ...job, status: newStatus } : job
        )
      );
    } catch (err) {
      console.error("Error updating job status:", err);
      alert("Failed to update job status");
    }
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

  // const handleDeleteJob = (jobId) => {
  //   if (window.confirm("Are you sure you want to delete this job posting?")) {
  //     setJobPostings(jobPostings.filter((job) => job.id !== jobId));
  //     handleCloseModals();
  //   }
  // };
  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      try {
        await deleteJob(api, jobId);
        setJobPostings(jobPostings.filter((job) => job.id !== jobId));
        handleCloseModals();
      } catch (err) {
        console.error("Error deleting job:", err);
        alert("Failed to delete job");
      }
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
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

  if (loading) {
    return <div className={styles.loading}>Loading job postings...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.postRecruitmentContainer}>
      <div className={styles.jobPostingsSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle} onClick={toggleView}>
            {showActive ? "Active Job Postings" : "Closed Job Postings"} ⏷
          </h3>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder={
                showActive
                  ? "SEARCH FOR ACTIVE JOB POST"
                  : "SEARCH FOR CLOSED JOB POST"
              }
              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
            <button className={styles.searchButton}>🔍</button>
          </div>
        </div>

        <div className={styles.jobListContainer}>
          {showActive
            ? activeJobs.map((job) => (
                <div key={job.id} className={styles.jobListItem}>
                  <table>
                    <tr>
                      <th>
                        <span className={styles.jobDate}>
                          Start: {job.startDate}
                        </span>
                      </th>
                      <td colspan="3">
                        <h3 className={styles.jobTitle}>{job.position}</h3>
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <span className={styles.jobDate}>
                          End: {job.applicationDeadline}
                        </span>
                      </th>
                      <td>
                        <span className={styles.jobLocation}>{job.city}</span>
                      </td>
                      <td>
                        <span className={styles.jobSalary}>{job.salary}</span>
                      </td>
                      <td>
                        <span className={styles.jobType}>
                          {job.employmentType}
                        </span>
                      </td>
                    </tr>
                  </table>
                  <div className={styles.jobActions}>
                    <button
                      onClick={() => handleShowApplicants(job)}
                      className={styles.viewApplicantsBtn}
                    >
                      View Applicants ({job.applicantsCount})
                    </button>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.closeButton}
                        onClick={() => handleStatusChange(job.id, "closed")}
                      >
                        Close
                      </button>
                      <button
                        onClick={() => handleShowDetails(job)}
                        className={styles.detailsButton}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            : closedJobs.map((job) => (
                <div
                  key={job.id}
                  className={`${styles.jobListItem} ${styles.closedJob}`}
                >
                  <table>
                    <tr>
                      <th>
                        <span className={styles.jobDate}>
                          Start: {job.startDate}
                        </span>
                      </th>
                      <td colspan="3">
                        <h3 className={styles.jobTitle}>{job.position}</h3>
                        {/*   <span className={styles.statusBadge}>Closed</span> */}
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <span className={styles.jobDate}>
                          End: {job.applicationDeadline}
                        </span>
                      </th>
                      <td>
                        <span className={styles.jobLocation}>{job.city}</span>
                      </td>
                      <td>
                        <span className={styles.jobSalary}>{job.salary}</span>
                      </td>
                      <td>
                        <span className={styles.jobType}>
                          {job.employmentType}
                        </span>
                      </td>
                    </tr>
                  </table>
                  <div className={styles.jobActions}>
                    <button
                      onClick={() => handleShowApplicants(job)}
                      className={styles.viewApplicantsBtn}
                    >
                      View Applicants ({job.applicantsCount})
                    </button>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.reopenButton}
                        onClick={() => handleStatusChange(job.id, "active")}
                      >
                        Re-open
                      </button>
                      <button
                        onClick={() => handleShowDetails(job)}
                        className={styles.detailsButton}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
        <Link to="/post-recruitment" className={styles.fabButton}>
          Post new Recruitment
        </Link>
      </div>

      {showDetailsModal && selectedJob && (
        <div className={styles.modalOverlay} onClick={handleCloseModals}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                Job Details - {selectedJob.position}
              </h3>
              <button className={styles.closeBtn} onClick={handleCloseModals}>
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              {/* 新增：基本信息部分 */}
              <h4 className={styles.detailGroupTitle}>Basic Information</h4>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Company</div>
                  <div className={styles.detailValue}>
                    {selectedJob.company}
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Location</div>
                  <div className={styles.detailValue}>
                    {selectedJob.city}
                  </div>{" "}
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Salary Range</div>
                  <div className={styles.detailValue}>{selectedJob.salary}</div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Employment Type</div>
                  <div className={styles.detailValue}>
                    {selectedJob.employmentType}
                  </div>
                </div>
              </div>

              <h4 className={styles.detailGroupTitle}>Job Details</h4>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Experience Level</div>
                  <div className={styles.detailValue}>
                    {selectedJob.experienceLevel}
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Department</div>
                  <div className={styles.detailValue}>
                    {selectedJob.department}
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>
                    Application Start Date
                  </div>
                  <div className={styles.detailValue}>
                    {formatDate(selectedJob.startDate)}
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Application Deadline</div>
                  <div className={styles.detailValue}>
                    {formatDate(selectedJob.applicationDeadline)}
                  </div>
                </div>
              </div>
              <div className={styles.detailSection}>
                <div className={styles.detailLabel}>Job Description</div>
                <div className={styles.detailValue}>
                  {selectedJob.jobDescription}
                </div>
              </div>
              <div className={styles.detailSection}>
                <div className={styles.detailLabel}>Key Responsibilities</div>
                <div className={styles.detailValue}>
                  {selectedJob.keyResponsibilities}
                </div>
              </div>

              <h4 className={styles.detailGroupTitle}>Requirements</h4>
              <div className={styles.detailSection}>
                <div className={styles.detailLabel}>
                  Required Qualifications
                </div>
                <div className={styles.detailValue}>
                  {selectedJob.requiredQualifications}
                </div>
              </div>
              {selectedJob.preferredQualifications && (
                <div className={styles.detailSection}>
                  <div className={styles.detailLabel}>
                    Preferred Qualifications
                  </div>
                  <div className={styles.detailValue}>
                    {selectedJob.preferredQualifications}
                  </div>
                </div>
              )}
              {selectedJob.skills &&
                selectedJob.skills.length > 0 && ( // 假设skills可能是一个字符串，如果不是，需要调整
                  <div className={styles.detailSection}>
                    <div className={styles.detailLabel}>Required Skills</div>
                    <div className={styles.detailValue}>
                      {/* 如果 skills 是字符串，按逗号分割并显示为标签 */}
                      {typeof selectedJob.skills === "string"
                        ? selectedJob.skills.split(",").map((skill, index) => (
                            <span key={index} className={styles.skillTag}>
                              {skill.trim()}
                            </span>
                          ))
                        : // 如果 skills 是数组，直接映射
                          selectedJob.skills.map((skill, index) => (
                            <span key={index} className={styles.skillTag}>
                              {skill.trim()}
                            </span>
                          ))}
                    </div>
                  </div>
                )}

              <h4 className={styles.detailGroupTitle}>Benefits & Contact</h4>
              <div className={styles.detailSection}>
                <div className={styles.detailLabel}>Benefits & Perks</div>
                <div className={styles.detailValue}>{selectedJob.benefits}</div>
              </div>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Contact Email</div>
                  <div className={styles.detailValue}>
                    {selectedJob.contactEmail}
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Contact Phone</div>
                  <div className={styles.detailValue}>
                    {selectedJob.contactPhone}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.deleteButton}
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
        <div className={styles.modalOverlay} onClick={handleCloseModals}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                Applicants for {selectedJob.position} (
                {selectedJob.applicantsCount})
              </h3>
              <button className={styles.closeBtn} onClick={handleCloseModals}>
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              {mockApplicants.map((applicant) => (
                <div key={applicant.id} className={styles.applicantCard}>
                  <div className={styles.applicantHeader}>
                    <h4 className={styles.applicantName}>{applicant.name}</h4>
                    <span
                      className={{
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
                  <div className={styles.applicantInfo}>
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
                  <div className={styles.applicantActions}>
                    <button className={styles.downloadBtn}>
                      📄 Download Resume
                    </button>
                    <button
                      className={{
                        ...styles.downloadBtn,
                        backgroundColor: "#28a745",
                      }}
                    >
                      📧 Send Email
                    </button>
                    <button
                      className={{
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

export default PostRecruitment;
