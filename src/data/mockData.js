// ============================================================
//  RELEASE CAPTAIN — Mock Data
// ============================================================

export const currentUser = {
  id: 1,
  name: 'Pavan Kumar',
  initials: 'PK',
  email: 'pavan@acmecorp.io',
  role: 'RELEASE_MANAGER',
};

export const projects = [
  { id: 1, name: 'Medical Inventory API',  repo: 'acme/medical-inventory',  language: 'Java',       stars: 142, health: 'healthy',  branch: 'main',     lastDeploy: '2h ago' },
  { id: 2, name: 'E-Commerce Platform',    repo: 'acme/ecom-platform',      language: 'TypeScript', stars: 318, health: 'degraded', branch: 'main',     lastDeploy: '5h ago' },
  { id: 3, name: 'AI Study Planner',       repo: 'acme/study-planner',      language: 'Python',     stars: 87,  health: 'healthy',  branch: 'develop',  lastDeploy: '1d ago' },
  { id: 4, name: 'Auth Microservice',      repo: 'acme/auth-service',       language: 'Java',       stars: 64,  health: 'healthy',  branch: 'main',     lastDeploy: '3d ago' },
];

export const pipelines = [
  {
    id: 142,
    project: 'E-Commerce Platform',
    branch: 'main',
    commit: 'abc123f',
    commitMsg: 'fix: update SecurityConfig JWT filter chain',
    author: 'Pavan Kumar',
    authorInitials: 'PK',
    status: 'failed',
    duration: '3m 42s',
    triggeredAt: '10:28 AM',
    stages: [
      { name: 'Build',       status: 'success', duration: '45s'  },
      { name: 'Unit Tests',  status: 'success', duration: '1m 2s' },
      { name: 'Security',    status: 'warning', duration: '38s'  },
      { name: 'Integration', status: 'failed',  duration: '1m 12s' },
      { name: 'Deploy',      status: 'idle',    duration: '--'   },
    ],
    testResults: { unit: { pass: 126, total: 126 }, integration: { pass: 38, total: 40 }, api: { pass: 24, total: 24 } },
    security: { critical: 0, high: 1, medium: 3, low: 7 },
    riskLevel: 'high',
    riskReasons: ['37 files changed', 'Database migration detected', 'Authentication configuration changed', '2 integration tests failing'],
  },
  {
    id: 141,
    project: 'Medical Inventory API',
    branch: 'main',
    commit: 'de4f891',
    commitMsg: 'feat: add batch expiry scanning',
    author: 'Ananya Sharma',
    authorInitials: 'AS',
    status: 'success',
    duration: '5m 21s',
    triggeredAt: '9:45 AM',
    stages: [
      { name: 'Build',       status: 'success', duration: '52s'  },
      { name: 'Unit Tests',  status: 'success', duration: '1m 18s' },
      { name: 'Security',    status: 'success', duration: '41s'  },
      { name: 'Integration', status: 'success', duration: '1m 30s' },
      { name: 'Deploy',      status: 'success', duration: '1m'   },
    ],
    testResults: { unit: { pass: 204, total: 204 }, integration: { pass: 52, total: 52 }, api: { pass: 36, total: 36 } },
    security: { critical: 0, high: 0, medium: 1, low: 4 },
    riskLevel: 'low',
    riskReasons: [],
  },
  {
    id: 140,
    project: 'AI Study Planner',
    branch: 'develop',
    commit: 'ff2ac09',
    commitMsg: 'chore: bump openai sdk to 4.2.0',
    author: 'Riya Patel',
    authorInitials: 'RP',
    status: 'running',
    duration: '2m 11s',
    triggeredAt: '10:42 AM',
    stages: [
      { name: 'Build',       status: 'success', duration: '48s'  },
      { name: 'Unit Tests',  status: 'running', duration: '--'   },
      { name: 'Security',    status: 'idle',    duration: '--'   },
      { name: 'Integration', status: 'idle',    duration: '--'   },
      { name: 'Deploy',      status: 'idle',    duration: '--'   },
    ],
    testResults: null,
    security: null,
    riskLevel: 'low',
    riskReasons: [],
  },
  {
    id: 139,
    project: 'Auth Microservice',
    branch: 'main',
    commit: 'bb91a34',
    commitMsg: 'fix: session expiry edge case',
    author: 'Pavan Kumar',
    authorInitials: 'PK',
    status: 'success',
    duration: '7m 12s',
    triggeredAt: 'Yesterday',
    stages: [
      { name: 'Build',       status: 'success', duration: '1m 2s' },
      { name: 'Unit Tests',  status: 'success', duration: '2m 10s' },
      { name: 'Security',    status: 'success', duration: '55s'  },
      { name: 'Integration', status: 'success', duration: '2m 5s' },
      { name: 'Deploy',      status: 'success', duration: '1m'   },
    ],
    testResults: { unit: { pass: 88, total: 88 }, integration: { pass: 24, total: 24 }, api: { pass: 18, total: 18 } },
    security: { critical: 0, high: 0, medium: 0, low: 2 },
    riskLevel: 'low',
    riskReasons: [],
  },
];

export const aiAnalysis = {
  pipelineId: 142,
  status: 'complete',
  rootCause: {
    summary: 'PaymentService cannot establish a database connection. The connection pool configuration was modified in commit abc123f, reducing max-pool-size from 20 to 5, causing connection exhaustion under integration test load.',
    confidence: 93,
    affectedFile: 'src/main/resources/application.yml',
    commitSHA: 'abc123f',
    changedBy: 'Pavan Kumar',
  },
  findings: [
    { severity: 'critical', title: 'Connection pool exhaustion', detail: 'application.yml: maximum-pool-size changed from 20 → 5. Under integration test concurrency (40 threads), the pool is starved.' },
    { severity: 'warning',  title: 'SecurityConfig JWT filter order', detail: 'SecurityFilterChain registration may be out of order after recent refactor in SecurityConfig.java.' },
    { severity: 'info',     title: 'Database migration pending', detail: 'V9__add_payment_index.sql is unapplied on the test database.' },
  ],
  recommendation: {
    title: 'Restore connection pool size and verify JWT filter chain',
    steps: [
      'Revert maximum-pool-size to 20 in application.yml',
      'Verify SecurityFilterChain bean order in SecurityConfig.java',
      'Apply pending migration V9__add_payment_index.sql to test DB',
      'Re-run integration test suite to confirm green',
    ],
    risk: 'medium',
    estimatedFixTime: '~15 minutes',
  },
};

export const releases = [
  { id: 'v2.1.0', project: 'E-Commerce Platform', status: 'blocked', risk: 'high',   deploy: 'Production', date: 'Today 10:30 AM',  duration: '--',     approvedBy: null },
  { id: 'v2.0.9', project: 'Medical Inventory API', status: 'success', risk: 'low',   deploy: 'Production', date: 'Yesterday',       duration: '5m 21s', approvedBy: 'Pavan Kumar' },
  { id: 'v2.0.8', project: 'Auth Microservice',     status: 'rollback', risk: 'high', deploy: 'Production', date: '3 days ago',      duration: '3m 42s', approvedBy: 'Admin' },
  { id: 'v2.0.7', project: 'AI Study Planner',      status: 'success', risk: 'medium', deploy: 'Staging',  date: '5 days ago',      duration: '8m 10s', approvedBy: 'Ananya Sharma' },
  { id: 'v1.9.3', project: 'E-Commerce Platform',   status: 'success', risk: 'low',   deploy: 'Production', date: '1 week ago',      duration: '6m 55s', approvedBy: 'Pavan Kumar' },
];

export const deploymentHistory = [
  { version: 'v2.0.9', env: 'Production', status: 'success',  date: 'Yesterday 11:02 AM', duration: '4m 18s', health: 'healthy' },
  { version: 'v2.0.8', env: 'Production', status: 'rollback', date: '3 days ago 3:22 PM', duration: '3m 42s', health: 'rolled back' },
  { version: 'v2.0.7', env: 'Staging',    status: 'success',  date: '5 days ago 2:10 PM', duration: '3m 01s', health: 'healthy' },
  { version: 'v2.0.6', env: 'Production', status: 'success',  date: '8 days ago 9:55 AM', duration: '5m 42s', health: 'healthy' },
];

export const healthMetrics = {
  overall: 'healthy',
  uptime: '99.97%',
  responseTime: 142,
  errorRate: 0.4,
  cpu: 41,
  memory: 58,
  requests: '1,247 / min',
  lastChecked: '30 seconds ago',
};

export const auditLogs = [
  { id: 1, user: 'Pavan Kumar',   action: 'APPROVED_RELEASE',    resource: 'v2.0.9', time: 'Yesterday 11:00 AM', result: 'success', ip: '10.0.1.42' },
  { id: 2, user: 'Admin',         action: 'ROLLBACK_INITIATED',  resource: 'v2.0.8', time: '3 days ago 3:20 PM', result: 'success', ip: '10.0.1.1'  },
  { id: 3, user: 'Pavan Kumar',   action: 'AI_ANALYSIS_RUN',     resource: 'Pipeline #142', time: 'Today 10:35 AM', result: 'success', ip: '10.0.1.42' },
  { id: 4, user: 'Ananya Sharma', action: 'APPROVED_RELEASE',    resource: 'v2.0.7', time: '5 days ago 2:08 PM', result: 'success', ip: '10.0.1.55' },
  { id: 5, user: 'System',        action: 'POLICY_BLOCKED',      resource: 'v2.1.0', time: 'Today 10:30 AM',     result: 'blocked', ip: '--'        },
  { id: 6, user: 'Riya Patel',    action: 'PIPELINE_TRIGGERED',  resource: 'Pipeline #140', time: 'Today 10:42 AM', result: 'running', ip: '10.0.1.77' },
];

export const policyRules = [
  { id: 1, rule: 'All unit tests must pass',              status: 'pass', category: 'Testing'   },
  { id: 2, rule: 'Security critical vulnerabilities = 0', status: 'pass', category: 'Security'  },
  { id: 3, rule: 'Code coverage ≥ 80%',                  status: 'fail', category: 'Quality',  detail: 'Current: 67%' },
  { id: 4, rule: 'Build must succeed',                    status: 'pass', category: 'Build'     },
  { id: 5, rule: 'Production requires Release Manager approval', status: 'pending', category: 'Governance' },
  { id: 6, rule: 'High-risk releases require 2 approvers', status: 'pending', category: 'Governance' },
];

export const aiChatHistory = [
  {
    role: 'ai',
    text: "👋 Hello Pavan! I'm Release Captain AI. I've finished analyzing Pipeline #142. Want a summary?",
  },
  {
    role: 'user',
    text: 'Yes, why did the latest production deployment fail?',
  },
  {
    role: 'ai',
    text: `The integration tests failed because **PaymentService** cannot establish database connections. Here's what I found:

**Root Cause:** The \`maximum-pool-size\` in \`application.yml\` was reduced from **20 → 5** in commit \`abc123f\`. Under integration test concurrency, the pool is completely exhausted.

**Confidence:** 93%

**Recommended Fix:** Revert the pool size to 20 and re-run the integration suite. This should take ~15 minutes.

Shall I create a fix branch and open a PR?`,
  },
];

export const dashboardStats = {
  totalDeployments: 142,
  successRate: 94.3,
  failedReleases: 8,
  avgReleaseTime: '8m 32s',
  pipelinesToday: 6,
  activeAgents: 3,
};

export const releaseTimeline = [
  { month: 'Apr', deployments: 18, failures: 2 },
  { month: 'May', deployments: 22, failures: 1 },
  { month: 'Jun', deployments: 19, failures: 3 },
  { month: 'Jul', deployments: 25, failures: 1 },
  { month: 'Aug', deployments: 28, failures: 2 },
  { month: 'Sep', deployments: 30, failures: 2 },
];
