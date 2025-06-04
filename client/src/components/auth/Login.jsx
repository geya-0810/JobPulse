// components/auth/Login.jsx
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from './../../context/AuthContext.js';
import styles from "./auth.module.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [userType, setUserType] = useState("jobseeker");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role: userType, // 添加用户类型
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // 保存token并跳转
        login(data.token, data.user_type);  // 替换原来的localStorage.setItem
        navigate(`/`);
      } else {throw new Error(data.error || "Login failed");}
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>LOGIN</h2>
      <div className={styles.toggleButtons}>
        <button
          className={userType === "jobseeker" ? styles.active : ""}
          onClick={() => setUserType("jobseeker")}
        >
          Job Seeker
        </button>
        <button
          className={userType === "employer" ? styles.active : ""}
          onClick={() => setUserType("employer")}
        >
          Employer
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <div className={styles.error}>{error}</div>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="EMAIL"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="PASSWORD"
          required
        />
        <button type="submit" className={styles.loginBtn}>
          Login
        </button>
      </form>

      <div className={styles.authLinks}>
        <div>
          <Link to="/forgot-password">FORGOT PASSWORD?</Link>
        </div>
        <div>
          <span>
            NO ACCOUNT? <Link to="/signup">SIGN UP NOW</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
