'use client';

import React, { useState } from 'react';
import { useFactories } from '@/useFirestore'; // Assuming alias works or adjust
import FactoryCard from '@/FactoryCard'; // Assuming alias works or adjust
import Button from '@/Button';
import Modal from '@/Modal';
import PageContainer from '@/PageContainer';
import { Factory } from '@/types'; // Assuming alias works or adjust
import { useAuth } from '@/useAuth';

export default function FactoriesPage() {
  const { factories, loading, error, addFactory, updateFactory, deleteFactory } = useFactories();
  const { user, loading: authLoading, isReadOnly } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFactory, setEditingFactory] = useState<Factory | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState<number | string>('');
  const [manager, setManager] = useState('');

  const canEdit = !!user && !isReadOnly;

  const clearForm = () => {
    setName('');
    setLocation('');
    setCapacity('');
    setManager('');
    setEditingFactory(null);
  };

  const openAddModal = () => {
    if (!canEdit) return;
    clearForm();
    setIsModalOpen(true);
  };

  const openEditModal = (factory: Factory) => {
    if (!canEdit) return;
    setEditingFactory(factory);
    setName(factory.name || '');
    setLocation(factory.location || '');
    setCapacity(factory.capacity || '');
    setManager(factory.manager || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    clearForm();
  };

  const handleSave = async () => {
    if (!canEdit || !name.trim()) return;

    const factoryData: Partial<Omit<Factory, 'id' | 'createdAt' | 'updatedAt'>> & { updatedAt?: number } = {
      name: name.trim(),
      location: location.trim(),
      capacity: typeof capacity === 'string' ? parseInt(capacity, 10) || 0 : capacity || 0, // Ensure number
      manager: manager.trim(),
      updatedAt: Date.now()
    };

    try {
      if (editingFactory) {
        await updateFactory(editingFactory.id, factoryData);
      } else {
        await addFactory({ ...factoryData, createdAt: Date.now() } as Omit<Factory, 'id'>);
      }
      closeModal();
    } catch (saveError) {
      console.error("Error saving factory:", saveError);
    }
  };

  const handleDelete = async (id: string) => {
    if (!canEdit) return;
    if (window.confirm('Are you sure you want to delete this factory?')) {
      try {
        await deleteFactory(id);
      } catch (deleteError) {
        console.error("Error deleting factory:", deleteError);
      }
    }
  };

  return (
    <PageContainer title="Factories">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#004B87]">Manage Factories</h1>
        {canEdit && (
          <Button onClick={openAddModal} variant="primary">Add New Factory</Button>
        )}
         {!canEdit && !authLoading && (
          <p className="text-sm p-2 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-md">
            {user ? (isReadOnly ? 'Read-only mode enabled.' : 'Edit requires login.') : 'Please log in to view/edit.'}
          </p>
        )}
      </div>

      {(loading || authLoading) && <p>Loading factories...</p>}
      {error && <p className="text-red-500">Error loading factories: {error}</p>}

      {!loading && !authLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {factories.length === 0 ? (
            <p>No factories found.</p>
          ) : (
            factories.map((factory) => (
              <FactoryCard
                key={factory.id}
                factory={factory}
                onEdit={canEdit ? openEditModal : undefined}
                onDelete={canEdit ? handleDelete : undefined}
              />
            ))
          )}
        </div>
      )}

      {/* Add/Edit Modal */} 
      {canEdit && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-xl font-semibold mb-4">{editingFactory ? 'Edit Factory' : 'Add New Factory'}</h2>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="factoryName" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                id="factoryName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004B87] focus:border-[#004B87]"
              />
            </div>
             {/* Location */}
            <div>
              <label htmlFor="factoryLocation" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                id="factoryLocation"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004B87] focus:border-[#004B87]"
              />
            </div>
             {/* Capacity */}
            <div>
              <label htmlFor="factoryCapacity" className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input
                type="number"
                id="factoryCapacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004B87] focus:border-[#004B87]"
              />
            </div>
             {/* Manager */}
            <div>
              <label htmlFor="factoryManager" className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
              <input
                type="text"
                id="factoryManager"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004B87] focus:border-[#004B87]"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button onClick={closeModal} variant="secondary">Cancel</Button>
            <Button onClick={handleSave} variant="primary">Save Factory</Button>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
} 