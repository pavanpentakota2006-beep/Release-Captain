import { useState } from 'react';
import {
  Settings, User, Cpu, Shield, Bell, Key, Check,
  Save, RefreshCw, Sliders, ExternalLink, Globe, Lock,
  Terminal, CheckCircle, Copy
} from 'lucide-react';
import { currentUser } from '../data/mockData.js';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [savedNotice, setSavedNotice] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Settings State
  const [profile, setProfile] = useState({
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role,
    org: 'Acme Global Release Engineering',
    timezone: 'UTC+05:30 (India Standard Time)'
  });

  const [aiSettings, setAiSettings] = useState({
    model: 'Claude 3.7 Sonnet (Anthropic)',
    autoAnalyze: true,
    autoFixPr: true,
    confidenceThreshold: 85,
    liveTelemetryGuard: true
  });

  const [policySettings, setPolicySettings] = useState({
    minCoverage: 80,
    twoApproversHighRisk: true,
    blockCriticalVulnerabilities: true,
    autoRollbackOnErrorSpike: true
  });

  const [integrations, setIntegrations] = useState({
    github: true,
    argocd: true,
    slack: true,
    slackWebhook: 'https://hooks.slack.com/services/T00/B00/release-alerts',
    pagerduty: true
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 4000);
  };

  const copyApiKey = () => {
    navigator.clipboard?.writeText('rc_live_sec_89234891237190283');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="page-enter">
      {/* Toast Notification */}
      {savedNotice && (
        <div className="alert-banner success" style={{ marginBottom: 12 }}>
          <CheckCircle size={16} />
          <div style={{ flex: 1 }}>
            <strong>Settings Saved!</strong> Your Release Captain preferences and policy configurations have been updated.
          </div>
          <span className="badge badge-success">Saved</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header" style={{ marginBottom: 12 }}>
        <div className="page-header-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
              <Settings size={16} />
            </div>
            <h1>Platform Settings</h1>
          </div>
          <p>Configure team access, AI Copilot reasoning model, CI/CD webhooks, and release governance policies</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-primary btn-sm" onClick={handleSave}>
            <Save size={13} /> Save Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-strip" style={{ marginBottom: 16 }}>
        <button
          className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <User size={13} /> General &amp; Profile
        </button>
        <button
          className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          <Cpu size={13} /> AI Copilot Engine
        </button>
        <button
          className={`tab-btn ${activeTab === 'integrations' ? 'active' : ''}`}
          onClick={() => setActiveTab('integrations')}
        >
          <Globe size={13} /> Integrations &amp; Webhooks
        </button>
        <button
          className={`tab-btn ${activeTab === 'policies' ? 'active' : ''}`}
          onClick={() => setActiveTab('policies')}
        >
          <Shield size={13} /> Policies &amp; Governance
        </button>
        <button
          className={`tab-btn ${activeTab === 'api' ? 'active' : ''}`}
          onClick={() => setActiveTab('api')}
        >
          <Key size={13} /> API Keys &amp; Security
        </button>
      </div>

      {/* Tab 1: General & Profile */}
      {activeTab === 'general' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14 }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <User size={15} color="var(--accent-light)" />
                <span>Account &amp; User Profile</span>
              </div>
              <span className="badge badge-accent">{profile.role.replace('_', ' ')}</span>
            </div>
            <form onSubmit={handleSave} style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'white' }}>
                  PK
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{profile.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{profile.email}</div>
                  <div style={{ fontSize: 11, color: 'var(--accent-light)', marginTop: 2 }}>Release Manager · Full Admin Access</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Organization Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.org}
                  onChange={(e) => setProfile({ ...profile, org: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Timezone Preference</label>
                <select
                  className="form-input"
                  value={profile.timezone}
                  onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                >
                  <option value="UTC+05:30 (India Standard Time)">UTC+05:30 (India Standard Time - IST)</option>
                  <option value="UTC+00:00 (Greenwich Mean Time)">UTC+00:00 (Greenwich Mean Time - GMT)</option>
                  <option value="UTC-05:00 (Eastern Time)">UTC-05:00 (Eastern Time - US)</option>
                  <option value="UTC-08:00 (Pacific Time)">UTC-08:00 (Pacific Time - US)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Save size={13} /> Update Profile
                </button>
              </div>
            </form>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Sliders size={15} color="var(--accent-light)" />
                <span>Dashboard Preferences</span>
              </div>
            </div>
            <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Telemetry Auto-Refresh</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Live sync dashboard metrics every 15 seconds</div>
                </div>
                <span className="badge badge-success">Enabled</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>High-Density Layout</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Compact spacing to maximize screen real estate</div>
                </div>
                <span className="badge badge-success">Active</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Sound Effects on Build Failure</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Play subtle alert when a production deployment fails</div>
                </div>
                <span className="badge badge-muted">Muted</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AI Copilot Engine */}
      {activeTab === 'ai' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14 }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Cpu size={15} color="#a78bfa" />
                <span>AI Reasoning Engine &amp; Agents</span>
              </div>
              <span className="badge badge-violet">Release Captain Core</span>
            </div>
            <form onSubmit={handleSave} style={{ padding: '16px 18px' }}>
              <div className="form-group">
                <label className="form-label">Primary AI Reasoning Model</label>
                <select
                  className="form-input"
                  value={aiSettings.model}
                  onChange={(e) => setAiSettings({ ...aiSettings, model: e.target.value })}
                >
                  <option value="Claude 3.7 Sonnet (Anthropic)">Claude 3.7 Sonnet (Anthropic - Recommended for Code)</option>
                  <option value="Gemini 2.5 Pro (Google DeepMind)">Gemini 2.5 Pro (Google DeepMind - Ultra Fast)</option>
                  <option value="GPT-4o (OpenAI)">GPT-4o (OpenAI)</option>
                  <option value="ReleaseCaptain-FineTuned-8B">ReleaseCaptain Fine-Tuned 8B (On-Premises Air-Gapped)</option>
                </select>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <label className="form-label" style={{ margin: 0 }}>Root Cause Analysis Confidence Threshold</label>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-light)' }}>{aiSettings.confidenceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="98"
                  value={aiSettings.confidenceThreshold}
                  onChange={(e) => setAiSettings({ ...aiSettings, confidenceThreshold: parseInt(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--accent)' }}
                />
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  Only propose automated code fixes when root cause certainty is at least {aiSettings.confidenceThreshold}%.
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-elevated)', padding: '10px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Automatic Failure Investigation</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Launch AI root cause agent immediately when any CI step fails</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiSettings.autoAnalyze}
                    onChange={(e) => setAiSettings({ ...aiSettings, autoAnalyze: e.target.checked })}
                    style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-elevated)', padding: '10px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Automated Remediation PR Drafting</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Allow AI to prepare fix branches and PRs for human approval</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiSettings.autoFixPr}
                    onChange={(e) => setAiSettings({ ...aiSettings, autoFixPr: e.target.checked })}
                    style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-elevated)', padding: '10px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Live Telemetry Anomaly Sentry</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Monitor canary latency &amp; 5xx error spikes with automated halt</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiSettings.liveTelemetryGuard}
                    onChange={(e) => setAiSettings({ ...aiSettings, liveTelemetryGuard: e.target.checked })}
                    style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Save size={13} /> Save AI Configuration
                </button>
              </div>
            </form>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Cpu size={15} color="var(--accent-light)" />
                <span>Active Agent Fleet</span>
              </div>
              <span className="badge badge-success">3 Online</span>
            </div>
            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: 'var(--bg-elevated)', padding: '10px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600, fontSize: 12.5, color: 'var(--text-primary)' }}>Failure Analyzer Agent</span>
                  <span className="badge badge-success">Running</span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  Dissects stack traces, commit diffs, and HikariCP/Postgres pool metrics.
                </p>
              </div>

              <div style={{ background: 'var(--bg-elevated)', padding: '10px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600, fontSize: 12.5, color: 'var(--text-primary)' }}>Release Risk Agent</span>
                  <span className="badge badge-success">Running</span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  Evaluates PR blast radius, database migrations, and code coverage drop.
                </p>
              </div>

              <div style={{ background: 'var(--bg-elevated)', padding: '10px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600, fontSize: 12.5, color: 'var(--text-primary)' }}>Rollback Sentry Agent</span>
                  <span className="badge badge-success">Running</span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  Watches canary health and triggers automated instant traffic recovery.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Integrations */}
      {activeTab === 'integrations' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Globe size={15} color="var(--accent-light)" />
              <span>Connected CI/CD &amp; Infrastructure Providers</span>
            </div>
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 14, borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-primary)' }}>GitHub Enterprise</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Connected to organization <code>github.com/acme</code> · 4 Repositories</div>
              </div>
              <span className="badge badge-success">Connected ✓</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 14, borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-primary)' }}>Kubernetes Cluster (ArgoCD &amp; Helm)</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Active cluster: <code>k8s-prod-us-east-1</code> (5 namespaces)</div>
              </div>
              <span className="badge badge-success">Connected ✓</span>
            </div>

            <div style={{ paddingBottom: 14, borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-primary)' }}>Slack Release Broadcast Webhook</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Sends real-time alerts to #releases and #incident-war-room</div>
                </div>
                <span className="badge badge-success">Active</span>
              </div>
              <input
                type="text"
                className="form-input mono"
                style={{ fontSize: 12 }}
                value={integrations.slackWebhook}
                onChange={(e) => setIntegrations({ ...integrations, slackWebhook: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-primary)' }}>PagerDuty Escalation Policy</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Paging Release Managers on Production Rollback or Sev-1 Blockers</div>
              </div>
              <span className="badge badge-success">Connected ✓</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
              <button className="btn btn-primary btn-sm" onClick={handleSave}>
                <Save size={13} /> Save Integrations
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Policies & Governance */}
      {activeTab === 'policies' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Shield size={15} color="var(--accent-light)" />
              <span>Release Policy Rules &amp; Quality Gates</span>
            </div>
            <span className="badge badge-accent">Production Enforcement</span>
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 14, borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ maxWidth: '80%' }}>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-primary)' }}>Mandatory Code Coverage Minimum (80%)</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                  Block deployment if total combined test coverage falls below {policySettings.minCoverage}%. Currently blocking Release v2.1.0 (67%).
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="mono" style={{ fontWeight: 700, color: 'var(--accent-light)' }}>{policySettings.minCoverage}%</span>
                <input
                  type="checkbox"
                  checked={true}
                  readOnly
                  style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 14, borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ maxWidth: '80%' }}>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-primary)' }}>Require 2 Human Approvers for High-Risk Releases</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                  When AI flags risk as HIGH, both Release Manager and Lead Architect approvals are strictly enforced before unlocking deployment.
                </div>
              </div>
              <input
                type="checkbox"
                checked={policySettings.twoApproversHighRisk}
                onChange={(e) => setPolicySettings({ ...policySettings, twoApproversHighRisk: e.target.checked })}
                style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 14, borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ maxWidth: '80%' }}>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-primary)' }}>Zero Critical CVE Security Gate</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                  Automatically fail security validation stage if any CVSS &ge; 9.0 vulnerability is discovered in container dependencies.
                </div>
              </div>
              <input
                type="checkbox"
                checked={policySettings.blockCriticalVulnerabilities}
                onChange={(e) => setPolicySettings({ ...policySettings, blockCriticalVulnerabilities: e.target.checked })}
                style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ maxWidth: '80%' }}>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-primary)' }}>Automatic Canary Rollback on Error Spike</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                  Automatically abort deployment and restore previous stable version if HTTP 5xx error rate exceeds 1.0% for 60s.
                </div>
              </div>
              <input
                type="checkbox"
                checked={policySettings.autoRollbackOnErrorSpike}
                onChange={(e) => setPolicySettings({ ...policySettings, autoRollbackOnErrorSpike: e.target.checked })}
                style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
              <button className="btn btn-primary btn-sm" onClick={handleSave}>
                <Save size={13} /> Save Policies
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: API Keys & Security */}
      {activeTab === 'api' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Key size={15} color="var(--accent-light)" />
              <span>Platform API Keys &amp; Webhook Secrets</span>
            </div>
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="form-label">Live Orchestration API Token</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="password"
                  className="form-input mono"
                  value="rc_live_sec_8923489123719028347109283"
                  readOnly
                  style={{ fontSize: 12 }}
                />
                <button className="btn btn-ghost btn-sm" onClick={copyApiKey}>
                  {copiedKey ? <Check size={13} color="var(--success)" /> : <Copy size={13} />}
                  {copiedKey ? 'Copied' : 'Copy Key'}
                </button>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                Used by CLI / GitHub Actions workflow: <code>uses: release-captain/action@v1</code>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
              <label className="form-label">Webhook Signing Secret</label>
              <input
                type="password"
                className="form-input mono"
                value="whsec_098234lkjsdf098234kljsd098234"
                readOnly
                style={{ fontSize: 12 }}
              />
            </div>

            <div style={{ background: 'var(--bg-elevated)', padding: '12px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)', display: 'flex', gap: 10, alignItems: 'center' }}>
              <Lock size={16} color="var(--success)" />
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                All credentials and tokens are encrypted at rest with AES-256-GCM and scoped to Organization RBAC permissions.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
