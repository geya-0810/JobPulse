// src/components/auth/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Register.module.css'; // 引入 CSS Modules 样式文件

const Register = () => {
  const [activeTab, setActiveTab] = useState('jobSeeker');
  const navigate = useNavigate(); // For redirection

  // Form state
  const [jobSeekerForm, setJobSeekerForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  const [employerForm, setEmployerForm] = useState({
    companyName: '',
    email: '',
    phoneNumber: '',
    password: '',
    businessType: ''
  });

  const [errorMessage, setErrorMessage] = useState(''); // For displaying errors

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle form input changes
  const handleJobSeekerChange = (e) => {
    const { name, value } = e.target;
    setJobSeekerForm({
      ...jobSeekerForm,
      [name]: value
    });
  };

  const handleEmployerChange = (e) => {
    const { name, value } = e.target;
    setEmployerForm({
      ...employerForm,
      [name]: value
    });
  };

  // Handle form submission (Modified to use your provided handleSubmit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = activeTab === 'jobSeeker' ? {
      full_name: jobSeekerForm.fullName,
      email: jobSeekerForm.email,
      password: jobSeekerForm.password,
      role: 'jobseeker'
    } : {
      company_name: employerForm.companyName,
      email: employerForm.email,
      password: employerForm.password,
      role: 'employer'
      // businessType 应该也包含在发送到后端的数据中，如果后端需要的话
      // business_type: employerForm.businessType
    };

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (response.ok) { // Check if response status is OK (200-299)
        // Handle successful registration logic
        console.log('Registration successful!', result);
        //  You might want to redirect the user or show a success message
        navigate('/login'); // Example: Redirect to login page after successful registration
      } else {
        // Handle errors from the server
        console.error('Registration failed:', result);
        setErrorMessage(result.error || 'Registration failed.');  // Display error message
      }
    } catch (error) {
      // Handle network errors or exceptions
      console.error('Network error:', error);
      setErrorMessage('Network error. Please try again.');
    }
  };


  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <div className={styles.registerTabs}>
          <div
            className={`${styles.tab} ${activeTab === 'jobSeeker' ? styles.active : ''}`}
            onClick={() => handleTabChange('jobSeeker')}
          >
            Job Seeker
          </div>
          <div
            className={`${styles.tab} ${activeTab === 'employer' ? styles.active : ''}`}
            onClick={() => handleTabChange('employer')}
          >
            Employer
          </div>
        </div>

        <div className={styles.tabContent}>
          <div className={styles.linkHearder}>
          <div className={styles.backLink}>
            <Link to="/">← back to Home</Link>
          </div>

          <div className={styles.loginLink}>
            <Link to="/login">already have an account?</Link>
          </div>
          </div>

          <h2>Register JobPulse</h2>

          <div className={styles.googleSignup}>
            <button className={styles.googleBtn}>
              <img src="" alt="Google" className={styles.googleIcon} />
              Sign up with Google
            </button>
          </div>

          <div className={styles.orDivider}>OR</div>

          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>} {/* Display error message */}

          {activeTab === 'jobSeeker' ? (
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="fullName">FULL NAME</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={jobSeekerForm.fullName}
                  onChange={handleJobSeekerChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">EMAIL</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={jobSeekerForm.email}
                  onChange={handleJobSeekerChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">PASSWORD</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={jobSeekerForm.password}
                  onChange={handleJobSeekerChange}
                  required
                />
              </div>
              
              {/* <div className={styles.formGroup}>
                <label htmlFor="phoneNumber">CONFIRM PASSWORD</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={jobSeekerForm.phoneNumber}
                  onChange={handleJobSeekerChange}
                />
              </div> */}

              <button type="submit" className={styles.signupBtn}>SIGN UP</button>

              <div className={styles.termsText}>
                By signing up, you agree to JobPulse's{' '}
                <Link to="/terms">Terms of Service</Link> & <Link to="/privacy">Privacy Policy</Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="companyName">COMPANY NAME</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={employerForm.companyName}
                  onChange={handleEmployerChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="employerEmail">EMAIL</label>
                <input
                  type="email"
                  id="employerEmail"
                  name="email"
                  value={employerForm.email}
                  onChange={handleEmployerChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="employerPassword">PASSWORD</label>
                <input
                  type="password"
                  id="employerPassword"
                  name="password"
                  value={employerForm.password}
                  onChange={handleEmployerChange}
                  required
                />
              </div>

              {/* <div className={styles.formGroup}>
                <label htmlFor="employerPhoneNumber">CONFIRM PASSWORD</label>
                <input
                  type="tel"
                  id="employerPhoneNumber"
                  name="phoneNumber"
                  value={employerForm.phoneNumber}
                  onChange={handleEmployerChange}
                />
              </div> */}

              <div className={styles.formGroup}>
                <label htmlFor="businessType">BUSINESS TYPE</label>
                <select
                  id="businessType"
                  name="businessType"
                  value={employerForm.businessType}
                  onChange={handleEmployerChange}
                  required
                >
                  <option value="">Select business type</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="finance">Finance</option>
                  <option value="retail">Retail</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button type="submit" className={styles.signupBtn}>SIGN UP</button>

              <div className={styles.termsText}>
                <p>By signing up, you agree to JobPulse's
                  <Link to="/terms">Terms of Service</Link> & <Link to="/privacy">Privacy Policy</Link></p>
              </div>
            </form>
          )}

          <div className={styles.toggleRegister}>
            {activeTab === 'jobSeeker' ? (
              <p>Want to <span onClick={() => handleTabChange('employer')} className={styles.toggleLink}>register as employer?</span></p>
            ) : (
              <p>Want to <span onClick={() => handleTabChange('jobSeeker')} className={styles.toggleLink}>register as Job Seeker?</span></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;