import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import logo2 from "../../assets/logo/logo2.png"

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/* ── helpers ── */
const fmt = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

const serviceLabel = {
  fermentation: 'Fermentation & Distillation',
  biogas: 'Anaerobic Digestion & Biogas',
  'green-chem': 'Green Chemistry',
  co2: 'CO₂ Recovery',
  energy: 'Energy Optimization',
  other: 'Other',
};

/* ── component ── */
const SalesPannel = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [toast, setToast] = useState('');

  // State for sidebar toggle on mobile/tablet
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /* fetch all contacts */
  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { handleLogout(); return; }
      const data = await res.json();
      if (data.success) setContacts(data.data);
      else setError(data.error || 'Failed to load submissions.');
    } catch {
      setError('Cannot reach the server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

   /* logout */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  /* delete */
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this submission permanently?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`${API}/api/contacts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setContacts(prev => prev.filter(c => c._id !== id));
        showToast('Submission deleted.');
      } else {
        showToast(data.error || 'Delete failed.', true);
      }
    } catch {
      showToast('Network error. Try again.', true);
    } finally {
      setDeleting(null);
    }
  };

  const showToast = (msg, isErr = false) => {
    setToast({ msg, isErr });
    setTimeout(() => setToast(''), 3500);
  };

  /* filtered list */
  const filtered = contacts.filter(c => {
    const q = search.toLowerCase();
    return (
      c.fullName?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.service?.toLowerCase().includes(q) ||
      c.message?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] text-left">

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`w-[240px] shrink-0 bg-white border-r border-[#e2e8f0] flex flex-col h-screen overflow-hidden z-50 transition-transform duration-300 fixed top-0 left-0 lg:sticky lg:top-0 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-center p-5 relative">
          <img src={logo2} className="h-[100px]" alt="logo" />
          <button 
            className="lg:hidden absolute top-4 right-4 text-[#64748b] hover:text-[#1a3a2a] font-bold text-lg"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 p-[1.2rem_0.8rem]">
          <div className="flex items-center gap-[0.75rem] py-[0.7rem] px-[0.9rem] rounded-[9px] text-[0.88rem] text-[#1a3a2a] bg-[rgba(61,139,90,0.12)] font-semibold cursor-pointer">
            <svg className="w-[17px] h-[17px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
            </svg>
            Submissions
          </div>
        </nav>
        <div className="p-[1rem_1.2rem] border-t border-[rgba(106,170,125,0.1)]">
          <div className="flex items-center gap-[0.75rem] py-[0.7rem] mb-[0.8rem]">
            <div className="w-[34px] h-[34px] rounded-full bg-[#3D8F38] flex items-center justify-center text-[0.9rem] font-bold text-white shrink-0">A</div>
            <div>
              <div className="text-[0.85rem] font-semibold text-[#1a3a2a] leading-[1.3]">Sales</div>
              <div className="text-[0.72rem] text-[#3D8F38]">treebaytech@gmail.com</div>
            </div>
          </div>
          <button className="flex items-center gap-[0.6rem] w-full p-[0.6rem_0.9rem] bg-[#3D8F38] border border-[rgba(106,170,125,0.18)] rounded-[8px] text-white font-sans text-[0.82rem] cursor-pointer transition-all duration-200 hover:bg-[#387734] hover:border-[rgba(220,80,80,0.35)] hover:text-[rgba(238,216,216,0.85)]" onClick={handleLogout} title="Logout">
            <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content Wrapper (THIS WAS MISSING) ── */}
      <main className="flex-1 min-w-0 p-6 md:p-8 overflow-x-auto block">
        
        {/* Header */}
        <header className="flex items-start justify-between gap-4 mb-7 flex-wrap max-lg:flex-col">
          <div className="flex items-center gap-3">
          <button 
                className="lg:hidden flex items-center justify-center p-2 bg-white border border-[#e2e8f0] rounded-[8px] text-[#4a6157]"
                onClick={() => setIsSidebarOpen(true)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
          <div>
            <h1 className="font-['Cormorant_Garamond',serif] text-[1.9rem] font-bold text-[#1a3a2a]">
              Contact Submissions (Sales)
            </h1>
            <p className="text-[0.82rem] text-[#64748b] mt-1">
              {!loading && `${contacts.length} total submission${contacts.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          </div>
          <div className="flex gap-3 items-center flex-wrap">
            <button 
              className="flex items-center gap-2 py-2 px-4.5 bg-white border border-[#e2e8f0] rounded-[8px] text-[#4a6157] font-sans text-[0.82rem] font-medium cursor-pointer transition-all duration-200 hover:border-[#3d8b5a] hover:text-[#3d8b5a]" 
              onClick={fetchContacts} 
              title="Refresh"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              Refresh
            </button>
            <a href="/" target="_blank" className="py-2 px-4.5 bg-[#3D8F38] text-white no-underline rounded-[8px] text-[0.82rem] font-semibold transition-colors duration-200 hover:bg-[#2d6645]">
              ← View Site
            </a>
          </div>
        </header>

        {/* Stats strip */}
        <div className="flex gap-3 flex-wrap mb-6">
          <div className="bg-white border border-[#e2e8f0] rounded-[10px] p-[0.75rem_1.2rem] text-center min-w-[80px]">
            <span className="block font-['Cormorant_Garamond',serif] text-[1.6rem] font-bold text-[#3d8b5a] leading-none">{contacts.length}</span>
            <span className="block text-[0.68rem] text-[#64748b] mt-1 tracking-wider uppercase">Total</span>
          </div>
          {['fermentation', 'biogas', 'green-chem', 'co2', 'energy'].map(s => (
            <div className="bg-white border border-[#e2e8f0] rounded-[10px] p-[0.75rem_1.2rem] text-center min-w-[80px]" key={s}>
              <span className="block font-['Cormorant_Garamond',serif] text-[1.6rem] font-bold text-[#3d8b5a] leading-none">{contacts.filter(c => c.service === s).length}</span>
              <span className="block text-[0.68rem] text-[#64748b] mt-1 tracking-wider uppercase">{serviceLabel[s].split(' ')[0]}</span>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 bg-white border border-[#e2e8f0] rounded-[10px] px-4 py-[0.65rem] mb-6">
          <svg className="w-4 h-4 shrink-0 text-[#64748b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, service, or message…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border-none outline-none font-sans text-[0.88rem] text-[#1a3a2a] bg-transparent placeholder:text-[#64748b]"
          />
          {search && (
            <button className="bg-none border-none cursor-pointer text-[#64748b] text-[0.85rem] px-1 transition-colors duration-150 hover:text-[#1a3a2a]" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-[rgba(220,80,80,0.1)] border border-[rgba(220,80,80,0.3)] text-[rgba(200,50,50,0.9)] rounded-[10px] text-[0.875rem] flex items-center gap-3 mb-6">
            ⚠ {error}
            <button onClick={fetchContacts} className="ml-4 font-semibold cursor-pointer bg-none border-none color-inherit underline">Retry</button>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 px-8 text-[#64748b]">
            <span className="w-10 h-10 border-3 border-[rgba(61,139,90,0.2)] border-t-[#3d8b5a] rounded-full animate-spin" />
            <p>Loading submissions…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 px-8 text-[#4a6157]">
            <div className="text-[3.5rem] mb-4 opacity-60">📭</div>
            <h3 className="font-['Cormorant_Garamond',serif] text-[1.4rem] font-semibold text-[#1a3a2a] mb-2">{search ? 'No results found' : 'No submissions yet'}</h3>
            <p className="text-[0.875rem]">{search ? 'Try a different search term.' : 'Contact form submissions will appear here.'}</p>
          </div>
        ) : (
          <div className="bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden overflow-x-auto">
            <table className="w-full border-collapse text-[0.845rem]">
              <thead>
                <tr>
                  <th className="bg-[#e8f5ed] text-[#4a6157] text-[0.7rem] font-bold tracking-widest uppercase p-[0.85rem_1rem] text-left border-b border-[#e2e8f0] whitespace-nowrap">#</th>
                  <th className="bg-[#e8f5ed] text-[#4a6157] text-[0.7rem] font-bold tracking-widest uppercase p-[0.85rem_1rem] text-left border-b border-[#e2e8f0] whitespace-nowrap">Name</th>
                  <th className="bg-[#e8f5ed] text-[#4a6157] text-[0.7rem] font-bold tracking-widest uppercase p-[0.85rem_1rem] text-left border-b border-[#e2e8f0] whitespace-nowrap">Email</th>
                  <th className="bg-[#e8f5ed] text-[#4a6157] text-[0.7rem] font-bold tracking-widest uppercase p-[0.85rem_1rem] text-left border-b border-[#e2e8f0] whitespace-nowrap">Phone</th>
                  <th className="bg-[#e8f5ed] text-[#4a6157] text-[0.7rem] font-bold tracking-widest uppercase p-[0.85rem_1rem] text-left border-b border-[#e2e8f0] whitespace-nowrap">Service</th>
                  <th className="bg-[#e8f5ed] text-[#4a6157] text-[0.7rem] font-bold tracking-widest uppercase p-[0.85rem_1rem] text-left border-b border-[#e2e8f0] whitespace-nowrap">Message</th>
                  <th className="bg-[#e8f5ed] text-[#4a6157] text-[0.7rem] font-bold tracking-widest uppercase p-[0.85rem_1rem] text-left border-b border-[#e2e8f0] whitespace-nowrap">Received</th>
                  <th className="bg-[#e8f5ed] text-[#4a6157] text-[0.7rem] font-bold tracking-widest uppercase p-[0.85rem_1rem] text-left border-b border-[#e2e8f0] whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <Fragment key={c._id}>
                    <tr
                      className={`cursor-pointer transition-colors duration-150 border-b border-[rgba(61,139,90,0.07)] hover:bg-[rgba(232,245,237,0.5)] last:border-b-0 ${expanded === c._id ? 'bg-[rgba(232,245,237,0.7)]' : ''}`}
                      onClick={() => setExpanded(expanded === c._id ? null : c._id)}
                    >
                      <td className="p-[0.9rem_1rem] align-top text-[#64748b] text-[0.78rem] font-semibold min-w-[34px]">{i + 1}</td>
                      <td className="p-[0.9rem_1rem] align-top font-semibold text-[#1a3a2a] whitespace-nowrap">{c.fullName || '—'}</td>
                      <td className="p-[0.9rem_1rem] align-top">
                        <a href={`mailto:${c.email}`} className="text-[#3d8b5a] no-underline whitespace-nowrap hover:underline" onClick={e => e.stopPropagation()}>
                          {c.email}
                        </a>
                      </td>
                      <td className="p-[0.9rem_1rem] align-top">{c.phone || <span className="text-[#64748b]">—</span>}</td>
                      <td className="p-[0.9rem_1rem] align-top">
                        {c.service ? (
                          <span className="inline-block bg-[#e8f5ed] text-[#2d6645] text-[0.7rem] font-semibold px-2.5 py-0.5 rounded-[20px] border border-[rgba(61,139,90,0.2)] whitespace-nowrap">{serviceLabel[c.service] || c.service}</span>
                        ) : <span className="text-[#64748b]">—</span>}
                      </td>
                      <td className="p-[0.9rem_1rem] align-top text-[#4a6157] max-w-[220px] leading-relaxed relative group/msg">
                        <span className="block overflow-hidden text-ellipsis whitespace-nowrap max-w-[220px] cursor-help">{c.message}</span>
                        {c.message?.length > 60 && (
                          <span className="hidden group-hover/msg:block absolute top-[calc(100%+6px)] left-0 z-[20] bg-[#1a3a2a] text-[#a8d5b5] text-[0.8rem] leading-relaxed p-4 rounded-[8px] border border-[rgba(106,170,125,0.25)] shadow-[0_8px_24px_rgba(0,0,0,0.25)] w-[320px] max-w-[90vw] whitespace-normal break-words pointer-events-none">{c.message}</span>
                        )}
                      </td>
                      <td className="p-[0.9rem_1rem] align-top text-[#64748b] text-[0.78rem] whitespace-nowrap">{fmt(c.createdAt)}</td>
                      <td className="p-[0.9rem_1rem] align-top" onClick={e => e.stopPropagation()}>
                        <button
                          className="bg-none border border-[rgba(220,80,80,0.25)] rounded-[7px] cursor-pointer text-[rgba(180,60,60,0.6)] p-1.5 flex items-center justify-center transition-all duration-200 hover:bg-[rgba(220,80,80,0.08)] hover:border-[rgba(220,80,80,0.5)] hover:text-[#c83232] disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleDelete(c._id)}
                          disabled={deleting === c._id}
                          title="Delete submission"
                        >
                          {deleting === c._id ? <span className="w-3.5 h-3.5 border-2 border-[rgba(200,60,60,0.3)] border-t-[#c83232] rounded-full animate-spin" /> : (
                            <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6" /><path d="M14 11v6" />
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                          )}
                        </button>
                      </td>
                    </tr>
                    {expanded === c._id && (
                      <tr key={`${c._id}-exp`} className="bg-[#e8f5ed] border-b border-[#e2e8f0]">
                        <td colSpan="8">
                          <div className="py-4 px-4 pl-14 text-[0.875rem] text-[#4a6157] leading-[1.7]">
                            <strong className="block text-[0.7rem] uppercase tracking-widest text-[#3d8b5a] mb-2 font-bold">Full Message:</strong>
                            <p>{c.message}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-8 right-8 ${toast.isErr ? 'bg-[#3d1a1a] text-[rgba(255,120,120,0.9)] border-[rgba(220,80,80,0.3)]' : 'bg-[#1a3a2a] text-[#a8d5b5] border-[rgba(106,170,125,0.25)]'} p-[0.8rem_1.4rem] rounded-[10px] text-[0.875rem] font-medium shadow-[0_8px_28px_rgba(26,58,42,0.3)] border z-[9999] animate-in fade-in slide-in-from-bottom-2 duration-300`}>
          {toast.isErr ? '✕' : '✓'} {toast.msg}
        </div>
      )}
    </div>
  );
};

export default SalesPannel;