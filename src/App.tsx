"use client";

import React, { useState } from "react";
import Header from "./component/Header";
import TaskList from "./component/TaskList";
import AddTaskButton from "./component/AddTaskButton";
import PomodoroTimer from "./component/Pomodoro.tsx";

import "./App.css";
import { Task } from "./types/task.ts";

const App: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: 1,
            title: "Завершить проект",
            description: "Закончить разработку To-Do List",
            deadline: "2025-06-30",
            completed: false,
        },
        {
            id: 2,
            title: "Купить продукты",
            description: "Молоко, хлеб, яйца",
            deadline: "2025-06-25",
            completed: false,
        },
    ]);

    const addTask = (newTask: Omit<Task, "id" | "completed">) => {
        const task: Task = {
            ...newTask,
            id: Date.now(),
            completed: false,
        };
        setTasks([...tasks, task]);
    };

    const toggleTaskCompletion = (id: number) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const updateTask = (updatedTask: Task) => {
        setTasks(
            tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );
    };

    return (
        <div className="app-container">
            <Header />
            <AddTaskButton onAddTask={addTask} />

            <PomodoroTimer
                activeTaskId={tasks.find(task => !task.completed)?.id ?? null}
                onTimerComplete={() => alert("Pomodoro session completed!")}
            />

            <TaskList
                tasks={tasks}
                onToggleCompletion={toggleTaskCompletion}
                onUpdateTask={updateTask}
            />
        </div>
    );
};

export default App;
