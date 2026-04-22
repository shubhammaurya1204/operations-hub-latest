import React, { useState, useEffect } from 'react';
import { X, User, Camera } from 'lucide-react';

// 📅 Date Formatting Utility for the read-only date field
const fmt = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const EditUserModal = ({ isOpen, onClose, user, onSave }) => {
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'sales',
    permissions: { add: false, edit: false, delete: false, all: false }
  });

  // 🔄 Reset the form with the selected user's data whenever the modal opens
  useEffect(() => {
    if (user && isOpen) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'sales',
        permissions: user.permissions || { add: false, edit: false, delete: false, all: false }
      });
    }
  }, [user, isOpen]);

  // If modal is not open or no user is selected, don't render anything
  if (!isOpen || !user) return null;

  // ✅ Checkbox Logic
  const handlePermissionChange = (perm) => {
    setEditForm((prev) => {
      const newPerms = { ...prev.permissions };
      
      if (perm === 'all') {
        const newState = !newPerms.all;
        return { ...prev, permissions: { add: newState, edit: newState, delete: newState, all: newState } };
      } else {
        newPerms[perm] = !newPerms[perm];
        // Auto-check "all" if add, edit, and delete are all checked
        if (newPerms.add && newPerms.edit && newPerms.delete) newPerms.all = true;
        else newPerms.all = false;
        
        return { ...prev, permissions: newPerms };
      }
    });
  };

  const handleSaveChanges = () => {
    // Send the updated data back to the parent component
    onSave({ id: user._id, ...editForm });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800 font-['Cormorant_Garamond',serif]">Edit User Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          
          {/* 📸 Profile Image Placeholder (For Future Use) */}
          <div className="flex justify-center mb-2">
            <div className="relative">
              {/* Circular Ring */}
              <div className="w-20 h-20 rounded-full bg-gray-100 border-4 border-white shadow-md flex items-center justify-center overflow-hidden ring-2 ring-[#e8f5ed]">
                {/* Once you have image URLs, you would replace this User icon with an <img src={...} /> tag */}
                <User className="w-8 h-8 text-gray-400" />
              </div>
              
              {/* Little Camera Edit Badge */}
              <button 
                className="absolute bottom-0 right-0 bg-[#3D8F38] text-white p-1.5 rounded-full border-2 border-white shadow-sm hover:bg-[#2d6645] transition-colors"
                title="Change Profile Picture (Coming Soon)"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
            <input 
              type="text" 
              value={editForm.name}
              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#3d8b5a] focus:ring-1 focus:ring-[#3d8b5a] text-sm text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
            <input 
              type="email" 
              value={editForm.email}
              onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#3d8b5a] focus:ring-1 focus:ring-[#3d8b5a] text-sm text-gray-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Role</label>
              <select 
                value={editForm.role}
                onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#3d8b5a] focus:ring-1 focus:ring-[#3d8b5a] text-sm text-gray-800 bg-white"
              >
                <option value="admin">Admin</option>
                <option value="hr">HR</option>
                <option value="sales">Sales</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Joined Date</label>
              <input 
                type="text" 
                value={fmt(user.createdAt)}
                readOnly
                className="w-full px-3 py-2 border border-gray-100 rounded-lg bg-gray-50 text-sm text-gray-500 cursor-not-allowed outline-none"
              />
            </div>
          </div>

          {/* Custom Permissions Checkboxes */}
          <div className="pt-3 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Permissions</label>
            <div className="grid grid-cols-2 gap-3">
              {['add', 'edit', 'delete', 'all'].map((perm) => (
                <label key={perm} className="flex items-center gap-2 cursor-pointer">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${editForm.permissions[perm] ? 'bg-[#3D8F38] border-[#3D8F38]' : 'border-gray-300 bg-white'}`}>
                    {editForm.permissions[perm] && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={editForm.permissions[perm]}
                    onChange={() => handlePermissionChange(perm)}
                  />
                  <span className="text-sm text-gray-700 capitalize font-medium">{perm}</span>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50/50">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveChanges}
            className="px-4 py-2 text-sm font-medium text-white bg-[#3D8F38] rounded-lg hover:bg-[#2d6645] transition-colors"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditUserModal;