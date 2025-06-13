import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PostRecruitment.module.css";
import { useApi } from "../../services/Api";
import { postJob } from "../../services/EmployerService";

const PostNewRecruitment = () => {
  const navigate = useNavigate();
  const api = useApi();
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    location: "",
    jobType: "Full-time",
    salaryMin: "",
    salaryMax: "",
    currency: "MYR",
    experienceLevel: "",
    department: "",
    reportingTo: "",
    startDate: "",
    applicationDeadline: "",
    jobDescription: "",
    keyResponsibilities: "",
    requiredQualifications: "",
    preferredQualifications: "",
    benefits: "",
    skills: [],
    contactEmail: "",
    contactPhone: "",
  });

  const [currentSection, setCurrentSection] = useState(0);
  const [skillInput, setSkillInput] = useState("");

  // 修改 handleSubmit 函数
  const handleSubmit = async () => {
    try {
      // 准备要发送的数据
      const jobData = {
        jobTitle: formData.jobTitle,
        company: formData.company,
        location: formData.location,
        jobType: formData.jobType,
        salaryMin: formData.salaryMin,
        salaryMax: formData.salaryMax,
        currency: formData.currency,
        experienceLevel: formData.experienceLevel,
        department: formData.department,
        reportingTo: formData.reportingTo,
        startDate: formData.startDate,
        applicationDeadline: formData.applicationDeadline,
        jobDescription: formData.jobDescription,
        keyResponsibilities: formData.keyResponsibilities,
        requiredQualifications: formData.requiredQualifications,
        preferredQualifications: formData.preferredQualifications,
        benefits: formData.benefits,
        skills: formData.skills.join(','),
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone
      };

      const data = await postJob(api, jobData);
    
      if(data.success) {
        alert('Job published successfully!');
        // 导航到查看招聘页面
        navigate("/recruitment");
        console.log('Publish success:', data);
      } else {
        throw new Error('not success');
      }
    } catch (error) {
      console.error('Publish failed:', error);
      alert('Failed to publish job. Please try again.');
    }
  };

  const sections = [
    { id: 0, title: "Basic Information" },
    { id: 1, title: "Job Details" },
    { id: 2, title: "Requirements" },
    { id: 3, title: "Benefits & Contact" },
  ];

  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Temporary",
    "Internship",
  ];
  const experienceLevels = [
    "Entry Level",
    "Mid Level",
    "Senior Level",
    "Executive",
  ];
  const currencies = ["MYR", "USD", "SGD", "EUR"];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const renderBasicInformation = () => (
    <div className={styles.sectionContent}>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Job Title *</label>
          <input
            type="text"
            value={formData.jobTitle}
            onChange={(e) => handleInputChange("jobTitle", e.target.value)}
            className={styles.input}
            placeholder="e.g. Senior Environmental Engineer"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Company *</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
            className={styles.input}
            placeholder="Company name"
          />
        </div>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Location *</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            className={styles.input}
            placeholder="e.g. Kuala Lumpur"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Employment Type *</label>
          <select
            value={formData.jobType}
            onChange={(e) => handleInputChange("jobType", e.target.value)}
            className={styles.select}
          >
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.salaryGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Currency</label>
          <select
            value={formData.currency}
            onChange={(e) => handleInputChange("currency", e.target.value)}
            className={styles.select}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Salary Min</label>
          <input
            type="number"
            value={formData.salaryMin}
            onChange={(e) => handleInputChange("salaryMin", e.target.value)}
            className={styles.input}
            placeholder="5,000"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Salary Max</label>
          <input
            type="number"
            value={formData.salaryMax}
            onChange={(e) => handleInputChange("salaryMax", e.target.value)}
            className={styles.input}
            placeholder="7,000"
          />
        </div>
      </div>
    </div>
  );

  const renderJobDetails = () => (
    <div className={styles.sectionContent}>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Experience Level</label>
          <select
            value={formData.experienceLevel}
            onChange={(e) =>
              handleInputChange("experienceLevel", e.target.value)
            }
            className={styles.select}
          >
            <option value="">Select experience level</option>
            {experienceLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Department</label>
          <input
            type="text"
            value={formData.department}
            onChange={(e) => handleInputChange("department", e.target.value)}
            className={styles.input}
            placeholder="e.g. Environmental Services"
          />
        </div>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Application Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Application Deadline</label>
          <input
            type="date"
            value={formData.applicationDeadline}
            onChange={(e) =>
              handleInputChange("applicationDeadline", e.target.value)
            }
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Job Description *</label>
        <textarea
          value={formData.jobDescription}
          onChange={(e) => handleInputChange("jobDescription", e.target.value)}
          className={styles.textarea}
          placeholder="Describe the role, company culture, and what makes this opportunity exciting..."
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Key Responsibilities</label>
        <textarea
          value={formData.keyResponsibilities}
          onChange={(e) =>
            handleInputChange("keyResponsibilities", e.target.value)
          }
          className={styles.textarea}
          placeholder="• List the main responsibilities and duties
• Use bullet points for clarity
• Include day-to-day tasks and long-term goals"
        />
      </div>
    </div>
  );

  const renderRequirements = () => (
    <div className={styles.sectionContent}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Required Qualifications *</label>
        <textarea
          value={formData.requiredQualifications}
          onChange={(e) =>
            handleInputChange("requiredQualifications", e.target.value)
          }
          className={styles.textarea}
          placeholder="• Education requirements
• Years of experience
• Essential skills and certifications
• Language requirements"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Preferred Qualifications</label>
        <textarea
          value={formData.preferredQualifications}
          onChange={(e) =>
            handleInputChange("preferredQualifications", e.target.value)
          }
          className={`${styles.textarea} ${styles.textareaSmall}`}
          placeholder="• Nice-to-have skills
• Additional certifications
• Industry experience
• Software proficiency"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Required Skills</label>
        <div className={styles.skillsContainer}>
          <div className={styles.skillInput}>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className={styles.input}
              placeholder="Type a skill and press Enter"
            />
            <button
              type="button"
              onClick={addSkill}
              className={styles.addSkillBtn}
            >
              Add
            </button>
          </div>
          {formData.skills.length > 0 && (
            <div className={styles.skillsList}>
              {formData.skills.map((skill) => (
                <span key={skill} className={styles.skillTag}>
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className={styles.removeSkillBtn}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderBenefitsContact = () => (
    <div className={styles.sectionContent}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Benefits & Perks</label>
        <textarea
          value={formData.benefits}
          onChange={(e) => handleInputChange("benefits", e.target.value)}
          className={styles.textarea}
          placeholder="• Health insurance
• Flexible working hours
• Professional development opportunities
• Performance bonuses
• Remote work options"
        />
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Contact Email *</label>
          <input
            type="email"
            value={formData.contactEmail}
            onChange={(e) => handleInputChange("contactEmail", e.target.value)}
            className={styles.input}
            placeholder="hr@company.com"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Contact Phone</label>
          <input
            type="tel"
            value={formData.contactPhone}
            onChange={(e) => handleInputChange("contactPhone", e.target.value)}
            className={styles.input}
            placeholder="+60 3-1234 5678"
          />
        </div>
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return renderBasicInformation();
      case 1:
        return renderJobDetails();
      case 2:
        return renderRequirements();
      case 3:
        return renderBenefitsContact();
      default:
        return renderBasicInformation();
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      {/* <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <button className={styles.backButton}>← Back to Dashboard</button>
            <div className={styles.divider}></div>
            <h1 className={styles.headerTitle}>Post New Job</h1>
          </div>
          <div className={styles.headerActions}>
            <button
              onClick={() => handleSubmit("save")}
              className={styles.saveButton}
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSubmit("publish")}
              className={styles.publishButton}
            >
              Publish Job
            </button>
          </div>
        </div>
      </div> */}

      <div className={styles.mainContent}>
        <div className={styles.contentGrid}>
          {/* Sidebar Navigation */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarContent}>
              <h2 className={styles.sidebarTitle}>Progress</h2>
              <nav className={styles.navigation}>
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(section.id)}
                    className={`${styles.navButton} ${
                      currentSection === section.id
                        ? styles.navButtonActive
                        : ""
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>

              {/* Progress indicator */}
              <div className={styles.progressSection}>
                <div className={styles.progressHeader}>
                  <span>Progress</span>
                  <span>
                    {Math.round(((currentSection + 1) / sections.length) * 100)}
                    %
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${
                        ((currentSection + 1) / sections.length) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={styles.mainSection}>
            <div className={styles.contentCard}>
              <div className={styles.cardContent}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    {sections[currentSection].title}
                  </h2>
                  <p className={styles.sectionDescription}>
                    {currentSection === 0 &&
                      "Let's start with the basic information about your job posting."}
                    {currentSection === 1 &&
                      "Provide detailed information about the job requirements and description."}
                    {currentSection === 2 &&
                      "Specify the qualifications and skills required for this position."}
                    {currentSection === 3 &&
                      "Add benefits information and contact details for applicants."}
                  </p>
                </div>

                {renderCurrentSection()}

                {/* Navigation Buttons */}
                <div className={styles.navigationButtons}>
                  <button
                    onClick={() =>
                      setCurrentSection(Math.max(0, currentSection - 1))
                    }
                    disabled={currentSection === 0}
                    className={`${styles.navBtn} ${
                      currentSection === 0
                        ? styles.navBtnDisabled
                        : styles.navBtnSecondary
                    }`}
                  >
                    ← Previous
                  </button>

                  {currentSection < sections.length - 1 ? (
                    <button
                      onClick={() => 
                        setCurrentSection(Math.min(sections.length - 1, currentSection + 1))
                      }
                      className={`${styles.navBtn} ${styles.navBtnPrimary}`}
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubmit()}
                      className={`${styles.navBtn} ${styles.navBtnPrimary}`}
                    >
                      Publish Job
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostNewRecruitment;
