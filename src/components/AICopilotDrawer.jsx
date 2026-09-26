import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu, X, Send, Sparkles, CheckCircle, AlertTriangle, ArrowRight,
  RotateCcw, Shield, Terminal, Star, Bot, User
} from 'lucide-react';
import { aiChatHistory } from '../data/mockData.js';

const quickPrompts = [
  'Why did Pipeline #142 fail?',
  'Can I safely deploy v2.1.0 to production?',
  'What is our current rollback risk on Auth Service?',
  'Show test coverage breakdown'
];

export default function AICopilotDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(aiChatHistory);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { role: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      let actionBtn = null;

      const lower = query.toLowerCase();
      if (lower.includes('142') || lower.includes('fail') || lower.includes('payment')) {
        replyText = `**Root Cause Identified for Pipeline #142:**\n\nCommit \`abc123f\` reduced HikariCP \`maximum-pool-size\` from **20 → 5** in \`application.yml\`. Under integration test load (40 concurrent threads), connection exhaustion caused 2 integration tests to fail.\n\n• **Confidence:** 93%\n• **Affected File:** \`src/main/resources/application.yml\`\n• **Fix:** Revert pool size to 20. Estimated remediation time: ~15 mins.`;
        actionBtn = { label: 'Inspect Pipeline #142', path: '/pipelines/142' };
      } else if (lower.includes('v2.1.0') || lower.includes('safely deploy') || lower.includes('production')) {
        replyText = `⚠️ **Production Deployment Restricted for v2.1.0**\n\nRelease **v2.1.0** is currently **BLOCKED** by governance policy:\n\n1. **Policy Violation:** Code coverage is **67%** (Strict gate requires ≥80%).\n2. **Security CVE:** 1 High CVE detected in transitive dependency.\n3. **Approvals Required:** 2 approvers needed for High-Risk releases. Currently 0/2 approved.`;
        actionBtn = { label: 'Review Blocked Release', path: '/approvals' };
      } else if (lower.includes('rollback') || lower.includes('auth')) {
        replyText = `🔄 **Rollback Telemetry for Auth Microservice:**\n\nIncident **RB-104** was successfully executed 3 days ago. The service was rolled back from \`v2.0.8\` → \`v2.0.6\` in **1m 24s** after a 5xx error spike. Production is currently healthy and stable.`;
        actionBtn = { label: 'Open Rollback Console', path: '/rollback' };
      } else {
        replyText = `I have analyzed your release telemetry. The fleet is **94.3% healthy** across 5 clusters. 1 pipeline (#142) is failing and 1 release (v2.1.0) is awaiting coverage fixes. What specific service or pipeline would you like me to inspect?`;
        actionBtn = { label: 'View All Pipelines', path: '/pipelines' };
      }

      setMessages(prev => [...prev, { role: 'ai', text: replyText, actionBtn }]);
      setIsTyping(false);
    }, 1100);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', justifyContent: 'flex-end' }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }}
      />

      {/* Drawer Panel */}
      <div
        style={{
          position: 'relative',
          width: 480,
          maxWidth: '92vw',
          height: '100%',
          background: 'var(--bg-card)',
          borderLeft: '1px solid var(--border-accent)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--topbar-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--r-md)',
                background: 'linear-gradient(135deg, var(--accent), var(--violet))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <Cpu size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Release Captain AI</span>
                <span className="badge badge-success" style={{ fontSize: 9.5 }}>ONLINE</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Powered by Claude 3.7 Sonnet · Full Workspace Context
              </div>
            </div>
          </div>
          <button className="topbar-icon-btn" style={{ width: 28, height: 28 }} onClick={onClose}>
            <X size={15} />
          </button>
        </div>

        {/* Quick Question Chips */}
        <div style={{ padding: '10px 14px', background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: 6, overflowX: 'auto' }}>
          {quickPrompts.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: 11,
                padding: '4px 10px',
                borderRadius: 'var(--r-full)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-accent)';
                e.currentTarget.style.color = 'var(--accent-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {messages.map((msg, i) => (
            <div key={i} className={`chat-msg ${msg.role}`}>
              <div className={`chat-avatar ${msg.role}`}>
                {msg.role === 'ai' ? <Bot size={15} color="white" /> : <User size={15} color="white" />}
              </div>
              <div className="chat-bubble">
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, fontSize: 13 }}>
                  {msg.text}
                </div>
                {msg.actionBtn && (
                  <div style={{ marginTop: 10 }}>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: 11.5, padding: '4px 10px' }}
                      onClick={() => {
                        onClose();
                        navigate(msg.actionBtn.path);
                      }}
                    >
                      {msg.actionBtn.label} <ArrowRight size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-msg ai">
              <div className="chat-avatar ai">
                <Bot size={15} color="white" />
              </div>
              <div className="chat-bubble" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Release Captain is analyzing</span>
                <div className="thinking-dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border-subtle)', background: 'var(--topbar-bg)' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{ display: 'flex', gap: 8 }}
          >
            <input
              type="text"
              className="form-input"
              placeholder="Ask anything about releases, test failures, risk..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ fontSize: 13, padding: '8px 12px' }}
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={!input.trim()}
              style={{ padding: '0 14px' }}
            >
              <Send size={14} />
            </button>
          </form>
          <div style={{ fontSize: 10.5, color: 'var(--text-muted)', textAlign: 'center', marginTop: 6 }}>
            Release Captain Copilot connects CI telemetry, Kubernetes metrics &amp; Git audit trail.
          </div>
        </div>
      </div>
    </div>
  );
}
