import { useState } from 'react';
import { CheckCircle, XCircle, Shield, GitBranch, Rocket, User, Clock, AlertTriangle, ChevronRight, CheckSquare } from 'lucide-react';
import { policyRules } from '../data/mockData.js';

const APPROVAL = {
  release: 'v2.1.0',
  project: 'E-Commerce Platform',
  pipeline: '#142',
  risk: 'high',
  aiRec: 'REJECT — Policy violations unresolved',
  tests: { unit: '126/126 ✅', integration: '38/40 ❌', api: '24/24 ✅' },
  security: { critical: 0, high: 1 },
  policyPass: false,
};

export default function Approvals() {
  const [approved, setApproved] = useState(null);

  return (
    <div className="page-enter">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <CheckSquare size={18} color="var(--accent-primary)" />
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Pending Approvals</h2>
        <span className="badge badge-danger" style={{ marginLeft: 8 }}>1 Pending</span>
      </div>

      {approved === 'approved' && (
        <div className="alert-banner success">
          <CheckCircle size={18} />
          <strong>Release {APPROVAL.release} approved!</strong> Deployment agent is now initiating deployment to Production.
        </div>
      )}
      {approved === 'rejected' && (
        <div className="alert-banner danger">
          <XCircle size={18} />
          <strong>Release {APPROVAL.release} rejected.</strong> Team has been notified. Fix policy violations before re-requesting.
        </div>
      )}

      {!approved && (
        <div className="approval-card">
          {/* Banner */}
          <div className="approval-banner">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Release Approval Request</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>
                  Release <span style={{ color: 'var(--accent-primary)' }}>{APPROVAL.release}</span>
                </h3>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{APPROVAL.project} · Pipeline {APPROVAL.pipeline}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Risk Level</div>
                <span className={`risk-badge risk-${APPROVAL.risk}`} style={{ fontSize: 14, padding: '6px 18px' }}>HIGH</span>
              </div>
            </div>

            {/* AI Recommendation */}
            <div style={{
              background: 'rgba(239,68,68,.1)',
              border: '1px solid rgba(239,68,68,.2)',
              borderRadius: 10,
              padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div className="sidebar-logo-icon" style={{ width: 32, height: 32, flexShrink: 0 }}>
                <AlertTriangle size={14} color="white" />
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--danger)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Recommendation</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{APPROVAL.aiRec}</div>
              </div>
            </div>
          </div>

          <div className="approval-body">
            <div className="grid-2" style={{ marginBottom: 24 }}>
              {/* Test Results */}
              <div>
                <div style={{ fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <GitBranch size={14} /> Test Results
                </div>
                {Object.entries(APPROVAL.tests).map(([name, val]) => {
                  const pass = val.includes('✅');
                  return (
                    <div key={name} className="metric-row">
                      <span className="metric-key" style={{ textTransform: 'capitalize' }}>{name.replace('unit','Unit').replace('integration','Integration').replace('api','API')} Tests</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: pass ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>{val}</span>
                    </div>
                  );
                })}
              </div>

              {/* Security */}
              <div>
                <div style={{ fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Shield size={14} /> Security Summary
                </div>
                <div className="metric-row">
                  <span className="metric-key">Critical</span>
                  <span style={{ color: APPROVAL.security.critical > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 700 }}>
                    {APPROVAL.security.critical === 0 ? '✓ 0' : APPROVAL.security.critical}
                  </span>
                </div>
                <div className="metric-row">
                  <span className="metric-key">High</span>
                  <span style={{ color: 'var(--risk-high)', fontWeight: 700 }}>{APPROVAL.security.high} found</span>
                </div>
              </div>
            </div>

            {/* Policy Check */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckSquare size={14} /> Release Policy Check
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {policyRules.map(rule => (
                  <div key={rule.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px',
                    background: rule.status === 'fail' ? 'var(--danger-dim)' : rule.status === 'pass' ? 'var(--success-dim)' : 'var(--bg-elevated)',
                    border: `1px solid ${rule.status === 'fail' ? 'rgba(239,68,68,.2)' : rule.status === 'pass' ? 'rgba(16,185,129,.2)' : 'var(--border-subtle)'}`,
                    borderRadius: 8,
                  }}>
                    {rule.status === 'pass'    && <CheckCircle size={15} color="var(--success)" />}
                    {rule.status === 'fail'    && <XCircle size={15} color="var(--danger)" />}
                    {rule.status === 'pending' && <Clock size={15} color="var(--text-muted)" />}
                    <span style={{ fontSize: 13, flex: 1, color: rule.status === 'fail' ? 'var(--danger)' : rule.status === 'pass' ? 'var(--success)' : 'var(--text-secondary)' }}>
                      {rule.rule}
                    </span>
                    <span className={`badge badge-muted`} style={{ fontSize: 10 }}>{rule.category}</span>
                    {rule.detail && <span style={{ fontSize: 11, color: 'var(--danger)' }}>{rule.detail}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="approval-actions">
              <button
                className="btn btn-danger btn-lg"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setApproved('rejected')}
              >
                <XCircle size={16} /> Reject Release
              </button>
              <button
                className="btn btn-success btn-lg"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setApproved('approved')}
              >
                <CheckCircle size={16} /> Approve Release
              </button>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 12 }}>
              ⚠ This action will be logged in the audit trail
            </p>
          </div>
        </div>
      )}

      {!approved && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)' }}>Recently Processed</div>
          <div className="table-wrapper">
            <table className="rc-table">
              <thead>
                <tr><th>Release</th><th>Project</th><th>Decision</th><th>By</th><th>Time</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td><code className="mono" style={{ color: 'var(--accent-primary)' }}>v2.0.9</code></td>
                  <td>Medical Inventory API</td>
                  <td><span className="badge badge-success">Approved</span></td>
                  <td>Pavan Kumar</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>Yesterday 11:00 AM</td>
                </tr>
                <tr>
                  <td><code className="mono" style={{ color: 'var(--accent-primary)' }}>v2.0.7</code></td>
                  <td>AI Study Planner</td>
                  <td><span className="badge badge-success">Approved</span></td>
                  <td>Ananya Sharma</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>5 days ago</td>
                </tr>
                <tr>
                  <td><code className="mono" style={{ color: 'var(--accent-primary)' }}>v2.0.8</code></td>
                  <td>Auth Microservice</td>
                  <td><span className="badge badge-warning">Rollback</span></td>
                  <td>Admin</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>3 days ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
