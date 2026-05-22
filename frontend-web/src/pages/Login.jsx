import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Mail, User, LogIn, CheckCircle } from 'lucide-react';

const Login = () => {
  const { login, signup } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error);
      }
    } else {
      const result = await signup(email, password, name);
      if (!result.success) {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      {/* Background blobs for premium depth */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      <div style={styles.card} className="glass-card">
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <CheckCircle size={36} color="var(--accent-primary)" />
          </div>
          <h1 style={styles.title} className="gradient-text">
            {isLogin ? 'DevOps TaskManager' : 'Créer un Compte'}
          </h1>
          <p style={styles.subtitle}>
            {isLogin 
              ? 'Connectez-vous pour piloter vos tâches et vos sprints.' 
              : 'Rejoignez la plateforme collaborative DevOps.'}
          </p>
        </div>

        {error && (
          <div style={styles.errorAlert}>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <div className="form-group" style={styles.inputWrapper}>
              <label className="form-label" htmlFor="name">Nom Complet</label>
              <div style={styles.inputIconContainer}>
                <User size={18} style={styles.inputIcon} />
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="form-input"
                  style={styles.inputWithIcon}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="form-group" style={styles.inputWrapper}>
            <label className="form-label" htmlFor="email">Adresse E-mail</label>
            <div style={styles.inputIconContainer}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                id="email"
                type="email"
                placeholder="devops@enterprise.com"
                className="form-input"
                style={styles.inputWithIcon}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={styles.inputWrapper}>
            <label className="form-label" htmlFor="password">Mot de passe</label>
            <div style={styles.inputIconContainer}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                id="password"
                type="password"
                placeholder="••••••••••••"
                className="form-input"
                style={styles.inputWithIcon}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Traitement en cours...' : (
              <>
                <span>{isLogin ? 'Se connecter' : 'Créer mon compte'}</span>
                <LogIn size={18} />
              </>
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            {isLogin ? "Nouveau sur la plateforme ?" : "Vous avez déjà un compte ?"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              style={styles.switchBtn}
            >
              {isLogin ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Premium inline styles with clean variables
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100%',
    padding: '1.5rem',
    position: 'relative',
    overflow: 'hidden',
  },
  blob1: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    background: 'rgba(99, 102, 241, 0.15)',
    filter: 'blur(80px)',
    borderRadius: '50%',
    top: '15%',
    left: '20%',
    zIndex: 0,
  },
  blob2: {
    position: 'absolute',
    width: '250px',
    height: '250px',
    background: 'rgba(6, 182, 212, 0.12)',
    filter: 'blur(60px)',
    borderRadius: '50%',
    bottom: '20%',
    right: '25%',
    zIndex: 0,
  },
  card: {
    width: '100%',
    maxWidth: '480px',
    padding: '3rem 2.5rem',
    zIndex: 1,
    position: 'relative',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  logoContainer: {
    width: '60px',
    height: '60px',
    borderRadius: '16px',
    background: 'rgba(99, 102, 241, 0.1)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.2rem auto',
    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.1)',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '2rem',
    fontWeight: '800',
    marginBottom: '0.5rem',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    lineHeight: '1.4',
  },
  form: {
    width: '100%',
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIconContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  inputWithIcon: {
    paddingLeft: '2.5rem',
  },
  submitBtn: {
    width: '100%',
    marginTop: '0.8rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
  },
  errorAlert: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    color: 'var(--color-danger)',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--border-radius-md)',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
    textAlign: 'center',
    fontWeight: '500',
  },
  footer: {
    textAlign: 'center',
    marginTop: '2rem',
  },
  footerText: {
    color: 'var(--text-muted)',
    fontSize: '0.88rem',
  },
  switchBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--accent-primary)',
    fontWeight: '600',
    marginLeft: '0.4rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    textDecoration: 'underline',
  },
};

export default Login;
