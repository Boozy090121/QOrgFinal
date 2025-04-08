import React from 'react';
import { Factory } from '@/types'; // Assuming types alias works here or adjust path
import { Pencil, Trash2 } from 'lucide-react';

interface FactoryCardProps {
  factory: Factory;
  onEdit?: (factory: Factory) => void;
  onDelete?: (factoryId: string) => void;
}

const FactoryCard: React.FC<FactoryCardProps> = ({ factory, onEdit, onDelete }) => {
  const canEdit = !!onEdit; // Determine editability based on prop presence
  const canDelete = !!onDelete;

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold text-[#004B87] mb-1">{factory.name}</h3>
        <p className="text-sm text-gray-600">Location: {factory.location || 'N/A'}</p>
        <p className="text-sm text-gray-600">Capacity: {factory.capacity || 'N/A'}</p>
        <p className="text-sm text-gray-600">Manager: {factory.manager || 'N/A'}</p>
        {/* Add other fields as needed */}
      </div>
      {(canEdit || canDelete) && (
        <div className="flex space-x-2 mt-1">
          {canEdit && (
            <button
              onClick={() => onEdit && onEdit(factory)}
              className="p-1.5 text-gray-500 hover:text-[#004B87] rounded-md hover:bg-gray-100 transition-colors"
              aria-label={`Edit factory ${factory.name}`}
            >
              <Pencil size={18} />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete && onDelete(factory.id)}
              className="p-1.5 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors"
              aria-label={`Delete factory ${factory.name}`}
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FactoryCard; 