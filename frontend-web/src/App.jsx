import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

const NotificationToast = () => {
  const { notification } = useApp();
  
  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle size={18} color="var(--color-success)" />;
      case 'warning':
      case 'danger':
        return <AlertCircle size={18} color="var(--color-danger)" />;
      default:
        return <Info size={18} color="var(--accent-secondary)" />;
    }
  };

  return (
    <div 
      style={{
        ...styles.toast,
        borderColor: notification.type === 'danger' ? 'rgba(239, 68, 68, 0.3)' : 'var(--glass-border)'
      }}
      className="glass-card animate-slide-in"
    >
      {getIcon()}
      <span style={styles.toastText}>{notification.message}</span>
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated, loading } = useApp();

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loaderText}>Chargement du Cloud DevOps...</p>
      </div>
    );
  }

  return (
    <>
      <NotificationToast />
      {isAuthenticated ? <Dashboard /> : <Login />}
    </>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

const styles = {
  loaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    gap: '1.5rem',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '3px solid rgba(255, 255, 255, 0.05)',
    borderTop: '3px solid var(--accent-primary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loaderText: {
    fontFamily: 'var(--font-display)',
    fontWeight: '500',
    color: 'var(--text-secondary)',
    fontSize: '1rem',
  },
  toast: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 1.5rem',
    maxWidth: '400px',
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid',
    animation: 'slideIn 0.3s ease-out',
  },
  toastText: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
};

// Injection des animations de base CSS en direct pour compatibilité
const styleSheet = document.styleSheets[0];
if (styleSheet) {
  try {
    styleSheet.insertRule(`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `, styleSheet.cssRules.length);

    styleSheet.insertRule(`
      @keyframes slideIn {
        from {
          transform: translateY(-20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `, styleSheet.cssRules.length);
  } catch (e) {
    console.warn('Erreur lors de l\'injection dynamique CSS d\'animation :', e);
  }
}

export default App;
