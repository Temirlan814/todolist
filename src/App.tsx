"use client";

import React, {useEffect, useState} from "react";
import Header from "./component/Header";
import TaskList from "./component/TaskList";
import AddTaskButton from "./component/AddTaskButton";
import PomodoroTimer from "./component/Pomodoro.tsx";

import "./App.css";
import { Task } from "./types/task.ts";

const App: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(() => {
        const storedTasks = localStorage.getItem("tasks");
        if (storedTasks) {
            return JSON.parse(storedTasks);
        }
        return [
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
        ];
    });

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

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

            <div className="twoColumns">
                {/* Левая колонка */}
                <div className="leftColumn">
                    <PomodoroTimer
                        activeTaskId={tasks.find(task => !task.completed)?.id ?? null}
                        onTimerComplete={() => alert("Pomodoro session completed!")}
                    />
                </div>

                {/* Правая колонка */}
                <div className="rightColumn">
                    <AddTaskButton onAddTask={addTask} />
                    <TaskList
                        tasks={tasks}
                        onToggleCompletion={toggleTaskCompletion}
                        onUpdateTask={updateTask}
                    />
                </div>
            </div>
        </div>

    );
};

export default App;
