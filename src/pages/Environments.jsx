import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe, Server, CheckCircle, AlertTriangle, XCircle, RefreshCw,
  Cpu, HardDrive, Activity, Terminal, Shield, ArrowRight, Play,
  RotateCcw, Sliders, ExternalLink, Check, Layers
} from 'lucide-react';
import { healthMetrics, projects } from '../data/mockData.js';

const initialEnvironments = [
  {
    id: 'prod',
    name: 'Production',
    type: 'PROD',
    cluster: 'k8s-prod-us-east-1',
    region: 'AWS us-east-1',
    status: 'healthy',
    uptime: '99.98%',
    deployedVersion: 'v2.0.9',
    lastDeploy: 'Yesterday 11:02 AM',
    cpu: 41,
    memory: 58,
    errorRate: 0.04,
    pods: '16/16',
    trafficWeight: '100%',
    services: [
      { name: 'E-Commerce Platform', version: 'v1.9.3', status: 'healthy' },
      { name: 'Medical Inventory API', version: 'v2.0.9', status: 'healthy' },
      { name: 'Auth Microservice', version: 'v2.0.6', status: 'healthy' },
      { name: 'AI Study Planner', version: 'v2.0.7', status: 'healthy' }
    ]
  },
  {
    id: 'staging',
    name: 'Staging',
    type: 'PRE-PROD',
    cluster: 'k8s-stage-us-east-1',
    region: 'AWS us-east-1',
    status: 'degraded',
    uptime: '99.4%',
    deployedVersion: 'v2.1.0-rc2',
    lastDeploy: '4 mins ago',
    cpu: 78,
    memory: 84,
    errorRate: 1.42,
    pods: '8/8',
    trafficWeight: 'Canary 20%',
    services: [
      { name: 'E-Commerce Platform', version: 'v2.1.0-rc2', status: 'degraded' },
      { name: 'Medical Inventory API', version: 'v2.1.0-beta', status: 'healthy' },
      { name: 'Auth Microservice', version: 'v2.0.8', status: 'healthy' },
      { name: 'AI Study Planner', version: 'v2.1.0', status: 'healthy' }
    ]
  },
  {
    id: 'qa',
    name: 'QA Automation',
    type: 'TEST',
    cluster: 'k8s-qa-internal',
    region: 'AWS us-west-2',
    status: 'healthy',
    uptime: '99.9%',
    deployedVersion: 'v2.1.0-test',
    lastDeploy: '3 hours ago',
    cpu: 28,
    memory: 45,
    errorRate: 0.12,
    pods: '6/6',
    trafficWeight: 'Internal QA',
    services: [
      { name: 'E-Commerce Platform', version: 'v2.1.0', status: 'healthy' },
      { name: 'Medical Inventory API', version: 'v2.0.9', status: 'healthy' },
      { name: 'Auth Microservice', version: 'v2.0.8', status: 'healthy' },
      { name: 'AI Study Planner', version: 'v2.0.7', status: 'healthy' }
    ]
  },
  {
    id: 'uat',
    name: 'UAT Customer Preview',
    type: 'UAT',
    cluster: 'k8s-uat-eu-central-1',
    region: 'AWS eu-central-1',
    status: 'healthy',
    uptime: '99.95%',
    deployedVersion: 'v2.0.8',
    lastDeploy: '2 days ago',
    cpu: 32,
    memory: 48,
    errorRate: 0.08,
    pods: '4/4',
    trafficWeight: 'Customer Beta',
    services: [
      { name: 'E-Commerce Platform', version: 'v2.0.8', status: 'healthy' },
      { name: 'Medical Inventory API', version: 'v2.0.8', status: 'healthy' },
      { name: 'Auth Microservice', version: 'v2.0.6', status: 'healthy' },
      { name: 'AI Study Planner', version: 'v2.0.6', status: 'healthy' }
    ]
  },
  {
    id: 'dev',
    name: 'Development Sandbox',
    type: 'DEV',
    cluster: 'k8s-dev-cluster',
    region: 'Local / Hybrid',
    status: 'healthy',
    uptime: '98.5%',
    deployedVersion: 'v2.2.0-alpha',
    lastDeploy: '18 mins ago',
    cpu: 52,
    memory: 61,
    errorRate: 0.45,
    pods: '10/10',
    trafficWeight: 'Dev Team',
    services: [
      { name: 'E-Commerce Platform', version: 'v2.2.0-nightly', status: 'healthy' },
      { name: 'Medical Inventory API', version: 'v2.1.1-dev', status: 'healthy' },
      { name: 'Auth Microservice', version: 'v2.1.0-dev', status: 'healthy' },
      { name: 'AI Study Planner', version: 'v2.2.0-dev', status: 'healthy' }
    ]
  }
];

export default function Environments() {
  const navigate = useNavigate();
  const [environments, setEnvironments] = useState(initialEnvironments);
  const [activeTab, setActiveTab] = useState('ALL');
  const [actionNotice, setActionNotice] = useState(null);

  const triggerAction = (envName, action) => {
    setActionNotice(`${action} triggered on ${envName}...`);
    setTimeout(() => {
      setActionNotice(null);
    }, 4000);
  };

  const filteredEnvs = environments.filter(e => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'PROD') return e.type === 'PROD';
    if (activeTab === 'NON-PROD') return e.type !== 'PROD';
    return true;
  });

  return (
    <div className="page-enter">
      {/* Toast Notice */}
      {actionNotice && (
        <div className="alert-banner info" style={{ marginBottom: 12 }}>
          <RefreshCw size={15} className="spin" />
          <div style={{ flex: 1 }}>
            <strong>Environment Action:</strong> {actionNotice}
          </div>
          <span className="badge badge-accent">Processing</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header" style={{ marginBottom: 12 }}>
        <div className="page-header-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(20,184,166,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)' }}>
              <Globe size={16} />
            </div>
            <h1>Environments</h1>
          </div>
          <p>Fleet infrastructure topology, resource telemetry, and multi-cluster deployment gates</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-ghost btn-sm" onClick={() => triggerAction('All Clusters', 'Health Telemetry Refresh')}>
            <RefreshCw size={13} /> Refresh Fleet
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/deployments')}>
            <Play size={13} /> Promote Release
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="stat-cards-grid" style={{ marginBottom: 12 }}>
        <div className="stat-card">
          <span className="stat-card-label">Total Clusters</span>
          <div className="stat-card-row">
            <span className="stat-card-value">5</span>
            <div className="stat-card-icon" style={{ background: 'var(--teal-dim)', color: 'var(--teal)' }}>
              <Globe size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>● 5 Connected</span>
            <span className="stat-card-trend-sub">Multi-cloud</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">Production Fleet</span>
          <div className="stat-card-row">
            <span className="stat-card-value" style={{ color: 'var(--success)' }}>100%</span>
            <div className="stat-card-icon" style={{ background: 'var(--success-dim)', color: 'var(--success)' }}>
              <CheckCircle size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>Healthy</span>
            <span className="stat-card-trend-sub">Zero downtime</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">Active Total Pods</span>
          <div className="stat-card-row">
            <span className="stat-card-value">44</span>
            <div className="stat-card-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>
              <Layers size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>44 / 44 Ready</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">Mean CPU Fleet</span>
          <div className="stat-card-row">
            <span className="stat-card-value">46%</span>
            <div className="stat-card-icon" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--warning)' }}>
              <Cpu size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>Optimal capacity</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">Degraded Alerts</span>
          <div className="stat-card-row">
            <span className="stat-card-value" style={{ color: 'var(--warning)' }}>1</span>
            <div className="stat-card-icon" style={{ background: 'var(--warning-dim)', color: 'var(--warning)' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="stat-card-trend" style={{ color: 'var(--warning)' }}>
            <span>Staging canary spike</span>
          </div>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="tab-strip" style={{ marginBottom: 12 }}>
        <button className={`tab-btn ${activeTab === 'ALL' ? 'active' : ''}`} onClick={() => setActiveTab('ALL')}>
          All Clusters (5)
        </button>
        <button className={`tab-btn ${activeTab === 'PROD' ? 'active' : ''}`} onClick={() => setActiveTab('PROD')}>
          Production Only (1)
        </button>
        <button className={`tab-btn ${activeTab === 'NON-PROD' ? 'active' : ''}`} onClick={() => setActiveTab('NON-PROD')}>
          Non-Production (4)
        </button>
      </div>

      {/* Environment Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 12, marginBottom: 16 }}>
        {filteredEnvs.map(env => (
          <div key={env.id} className="card" style={{ borderTop: env.status === 'healthy' ? '2px solid var(--success)' : '2px solid var(--warning)' }}>
            <div className="card-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="card-title">{env.name}</span>
                  {env.type === 'PROD' ? (
                    <span className="env-badge-prod">PROD</span>
                  ) : (
                    <span className="badge badge-muted" style={{ fontSize: 9.5 }}>{env.type}</span>
                  )}
                  {env.status === 'healthy' ? (
                    <span className="status-healthy">HEALTHY</span>
                  ) : (
                    <span className="status-degraded">DEGRADED</span>
                  )}
                </div>
                <div className="card-subtitle">{env.cluster} · {env.region}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-light)' }}>{env.deployedVersion}</span>
                <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{env.lastDeploy}</div>
              </div>
            </div>

            <div className="card-body" style={{ padding: '12px 14px' }}>
              {/* Telemetry Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
                <div style={{ background: 'var(--bg-elevated)', padding: '6px 8px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 10 }}>
                    <Cpu size={11} /> CPU
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: env.cpu > 75 ? 'var(--warning)' : 'var(--text-primary)' }}>{env.cpu}%</div>
                  <div className="progress-bar" style={{ height: 3, marginTop: 4 }}>
                    <div className={`progress-fill ${env.cpu > 75 ? 'warning' : 'accent'}`} style={{ width: `${env.cpu}%` }} />
                  </div>
                </div>

                <div style={{ background: 'var(--bg-elevated)', padding: '6px 8px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 10 }}>
                    <HardDrive size={11} /> Memory
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: env.memory > 80 ? 'var(--warning)' : 'var(--text-primary)' }}>{env.memory}%</div>
                  <div className="progress-bar" style={{ height: 3, marginTop: 4 }}>
                    <div className={`progress-fill ${env.memory > 80 ? 'warning' : 'accent'}`} style={{ width: `${env.memory}%` }} />
                  </div>
                </div>

                <div style={{ background: 'var(--bg-elevated)', padding: '6px 8px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 10 }}>
                    <Activity size={11} /> 5xx Error
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: env.errorRate > 1.0 ? 'var(--danger)' : 'var(--success)' }}>{env.errorRate}%</div>
                  <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 2 }}>SLA: &lt; 0.5%</div>
                </div>

                <div style={{ background: 'var(--bg-elevated)', padding: '6px 8px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 10 }}>
                    <Layers size={11} /> Pods
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{env.pods}</div>
                  <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 2 }}>Traffic: {env.trafficWeight}</div>
                </div>
              </div>

              {/* Service Version Roster */}
              <div style={{ background: 'var(--bg-card-alt)', borderRadius: 'var(--r-md)', padding: '8px 10px', marginBottom: 12, border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.04em' }}>
                  Deployed Microservices
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {env.services.map((svc, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11.5 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span className={`status-dot ${svc.status === 'healthy' ? 'success' : 'danger'}`} />
                        <span style={{ color: 'var(--text-secondary)' }}>{svc.name}</span>
                      </div>
                      <span className="mono" style={{ color: 'var(--text-muted)', fontSize: 11 }}>{svc.version}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => triggerAction(env.name, 'Restart Pods')}>
                  <RefreshCw size={11} /> Restart Pods
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/rollback')}>
                  <RotateCcw size={11} /> Rollback
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/deployments')}>
                  <Play size={11} /> Deploy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Global Service Version Matrix Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Layers size={15} color="var(--accent-light)" />
            <span>Service Version Matrix across Fleet</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => triggerAction('All Matrix', 'Diff Check')}>
            Compare Diff
          </button>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="rc-table">
              <thead>
                <tr>
                  <th>Microservice</th>
                  <th>Production</th>
                  <th>Staging</th>
                  <th>QA Automation</th>
                  <th>Development</th>
                  <th style={{ textAlign: 'right' }}>Sync Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>E-Commerce Platform</td>
                  <td><span className="mono" style={{ color: 'var(--accent-light)' }}>v1.9.3</span></td>
                  <td><span className="mono" style={{ color: 'var(--warning)' }}>v2.1.0-rc2</span></td>
                  <td><span className="mono" style={{ color: 'var(--text-secondary)' }}>v2.1.0</span></td>
                  <td><span className="mono" style={{ color: 'var(--text-muted)' }}>v2.2.0-nightly</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/approvals')}>Promote to Prod</button>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Medical Inventory API</td>
                  <td><span className="mono" style={{ color: 'var(--success)' }}>v2.0.9</span></td>
                  <td><span className="mono" style={{ color: 'var(--text-secondary)' }}>v2.1.0-beta</span></td>
                  <td><span className="mono" style={{ color: 'var(--text-secondary)' }}>v2.0.9</span></td>
                  <td><span className="mono" style={{ color: 'var(--text-muted)' }}>v2.1.1-dev</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="badge badge-success">✓ In Sync</span>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Auth Microservice</td>
                  <td><span className="mono" style={{ color: 'var(--success)' }}>v2.0.6</span></td>
                  <td><span className="mono" style={{ color: 'var(--warning)' }}>v2.0.8 (rolled back)</span></td>
                  <td><span className="mono" style={{ color: 'var(--text-secondary)' }}>v2.0.8</span></td>
                  <td><span className="mono" style={{ color: 'var(--text-muted)' }}>v2.1.0-dev</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/rollback')}>Inspect Rollback</button>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>AI Study Planner</td>
                  <td><span className="mono" style={{ color: 'var(--success)' }}>v2.0.7</span></td>
                  <td><span className="mono" style={{ color: 'var(--text-secondary)' }}>v2.1.0</span></td>
                  <td><span className="mono" style={{ color: 'var(--text-secondary)' }}>v2.0.7</span></td>
                  <td><span className="mono" style={{ color: 'var(--text-muted)' }}>v2.2.0-dev</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/deployments')}>Deploy v2.1.0</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
