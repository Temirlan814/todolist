// Базовый интерфейс для задачи (без id и completed)
export interface BaseTask {
    title: string;
    description: string;
    deadline: string;
}

// Полный интерфейс для задачи (с id и completed)
export interface Task extends BaseTask {
    id: number;
    completed: boolean;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    deadline: string;
    completed: boolean;
}