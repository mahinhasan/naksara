"use client";

import React, { useState, useEffect } from 'react';
import { Shield, Plus, Edit2, Check, X } from 'lucide-react';

interface RolePermission {
  permission: {
    id: string;
    action: string;
    subject: string;
  };
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: RolePermission[];
}

interface Permission {
  id: string;
  action: string;
  subject: string;
}

interface NewRole {
  name: string;
  description: string;
  permissions: string[];
}

export default function RolesManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRole, setNewRole] = useState<NewRole>({ name: '', description: '', permissions: [] });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // In a real app, you'd add auth headers
      const [rolesRes, permissionsRes] = await Promise.all([
        fetch(`${apiUrl}/admin/roles`),
        fetch(`${apiUrl}/admin/permissions`)
      ]);
      
      const rolesData = await rolesRes.json();
      const permissionsData = await permissionsRes.json();
      
      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async () => {
    try {
      const response = await fetch(`${apiUrl}/admin/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRole)
      });
      
      if (response.ok) {
        setIsModalOpen(false);
        setNewRole({ name: '', description: '', permissions: [] });
        fetchData();
      }
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  const togglePermission = (permId: string) => {
    setNewRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter(id => id !== permId)
        : [...prev.permissions, permId]
    }));
  };

  if (loading) return <div className="p-8 text-center">Loading Roles...</div>;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif">Roles & Permissions</h2>
          <p className="text-stone-500">Define what your employees can see and do.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-6 py-3 text-sm font-bold tracking-widest uppercase flex items-center gap-2"
        >
          <Plus size={16} /> Create New Role
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {roles.map((role: any) => (
          <div key={role.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-stone-100 rounded-xl">
                <Shield size={24} className="text-black" />
              </div>
              <button className="text-stone-400 hover:text-black">
                <Edit2 size={18} />
              </button>
            </div>
            
            <div>
              <h3 className="text-lg font-bold">{role.name}</h3>
              <p className="text-sm text-stone-500">{role.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {role.permissions?.map((rp: any) => (
                <span key={rp.permission.id} className="px-2 py-1 bg-stone-50 text-[10px] font-bold border border-stone-100 uppercase tracking-widest">
                  {rp.permission.action}:{rp.permission.subject}
                </span>
              ))}
              {(!role.permissions || role.permissions.length === 0) && <span className="text-xs italic text-stone-400">No special permissions</span>}
            </div>

            <div className="mt-auto pt-6 border-t border-stone-100 flex justify-between items-center">
              <span className="text-xs text-stone-400">{role.permissions?.length || 0} Permissions</span>
              <button className="text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-black">Manage</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-serif">Create New Role</h3>
              <button onClick={() => setIsModalOpen(false)}><X /></button>
            </div>
            
            <div className="flex flex-col gap-4 mb-8">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">Role Name</label>
                <input 
                  type="text" 
                  className="w-full border border-stone-200 p-3 rounded-lg"
                  value={newRole.name}
                  onChange={e => setNewRole({...newRole, name: e.target.value})}
                  placeholder="e.g. INVENTORY_MANAGER"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">Description</label>
                <textarea 
                  className="w-full border border-stone-200 p-3 rounded-lg"
                  value={newRole.description}
                  onChange={e => setNewRole({...newRole, description: e.target.value})}
                  placeholder="What can this role do?"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">Select Permissions</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {permissions.map((p: any) => (
                    <button
                      key={p.id}
                      onClick={() => togglePermission(p.id)}
                      className={`text-left p-3 rounded-lg border text-xs font-medium transition-all ${
                        newRole.permissions.includes(p.id) 
                        ? 'bg-black text-white border-black' 
                        : 'bg-white text-stone-600 border-stone-200 hover:border-black'
                      }`}
                    >
                      {p.action}:{p.subject}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={handleCreateRole}
              className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-stone-800 transition-all"
            >
              Save Role
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
