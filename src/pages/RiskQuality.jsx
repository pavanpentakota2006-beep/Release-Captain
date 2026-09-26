import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart2, ShieldAlert, CheckCircle, XCircle, AlertTriangle,
  FileCheck, Shield, Zap, ArrowRight, RefreshCw, Sparkles, Filter,
  Code2, Bug, Database, Layers, CheckSquare
} from 'lucide-react';
import { policyRules, pipelines } from '../data/mockData.js';

export default function RiskQuality() {
  const navigate = useNavigate();
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditSuccess, setAuditSuccess] = useState(false);
  const [rules, setRules] = useState(policyRules);

  const runRiskAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditSuccess(true);
      setTimeout(() => setAuditSuccess(false), 4000);
    }, 1800);
  };

  return (
    <div className="page-enter">
      {/* Blocked release warning */}
      <div className="alert-banner danger" style={{ cursor: 'pointer', marginBottom: 12 }} onClick={() => navigate('/approvals')}>
        <AlertTriangle size={18} />
        <div style={{ flex: 1 }}>
          <strong>Quality Gate Blocked on Release v2.1.0</strong> — Code coverage is 67% (Mandatory policy requirement is ≥80%). Deployment to Production is restricted.
        </div>
        <button className="btn btn-danger btn-sm">
          Review Approval <ArrowRight size={13} />
        </button>
      </div>

      {auditSuccess && (
        <div className="alert-banner success" style={{ marginBottom: 12 }}>
          <CheckCircle size={16} />
          <div style={{ flex: 1 }}>
            <strong>Deep AI Risk Analysis Completed!</strong> Scanned 4 repositories, 182 test suites, and 6 active policy gates.
          </div>
          <span className="badge badge-success">Up to date</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header" style={{ marginBottom: 12 }}>
        <div className="page-header-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(249,115,22,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--orange)' }}>
              <BarChart2 size={16} />
            </div>
            <h1>Risk &amp; Quality Engineering</h1>
          </div>
          <p>Automated policy guardrails, code coverage governance, and AI-driven release risk scoring</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/approvals')}>
            <CheckSquare size={13} /> Approvals (3)
          </button>
          <button className="btn btn-primary btn-sm" onClick={runRiskAudit} disabled={isAuditing}>
            {isAuditing ? <RefreshCw size={13} className="spin" /> : <Sparkles size={13} />}
            {isAuditing ? 'Auditing Codebase...' : 'Run Deep AI Risk Audit'}
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="stat-cards-grid" style={{ marginBottom: 12 }}>
        <div className="stat-card">
          <span className="stat-card-label">Fleet Risk Index</span>
          <div className="stat-card-row">
            <span className="stat-card-value" style={{ color: 'var(--warning)' }}>38 / 100</span>
            <div className="stat-card-icon" style={{ background: 'var(--warning-dim)', color: 'var(--warning)' }}>
              <ShieldAlert size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-down">
            <span>Moderate Risk</span>
            <span className="stat-card-trend-sub">1 blocked release</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">Test Coverage</span>
          <div className="stat-card-row">
            <span className="stat-card-value" style={{ color: 'var(--orange)' }}>76.8%</span>
            <div className="stat-card-icon" style={{ background: 'var(--orange-dim)', color: 'var(--orange)' }}>
              <FileCheck size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-down">
            <span>Goal: ≥ 80%</span>
            <span className="stat-card-trend-sub">-3.2% gap</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">Quality Gates</span>
          <div className="stat-card-row">
            <span className="stat-card-value">5 / 6</span>
            <div className="stat-card-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>
              <CheckCircle size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>83% Passing</span>
            <span className="stat-card-trend-sub">1 failing</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">Flaky Tests</span>
          <div className="stat-card-row">
            <span className="stat-card-value" style={{ color: '#60a5fa' }}>2</span>
            <div className="stat-card-icon" style={{ background: 'var(--accent-dim)', color: 'var(--accent-light)' }}>
              <Bug size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>AI auto-quarantined</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">Tech Debt Estimate</span>
          <div className="stat-card-row">
            <span className="stat-card-value">14 hrs</span>
            <div className="stat-card-icon" style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa' }}>
              <Code2 size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>Sonar Grade: A-</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12, marginBottom: 12 }}>
        {/* Quality Gates Rules Table */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Shield size={15} color="var(--accent-light)" />
              <span>Mandatory Release Quality Gates</span>
            </div>
            <span className="badge badge-accent">6 Active Policies</span>
          </div>
          <div className="card-body" style={{ padding: '8px 12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rules.map(rule => (
                <div key={rule.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: 'var(--bg-elevated)', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {rule.status === 'pass' ? (
                      <CheckCircle size={16} color="var(--success)" />
                    ) : rule.status === 'fail' ? (
                      <XCircle size={16} color="var(--danger)" />
                    ) : (
                      <AlertTriangle size={16} color="var(--warning)" />
                    )}
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>{rule.rule}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        Category: {rule.category} {rule.detail && `· ${rule.detail}`}
                      </div>
                    </div>
                  </div>
                  <div>
                    {rule.status === 'pass' && <span className="badge badge-success">Passed</span>}
                    {rule.status === 'fail' && <span className="badge badge-danger">Failed</span>}
                    {rule.status === 'pending' && <span className="badge badge-warning">Awaiting</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Release Risk Predictor */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Sparkles size={15} color="#a78bfa" />
              <span>AI Risk Scoring Engine</span>
            </div>
            <span className="badge badge-violet">Release Captain ML</span>
          </div>
          <div className="card-body" style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>E-Commerce Platform (Pipeline #142)</span>
                  <span className="risk-badge risk-high">High Risk (84/100)</span>
                </div>
                <div className="progress-bar" style={{ height: 5, marginBottom: 6 }}>
                  <div className="progress-fill danger" style={{ width: '84%' }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  • 37 files modified (High blast radius)<br />
                  • Database migration detected (Schema lock risk)<br />
                  • Auth JWT filter altered (Security surface)<br />
                  • 2 Integration tests failing in test suite
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Medical Inventory API (Pipeline #141)</span>
                  <span className="risk-badge risk-low">Low Risk (12/100)</span>
                </div>
                <div className="progress-bar" style={{ height: 5, marginBottom: 6 }}>
                  <div className="progress-fill success" style={{ width: '12%' }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  • 100% test pass rate · 0 security findings · Safe for Production
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>AI Study Planner (Pipeline #140)</span>
                  <span className="risk-badge risk-medium">Medium Risk (42/100)</span>
                </div>
                <div className="progress-bar" style={{ height: 5, marginBottom: 6 }}>
                  <div className="progress-fill warning" style={{ width: '42%' }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  • Major OpenAI SDK bump from 3.x to 4.2.0 · Smoke test required
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Quality & Coverage Breakdown by Project */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Code2 size={15} color="var(--accent-light)" />
            <span>Service Code Quality &amp; Test Coverage Breakdown</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/pipelines')}>
            View Pipelines <ArrowRight size={12} />
          </button>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="rc-table">
              <thead>
                <tr>
                  <th>Microservice</th>
                  <th>Unit Coverage</th>
                  <th>Integration Coverage</th>
                  <th>Static Analysis</th>
                  <th>Security Debt</th>
                  <th>Risk Tier</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>E-Commerce Platform</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--danger)' }}>67%</span>
                      <div className="progress-bar" style={{ width: 80, height: 4 }}>
                        <div className="progress-fill danger" style={{ width: '67%' }} />
                      </div>
                    </div>
                  </td>
                  <td><span style={{ color: 'var(--warning)', fontWeight: 600 }}>54%</span></td>
                  <td><span className="badge badge-warning">4 Code Smells</span></td>
                  <td><span style={{ color: 'var(--danger)', fontWeight: 600 }}>1 High CVE</span></td>
                  <td><span className="risk-badge risk-high">High</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/pipelines/142')}>Inspect #142</button>
                  </td>
                </tr>

                <tr>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Medical Inventory API</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)' }}>91%</span>
                      <div className="progress-bar" style={{ width: 80, height: 4 }}>
                        <div className="progress-fill success" style={{ width: '91%' }} />
                      </div>
                    </div>
                  </td>
                  <td><span style={{ color: 'var(--success)', fontWeight: 600 }}>88%</span></td>
                  <td><span className="badge badge-success">Clean (0 bugs)</span></td>
                  <td><span style={{ color: 'var(--success)', fontWeight: 600 }}>0 CVEs</span></td>
                  <td><span className="risk-badge risk-low">Low</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/pipelines')}>View Runs</button>
                  </td>
                </tr>

                <tr>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Auth Microservice</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)' }}>84%</span>
                      <div className="progress-bar" style={{ width: 80, height: 4 }}>
                        <div className="progress-fill success" style={{ width: '84%' }} />
                      </div>
                    </div>
                  </td>
                  <td><span style={{ color: 'var(--success)', fontWeight: 600 }}>80%</span></td>
                  <td><span className="badge badge-success">Clean</span></td>
                  <td><span style={{ color: 'var(--success)', fontWeight: 600 }}>0 CVEs</span></td>
                  <td><span className="risk-badge risk-low">Low</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/security')}>Security Check</button>
                  </td>
                </tr>

                <tr>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>AI Study Planner</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)' }}>82%</span>
                      <div className="progress-bar" style={{ width: 80, height: 4 }}>
                        <div className="progress-fill success" style={{ width: '82%' }} />
                      </div>
                    </div>
                  </td>
                  <td><span style={{ color: 'var(--warning)', fontWeight: 600 }}>71%</span></td>
                  <td><span className="badge badge-muted">1 Warning</span></td>
                  <td><span style={{ color: 'var(--text-secondary)' }}>0 CVEs</span></td>
                  <td><span className="risk-badge risk-medium">Medium</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/pipelines')}>View Runs</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
