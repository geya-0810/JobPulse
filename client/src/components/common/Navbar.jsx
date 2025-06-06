// components/common/Navbar.jsx
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './../../context/AuthContext.js';
import styles from './Navbar.module.css';
import logo from './../../jobpulselogo.png';

const Navbar = () => {
  const { isLoggedIn, userType, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const userlogout = async () => {
    const isLoggedOutSuccessfully = await logout();
    if(isLoggedOutSuccessfully) {navigate('/login'); }// 只有当登出成功时才跳转
  };

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logo}>
      <Link to="/" >
        <img src={logo} alt="Logo" width="100" height="100" />
      </Link>
      <Link to="/" className={styles.logo}>
        <h1>JobPulse</h1>
      </Link>
      </div>

      <div className={styles.linkContainer}>
        <ul className={styles.navLinks}>
        <li><Link to="/">Home</Link></li>
        {isLoggedIn ? (
          <>
          {userType === 'employer' ? (
            <>
              <li><Link to="/post-recruitment">Post Recruitment</Link></li>
              {/* <div className={styles.dropdown}>
                <span>More ▾</span>
                <div className={styles.dropdownContent}> */}
              <li><Link to="/applications">Applications</Link></li>
              <li><Link to="/company-profile">Company Profile</Link></li>              
                {/* </div>
              </div> */}
            </>
          ) : (
            <>
              <li><Link to="/resumes">My Resumes</Link></li>
              <li><Link to="/apply-job">Apply Job</Link></li>
              {/* <div className={styles.dropdown}>
                <span>More ▾</span> 
                <div className={styles.dropdownContent}>*/}

              <li><Link to="/profile">Profile</Link></li>
              {/*  </div>
               </div> */}
            </>
          )}
          <li><button onClick={userlogout} className={styles.logoutButton}>Log Out</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Post Recruitment</Link></li>
            <li><Link to="/login">Apply Job</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </>          
        )}
        </ul>
      </div>

      {/* 搜索框 */}
      <div className={styles.searchBar}>
        <input type="text" placeholder="SEARCH" />
        <button>🔍</button>
      </div>
    </nav>
  );
};

export default Navbar;