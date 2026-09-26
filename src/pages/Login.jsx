import { Rocket, ArrowRight } from 'lucide-react';

export default function Login({ onLogin }) {
  return (
    <div className="login-page">
      <div className="login-bg-glow login-bg-glow-1" />
      <div className="login-bg-glow login-bg-glow-2" />

      <div className="login-card">
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
          <div className="sidebar-logo-icon" style={{ width: 44, height: 44 }}>
            <Rocket size={22} color="white" />
          </div>
        </div>

        <h1 className="login-title">
          Release<span style={{ color: 'var(--accent-primary)' }}>Captain</span>
        </h1>
        <p className="login-subtitle">AI-powered release engineering platform</p>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" defaultValue="pavan@acmecorp.io" />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" defaultValue="••••••••" />
        </div>

        <button
          className="btn btn-primary btn-lg"
          style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
          onClick={onLogin}
        >
          Sign In <ArrowRight size={16} />
        </button>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-muted)' }}>
          Secured with JWT · Role-based access control
        </p>
      </div>
    </div>
  );
}
