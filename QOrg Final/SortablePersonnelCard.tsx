import React from 'react';
import { Personnel } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortablePersonnelCardProps {
  personnel: Personnel;
  canEdit: boolean;
}

export default function SortablePersonnelCard({
  personnel,
  canEdit,
}: SortablePersonnelCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: JSON.stringify({ type: 'personnel', id: personnel.id }),
    disabled: !canEdit
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: canEdit ? 'grab' : 'not-allowed',
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 bg-white rounded-md border transition-all ${!canEdit ? 'border-gray-100 text-gray-400' : 'border-gray-200 hover:border-gray-300'} ${isDragging ? 'shadow-lg' : 'shadow-sm'}`}
      title={!canEdit ? 'Read-only mode' : personnel.name}
    >
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${!canEdit ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700'}`}>
          {personnel.name.charAt(0)}
        </div>
        <div className="ml-3">
          <div className={`text-sm font-medium ${!canEdit ? 'text-gray-500' : 'text-gray-900'}`}>{personnel.name}</div>
          <div className="text-xs text-gray-500">Unassigned</div>
        </div>
      </div>
    </div>
  );
}
