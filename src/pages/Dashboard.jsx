import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, CheckCircle, Clock, XCircle, Globe,
  GitBranch, Rocket, Zap, AlertTriangle, RefreshCw, ChevronRight,
  Code2, Cpu, Package, Shield, BarChart2, Activity, Users, Plus, Check
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';

// ─── DATA ────────────────────────────────────────────────────────────
const timeframeData = {
  '7d': {
    label: 'Last 7 Days',
    releases: '34',
    rate: '96.2%',
    mttr: '18m 10s',
    failed: '2',
    envs: '5',
  },
  '14d': {
    label: 'Last 14 Days',
    releases: '71',
    rate: '95.1%',
    mttr: '21m 30s',
    failed: '4',
    envs: '5',
  },
  '30d': {
    label: 'Last 30 Days',
    releases: '142',
    rate: '94.3%',
    mttr: '23m 47s',
    failed: '8',
    envs: '5',
  },
  '90d': {
    label: 'Last 90 Days',
    releases: '418',
    rate: '93.8%',
    mttr: '25m 12s',
    failed: '26',
    envs: '5',
  }
};

const pipelineDonut = [
  { name: 'Successful',   value: 147, color: '#22c55e' },
  { name: 'Failed',       value: 23,  color: '#ef4444' },
  { name: 'In Progress',  value: 16,  color: '#3b82f6' },
];

const riskDonut = [
  { name: 'Low Risk',      value: 58, color: '#22c55e' },
  { name: 'Medium Risk',   value: 52, color: '#f59e0b' },
  { name: 'High Risk',     value: 24, color: '#f97316' },
  { name: 'Critical Risk', value: 8,  color: '#ef4444' },
];

const recentReleases = [
  { version: 'v2.1.0', desc: 'Authentication & Payment Fix', env: 'PROD',    time: '2h ago',  status: 'failed', path: '/approvals' },
  { version: 'v2.0.9', desc: 'UI/UX Enhancements',           env: 'PROD',    time: '1d ago',  status: 'success', path: '/releases' },
  { version: 'v2.0.8', desc: 'Database Optimization',        env: 'PROD',    time: '2d ago',  status: 'success', path: '/releases' },
  { version: 'v2.0.7', desc: 'Security Patch Update',        env: 'STAGING', time: '3d ago',  status: 'failed',  path: '/pipelines/142' },
  { version: 'v2.0.6', desc: 'Bug Fixes & Improvements',     env: 'PROD',    time: '4d ago',  status: 'success', path: '/releases' },
];

const pipelineSteps = [
  { icon: <Code2 size={13} />,      name: 'Code Commit',          meta: 'pavan kumar · 2h ago · abc123f', status: 'check', path: '/pipelines/142' },
  { icon: <Package size={13} />,    name: 'Build',                meta: '2m 34s',                          status: 'check', path: '/pipelines/142' },
  { icon: <CheckCircle size={13} />,name: 'Unit Tests',           meta: '1m 12s',                          status: 'check', path: '/pipelines/142' },
  { icon: <BarChart2 size={13} />,  name: 'Integration Tests',    meta: '3m 45s (Failing)',                status: 'check', path: '/pipelines/142' },
  { icon: <Shield size={13} />,     name: 'Security Scan',        meta: '1m 08s',                          status: 'check', path: '/security' },
  { icon: <CheckCircle size={13} />,name: 'Quality Gate',         meta: '47s (Blocked 67%)',               status: 'check', path: '/risk' },
  { icon: <Rocket size={13} />,     name: 'Deploy to Staging',    meta: '2m 11s',                          status: 'check', path: '/deployments' },
  { icon: <Users size={13} />,      name: 'Approval',             meta: 'pavan kumar · Pending',           status: 'approved', path: '/approvals' },
  { icon: <Rocket size={13} />,     name: 'Deploy to Production', meta: '1m 32s',                          status: 'check', path: '/deployments' },
  { icon: <Activity size={13} />,   name: 'Health Check',         meta: '52s',                             status: 'check', path: '/monitoring' },
];

const aiInsights = [
  {
    icon: <AlertTriangle size={16} />,
    iconBg: '#78350f',
    iconColor: '#fcd34d',
    title: 'Failure Root Cause Identified',
    time: '2h ago',
    desc: 'PaymentServiceTest is failing due to database connection timeout. Connection pool size changed in commit abc123f.',
    link: 'View Analysis',
    path: '/pipelines/142',
    borderColor: '#f59e0b',
  },
  {
    icon: <Zap size={16} />,
    iconBg: '#7f1d1d',
    iconColor: '#fca5a5',
    title: 'High Risk Release Detected',
    time: '5h ago',
    desc: 'Release v2.1.0 has HIGH risk due to database migration and authentication changes.',
    link: 'View Risk Analysis',
    path: '/risk',
    borderColor: '#ef4444',
  },
  {
    icon: <RefreshCw size={16} />,
    iconBg: '#78350f',
    iconColor: '#fb923c',
    title: 'Rollback Recommended',
    time: '1d ago',
    desc: 'Error rate increased by 18.7% in production. Rollback to v2.0.9 recommended.',
    link: 'View Rollback Console',
    path: '/rollback',
    borderColor: '#f97316',
  },
];

const environments = [
  { name: 'Production',   icon: '🟢', version: 'v2.1.0',      status: 'HEALTHY',   cpu: 42, mem: 58, err: '0.4%', errDanger: false, path: '/environments' },
  { name: 'Staging',      icon: '🟡', version: 'v2.1.0-rc.2', status: 'HEALTHY',   cpu: 31, mem: 46, err: '0.2%', errDanger: false, path: '/environments' },
  { name: 'Development',  icon: '🔵', version: 'v2.1.1-dev',  status: 'HEALTHY',   cpu: 28, mem: 41, err: '0.1%', errDanger: false, path: '/environments' },
  { name: 'QA',           icon: '🟠', version: 'v2.0.9',      status: 'DEGRADED',  cpu: 67, mem: 72, err: '2.1%', errDanger: true,  path: '/environments'  },
  { name: 'UAT',          icon: '🟢', version: 'v2.0.9',      status: 'HEALTHY',   cpu: 22, mem: 35, err: '0.0%', errDanger: false, path: '/environments' },
];

const activities = [
  {
    icon: <Rocket size={15} />,
    iconBg: 'var(--success-dim)',
    iconColor: 'var(--success)',
    title: 'Release v2.1.0 deployed to Prod...',
    sub: 'by pavan kumar · Click to inspect',
    time: '2h ago',
    path: '/deployments'
  },
  {
    icon: <CheckCircle size={15} />,
    iconBg: 'var(--success-dim)',
    iconColor: 'var(--success)',
    title: 'Pipeline #186 completed successfully',
    sub: 'Medical-Inventory-Service · Click to view',
    time: '2h ago',
    path: '/pipelines'
  },
  {
    icon: <AlertTriangle size={15} />,
    iconBg: 'var(--warning-dim)',
    iconColor: 'var(--warning)',
    title: 'Approval required for Release v2.1.1',
    sub: 'by system · 1 pending approval',
    time: '3h ago',
    path: '/approvals'
  },
  {
    icon: <Shield size={15} />,
    iconBg: 'var(--success-dim)',
    iconColor: 'var(--success)',
    title: 'Security scan completed',
    sub: '1 High CVE found · Click to fix',
    time: '4h ago',
    path: '/security'
  },
];

// ─── CUSTOM DONUT TOOLTIP ────────────────────────────────────────────
const DonutTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-muted)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
        <p style={{ color: payload[0].payload.color, fontWeight: 700 }}>{payload[0].name}</p>
        <p style={{ color: 'var(--text-primary)' }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

// ─── DONUT CHART ─────────────────────────────────────────────────────
function DonutChart({ data, centerLabel, centerSub, onClick }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: 130, cursor: 'pointer' }} onClick={onClick} title="Click to view full breakdown">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={46}
            outerRadius={62}
            paddingAngle={2}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<DonutTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text-primary)', lineHeight: 1 }}>{centerLabel}</div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, whiteSpace: 'nowrap' }}>{centerSub}</div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('30d');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const curData = timeframeData[timeframe];
  const totalPipeline = pipelineDonut.reduce((a, b) => a + b.value, 0);
  const totalRisk = riskDonut.reduce((a, b) => a + b.value, 0);

  const stats = [
    {
      label: 'Total Releases',
      value: curData.releases,
      trend: '+18%',
      trendDir: 'up',
      trendSub: `vs prev ${timeframe}`,
      icon: <Users size={18} />,
      iconBg: '#1d4ed8',
      iconColor: '#93c5fd',
      path: '/releases'
    },
    {
      label: 'Deployment Success Rate',
      value: curData.rate,
      trend: '+6.4%',
      trendDir: 'up',
      trendSub: `vs prev ${timeframe}`,
      icon: <CheckCircle size={18} />,
      iconBg: '#065f46',
      iconColor: '#6ee7b7',
      path: '/monitoring'
    },
    {
      label: 'Mean Time to Recover',
      value: curData.mttr,
      trend: '-15%',
      trendDir: 'down',
      trendSub: `vs prev ${timeframe}`,
      icon: <Clock size={18} />,
      iconBg: '#78350f',
      iconColor: '#fcd34d',
      path: '/rollback'
    },
    {
      label: 'Failed Deployments',
      value: curData.failed,
      trend: '-11%',
      trendDir: 'up',
      trendSub: `vs prev ${timeframe}`,
      icon: <XCircle size={18} />,
      iconBg: '#7f1d1d',
      iconColor: '#fca5a5',
      path: '/pipelines'
    },
    {
      label: 'Active Environments',
      value: curData.envs,
      trend: null,
      trendSub: 'Production, Staging, Dev...',
      icon: <Globe size={18} />,
      iconBg: '#134e4a',
      iconColor: '#5eead4',
      path: '/environments'
    },
  ];

  return (
    <div className="page-enter">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>Overview</h1>
          <p>Real-time insights into your software delivery</p>
        </div>
        <div className="page-header-right" style={{ position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-ghost btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <Clock size={13} /> {curData.label} <ChevronRight size={12} style={{ transform: dropdownOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
            </button>

            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 6,
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-muted)',
                  borderRadius: 'var(--r-md)',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 100,
                  minWidth: 150,
                  overflow: 'hidden'
                }}
              >
                {Object.entries(timeframeData).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setTimeframe(key);
                      setDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '8px 12px',
                      background: timeframe === key ? 'var(--accent-dim)' : 'transparent',
                      color: timeframe === key ? 'var(--accent-light)' : 'var(--text-primary)',
                      border: 'none',
                      fontSize: 12,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>{val.label}</span>
                    {timeframe === key && <Check size={13} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/deployments')}
          >
            <Plus size={13} /> New Release
          </button>
        </div>
      </div>

      {/* ── STAT CARDS (ALL CLICKABLE) ── */}
      <div className="stat-cards-grid">
        {stats.map((s, i) => (
          <div
            key={i}
            className="stat-card"
            style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
            onClick={() => navigate(s.path)}
            title={`Click to view ${s.label}`}
          >
            <div className="stat-card-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{s.label}</span>
              <ChevronRight size={11} style={{ opacity: 0.4 }} />
            </div>
            <div className="stat-card-row">
              <div className="stat-card-value" style={{ fontSize: s.value.length > 5 ? 18 : 22 }}>{s.value}</div>
              <div className="stat-card-icon" style={{ background: s.iconBg, color: s.iconColor }}>
                {s.icon}
              </div>
            </div>
            {s.trend ? (
              <div className={`stat-card-trend ${s.trendDir === 'up' && s.label !== 'Failed Deployments' ? 'trend-up' : s.label === 'Failed Deployments' && s.trendDir === 'up' ? 'trend-up' : 'trend-down'}`}>
                {s.trendDir === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{s.trend}</span>
                <span className="stat-card-trend-sub">{s.trendSub}</span>
              </div>
            ) : (
              <div className="stat-card-sub">{s.trendSub}</div>
            )}
          </div>
        ))}
      </div>

      {/* ── ROW 2: Pipeline Activity | Recent Releases | Risk Distribution ── */}
      <div className="dashboard-row dashboard-row-3" style={{ marginBottom: 14 }}>

        {/* Pipeline Activity */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title" style={{ cursor: 'pointer' }} onClick={() => navigate('/pipelines')}>
                <GitBranch size={14} /> Pipeline Activity
              </div>
              <div className="card-subtitle">Pipeline runs in the last 30 days</div>
            </div>
            <span className="view-all" onClick={() => navigate('/pipelines')}>View All</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <DonutChart
                  data={pipelineDonut}
                  centerLabel={totalPipeline}
                  centerSub="Total Runs"
                  onClick={() => navigate('/pipelines')}
                />
              </div>
              <div className="donut-legend" style={{ minWidth: 120 }}>
                {pipelineDonut.map((d, i) => {
                  const pct = Math.round((d.value / totalPipeline) * 100);
                  return (
                    <div
                      key={i}
                      className="donut-legend-item"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate('/pipelines')}
                    >
                      <div className="donut-dot" style={{ background: d.color }} />
                      <span style={{ flex: 1 }}>{d.name}</span>
                      <span className="donut-legend-val">{d.value} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({pct}%)</span></span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Releases */}
        <div className="card">
          <div className="card-header">
            <div className="card-title" style={{ cursor: 'pointer' }} onClick={() => navigate('/releases')}>
              <Package size={14} /> Recent Releases
            </div>
            <span className="view-all" onClick={() => navigate('/releases')}>View All</span>
          </div>
          <div className="card-body" style={{ padding: '10px 16px' }}>
            {recentReleases.map((r, i) => (
              <div
                key={i}
                className="release-row"
                style={{ cursor: 'pointer', transition: 'background 0.15s ease' }}
                onClick={() => navigate(r.path)}
                title="Click to view release details"
              >
                <span className="release-version">{r.version}</span>
                <span className="release-desc">{r.desc}</span>
                <span className={r.env === 'PROD' ? 'env-badge-prod' : 'env-badge-staging'}>{r.env}</span>
                <span className="release-time">{r.time}</span>
                <span className={`badge ${r.status === 'success' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: 9.5 }}>
                  {r.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Release Risk Distribution */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title" style={{ cursor: 'pointer' }} onClick={() => navigate('/risk')}>
                <BarChart2 size={14} /> Release Risk Distribution
              </div>
              <div className="card-subtitle">Risk levels of recent releases</div>
            </div>
            <span className="view-all" onClick={() => navigate('/risk')}>View All</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <DonutChart
                  data={riskDonut}
                  centerLabel={totalRisk}
                  centerSub="Total Releases"
                  onClick={() => navigate('/risk')}
                />
              </div>
              <div className="donut-legend" style={{ minWidth: 120 }}>
                {riskDonut.map((d, i) => {
                  const pct = Math.round((d.value / totalRisk) * 100);
                  return (
                    <div
                      key={i}
                      className="donut-legend-item"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate('/risk')}
                    >
                      <div className="donut-dot" style={{ background: d.color }} />
                      <span style={{ flex: 1 }}>{d.name}</span>
                      <span className="donut-legend-val">{d.value} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({pct}%)</span></span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 3: Deployment Pipeline | AI Insights | Environment Health ── */}
      <div className="dashboard-row dashboard-row-3" style={{ marginBottom: 14 }}>

        {/* Deployment Pipeline */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title" style={{ cursor: 'pointer' }} onClick={() => navigate('/pipelines/142')}>
                <Rocket size={14} /> Deployment Pipeline (v2.1.0)
              </div>
            </div>
            <span className="view-all" onClick={() => navigate('/pipelines/142')}>View Details</span>
          </div>
          <div className="card-body" style={{ padding: '10px 16px' }}>
            {pipelineSteps.map((step, i) => (
              <div key={i}>
                <div
                  className="pipeline-step"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(step.path)}
                  title={`Click to view ${step.name}`}
                >
                  <div className="pipeline-step-icon" style={{
                    background: 'var(--bg-elevated)',
                    color: 'var(--accent-light)',
                  }}>
                    {step.icon}
                  </div>
                  <div className="pipeline-step-info">
                    <div className="pipeline-step-name">{step.name}</div>
                    <div className="pipeline-step-meta">{step.meta}</div>
                  </div>
                  <div className="pipeline-step-status">
                    {step.status === 'check' && (
                      <div className="check-circle">✓</div>
                    )}
                    {step.status === 'approved' && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--success)', background: 'var(--success-dim)', border: '1px solid var(--success-border)', borderRadius: 4, padding: '2px 6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>APPROVED</span>
                    )}
                  </div>
                </div>
                {i < pipelineSteps.length - 1 && (
                  <div className="pipeline-step-line" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="card">
          <div className="card-header">
            <div className="card-title" style={{ cursor: 'pointer' }} onClick={() => navigate('/ai')}>
              <Cpu size={14} /> AI Insights
            </div>
            <span className="view-all" onClick={() => navigate('/ai')}>View All</span>
          </div>
          <div className="card-body">
            {aiInsights.map((ins, i) => (
              <div
                key={i}
                className="insight-card"
                style={{ borderLeftColor: ins.borderColor, borderLeftWidth: 3, cursor: 'pointer' }}
                onClick={() => navigate(ins.path)}
                title="Click to view AI analysis"
              >
                <div className="insight-icon" style={{ background: ins.iconBg, color: ins.iconColor }}>
                  {ins.icon}
                </div>
                <div className="insight-content">
                  <div className="insight-header">
                    <span className="insight-title">{ins.title}</span>
                    <span className="insight-time">{ins.time}</span>
                  </div>
                  <p className="insight-desc">{ins.desc}</p>
                  <span className="insight-link" onClick={(e) => { e.stopPropagation(); navigate(ins.path); }}>
                    {ins.link} →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Environment Health */}
        <div className="card">
          <div className="card-header">
            <div className="card-title" style={{ cursor: 'pointer' }} onClick={() => navigate('/environments')}>
              <Activity size={14} /> Environment Health
            </div>
            <span className="view-all" onClick={() => navigate('/environments')}>View All</span>
          </div>
          <div className="card-body" style={{ padding: '10px 16px' }}>
            {environments.map((env, i) => (
              <div
                key={i}
                className="env-row"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(env.path)}
                title={`Click to view ${env.name} cluster`}
              >
                <div className="env-icon" style={{ background: 'var(--bg-elevated)', fontSize: 14 }}>
                  {env.icon}
                </div>
                <div className="env-info">
                  <div className="env-name">{env.name}</div>
                  <div className="env-version">{env.version}</div>
                </div>
                <span className={env.status === 'HEALTHY' ? 'status-healthy' : 'status-degraded'}>
                  {env.status}
                </span>
                <div className="env-metrics">
                  <span>CPU <span className="env-metric-val">{env.cpu}%</span></span>
                  <span>Mem <span className="env-metric-val">{env.mem}%</span></span>
                  <span>Err <span className={`env-metric-val ${env.errDanger ? 'danger' : ''}`}>{env.err}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RECENT ACTIVITY (ALL CLICKABLE) ── */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={14} /> Recent Activity
        </div>
        <div className="activity-grid">
          {activities.map((act, i) => (
            <div
              key={i}
              className="activity-card"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(act.path)}
              title="Click to view details"
            >
              <div className="activity-icon" style={{ background: act.iconBg, color: act.iconColor }}>
                {act.icon}
              </div>
              <div className="activity-content">
                <div className="activity-title">{act.title}</div>
                <div className="activity-sub">{act.sub}</div>
                <div className="activity-time">{act.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
