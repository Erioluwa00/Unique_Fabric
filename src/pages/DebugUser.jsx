// components/UserDebug.jsx
import { useContext } from 'react';
// import { AuthContext } from '../../context/AuthContext';
import { AuthContext } from '../context/AuthContext';

const DebugUser = () => {
  const { user, getUserRole } = useContext(AuthContext);
  
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#333',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <strong>User Debug</strong>
      <pre style={{ margin: '5px 0', whiteSpace: 'pre-wrap' }}>
        {JSON.stringify({
          user: user ? {
            email: user.email,
            role: user.role,
            isAdmin: user.isAdmin
          } : 'No user',
          detectedRole: getUserRole(),
          hasToken: !!localStorage.getItem('fabricToken')
        }, null, 2)}
      </pre>
    </div>
  );
};

export default DebugUser