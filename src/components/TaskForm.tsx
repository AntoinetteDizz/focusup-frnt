'use client';

import { useState, useEffect, useRef } from 'react';
import { Task, CreateTaskDto, UpdateTaskDto, Priority, Status, Subtask } from '@/types/task';
import { apiService } from '@/lib/api';
import { Sparkles, X, Trash2 } from 'lucide-react';

type SubtaskSuggestion = { title: string; description: string };

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: CreateTaskDto | UpdateTaskDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function TaskForm({ task, onSubmit, onCancel, isLoading = false }: TaskFormProps) {
  const [formData, setFormData] = useState<CreateTaskDto>({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || Priority.MEDIA,
    status: task?.status || Status.PENDIENTE,
    subtaskIds: Array.isArray(task?.subtasks) ? task.subtasks.map(s => s.id) : [],
  });

  const [availableSubtasks, setAvailableSubtasks] = useState<Subtask[]>([]);
  const [loadingSubtasks, setLoadingSubtasks] = useState(false);
  const [generatingSubtask, setGeneratingSubtask] = useState(false);
  const [showSubtaskModal, setShowSubtaskModal] = useState(false);
  const [generatedSubtasks, setGeneratedSubtasks] = useState<SubtaskSuggestion[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<SubtaskSuggestion[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newSubtaskDescription, setNewSubtaskDescription] = useState('');
  const [addingSubtask, setAddingSubtask] = useState(false);

  useEffect(() => {
    loadSubtasks();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadSubtasks = async () => {
    try {
      setLoadingSubtasks(true);
      const [subtasks, tasks] = await Promise.all([
        apiService.getSubtasks(),
        apiService.getTasks()
      ]);
      
      // Filtrar subtareas que no están asignadas a otras tareas
      const assignedSubtaskIds = new Set(
        tasks
          .filter(t => Array.isArray(t.subtasks) && t.subtasks.length > 0 && t.id !== task?.id)
          .flatMap(t => t.subtasks.map(st => st.id))
      );
      
      const availableSubtasks = subtasks.filter(subtask => !assignedSubtaskIds.has(subtask.id));
      setAvailableSubtasks(availableSubtasks);
    } catch (error) {
      console.error('Error loading subtasks:', error);
    } finally {
      setLoadingSubtasks(false);
    }
  };

  const generateSubtaskWithAI = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Por favor, completa el título y descripción de la tarea antes de generar subtareas con IA.');
      return;
    }

    try {
      setGeneratingSubtask(true);
      
      // Generar múltiples subtareas usando IA
      const suggestions = await apiService.getSubtaskSuggestionsWithAI({
        title: formData.title,
        description: formData.description,
        priority: formData.priority || Priority.MEDIA
      });
      
      setGeneratedSubtasks(suggestions);
      setShowSubtaskModal(true);
      
    } catch (error) {
      console.error('Error generating subtasks with AI:', error);
      alert('Error al generar las subtareas con IA. Inténtalo de nuevo.');
    } finally {
      setGeneratingSubtask(false);
    }
  };

  const selectSubtask = (subtask: Subtask) => {
    setFormData(prev => ({
      ...prev,
      subtaskIds: [...(prev.subtaskIds || []), subtask.id],
    }));
    
    // Agregar la subtarea seleccionada a la lista de disponibles
    setAvailableSubtasks(prev => [subtask, ...prev]);
    
    setShowSubtaskModal(false);
    setGeneratedSubtasks([]);
  };

  const handleSubtasksChange = (ids: string[]) => {
    setFormData(prev => ({
      ...prev,
      subtaskIds: ids || [],
    }));
  };

  const handleGeneratedCheck = (suggestion: SubtaskSuggestion) => {
    setSelectedSuggestions(prev => {
      const exists = prev.some(s => s.title === suggestion.title && s.description === suggestion.description);
      return exists ? prev.filter(s => !(s.title === suggestion.title && s.description === suggestion.description)) : [...prev, suggestion];
    });
  };

  const assignGeneratedSubtasks = () => {
    // Agregar sugerencias seleccionadas a availableSubtasks si no existen
    setAvailableSubtasks(prev => {
      const newSubs = selectedSuggestions.filter(sug => !prev.some(sub => sub.title === sug.title && sub.description === sug.description));
      const withTempIds = newSubs.map((sug, idx) => ({
        ...sug,
        id: `ia-${Date.now()}-${idx}`,
        status: Status.PENDIENTE,
        createdAt: '',
        updatedAt: ''
      }));
      return [...prev, ...withTempIds];
    });
    setShowSubtaskModal(false);
    setGeneratedSubtasks([]);
    setSelectedSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let subtaskIds = formData.subtaskIds ? [...formData.subtaskIds] : [];
    // Crear las subtareas seleccionadas de IA si no existen
    if (selectedSuggestions.length > 0) {
      for (const suggestion of selectedSuggestions) {
        const created = await apiService.createSubtask({
          title: suggestion.title,
          description: suggestion.description,
          status: Status.PENDIENTE
        });
        subtaskIds.push(created.id);
      }
    }
    setSelectedSuggestions([]);
    onSubmit({ ...formData, subtaskIds });
  };

  const handleInputChange = (field: keyof CreateTaskDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    setAvailableSubtasks(prev => prev.filter(s => s.id !== subtaskId));
    setFormData(prev => ({
      ...prev,
      subtaskIds: (prev.subtaskIds ?? []).filter(id => id !== subtaskId)
    }));
    try {
      await apiService.deleteSubtask(subtaskId);
    } catch (error: any) {
      // No mostrar ningún mensaje de error
    }
  };

  const toggleSubtask = (id: string) => {
    setFormData(prev => {
      const ids = prev.subtaskIds ?? [];
      return {
        ...prev,
        subtaskIds: ids.includes(id) ? ids.filter(sid => sid !== id) : [...ids, id],
      };
    });
  };

  const handleAddManualSubtask = async () => {
    if (!newSubtaskTitle.trim()) return;
    setAddingSubtask(true);
    try {
      const created = await apiService.createSubtask({
        title: newSubtaskTitle.trim(),
        description: newSubtaskDescription.trim(),
        status: Status.PENDIENTE
      });
      setAvailableSubtasks(prev => [...prev, created]);
      setNewSubtaskTitle('');
      setNewSubtaskDescription('');
    } finally {
      setAddingSubtask(false);
    }
  };

  return (
    <>
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">
        {task ? 'Editar Tarea' : 'Nueva Tarea'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Título *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="input"
            placeholder="¿Qué necesitas hacer?"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Descripción *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="input min-h-[100px] resize-none"
            placeholder="Describe los detalles de la tarea..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Prioridad
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className="select"
            >
              <option value={Priority.BAJA}>Baja</option>
              <option value={Priority.MEDIA}>Media</option>
              <option value={Priority.ALTA}>Alta</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="select"
            >
              <option value={Status.PENDIENTE}>Pendiente</option>
              <option value={Status.EN_PROGRESO}>En Progreso</option>
              <option value={Status.COMPLETADA}>Completada</option>
            </select>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-col items-center mb-3">
            <button
              type="button"
              onClick={generateSubtaskWithAI}
              disabled={generatingSubtask || !formData.title.trim() || !formData.description.trim()}
              className="btn-secondary text-xs px-3 py-1 flex items-center space-x-1 mb-1"
              title="Generar subtareas con IA"
            >
              <Sparkles size={14} />
              <span>{generatingSubtask ? 'Generando...' : 'IA'}</span>
            </button>
            <span className="text-[11px] text-gray-400 text-center max-w-[260px]">
              ¿No sabes por dónde empezar? Haz clic en IA para obtener sugerencias automáticas.
            </span>
          </div>
          <div className="mb-1">
            <h3 className="text-base font-semibold text-gray-900">Subtareas</h3>
            <p className="text-xs text-gray-500 mt-1">
              Puedes agregar subtareas manualmente o dejar que la IA te sugiera subtareas en base a la tarea principal.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-2 items-start md:items-end bg-gray-50 p-3 rounded-lg border mb-4 mt-2">
            <div className="flex-1">
              <input
                type="text"
                className="input w-full mb-1 rounded-lg border-gray-300 focus:border-primary-400 focus:ring-primary-200"
                placeholder="Nueva subtarea (título)"
                value={newSubtaskTitle}
                onChange={e => setNewSubtaskTitle(e.target.value)}
                maxLength={100}
              />
              <textarea
                className="input w-full min-h-[40px] rounded-lg border-gray-300 focus:border-primary-400 focus:ring-primary-200"
                placeholder="Descripción (opcional)"
                value={newSubtaskDescription}
                onChange={e => setNewSubtaskDescription(e.target.value)}
                maxLength={200}
              />
            </div>
            <button
              type="button"
              className="btn-primary px-4 py-2 rounded-lg mt-2 md:mt-0"
              onClick={handleAddManualSubtask}
              disabled={addingSubtask || !newSubtaskTitle.trim()}
            >
              {addingSubtask ? 'Agregando...' : 'Agregar'}
            </button>
          </div>
          <ul className="divide-y divide-gray-200 bg-white rounded border">
            {availableSubtasks.length === 0 && (
              <li className="p-3 text-sm text-gray-500">No hay subtareas disponibles.</li>
            )}
            {availableSubtasks.map(subtask => {
              const isLinked = (formData.subtaskIds ?? []).includes(subtask.id);
              const isTemp = subtask.id.startsWith('ia-');
              // @ts-ignore: taskCount puede venir del backend
              const taskCount = (subtask as any).taskCount ?? 0;
              return (
                <li key={subtask.id} className="flex items-center justify-between p-3 hover:bg-gray-50">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{subtask.title}</div>
                    <div className="text-xs text-gray-500">{subtask.description || subtask.status}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isLinked ? (
                      <button
                        type="button"
                        className="btn-danger btn-xs"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            subtaskIds: (prev.subtaskIds ?? []).filter(id => id !== subtask.id)
                          }));
                        }}
                      >
                        Desvincular
                      </button>
                    ) : (
                      <>
                        {taskCount === 0 && !isLinked && (
                          <button
                            type="button"
                            className="ml-2 text-danger-600 hover:text-danger-800"
                            onClick={() => handleDeleteSubtask(subtask.id)}
                            title="Eliminar subtarea"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn-primary btn-xs"
                          onClick={async () => {
                            if (isTemp) {
                              const created = await apiService.createSubtask({
                                title: subtask.title,
                                description: subtask.description,
                                status: Status.PENDIENTE
                              });
                              setAvailableSubtasks(prev => prev.map(s => s.id === subtask.id ? created : s));
                              setFormData(prev => ({
                                ...prev,
                                subtaskIds: [...(prev.subtaskIds ?? []), created.id]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                subtaskIds: [...(prev.subtaskIds ?? []), subtask.id]
                              }));
                            }
                          }}
                        >
                          Vincular
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading || !formData.title.trim() || !formData.description.trim()}
          >
            {isLoading ? 'Guardando...' : (task ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </div>

      {/* Modal para seleccionar subtareas generadas */}
      {showSubtaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Subtareas Generadas</h3>
              <button
                onClick={() => setShowSubtaskModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              La IA ha generado {generatedSubtasks.length} subtareas basándose en tu tarea. Selecciona las que quieras asignar:
            </p>
            <div className="space-y-3">
              {generatedSubtasks.map((suggestion, index) => (
                <label key={suggestion.title + index} className="flex items-start space-x-2 cursor-pointer p-2 border rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={selectedSuggestions.some(s => s.title === suggestion.title && s.description === suggestion.description)}
                    onChange={() => handleGeneratedCheck(suggestion)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                  </div>
                  <span className="text-xs text-gray-400 ml-2">#{index + 1}</span>
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setShowSubtaskModal(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={assignGeneratedSubtasks}
                className="btn-primary"
                disabled={selectedSuggestions.length === 0}
              >
                Asignar seleccionadas
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 