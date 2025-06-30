'use client';

import { Task, Priority, Status } from '@/types/task';
import { Edit, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Status) => void;
  onSubtaskStatusChange?: (subtaskId: string, status: Status) => void;
  isLoading?: boolean;
}

export default function TaskCard({ 
  task, 
  onEdit, 
  onDelete, 
  onStatusChange,
  onSubtaskStatusChange,
  isLoading = false 
}: TaskCardProps) {
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.ALTA:
        return 'bg-danger-100 text-danger-800 border-danger-200';
      case Priority.MEDIA:
        return 'bg-warning-100 text-warning-800 border-warning-200';
      case Priority.BAJA:
        return 'bg-success-100 text-success-800 border-success-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.COMPLETADA:
        return 'bg-success-100 text-success-800 border-success-200';
      case Status.EN_PROGRESO:
        return 'bg-primary-100 text-primary-800 border-primary-200';
      case Status.PENDIENTE:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case Status.COMPLETADA:
        return <CheckCircle size={16} />;
      case Status.EN_PROGRESO:
        return <Clock size={16} />;
      case Status.PENDIENTE:
        return <AlertCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {task.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {task.description}
          </p>
        </div>
        
        {/* Priority Badge */}
        <span className={`badge border ${getPriorityColor(task.priority)} ml-2`}>
          {task.priority}
        </span>
      </div>

      {/* Status */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Estado
        </label>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as Status)}
          className={`select border ${getStatusColor(task.status)}`}
          disabled={isLoading}
        >
          <option value={Status.PENDIENTE}>Pendiente</option>
          <option value={Status.EN_PROGRESO}>En Progreso</option>
          <option value={Status.COMPLETADA}>Completada</option>
        </select>
      </div>

      {/* Related Subtasks */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <span>Subtareas Relacionadas</span>
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {task.subtasks.length} asignada{task.subtasks.length > 1 ? 's' : ''}
            </span>
          </h4>
          <div className="space-y-3">
            {task.subtasks.map((subtask) => (
              <div key={subtask.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-gray-900">{subtask.title}</h5>
                  {onSubtaskStatusChange && (
                    <select
                      value={subtask.status}
                      onChange={(e) => onSubtaskStatusChange(subtask.id, e.target.value as Status)}
                      className={`select border text-xs ${getStatusColor(subtask.status)}`}
                      disabled={isLoading}
                    >
                      <option value={Status.PENDIENTE}>Pendiente</option>
                      <option value={Status.EN_PROGRESO}>En Progreso</option>
                      <option value={Status.COMPLETADA}>Completada</option>
                    </select>
                  )}
                </div>
                {subtask.description && (
                  <p className="text-sm text-gray-600 mb-2">{subtask.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(subtask.status)}
                    <span className="text-xs text-gray-500 ml-1 capitalize">
                      {subtask.status}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    ID: {subtask.id.slice(0, 8)}...
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Creada: {formatDate(task.createdAt)}
        </div>
        
        <div className="flex space-x-2">
          {/* Edit Button */}
          <button
            onClick={() => onEdit(task)}
            disabled={isLoading}
            className="btn-secondary text-xs px-3 py-1 flex items-center space-x-1"
            title="Editar tarea"
          >
            <Edit size={14} />
            <span>Editar</span>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(task.id)}
            disabled={isLoading}
            className="btn-danger text-xs px-3 py-1 flex items-center space-x-1"
            title="Eliminar tarea"
          >
            <Trash2 size={14} />
            <span>Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  );
} 