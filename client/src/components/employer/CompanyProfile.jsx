import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useApi } from "../../services/Api";
import {
  getCompanyProfile,
  updateCompanyProfile,
  uploadProfileImage,
  uploadCoverImage,
  createCompanyPost,
  getCompanyPosts,
} from "../../services/EmployerService";
import styles from "./CompanyProfile.module.css";

const CompanyProfile = () => {
  const { userType } = useContext(AuthContext);
  const api = useApi();
  const [companyData, setCompanyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [error, setError] = useState("");
  const profileImageRef = useRef(null);
  const coverImageRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "news_announcements",
    media: [],
  });
  const [postError, setPostError] = useState("");
  const fileInputRef = useRef(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [companyPosts, setCompanyPosts] = useState([]); // 存储公司帖子

  // 添加计算完成度的函数
  const calculateProfileCompletion = (data) => {
    // 定义需要检查的字段列表
    const requiredFields = [
      "company_name",
      "registration_id",
      "phone",
      "address",
      "website",
      "industry_type",
      "company_size",
      "founded_year",
      "company_description",
      "profile_image",
      "cover_image",
    ];

    let filledCount = 0;

    requiredFields.forEach((field) => {
      // 检查字段是否存在且不为空值
      if (data[field] && data[field] !== "" && data[field] !== null) {
        filledCount++;
      }
    });

    // 计算完成百分比（保留整数）
    return Math.round((filledCount / requiredFields.length) * 100);
  };

  // 获取企业资料
  useEffect(() => {
    let isMounted = true;
    const fetchProfileAndPosts = async () => {
      try {
        const profileData = await getCompanyProfile(api);
        const postsData = await getCompanyPosts(api); // 新增：获取公司帖子

        if (isMounted) {
          setCompanyData(profileData.data);
          setEditFormData({ ...profileData.data });
          setCompanyPosts(postsData.data); // 存储帖子数据

          const percentage = calculateProfileCompletion(profileData.data);
          setCompletionPercentage(percentage);
        }
      } catch (error) {
        if (isMounted) setError("Failed to load data");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (userType === "employer") {
      fetchProfileAndPosts();
    }

    return () => {
      isMounted = false;
    };
  }, [userType]);

  // 处理图片上传
  const handleProfileImageClick = () => {
    profileImageRef.current.click();
  };

  const handleCoverImageClick = () => {
    coverImageRef.current.click();
  };

  const handleProfileImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const response = await uploadProfileImage(api, e.target.files[0]);
        setEditFormData({
          ...editFormData,
          profile_image: response.data.profileImage.url,
        });
      } catch (error) {
        console.error("Upload failed:", error);
        setError("Failed to upload profile image");
      }
    }
  };

  // 添加封面图片处理
  const handleCoverImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const response = await uploadCoverImage(api, e.target.files[0]);
        setEditFormData({
          ...editFormData,
          cover_image: response.data.coverImage.url,
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
      [name]: value,
    });
  };

  // 切换编辑模式
  const toggleEditMode = async () => {
    if (isEditing) {
      try {
        setIsSaving(true);
        // 准备发送的数据 - 添加图片URL
        const dataToSend = {
          company_name: editFormData.company_name || "",
          registration_id: editFormData.registration_id || "",
          email: editFormData.email || "",
          phone: editFormData.phone || "",
          address: editFormData.address || "",
          website: editFormData.website || "",
          industry_type: editFormData.industry_type || "",
          company_size: editFormData.company_size || "",
          founded_year:
            editFormData.founded_year === ""
              ? null
              : editFormData.founded_year || "",
          company_description: editFormData.company_description || "",
          password: editFormData.password || "",
          profile_image: editFormData.profile_image || "",
          cover_image: editFormData.cover_image || "",
        };

        await updateCompanyProfile(api, dataToSend);

        // 刷新数据
        const updatedData = await getCompanyProfile(api);
        setCompanyData(updatedData.data);
        setEditFormData({ ...updatedData.data }); // 确保更新编辑表单数据

        const percentage = calculateProfileCompletion(updatedData.data);
        setCompletionPercentage(percentage);
        // setCompletionPercentage(calculateProfileCompletion(updatedData)); // 与上面一样的，不同写法而已comment
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

  // if (!companyData) {
  //   return (
  //     <div className={styles.errorContainer}>Company profile not found</div>
  //   );
  // }

  // 加载状态
  if (isLoading || !companyData) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading company profile...<span className={styles.spinner}></span></p>
      </div>
    );
  }

  // 打开帖子模态框
  const openPostModal = () => {
    setShowPostModal(true);
    setNewPost({
      title: "",
      content: "",
      category: "news_announcements",
      media: [],
    });
  };

  // 处理帖子表单输入变化
  const handlePostInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({
      ...newPost,
      [name]: value,
    });
  };

  // 处理媒体文件选择
  const handleMediaChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setNewPost({
        ...newPost,
        media: [...newPost.media, ...files],
      });
    }
  };

  // 移除选中的媒体文件
  const removeMedia = (index) => {
    const updatedMedia = [...newPost.media];
    updatedMedia.splice(index, 1);
    setNewPost({
      ...newPost,
      media: updatedMedia,
    });
  };

  // 发布新帖子
  const publishPost = async () => {
    if (!newPost.title.trim()) {
      setPostError("Post title is required");
      return;
    }

    try {
      const response = await createCompanyPost(
        api,
        {
          title: newPost.title,
          content: newPost.content || "",
          category: newPost.category, // 改为category
        },
        newPost.media
      );

      if (response.success) {
        setShowPostModal(false);
        // 刷新帖子列表
        const postsData = await getCompanyPosts(api);
        setCompanyPosts(postsData.data);
        setPostError("");
      } else {
        setPostError(
          "Publish failed: " + (response.message || "Unknown error")
        );
      }
    } catch (error) {
      setPostError(
        "Publish failed: " + (error.response?.data?.message || "Network error")
      );
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case "news_announcements":
        return "News & Announcements";
      case "company_culture":
        return "Company Culture";
      case "product_updates":
        return "Product Updates";
      case "industry_insights":
        return "Industry Insights";
      case "other":
        return "Other";
      default:
        return category;
    }
  };

  if (error) {
    return <div className={styles.errorContainer}>{error}</div>;
  }

  return (
    <div>
      <div className={styles.employerContainer}>
        <div className={styles.employerMain}>
          <div className={styles.employerHeader}>
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
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
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
                      ) : isEditing ? ("Save") : ("Edit")}
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
                      <option value="">Select a Company Size</option>
                      <option value="1-10 employees">1-10 employees</option>
                      <option value="11-50 employees">11-50 employees</option>
                      <option value="50-100 employees">50-100 employees</option>
                      <option value="101-500 employees">
                        101-500 employees
                      </option>
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
                    <p className={styles.address}>
                      {companyData.address || ""}
                    </p>
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

          <div className={styles.companySections}>
            <div className={styles.companyAbout}>
              <div className={styles.sectionHeader}>
                <h2>About {companyData.company_name}</h2>
              </div>
              <div className={`${styles.sectionContent} ${styles.emptySection}`}>
                <p>{companyData.company_description || ""}</p>
              </div>
            </div>

            {/*<div className={styles.companySection}>
            <h2>Company Benefits</h2>
            <div className={`${styles.sectionContent} ${styles.emptySection}`}>
              <p>List benefits that make your company a great place to work</p>
              <button className={styles.addButton}>+ Add Benefits</button>
            </div>
            </div> */}
          </div>
        </div>

        <div className={styles.employerSidebar}>
          <div className={styles.companySection}>
            <h2>Company Posts</h2>
            <div
              className={styles.sectionContent}
            >
              <p>
                Share company updates, such as party photos, award
                information, investment opportunities, etc.
              </p>
              <button className={styles.addButton} onClick={openPostModal}>
                + Create A New Posts
              </button>
            </div>
          </div>
          <div className={styles.sidebarSection}>
            <h3>Profile Completion</h3>
            <div className={styles.progressBar}>
              <div
                className={styles.progress}
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <p>{completionPercentage}% Complete</p>
            <button
              className={styles.completeProfileBtn}
              onClick={toggleEditMode} // 点击后进入编辑模式
            >
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

          {/* <div className={styles.sidebarSection}>
            <h3>Recommended Candidates</h3>
            <ul className={styles.candidateList}>
              <li>
                <Link to="/candidates/1">
                  Ahmad Ismail - Environmental Specialist
                </Link>
              </li>
              <li>
                <Link to="/candidates/2">
                  Sarah Tan - Sustainability Manager
                </Link>
              </li>
              <li>
                <Link to="/candidates/3">
                  Raj Kumar - Waste Management Engineer
                </Link>
              </li>
            </ul>
            <button className={styles.viewMoreBtn}>View All Candidates</button>
          </div> */}

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
        {showPostModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.postModal}>
              <div className={styles.modalHeader}>
                <h2>Create New Post</h2>
                <button
                  className={styles.closeButton}
                  onClick={() => setShowPostModal(false)}
                >
                  &times;
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Post Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={newPost.title}
                    onChange={handlePostInputChange}
                    placeholder="Enter title"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Content</label>
                  <textarea
                    name="content"
                    value={newPost.content}
                    onChange={handlePostInputChange}
                    rows="4"
                    placeholder="Share your thoughts..."
                  ></textarea>
                </div>

                <div className={styles.formGroup}>
                  <label>Category</label>
                  <select
                    name="category"
                    value={newPost.category}
                    onChange={handlePostInputChange}
                  >
                    <option value="news_announcements">News & Announcements</option>
                    <option value="company_culture">Company Culture</option>
                    <option value="product_updates">Product Updates</option>
                    <option value="industry_insights">Industry Insights</option>
                    <option value="other">Other</option>

                  </select>
                </div>

                <div className={styles.mediaSection}>
                  <label>Add Media Files</label>
                  <div className={styles.mediaUpload}>
                    <button
                      className={styles.uploadButton}
                      onClick={() => fileInputRef.current.click()}
                    >
                      Select Files
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleMediaChange}
                      multiple
                      style={{ display: "none" }}
                    />
                    <span className={styles.uploadHint}>
                      Supports images, videos, documents
                    </span>
                  </div>

                  {newPost.media.length > 0 && (
                    <div className={styles.selectedMedia}>
                      <h4>Selected Files:</h4>
                      <ul>
                        {newPost.media.map((file, index) => (
                          <li key={index}>
                            <span>{file.name}</span>
                            <button
                              className={styles.removeButton}
                              onClick={() => removeMedia(index)}
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {postError && <div className={styles.error}>{postError}</div>}
              </div>

              <div className={styles.modalFooter}>
                <button
                  className={styles.cancelButton}
                  onClick={() => setShowPostModal(false)}
                >
                  Cancel
                </button>
                <button className={styles.publishButton} onClick={publishPost}>
                  Publish
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.postsSection}>
        <div className={styles.companySection}>
          <div className={styles.sectionHeader}>
          <h2>Company Posts</h2>
          </div>
          <div className={styles.postsContainer}>
            {companyPosts.length > 0 ? (
              companyPosts.map((post) => (
                <div key={post.post_id} className={styles.postItem}>
                  <h3>{post.title}</h3>
                  <div className={styles.postMeta}>
                    <span className={styles.postCategory}>
                      {getCategoryLabel(post.category)}
                    </span>
                    <span className={styles.postDate}>
                      {new Date(post.posted_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p>{post.content}</p>

                  {post.media && post.media.length > 0 && (
                    <div className={styles.postMedia}>
                      {post.media.map((media) => (
                        <div key={media.media_id} className={styles.mediaItem}>
                          {media.media_type === "image" ? (
                            <img
                              src={media.url}
                              alt={media.description || "Post media"}
                            />
                          ) : media.media_type === "video" ? (
                            <video controls>
                              <source src={media.url} type="video/mp4" />
                            </video>
                          ) : (
                            <a
                              href={media.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {media.description || "View document"}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div
                className={`${styles.sectionContent} ${styles.emptySection}`}
              >
                <p>
                  No posts yet. Share company announcements, events, or
                  insights.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
