import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, GitBranch, Package, Rocket, Globe, Cpu,
  BarChart2, Shield, CheckSquare, Activity, RotateCcw,
  FileBarChart, FolderOpen, Settings, Bell, Search,
  HelpCircle, Zap, ChevronDown, Star
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

function Sidebar({ onOpenCopilot }) {
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

      <div className="sidebar-version">Release Captain v1.0.0</div>
    </aside>
  );
}

function Topbar({ onOpenCopilot }) {
  const location = useLocation();

  return (
    <header className="topbar">
      {/* Search — centered */}
      <div className="topbar-search-wrap">
        <Search size={14} className="topbar-search-icon" />
        <input className="topbar-search" placeholder="Search anything..." />
      </div>

      {/* Right controls */}
      <div className="topbar-right">
        <button className="ai-copilot-btn" onClick={onOpenCopilot}>
          <Cpu size={14} /> AI Copilot
        </button>

        <button className="topbar-icon-btn" title="Help">
          <HelpCircle size={15} />
        </button>

        <button className="topbar-icon-btn" title="Notifications" style={{ position: 'relative' }}>
          <Bell size={15} />
          <span className="notif-badge">12</span>
        </button>

        <div className="topbar-user">
          <div className="topbar-avatar">PK</div>
          <div className="topbar-user-info">
            <div className="topbar-user-name">{currentUser.name}</div>
            <div className="topbar-user-role">{currentUser.role.replace('_', ' ')}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

const pageTitles = {
  '/dashboard':    'Overview',
  '/pipelines':    'CI/CD Pipelines',
  '/releases':     'Releases',
  '/deployments':  'Deployments',
  '/environments': 'Environments',
  '/ai':           'AI Command Center',
  '/risk':         'Risk & Quality',
  '/security':     'Security Analysis',
  '/approvals':    'Approvals',
  '/monitoring':   'Monitoring',
  '/rollback':     'Rollback',
  '/audit':        'Reports',
  '/projects':     'Projects',
  '/settings':     'Settings',
};

function AppShell() {
  const location = useLocation();
  const [copilotOpen, setCopilotOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar onOpenCopilot={() => setCopilotOpen(true)} />
      <div className="main-content">
        <Topbar onOpenCopilot={() => setCopilotOpen(true)} />
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
            <Route path="/settings"      element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
      <AICopilotDrawer isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />
    </div>
  );
}

export default function App() {
  const [isLoggedIn] = useState(true);

  return (
    <BrowserRouter>
      {isLoggedIn ? (
        <AppShell />
      ) : (
        <Routes>
          <Route path="*" element={<Login onLogin={() => {}} />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}
