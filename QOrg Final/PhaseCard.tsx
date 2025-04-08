import React from 'react';
import { Phase } from '@/index'; // Use index for types
import { Calendar, ListChecks, Pencil, Trash2 } from 'lucide-react';

interface PhaseCardProps {
  phase: Phase;
  onEdit?: (phase: Phase) => void;
  onDelete?: (phaseId: string) => void;
  canEdit: boolean; // To control edit/delete visibility
}

const PhaseCard: React.FC<PhaseCardProps> = ({ phase, onEdit, onDelete, canEdit }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-md font-semibold text-[#004B87]">{phase.order}. {phase.title}</h3>
          <p className="text-sm text-gray-500 flex items-center mt-1">
            <Calendar size={14} className="mr-1.5 text-gray-400" />
            {phase.timeframe || 'N/A'}
          </p>
        </div>
        {canEdit && (
          <div className="flex space-x-1">
            <button
              onClick={() => onEdit && onEdit(phase)}
              className="p-1.5 text-gray-500 hover:text-[#004B87] rounded-md hover:bg-gray-100 transition-colors"
              aria-label={`Edit phase ${phase.title}`}
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete && onDelete(phase.id)}
              className="p-1.5 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors"
              aria-label={`Delete phase ${phase.title}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
      {/* Placeholder for Activities */}
      <div className="mt-3 pt-3 border-t border-gray-100">
         <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
           <ListChecks size={15} className="mr-2 text-gray-400" />
           Activities (Placeholder)
         </h4>
         <p className="text-xs text-gray-400 italic">Activity display and management coming soon.</p>
      </div>
    </div>
  );
};

export default PhaseCard; 