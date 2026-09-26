import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpen, GitBranch, Play, CheckCircle, AlertTriangle,
  Plus, Search, Star, ExternalLink, Code2, Users, Layers,
  Activity, ArrowRight, X, Shield, RefreshCw
} from 'lucide-react';
import { projects as initialProjects } from '../data/mockData.js';

const projectDetails = [
  {
    id: 1,
    name: 'Medical Inventory API',
    repo: 'acme/medical-inventory',
    language: 'Java (Spring Boot 3.2)',
    langColor: '#ea580c',
    stars: 142,
    health: 'healthy',
    branch: 'main',
    lastDeploy: 'Yesterday 11:02 AM',
    latestVersion: 'v2.0.9',
    coverage: '91%',
    cves: 0,
    pipelinesToday: 3,
    deploysThisWeek: 8,
    lead: 'Ananya Sharma',
    team: ['AS', 'PK', 'RP'],
    description: 'HIPAA-compliant batch medicine inventory tracking, cold-chain temperature telemetry, and FDA recall scanner.'
  },
  {
    id: 2,
    name: 'E-Commerce Platform',
    repo: 'acme/ecom-platform',
    language: 'TypeScript (Next.js 14)',
    langColor: '#3b82f6',
    stars: 318,
    health: 'degraded',
    branch: 'main',
    lastDeploy: '5h ago',
    latestVersion: 'v2.1.0-rc2',
    coverage: '67%',
    cves: 1,
    pipelinesToday: 6,
    deploysThisWeek: 14,
    lead: 'Pavan Kumar',
    team: ['PK', 'AS', 'AD'],
    description: 'High-volume storefront, checkout funnel, Stripe multi-currency processing, and inventory reservation engine.'
  },
  {
    id: 3,
    name: 'AI Study Planner',
    repo: 'acme/study-planner',
    language: 'Python (FastAPI & LangChain)',
    langColor: '#10b981',
    stars: 87,
    health: 'healthy',
    branch: 'develop',
    lastDeploy: '5 days ago',
    latestVersion: 'v2.0.7',
    coverage: '82%',
    cves: 0,
    pipelinesToday: 2,
    deploysThisWeek: 5,
    lead: 'Riya Patel',
    team: ['RP', 'PK'],
    description: 'Intelligent flashcard generation, spaced repetition scheduling, and LLM-assisted curriculum planning.'
  },
  {
    id: 4,
    name: 'Auth Microservice',
    repo: 'acme/auth-service',
    language: 'Java & Redis',
    langColor: '#ea580c',
    stars: 64,
    health: 'healthy',
    branch: 'main',
    lastDeploy: '3 days ago',
    latestVersion: 'v2.0.6',
    coverage: '84%',
    cves: 0,
    pipelinesToday: 1,
    deploysThisWeek: 4,
    lead: 'Pavan Kumar',
    team: ['PK', 'AD'],
    description: 'OAuth2/OIDC centralized identity token provider, RBAC permissions cache, and biometric WebAuthn gateway.'
  }
];

export default function Projects() {
  const navigate = useNavigate();
  const [projectList, setProjectList] = useState(projectDetails);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    repo: '',
    language: 'TypeScript',
    branch: 'main',
    description: ''
  });
  const [notice, setNotice] = useState(null);

  const filteredProjects = projectList.filter(p => {
    const matchesLang =
      selectedLang === 'ALL' ||
      p.language.toLowerCase().includes(selectedLang.toLowerCase());
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.repo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLang && matchesSearch;
  });

  const handleCreateProject = (e) => {
    e.preventDefault();
    const created = {
      id: projectList.length + 1,
      name: newProject.name,
      repo: newProject.repo || `acme/${newProject.name.toLowerCase().replace(/\s+/g, '-')}`,
      language: newProject.language,
      langColor: newProject.language.includes('Java') ? '#ea580c' : newProject.language.includes('Python') ? '#10b981' : '#3b82f6',
      stars: 1,
      health: 'healthy',
      branch: newProject.branch || 'main',
      lastDeploy: 'Never deployed',
      latestVersion: 'v0.1.0',
      coverage: '80%',
      cves: 0,
      pipelinesToday: 0,
      deploysThisWeek: 0,
      lead: 'Pavan Kumar',
      team: ['PK'],
      description: newProject.description || 'Newly registered service connected to Release Captain CI/CD.'
    };
    setProjectList([...projectList, created]);
    setModalOpen(false);
    setNotice(`Project "${newProject.name}" connected and webhook registered.`);
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="page-enter">
      {/* Toast Notice */}
      {notice && (
        <div className="alert-banner success" style={{ marginBottom: 12 }}>
          <CheckCircle size={16} />
          <div style={{ flex: 1 }}>
            <strong>Project Configured:</strong> {notice}
          </div>
          <span className="badge badge-success">Active</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header" style={{ marginBottom: 12 }}>
        <div className="page-header-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
              <FolderOpen size={16} />
            </div>
            <h1>Projects &amp; Repositories</h1>
          </div>
          <p>Microservice inventory, connected Git repositories, and automated CI/CD pipeline triggers</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/pipelines')}>
            <Play size={13} /> View All Pipelines
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>
            <Plus size={13} /> Connect Repository
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="stat-cards-grid" style={{ marginBottom: 12 }}>
        <div className="stat-card">
          <span className="stat-card-label">Active Projects</span>
          <div className="stat-card-row">
            <span className="stat-card-value">{projectList.length}</span>
            <div className="stat-card-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>
              <FolderOpen size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>All monitored</span>
            <span className="stat-card-trend-sub">Git webhooks live</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">Fleet Success Rate</span>
          <div className="stat-card-row">
            <span className="stat-card-value" style={{ color: 'var(--success)' }}>94.3%</span>
            <div className="stat-card-icon" style={{ background: 'var(--success-dim)', color: 'var(--success)' }}>
              <CheckCircle size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>Healthy fleet</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">Deploys This Week</span>
          <div className="stat-card-row">
            <span className="stat-card-value">31</span>
            <div className="stat-card-icon" style={{ background: 'var(--accent-dim)', color: 'var(--accent-light)' }}>
              <Activity size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>↑ 4 vs last week</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">Avg Coverage</span>
          <div className="stat-card-row">
            <span className="stat-card-value">76.8%</span>
            <div className="stat-card-icon" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--warning)' }}>
              <Shield size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-down">
            <span>Needs +3.2%</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">Connected Runners</span>
          <div className="stat-card-row">
            <span className="stat-card-value" style={{ color: '#60a5fa' }}>12</span>
            <div className="stat-card-icon" style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa' }}>
              <Layers size={18} />
            </div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>K8s Autoscaled</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <div className="tab-strip" style={{ margin: 0 }}>
          {['ALL', 'JAVA', 'TYPESCRIPT', 'PYTHON'].map(lang => (
            <button
              key={lang}
              className={`tab-btn ${selectedLang === lang ? 'active' : ''}`}
              onClick={() => setSelectedLang(lang)}
            >
              {lang === 'ALL' ? 'All Languages' : lang.charAt(0) + lang.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 280, marginLeft: 'auto' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search projects or repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="topbar-search"
            style={{ width: '100%', paddingLeft: 30 }}
          />
        </div>
      </div>

      {/* Project Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 12 }}>
        {filteredProjects.map(project => (
          <div key={project.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="card-title">{project.name}</span>
                  {project.health === 'healthy' ? (
                    <span className="status-healthy">HEALTHY</span>
                  ) : (
                    <span className="status-degraded">DEGRADED</span>
                  )}
                </div>
                <div className="card-subtitle mono" style={{ fontSize: 11, color: 'var(--accent-light)', marginTop: 2 }}>
                  {project.repo}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{project.latestVersion}</span>
              </div>
            </div>

            <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                {project.description}
              </p>

              {/* Metrics Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, background: 'var(--bg-elevated)', padding: '8px 10px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Coverage</div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: parseInt(project.coverage) >= 80 ? 'var(--success)' : 'var(--danger)' }}>
                    {project.coverage}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Security</div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: project.cves > 0 ? 'var(--danger)' : 'var(--success)' }}>
                    {project.cves > 0 ? `${project.cves} High CVE` : '0 CVEs'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Pipelines Today</div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {project.pipelinesToday} runs
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Weekly Deploys</div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#60a5fa' }}>
                    {project.deploysThisWeek}
                  </div>
                </div>
              </div>

              {/* Meta row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 'auto', paddingTop: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: project.langColor }} />
                  <span>{project.language}</span>
                  <span>·</span>
                  <GitBranch size={11} />
                  <span className="mono">{project.branch}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>Team:</span>
                  <div style={{ display: 'flex', marginLeft: 4 }}>
                    {project.team.map((initials, i) => (
                      <div
                        key={i}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: i === 0 ? 'linear-gradient(135deg, #3b82f6, #7c3aed)' : 'linear-gradient(135deg, #f59e0b, #ef4444)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 9,
                          fontWeight: 700,
                          color: 'white',
                          marginLeft: i > 0 ? -6 : 0,
                          border: '1.5px solid var(--bg-card)'
                        }}
                      >
                        {initials}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: 8 }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => navigate('/pipelines')}
                >
                  Pipelines
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => navigate('/releases')}
                >
                  Releases
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate('/pipelines/142')}
                >
                  <Play size={11} /> Trigger Build
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Connect Repository Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: 500, maxWidth: '90vw', boxShadow: 'var(--shadow-lg)' }}>
            <div className="card-header">
              <div className="card-title">
                <FolderOpen size={16} color="var(--accent-light)" />
                <span>Connect New Git Repository</span>
              </div>
              <button className="topbar-icon-btn" style={{ width: 24, height: 24 }} onClick={() => setModalOpen(false)}>
                <X size={14} />
              </button>
            </div>
            <form onSubmit={handleCreateProject} style={{ padding: '16px 20px' }}>
              <div className="form-group">
                <label className="form-label">Project / Service Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Notification Engine"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Repository Path (GitHub / GitLab)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. acme/notification-engine"
                  value={newProject.repo}
                  onChange={(e) => setNewProject({ ...newProject, repo: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Language / Framework</label>
                  <select
                    className="form-input"
                    value={newProject.language}
                    onChange={(e) => setNewProject({ ...newProject, language: e.target.value })}
                  >
                    <option value="TypeScript (Node.js)">TypeScript (Node.js)</option>
                    <option value="Java (Spring Boot 3)">Java (Spring Boot 3)</option>
                    <option value="Python (FastAPI)">Python (FastAPI)</option>
                    <option value="Go (Golang 1.22)">Go (Golang 1.22)</option>
                    <option value="Rust (Actix/Tokio)">Rust (Actix/Tokio)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Default Deployment Branch</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="main"
                    value={newProject.branch}
                    onChange={(e) => setNewProject({ ...newProject, branch: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description &amp; Purpose</label>
                <textarea
                  className="form-input"
                  rows="2"
                  placeholder="Short description of this microservice..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Plus size={13} /> Register Project &amp; Enable AI Monitor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
