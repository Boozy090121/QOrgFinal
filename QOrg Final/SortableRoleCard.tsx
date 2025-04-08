import React from 'react';
import { Role, Personnel } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import SortablePersonnelCard from './SortablePersonnelCard';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Pencil } from 'lucide-react';

interface SortableRoleCardProps {
  id: string;
  role: Role;
  personnel: Personnel[];
  canEdit: boolean;
  onEditRole: (role: Role) => void;
}

export default function SortableRoleCard({
  id,
  role,
  personnel,
  canEdit,
  onEditRole,
}: SortableRoleCardProps) {
  const personnelIds = personnel.map(p => JSON.stringify({ type: 'personnel', id: p.id }));
  
  const getRoleLevelColor = () => {
    switch (role.level) {
      case 'leadership':
        return 'border-[#004B87] bg-[#E6EEF4]';
      case 'specialist':
        return 'border-[#81C341] bg-[#81C341] bg-opacity-10';
      case 'associate':
        return 'border-[#F47920] bg-[#F47920] bg-opacity-10';
      default:
        return 'border-gray-200';
    }
  };
  
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    data: { type: 'role', accepts: ['personnel'] },
    disabled: !canEdit
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative p-4 rounded-lg border-t-4 ${getRoleLevelColor()} bg-white shadow-sm hover:shadow-md transition-shadow min-h-[150px] flex flex-col ${isOver && canEdit ? 'ring-2 ring-[#004B87]' : ''} ${!canEdit ? 'bg-gray-50 opacity-75' : ''}`}
    >
      {canEdit && (
        <button 
          onClick={() => onEditRole(role)} 
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-[#004B87] rounded-full hover:bg-gray-100 transition-colors"
          aria-label={`Edit role ${role.title}`}
        >
          <Pencil size={16} />
        </button>
      )}

      <div className="mb-2 pr-8">
        <h4 className="text-base font-semibold text-[#004B87]">{role.title}</h4>
        <p className="text-sm text-gray-500 capitalize">{role.level} {role.factorySpecific ? `(${role.department || 'Factory Specific'})` : ''}</p>
      </div>
      
      <div className="flex-grow mt-2 pt-2 border-t border-gray-200 space-y-1 overflow-y-auto">
        {personnel.length > 0 ? (
          <SortableContext items={personnelIds} strategy={verticalListSortingStrategy} disabled={!canEdit}>
            {personnel.map(person => (
              <SortablePersonnelCard 
                key={person.id} 
                personnel={person} 
                canEdit={canEdit} 
              />
            ))}
          </SortableContext>
        ) : (
          <div className="text-center text-xs text-gray-400 py-4">
            {canEdit ? 'Drop personnel here' : 'Empty'}
          </div>
        )}
      </div>
    </div>
  );
}
