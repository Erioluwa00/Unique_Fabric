import React from 'react';
import ReactDOM from 'react-dom/client';

const NotFoundPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.code}>404</h1>
      <h2 style={styles.message}>Page Not Found</h2>
      <p style={styles.description}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <a href="/" style={styles.link}>Go to Homepage</a>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#0f2340',
    color: '#facc15',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Arial, sans-serif',
    padding: '2rem',
    textAlign: 'center'
  },
  code: {
    fontSize: '6rem',
    margin: 0
  },
  message: {
    fontSize: '2rem',
    margin: '1rem 0'
  },
  description: {
    fontSize: '1rem',
    maxWidth: '500px',
    marginBottom: '2rem'
  },
  link: {
    color: '#facc15',
    textDecoration: 'underline',
    fontSize: '1rem'
  }
};

// Root render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<NotFoundPage />);


export default NotFoundPage