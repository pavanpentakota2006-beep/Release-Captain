import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, GitBranch, Package, Rocket, Globe, Cpu,
  BarChart2, Shield, CheckSquare, Activity, RotateCcw,
  FileBarChart, FolderOpen, Settings, Bell, Search,
  HelpCircle, Zap, ChevronDown, Star, X, LogOut
} from 'lucide-react';
import { currentUser } from './data/mockData.js';

// Pages
import Dashboard       from './pages/Dashboard.jsx';
import Pipelines       from './pages/Pipelines.jsx';
import PipelineDetail  from './pages/PipelineDetail.jsx';
import Releases        from './pages/Releases.jsx';
import Deployments     from './pages/Deployments.jsx';
import Environments    from './pages/Environments.jsx';
import AICommandCenter from './pages/AICommandCenter.jsx';
import RiskQuality     from './pages/RiskQuality.jsx';
import Security        from './pages/Security.jsx';
import Approvals       from './pages/Approvals.jsx';
import Monitoring      from './pages/Monitoring.jsx';
import Rollback        from './pages/Rollback.jsx';
import AuditLogs       from './pages/AuditLogs.jsx';
import Projects        from './pages/Projects.jsx';
import Login           from './pages/Login.jsx';
import SettingsPage    from './pages/SettingsPage.jsx';

// Components
import AICopilotDrawer from './components/AICopilotDrawer.jsx';

const navGroups = [
  { items: [
    { to: '/dashboard',   icon: LayoutDashboard, label: 'Overview'         },
    { to: '/pipelines',   icon: GitBranch,        label: 'Pipelines'       },
    { to: '/releases',    icon: Package,           label: 'Releases'        },
    { to: '/deployments', icon: Rocket,            label: 'Deployments'     },
    { to: '/environments',icon: Globe,             label: 'Environments'    },
  ]},
  { items: [
    { to: '/ai',          icon: Cpu,              label: 'AI Command Center' },
    { to: '/risk',        icon: BarChart2,         label: 'Risk & Quality'  },
    { to: '/security',    icon: Shield,            label: 'Security'        },
    { to: '/approvals',   icon: CheckSquare,       label: 'Approvals', badge: '3' },
    { to: '/monitoring',  icon: Activity,          label: 'Monitoring'      },
  ]},
  { items: [
    { to: '/rollback',    icon: RotateCcw,         label: 'Rollback'        },
    { to: '/audit',       icon: FileBarChart,      label: 'Reports'         },
    { to: '/projects',    icon: FolderOpen,        label: 'Projects'        },
    { to: '/settings',    icon: Settings,          label: 'Settings'        },
  ]},
];

function Sidebar({ onOpenCopilot, onLogout }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Rocket size={16} color="white" />
        </div>
        <div className="sidebar-logo-text">
          <div className="sidebar-logo-name">Release Captain</div>
          <div className="sidebar-logo-sub">AI-Powered Release Engineering</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navGroups.map((group, gi) => (
          <div key={gi} style={{ marginBottom: gi < navGroups.length - 1 ? 12 : 0 }}>
            {group.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon size={15} />
                {item.label}
                {item.badge && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </NavLink>
            ))}
            {gi < navGroups.length - 1 && (
              <div style={{ height: 1, background: 'var(--sidebar-border)', margin: '8px 4px' }} />
            )}
          </div>
        ))}
      </nav>

      {/* AI Copilot Widget */}
      <div className="sidebar-copilot">
        <div className="copilot-status">
          <div className="copilot-dot" />
          <span className="copilot-label">AI Copilot</span>
          <span style={{ marginLeft: 'auto' }} className="copilot-online">ONLINE</span>
        </div>
        <p className="copilot-desc">
          Ask me anything about your releases, deployments, failures...
        </p>
        <button className="copilot-btn" onClick={onOpenCopilot}>
          <Star size={12} /> Open Copilot
        </button>
      </div>

      {/* Sign Out Button in Sidebar */}
      <div style={{ padding: '0 8px', marginTop: 4, marginBottom: 4 }}>
        <button
          className="nav-item"
          style={{ color: '#f87171', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 9 }}
          onClick={onLogout}
          title="Sign out of Release Captain"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="sidebar-version">Release Captain v1.0.0</div>
    </aside>
  );
}

function Topbar({ onOpenCopilot, onLogout }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(12);

  const notifications = [
    { id: 1, type: 'danger', title: 'Pipeline #142 Failed', desc: 'E-Commerce Platform integration tests failing', time: '10 mins ago', path: '/pipelines/142' },
    { id: 2, type: 'warning', title: 'Release v2.1.0 Blocked', desc: 'Coverage gate 67% (needs ≥80%) · Awaiting approval', time: '25 mins ago', path: '/approvals' },
    { id: 3, type: 'warning', title: 'Staging Memory Spike', desc: 'Cluster memory usage at 84% during canary rollout', time: '1 hour ago', path: '/environments' },
    { id: 4, type: 'success', title: 'Incident RB-104 Auto-Recovered', desc: 'Auth Microservice restored in 1m 24s by Sentry Agent', time: '3 hours ago', path: '/rollback' },
    { id: 5, type: 'info', title: 'Security Scan Complete', desc: '1 High CVE detected in spring-security:6.1.0', time: '4 hours ago', path: '/security' },
  ];

  const searchableItems = [
    { title: 'Pipeline #142 (E-Commerce Platform)', category: 'Pipelines', path: '/pipelines/142' },
    { title: 'Pipeline #141 (Medical Inventory API)', category: 'Pipelines', path: '/pipelines' },
    { title: 'Release v2.1.0 (Blocked)', category: 'Releases', path: '/approvals' },
    { title: 'Release v2.0.9 (Production)', category: 'Releases', path: '/releases' },
    { title: 'Production Cluster (k8s-prod-us-east-1)', category: 'Environments', path: '/environments' },
    { title: 'Staging Cluster (k8s-stage-us-east-1)', category: 'Environments', path: '/environments' },
    { title: 'AI Command Center & Root Cause', category: 'AI Tools', path: '/ai' },
    { title: 'Emergency Rollback Console', category: 'Rollback', path: '/rollback' },
    { title: 'Platform Security CVE Scanner', category: 'Security', path: '/security' },
    { title: 'Release Governance Policies', category: 'Settings', path: '/settings' },
  ];

  const searchResults = searchableItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="topbar">
      {/* Search — centered & fully functional */}
      <div className="topbar-search-wrap" style={{ position: 'relative' }}>
        <Search size={14} className="topbar-search-icon" />
        <input
          className="topbar-search"
          placeholder="Search pipelines, releases, clusters..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
        />
        {searchOpen && searchQuery.trim() && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: 6,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-accent)',
              borderRadius: 'var(--r-md)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 100,
              maxHeight: 280,
              overflowY: 'auto'
            }}
          >
            {searchResults.length === 0 ? (
              <div style={{ padding: '12px 14px', fontSize: 12, color: 'var(--text-muted)' }}>
                No results found for "{searchQuery}".
              </div>
            ) : (
              searchResults.map((res, i) => (
                <div
                  key={i}
                  style={{
                    padding: '8px 12px',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  onClick={() => {
                    navigate(res.path);
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                >
                  <span style={{ fontSize: 12.5, color: 'var(--text-primary)', fontWeight: 500 }}>{res.title}</span>
                  <span className="badge badge-muted" style={{ fontSize: 9.5 }}>{res.category}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right controls */}
      <div className="topbar-right">
        {/* AI Copilot button */}
        <button className="ai-copilot-btn" onClick={onOpenCopilot}>
          <Cpu size={14} /> AI Copilot
        </button>

        {/* Help button */}
        <button
          className="topbar-icon-btn"
          title="Help & Guides"
          onClick={() => setHelpOpen(true)}
        >
          <HelpCircle size={15} />
        </button>

        {/* Notifications button */}
        <div style={{ position: 'relative' }}>
          <button
            className="topbar-icon-btn"
            title="Notifications"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <Bell size={15} />
            {notifCount > 0 && <span className="notif-badge">{notifCount}</span>}
          </button>

          {notifOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 8,
                width: 340,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-muted)',
                borderRadius: 'var(--r-lg)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 100,
                overflow: 'hidden'
              }}
            >
              <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Notifications</span>
                <span
                  style={{ fontSize: 11, color: 'var(--accent-light)', cursor: 'pointer' }}
                  onClick={() => setNotifCount(0)}
                >
                  Mark all as read
                </span>
              </div>
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    style={{
                      padding: '10px 14px',
                      borderBottom: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    onClick={() => {
                      navigate(n.path);
                      setNotifOpen(false);
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{n.time}</span>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            className="topbar-user"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="topbar-avatar">PK</div>
            <div className="topbar-user-info">
              <div className="topbar-user-name">{currentUser.name}</div>
              <div className="topbar-user-role">{currentUser.role.replace('_', ' ')}</div>
            </div>
          </div>

          {userMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 8,
                width: 220,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-muted)',
                borderRadius: 'var(--r-lg)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 100,
                padding: '6px'
              }}
            >
              <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)', marginBottom: 4 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{currentUser.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{currentUser.email}</div>
              </div>
              <button
                style={{ width: '100%', padding: '7px 10px', background: 'transparent', border: 'none', textAlign: 'left', color: 'var(--text-secondary)', fontSize: 12, borderRadius: 4, cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                onClick={() => {
                  navigate('/settings');
                  setUserMenuOpen(false);
                }}
              >
                Settings &amp; Preferences
              </button>
              <button
                style={{ width: '100%', padding: '7px 10px', background: 'transparent', border: 'none', textAlign: 'left', color: 'var(--text-secondary)', fontSize: 12, borderRadius: 4, cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                onClick={() => {
                  navigate('/audit');
                  setUserMenuOpen(false);
                }}
              >
                Activity Audit Log
              </button>

              <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 4, paddingTop: 4 }}>
                <button
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    color: '#f87171',
                    fontSize: 12,
                    borderRadius: 4,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--danger-dim)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  onClick={() => {
                    setUserMenuOpen(false);
                    onLogout();
                  }}
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help Modal */}
      {helpOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div className="card" style={{ width: 520, maxWidth: '92vw', boxShadow: 'var(--shadow-lg)' }}>
            <div className="card-header">
              <div className="card-title">
                <HelpCircle size={16} color="var(--accent-light)" />
                <span>Release Captain — Quick Help &amp; Shortcuts</span>
              </div>
              <button className="topbar-icon-btn" style={{ width: 24, height: 24 }} onClick={() => setHelpOpen(false)}>
                <X size={14} />
              </button>
            </div>
            <div style={{ padding: 18, fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <p style={{ marginBottom: 12 }}>
                <strong>Release Captain</strong> is an autonomous AI-driven Release Engineering platform designed for high-velocity CI/CD environments.
              </p>

              <div style={{ background: 'var(--bg-elevated)', padding: '10px 12px', borderRadius: 'var(--r-md)', marginBottom: 14, border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Key Platform Capabilities:</div>
                <ul style={{ paddingLeft: 18, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <li><strong>AI Failure Analysis:</strong> Pinpoints root cause (e.g., HikariCP pool starvation) in Pipeline #142.</li>
                  <li><strong>Quality Governance Gates:</strong> Enforces &ge;80% test coverage before production deploys.</li>
                  <li><strong>Automated Rollback:</strong> 1-click zero-downtime canary rollback when error spikes occur.</li>
                  <li><strong>Fleet Monitoring:</strong> Real-time Kubernetes CPU, memory, and 5xx telemetry.</li>
                </ul>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <button className="btn btn-primary btn-sm" onClick={() => setHelpOpen(false)}>
                  Got it, close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function AppShell({ onLogout }) {
  const [copilotOpen, setCopilotOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar onOpenCopilot={() => setCopilotOpen(true)} onLogout={onLogout} />
      <div className="main-content">
        <Topbar onOpenCopilot={() => setCopilotOpen(true)} onLogout={onLogout} />
        <main className="page-content">
          <Routes>
            <Route path="/"              element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard"     element={<Dashboard />} />
            <Route path="/pipelines"     element={<Pipelines />} />
            <Route path="/pipelines/:id" element={<PipelineDetail />} />
            <Route path="/releases"      element={<Releases />} />
            <Route path="/deployments"   element={<Deployments />} />
            <Route path="/environments"  element={<Environments />} />
            <Route path="/ai"            element={<AICommandCenter />} />
            <Route path="/risk"          element={<RiskQuality />} />
            <Route path="/security"      element={<Security />} />
            <Route path="/approvals"     element={<Approvals />} />
            <Route path="/monitoring"    element={<Monitoring />} />
            <Route path="/rollback"      element={<Rollback />} />
            <Route path="/audit"         element={<AuditLogs />} />
            <Route path="/projects"      element={<Projects />} />
            <Route path="/settings"      element={<SettingsPage onLogout={onLogout} />} />
          </Routes>
        </main>
      </div>
      <AICopilotDrawer isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <BrowserRouter>
      {isLoggedIn ? (
        <AppShell onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <Routes>
          <Route path="*" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}
