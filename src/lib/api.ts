import { Task, CreateTaskDto, UpdateTaskDto, Subtask, CreateSubtaskDto, UpdateSubtaskDto } from '@/types/task';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiService {
  private baseUrl: string;
  private subtasksUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/tasks`;
    this.subtasksUrl = `${API_BASE_URL}/api/subtasks`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    baseUrl?: string
  ): Promise<T> {
    const url = `${baseUrl || this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} ${response.statusText}`, {
          url,
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          options
        });
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Request failed:', {
        url,
        error: error instanceof Error ? error.message : String(error),
        options
      });
      throw error;
    }
  }

  // ===== TASKS =====

  // Obtener todas las tareas
  async getTasks(): Promise<Task[]> {
    return this.request<Task[]>('');
  }

  // Obtener una tarea por ID
  async getTask(id: string): Promise<Task> {
    return this.request<Task>(`/${id}`);
  }

  // Crear una nueva tarea
  async createTask(task: CreateTaskDto): Promise<Task> {
    return this.request<Task>('', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  // Actualizar una tarea
  async updateTask(id: string, task: UpdateTaskDto): Promise<Task> {
    return this.request<Task>(`/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(task),
    });
  }

  // Eliminar una tarea
  async deleteTask(id: string): Promise<void> {
    await this.request<void>(`/${id}`, {
      method: 'DELETE',
    });
  }

  // Crear relación entre tarea y subtarea
  async createTaskSubtaskRelation(taskId: string, subtaskId: string): Promise<any> {
    return this.request<any>(`/${taskId}/subtask`, {
      method: 'POST',
      body: JSON.stringify({ subtaskId }),
    });
  }

  // Eliminar relación entre tarea y subtarea
  async removeTaskSubtaskRelation(taskId: string): Promise<void> {
    await this.request<void>(`/${taskId}/subtask`, {
      method: 'DELETE',
    });
  }

  // Obtener tareas por estado
  async getTasksByStatus(status: string): Promise<Task[]> {
    return this.request<Task[]>(`/status/${status}`);
  }

  // Obtener tareas por prioridad
  async getTasksByPriority(priority: string): Promise<Task[]> {
    return this.request<Task[]>(`/priority/${priority}`);
  }

  // ===== SUBTASKS =====

  // Obtener todas las subtareas
  async getSubtasks(): Promise<Subtask[]> {
    return this.request<Subtask[]>('', undefined, this.subtasksUrl);
  }

  // Obtener una subtarea por ID
  async getSubtask(id: string): Promise<Subtask> {
    return this.request<Subtask>(`/${id}`, undefined, this.subtasksUrl);
  }

  // Obtener sugerencias de subtareas usando IA (no guarda en la base de datos)
  async getSubtaskSuggestionsWithAI(taskData: { title: string; description: string; priority: string }): Promise<{ title: string; description: string }[]> {
    return this.request<{ title: string; description: string }[]>('/ai', {
      method: 'POST',
      body: JSON.stringify(taskData),
    }, this.subtasksUrl);
  }

  // Crear una nueva subtarea
  async createSubtask(subtask: { title: string; description?: string; status?: string }): Promise<Subtask> {
    return this.request<Subtask>('', {
      method: 'POST',
      body: JSON.stringify(subtask),
    }, this.subtasksUrl);
  }

  // Actualizar una subtarea
  async updateSubtask(id: string, subtask: UpdateSubtaskDto): Promise<Subtask> {
    return this.request<Subtask>(`/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(subtask),
    }, this.subtasksUrl);
  }

  // Eliminar una subtarea
  async deleteSubtask(id: string): Promise<void> {
    await this.request<void>(`/${id}`, {
      method: 'DELETE',
    }, this.subtasksUrl);
  }

  // Obtener subtareas por estado
  async getSubtasksByStatus(status: string): Promise<Subtask[]> {
    return this.request<Subtask[]>(`/status/${status}`, undefined, this.subtasksUrl);
  }
}

export const apiService = new ApiService(); 