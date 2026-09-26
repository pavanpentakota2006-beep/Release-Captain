import { FileText, CheckCircle, XCircle, AlertTriangle, Clock, Filter } from 'lucide-react';
import { auditLogs } from '../data/mockData.js';

const actionColor = (action) => {
  if (action.includes('APPROVED')) return 'var(--success)';
  if (action.includes('ROLLBACK') || action.includes('BLOCKED')) return 'var(--danger)';
  if (action.includes('AI')) return 'var(--accent-primary)';
  return 'var(--text-muted)';
};

const resultBadge = (r) => {
  if (r === 'success') return <span className="badge badge-success">✓ Success</span>;
  if (r === 'blocked') return <span className="badge badge-danger">⊘ Blocked</span>;
  if (r === 'running') return <span className="badge badge-accent">● Running</span>;
  return <span className="badge badge-muted">{r}</span>;
};

export default function AuditLogs() {
  return (
    <div className="page-enter">
      <div className="section-header">
        <div>
          <div className="section-title"><FileText size={16} /> Audit Logs</div>
          <div className="section-subtitle">Complete record of all actions and decisions</div>
        </div>
        <button className="btn btn-ghost btn-sm"><Filter size={13} /> Filter</button>
      </div>

      <div className="table-wrapper">
        <table className="rc-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Action</th>
              <th>Resource</th>
              <th>Time</th>
              <th>Result</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map(log => (
              <tr key={log.id}>
                <td style={{ color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>#{log.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: log.user === 'System' ? 'var(--bg-elevated)' : 'linear-gradient(135deg, #4da6ff, #22d3ee)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700, flexShrink: 0,
                      color: log.user === 'System' ? 'var(--text-muted)' : 'white',
                    }}>
                      {log.user === 'System' ? '⚙' : log.user.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{log.user}</span>
                  </div>
                </td>
                <td>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: actionColor(log.action), background: 'var(--bg-elevated)', padding: '2px 8px', borderRadius: 4 }}>
                    {log.action}
                  </code>
                </td>
                <td style={{ color: 'var(--text-primary)', fontSize: 13 }}>{log.resource}</td>
                <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{log.time}</td>
                <td>{resultBadge(log.result)}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-disabled)' }}>{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 16, padding: '12px 20px', background: 'var(--bg-elevated)', borderRadius: 8, fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <FileText size={13} />
        Logs are immutable and retained for 90 days. Export available in CSV, JSON formats.
      </div>
    </div>
  );
}
