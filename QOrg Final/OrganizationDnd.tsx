import React from 'react';
import { Role, Personnel } from '@/types';
import { 
  DndContext, 
  closestCenter,
  DragEndEvent,
  useDraggable,
  useDroppable
} from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import SortableRoleCard from './SortableRoleCard';
import SortablePersonnelCard from './SortablePersonnelCard';

interface OrganizationDndProps {
  roles: Role[];
  personnel: Personnel[];
  onAssignPersonnel: (personnelId: string, roleId: string) => void;
  onUnassignPersonnel: (personnelId: string) => void;
  canEdit: boolean;
  onEditRole: (role: Role) => void;
}

export default function OrganizationDnd({
  roles,
  personnel,
  onAssignPersonnel,
  onUnassignPersonnel,
  canEdit,
  onEditRole,
}: OrganizationDndProps) {
  const handleDragEnd = (event: DragEndEvent) => {
    if (!canEdit) return;

    const { active, over } = event;
    if (!over || !active?.id || !over?.id) return;

    try {
      const activeData = JSON.parse(active.id.toString());
      const overData = JSON.parse(over.id.toString());

      if (!activeData?.type || !activeData?.id || !overData?.type || !overData?.id) {
          console.warn('Invalid drag data structure:', { activeData, overData });
          return;
      }

      if (activeData.type === 'personnel' && overData.type === 'role') {
        const person = personnel.find(p => p.id === activeData.id);
        if (person && person.assignedRole !== overData.id) {
           onAssignPersonnel(activeData.id, overData.id);
        } else if (!person?.assignedRole) {
           onAssignPersonnel(activeData.id, overData.id);
        }
        return;
      }

      if (activeData.type === 'personnel' && overData.type === 'unassigned') {
        const person = personnel.find(p => p.id === activeData.id);
        if (person && person.assignedRole) {
            onUnassignPersonnel(activeData.id);
        }
        return;
      }
    } catch (e) {
      console.error("Error parsing drag data:", e, { activeId: active.id, overId: over.id });
    }
  };
  
  const rolesByLevel = {
    leadership: roles.filter(role => role.level === 'leadership'),
    specialist: roles.filter(role => role.level === 'specialist'),
    associate: roles.filter(role => role.level === 'associate')
  };
  
  const unassignedPersonnel = personnel.filter(person => !person.assignedRole);
  
  const roleDropZoneIds = roles.map(role => JSON.stringify({ type: 'role', id: role.id }));
  const unassignedDropZoneId = JSON.stringify({ type: 'unassigned', id: 'unassigned' });
  const personnelDragIds = unassignedPersonnel.map(person => JSON.stringify({ type: 'personnel', id: person.id }));

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      disabled={!canEdit}
    >
      <div className={`grid grid-cols-1 lg:grid-cols-4 gap-8 ${!canEdit ? 'opacity-70 pointer-events-none' : ''}`}>
        <div className="lg:col-span-3 space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-[#004B87] mb-4">Leadership Roles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rolesByLevel.leadership.map(role => (
                <SortableRoleCard
                  key={role.id}
                  role={role}
                  personnel={personnel.filter(person => person.assignedRole === role.id)}
                  id={JSON.stringify({ type: 'role', id: role.id })}
                  canEdit={canEdit}
                  onEditRole={onEditRole}
                />
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-[#81C341] mb-4">Specialist Roles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rolesByLevel.specialist.map(role => (
                <SortableRoleCard
                  key={role.id}
                  role={role}
                  personnel={personnel.filter(person => person.assignedRole === role.id)}
                  id={JSON.stringify({ type: 'role', id: role.id })}
                  canEdit={canEdit}
                  onEditRole={onEditRole}
                />
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-[#F47920] mb-4">Associate Roles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rolesByLevel.associate.map(role => (
                <SortableRoleCard
                  key={role.id}
                  role={role}
                  personnel={personnel.filter(person => person.assignedRole === role.id)}
                  id={JSON.stringify({ type: 'role', id: role.id })}
                  canEdit={canEdit}
                  onEditRole={onEditRole}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 sticky top-4">Unassigned Personnel</h3>
           <div className="sticky top-16">
              <DroppableUnassignedArea id={unassignedDropZoneId} canEdit={canEdit}>
                {unassignedPersonnel.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No unassigned personnel</p>
                ) : (
                  <div className="space-y-3">
                    <SortableContext
                      items={personnelDragIds}
                      strategy={verticalListSortingStrategy}
                      disabled={!canEdit}
                    >
                      {unassignedPersonnel.map(person => (
                        <SortablePersonnelCard
                          key={person.id}
                          personnel={person}
                          canEdit={canEdit}
                        />
                      ))}
                    </SortableContext>
                  </div>
                )}
              </DroppableUnassignedArea>
           </div> 
        </div>
      </div>
    </DndContext>
  );
}

function DroppableUnassignedArea({ id, children, canEdit }: { id: string, children: React.ReactNode, canEdit: boolean }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    disabled: !canEdit
  });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 bg-gray-50 border border-dashed rounded-lg transition-colors ${
        isOver && canEdit ? 'border-[#004B87] bg-[#E6EEF4]' : 'border-gray-300'
      } ${
        !canEdit ? 'border-gray-200 bg-gray-100' : ''
      }`}
    >
      {children}
    </div>
  );
}
