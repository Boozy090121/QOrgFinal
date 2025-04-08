'use client';

import React, { useState } from 'react';
import PageContainer from '@/PageContainer'; // Adjust path
import OrganizationDnd from '@/OrganizationDnd'; // Adjust path
import Modal from '@/Modal'; // <-- Import Modal
import Button from '@/Button'; // <-- Import Button
import { useAuth } from '@/useAuth'; // To check login status
import { usePersonnel, useRoles } from '@/useFirestore'; // Adjust path for hooks
import { Role } from '@/types'; // <-- Import Role type

export default function OrganizationPage() {
  // Get isAdmin state
  const { user, loading: authLoading, isReadOnly, isAdmin } = useAuth();
  const { personnel, loading: personnelLoading, error: personnelError, updatePersonnel } = usePersonnel();
  const { roles, loading: rolesLoading, error: rolesError, updateRole } = useRoles(); // <-- Get updateRole from hook

  // Role Modal State
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  // Role Form State (add more fields as needed from Role type)
  const [roleTitle, setRoleTitle] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [roleLevel, setRoleLevel] = useState<'leadership' | 'specialist' | 'associate' | '' >('');

  const isLoading = authLoading || personnelLoading || rolesLoading;
  const isError = personnelError || rolesError;
  // Determine if editing is allowed (is user logged in AND not read-only)
  const canEdit = !!user && !isReadOnly;

  // Function to open the role edit modal
  const openEditRoleModal = (role: Role) => {
    if (!canEdit) return;
    setEditingRole(role);
    setRoleTitle(role.title || '');
    setRoleDescription(role.description || '');
    setRoleLevel(role.level || '');
    // Set other form fields based on role
    setIsRoleModalOpen(true);
  };

  const closeRoleModal = () => {
    setIsRoleModalOpen(false);
    setEditingRole(null);
    // Clear form fields
    setRoleTitle('');
    setRoleDescription('');
    setRoleLevel('');
  };

  // Function to save role changes
  const handleSaveRole = async () => {
    if (!canEdit || !editingRole || !roleTitle.trim()) return;

    const updatedData: Partial<Role> = {
      title: roleTitle.trim(),
      description: roleDescription.trim(),
      level: roleLevel,
      // Add other fields to update
      updatedAt: Date.now() // Or serverTimestamp if preferred
    };

    try {
      await updateRole(editingRole.id, updatedData);
      closeRoleModal();
    } catch (saveError) {
      console.error("Error saving role:", saveError);
      // Maybe show an error message to the user
    }
  };

  // Callback for assigning personnel to a role
  const handleAssignPersonnel = async (personnelId: string, roleId: string) => {
    if (!canEdit) {
      console.log("Assignment blocked (Admin required or Read-only).");
      return;
    }
    try {
      await updatePersonnel(personnelId, { assignedRole: roleId, updatedAt: Date.now() });
    } catch (error) {
      console.error("Error assigning personnel:", error);
    }
  };

  // Callback for unassigning personnel
  const handleUnassignPersonnel = async (personnelId: string) => {
    if (!canEdit) {
      console.log("Unassignment blocked (Read-only or not logged in).");
      return;
    }
    try {
      await updatePersonnel(personnelId, { assignedRole: null, updatedAt: Date.now() });
    } catch (error) {
      console.error("[Page] Error unassigning personnel:", error);
    }
  };

  return (
    <PageContainer title="Organization Structure">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#004B87]">Organization Structure</h1>
         {/* Show read-only indicator */} 
         {!canEdit && !isLoading && (
           <p className="text-sm p-2 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-md">
             {user ? (isReadOnly ? 'Read-only mode enabled.' : 'Admin access required to edit.') : 'Please log in to view/edit.'}
           </p>
         )}
      </div>

      {isLoading && <p>Loading organization data...</p>}
      {isError && <p className="text-red-500">Error loading data: {personnelError || rolesError}</p>}

      {!isLoading && !isError && (
        <OrganizationDnd
          roles={roles}
          personnel={personnel}
          onAssignPersonnel={handleAssignPersonnel}
          onUnassignPersonnel={handleUnassignPersonnel}
          canEdit={canEdit}
          onEditRole={openEditRoleModal} // <-- Pass callback down
        />
      )}

      {/* Role Edit Modal */} 
      {canEdit && editingRole && (
        <Modal isOpen={isRoleModalOpen} onClose={closeRoleModal}>
          <h2 className="text-xl font-semibold mb-4">Edit Role</h2>
          <div className="space-y-4">
            {/* Role Title */}
            <div>
              <label htmlFor="roleTitle" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                id="roleTitle"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004B87] focus:border-[#004B87]"
              />
            </div>
            {/* Role Description */}
            <div>
              <label htmlFor="roleDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="roleDescription"
                rows={3}
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004B87] focus:border-[#004B87]"
              />
            </div>
             {/* Role Level */}
            <div>
              <label htmlFor="roleLevel" className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
              <select
                id="roleLevel"
                value={roleLevel}
                onChange={(e) => setRoleLevel(e.target.value as 'leadership' | 'specialist' | 'associate' | '')}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004B87] focus:border-[#004B87] bg-white"
              >
                <option value="" disabled>Select level</option>
                <option value="leadership">Leadership</option>
                <option value="specialist">Specialist</option>
                <option value="associate">Associate</option>
              </select>
            </div>
            {/* Add other fields here if needed (e.g., department, permissions) */}
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button onClick={closeRoleModal} variant="secondary">Cancel</Button>
            <Button onClick={handleSaveRole} variant="primary">Save Role</Button>
          </div>
        </Modal>
      )}

    </PageContainer>
  );
} 