import { useNavigate } from 'react-router-dom';
import { Package, CheckCircle, XCircle, AlertTriangle, ArrowRight, Clock, Filter } from 'lucide-react';
import { releases, deploymentHistory } from '../data/mockData.js';

const statusBadge = (s) => {
  if (s === 'success') return <span className="badge badge-success">✓ Success</span>;
  if (s === 'failed')  return <span className="badge badge-danger">✗ Failed</span>;
  if (s === 'rollback') return <span className="badge badge-warning">↩ Rollback</span>;
  if (s === 'blocked') return <span className="badge badge-danger">⊘ Blocked</span>;
  return <span className="badge badge-muted">{s}</span>;
};

export default function Releases() {
  const navigate = useNavigate();

  return (
    <div className="page-enter">
      {/* Blocked release alert */}
      <div className="alert-banner danger" style={{ cursor: 'pointer' }} onClick={() => navigate('/approvals')}>
        <AlertTriangle size={18} />
        <div style={{ flex: 1 }}>
          <strong>Release v2.1.0 is BLOCKED</strong> — Policy violation: Code coverage 67% (required ≥80%) · Awaiting fix &amp; approval
        </div>
        <button className="btn btn-danger btn-sm">Review <ArrowRight size={13} /></button>
      </div>

      <div className="section-header">
        <div>
          <div className="section-title"><Package size={16} /> Releases</div>
          <div className="section-subtitle">{releases.length} releases across all environments</div>
        </div>
        <button className="btn btn-ghost btn-sm"><Filter size={13} /> Filter</button>
      </div>

      {/* Release Table */}
      <div className="table-wrapper" style={{ marginBottom: 32 }}>
        <table className="rc-table">
          <thead>
            <tr>
              <th>Release</th>
              <th>Project</th>
              <th>Status</th>
              <th>Risk</th>
              <th>Environment</th>
              <th>Date</th>
              <th>Duration</th>
              <th>Approved By</th>
            </tr>
          </thead>
          <tbody>
            {releases.map(r => (
              <tr key={r.id} onClick={() => r.status === 'blocked' && navigate('/approvals')}>
                <td>
                  <code className="mono" style={{ color: 'var(--accent-primary)', fontSize: 13, fontWeight: 600 }}>{r.id}</code>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{r.project}</td>
                <td>{statusBadge(r.status)}</td>
                <td><span className={`risk-badge risk-${r.risk}`}>{r.risk}</span></td>
                <td>
                  <span className={`badge ${r.deploy === 'Production' ? 'badge-danger' : 'badge-info'}`} style={{ fontSize: 11 }}>
                    {r.deploy}
                  </span>
                </td>
                <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.date}</td>
                <td><span className="mono" style={{ fontSize: 12 }}>{r.duration}</span></td>
                <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {r.approvedBy || <span style={{ color: 'var(--danger)', fontStyle: 'italic' }}>Pending</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Deployment History */}
      <div>
        <div className="section-header">
          <div className="section-title"><Clock size={16} /> Deployment History</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {deploymentHistory.map((d, i) => (
            <div key={i} className="card" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
              <div>
                {d.status === 'success'  && <CheckCircle size={18} color="var(--success)" />}
                {d.status === 'rollback' && <AlertTriangle size={18} color="var(--warning)" />}
              </div>
              <code className="mono" style={{ color: 'var(--accent-primary)', fontSize: 14, fontWeight: 600, minWidth: 70 }}>{d.version}</code>
              <span className={`badge ${d.env === 'Production' ? 'badge-danger' : 'badge-info'}`} style={{ fontSize: 11 }}>{d.env}</span>
              <span style={{ flex: 1, fontSize: 13, color: 'var(--text-muted)' }}>{d.date}</span>
              <span className="mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.duration}</span>
              <span className={`badge ${d.status === 'success' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: 11 }}>{d.health}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
