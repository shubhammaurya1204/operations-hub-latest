import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo2 from "../../assets/logo/logo2.png"
import SubmissionsView from '../../Components/ADMIN/SubmissionsView';
import UserManagementView from '../../Components/ADMIN/UserManagementView';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const [activeTab, setActiveTab] = useState('submissions'); // 'submissions' or 'users'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/auth/login", { replace: true });
    } else if (role !== "admin") {
      navigate("/unauthorized", { replace: true });
    }
  }, [token, role, navigate]);

  if (!token || role !== "admin") return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login', { replace: true });
  };

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
          <img src={logo2} loading='lazy' className="h-[100px]" alt="logo" />
          <button 
            className="lg:hidden absolute top-4 right-4 text-[#64748b] hover:text-[#1a3a2a] font-bold text-lg"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 p-[1.2rem_0.8rem] space-y-2">
          {/* Submissions Tab */}
          <div 
            onClick={() => { setActiveTab('submissions'); setIsSidebarOpen(false); }}
            className={`flex items-center gap-[0.75rem] py-[0.7rem] px-[0.9rem] rounded-[9px] text-[0.88rem] font-semibold cursor-pointer transition-colors ${activeTab === 'submissions' ? 'text-[#1a3a2a] bg-[rgba(61,139,90,0.12)]' : 'text-[#64748b] hover:bg-gray-50'}`}
          >
            <svg className="w-[17px] h-[17px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
            </svg>
            Submissions
          </div>

          {/* User Management Tab */}
          <div 
            onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }}
            className={`flex items-center gap-[0.75rem] py-[0.7rem] px-[0.9rem] rounded-[9px] text-[0.88rem] font-semibold cursor-pointer transition-colors ${activeTab === 'users' ? 'text-[#1a3a2a] bg-[rgba(61,139,90,0.12)]' : 'text-[#64748b] hover:bg-gray-50'}`}
          >
            <svg className="w-[17px] h-[17px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            User Management 
          </div>
        </nav>

        <div className="p-[1rem_1.2rem] border-t border-[rgba(106,170,125,0.1)]">
          <div className="flex items-center gap-[0.75rem] py-[0.7rem] mb-[0.8rem]">
            <div className="w-[34px] h-[34px] rounded-full bg-[#3D8F38] flex items-center justify-center text-[0.9rem] font-bold text-white shrink-0">A</div>
            <div>
              <div className="text-[0.85rem] font-semibold text-[#1a3a2a] leading-[1.3]">Admin</div>
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

      {/* ── Main content Area ── */}
      <main className="flex-1 min-w-0 p-6 md:p-8 overflow-x-auto">
        <header className="flex items-center gap-3 mb-7 lg:hidden">
            <button 
              className="flex items-center justify-center p-2 bg-white border border-[#e2e8f0] rounded-[8px] text-[#4a6157]"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
        </header>

        {/* Dynamic Component Rendering based on Tab */}
        {activeTab === 'submissions' ? (
          <SubmissionsView token={token} onLogout={handleLogout} />
        ) : (
          <UserManagementView token={token} />
        )}
      </main>

    </div>
  );
};

export default AdminDashboard;