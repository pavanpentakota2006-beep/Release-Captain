import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, CheckCircle, XCircle, AlertTriangle, ArrowRight, Clock,
  Filter, Play, X, ExternalLink, RotateCcw
} from 'lucide-react';
import { releases as initialReleases, deploymentHistory } from '../data/mockData.js';

const statusBadge = (s) => {
  if (s === 'success') return <span className="badge badge-success">✓ Success</span>;
  if (s === 'failed')  return <span className="badge badge-danger">✗ Failed</span>;
  if (s === 'rollback') return <span className="badge badge-warning">↩ Rollback</span>;
  if (s === 'blocked') return <span className="badge badge-danger">⊘ Blocked</span>;
  return <span className="badge badge-muted">{s}</span>;
};

export default function Releases() {
  const navigate = useNavigate();
  const [releaseList, setReleaseList] = useState(initialReleases);
  const [envFilter, setEnvFilter] = useState('ALL');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState(null);

  const filteredReleases = releaseList.filter(r => {
    if (envFilter === 'ALL') return true;
    return r.deploy.toUpperCase() === envFilter;
  });

  return (
    <div className="page-enter">
      {/* Blocked release alert */}
      <div className="alert-banner danger" style={{ cursor: 'pointer', marginBottom: 14 }} onClick={() => navigate('/approvals')}>
        <AlertTriangle size={18} />
        <div style={{ flex: 1 }}>
          <strong>Release v2.1.0 is BLOCKED</strong> — Policy violation: Code coverage 67% (required ≥80%) · Awaiting fix &amp; approval
        </div>
        <button className="btn btn-danger btn-sm">Review <ArrowRight size={13} /></button>
      </div>

      <div className="section-header">
        <div>
          <div className="section-title"><Package size={16} /> Releases</div>
          <div className="section-subtitle">{releaseList.length} releases across all environments</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className={`btn btn-ghost btn-sm ${filterOpen ? 'btn-primary' : ''}`} onClick={() => setFilterOpen(!filterOpen)}>
            <Filter size={13} /> Filter
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/deployments')}>
            <Play size={13} /> Deploy Release
          </button>
        </div>
      </div>

      {/* Filter strip */}
      {filterOpen && (
        <div className="tab-strip" style={{ marginBottom: 14 }}>
          {['ALL', 'PRODUCTION', 'STAGING'].map(env => (
            <button
              key={env}
              className={`tab-btn ${envFilter === env ? 'active' : ''}`}
              onClick={() => setEnvFilter(env)}
            >
              {env === 'ALL' ? 'All Environments' : env.charAt(0) + env.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      )}

      {/* Release Table */}
      <div className="table-wrapper" style={{ marginBottom: 28 }}>
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
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReleases.map(r => (
              <tr
                key={r.id}
                onClick={() => {
                  if (r.status === 'blocked') {
                    navigate('/approvals');
                  } else {
                    setSelectedRelease(r);
                  }
                }}
                style={{ cursor: 'pointer' }}
                title="Click to view release details"
              >
                <td>
                  <code className="mono" style={{ color: 'var(--accent-light)', fontSize: 13, fontWeight: 700 }}>{r.id}</code>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>{r.project}</td>
                <td>{statusBadge(r.status)}</td>
                <td><span className={`risk-badge risk-${r.risk}`}>{r.risk}</span></td>
                <td>
                  <span className={`badge ${r.deploy === 'Production' ? 'badge-danger' : 'badge-accent'}`} style={{ fontSize: 11 }}>
                    {r.deploy}
                  </span>
                </td>
                <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.date}</td>
                <td><span className="mono" style={{ fontSize: 12 }}>{r.duration}</span></td>
                <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {r.approvedBy || <span style={{ color: 'var(--danger)', fontStyle: 'italic', fontWeight: 600 }}>Pending Approval</span>}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '3px 8px', fontSize: 11 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (r.status === 'blocked') navigate('/approvals');
                      else setSelectedRelease(r);
                    }}
                  >
                    {r.status === 'blocked' ? 'Review Gate' : 'Details'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Deployment History */}
      <div>
        <div className="section-header">
          <div className="section-title"><Clock size={16} /> Recent Production Deployments</div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/deployments')}>
            Full Deployment History <ArrowRight size={12} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {deploymentHistory.map((d, i) => (
            <div
              key={i}
              className="card"
              style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 18, cursor: 'pointer', transition: 'border-color 0.15s ease' }}
              onClick={() => {
                if (d.status === 'rollback') navigate('/rollback');
                else navigate('/deployments');
              }}
              title="Click to inspect deployment"
            >
              <div>
                {d.status === 'success'  && <CheckCircle size={18} color="var(--success)" />}
                {d.status === 'rollback' && <AlertTriangle size={18} color="var(--warning)" />}
              </div>
              <code className="mono" style={{ color: 'var(--accent-light)', fontSize: 14, fontWeight: 700, minWidth: 70 }}>{d.version}</code>
              <span className={`badge ${d.env === 'Production' ? 'badge-danger' : 'badge-accent'}`} style={{ fontSize: 11 }}>{d.env}</span>
              <span style={{ flex: 1, fontSize: 13, color: 'var(--text-secondary)' }}>{d.date}</span>
              <span className="mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.duration}</span>
              <span className={`badge ${d.status === 'success' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: 11 }}>{d.health}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Release Details Modal */}
      {selectedRelease && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: 520, maxWidth: '90vw', boxShadow: 'var(--shadow-lg)' }}>
            <div className="card-header">
              <div className="card-title">
                <Package size={16} color="var(--accent-light)" />
                <span>Release Summary: {selectedRelease.id}</span>
              </div>
              <button className="topbar-icon-btn" style={{ width: 24, height: 24 }} onClick={() => setSelectedRelease(null)}>
                <X size={14} />
              </button>
            </div>
            <div style={{ padding: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Project / Microservice</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>{selectedRelease.project}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Target Environment</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>{selectedRelease.deploy}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Status</div>
                  <div style={{ marginTop: 2 }}>{statusBadge(selectedRelease.status)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Release Risk Tier</div>
                  <div style={{ marginTop: 2 }}><span className={`risk-badge risk-${selectedRelease.risk}`}>{selectedRelease.risk}</span></div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setSelectedRelease(null)}>Close</button>
                <button className="btn btn-primary btn-sm" onClick={() => {
                  setSelectedRelease(null);
                  navigate('/deployments');
                }}>
                  Deploy Release
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
