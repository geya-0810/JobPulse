// src/components/employer/CompanyProfile.jsx
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './CompanyProfile.module.css';

const CompanyProfile = () => {
  // Mock company data - in real implementation, this would come from API/context
  const [companyData, setCompanyData] = useState({
    userId: '5314',
    userName: 'KLRS',
    password: '##########',
    companyName: 'KL Recycle Station',
    registrationId: '240720123456',
    email: 'klrecycles@gmail.com',
    phone: '03-456 7891',
    address: '********************************\n********************************\n**** **** ******************',
    website: 'www.klrecycle.com.my',
    industryType: 'Environmental Services',
    companySize: '50-100 employees',
    foundedYear: '2015',
    companyDescription: 'KL Recycle Station is a leading recycling company in Kuala Lumpur dedicated to promoting sustainable waste management practices and environmental conservation.',
    profileImage: null,
    coverImage: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({...companyData});
  const profileImageRef = useRef(null);
  const coverImageRef = useRef(null);

  // Handle profile image upload
  const handleProfileImageClick = () => {
    profileImageRef.current.click();
  };

  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (isEditing) {
          setEditFormData({
            ...editFormData,
            profileImage: e.target.result
          });
        } else {
          setCompanyData({
            ...companyData,
            profileImage: e.target.result
          });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Handle cover image upload
  const handleCoverImageClick = () => {
    coverImageRef.current.click();
  };

  const handleCoverImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (isEditing) {
          setEditFormData({
            ...editFormData,
            coverImage: e.target.result
          });
        } else {
          setCompanyData({
            ...companyData,
            coverImage: e.target.result
          });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Handle edit form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // Save changes
      setCompanyData({...editFormData});
    } else {
      // Enter edit mode, ensure editFormData is fresh from companyData
      setEditFormData({...companyData});
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className={styles.employerContainer}>
      <div className={styles.employerMain}>
        <div className={styles.employerHeader}>
          <div 
            className={styles.coverPhoto} 
            onClick={isEditing ? handleCoverImageClick : undefined}
            style={{
              cursor: isEditing ? 'pointer' : 'default',
              backgroundImage: (isEditing ? editFormData.coverImage : companyData.coverImage) ? 
                `url(${isEditing ? editFormData.coverImage : companyData.coverImage})` : 'none'
            }}
          >
            {isEditing && !editFormData.coverImage && (
              <div className={styles.uploadCoverPrompt}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span>Click to upload a cover photo</span>
              </div>
            )}
            <input 
              type="file" 
              ref={coverImageRef} 
              onChange={handleCoverImageChange} 
              accept="image/*" 
              style={{ display: 'none' }} 
            />
          </div>
          
          <div className={styles.companyCard}>
            <div className={styles.companyBasicInfo}>
              <div 
                className={styles.companyLogo} 
                onClick={handleProfileImageClick}
              >
                {(isEditing ? editFormData.profileImage : companyData.profileImage) ? (
                  <img src={isEditing ? editFormData.profileImage : companyData.profileImage} alt="Company Logo" />
                ) : (
                  <div className={styles.logoPlaceholder}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 7h-4a2 2 0 0 1-2-2V1"></path>
                      <path d="M14 1H4a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7Z"></path>
                    </svg>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={profileImageRef} 
                  onChange={handleProfileImageChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
              </div>
              
              <div className={styles.companyIdSection}>
                <h2>User ID: <span>{companyData.userId}</span></h2>
                <div className={styles.actionButtons}>
                  <button onClick={toggleEditMode} className={styles.editButton}>
                    {isEditing ? 'Save' : 'Edit'}
                  </button>
                  <button className={styles.certButton}>
                    Apply Certification
                  </button>
                </div>
              </div>
            </div>

            {isEditing ? (
              // Edit Mode Form
              <div className={styles.companyDetailsEdit}>
                <div className={styles.formGroup}>
                  <label>User Name:</label>
                  <input 
                    type="text" 
                    name="userName" 
                    value={editFormData.userName} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Password:</label>
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="Enter new password or leave blank" 
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Company Name:</label>
                  <input 
                    type="text" 
                    name="companyName" 
                    value={editFormData.companyName} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Registration ID:</label>
                  <input 
                    type="text" 
                    name="registrationId" 
                    value={editFormData.registrationId} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Email:</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={editFormData.email} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Phone:</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={editFormData.phone} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Address:</label>
                  <textarea 
                    name="address" 
                    value={editFormData.address} 
                    onChange={handleInputChange} 
                    rows="3"
                  ></textarea>
                </div>

                <div className={styles.formGroup}>
                  <label>Website:</label>
                  <input 
                    type="url" 
                    name="website" 
                    value={editFormData.website} 
                    onChange={handleInputChange} 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Industry Type:</label>
                  <input 
                    type="text" 
                    name="industryType" 
                    value={editFormData.industryType} 
                    onChange={handleInputChange} 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Company Size:</label>
                  <select 
                    name="companySize" 
                    value={editFormData.companySize} 
                    onChange={handleInputChange}
                  >
                    <option value="1-10 employees">1-10 employees</option>
                    <option value="11-50 employees">11-50 employees</option>
                    <option value="50-100 employees">50-100 employees</option>
                    <option value="101-500 employees">101-500 employees</option>
                    <option value="501-1000 employees">501-1000 employees</option>
                    <option value="1000+ employees">1000+ employees</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Founded Year:</label>
                  <input 
                    type="text" 
                    name="foundedYear" 
                    value={editFormData.foundedYear} 
                    onChange={handleInputChange} 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Company Description:</label>
                  <textarea 
                    name="companyDescription" 
                    value={editFormData.companyDescription} 
                    onChange={handleInputChange} 
                    rows="5"
                  ></textarea>
                </div>
              </div>
            ) : (
              // View Mode
              <div className={styles.companyDetails}>
                <div className={styles.companyInfoItem}>
                  <h3>User Name:</h3>
                  <p>{companyData.userName}</p>
                </div>
                
                <div className={styles.companyInfoItem}>
                  <h3>Password:</h3>
                  <p>{companyData.password}</p>
                </div>
                
                <div className={styles.companyInfoItem}>
                  <h3>Company Name:</h3>
                  <p>{companyData.companyName}</p>
                </div>
                
                <div className={styles.companyInfoItem}>
                  <h3>Registration ID:</h3>
                  <p>{companyData.registrationId}</p>
                </div>
                
                <div className={styles.companyInfoItem}>
                  <h3>Email:</h3>
                  <p>{companyData.email}</p>
                </div>
                
                <div className={styles.companyInfoItem}>
                  <h3>Phone:</h3>
                  <p>{companyData.phone}</p>
                </div>
                
                <div className={styles.companyInfoItem}>
                  <h3>Address:</h3>
                  <p className={styles.address}>{companyData.address}</p>
                </div>

                <div className={styles.companyInfoItem}>
                  <h3>Website:</h3>
                  <p>
                    <a href={`https://${companyData.website}`} target="_blank" rel="noopener noreferrer">
                      {companyData.website}
                    </a>
                  </p>
                </div>

                <div className={styles.companyInfoItem}>
                  <h3>Industry:</h3>
                  <p>{companyData.industryType}</p>
                </div>

                <div className={styles.companyInfoItem}>
                  <h3>Company Size:</h3>
                  <p>{companyData.companySize}</p>
                </div>

                <div className={styles.companyInfoItem}>
                  <h3>Founded:</h3>
                  <p>{companyData.foundedYear}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.companyAbout}>
          <div className={styles.sectionHeader}>
            <h2>About {companyData.companyName}</h2>
          </div>
          <div className={styles.sectionContent}>
            <p>{companyData.companyDescription}</p>
          </div>
        </div>
        
        <div className={styles.companySections}>
          
          <div className={styles.companySection}>
            <h2>Company Media</h2>
            <div className={`${styles.sectionContent} ${styles.emptySection}`}>
              <p>Add photos, videos, or presentations to showcase your company</p>
              <button className={styles.addButton}>+ Add Media</button>
            </div>
          </div>
          
          <div className={styles.companySection}>
            <h2>Company Benefits</h2>
            <div className={`${styles.sectionContent} ${styles.emptySection}`}>
              <p>List benefits that make your company a great place to work</p>
              <button className={styles.addButton}>+ Add Benefits</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.employerSidebar}>
        <div className={styles.sidebarSection}>
          <h3>Profile Completion</h3>
          <div className={styles.progressBar}>
            <div className={styles.progress} style={{width: '45%'}}></div>
          </div>
          <p>45% Complete</p>
          <button className={styles.completeProfileBtn}>Complete Your Profile</button>
        </div>
        
        <div className={styles.sidebarSection}>
          <h3>Recruiting Activity</h3>
          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>3</span>
              <span className={styles.statLabel}>Active Job Posts</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>20</span>
              <span className={styles.statLabel}>Total Applicants</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>5</span>
              <span className={styles.statLabel}>Interviews Scheduled</span>
            </div>
          </div>
        </div>
        
        <div className={styles.sidebarSection}>
          <h3>Recommended Candidates</h3>
          <ul className={styles.candidateList}>
            <li>
              <Link to="/candidates/1">Ahmad Ismail - Environmental Specialist</Link>
            </li>
            <li>
              <Link to="/candidates/2">Sarah Tan - Sustainability Manager</Link>
            </li>
            <li>
              <Link to="/candidates/3">Raj Kumar - Waste Management Engineer</Link>
            </li>
          </ul>
          <button className={styles.viewMoreBtn}>View All Candidates</button>
        </div>
        
        <div className={styles.sidebarSection}>
          <h3>Account Manager</h3>
          <div className={styles.accountManager}>
            <div className={styles.managerPhoto}>
              <img src="/api/placeholder/50/50" alt="Account Manager" />
            </div>
            <div className={styles.managerInfo}>
              <p className={styles.managerName}>Nurul Hakimi</p>
              <p className={styles.managerTitle}>JobPulse Support</p>
              <button className={styles.contactBtn}>Contact Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;