"use client";

import React, { useEffect, useState } from "react";
import Header from "./component/Header";
import TaskList from "./component/TaskList";
import AddTaskButton from "./component/AddTaskButton";
import PomodoroTimer from "./component/Pomodoro.tsx";

import "./Css-Modules/App.css";
import { Task } from "./types/task.ts";

const App: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(() => {
        const storedTasks = localStorage.getItem("tasks");
        return storedTasks ? JSON.parse(storedTasks) : [];
    });

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode.toString());
    }, [darkMode]);

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

    const deleteTask = (id: number) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    // Фильтрация задач по поисковому запросу
    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
            <div className="header-container">
                <Header />
                <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
                </button>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="🔍 Поиск задач..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="twoColumns">
                <div className="leftColumn">
                    <PomodoroTimer
                        activeTaskId={tasks.find(task => !task.completed)?.id ?? null}
                        onTimerComplete={() => alert("Pomodoro session completed!")}
                    />
                </div>

                <div className="rightColumn">
                    <AddTaskButton onAddTask={addTask} />
                    <TaskList
                        tasks={filteredTasks} // Передаем отфильтрованные задачи
                        onToggleCompletion={toggleTaskCompletion}
                        onUpdateTask={updateTask}
                        onDeleteTask={deleteTask}
                    />
                </div>
            </div>
        </div>
    );
};

export default App;
