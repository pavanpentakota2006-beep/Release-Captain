import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Info, Package } from 'lucide-react';
import { pipelines } from '../data/mockData.js';

const scanData = {
  critical: 0,
  high: 1,
  medium: 3,
  low: 7,
  lastScan: '10:30 AM today',
  findings: [
    { id: 'CVE-2024-5018', severity: 'high',   pkg: 'spring-security:6.1.0',      desc: 'Authentication bypass via specially crafted JWT tokens', fix: 'Upgrade to 6.1.5+' },
    { id: 'CVE-2024-3119', severity: 'medium', pkg: 'jackson-databind:2.15.0',    desc: 'Deserialization of untrusted data', fix: 'Upgrade to 2.15.3+' },
    { id: 'CVE-2024-2912', severity: 'medium', pkg: 'commons-compress:1.23.0',    desc: 'Denial of service via crafted archive', fix: 'Upgrade to 1.26.0+' },
    { id: 'CVE-2024-1145', severity: 'medium', pkg: 'netty-handler:4.1.94',       desc: 'HTTP/2 memory leak under high load', fix: 'Upgrade to 4.1.100+' },
    { id: 'SEC-001',       severity: 'low',    pkg: 'application.yml',             desc: 'DB password visible in log output (DEBUG level)', fix: 'Set spring.jpa.show-sql=false in production' },
    { id: 'SEC-002',       severity: 'low',    pkg: 'Dockerfile',                  desc: 'Running as root user in container', fix: 'Add USER nonroot directive' },
  ],
};

const sevColor = (s) => ({
  critical: 'var(--danger)',
  high: 'var(--risk-high)',
  medium: 'var(--warning)',
  low: 'var(--text-muted)',
}[s]);

const sevBadge = (s) => ({
  critical: <span className="badge badge-danger">CRITICAL</span>,
  high:     <span className="badge" style={{ background: 'rgba(249,115,22,.15)', color: 'var(--risk-high)', border: '1px solid rgba(249,115,22,.25)' }}>HIGH</span>,
  medium:   <span className="badge badge-warning">MEDIUM</span>,
  low:      <span className="badge badge-muted">LOW</span>,
}[s]);

export default function Security() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? scanData.findings : scanData.findings.filter(f => f.severity === filter);

  return (
    <div className="page-enter">
      {/* Score cards */}
      <div className="grid-3" style={{ marginBottom: 28 }}>
        {[
          { label: 'Critical', count: scanData.critical, color: 'var(--danger)', icon: <XCircle size={18} />, bg: 'var(--danger-dim)' },
          { label: 'High',     count: scanData.high,     color: 'var(--risk-high)', icon: <AlertTriangle size={18} />, bg: 'rgba(249,115,22,.12)' },
          { label: 'Medium',   count: scanData.medium,   color: 'var(--warning)', icon: <AlertTriangle size={18} />, bg: 'var(--warning-dim)' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ textAlign: 'center' }}>
            <div className="stat-icon" style={{ background: s.bg, color: s.color, margin: '0 auto 12px' }}>{s.icon}</div>
            <div className="stat-value" style={{ color: s.color, fontSize: s.count === 0 ? 36 : 42 }}>{s.count}</div>
            <div className="stat-label">{s.label} Vulnerabilities</div>
            {s.count === 0 && <div style={{ marginTop: 6 }}><span className="badge badge-success">✓ Clean</span></div>}
          </div>
        ))}
      </div>

      {/* Low + last scan row */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        <div className="card p-6" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="stat-icon" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
            <Info size={18} />
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text-secondary)' }}>{scanData.low}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Low Vulnerabilities</div>
          </div>
        </div>
        <div className="card p-6" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="stat-icon" style={{ background: 'var(--success-dim)', color: 'var(--success)' }}>
            <Shield size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Last Security Scan</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{scanData.lastScan} · Pipeline #142</div>
            <span className="badge badge-warning" style={{ marginTop: 8 }}>Action Required</span>
          </div>
        </div>
      </div>

      {/* Findings */}
      <div className="section-header">
        <div className="section-title"><Shield size={16} /> Security Findings</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all','high','medium','low'].map(f => (
            <button key={f} className={`tab-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)} style={{ fontSize: 12 }}>
              {f.charAt(0).toUpperCase() + f.slice(1)} {f === 'all' ? `(${scanData.findings.length})` : `(${scanData.findings.filter(x=>x.severity===f).length})`}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((f, i) => (
          <div key={i} className="card p-6" style={{ display: 'flex', gap: 16, alignItems: 'flex-start', borderLeft: `3px solid ${sevColor(f.severity)}` }}>
            <div style={{ minWidth: 100 }}>{sevBadge(f.severity)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <code className="mono" style={{ color: 'var(--accent-primary)', fontSize: 12, fontWeight: 600 }}>{f.id}</code>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{f.desc}</span>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 5, alignItems: 'center' }}>
                  <Package size={12} /> {f.pkg}
                </span>
              </div>
            </div>
            <div style={{ minWidth: 180, background: 'var(--success-dim)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 8, padding: '8px 12px' }}>
              <div style={{ fontSize: 10, color: 'var(--success)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Fix</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{f.fix}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
