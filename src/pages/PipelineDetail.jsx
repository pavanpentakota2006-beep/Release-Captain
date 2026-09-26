import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Cpu, CheckCircle, XCircle, AlertTriangle, Clock,
  GitCommit, User, GitBranch, Terminal, ChevronRight, Zap,
  RefreshCw, Shield, FlaskConical, BarChart3, FileCode
} from 'lucide-react';
import { pipelines, aiAnalysis } from '../data/mockData.js';

const stageStatusClass = (s) => {
  if (s === 'success') return 'success';
  if (s === 'failed')  return 'danger';
  if (s === 'warning') return 'warning';
  if (s === 'running') return 'running';
  return 'idle';
};

const stageIcon = (s) => {
  if (s === 'success') return <CheckCircle size={14} />;
  if (s === 'failed')  return <XCircle size={14} />;
  if (s === 'warning') return <AlertTriangle size={14} />;
  if (s === 'running') return <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />;
  return <Clock size={14} />;
};

const LOG_LINES = [
  { time: '10:28:01', text: 'Pipeline #142 triggered by push to main', cls: 'info' },
  { time: '10:28:03', text: '▶ Stage: Build', cls: 'info' },
  { time: '10:28:05', text: '  Running: mvn clean package -DskipTests', cls: 'muted' },
  { time: '10:28:48', text: '  BUILD SUCCESS · 126 classes compiled', cls: 'success' },
  { time: '10:28:50', text: '▶ Stage: Unit Tests', cls: 'info' },
  { time: '10:28:52', text: '  Running: mvn test -Dtest=Unit*', cls: 'muted' },
  { time: '10:29:54', text: '  Tests run: 126, Failures: 0, Errors: 0 ✓', cls: 'success' },
  { time: '10:29:56', text: '▶ Stage: Security Scan', cls: 'info' },
  { time: '10:30:30', text: '  ⚠ HIGH: CVE-2024-5018 in spring-security:6.1.0', cls: 'warning' },
  { time: '10:30:34', text: '  Scan complete · 1 high, 3 medium, 7 low', cls: 'warning' },
  { time: '10:30:36', text: '▶ Stage: Integration Tests', cls: 'info' },
  { time: '10:30:38', text: '  Running: mvn verify -Dtest=Integration*', cls: 'muted' },
  { time: '10:31:20', text: '  PaymentServiceIntegrationTest > testPaymentFlow FAILED', cls: 'error' },
  { time: '10:31:21', text: '  Caused by: HikariPool-1 - Connection is not available', cls: 'error' },
  { time: '10:31:22', text: '  java.sql.SQLTransientConnectionException: timeout after 30s', cls: 'error' },
  { time: '10:31:50', text: '  Tests run: 40, Failures: 2, Errors: 0', cls: 'error' },
  { time: '10:31:52', text: '❌ Pipeline FAILED at Integration Tests stage', cls: 'error' },
];

export default function PipelineDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const pipeline = pipelines.find(p => p.id === Number(id));
  if (!pipeline) return (
    <div style={{ textAlign: 'center', paddingTop: 60, color: 'var(--text-muted)' }}>
      Pipeline not found. <button className="btn btn-ghost btn-sm" onClick={() => navigate('/pipelines')}>Back</button>
    </div>
  );

  const analysis = pipeline.id === 142 ? aiAnalysis : null;

  const analysisSteps = [
    '✓ Collecting pipeline logs',
    '✓ Fetching git diff',
    '✓ Reading recent commits',
    '✓ Analyzing test results',
    '✓ Comparing with last successful build',
    '✓ Running root cause model',
  ];

  const handleAnalyze = () => {
    setAnalyzing(true);
    setAnalysisStep(0);
    setShowAnalysis(false);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setAnalysisStep(step);
      if (step >= analysisSteps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setAnalyzing(false);
          setShowAnalysis(true);
          setActiveTab('ai');
        }, 600);
      }
    }, 600);
  };

  const statusColor = pipeline.status === 'failed' ? 'var(--danger)' :
                      pipeline.status === 'success' ? 'var(--success)' : 'var(--accent-primary)';

  return (
    <div className="page-enter">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/pipelines')}>
          <ArrowLeft size={14} /> Back
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>
              Pipeline #{pipeline.id}
            </h2>
            {pipeline.status === 'failed' && <span className="badge badge-danger">✗ Failed</span>}
            {pipeline.status === 'success' && <span className="badge badge-success">✓ Success</span>}
            {pipeline.status === 'running' && <span className="badge badge-accent">● Running</span>}
          </div>
          <div style={{ display: 'flex', gap: 20, fontSize: 12, color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><GitBranch size={12} />{pipeline.branch}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><GitCommit size={12} />
              <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>{pipeline.commit}</code>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><User size={12} />{pipeline.author}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={12} />{pipeline.duration}</span>
          </div>
        </div>
        {pipeline.status === 'failed' && !showAnalysis && !analyzing && (
          <button className="btn btn-primary" onClick={handleAnalyze}>
            <Cpu size={15} /> Analyze with Release Captain
          </button>
        )}
        {showAnalysis && (
          <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('ai')}>
            <Cpu size={14} /> View AI Analysis
          </button>
        )}
      </div>

      {/* Commit message */}
      <div className="rc-finding" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Latest commit</div>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{pipeline.commitMsg}</div>
      </div>

      {/* AI Analyzing overlay */}
      {analyzing && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(77,166,255,.1), rgba(34,211,238,.05))',
          border: '1px solid var(--border-muted)',
          borderRadius: 'var(--radius-xl)',
          padding: 28,
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div className="sidebar-logo-icon" style={{ width: 36, height: 36, animation: 'pulse-dot 1.5s infinite' }}>
              <Cpu size={16} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Release Captain is analyzing Pipeline #{pipeline.id}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Running multi-source root cause analysis...</div>
            </div>
            <div className="thinking-dots" style={{ marginLeft: 'auto' }}>
              <span /><span /><span />
            </div>
          </div>
          <div className="step-list">
            {analysisSteps.map((step, i) => (
              <div key={i} className={`step-item ${i < analysisStep ? 'done' : i === analysisStep ? 'active' : ''}`}>
                <div className="step-number">
                  {i < analysisStep ? <CheckCircle size={14} /> : i + 1}
                </div>
                <span style={{ fontSize: 13 }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stage Pipeline Visualization */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pipeline Stages</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', paddingBottom: 4 }}>
          {pipeline.stages.map((s, i) => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && (
                <div style={{ width: 40, height: 1, background: s.status === 'idle' ? 'var(--border-subtle)' : 'var(--border-accent)' }} />
              )}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 90 }}>
                <div className={`stage-icon ${stageStatusClass(s.status)}`} style={{ width: 36, height: 36, fontSize: 16 }}>
                  {stageIcon(s.status)}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>{s.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}>{s.duration}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-strip">
        {[
          { key: 'overview', label: 'Overview', icon: <BarChart3 size={13} /> },
          { key: 'logs',     label: 'Logs',     icon: <Terminal size={13} /> },
          { key: 'tests',    label: 'Tests',     icon: <FlaskConical size={13} /> },
          { key: 'security', label: 'Security',  icon: <Shield size={13} /> },
          { key: 'ai',       label: 'AI Analysis', icon: <Cpu size={13} />, highlight: showAnalysis },
        ].map(t => (
          <button
            key={t.key}
            className={`tab-btn ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}
            style={t.highlight && activeTab !== t.key ? { color: 'var(--accent-primary)' } : {}}
          >
            {t.icon} {t.label}
            {t.highlight && activeTab !== t.key && (
              <span style={{ marginLeft: 4, width: 7, height: 7, background: 'var(--accent-primary)', borderRadius: '50%', display: 'inline-block' }} />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid-2">
          {/* Risk */}
          <div className="card p-6">
            <div style={{ fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={15} color="var(--warning)" /> Release Risk
            </div>
            <div style={{ marginBottom: 16 }}>
              <span className={`risk-badge risk-${pipeline.riskLevel}`} style={{ fontSize: 14, padding: '6px 18px' }}>
                {pipeline.riskLevel.toUpperCase()}
              </span>
            </div>
            {pipeline.riskReasons.length > 0 && (
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>Risk factors:</div>
                {pipeline.riskReasons.map((r, i) => (
                  <div key={i} className="rc-finding warning" style={{ marginBottom: 8, padding: '8px 12px' }}>
                    <span style={{ fontSize: 13 }}>• {r}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Meta */}
          <div className="card p-6">
            <div style={{ fontWeight: 700, marginBottom: 16 }}>Pipeline Details</div>
            <div className="metric-row"><span className="metric-key">Project</span><span className="metric-val" style={{ fontFamily: 'inherit' }}>{pipeline.project}</span></div>
            <div className="metric-row"><span className="metric-key">Triggered</span><span className="metric-val" style={{ fontFamily: 'inherit' }}>{pipeline.triggeredAt}</span></div>
            <div className="metric-row"><span className="metric-key">Duration</span><span className="metric-val">{pipeline.duration}</span></div>
            <div className="metric-row"><span className="metric-key">Branch</span><span className="metric-val">{pipeline.branch}</span></div>
            <div className="metric-row"><span className="metric-key">Author</span><span className="metric-val" style={{ fontFamily: 'inherit' }}>{pipeline.author}</span></div>
            <div className="metric-row"><span className="metric-key">Commit</span><span className="metric-val" style={{ color: 'var(--accent-primary)' }}>{pipeline.commit}</span></div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="log-terminal">
          <div className="log-terminal-header">
            <div className="terminal-dot" style={{ background: '#ef4444' }} />
            <div className="terminal-dot" style={{ background: '#f59e0b' }} />
            <div className="terminal-dot" style={{ background: '#10b981' }} />
            <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text-muted)' }}>pipeline-{pipeline.id}.log</span>
          </div>
          <div className="log-terminal-body">
            {LOG_LINES.map((l, i) => (
              <div key={i} className="log-line">
                <span className="log-time">{l.time}</span>
                <span className={`log-text ${l.cls}`}>{l.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tests' && pipeline.testResults && (
        <div className="grid-2">
          {[
            { label: 'Unit Tests',        data: pipeline.testResults.unit,        icon: <CheckCircle size={15} /> },
            { label: 'Integration Tests', data: pipeline.testResults.integration, icon: <FlaskConical size={15} /> },
            { label: 'API Tests',         data: pipeline.testResults.api,         icon: <Zap size={15} /> },
          ].map(t => {
            const ok = t.data.pass === t.data.total;
            const pct = Math.round((t.data.pass / t.data.total) * 100);
            return (
              <div key={t.label} className={`card p-6 ${!ok ? 'anomaly-alert' : ''}`} style={{ gridColumn: 'span 1' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
                    {t.icon} {t.label}
                  </div>
                  {ok ? <span className="badge badge-success">All Passed</span> : <span className="badge badge-danger">{t.data.total - t.data.pass} Failed</span>}
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 8 }}>
                  <span style={{ color: ok ? 'var(--success)' : 'var(--danger)' }}>{t.data.pass}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 16 }}>/{t.data.total}</span>
                </div>
                <div className="progress-bar" style={{ height: 8 }}>
                  <div className={`progress-fill ${ok ? 'success' : 'danger'}`} style={{ width: `${pct}%` }} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>{pct}% pass rate</div>
                {!ok && (
                  <div className="rc-finding danger" style={{ marginTop: 12, padding: '8px 12px' }}>
                    <div style={{ fontSize: 12, color: 'var(--danger)' }}>PaymentServiceIntegrationTest · testPaymentFlow</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Connection pool exhaustion · HikariPool timeout</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'security' && pipeline.security && (
        <div>
          <div className="grid-3" style={{ marginBottom: 24 }}>
            {[
              { label: 'Critical', count: pipeline.security.critical, color: 'var(--danger)', bg: 'var(--danger-dim)' },
              { label: 'High',     count: pipeline.security.high,     color: 'var(--risk-high)', bg: 'rgba(249,115,22,.12)' },
              { label: 'Medium',   count: pipeline.security.medium,   color: 'var(--warning)', bg: 'var(--warning-dim)' },
              // Low in same row
            ].map(s => (
              <div key={s.label} className="card p-6" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: s.color }}>{s.count}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{s.label} Vulnerabilities</div>
                {s.count === 0 ? <span className="badge badge-success" style={{ marginTop: 8 }}>✓ Clean</span> : <span className="badge badge-danger" style={{ marginTop: 8 }}>Action needed</span>}
              </div>
            ))}
          </div>
          {pipeline.security.high > 0 && (
            <div className="rc-finding danger">
              <div style={{ fontWeight: 700, color: 'var(--danger)', marginBottom: 6 }}>HIGH: CVE-2024-5018</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>spring-security 6.1.0 — Authentication bypass via specially crafted JWT tokens</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Fix: Upgrade to spring-security 6.1.5+</div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'ai' && (
        <div>
          {!showAnalysis && !analyzing ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
              <Cpu size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
              <p style={{ fontSize: 14 }}>Run AI analysis to get root cause insights</p>
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={handleAnalyze}>
                <Cpu size={15} /> Analyze with Release Captain
              </button>
            </div>
          ) : analysis && showAnalysis ? (
            <div>
              {/* Root Cause */}
              <div className="highlight-box" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div className="sidebar-logo-icon" style={{ width: 32, height: 32 }}>
                    <Cpu size={14} color="white" />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>Root Cause Analysis</div>
                  <span className="badge badge-success" style={{ marginLeft: 'auto' }}>
                    {analysis.rootCause.confidence}% Confidence
                  </span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7, marginBottom: 16 }}>
                  {analysis.rootCause.summary}
                </p>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <div className="rc-finding" style={{ flex: 1, marginBottom: 0 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Affected File</div>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-primary)' }}>{analysis.rootCause.affectedFile}</code>
                  </div>
                  <div className="rc-finding" style={{ flex: 1, marginBottom: 0 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Root Commit</div>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-primary)' }}>{analysis.rootCause.commitSHA}</code>
                  </div>
                </div>
              </div>

              {/* Findings */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 700, marginBottom: 12 }}>Detailed Findings</div>
                {analysis.findings.map((f, i) => (
                  <div key={i} className={`rc-finding ${f.severity === 'critical' ? 'danger' : f.severity === 'warning' ? 'warning' : ''}`} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span className={`badge ${f.severity === 'critical' ? 'badge-danger' : f.severity === 'warning' ? 'badge-warning' : 'badge-info'}`}>{f.severity}</span>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{f.title}</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{f.detail}</p>
                  </div>
                ))}
              </div>

              {/* Recommendation */}
              <div className="card p-6">
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileCode size={15} color="var(--accent-primary)" /> Recommended Fix
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 12 }}>
                  {analysis.recommendation.title}
                </div>
                {analysis.recommendation.steps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--accent-primary)', flexShrink: 0 }}>{i + 1}</div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', paddingTop: 3 }}>{step}</p>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
                  <div className="rc-finding" style={{ marginBottom: 0 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Fix Risk</div>
                    <span className={`risk-badge risk-${analysis.recommendation.risk}`}>{analysis.recommendation.risk}</span>
                  </div>
                  <div className="rc-finding" style={{ marginBottom: 0 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Est. Time</div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{analysis.recommendation.estimatedFixTime}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                  <button className="btn btn-primary">
                    <Zap size={14} /> Generate Fix Branch
                  </button>
                  <button className="btn btn-ghost">
                    Request Human Review
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
