import { Activity, Server, Zap, Clock, AlertTriangle, RefreshCw, TrendingUp } from 'lucide-react';
import { healthMetrics } from '../data/mockData.js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const responseData = [
  { time: '10:00', rt: 138, err: 0.3 },
  { time: '10:05', rt: 144, err: 0.4 },
  { time: '10:10', rt: 136, err: 0.2 },
  { time: '10:15', rt: 152, err: 0.5 },
  { time: '10:20', rt: 141, err: 0.3 },
  { time: '10:25', rt: 148, err: 0.4 },
  { time: '10:30', rt: 142, err: 0.4 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-muted)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontWeight: 600 }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Monitoring() {
  return (
    <div className="page-enter">
      {/* Health Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,.08), rgba(34,211,238,.04))',
        border: '1px solid rgba(16,185,129,.2)',
        borderRadius: 'var(--radius-xl)',
        padding: '20px 28px',
        marginBottom: 28,
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--success-dim)', border: '2px solid var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px var(--success-glow)' }}>
          <Activity size={24} color="var(--success)" />
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--success)' }}>🟢 Production Healthy</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>All services operational · Last checked {healthMetrics.lastChecked}</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--success)' }}>{healthMetrics.uptime}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Uptime (30d)</div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="stat-grid" style={{ marginBottom: 28 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-dim)' }}><Zap size={18} color="var(--accent-primary)" /></div>
          <div className="stat-value">{healthMetrics.responseTime} <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>ms</span></div>
          <div className="stat-label">Response Time</div>
          <div className="progress-bar" style={{ marginTop: 10 }}>
            <div className="progress-fill success" style={{ width: '29%' }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-dim)' }}><TrendingUp size={18} color="var(--success)" /></div>
          <div className="stat-value">{healthMetrics.errorRate} <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>%</span></div>
          <div className="stat-label">Error Rate</div>
          <div className="progress-bar" style={{ marginTop: 10 }}>
            <div className="progress-fill success" style={{ width: '4%' }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--info-glow)' }}><Server size={18} color="var(--info)" /></div>
          <div className="stat-value">{healthMetrics.cpu} <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>%</span></div>
          <div className="stat-label">CPU Usage</div>
          <div className="progress-bar" style={{ marginTop: 10 }}>
            <div className="progress-fill accent" style={{ width: `${healthMetrics.cpu}%` }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--warning-dim)' }}><Activity size={18} color="var(--warning)" /></div>
          <div className="stat-value">{healthMetrics.memory} <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>%</span></div>
          <div className="stat-label">Memory Usage</div>
          <div className="progress-bar" style={{ marginTop: 10 }}>
            <div className="progress-fill warning" style={{ width: `${healthMetrics.memory}%` }} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        <div className="chart-container">
          <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 14 }}>Response Time (ms)</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={responseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,179,237,0.06)" />
              <XAxis dataKey="time" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="rt" name="Response Time" stroke="var(--accent-primary)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-container">
          <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 14 }}>Error Rate (%)</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={responseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,179,237,0.06)" />
              <XAxis dataKey="time" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="err" name="Error Rate" stroke="var(--success)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rollback Scenario */}
      <div className="card p-6">
        <div style={{ fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={15} color="var(--warning)" /> Rollback Engine
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--success-dim)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 8 }}>
            <div className="status-dot success" />
            <span style={{ flex: 1, fontSize: 13, color: 'var(--success)' }}>v2.0.9 deployed · Error rate normal (0.4%)</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Active</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
            <div className="status-dot idle" />
            <span style={{ flex: 1, fontSize: 13, color: 'var(--text-muted)' }}>v2.0.8 · Available for rollback</span>
            <button className="btn btn-ghost btn-sm"><RefreshCw size={12} /> Rollback</button>
          </div>
        </div>
        <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--bg-elevated)', borderRadius: 8, fontSize: 12, color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--text-secondary)' }}>Auto-rollback policy:</strong> Trigger when error rate {'>'} 10% for {'>'} 5 minutes · Requires Release Manager confirmation
        </div>
      </div>
    </div>
  );
}
