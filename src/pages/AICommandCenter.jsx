import { useState, useRef, useEffect } from 'react';
import { Cpu, Send, Zap, GitBranch, Rocket, Shield, AlertTriangle, RefreshCw } from 'lucide-react';
import { aiChatHistory, pipelines } from '../data/mockData.js';

const SUGGESTIONS = [
  'Why did Pipeline #142 fail?',
  'Show me today\'s failed releases',
  'What is the release risk for v2.1.0?',
  'Can I deploy E-Commerce Platform to production?',
  'Analyze the latest integration test failures',
  'What changed between v2.0.8 and v2.0.9?',
];

const AI_RESPONSES = {
  'Why did Pipeline #142 fail?': `**Pipeline #142 failed** at the Integration Tests stage.

**Root Cause:** The \`maximum-pool-size\` in \`application.yml\` was reduced from **20 → 5** in commit \`abc123f\` by Pavan Kumar. Under integration test concurrency, the HikariCP pool is completely exhausted.

**Error:** \`HikariPool-1 - Connection is not available, request timed out after 30000ms\`

**Confidence:** 93%

**Recommended Fix:**
1. Revert \`maximum-pool-size\` to 20 in application.yml
2. Apply pending migration V9__add_payment_index.sql
3. Re-run integration test suite

Estimated fix time: ~15 minutes. Risk: MEDIUM.`,

  'Show me today\'s failed releases': `Here are today's failed/blocked releases:

**1. v2.1.0 — E-Commerce Platform** 🔴 BLOCKED
- Reason: Code coverage 67% (required ≥80%)
- Pipeline: #142 — Integration tests failing
- Risk: HIGH

**1 pipeline currently failing, 1 release blocked.**

The root issue is the database connection pool change in commit \`abc123f\`. Fix that first and the tests should recover, which will bring coverage back above 80%.`,

  'default': `I analyzed the current system state. Here's a summary:

- **{count} pipelines** are currently active across your projects
- **1 critical failure** in Pipeline #142 (E-Commerce Platform)
- **1 release blocked** due to policy violations
- Production health is **🟢 Healthy** (99.97% uptime)

Is there something specific you'd like me to investigate?`,
};

function renderMarkdown(text) {
  // Simple markdown-ish rendering
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code style="font-family:var(--font-mono);background:var(--bg-elevated);padding:1px 6px;border-radius:4px;font-size:12px;color:var(--accent-primary)">$1</code>')
    .replace(/\n/g, '<br />');
}

export default function AICommandCenter() {
  const [messages, setMessages] = useState(aiChatHistory);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responseText = AI_RESPONSES[text] || AI_RESPONSES['default'].replace('{count}', pipelines.length);
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'ai', text: responseText }]);
    }, 1800);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="page-enter">
      <div className="grid-2" style={{ gap: 24, alignItems: 'start' }}>
        {/* Chat Panel */}
        <div style={{ gridColumn: 'span 1' }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Panel Header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'linear-gradient(135deg, rgba(77,166,255,.08), rgba(34,211,238,.04))',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div className="sidebar-logo-icon" style={{ width: 36, height: 36 }}>
                <Cpu size={16} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Release Captain AI</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Your AI Release Copilot · GPT-4 powered</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div className="status-dot success" />
                <span style={{ fontSize: 12, color: 'var(--success)' }}>Online</span>
              </div>
            </div>

            {/* Chat Area */}
            <div ref={chatRef} className="ai-chat-container" style={{ padding: '20px 20px 0', maxHeight: 440 }}>
              {messages.map((msg, i) => (
                <div key={i} className={`chat-msg ${msg.role}`}>
                  <div className={`chat-avatar ${msg.role}`}>
                    {msg.role === 'ai' ? '⚡' : 'PK'}
                  </div>
                  <div
                    className="chat-bubble"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
                  />
                </div>
              ))}
              {isTyping && (
                <div className="chat-msg ai">
                  <div className="chat-avatar ai">⚡</div>
                  <div className="chat-bubble" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Analyzing</span>
                    <div className="thinking-dots">
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ padding: '16px 20px 20px' }}>
              <div className="ai-input-area">
                <textarea
                  className="ai-input"
                  rows={2}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask anything about your releases, pipelines, failures..."
                />
                <button
                  className="btn btn-primary"
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isTyping}
                  style={{ alignSelf: 'flex-end', height: 42 }}
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Suggested Commands */}
          <div className="card p-6">
            <div style={{ fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={15} color="var(--accent-primary)" /> Quick Commands
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  className="btn btn-ghost"
                  style={{ justifyContent: 'flex-start', textAlign: 'left', fontSize: 13 }}
                  onClick={() => sendMessage(s)}
                >
                  "{s}"
                </button>
              ))}
            </div>
          </div>

          {/* Active Agents */}
          <div className="card p-6">
            <div style={{ fontWeight: 700, marginBottom: 14 }}>Active AI Agents</div>
            {[
              { name: 'Failure Analyzer',     status: 'idle',    icon: <AlertTriangle size={14} />, desc: 'Monitoring pipelines' },
              { name: 'Root Cause Agent',      status: 'running', icon: <RefreshCw size={14} />,    desc: 'Analyzing Pipeline #142' },
              { name: 'Security Agent',        status: 'idle',    icon: <Shield size={14} />,        desc: 'Last scan 2h ago' },
              { name: 'Release Risk Agent',    status: 'idle',    icon: <GitBranch size={14} />,     desc: 'Risk model ready' },
              { name: 'Deployment Agent',      status: 'idle',    icon: <Rocket size={14} />,        desc: 'Awaiting approval' },
            ].map(agent => (
              <div key={agent.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{
                  width: 32, height: 32,
                  background: agent.status === 'running' ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                  border: `1px solid ${agent.status === 'running' ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: agent.status === 'running' ? 'var(--accent-primary)' : 'var(--text-muted)',
                  flexShrink: 0,
                }}>
                  {agent.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{agent.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{agent.desc}</div>
                </div>
                <div className={`status-dot ${agent.status === 'running' ? 'running' : 'idle'}`} />
              </div>
            ))}
          </div>

          {/* Tool Access */}
          <div className="card p-6">
            <div style={{ fontWeight: 700, marginBottom: 12 }}>AI Tool Permissions</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.8 }}>
              <div style={{ marginBottom: 6 }}>✅ Read pipeline logs & test results</div>
              <div style={{ marginBottom: 6 }}>✅ Analyze git diffs & commits</div>
              <div style={{ marginBottom: 6 }}>✅ Generate fix recommendations</div>
              <div style={{ marginBottom: 6 }}>✅ Create PR / fix branches (with approval)</div>
              <div style={{ marginBottom: 6, color: 'var(--danger)' }}>✗ Deploy to production without approval</div>
              <div style={{ color: 'var(--danger)' }}>✗ Modify IAM or security policies</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
