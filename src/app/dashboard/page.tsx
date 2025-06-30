'use client';

import { useState, useEffect } from 'react';
import { Task, CreateTaskDto, UpdateTaskDto, Status } from '@/types/task';
import { apiService } from '@/lib/api';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import PomodoroTimer from '@/components/PomodoroTimer';
import { Plus } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Cargar tareas al montar el componente
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await apiService.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error cargando tareas:', error);
      alert('Error al cargar las tareas. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: CreateTaskDto) => {
    try {
      setFormLoading(true);
      const newTask = await apiService.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creando tarea:', error);
      alert('Error al crear la tarea.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTask = async (taskData: UpdateTaskDto) => {
    if (!editingTask) return;
    
    try {
      setFormLoading(true);
      const updatedTask = await apiService.updateTask(editingTask.id, taskData);
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id ? updatedTask : task
      ));
      setEditingTask(null);
    } catch (error) {
      console.error('Error actualizando tarea:', error);
      alert('Error al actualizar la tarea.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return;
    // Eliminar del estado local inmediatamente
    setTasks(prev => prev.filter(task => task.id !== id));
    try {
      await apiService.deleteTask(id);
    } catch (error) {
      // No mostrar ningún mensaje de error
    }
  };

  const handleStatusChange = async (id: string, status: Status) => {
    try {
      console.log('Cambiando estado de tarea:', { id, status });
      
      // Validar que el status sea válido
      if (!Object.values(Status).includes(status)) {
        throw new Error(`Estado inválido: ${status}`);
      }
      
      const updatedTask = await apiService.updateTask(id, { status });
      console.log('Tarea actualizada exitosamente:', updatedTask);
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ));
    } catch (error) {
      console.error('Error cambiando estado:', error);
      console.error('Detalles del error:', {
        id,
        status,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined
      });
      
      // Mostrar mensaje de error más específico
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error al cambiar el estado de la tarea: ${errorMessage}`);
    }
  };

  const handleSubtaskStatusChange = async (subtaskId: string, status: Status) => {
    try {
      console.log('Cambiando estado de subtarea:', { subtaskId, status });
      
      // Validar que el status sea válido
      if (!Object.values(Status).includes(status)) {
        throw new Error(`Estado inválido: ${status}`);
      }
      
      const updatedSubtask = await apiService.updateSubtask(subtaskId, { status });
      console.log('Subtarea actualizada exitosamente:', updatedSubtask);
      
      // Actualizar la tarea que contiene esta subtarea
      setTasks(prev => prev.map(task => {
        const subtaskIndex = task.subtasks.findIndex(subtask => subtask.id === subtaskId);
        if (subtaskIndex !== -1) {
          const updatedSubtasks = [...task.subtasks];
          updatedSubtasks[subtaskIndex] = updatedSubtask;
          return {
            ...task,
            subtasks: updatedSubtasks
          };
        }
        return task;
      }));
    } catch (error) {
      console.error('Error cambiando estado de subtarea:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error al cambiar el estado de la subtarea: ${errorMessage}`);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleFormSubmit = (data: CreateTaskDto | UpdateTaskDto) => {
    if (editingTask) {
      handleUpdateTask(data as UpdateTaskDto);
    } else {
      handleCreateTask(data as CreateTaskDto);
    }
  };

  const generateSubtaskWithAI = async () => {
    try {
      // Obtener sugerencias de subtareas usando IA
      const suggestions = await apiService.getSubtaskSuggestionsWithAI({
        title: 'Tarea automática',
        description: 'Subtareas generadas automáticamente para uso posterior',
        priority: 'Media'
      });
      
      if (Array.isArray(suggestions) && suggestions.length > 0) {
        alert(`Se generaron ${suggestions.length} sugerencias de subtareas:\n${suggestions.map(s => `• ${s.title}`).join('\n')}`);
      } else {
        alert('No se pudieron generar sugerencias de subtareas con IA.');
      }
      
      // Recargar las tareas para mostrar las nuevas subtareas disponibles
      await loadTasks();
    } catch (error) {
      console.error('Error generating subtask suggestions with AI:', error);
      alert('Error al generar las sugerencias de subtareas con IA. Inténtalo de nuevo.');
    }
  };

  const getTasksByStatus = (status: Status) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🎯</span>
              </div>
              <span className="text-xl font-bold text-gray-900">FocusUp Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={generateSubtaskWithAI}
                className="btn-secondary flex items-center space-x-2"
                title="Generar subtarea con IA"
              >
                <Sparkles size={16} />
                <span>IA</span>
              </button>
              
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Nueva Tarea</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Temporizador */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <PomodoroTimer />
            </div>
          </div>

          {/* Columna derecha - Tareas */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin text-primary-600" size={32} />
                <span className="ml-2 text-gray-600">Cargando tareas...</span>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="card text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {getTasksByStatus(Status.PENDIENTE).length}
                    </div>
                    <div className="text-sm text-gray-600">Pendientes</div>
                  </div>
                  <div className="card text-center">
                    <div className="text-2xl font-bold text-warning-600">
                      {getTasksByStatus(Status.EN_PROGRESO).length}
                    </div>
                    <div className="text-sm text-gray-600">En Progreso</div>
                  </div>
                  <div className="card text-center">
                    <div className="text-2xl font-bold text-success-600">
                      {getTasksByStatus(Status.COMPLETADA).length}
                    </div>
                    <div className="text-sm text-gray-600">Completadas</div>
                  </div>
                </div>

                {/* Lista de tareas */}
                {tasks.length === 0 ? (
                  <div className="card text-center py-12">
                    <div className="text-4xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold mb-2">No hay tareas</h3>
                    <p className="text-gray-600 mb-4">
                      Crea tu primera tarea para comenzar a organizar tu trabajo
                    </p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="btn-primary"
                    >
                      Crear primera tarea
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                        onSubtaskStatusChange={handleSubtaskStatusChange}
                        isLoading={false}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de formulario */}
      {(showForm || editingTask) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <TaskForm
              task={editingTask || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
              isLoading={formLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
} 