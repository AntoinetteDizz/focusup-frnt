export enum Priority {
  ALTA = 'Alta',
  MEDIA = 'Media',
  BAJA = 'Baja',
}

export enum Status {
  PENDIENTE = 'pendiente',
  EN_PROGRESO = 'en progreso',
  COMPLETADA = 'completada',
}

export interface Subtask {
  id: string;
  title: string;
  description?: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  priority?: Priority;
  status?: Status;
  subtaskIds?: string[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  subtaskIds?: string[];
}

export interface CreateSubtaskDto {
  title: string;
  description?: string;
  status?: Status;
}

export interface UpdateSubtaskDto {
  title?: string;
  description?: string;
  status?: Status;
} 