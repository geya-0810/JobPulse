// components/common/Footer.jsx
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>

      <div className={styles.footerSection}>
        <h4>About Us</h4>
        <p>Connecting talents with opportunities</p>
      </div>
      <div className={styles.footerSection}>
        <h4>Our Sponsors</h4>
        <ul>
          <li>TechCorp</li>
          <li>GlobalRecruit</li>
        </ul>
      </div>
      <div className={styles.footerSection}>
        <h4>Customer Service</h4>
        <p>support@jobpulse.com</p>
      </div>

      {/* <div className={styles.bottomNavigation}>
        <div className={styles.navItem}>About Us</div>
        <div className={styles.navItem}>Our Sponsors</div>
        <div className={styles.navItem}>Customer Service</div>
      </div> */}
    </footer>
  );
};

export default Footer;