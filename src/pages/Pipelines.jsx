import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle, XCircle, Clock, AlertTriangle, GitBranch, Filter,
  RefreshCw, Play, ArrowRight, X, Shield, Plus, Sparkles
} from 'lucide-react';
import { pipelines as initialPipelines, projects } from '../data/mockData.js';

const statusBadge = (s) => {
  if (s === 'success') return <span className="badge badge-success">✓ Success</span>;
  if (s === 'failed')  return <span className="badge badge-danger">✗ Failed</span>;
  if (s === 'running') return <span className="badge badge-accent">● Running</span>;
  return <span className="badge badge-muted">{s}</span>;
};

const stageIcon = (status) => {
  if (status === 'success') return '✓';
  if (status === 'failed')  return '✗';
  if (status === 'warning') return '!';
  if (status === 'running') return '◎';
  return '○';
};

export default function Pipelines() {
  const navigate = useNavigate();
  const [pipelineList, setPipelineList] = useState(initialPipelines);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [filterBarOpen, setFilterBarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshToast, setRefreshToast] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // New pipeline form
  const [newRun, setNewRun] = useState({
    project: 'E-Commerce Platform',
    branch: 'main',
    commitMsg: 'chore: trigger automated release build'
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshToast(true);
      setTimeout(() => setRefreshToast(false), 3000);
    }, 800);
  };

  const handleTrigger = (e) => {
    e.preventDefault();
    const createdId = Math.floor(143 + Math.random() * 20);
    const created = {
      id: createdId,
      project: newRun.project,
      branch: newRun.branch,
      commit: Math.random().toString(36).substring(2, 9),
      commitMsg: newRun.commitMsg,
      author: 'Pavan Kumar',
      authorInitials: 'PK',
      status: 'running',
      duration: '0m 15s',
      triggeredAt: 'Just now',
      stages: [
        { name: 'Build',       status: 'running', duration: '--' },
        { name: 'Unit Tests',  status: 'idle',    duration: '--' },
        { name: 'Security',    status: 'idle',    duration: '--' },
        { name: 'Integration', status: 'idle',    duration: '--' },
        { name: 'Deploy',      status: 'idle',    duration: '--' },
      ],
      testResults: null,
      security: null,
      riskLevel: 'low',
      riskReasons: []
    };
    setPipelineList([created, ...pipelineList]);
    setModalOpen(false);
  };

  const filteredPipelines = pipelineList.filter(p => {
    if (statusFilter === 'ALL') return true;
    return p.status.toUpperCase() === statusFilter;
  });

  return (
    <div className="page-enter">
      {/* Toast Notice */}
      {refreshToast && (
        <div className="alert-banner success" style={{ marginBottom: 12 }}>
          <CheckCircle size={16} />
          <div style={{ flex: 1 }}>
            <strong>Pipelines Synced!</strong> Updated telemetry from all Kubernetes runner agents.
          </div>
          <span className="badge badge-success">Fresh</span>
        </div>
      )}

      {/* Alert for failed pipeline */}
      <div className="alert-banner danger" style={{ cursor: 'pointer', marginBottom: 14 }} onClick={() => navigate('/pipelines/142')}>
        <XCircle size={18} />
        <div style={{ flex: 1 }}>
          <strong>Pipeline #142 failed</strong> — E-Commerce Platform · Integration tests failing · AI analysis available
        </div>
        <button
          className="btn btn-danger btn-sm"
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            navigate('/pipelines/142');
          }}
        >
          Analyze <ArrowRight size={13} />
        </button>
      </div>

      {/* Header */}
      <div className="section-header">
        <div>
          <div className="section-title"><GitBranch size={16} /> CI/CD Pipelines</div>
          <div className="section-subtitle">{pipelineList.length} pipelines across {[...new Set(pipelineList.map(p => p.project))].length} projects</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className={`btn btn-ghost btn-sm ${filterBarOpen ? 'btn-primary' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => setFilterBarOpen(!filterBarOpen)}
          >
            <Filter size={13} /> Filter
          </button>
          <button
            className="btn btn-ghost btn-sm"
            style={{ cursor: 'pointer' }}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw size={13} className={isRefreshing ? 'spin' : ''} /> {isRefreshing ? 'Syncing...' : 'Refresh'}
          </button>
          <button
            className="btn btn-primary btn-sm"
            style={{ cursor: 'pointer' }}
            onClick={() => setModalOpen(true)}
          >
            <Play size={13} /> Trigger Pipeline
          </button>
        </div>
      </div>

      {/* Filter Strip */}
      {filterBarOpen && (
        <div className="tab-strip" style={{ marginBottom: 14 }}>
          {['ALL', 'FAILED', 'RUNNING', 'SUCCESS'].map(st => (
            <button
              key={st}
              className={`tab-btn ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st === 'ALL' ? 'All Pipelines' : st.charAt(0) + st.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      )}

      {/* Pipelines Table */}
      <div className="table-wrapper">
        <table className="rc-table">
          <thead>
            <tr>
              <th>Pipeline</th>
              <th>Commit</th>
              <th>Stages</th>
              <th>Status</th>
              <th>Risk</th>
              <th>Duration</th>
              <th>Triggered</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredPipelines.map(p => (
              <tr key={p.id} onClick={() => navigate(`/pipelines/${p.id}`)} style={{ cursor: 'pointer' }} title="Click to inspect pipeline run">
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>
                    #{p.id}
                    {p.status === 'running' && (
                      <span style={{ marginLeft: 8, fontSize: 10, background: 'var(--accent-dim)', color: '#60a5fa', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>LIVE</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{p.project}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-disabled)', marginTop: 1 }}>{p.author}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <GitBranch size={11} color="var(--text-muted)" />
                    <span style={{ fontSize: 12 }}>{p.branch}</span>
                  </div>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-light)' }}>{p.commit}</code>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.commitMsg}</div>
                </td>
                <td>
                  <div className="pipeline-stages" style={{ display: 'flex', gap: 4 }}>
                    {p.stages.map((s, i) => (
                      <div key={s.name} style={{ display: 'flex', alignItems: 'center' }}>
                        <div title={`${s.name}: ${s.status}`} className={`stage-icon ${s.status}`}>
                          {stageIcon(s.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                    {p.stages.map(s => s.name[0]).join(' · ')}
                  </div>
                </td>
                <td>{statusBadge(p.status)}</td>
                <td><span className={`risk-badge risk-${p.riskLevel}`}>{p.riskLevel}</span></td>
                <td><span className="mono" style={{ fontSize: 12 }}>{p.duration}</span></td>
                <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.triggeredAt}</td>
                <td><ArrowRight size={14} color="var(--text-muted)" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, marginTop: 16, padding: '12px 20px', background: 'var(--bg-elevated)', borderRadius: 8 }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Stage icons:</span>
        {[
          { icon: '✓', label: 'Success', cls: 'stage-icon success' },
          { icon: '✗', label: 'Failed',  cls: 'stage-icon danger'  },
          { icon: '!', label: 'Warning', cls: 'stage-icon warning' },
          { icon: '◎', label: 'Running', cls: 'stage-icon running' },
          { icon: '○', label: 'Pending', cls: 'stage-icon idle'    },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
            <div className={item.cls} style={{ width: 18, height: 18, fontSize: 9 }}>{item.icon}</div>
            {item.label}
          </div>
        ))}
      </div>

      {/* Trigger Pipeline Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div className="card" style={{ width: 480, maxWidth: '90vw', boxShadow: 'var(--shadow-lg)' }}>
            <div className="card-header">
              <div className="card-title">
                <Play size={16} color="var(--accent-light)" />
                <span>Trigger New CI/CD Pipeline</span>
              </div>
              <button className="topbar-icon-btn" style={{ width: 24, height: 24 }} onClick={() => setModalOpen(false)}>
                <X size={14} />
              </button>
            </div>
            <form onSubmit={handleTrigger} style={{ padding: '16px 20px' }}>
              <div className="form-group">
                <label className="form-label">Service / Project</label>
                <select
                  className="form-input"
                  value={newRun.project}
                  onChange={(e) => setNewRun({ ...newRun, project: e.target.value })}
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Git Branch</label>
                <select
                  className="form-input"
                  value={newRun.branch}
                  onChange={(e) => setNewRun({ ...newRun, branch: e.target.value })}
                >
                  <option value="main">main</option>
                  <option value="develop">develop</option>
                  <option value="feature/jwt-auth">feature/jwt-auth</option>
                  <option value="hotfix/pool-size">hotfix/pool-size</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Commit Message</label>
                <input
                  type="text"
                  className="form-input"
                  value={newRun.commitMsg}
                  onChange={(e) => setNewRun({ ...newRun, commitMsg: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Play size={13} /> Start Pipeline Run
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
