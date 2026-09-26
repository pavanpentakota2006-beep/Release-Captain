import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Server, Zap, Clock, AlertTriangle, RefreshCw, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { healthMetrics } from '../data/mockData.js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartDatasets = {
  '1h': [
    { time: '10:00', rt: 138, err: 0.3 },
    { time: '10:10', rt: 144, err: 0.4 },
    { time: '10:20', rt: 136, err: 0.2 },
    { time: '10:30', rt: 152, err: 0.5 },
    { time: '10:40', rt: 141, err: 0.3 },
    { time: '10:50', rt: 148, err: 0.4 },
    { time: '11:00', rt: 142, err: 0.4 },
  ],
  '6h': [
    { time: '05:00', rt: 120, err: 0.2 },
    { time: '06:00', rt: 128, err: 0.2 },
    { time: '07:00', rt: 145, err: 0.3 },
    { time: '08:00', rt: 162, err: 0.6 },
    { time: '09:00', rt: 155, err: 0.5 },
    { time: '10:00', rt: 142, err: 0.4 },
  ],
  '24h': [
    { time: '12:00', rt: 130, err: 0.3 },
    { time: '16:00', rt: 148, err: 0.4 },
    { time: '20:00', rt: 165, err: 0.7 },
    { time: '00:00', rt: 110, err: 0.1 },
    { time: '04:00', rt: 105, err: 0.1 },
    { time: '08:00', rt: 142, err: 0.4 },
  ],
  '7d': [
    { time: 'Mon', rt: 135, err: 0.3 },
    { time: 'Tue', rt: 142, err: 0.4 },
    { time: 'Wed', rt: 180, err: 1.2 },
    { time: 'Thu', rt: 145, err: 0.3 },
    { time: 'Fri', rt: 150, err: 0.4 },
    { time: 'Sat', rt: 125, err: 0.2 },
    { time: 'Sun', rt: 120, err: 0.1 },
  ]
};

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
  const navigate = useNavigate();
  const [range, setRange] = useState('1h');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState('Just now');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastChecked('Just now');
    }, 700);
  };

  return (
    <div className="page-enter">
      {/* Health Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(34,197,94,.08), rgba(59,130,246,.04))',
        border: '1px solid var(--success-border)',
        borderRadius: 'var(--r-xl)',
        padding: '18px 24px',
        marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 18,
      }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--success-dim)', border: '2px solid var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Activity size={22} color="var(--success)" />
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--success)' }}>Production Fleet Healthy</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>All 5 microservice clusters operational · Last checked {lastChecked}</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--success)' }}>{healthMetrics.uptime}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Uptime (30d SLA)</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw size={13} className={isRefreshing ? 'spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Metric Cards (Clickable) */}
      <div className="stat-cards-grid" style={{ marginBottom: 16 }}>
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/environments')}>
          <div className="stat-card-label">p95 Latency</div>
          <div className="stat-card-row">
            <span className="stat-card-value">{healthMetrics.responseTime}ms</span>
            <div className="stat-card-icon" style={{ background: 'var(--accent-dim)', color: 'var(--accent-light)' }}>
              <Zap size={18} />
            </div>
          </div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-fill success" style={{ width: '29%' }} />
          </div>
        </div>

        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/rollback')}>
          <div className="stat-card-label">HTTP 5xx Error Rate</div>
          <div className="stat-card-row">
            <span className="stat-card-value" style={{ color: 'var(--success)' }}>{healthMetrics.errorRate}%</span>
            <div className="stat-card-icon" style={{ background: 'var(--success-dim)', color: 'var(--success)' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-fill success" style={{ width: '8%' }} />
          </div>
        </div>

        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/environments')}>
          <div className="stat-card-label">Fleet CPU Usage</div>
          <div className="stat-card-row">
            <span className="stat-card-value">{healthMetrics.cpu}%</span>
            <div className="stat-card-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>
              <Server size={18} />
            </div>
          </div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-fill accent" style={{ width: `${healthMetrics.cpu}%` }} />
          </div>
        </div>

        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/environments')}>
          <div className="stat-card-label">Fleet Memory Usage</div>
          <div className="stat-card-row">
            <span className="stat-card-value">{healthMetrics.memory}%</span>
            <div className="stat-card-icon" style={{ background: 'var(--warning-dim)', color: 'var(--warning)' }}>
              <Activity size={18} />
            </div>
          </div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-fill warning" style={{ width: `${healthMetrics.memory}%` }} />
          </div>
        </div>

        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/deployments')}>
          <div className="stat-card-label">Total Ingress Rate</div>
          <div className="stat-card-row">
            <span className="stat-card-value" style={{ fontSize: 17 }}>1.2k /s</span>
            <div className="stat-card-icon" style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>Normal traffic</span>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Live Performance Telemetry</div>
        <div className="tab-strip" style={{ margin: 0 }}>
          {['1h', '6h', '24h', '7d'].map(r => (
            <button
              key={r}
              className={`tab-btn ${range === r ? 'active' : ''}`}
              onClick={() => setRange(r)}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 13, color: 'var(--text-primary)' }}>Response Time (p95 Latency ms)</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartDatasets[range]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="time" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="rt" name="Response Time" stroke="var(--accent-light)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 13, color: 'var(--text-primary)' }}>HTTP 5xx Error Rate (%)</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartDatasets[range]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="time" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="err" name="5xx Error %" stroke="var(--danger)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
