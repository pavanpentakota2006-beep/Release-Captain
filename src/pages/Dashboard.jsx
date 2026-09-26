import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, CheckCircle, Clock, XCircle, Globe,
  GitBranch, Rocket, Zap, AlertTriangle, RefreshCw, ChevronRight,
  Code2, Cpu, Package, Shield, BarChart2, Activity, Users
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';

// ─── DATA ────────────────────────────────────────────────────────────
const stats = [
  {
    label: 'Total Releases',
    value: '142',
    trend: '+18%',
    trendDir: 'up',
    trendSub: 'vs last 30 days',
    icon: <Users size={18} />,
    iconBg: '#1d4ed8',
    iconColor: '#93c5fd',
  },
  {
    label: 'Deployment Success Rate',
    value: '94.3%',
    trend: '+6.4%',
    trendDir: 'up',
    trendSub: 'vs last 30 days',
    icon: <CheckCircle size={18} />,
    iconBg: '#065f46',
    iconColor: '#6ee7b7',
  },
  {
    label: 'Mean Time to Recover',
    value: '23m 47s',
    trend: '-15%',
    trendDir: 'down',
    trendSub: 'vs last 30 days',
    icon: <Clock size={18} />,
    iconBg: '#78350f',
    iconColor: '#fcd34d',
  },
  {
    label: 'Failed Deployments',
    value: '8',
    trend: '-11%',
    trendDir: 'up',
    trendSub: 'vs last 30 days',
    icon: <XCircle size={18} />,
    iconBg: '#7f1d1d',
    iconColor: '#fca5a5',
  },
  {
    label: 'Active Environments',
    value: '5',
    trend: null,
    trendSub: 'Production, Staging, Dev...',
    icon: <Globe size={18} />,
    iconBg: '#134e4a',
    iconColor: '#5eead4',
  },
];

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
  { version: 'v2.1.0', desc: 'Authentication & Payment Fix', env: 'PROD',    time: '2h ago',  status: 'success' },
  { version: 'v2.0.9', desc: 'UI/UX Enhancements',           env: 'PROD',    time: '1d ago',  status: 'success' },
  { version: 'v2.0.8', desc: 'Database Optimization',        env: 'PROD',    time: '2d ago',  status: 'success' },
  { version: 'v2.0.7', desc: 'Security Patch Update',        env: 'STAGING', time: '3d ago',  status: 'failed'  },
  { version: 'v2.0.6', desc: 'Bug Fixes & Improvements',     env: 'PROD',    time: '4d ago',  status: 'success' },
];

const pipelineSteps = [
  { icon: <Code2 size={13} />,      name: 'Code Commit',          meta: 'pavan kumar · 2h ago · a1b2c3d', status: 'check' },
  { icon: <Package size={13} />,    name: 'Build',                meta: '2m 34s',                          status: 'check' },
  { icon: <CheckCircle size={13} />,name: 'Unit Tests',           meta: '1m 12s',                          status: 'check' },
  { icon: <BarChart2 size={13} />,  name: 'Integration Tests',    meta: '3m 45s',                          status: 'check' },
  { icon: <Shield size={13} />,     name: 'Security Scan',        meta: '1m 08s',                          status: 'check' },
  { icon: <CheckCircle size={13} />,name: 'Quality Gate',         meta: '47s',                             status: 'check' },
  { icon: <Rocket size={13} />,     name: 'Deploy to Staging',    meta: '2m 11s',                          status: 'check' },
  { icon: <Users size={13} />,      name: 'Approval',             meta: 'pavan kumar · 2h ago',            status: 'approved' },
  { icon: <Rocket size={13} />,     name: 'Deploy to Production', meta: '1m 32s',                          status: 'check' },
  { icon: <Activity size={13} />,   name: 'Health Check',         meta: '52s',                             status: 'check' },
];

const aiInsights = [
  {
    icon: <AlertTriangle size={16} />,
    iconBg: '#78350f',
    iconColor: '#fcd34d',
    title: 'Failure Root Cause Identified',
    time: '2h ago',
    desc: 'PaymentServiceTest is failing due to database connection timeout. Connection pool size changed in commit a1b2c3d.',
    link: 'View Analysis',
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
    borderColor: '#ef4444',
  },
  {
    icon: <RefreshCw size={16} />,
    iconBg: '#78350f',
    iconColor: '#fb923c',
    title: 'Rollback Recommended',
    time: '1d ago',
    desc: 'Error rate increased by 18.7% in production. Rollback to v2.0.9 recommended.',
    link: 'View Details',
    borderColor: '#f97316',
  },
];

const environments = [
  { name: 'Production',   icon: '🟢', version: 'v2.1.0',      status: 'HEALTHY',   cpu: 42, mem: 58, err: '0.4%', errDanger: false },
  { name: 'Staging',      icon: '🟡', version: 'v2.1.0-rc.2', status: 'HEALTHY',   cpu: 31, mem: 46, err: '0.2%', errDanger: false },
  { name: 'Development',  icon: '🔵', version: 'v2.1.1-dev',  status: 'HEALTHY',   cpu: 28, mem: 41, err: '0.1%', errDanger: false },
  { name: 'QA',           icon: '🟠', version: 'v2.0.9',      status: 'DEGRADED',  cpu: 67, mem: 72, err: '2.1%', errDanger: true  },
  { name: 'UAT',          icon: '🟢', version: 'v2.0.9',      status: 'HEALTHY',   cpu: 22, mem: 35, err: '0.0%', errDanger: false },
];

const activities = [
  {
    icon: <Rocket size={15} />,
    iconBg: 'var(--success-dim)',
    iconColor: 'var(--success)',
    title: 'Release v2.1.0 deployed to Prod...',
    sub: 'by pavan kumar',
    time: '2h ago',
  },
  {
    icon: <CheckCircle size={15} />,
    iconBg: 'var(--success-dim)',
    iconColor: 'var(--success)',
    title: 'Pipeline #186 completed successfully',
    sub: 'Medical-Inventory-Service',
    time: '2h ago',
  },
  {
    icon: <AlertTriangle size={15} />,
    iconBg: 'var(--warning-dim)',
    iconColor: 'var(--warning)',
    title: 'Approval required for Release v2.1.1',
    sub: 'by system',
    time: '3h ago',
  },
  {
    icon: <Shield size={15} />,
    iconBg: 'var(--success-dim)',
    iconColor: 'var(--success)',
    title: 'Security scan completed',
    sub: 'No vulnerabilities found',
    time: '4h ago',
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
function DonutChart({ data, centerLabel, centerSub }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: 130 }}>
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
  const totalPipeline = pipelineDonut.reduce((a, b) => a + b.value, 0);
  const totalRisk = riskDonut.reduce((a, b) => a + b.value, 0);

  return (
    <div className="page-enter">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>Overview</h1>
          <p>Real-time insights into your software delivery</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={13} /> Last 30 Days <ChevronRight size={12} />
          </button>
          <button className="btn btn-primary btn-sm">
            + New Release
          </button>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="stat-cards-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card-label">{s.label}</div>
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
              <div className="card-title"><GitBranch size={14} /> Pipeline Activity</div>
              <div className="card-subtitle">Pipeline runs in the last 30 days</div>
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <DonutChart
                  data={pipelineDonut}
                  centerLabel={totalPipeline}
                  centerSub="Total Runs"
                />
              </div>
              <div className="donut-legend" style={{ minWidth: 120 }}>
                {pipelineDonut.map((d, i) => {
                  const pct = Math.round((d.value / totalPipeline) * 100);
                  return (
                    <div key={i} className="donut-legend-item">
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
            <div className="card-title"><Package size={14} /> Recent Releases</div>
            <span className="view-all" onClick={() => navigate('/releases')}>View All</span>
          </div>
          <div className="card-body" style={{ padding: '10px 16px' }}>
            {recentReleases.map((r, i) => (
              <div key={i} className="release-row">
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
              <div className="card-title"><BarChart2 size={14} /> Release Risk Distribution</div>
              <div className="card-subtitle">Risk levels of recent releases</div>
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <DonutChart
                  data={riskDonut}
                  centerLabel={totalRisk}
                  centerSub="Total Releases"
                />
              </div>
              <div className="donut-legend" style={{ minWidth: 120 }}>
                {riskDonut.map((d, i) => {
                  const pct = Math.round((d.value / totalRisk) * 100);
                  return (
                    <div key={i} className="donut-legend-item">
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
              <div className="card-title"><Rocket size={14} /> Deployment Pipeline (v2.1.0)</div>
            </div>
            <span className="view-all" onClick={() => navigate('/pipelines/142')}>View Details</span>
          </div>
          <div className="card-body" style={{ padding: '10px 16px' }}>
            {pipelineSteps.map((step, i) => (
              <div key={i}>
                <div className="pipeline-step">
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
            <div className="card-title"><Cpu size={14} /> AI Insights</div>
            <span className="view-all" onClick={() => navigate('/ai')}>View All</span>
          </div>
          <div className="card-body">
            {aiInsights.map((ins, i) => (
              <div key={i} className="insight-card" style={{ borderLeftColor: ins.borderColor, borderLeftWidth: 3 }}>
                <div className="insight-icon" style={{ background: ins.iconBg, color: ins.iconColor }}>
                  {ins.icon}
                </div>
                <div className="insight-content">
                  <div className="insight-header">
                    <span className="insight-title">{ins.title}</span>
                    <span className="insight-time">{ins.time}</span>
                  </div>
                  <p className="insight-desc">{ins.desc}</p>
                  <span className="insight-link">{ins.link}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Environment Health */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><Activity size={14} /> Environment Health</div>
            <span className="view-all" onClick={() => navigate('/monitoring')}>View All</span>
          </div>
          <div className="card-body" style={{ padding: '10px 16px' }}>
            {environments.map((env, i) => (
              <div key={i} className="env-row">
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

      {/* ── RECENT ACTIVITY ── */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={14} /> Recent Activity
        </div>
        <div className="activity-grid">
          {activities.map((act, i) => (
            <div key={i} className="activity-card">
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
