import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Rocket, CheckCircle, XCircle, RotateCcw, Clock, Play,
  Filter, Search, ArrowUpRight, ShieldCheck, AlertTriangle,
  RefreshCw, Check, Layers, ExternalLink, X, ChevronRight, Terminal
} from 'lucide-react';
import { deploymentHistory, projects } from '../data/mockData.js';

const initialDeployments = [
  {
    id: 'DEP-9821',
    version: 'v2.1.0-rc2',
    project: 'E-Commerce Platform',
    env: 'Staging',
    strategy: 'Canary (20%)',
    status: 'running',
    commit: 'f93d11b',
    commitMsg: 'perf: optimize cart checkout queries',
    author: 'Pavan Kumar',
    authorInitials: 'PK',
    duration: '2m 14s',
    startedAt: '4 mins ago',
    health: '98.5% healthy'
  },
  {
    id: 'DEP-9820',
    version: 'v2.0.9',
    project: 'Medical Inventory API',
    env: 'Production',
    strategy: 'Blue/Green',
    status: 'success',
    commit: 'de4f891',
    commitMsg: 'feat: add batch expiry scanning',
    author: 'Ananya Sharma',
    authorInitials: 'AS',
    duration: '4m 18s',
    startedAt: 'Yesterday 11:02 AM',
    health: '100% healthy'
  },
  {
    id: 'DEP-9819',
    version: 'v2.0.8',
    project: 'Auth Microservice',
    env: 'Production',
    strategy: 'Rolling',
    status: 'rollback',
    commit: 'bb91a34',
    commitMsg: 'fix: session expiry edge case',
    author: 'Admin',
    authorInitials: 'AD',
    duration: '3m 42s',
    startedAt: '3 days ago 3:22 PM',
    health: 'rolled back'
  },
  {
    id: 'DEP-9818',
    version: 'v2.0.7',
    project: 'AI Study Planner',
    env: 'Staging',
    strategy: 'Rolling',
    status: 'success',
    commit: 'ff2ac09',
    commitMsg: 'chore: bump openai sdk to 4.2.0',
    author: 'Riya Patel',
    authorInitials: 'RP',
    duration: '3m 01s',
    startedAt: '5 days ago 2:10 PM',
    health: '100% healthy'
  },
  {
    id: 'DEP-9817',
    version: 'v2.0.6',
    project: 'E-Commerce Platform',
    env: 'Production',
    strategy: 'Canary (100%)',
    status: 'success',
    commit: 'a12bc90',
    commitMsg: 'feat: multi-currency support',
    author: 'Pavan Kumar',
    authorInitials: 'PK',
    duration: '5m 42s',
    startedAt: '8 days ago 9:55 AM',
    health: '99.9% healthy'
  },
  {
    id: 'DEP-9816',
    version: 'v1.4.1',
    project: 'Medical Inventory API',
    env: 'QA',
    strategy: 'Direct',
    status: 'success',
    commit: '77d8ef1',
    commitMsg: 'test: end-to-end integration suite',
    author: 'Ananya Sharma',
    authorInitials: 'AS',
    duration: '1m 55s',
    startedAt: '9 days ago',
    health: '100% healthy'
  },
  {
    id: 'DEP-9815',
    version: 'v2.0.5',
    project: 'Auth Microservice',
    env: 'Production',
    strategy: 'Rolling',
    status: 'failed',
    commit: 'e2008f1',
    commitMsg: 'feat: OAuth2 PKCE provider update',
    author: 'Riya Patel',
    authorInitials: 'RP',
    duration: '2m 30s',
    startedAt: '12 days ago',
    health: 'unhealthy'
  }
];

export default function Deployments() {
  const navigate = useNavigate();
  const [deployments, setDeployments] = useState(initialDeployments);
  const [selectedEnv, setSelectedEnv] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [logModal, setLogModal] = useState(null);

  // New deployment form state
  const [formData, setFormData] = useState({
    project: 'E-Commerce Platform',
    env: 'Staging',
    version: 'v2.1.0',
    strategy: 'Canary (20%)'
  });
  const [deployingAlert, setDeployingAlert] = useState(false);

  const filteredDeployments = deployments.filter(d => {
    const matchesEnv = selectedEnv === 'ALL' || d.env.toUpperCase() === selectedEnv;
    const matchesSearch =
      d.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.commitMsg.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEnv && matchesSearch;
  });

  const handleStartDeploy = (e) => {
    e.preventDefault();
    const newDep = {
      id: `DEP-${Math.floor(1000 + Math.random() * 9000)}`,
      version: formData.version,
      project: formData.project,
      env: formData.env,
      strategy: formData.strategy,
      status: 'running',
      commit: 'b45c991',
      commitMsg: 'deploy: manual release trigger via Release Captain',
      author: 'Pavan Kumar',
      authorInitials: 'PK',
      duration: '0m 12s',
      startedAt: 'Just now',
      health: 'deploying...'
    };
    setDeployments([newDep, ...deployments]);
    setModalOpen(false);
    setDeployingAlert(true);
    setTimeout(() => setDeployingAlert(false), 5000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return <span className="badge badge-success"><CheckCircle size={11} /> Success</span>;
      case 'failed':
        return <span className="badge badge-danger"><XCircle size={11} /> Failed</span>;
      case 'rollback':
        return <span className="badge badge-warning"><RotateCcw size={11} /> Rollback</span>;
      case 'running':
        return <span className="badge badge-accent"><RefreshCw size={11} className="spin" /> In Progress</span>;
      default:
        return <span className="badge badge-muted">{status}</span>;
    }
  };

  const getEnvBadge = (env) => {
    if (env === 'Production') return <span className="env-badge-prod">PROD</span>;
    if (env === 'Staging') return <span className="env-badge-staging">STAGING</span>;
    return <span className="badge badge-muted">{env}</span>;
  };

  return (
    <div className="page-enter">
      {/* Toast Notification */}
      {deployingAlert && (
        <div className="alert-banner info" style={{ marginBottom: 12 }}>
          <Rocket size={16} />
          <div style={{ flex: 1 }}>
            <strong>Deployment Triggered!</strong> {formData.version} is now deploying to {formData.env} with {formData.strategy} strategy.
          </div>
          <span className="badge badge-accent">Live Running</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header" style={{ marginBottom: 12 }}>
        <div className="page-header-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
              <Rocket size={16} />
            </div>
            <h1>Deployments</h1>
          </div>
          <p>Real-time orchestration, automated canary rollouts, and deployment audit history</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-ghost btn-sm" onClick={() => setSelectedEnv('ALL')}>
            <RefreshCw size={13} /> Sync Cluster
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>
            <Play size={13} /> Deploy Release
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="stat-cards-grid" style={{ marginBottom: 12 }}>
        <div className="stat-card">
          <span className="stat-card-label">Total Deployments</span>
          <div className="stat-card-row">
            <span className="stat-card-value">142</span>
            <div className="stat-card-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>
              <Rocket size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>↑ 12%</span>
            <span className="stat-card-trend-sub">vs last month</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">Success Rate</span>
          <div className="stat-card-row">
            <span className="stat-card-value" style={{ color: 'var(--success)' }}>94.3%</span>
            <div className="stat-card-icon" style={{ background: 'var(--success-dim)', color: 'var(--success)' }}>
              <CheckCircle size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>↑ 1.2%</span>
            <span className="stat-card-trend-sub">DORA standard</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">Active / In-Flight</span>
          <div className="stat-card-row">
            <span className="stat-card-value" style={{ color: '#60a5fa' }}>1</span>
            <div className="stat-card-icon" style={{ background: 'var(--accent-dim)', color: 'var(--accent-light)' }}>
              <RefreshCw size={18} />
            </div>
          </div>
          <div className="stat-card-trend" style={{ color: '#60a5fa' }}>
            <span>● 1 Canary step active</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">Avg Deploy Time</span>
          <div className="stat-card-row">
            <span className="stat-card-value">4m 18s</span>
            <div className="stat-card-icon" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--warning)' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>↓ 42s faster</span>
            <span className="stat-card-trend-sub">optimized cache</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">Rollback Rate</span>
          <div className="stat-card-row">
            <span className="stat-card-value" style={{ color: 'var(--warning)' }}>2.1%</span>
            <div className="stat-card-icon" style={{ background: 'var(--warning-dim)', color: 'var(--warning)' }}>
              <RotateCcw size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>Low Risk</span>
            <span className="stat-card-trend-sub">3 auto-recovered</span>
          </div>
        </div>
      </div>

      {/* Active In-Flight Deployment Highlight Card */}
      <div className="card" style={{ marginBottom: 12, borderLeft: '3px solid var(--accent)' }}>
        <div className="card-header" style={{ background: 'rgba(59,130,246,0.06)' }}>
          <div className="card-title">
            <span className="status-dot running" />
            <span>Active Deployment: <strong>v2.1.0-rc2</strong> to Staging</span>
            <span className="badge badge-accent" style={{ marginLeft: 8 }}>Canary 20%</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Elapsed: 2m 14s</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setLogModal(deployments[0])}>
              <Terminal size={12} /> Live Logs
            </button>
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }} onClick={() => navigate('/rollback')}>
              <RotateCcw size={12} /> Abort / Rollback
            </button>
          </div>
        </div>
        <div className="card-body" style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Current Stage: <strong>Automated Smoke Tests &amp; Error Rate Verification</strong></span>
            <span style={{ color: 'var(--accent-light)', fontWeight: 600 }}>Step 4 of 6 · 68%</span>
          </div>
          <div className="progress-bar" style={{ height: 6, marginBottom: 12 }}>
            <div className="progress-fill accent" style={{ width: '68%' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, fontSize: 11 }}>
            <div style={{ padding: '6px 8px', borderRadius: 4, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: 'var(--text-muted)' }}>Cluster</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>k8s-us-east-stage</div>
            </div>
            <div style={{ padding: '6px 8px', borderRadius: 4, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: 'var(--text-muted)' }}>Traffic Weight</div>
              <div style={{ fontWeight: 600, color: '#60a5fa' }}>20% Canary / 80% Stable</div>
            </div>
            <div style={{ padding: '6px 8px', borderRadius: 4, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: 'var(--text-muted)' }}>HTTP 5xx Errors</div>
              <div style={{ fontWeight: 600, color: 'var(--success)' }}>0.01% (Safe)</div>
            </div>
            <div style={{ padding: '6px 8px', borderRadius: 4, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: 'var(--text-muted)' }}>p95 Latency</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>138ms</div>
            </div>
            <div style={{ padding: '6px 8px', borderRadius: 4, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: 'var(--text-muted)' }}>AI Sentry Guard</div>
              <div style={{ fontWeight: 600, color: 'var(--success)' }}>Healthy ✓</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <div className="tab-strip" style={{ margin: 0 }}>
          {['ALL', 'PRODUCTION', 'STAGING', 'QA'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${selectedEnv === tab ? 'active' : ''}`}
              onClick={() => setSelectedEnv(tab)}
            >
              {tab === 'ALL' ? 'All Environments' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, maxWidth: 360, marginLeft: 'auto' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search release, commit, or project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="topbar-search"
              style={{ width: '100%', paddingLeft: 30 }}
            />
          </div>
        </div>
      </div>

      {/* Deployments Table */}
      <div className="table-wrapper">
        <table className="rc-table">
          <thead>
            <tr>
              <th>Deployment ID</th>
              <th>Version</th>
              <th>Project</th>
              <th>Environment</th>
              <th>Strategy</th>
              <th>Status</th>
              <th>Commit</th>
              <th>Triggered By</th>
              <th>Duration</th>
              <th>Started</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeployments.length === 0 ? (
              <tr>
                <td colSpan="11" style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                  No deployments found matching criteria.
                </td>
              </tr>
            ) : (
              filteredDeployments.map(dep => (
                <tr key={dep.id}>
                  <td>
                    <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{dep.id}</span>
                  </td>
                  <td>
                    <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-light)' }}>{dep.version}</span>
                  </td>
                  <td style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{dep.project}</td>
                  <td>{getEnvBadge(dep.env)}</td>
                  <td>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{dep.strategy}</span>
                  </td>
                  <td>{getStatusBadge(dep.status)}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{dep.commit}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {dep.commitMsg}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white' }}>
                        {dep.authorInitials}
                      </div>
                      <span style={{ fontSize: 12 }}>{dep.author}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{dep.duration}</td>
                  <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{dep.startedAt}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '3px 8px', fontSize: 11 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setLogModal(dep);
                        }}
                      >
                        <Terminal size={11} /> Logs
                      </button>
                      {dep.status === 'rollback' || dep.status === 'failed' ? (
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '3px 8px', fontSize: 11, color: 'var(--warning)', borderColor: 'var(--warning-border)' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/rollback');
                          }}
                        >
                          <RotateCcw size={11} /> Rollback
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Deployment Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: 480, maxWidth: '90vw', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-accent)' }}>
            <div className="card-header">
              <div className="card-title">
                <Rocket size={16} color="var(--accent-light)" />
                <span>Deploy New Release</span>
              </div>
              <button className="topbar-icon-btn" style={{ width: 24, height: 24 }} onClick={() => setModalOpen(false)}>
                <X size={14} />
              </button>
            </div>
            <form onSubmit={handleStartDeploy} style={{ padding: '16px 20px' }}>
              <div className="form-group">
                <label className="form-label">Service / Project</label>
                <select
                  className="form-input"
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Target Environment</label>
                <select
                  className="form-input"
                  value={formData.env}
                  onChange={(e) => setFormData({ ...formData, env: e.target.value })}
                >
                  <option value="Production">Production (k8s-prod-us-east)</option>
                  <option value="Staging">Staging (k8s-stage-us-east)</option>
                  <option value="QA">QA (k8s-qa-internal)</option>
                  <option value="Development">Development (k8s-dev)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Release Version / Tag</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="e.g. v2.1.0 or SHA commit"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Deployment Rollout Strategy</label>
                <select
                  className="form-input"
                  value={formData.strategy}
                  onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                >
                  <option value="Canary (10%)">Canary (10% → 50% → 100% with AI health check)</option>
                  <option value="Blue/Green">Blue/Green (Zero Downtime instant flip)</option>
                  <option value="Rolling (25% step)">Rolling Update (25% pod increments)</option>
                </select>
              </div>

              <div style={{ background: 'var(--bg-elevated)', padding: '10px 12px', borderRadius: 'var(--r-md)', marginBottom: 16, fontSize: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                <ShieldCheck size={16} color="var(--success)" />
                <span style={{ color: 'var(--text-secondary)' }}>AI Release Captain will automatically monitor latency &amp; halt if error rate exceeds 1%.</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Play size={13} /> Confirm &amp; Deploy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deployment Log Terminal Modal */}
      {logModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: 680, maxWidth: '92vw', boxShadow: 'var(--shadow-lg)' }}>
            <div className="card-header">
              <div className="card-title">
                <Terminal size={15} color="var(--accent-light)" />
                <span>Deployment Logs: {logModal.id} ({logModal.version} on {logModal.env})</span>
              </div>
              <button className="topbar-icon-btn" style={{ width: 24, height: 24 }} onClick={() => setLogModal(null)}>
                <X size={14} />
              </button>
            </div>
            <div style={{ padding: 16 }}>
              <div className="log-terminal">
                <div className="log-terminal-header">
                  <div className="terminal-dot" style={{ background: '#ef4444' }} />
                  <div className="terminal-dot" style={{ background: '#f59e0b' }} />
                  <div className="terminal-dot" style={{ background: '#22c55e' }} />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>{logModal.project} - deploy-runner-pod</span>
                </div>
                <div className="log-terminal-body" style={{ maxHeight: 320 }}>
                  <div className="log-line"><span className="log-time">[10:28:01]</span><span className="log-text info">Initializing Kubernetes deployment target: {logModal.env}</span></div>
                  <div className="log-line"><span className="log-time">[10:28:03]</span><span className="log-text default">Pulling container image: acme/{logModal.project.toLowerCase().replace(/\s+/g, '-')}:{logModal.version}</span></div>
                  <div className="log-line"><span className="log-time">[10:28:15]</span><span className="log-text success">Image digest sha256:7e98a1fc44 verified from secure registry</span></div>
                  <div className="log-line"><span className="log-time">[10:28:22]</span><span className="log-text default">Applying ingress rule with strategy: {logModal.strategy}</span></div>
                  <div className="log-line"><span className="log-time">[10:28:40]</span><span className="log-text default">Pre-flight readiness probe passed on 4/4 pods</span></div>
                  <div className="log-line"><span className="log-time">[10:29:05]</span><span className="log-text info">Release Captain AI telemetry attached to live metrics stream</span></div>
                  {logModal.status === 'rollback' ? (
                    <>
                      <div className="log-line"><span className="log-time">[10:29:45]</span><span className="log-text error">ALERT: HTTP 500 error spike detected (8.4% error rate). Exceeds SLA threshold (1.0%)</span></div>
                      <div className="log-line"><span className="log-time">[10:29:46]</span><span className="log-text warning">Automatic rollback triggered by Release Captain Sentry Agent</span></div>
                      <div className="log-line"><span className="log-time">[10:30:10]</span><span className="log-text success">Rolled back to previous stable release v2.0.7 in 24 seconds</span></div>
                    </>
                  ) : logModal.status === 'failed' ? (
                    <>
                      <div className="log-line"><span className="log-time">[10:29:30]</span><span className="log-text error">ERROR: CrashLoopBackOff on container payment-worker</span></div>
                      <div className="log-line"><span className="log-time">[10:29:32]</span><span className="log-text error">Database connection failed: HikariPool-1 connection refused</span></div>
                    </>
                  ) : (
                    <>
                      <div className="log-line"><span className="log-time">[10:29:50]</span><span className="log-text success">Health check HTTP /health returned 200 OK (latency: 42ms)</span></div>
                      <div className="log-line"><span className="log-time">[10:30:12]</span><span className="log-text success">Deployment successfully rolled out to 100% of cluster nodes</span></div>
                    </>
                  )}
                </div>
              </div>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setLogModal(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
