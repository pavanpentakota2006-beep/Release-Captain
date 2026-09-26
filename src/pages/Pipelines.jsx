import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, AlertTriangle, GitBranch, Filter, RefreshCw, Play, ArrowRight } from 'lucide-react';
import { pipelines } from '../data/mockData.js';

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

  return (
    <div className="page-enter">
      {/* Alert for failed pipeline */}
      <div className="alert-banner danger" style={{ cursor: 'pointer' }} onClick={() => navigate('/pipelines/142')}>
        <XCircle size={18} />
        <div style={{ flex: 1 }}>
          <strong>Pipeline #142 failed</strong> — E-Commerce Platform · Integration tests failing · AI analysis available
        </div>
        <button className="btn btn-danger btn-sm">Analyze <ArrowRight size={13} /></button>
      </div>

      {/* Header */}
      <div className="section-header">
        <div>
          <div className="section-title"><GitBranch size={16} /> CI/CD Pipelines</div>
          <div className="section-subtitle">{pipelines.length} pipelines across {[...new Set(pipelines.map(p => p.project))].length} projects</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost btn-sm"><Filter size={13} /> Filter</button>
          <button className="btn btn-ghost btn-sm"><RefreshCw size={13} /> Refresh</button>
          <button className="btn btn-primary btn-sm"><Play size={13} /> Trigger Pipeline</button>
        </div>
      </div>

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
            {pipelines.map(p => (
              <tr key={p.id} onClick={() => navigate(`/pipelines/${p.id}`)}>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>
                    #{p.id}
                    {p.status === 'running' && (
                      <span style={{ marginLeft: 8, fontSize: 10, background: 'var(--accent-dim)', color: 'var(--accent-primary)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>LIVE</span>
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
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-primary)' }}>{p.commit}</code>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.commitMsg}</div>
                </td>
                <td>
                  <div className="pipeline-stages">
                    {p.stages.map((s, i) => (
                      <div key={s.name} style={{ display: 'flex', alignItems: 'center' }}>
                        {i > 0 && <div className="stage-connector" />}
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
    </div>
  );
}
