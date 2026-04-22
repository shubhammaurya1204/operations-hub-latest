import React, { useState, useEffect, useCallback } from 'react';
import { User2, Loader2, AlertCircle } from 'lucide-react';
import EditUserModal from './EditUserModal'; // 👈 Import your new Modal

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// 📅 Date Formatting Utility
const fmt = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const UserManagementView = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // 🛠️ Modal Management State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // 🔄 Data Fetching Flow
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      
      if (res.status === 401) {
        setError('Unauthorized: Your session has expired. Please login again.');
      } else if (res.status === 403) {
        setError('Access Denied: Only admins can access user management.');
      } else if (data.success) {
        setUsers(data.data);
      } else {
        setError(data.error || data.msg || 'Failed to load users.');
      }
    } catch {
      setError('Cannot reach the server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 🔍 Search Logic
  const filteredUsers = users.filter(u => {
    const q = search.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q))
    );
  });

  // ✏️ Open Modal Handler
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // 💾 Save Changes Handler (Called from Modal)
  const handleSaveUser = async (updatedUserData) => {
    console.log("Saving user data to DB:", updatedUserData);
    
    // TODO: Add your API fetch request here to update the user in the database
    /*
    try {
      await fetch(`${API}/api/users/${updatedUserData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updatedUserData)
      });
      fetchUsers(); // Refresh the list
    } catch (err) { console.error(err); }
    */
    
    // Close the modal after saving
    setIsEditModalOpen(false);
  };

  return (
    <div className="relative">
      {/* Header Section */}
      <div className="flex items-start justify-between gap-4 mb-7 flex-wrap max-lg:flex-col">
        <div>
          <h1 className="font-['Cormorant_Garamond',serif] text-[1.9rem] font-bold text-[#1a3a2a]">User Management</h1>
          <p className="text-[0.82rem] text-[#64748b] mt-1">
            {!loading ? `Managing ${users.length} registered user${users.length !== 1 ? 's' : ''}` : 'Manage admin access and user accounts.'}
          </p>
        </div>
        <div className="flex gap-3 items-center flex-wrap">
          <button 
            onClick={fetchUsers}
            className="flex items-center gap-2 py-2 px-4 bg-white border border-[#e2e8f0] rounded-[8px] text-[#4a6157] font-sans text-[0.82rem] font-medium cursor-pointer transition-all duration-200 hover:border-[#3d8b5a] hover:text-[#3d8b5a]"
            title="Refresh"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Refresh
          </button>
          <button className="flex items-center gap-2 py-2 px-4.5 bg-[#3D8F38] border border-transparent rounded-[8px] text-white font-sans text-[0.82rem] font-medium cursor-pointer transition-all duration-200 hover:bg-[#2d6645]">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New User
          </button>
        </div>
      </div>

      {/* 🔍 Search Bar */}
      <div className="flex items-center gap-3 bg-white border border-[#e2e8f0] rounded-[10px] px-4 py-[0.65rem] mb-6 shadow-sm">
        <svg className="w-4 h-4 shrink-0 text-[#64748b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search users by name, email, or role…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border-none outline-none font-sans text-[0.88rem] text-[#1a3a2a] bg-transparent placeholder:text-[#64748b]"
        />
        {search && (
          <button className="text-[#64748b] hover:text-[#1a3a2a] transition-colors" onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      {/* ❌ Error Handling */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-[10px] text-[0.875rem] flex items-center gap-3 mb-6">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={fetchUsers} className="ml-auto font-semibold underline hover:text-red-900 transition-colors">
            Retry
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white border border-[#e2e8f0] rounded-[12px] flex flex-col items-center justify-center gap-4 py-20 px-8 text-[#64748b]">
          <Loader2 className="w-10 h-10 animate-spin text-[#3d8b5a]" />
          <p>Loading users…</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden">
          <div className="flex flex-col items-center justify-center text-center py-20 px-8 text-[#4a6157]">
            <User2 className="w-14 h-14 mb-4 opacity-60 text-[#3d8b5a]" />       
            <h3 className="font-['Cormorant_Garamond',serif] text-[1.6rem] font-semibold text-[#1a3a2a] mb-2">
              {search ? 'No matches found' : 'No users found'}
            </h3>
            <p className="text-[0.875rem] max-w-sm">
              {search ? 'Try adjusting your search criteria.' : 'Connect your API or add new users to display them here.'}
            </p>     
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden overflow-x-auto shadow-sm">
          <table className="w-full border-collapse text-[0.845rem]">
            <thead>
              <tr>
                <th className="bg-[#e8f5ed] text-[#4a6157] text-[0.7rem] font-bold tracking-widest uppercase p-[0.85rem_1rem] text-left border-b border-[#e2e8f0] whitespace-nowrap">#</th>
                <th className="bg-[#e8f5ed] text-[#4a6157] text-[0.7rem] font-bold tracking-widest uppercase p-[0.85rem_1rem] text-left border-b border-[#e2e8f0] whitespace-nowrap">Name</th>
                <th className="bg-[#e8f5ed] text-[#4a6157] text-[0.7rem] font-bold tracking-widest uppercase p-[0.85rem_1rem] text-left border-b border-[#e2e8f0] whitespace-nowrap">Email</th>
                <th className="bg-[#e8f5ed] text-[#4a6157] text-[0.7rem] font-bold tracking-widest uppercase p-[0.85rem_1rem] text-left border-b border-[#e2e8f0] whitespace-nowrap">Role</th>
                <th className="bg-[#e8f5ed] text-[#4a6157] text-[0.7rem] font-bold tracking-widest uppercase p-[0.85rem_1rem] text-left border-b border-[#e2e8f0] whitespace-nowrap">Joined Date</th>
                <th className="bg-[#e8f5ed] text-[#4a6157] text-[0.7rem] font-bold tracking-widest uppercase p-[0.85rem_1rem] text-left border-b border-[#e2e8f0] whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user._id} className="transition-colors duration-150 border-b border-[rgba(61,139,90,0.07)] hover:bg-[rgba(232,245,237,0.5)] last:border-b-0">
                  <td className="p-[0.9rem_1rem] text-[#64748b] font-semibold">{index + 1}</td>
                  <td className="p-[0.9rem_1rem] font-semibold text-[#1a3a2a] capitalize">{user.name || '—'}</td>
                  <td className="p-[0.9rem_1rem]">
                    <a href={`mailto:${user.email}`} className="text-[#3d8b5a] no-underline hover:underline">
                      {user.email}
                    </a>
                  </td>
                  <td className="p-[0.9rem_1rem]">
                    <span className={`inline-block px-2.5 py-1 rounded-[6px] text-[0.7rem] font-bold uppercase tracking-wider border ${
                      user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                      user.role === 'hr' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      user.role === 'sales' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-[0.9rem_1rem] text-[#64748b]">{fmt(user.createdAt)}</td>
                  <td className="p-[0.9rem_1rem]">
                     <button 
                       onClick={() => handleEditClick(user)}
                       className="text-[#3d8b5a] hover:text-[#1a3a2a] font-semibold text-[0.8rem] transition-colors hover:underline"
                     >
                       Edit
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 📝 Render the Edit User Modal */}
      <EditUserModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        user={selectedUser} 
        onSave={handleSaveUser} 
      />

    </div>
  );
};

export default UserManagementView;