// src/components/jobseeker/Profile.jsx
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Profile.module.css'; // 修改了导入的模块名

const Profile = () => {
  // Mock user data - in real implementation, this would come from API/context
  const [userData, setUserData] = useState({
    userId: '5313',
    userName: 'DMBrown',
    password: '##########',
    fullName: 'David Michael Brown',
    ic: '160229-12-1234',
    email: 'david0720@gmail.com',
    phone: '012-345 6789',
    address: '********************************\n********************************\n**** **** ******************',
    profileImage: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({...userData});
  const fileInputRef = useRef(null);

  // Handle profile image upload
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserData({
          ...userData,
          profileImage: e.target.result
        });
        // 如果在编辑模式下更改图片，也更新 editFormData
        if (isEditing) {
          setEditFormData({
            ...editFormData,
            profileImage: e.target.result
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
      setUserData({...editFormData});
    } else {
      // Enter edit mode, ensure editFormData is fresh from userData
      setEditFormData({...userData});
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileMain}>
        <div className={styles.profileHeader}>
          <div className={styles.profileCoverPhoto}></div>
          
          <div className={styles.profileCard}>
            <div className={styles.profileBasicInfo}>
              <div className={styles.profilePhoto} onClick={handleImageClick}>
                {/* 在编辑模式下，也应显示 editFormData.profileImage 以实时预览 */}
                {(isEditing ? editFormData.profileImage : userData.profileImage) ? (
                  <img src={isEditing ? editFormData.profileImage : userData.profileImage} alt="Profile" />
                ) : (
                  <div className={styles.profilePhotoPlaceholder}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
              </div>
              
              <div className={styles.profileIdSection}>
                <h2>User ID: <span>{userData.userId}</span></h2>
                <button onClick={toggleEditMode} className={styles.editButton}>
                  {isEditing ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>

            {isEditing ? (
              // Edit Mode Form
              <div className={styles.profileDetailsEdit}>
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
                    // 通常密码字段在编辑时不直接显示旧密码
                    // value={editFormData.password === '##########' ? '' : editFormData.password}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Full Name:</label>
                  <input 
                    type="text" 
                    name="fullName" 
                    value={editFormData.fullName} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>IC:</label>
                  <input 
                    type="text" 
                    name="ic" 
                    value={editFormData.ic} 
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
              </div>
            ) : (
              // View Mode
              <div className={styles.profileDetails}>
                <div className={styles.profileInfoItem}>
                  <h3>User Name:</h3>
                  <p>{userData.userName}</p>
                </div>
                
                <div className={styles.profileInfoItem}>
                  <h3>Password:</h3>
                  <p>{userData.password}</p>
                </div>
                
                <div className={styles.profileInfoItem}>
                  <h3>Full Name:</h3>
                  <p>{userData.fullName}</p>
                </div>
                
                <div className={styles.profileInfoItem}>
                  <h3>IC:</h3>
                  <p>{userData.ic}</p>
                </div>
                
                <div className={styles.profileInfoItem}>
                  <h3>Email:</h3>
                  <p>{userData.email}</p>
                </div>
                
                <div className={styles.profileInfoItem}>
                  <h3>Phone:</h3>
                  <p>{userData.phone}</p>
                </div>
                
                <div className={styles.profileInfoItem}>
                  <h3>Address:</h3>
                  <p className={styles.address}>{userData.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.profileSections}>
          <div className={styles.profileSection}>
            <h2>Skills</h2>
            <div className={`${styles.sectionContent} ${styles.emptySection}`}>
              <p>Add your skills to help employers find you</p>
              <button className={styles.addButton}>+ Add Skills</button>
            </div>
          </div>
          
          <div className={styles.profileSection}>
            <h2>Experience</h2>
            <div className={`${styles.sectionContent} ${styles.emptySection}`}>
              <p>Add your work experience</p>
              <button className={styles.addButton}>+ Add Experience</button>
            </div>
          </div>
          
          <div className={styles.profileSection}>
            <h2>Education</h2>
            <div className={`${styles.sectionContent} ${styles.emptySection}`}>
              <p>Add your educational background</p>
              <button className={styles.addButton}>+ Add Education</button>
            </div>
          </div>
          
          <div className={styles.profileSection}>
            <h2>Certifications</h2>
            <div className={`${styles.sectionContent} ${styles.emptySection}`}>
              <p>Add your certifications and licenses</p>
              <button className={styles.addButton}>+ Add Certification</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.profileSidebar}>
        <div className={styles.sidebarSection}>
          <h3>Profile Completion</h3>
          <div className={styles.progressBar}>
            <div className={styles.progress} style={{width: '25%'}}></div>
          </div>
          <p>25% Complete</p>
          <button className={styles.completeProfileBtn}>Complete Your Profile</button>
        </div>
        
        <div className={styles.sidebarSection}>
          <h3>Suggested Jobs</h3>
          <ul className={styles.jobList}>
            <li><Link to="/jobs/1">Frontend Developer at TechCorp</Link></li>
            <li><Link to="/jobs/2">Web Designer at CreativeStudio</Link></li>
            <li><Link to="/jobs/3">UX Developer at StartupInc</Link></li>
          </ul>
          <button className={styles.viewMoreBtn}>View All Jobs</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;