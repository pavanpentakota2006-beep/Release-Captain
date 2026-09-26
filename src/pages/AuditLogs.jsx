import { useState } from 'react';
import { FileText, CheckCircle, XCircle, AlertTriangle, Clock, Filter, Download } from 'lucide-react';
import { auditLogs as initialAuditLogs } from '../data/mockData.js';

const actionColor = (action) => {
  if (action.includes('APPROVED')) return 'var(--success)';
  if (action.includes('ROLLBACK') || action.includes('BLOCKED')) return 'var(--danger)';
  if (action.includes('AI')) return 'var(--accent-light)';
  return 'var(--text-muted)';
};

const resultBadge = (r) => {
  if (r === 'success') return <span className="badge badge-success">✓ Success</span>;
  if (r === 'blocked') return <span className="badge badge-danger">⊘ Blocked</span>;
  if (r === 'running') return <span className="badge badge-accent">● Running</span>;
  return <span className="badge badge-muted">{r}</span>;
};

export default function AuditLogs() {
  const [logs, setLogs] = useState(initialAuditLogs);
  const [filterAction, setFilterAction] = useState('ALL');
  const [filterOpen, setFilterOpen] = useState(false);

  const filteredLogs = logs.filter(log => {
    if (filterAction === 'ALL') return true;
    return log.action.includes(filterAction);
  });

  const exportCSV = () => {
    const headers = 'ID,User,Action,Resource,Time,Result,IP\n';
    const rows = filteredLogs.map(l => `${l.id},"${l.user}","${l.action}","${l.resource}","${l.time}","${l.result}","${l.ip}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `release-captain-audit-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(filteredLogs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `release-captain-audit-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-enter">
      <div className="section-header">
        <div>
          <div className="section-title"><FileText size={16} /> Audit Logs &amp; Compliance Trail</div>
          <div className="section-subtitle">Immutable cryptographic log of all deployments, approvals, and AI decisions</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={`btn btn-ghost btn-sm ${filterOpen ? 'btn-primary' : ''}`} onClick={() => setFilterOpen(!filterOpen)}>
            <Filter size={13} /> Filter
          </button>
          <button className="btn btn-ghost btn-sm" onClick={exportCSV}>
            <Download size={13} /> Export CSV
          </button>
          <button className="btn btn-primary btn-sm" onClick={exportJSON}>
            <Download size={13} /> Export JSON
          </button>
        </div>
      </div>

      {filterOpen && (
        <div className="tab-strip" style={{ marginBottom: 14 }}>
          {['ALL', 'APPROVED', 'ROLLBACK', 'POLICY', 'AI'].map(act => (
            <button
              key={act}
              className={`tab-btn ${filterAction === act ? 'active' : ''}`}
              onClick={() => setFilterAction(act)}
            >
              {act === 'ALL' ? 'All Activities' : act.charAt(0) + act.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      )}

      <div className="table-wrapper">
        <table className="rc-table">
          <thead>
            <tr>
              <th>Log ID</th>
              <th>User / Agent</th>
              <th>Action Triggered</th>
              <th>Target Resource</th>
              <th>Timestamp</th>
              <th>Execution Result</th>
              <th>Client IP</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id}>
                <td style={{ color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>#{log.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%',
                      background: log.user === 'System' ? 'var(--bg-elevated)' : 'linear-gradient(135deg, #3b82f6, #7c3aed)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700, flexShrink: 0,
                      color: log.user === 'System' ? 'var(--text-muted)' : 'white',
                    }}>
                      {log.user === 'System' ? '⚙' : log.user.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{log.user}</span>
                  </div>
                </td>
                <td>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: actionColor(log.action), background: 'var(--bg-elevated)', padding: '2px 8px', borderRadius: 4 }}>
                    {log.action}
                  </code>
                </td>
                <td style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 500 }}>{log.resource}</td>
                <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{log.time}</td>
                <td>{resultBadge(log.result)}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-disabled)' }}>{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 16, padding: '12px 20px', background: 'var(--bg-elevated)', borderRadius: 8, fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--border-subtle)' }}>
        <FileText size={14} color="var(--accent-light)" />
        <span>Logs are tamper-proof and cryptographically signed. Stored according to SOC2 Type II compliance rules for 90 days.</span>
      </div>
    </div>
  );
}
