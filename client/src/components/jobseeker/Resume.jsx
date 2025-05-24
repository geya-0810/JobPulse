import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom'; //import { useNavigate } from 'react-router-dom';
import styles from './Resume.module.css';

const Resume = () => {
  const [resumeHistory, setResumeHistory] = useState([
    // Example resume history data
    // { id: 1, fileName: 'My_Resume_2023.pdf', uploadTime: '2023-05-10 14:30' },
    // { id: 2, fileName: 'Software_Engineer_Resume.docx', uploadTime: '2023-04-22 09:15' },
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
    }
  };

  const uploadFiles = (files) => {
    // Validate file type
    const file = files[0];
    const fileType = file.name.split('.').pop().toLowerCase();
    
    if (!['docx', 'pdf'].includes(fileType)) {
      alert('Only .docx and .pdf files are supported');
      return;
    }

    // Validate file size (15MB limit)
    if (file.size > 15 * 1024 * 1024) {
      alert('File size cannot exceed 15MB');
      return;
    }

    // In a real application, you would upload the file to the server here
    // For this example, we'll just add it to the resume history
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setResumeHistory([
      ...resumeHistory,
      {
        id: Date.now(),
        fileName: file.name,
        uploadTime: formattedDate
      }
    ]);

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreateNewResume = () => {
    // Navigate to the create resume page
    navigate('/create-resume');
  };

  const handleViewResume = (id) => {
    // Navigate to view resume page with the specific ID
    navigate(`/view-resume/${id}`);
  };

  const handleDeleteResume = (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      setResumeHistory(resumeHistory.filter(resume => resume.id !== id));
    }
  };

  return (
    <div className={styles.resumeContainer}>
      <div 
        className={`${styles.dropArea} ${isDragging ? styles.dragging : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <p className={styles.dropText}>
          Drag and Drop your Resume File here to upload it to JobPulse
        </p>
        <div className={styles.uploadIcon}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="19.5" stroke="#888888" />
            <path d="M20 10V30" stroke="#888888" strokeWidth="2" />
            <path d="M10 20H30" stroke="#888888" strokeWidth="2" />
          </svg>
        </div>
        <p className={styles.fileInfo}>
          Only supported File Types: .docx, .pdf
          <br />
          And File Size no larger than 15MB
        </p>
        <input
          type="file"
          ref={fileInputRef}
          className={styles.fileInput}
          onChange={handleFileSelect}
          accept=".docx,.pdf"
        />
      </div>

      <div className={styles.resumeActions}>
        <Link to="/newResumes">
        <button 
          className={styles.createResumeBtn}
          onClick={handleCreateNewResume}
        >
          Create new Resume
        </button>
        </Link>
      </div>

      <h2 className={styles.historyTitle}>History</h2>
      
      <div className={styles.tableContainer}>
        <table className={styles.resumeTable}>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Upload Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resumeHistory.length > 0 ? (
              resumeHistory.map((resume) => (
                <tr key={resume.id}>
                  <td>{resume.fileName}</td>
                  <td>{resume.uploadTime}</td>
                  <td className={styles.actionButtons}>
                    <button 
                      className={styles.viewBtn}
                      onClick={() => handleViewResume(resume.id)}
                    >
                      View
                    </button>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteResume(resume.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className={styles.noRecords}>No resume records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Resume;