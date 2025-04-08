import { Personnel } from '@/types';
import React from 'react';

interface PersonnelCardProps {
  personnel: Personnel;
  isDraggable?: boolean;
  isAssigned?: boolean;
  onAssign?: () => void;
  onUnassign?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  children?: React.ReactNode;
}

export default function PersonnelCard({
  personnel,
  isDraggable = false,
  isAssigned = false,
  onAssign,
  onUnassign,
  onEdit,
  onDelete,
  children
}: PersonnelCardProps) {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-sm p-3 mb-2 flex justify-between items-center
        ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}
        ${personnel.assignedRole ? 'border-l-4 border-[#81C341]' : 'border-l-4 border-[#F1F1F1]'}
      `}
    >
      <div>
        <h4 className="font-medium text-[#004B87]">{personnel.name}</h4>
        {personnel.position && (
          <p className="text-sm text-[#707070]">
            {personnel.position}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {personnel.assignedRole ? `Assigned` : 'Unassigned'}
          {personnel.assignedFactory && ` • Factory ${personnel.assignedFactory}`}
        </p>
      </div>
      <div className="flex flex-shrink-0 space-x-2 items-center ml-4">
        {!personnel.assignedRole && onAssign && (
          <button
            onClick={onAssign}
            className="text-xs bg-[#E6EEF4] hover:bg-[#81C341] hover:text-white px-2 py-1 rounded transition-colors"
            title="Assign"
          >
            Assign
          </button>
        )}
        {personnel.assignedRole && onUnassign && (
          <button
            onClick={onUnassign}
            className="text-xs bg-[#E6EEF4] hover:bg-[#F47920] hover:text-white px-2 py-1 rounded transition-colors"
            title="Unassign"
          >
            Unassign
          </button>
        )}
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-xs bg-[#E6EEF4] hover:bg-[#004B87] hover:text-white px-2 py-1 rounded transition-colors"
            title="Edit"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-xs bg-red-100 hover:bg-red-500 hover:text-white px-2 py-1 rounded transition-colors"
            title="Delete"
          >
            Delete
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
