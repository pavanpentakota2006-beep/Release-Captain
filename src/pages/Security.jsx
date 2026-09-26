import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, CheckCircle, XCircle, Info, Package, Play, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';
import { pipelines } from '../data/mockData.js';

const initialFindings = [
  { id: 'CVE-2024-5018', severity: 'high',   pkg: 'spring-security:6.1.0',   desc: 'Authentication bypass via specially crafted JWT tokens', fix: 'Upgrade to 6.1.5+' },
  { id: 'CVE-2024-3119', severity: 'medium', pkg: 'jackson-databind:2.15.0', desc: 'Deserialization of untrusted data in JSON parser',     fix: 'Upgrade to 2.15.3+' },
  { id: 'CVE-2024-2912', severity: 'medium', pkg: 'commons-compress:1.23.0', desc: 'Denial of service via crafted archive extraction',      fix: 'Upgrade to 1.26.0+' },
  { id: 'CVE-2024-1145', severity: 'medium', pkg: 'netty-handler:4.1.94',    desc: 'HTTP/2 memory leak under high concurrent load',          fix: 'Upgrade to 4.1.100+' },
  { id: 'SEC-001',       severity: 'low',    pkg: 'application.yml',         desc: 'DB credentials visible in debug logger output',          fix: 'Set spring.jpa.show-sql=false' },
  { id: 'SEC-002',       severity: 'low',    pkg: 'Dockerfile',              desc: 'Container running with root user permissions',          fix: 'Add USER nonroot directive' },
];

const sevBadge = (s) => ({
  critical: <span className="badge badge-danger">CRITICAL</span>,
  high:     <span className="badge" style={{ background: 'rgba(249,115,22,.15)', color: 'var(--risk-high)', border: '1px solid rgba(249,115,22,.25)' }}>HIGH</span>,
  medium:   <span className="badge badge-warning">MEDIUM</span>,
  low:      <span className="badge badge-muted">LOW</span>,
}[s]);

export default function Security() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [findings, setFindings] = useState(initialFindings);
  const [isScanning, setIsScanning] = useState(false);
  const [scanNotice, setScanNotice] = useState(null);
  const [fixedNotice, setFixedNotice] = useState(null);

  const filtered = filter === 'all' ? findings : findings.filter(f => f.severity === filter);

  const runScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanNotice('Vulnerability scan completed. 1 High, 3 Medium, 2 Low CVEs confirmed.');
      setTimeout(() => setScanNotice(null), 4000);
    }, 1200);
  };

  const handleFixPR = (cveId) => {
    setFixedNotice(`Created automated PR #214 for ${cveId} with updated dependency POM.`);
    setTimeout(() => setFixedNotice(null), 4000);
  };

  return (
    <div className="page-enter">
      {/* Toast Notice */}
      {scanNotice && (
        <div className="alert-banner success" style={{ marginBottom: 12 }}>
          <CheckCircle size={16} />
          <div style={{ flex: 1 }}>{scanNotice}</div>
          <span className="badge badge-success">Scanned</span>
        </div>
      )}

      {fixedNotice && (
        <div className="alert-banner info" style={{ marginBottom: 12 }}>
          <Sparkles size={16} />
          <div style={{ flex: 1 }}>{fixedNotice}</div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/approvals')}>
            View in Approvals <ArrowRight size={11} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="page-header" style={{ marginBottom: 14 }}>
        <div className="page-header-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}>
              <Shield size={16} />
            </div>
            <h1>Security &amp; Vulnerability Governance</h1>
          </div>
          <p>Real-time dependency auditing, container image scanning, and automated patch pull requests</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-primary btn-sm" onClick={runScan} disabled={isScanning}>
            {isScanning ? <RefreshCw size={13} className="spin" /> : <Play size={13} />}
            {isScanning ? 'Scanning Dependencies...' : 'Run Security Scan'}
          </button>
        </div>
      </div>

      {/* Score cards */}
      <div className="stat-cards-grid" style={{ marginBottom: 16 }}>
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setFilter('all')}>
          <div className="stat-card-label">Critical CVEs</div>
          <div className="stat-card-row">
            <span className="stat-card-value" style={{ color: 'var(--success)' }}>0</span>
            <div className="stat-card-icon" style={{ background: 'var(--success-dim)', color: 'var(--success)' }}>
              <CheckCircle size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>Passes Gate</span>
          </div>
        </div>

        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setFilter('high')}>
          <div className="stat-card-label">High Severity</div>
          <div className="stat-card-row">
            <span className="stat-card-value" style={{ color: 'var(--danger)' }}>1</span>
            <div className="stat-card-icon" style={{ background: 'var(--danger-dim)', color: 'var(--danger)' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="stat-card-trend" style={{ color: 'var(--danger)' }}>
            <span>spring-security:6.1.0</span>
          </div>
        </div>

        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setFilter('medium')}>
          <div className="stat-card-label">Medium Severity</div>
          <div className="stat-card-row">
            <span className="stat-card-value" style={{ color: 'var(--warning)' }}>3</span>
            <div className="stat-card-icon" style={{ background: 'var(--warning-dim)', color: 'var(--warning)' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>Non-blocking</span>
          </div>
        </div>

        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setFilter('low')}>
          <div className="stat-card-label">Low Severity</div>
          <div className="stat-card-row">
            <span className="stat-card-value" style={{ color: 'var(--text-secondary)' }}>2</span>
            <div className="stat-card-icon" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
              <Info size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>Advisory</span>
          </div>
        </div>

        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/risk')}>
          <div className="stat-card-label">Security Gate</div>
          <div className="stat-card-row">
            <span className="stat-card-value" style={{ fontSize: 16, color: 'var(--warning)' }}>WARNING</span>
            <div className="stat-card-icon" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--warning)' }}>
              <Shield size={18} />
            </div>
          </div>
          <div className="stat-card-trend" style={{ color: 'var(--warning)' }}>
            <span>Review required</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="section-header" style={{ marginBottom: 12 }}>
        <div className="section-title"><Shield size={15} /> Identified Vulnerabilities</div>
        <div className="tab-strip" style={{ margin: 0 }}>
          {['all', 'high', 'medium', 'low'].map(f => (
            <button
              key={f}
              className={`tab-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'all' ? findings.length : findings.filter(x => x.severity === f).length})
            </button>
          ))}
        </div>
      </div>

      {/* Findings List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((f, i) => (
          <div
            key={i}
            className="card"
            style={{
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              borderLeft: f.severity === 'high' ? '3px solid var(--danger)' : f.severity === 'medium' ? '3px solid var(--warning)' : '3px solid var(--text-muted)'
            }}
          >
            <div style={{ minWidth: 90 }}>{sevBadge(f.severity)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <code className="mono" style={{ color: 'var(--accent-light)', fontSize: 12, fontWeight: 700 }}>{f.id}</code>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{f.desc}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Package size={11} /> {f.pkg}
              </div>
            </div>

            <div style={{ minWidth: 220, background: 'var(--bg-elevated)', borderRadius: 6, padding: '8px 12px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div>
                <div style={{ fontSize: 9.5, color: 'var(--success)', fontWeight: 700, textTransform: 'uppercase' }}>Recommended Fix</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{f.fix}</div>
              </div>
              <button
                className="btn btn-primary btn-sm"
                style={{ fontSize: 10.5, padding: '3px 8px' }}
                onClick={() => handleFixPR(f.id)}
              >
                Auto-Fix
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
