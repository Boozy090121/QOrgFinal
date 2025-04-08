'use client';

import React, { useState } from 'react';
import { usePersonnel, useRoles } from '@/useFirestore'; // Adjust path if needed
import PersonnelCard from '@/PersonnelCard'; // Adjust path if needed
import Button from '@/Button'; // Adjust path if needed
import Modal from '@/Modal'; // Adjust path if needed
import PageContainer from '@/PageContainer'; // Adjust path if needed
import { Personnel } from '@/index'; // Adjust path for types if needed
import { useAuth } from '@/useAuth'; // Import useAuth

export default function PersonnelPage() {
  const { personnel, loading, error, addPersonnel, updatePersonnelById, deletePersonnelById } = usePersonnel();
  // Get isAdmin state
  const { user, loading: authLoading, isReadOnly, isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState<Personnel | null>(null);

  // State for form fields
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');
  const [certifications, setCertifications] = useState('');

  // Determine if editing is allowed (is user logged in AND not read-only)
  const canEdit = !!user && !isReadOnly;

  const clearForm = () => {
    setName('');
    setPosition('');
    setDepartment('');
    setSkills('');
    setExperience('');
    setEducation('');
    setCertifications('');
    setEditingPersonnel(null);
  }

  const openAddModal = () => {
    if (!canEdit) return;
    clearForm();
    setIsModalOpen(true);
  };

  const openEditModal = (person: Personnel) => {
    if (!canEdit) return;
    setEditingPersonnel(person);
    setName(person.name || '');
    setPosition(person.position || '');
    setDepartment(person.department || '');
    setSkills(person.skills || '');
    setExperience(person.experience || '');
    setEducation(person.education || '');
    setCertifications(person.certifications || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    clearForm(); // Clear form on close
  };

  const handleSave = async () => {
    if (!canEdit || !name.trim()) return; // Ensure name is present

    // Consolidate data, trimming whitespace
    const personnelData: Partial<Personnel> = {
      name: name.trim(),
      position: position.trim(),
      department: department.trim(),
      skills: skills.trim(),
      experience: experience.trim(),
      education: education.trim(),
      certifications: certifications.trim(),
      updatedAt: Date.now() // Always update timestamp
    };

    try {
      if (editingPersonnel) {
        await updatePersonnelById(editingPersonnel.id, personnelData);
      } else {
        // Add createdAt only for new personnel
        await addPersonnel({ ...personnelData, createdAt: Date.now() } as Omit<Personnel, 'id'>);
      }
      closeModal();
    } catch (saveError) {
      console.error("Error saving personnel:", saveError);
    }
  };

  const handleDelete = async (id: string) => {
    if (!canEdit) return;
    if (window.confirm('Are you sure you want to delete this person?')) {
      try {
        await deletePersonnelById(id);
      } catch (deleteError) {
        console.error("Error deleting personnel:", deleteError);
      }
    }
  };

  return (
    <PageContainer title="Personnel">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#004B87]">Manage Personnel</h1>
        {canEdit && (
          <Button onClick={openAddModal} variant="primary">Add New Personnel</Button>
        )}
        {!canEdit && !authLoading && (
          <p className="text-sm p-2 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-md">
            {user ? (isReadOnly ? 'Read-only mode enabled.' : 'Admin access required to edit.') : 'Please log in to view/edit.'}
          </p>
        )}
      </div>

      {(loading || authLoading) && <p>Loading personnel...</p>} {/* Show loading if personnel or auth is loading */}
      {error && <p className="text-red-500">Error loading personnel: {error}</p>}

      {!loading && !authLoading && !error && (
        <div className="space-y-4">
          {personnel.length === 0 ? (
            <p>No personnel found.</p>
          ) : (
            personnel.map((person) => (
              <PersonnelCard
                key={person.id}
                personnel={person}
                // Conditionally pass edit/delete handlers if logged in
                onEdit={canEdit ? () => openEditModal(person) : undefined}
                onDelete={canEdit ? () => handleDelete(person.id) : undefined}
              />
            ))
          )}
        </div>
      )}

      {/* Add/Edit Modal - Render based on state, actions inside are already protected */}
      {canEdit && (
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <h2 className="text-xl font-semibold mb-4">{editingPersonnel ? 'Edit Personnel' : 'Add New Personnel'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Name Field */}
              <div>
                 <label htmlFor="personnelName" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                 <input
                   type="text"
                   id="personnelName"
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   required
                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004B87] focus:border-[#004B87]"
                 />
              </div>
              {/* Position Field */}
              <div>
                 <label htmlFor="personnelPosition" className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                 <input
                   type="text"
                   id="personnelPosition"
                   value={position}
                   onChange={(e) => setPosition(e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004B87] focus:border-[#004B87]"
                 />
              </div>
              {/* Department Field */}
              <div>
                 <label htmlFor="personnelDepartment" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                 <input
                   type="text"
                   id="personnelDepartment"
                   value={department}
                   onChange={(e) => setDepartment(e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004B87] focus:border-[#004B87]"
                 />
              </div>
              {/* Skills Field */}
              <div>
                 <label htmlFor="personnelSkills" className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                 <input
                   type="text"
                   id="personnelSkills"
                   value={skills}
                   onChange={(e) => setSkills(e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004B87] focus:border-[#004B87]"
                 />
              </div>
              {/* Experience Field */}
              <div>
                 <label htmlFor="personnelExperience" className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                 <input
                   type="text"
                   id="personnelExperience"
                   value={experience}
                   onChange={(e) => setExperience(e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004B87] focus:border-[#004B87]"
                 />
              </div>
              {/* Education Field */}
              <div>
                 <label htmlFor="personnelEducation" className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                 <input
                   type="text"
                   id="personnelEducation"
                   value={education}
                   onChange={(e) => setEducation(e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004B87] focus:border-[#004B87]"
                 />
              </div>
              {/* Certifications Field */} 
               <div className="md:col-span-2">
                 <label htmlFor="personnelCertifications" className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
                 <input
                   type="text"
                   id="personnelCertifications"
                   value={certifications}
                   onChange={(e) => setCertifications(e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004B87] focus:border-[#004B87]"
                 />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button onClick={closeModal} variant="secondary">Cancel</Button>
              <Button onClick={handleSave} variant="primary">Save</Button>
            </div>
          </Modal>
      )}
    </PageContainer>
  );
} 