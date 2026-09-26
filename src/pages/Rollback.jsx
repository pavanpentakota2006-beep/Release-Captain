import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RotateCcw, AlertTriangle, CheckCircle, ShieldCheck, Clock,
  ArrowRight, RefreshCw, X, Play, Shield, Terminal, FileText
} from 'lucide-react';
import { projects } from '../data/mockData.js';

const rollbackHistoryData = [
  {
    id: 'RB-104',
    service: 'Auth Microservice',
    env: 'Production',
    fromVersion: 'v2.0.8',
    toVersion: 'v2.0.6',
    triggeredBy: 'Auto-Sentry AI',
    triggerRole: 'SYSTEM AGENT',
    reason: '500 Error rate spiked to 8.4% after JWT filter chain null pointer exception',
    mttr: '1m 24s',
    date: '3 days ago 3:22 PM',
    status: 'success'
  },
  {
    id: 'RB-103',
    service: 'E-Commerce Platform',
    env: 'Production',
    fromVersion: 'v1.9.4-rc1',
    toVersion: 'v1.9.3',
    triggeredBy: 'Pavan Kumar',
    triggerRole: 'RELEASE_MANAGER',
    reason: 'Payment gateway timeout during flash checkout traffic burst',
    mttr: '2m 10s',
    date: '2 weeks ago',
    status: 'success'
  },
  {
    id: 'RB-102',
    service: 'AI Study Planner',
    env: 'Staging',
    fromVersion: 'v2.0.5',
    toVersion: 'v2.0.4',
    triggeredBy: 'Ananya Sharma',
    triggerRole: 'LEAD_DEV',
    reason: 'OpenAI client rate limit retry storm crashing worker pods',
    mttr: '0m 48s',
    date: '1 month ago',
    status: 'success'
  }
];

export default function Rollback() {
  const navigate = useNavigate();
  const [history, setHistory] = useState(rollbackHistoryData);
  const [selectedEnv, setSelectedEnv] = useState('Production');
  const [selectedService, setSelectedService] = useState('E-Commerce Platform');
  const [targetVersion, setTargetVersion] = useState('v1.9.3');
  const [strategy, setStrategy] = useState('Instant Blue/Green Traffic Flip');
  const [dbSafeCheck, setDbSafeCheck] = useState(true);

  // Live execution simulation
  const [isExecuting, setIsExecuting] = useState(false);
  const [execStep, setExecStep] = useState(0);
  const [successToast, setSuccessToast] = useState(false);
  const [detailModal, setDetailModal] = useState(null);

  const handleTriggerRollback = (e) => {
    e.preventDefault();
    setIsExecuting(true);
    setExecStep(1);

    setTimeout(() => setExecStep(2), 800);
    setTimeout(() => setExecStep(3), 1600);
    setTimeout(() => setExecStep(4), 2400);

    setTimeout(() => {
      setIsExecuting(false);
      setExecStep(0);
      setSuccessToast(true);
      const newEntry = {
        id: `RB-${Math.floor(105 + Math.random() * 50)}`,
        service: selectedService,
        env: selectedEnv,
        fromVersion: 'v2.1.0',
        toVersion: targetVersion,
        triggeredBy: 'Pavan Kumar',
        triggerRole: 'RELEASE_MANAGER',
        reason: 'Manual safe rollback initiated via Release Captain console',
        mttr: '0m 52s',
        date: 'Just now',
        status: 'success'
      };
      setHistory([newEntry, ...history]);
      setTimeout(() => setSuccessToast(false), 5000);
    }, 3200);
  };

  return (
    <div className="page-enter">
      {/* Toast Notification */}
      {successToast && (
        <div className="alert-banner success" style={{ marginBottom: 12 }}>
          <CheckCircle size={16} />
          <div style={{ flex: 1 }}>
            <strong>Rollback Succeeded!</strong> {selectedService} on {selectedEnv} safely reverted to {targetVersion} in 52s with 0% downtime.
          </div>
          <span className="badge badge-success">Live Healthy</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header" style={{ marginBottom: 12 }}>
        <div className="page-header-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}>
              <RotateCcw size={16} />
            </div>
            <h1>Automated Rollback Center</h1>
          </div>
          <p>Instant zero-downtime rollbacks, safe traffic draining, and post-incident telemetry logs</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/monitoring')}>
            <Clock size={13} /> View Telemetry
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/deployments')}>
            Deploy Clean Release <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="stat-cards-grid" style={{ marginBottom: 12 }}>
        <div className="stat-card">
          <span className="stat-card-label">Total Rollbacks</span>
          <div className="stat-card-row">
            <span className="stat-card-value">3</span>
            <div className="stat-card-icon" style={{ background: 'var(--warning-dim)', color: 'var(--warning)' }}>
              <RotateCcw size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>2.1% of deploys</span>
            <span className="stat-card-trend-sub">Quarterly</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">Mean MTTR (Recovery)</span>
          <div className="stat-card-row">
            <span className="stat-card-value" style={{ color: 'var(--success)' }}>1m 27s</span>
            <div className="stat-card-icon" style={{ background: 'var(--success-dim)', color: 'var(--success)' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>DORA Elite standard</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">Auto AI Sentry Shield</span>
          <div className="stat-card-row">
            <span className="stat-card-value" style={{ color: '#60a5fa' }}>ACTIVE</span>
            <div className="stat-card-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>Trigger threshold: &gt;1.0% 5xx</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">Data Integrity Rate</span>
          <div className="stat-card-row">
            <span className="stat-card-value" style={{ color: 'var(--success)' }}>100%</span>
            <div className="stat-card-icon" style={{ background: 'var(--success-dim)', color: 'var(--success)' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>Zero data loss</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">Last Rollback</span>
          <div className="stat-card-row">
            <span className="stat-card-value">3d ago</span>
            <div className="stat-card-icon" style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa' }}>
              <RotateCcw size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>Auth Microservice</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12, marginBottom: 16 }}>
        {/* Interactive Rollback Console */}
        <div className="card" style={{ borderLeft: '3px solid var(--danger)' }}>
          <div className="card-header" style={{ background: 'rgba(239,68,68,0.06)' }}>
            <div className="card-title">
              <RotateCcw size={15} color="var(--danger)" />
              <span>Initiate Safe Instant Rollback</span>
            </div>
            <span className="badge badge-danger">High Authority Action</span>
          </div>
          <div className="card-body" style={{ padding: '14px 18px' }}>
            <form onSubmit={handleTriggerRollback}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Target Environment</label>
                  <select
                    className="form-input"
                    value={selectedEnv}
                    onChange={(e) => setSelectedEnv(e.target.value)}
                  >
                    <option value="Production">Production (k8s-prod-us-east-1)</option>
                    <option value="Staging">Staging (k8s-stage-us-east-1)</option>
                    <option value="QA">QA (k8s-qa-internal)</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Target Service</label>
                  <select
                    className="form-input"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Current Unhealthy Version</label>
                  <input
                    type="text"
                    className="form-input"
                    value="v2.1.0 (Pool Starvation Detected)"
                    disabled
                    style={{ opacity: 0.8, color: 'var(--danger)' }}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Rollback Target (Stable)</label>
                  <select
                    className="form-input"
                    value={targetVersion}
                    onChange={(e) => setTargetVersion(e.target.value)}
                  >
                    <option value="v2.0.9">v2.0.9 (Last Known Healthy — 100% tests)</option>
                    <option value="v1.9.3">v1.9.3 (LTS Release — 0 errors)</option>
                    <option value="v2.0.6">v2.0.6 (Stable Production build)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Rollback Execution Strategy</label>
                <select
                  className="form-input"
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value)}
                >
                  <option value="Instant Blue/Green Traffic Flip">Instant Blue/Green Traffic Flip (0s lag)</option>
                  <option value="Fast Canary Drain">Fast Canary Drain (Drain 100% in 15 seconds)</option>
                  <option value="Rolling Pod Reversion">Rolling Pod Reversion (Kubernetes rollout undo)</option>
                </select>
              </div>

              <div style={{ background: 'var(--bg-elevated)', padding: '10px 12px', borderRadius: 'var(--r-md)', marginBottom: 14, border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="checkbox"
                  id="dbSafe"
                  checked={dbSafeCheck}
                  onChange={(e) => setDbSafeCheck(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
                />
                <label htmlFor="dbSafe" style={{ fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <strong>Verify database schema compatibility:</strong> Ensure backwards compatibility before executing container replacement.
                </label>
              </div>

              {isExecuting ? (
                <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid var(--border-accent)', borderRadius: 'var(--r-md)', padding: 12, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                    <span style={{ fontWeight: 600, color: 'var(--accent-light)' }}>
                      {execStep === 1 && 'Step 1/4: Draining live ingress traffic from unhealthy pods...'}
                      {execStep === 2 && 'Step 2/4: Reverting Kubernetes deployment replica set to target...'}
                      {execStep === 3 && 'Step 3/4: Health checking restored pods (/health 200 OK)...'}
                      {execStep === 4 && 'Step 4/4: Switching DNS router to stable version!'}
                    </span>
                    <RefreshCw size={13} className="spin" color="var(--accent-light)" />
                  </div>
                  <div className="progress-bar" style={{ height: 6 }}>
                    <div className="progress-fill accent" style={{ width: `${(execStep / 4) * 100}%` }} />
                  </div>
                </div>
              ) : null}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => navigate('/monitoring')}
                >
                  Inspect Metrics First
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={isExecuting}
                  style={{ background: 'var(--danger)', borderColor: 'var(--danger-border)' }}
                >
                  <RotateCcw size={13} /> Initiate Rollback to {targetVersion}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* AI Rollback Policy & Safeguards */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <ShieldCheck size={15} color="var(--success)" />
              <span>Automated Rollback Rules</span>
            </div>
            <span className="badge badge-success">3 Guardrails Active</span>
          </div>
          <div className="card-body" style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: 'var(--bg-elevated)', padding: '10px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <CheckCircle size={14} color="var(--success)" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>HTTP 5xx Threshold Guard</span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  If HTTP 5xx error rate exceeds <strong>1.0%</strong> for &gt; 60 seconds after deployment, Release Captain automatically triggers instant canary drain.
                </p>
              </div>

              <div style={{ background: 'var(--bg-elevated)', padding: '10px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <CheckCircle size={14} color="var(--success)" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>CrashLoopBackOff Watchdog</span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  If &gt; 25% of new pods enter CrashLoopBackOff or fail readiness probes within 3 minutes, deployment is instantly aborted.
                </p>
              </div>

              <div style={{ background: 'var(--bg-elevated)', padding: '10px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <CheckCircle size={14} color="var(--success)" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>Latency Spike Auto-Protect</span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  p99 response latency &gt; 1,000ms triggers automatic warning and holds canary progression at current weight until reviewed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rollback Incident History Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <FileText size={15} color="var(--accent-light)" />
            <span>Rollback Incident History &amp; Post-Mortems</span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{history.length} recorded incidents</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="rc-table">
              <thead>
                <tr>
                  <th>Incident ID</th>
                  <th>Service</th>
                  <th>Environment</th>
                  <th>Reversion Path</th>
                  <th>Triggered By</th>
                  <th>Root Cause Reason</th>
                  <th>MTTR</th>
                  <th>Timestamp</th>
                  <th style={{ textAlign: 'right' }}>Post-Mortem</th>
                </tr>
              </thead>
              <tbody>
                {history.map(item => (
                  <tr key={item.id} onClick={() => setDetailModal(item)}>
                    <td><span className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--danger)' }}>{item.id}</span></td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.service}</td>
                    <td><span className="env-badge-prod">{item.env}</span></td>
                    <td>
                      <span className="mono" style={{ color: 'var(--danger)', fontSize: 12 }}>{item.fromVersion}</span>
                      <span style={{ color: 'var(--text-muted)', margin: '0 4px' }}>→</span>
                      <span className="mono" style={{ color: 'var(--success)', fontSize: 12 }}>{item.toVersion}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.triggeredBy}</span>
                      <div style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>{item.triggerRole}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: 11.5, color: 'var(--text-secondary)', maxWidth: 260, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.reason}
                      </span>
                    </td>
                    <td><span style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)' }}>{item.mttr}</span></td>
                    <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.date}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '3px 8px', fontSize: 11 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailModal(item);
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Incident Detail Modal */}
      {detailModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: 560, maxWidth: '92vw', boxShadow: 'var(--shadow-lg)' }}>
            <div className="card-header">
              <div className="card-title">
                <RotateCcw size={15} color="var(--danger)" />
                <span>Incident Post-Mortem: {detailModal.id}</span>
              </div>
              <button className="topbar-icon-btn" style={{ width: 24, height: 24 }} onClick={() => setDetailModal(null)}>
                <X size={14} />
              </button>
            </div>
            <div style={{ padding: 18 }}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Service &amp; Environment</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
                  {detailModal.service} on {detailModal.env}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14, background: 'var(--bg-elevated)', padding: 12, borderRadius: 'var(--r-md)' }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Unhealthy Release</div>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--danger)' }}>{detailModal.fromVersion}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Restored Release</div>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--success)' }}>{detailModal.toVersion}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Triggered By</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{detailModal.triggeredBy}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Recovery Time (MTTR)</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)' }}>{detailModal.mttr}</div>
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Incident Root Cause</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, background: 'var(--bg-card-alt)', padding: 10, borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                  {detailModal.reason}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setDetailModal(null)}>Close</button>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/ai')}>
                  Open AI Failure Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
