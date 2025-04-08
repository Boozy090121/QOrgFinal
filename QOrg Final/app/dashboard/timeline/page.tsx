'use client';

import React from 'react';
import { useTimeline } from '@/useFirestore'; // Assuming alias works or adjust
import PageContainer from '@/PageContainer';
import PhaseCard from '@/PhaseCard'; // <-- Import PhaseCard
import { useAuth } from '@/useAuth'; // <-- Import useAuth
import { Phase } from '@/index'; // <-- Import Phase type

export default function TimelinePage() {
  // Use useTimeline hook
  const { phases, activities, loading, error, addPhase, updatePhase, deletePhase } = useTimeline();
  const { user, loading: authLoading, isReadOnly } = useAuth();

  // Determine editability
  const canEdit = !!user && !isReadOnly;

  // TODO: Add state and handlers for Add/Edit modal for phases
  // const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false);
  // const [editingPhase, setEditingPhase] = useState<Phase | null>(null);
  // ... form state ...

  const handleEditPhase = (phase: Phase) => {
     if (!canEdit) return;
     console.log("Edit phase clicked (modal not implemented yet):", phase);
     // TODO: Implement modal opening
     // setEditingPhase(phase);
     // ... set form state ...
     // setIsPhaseModalOpen(true);
  };

  const handleDeletePhase = async (phaseId: string) => {
     if (!canEdit) return;
     if (window.confirm('Are you sure you want to delete this phase and its activities?')) {
       try {
         // await deletePhase(phaseId);
         console.log("Delete phase clicked (hook not implemented yet):", phaseId);
       } catch (deleteError) {
         console.error("Error deleting phase:", deleteError);
       }
     }
  };


  return (
    <PageContainer title="Project Timeline">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#004B87]">Project Timeline</h1>
        {/* Add Phase Button */} 
        {canEdit && (
          <button 
            // onClick={openAddPhaseModal} // TODO: Implement
            className="px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003763] transition-colors text-sm font-medium"
          >
            Add Phase
          </button>
        )}
        {!canEdit && !authLoading && (
          <p className="text-sm p-2 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-md">
            {user ? (isReadOnly ? 'Read-only mode enabled.' : 'Edit requires login.') : 'Please log in to view/edit.'}
          </p>
        )}
      </div>

      {(loading || authLoading) && <p>Loading timeline data...</p>}
      {error && <p className="text-red-500">Error loading timeline: {error}</p>}

      {!loading && !error && (
        <div className="space-y-4">
          {phases.length === 0 ? (
             <p>No phases defined yet.</p>
           ) : (
             // Sort phases by order property before mapping
             [...phases].sort((a, b) => a.order - b.order).map(phase => (
               <PhaseCard 
                 key={phase.id} 
                 phase={phase} 
                 canEdit={canEdit} 
                 onEdit={handleEditPhase} 
                 onDelete={handleDeletePhase} 
               />
             ))
           )
          }
        </div>
      )}

      {/* TODO: Add/Edit Phase Modal */} 

    </PageContainer>
  );
} 