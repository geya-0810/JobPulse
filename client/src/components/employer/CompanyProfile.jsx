import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getCompanyProfile, updateCompanyProfile, uploadProfileImage, uploadCoverImage } from "../../services/EmployerService";
import styles from "./CompanyProfile.module.css";

const CompanyProfile = () => {
  const {userType } = useContext(AuthContext);
  const [companyData, setCompanyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [error, setError] = useState("");
  const profileImageRef = useRef(null);
  const coverImageRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);

  // 获取企业资料
  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const data = await getCompanyProfile();
        if (isMounted) {
          setCompanyData(data);
          setEditFormData({ ...data });
        }
      } catch (error) {
        if (isMounted) setError("Failed to load company profile");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (userType === "employer") {
      fetchProfile();
    }

    return () => {isMounted = false;}; // 组件卸载时取消
  }, [userType]);
  // useEffect(() => {
  //   console.log("Fetching profile...", { token, userType, userId });
  //   const fetchProfile = async () => {
  //     try {
  //       console.log("Calling getCompanyProfile");
  //       const data = await getCompanyProfile(token);
  //       console.log("Profile data received:", data);
  //       setCompanyData(data);
  //       setEditFormData({ ...data });
  //     } catch (error) {
  //       console.error('Failed to load company profile:', error);
  //       setError('Failed to load company profile');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   if (token && userType === 'employer' && userId) {
  //     fetchProfile();
  //   }
  // }, [token, userType, userId]);

  // 处理图片上传
  const handleProfileImageClick = () => {
    profileImageRef.current.click();
  };

  // 替换 handleProfileImageChange 函数
  // const handleProfileImageChange = async (e) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const formData = new FormData();
  //     formData.append("profileImage", e.target.files[0]);

  //     try {
  //       const response = await axios.post(
  //         "/api/upload", // 使用上传API
  //         formData,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       // 更新状态
  //       setEditFormData({
  //         ...editFormData,
  //         profile_image: response.data.profileImage.url,
  //       });
  //     } catch (error) {
  //       console.error("Upload failed:", error);
  //       setError("Failed to upload profile image");
  //     }
  //   }
  // };

  const handleCoverImageClick = () => {
    coverImageRef.current.click();
  };

  // 添加封面图片处理
  // const handleCoverImageChange = async (e) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const formData = new FormData();
  //     formData.append("coverImage", e.target.files[0]);

  //     try {
  //       const response = await axios.post("/api/upload", formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       setEditFormData({
  //         ...editFormData,
  //         cover_image: response.data.coverImage.url,
  //       });
  //     } catch (error) {
  //       console.error("Upload failed:", error);
  //       setError("Failed to upload cover image");
  //     }
  //   }
  // };

  const handleProfileImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const response = await uploadProfileImage(e.target.files[0]);
        setEditFormData({
          ...editFormData,
          profile_image: response.profileImage.url,
        });
      } catch (error) {
        console.error("Upload failed:", error);
        setError("Failed to upload profile image");
      }
    }
  };

  const handleCoverImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const response = await uploadCoverImage(e.target.files[0]);
        setEditFormData({
          ...editFormData,
          cover_image: response.coverImage.url,
        });
      } catch (error) {
        console.error("Upload failed:", error);
        setError("Failed to upload cover image");
      }
    }
  };

  // 处理表单输入
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value || null,
    });
  };

  // 切换编辑模式
  // const toggleEditMode = async () => {
  //   if (isEditing) {
  //     try {
  //       // 准备发送的数据
  //       const dataToSend = {
  //         company_name: editFormData.company_name,
  //         registration_id: editFormData.registration_id,
  //         email: editFormData.email,
  //         phone: editFormData.phone,
  //         address: editFormData.address,
  //         website: editFormData.website,
  //         industry_type: editFormData.industry_type,
  //         company_size: editFormData.company_size,
  //         founded_year: editFormData.founded_year,
  //         company_description: editFormData.company_description,
  //         password: editFormData.password, // 密码单独处理
  //       };

  //       await updateCompanyProfile(dataToSend);

  //       // 刷新数据
  //       const updatedData = await getCompanyProfile();
  //       setCompanyData(updatedData);
  //       setError("");
  //     } catch (error) {
  //       console.error("Update failed:", error);
  //       setError("Failed to update profile. Please try again.");
  //       return; // 保持编辑模式
  //     }
  //   } else {
  //     // 进入编辑模式，初始化表单数据
  //     setEditFormData({ ...companyData, password: "" }); // 重置密码字段
  //   }

  //   setIsEditing(!isEditing);
  // };

  const toggleEditMode = async () => {
    if (isEditing) {
      try {
        setIsSaving(true);
        // 准备发送的数据 - 添加图片URL
        const dataToSend = {
          company_name: editFormData.company_name,
          registration_id: editFormData.registration_id,
          email: editFormData.email,
          phone: editFormData.phone,
          address: editFormData.address,
          website: editFormData.website,
          industry_type: editFormData.industry_type,
          company_size: editFormData.company_size,
          founded_year: editFormData.founded_year,
          company_description: editFormData.company_description,
          password: editFormData.password,
          profile_image: editFormData.profile_image,
          cover_image: editFormData.cover_image
        };

        await updateCompanyProfile(dataToSend);

        // 刷新数据
        const updatedData = await getCompanyProfile();
        setCompanyData(updatedData);
        setEditFormData({ ...updatedData }); // 确保更新编辑表单数据
        setError("");
      } catch (error) {
        console.error("Update failed:", error);
        setError("Failed to update profile. Please try again.");
        return; // 保持编辑模式
      } finally {
        setIsSaving(false); // 结束保存
      }
    } else {
      // 进入编辑模式，初始化表单数据
      setEditFormData({ ...companyData, password: "" }); // 重置密码字段
    }

    setIsEditing(!isEditing);
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <span className={styles.spinner}></span>
        {/* <p>Loading company profile...</p> */}
      </div>
    );
  }

  if (error) {
    return <div className={styles.errorContainer}>{error}</div>;
  }

  if (!companyData) {
    return (
      <div className={styles.errorContainer}>Company profile not found</div>
    );
  }

  return (
    <div className={styles.employerContainer}>
      <div className={styles.employerMain}>
        <div className={styles.employerHeader}>
          {/* 封面照片区域 - 已正确使用 handleCoverImageClick */}
          <div
            className={styles.coverPhoto}
            onClick={isEditing ? handleCoverImageClick : undefined}
            style={{
              cursor: isEditing ? "pointer" : "default",
              backgroundImage: `url(${
                isEditing && editFormData.cover_image
                  ? editFormData.cover_image
                  : companyData.cover_image
              })`,
            }}
          >
            {isEditing && !editFormData.cover_image && (
              <div className={styles.uploadCoverPrompt}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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
              style={{ display: "none" }}
            />
          </div>

          {/* 公司卡片 */}
          <div className={styles.companyCard}>
            <div className={styles.companyBasicInfo}>
              <div
                className={styles.companyLogo}
                onClick={isEditing ? handleProfileImageClick : undefined}
                style={{ cursor: isEditing ? "pointer" : "default" }}
              >
                {isEditing && editFormData.profile_image ? (
                  <img src={editFormData.profile_image} alt="Company Logo" />
                ) : companyData.profile_image ? (
                  <img src={companyData.profile_image} alt="Company Logo" />
                ) : (
                  <div className={styles.logoPlaceholder}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
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
                  style={{ display: "none" }}
                />
              </div>

              <div className={styles.companyIdSection}>
                <h2>
                  User ID: <span>{companyData.user_id}</span>
                </h2>
                <div className={styles.actionButtons}>
                  <button
                    onClick={toggleEditMode}
                    className={styles.editButton}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <span className={styles.spinner}></span> // 添加旋转加载图标
                    ) : isEditing ? ("Save") : ("Edit")
                    }
                    {/* {isEditing ? "Save" : "Edit"} */}
                  </button>
                  <button className={styles.certButton}>
                    Apply Certification
                  </button>
                </div>
              </div>
            </div>

            {isEditing ? (
              // 编辑模式表单
              <div className={styles.companyDetailsEdit}>
                <div className={styles.formGroup}>
                  <label>Company Name:</label>
                  <input
                    type="text"
                    name="company_name"
                    value={editFormData.company_name || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Registration ID:</label>
                  <input
                    type="text"
                    name="registration_id"
                    value={editFormData.registration_id || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email || ""}
                    onChange={handleInputChange}
                    disabled // 邮箱不可编辑
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Phone:</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editFormData.phone || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Address:</label>
                  <textarea
                    name="address"
                    value={editFormData.address || ""}
                    onChange={handleInputChange}
                    rows="3"
                    cols="50"
                  ></textarea>
                </div>

                <div className={styles.formGroup}>
                  <label>Website:</label>
                  <input
                    type="url"
                    name="website"
                    value={editFormData.website || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Industry Type:</label>
                  <input
                    type="text"
                    name="industry_type"
                    value={editFormData.industry_type || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Company Size:</label>
                  <select
                    name="company_size"
                    value={editFormData.company_size || ""}
                    onChange={handleInputChange}
                  >
                    <option value="1-10 employees">1-10 employees</option>
                    <option value="11-50 employees">11-50 employees</option>
                    <option value="50-100 employees">50-100 employees</option>
                    <option value="101-500 employees">101-500 employees</option>
                    <option value="501-1000 employees">
                      501-1000 employees
                    </option>
                    <option value="1000+ employees">1000+ employees</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Founded Year:</label>
                  <input
                    type="text"
                    name="founded_year"
                    value={editFormData.founded_year || ""}
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
                  <label>Company Description:</label>
                  <textarea
                    name="company_description"
                    value={editFormData.company_description || ""}
                    onChange={handleInputChange}
                    rows="5"
                  ></textarea>
                </div>

                {error && <div className={styles.formError}>{error}</div>}
              </div>
            ) : (
              // 查看模式
              <div className={styles.companyDetails}>
                <div className={styles.companyInfoItem}>
                  <h3>Company Name:</h3>
                  <p>{companyData.company_name}</p>
                </div>

                <div className={styles.companyInfoItem}>
                  <h3>Registration ID:</h3>
                  <p>{companyData.registration_id || ""}</p>
                </div>

                <div className={styles.companyInfoItem}>
                  <h3>Email:</h3>
                  <p>{companyData.email}</p>
                </div>

                <div className={styles.companyInfoItem}>
                  <h3>Phone:</h3>
                  <p>{companyData.phone || ""}</p>
                </div>

                <div className={styles.companyInfoItem}>
                  <h3>Address:</h3>
                  <p className={styles.address}>{companyData.address || ""}</p>
                </div>

                <div className={styles.companyInfoItem}>
                  <h3>Website:</h3>
                  <p>
                    {companyData.website && (
                      <a
                        href={`https://${companyData.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {companyData.website}
                      </a>
                    )}
                  </p>
                </div>

                <div className={styles.companyInfoItem}>
                  <h3>Industry:</h3>
                  <p>{companyData.industry_type || ""}</p>
                </div>

                <div className={styles.companyInfoItem}>
                  <h3>Company Size:</h3>
                  <p>{companyData.company_size || ""}</p>
                </div>

                <div className={styles.companyInfoItem}>
                  <h3>Founded:</h3>
                  <p>{companyData.founded_year || ""}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 公司描述 */}
        <div className={styles.companyAbout}>
          <div className={styles.sectionHeader}>
            <h2>About {companyData.company_name}</h2>
          </div>
          <div className={styles.sectionContent}>
            <p>{companyData.company_description || ""}</p>
          </div>
        </div>

        <div className={styles.companySections}>
          <div className={styles.companySection}>
            <h2>Company Media</h2>
            <div className={`${styles.sectionContent} ${styles.emptySection}`}>
              <p>
                Add photos, videos, or presentations to showcase your company
              </p>
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
            <div className={styles.progress} style={{ width: "45%" }}></div>
          </div>
          <p>45% Complete</p>
          <button className={styles.completeProfileBtn}>
            Complete Your Profile
          </button>
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
              <Link to="/candidates/1">
                Ahmad Ismail - Environmental Specialist
              </Link>
            </li>
            <li>
              <Link to="/candidates/2">Sarah Tan - Sustainability Manager</Link>
            </li>
            <li>
              <Link to="/candidates/3">
                Raj Kumar - Waste Management Engineer
              </Link>
            </li>
          </ul>
          <button className={styles.viewMoreBtn}>View All Candidates</button>
        </div>

        <div className={styles.sidebarSection}>
          <h3>Account Manager</h3>
          <div className={styles.accountManager}>
            <div className={styles.managerPhoto}>
              <img src="" alt="Account Manager" />
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
