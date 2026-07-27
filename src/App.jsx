import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, ExternalLink, Send, Clock, ShieldCheck, Search, HelpCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = '/api';

function App() {
  const [notices, setNotices] = useState([]);
  const [status, setStatus] = useState({ last_checked: null });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [noticesRes, statusRes] = await Promise.all([
          axios.get(`${API_URL}/notices`),
          axios.get(`${API_URL}/status`)
        ]);
        setNotices(noticesRes.data);
        setStatus(statusRes.data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const filteredNotices = notices.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <header>
        <div className="logo">
          <Bell className="text-primary" size={28} color="#6366f1" />
          <h1>IUST Notice Bot</h1>
        </div>
        <div className="status-badge">
          <div className="status-dot"></div>
          <Clock size={14} />
          <span>Last checked: {status.last_checked ? new Date(status.last_checked).toLocaleTimeString() : 'Never'}</span>
        </div>
      </header>

      <main>
        <section className="hero">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Islamic University of Science & Technology (IUST) Live Notice Board
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Instant notifications for IUST exams, admissions, date sheets, and campus announcements delivered directly to your Telegram.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <a href="https://t.me/Iust98_bot" target="_blank" rel="noopener noreferrer" className="telegram-btn" aria-label="Subscribe to IUST Notice Bot on Telegram">
              <Send size={20} />
              Subscribe via Telegram
            </a>
          </motion.div>
        </section>

        <section style={{ marginBottom: '2rem', position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
          <input 
            type="text" 
            placeholder="Search IUST notices, exam updates, date sheets..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search notices"
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3rem',
              background: 'var(--glass)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              color: 'white',
              outline: 'none',
              fontSize: '1rem'
            }}
          />
        </section>

        <section className="notices-grid" aria-label="IUST Recent Notices">
          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="empty-state">Loading latest IUST notifications...</div>
            ) : filteredNotices.length > 0 ? (
              filteredNotices.map((notice, index) => (
                <motion.a
                  key={notice.id || index}
                  href={notice.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="notice-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <div className="notice-content">
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <div className="notice-date">{notice.date}</div>
                      <div style={{ fontSize: '0.75rem', padding: '0.1rem 0.5rem', background: 'var(--primary)', color: 'white', borderRadius: '4px' }}>
                        {notice.category || 'General'}
                      </div>
                    </div>
                    <div className="notice-title">{notice.title}</div>
                  </div>
                  <div className="notice-link">
                    <ExternalLink size={20} />
                  </div>
                </motion.a>
              ))
            ) : (
              <div className="empty-state">No notices found matching your search.</div>
            )}
          </AnimatePresence>
        </section>

        {/* SEO FAQ Section to rank high on Google Search */}
        <section style={{ marginTop: '4rem', padding: '2rem', background: 'var(--glass)', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle color="#6366f1" size={24} /> Frequently Asked Questions (FAQ)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
            <div>
              <h4 style={{ color: '#e2e8f0', marginBottom: '0.5rem' }}>What is the IUST Notice Bot?</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                The IUST Notice Bot is an automated notification service designed for students and faculty of the Islamic University of Science & Technology (IUST), Kashmir. It scans official university updates and sends instant alerts to Telegram.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#e2e8f0', marginBottom: '0.5rem' }}>How do I subscribe to instant IUST Telegram updates?</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                Simply click the <strong>Subscribe via Telegram</strong> button on this page or search for <code>@Iust98_bot</code> inside the Telegram app and tap Start.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#e2e8f0', marginBottom: '0.5rem' }}>Which notices are covered?</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                All official notices published on <code>iust.ac.in</code> including exam date sheets, result announcements, admission notifications, fee payment schedules, and general university news.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ marginTop: '5rem', textAlign: 'center', padding: '2rem', borderTop: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        <p>© 2026 IUST Notice Bot • Islamic University of Science & Technology Notice Tracker</p>
      </footer>
    </div>
  );
}

export default App;
