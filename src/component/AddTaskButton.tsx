"use client";

import React, { useState } from "react";
import "../Css-Modules/AddTaskButton.css";
import {BaseTask} from "../types/task.ts";

interface AddTaskButtonProps {
    onAddTask: (task: BaseTask) => void;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ onAddTask }) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [newTask, setNewTask] = useState<BaseTask>({
        title: "",
        description: "",
        deadline: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddTask(newTask);
        setNewTask({ title: "", description: "", deadline: "" });
        setIsFormVisible(false);
    };

    return (
        <div className="add-task-wrapper">
            <button
                onClick={() => setIsFormVisible(!isFormVisible)}
                className="add-task-button"
            >
                {isFormVisible ? "Закрыть" : "Добавить задачу"}
            </button>

            {isFormVisible && (
                <form onSubmit={handleSubmit} className="add-task-form">
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">
                            Заголовок:
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={newTask.title}
                            onChange={(e) =>
                                setNewTask({ ...newTask, title: e.target.value })
                            }
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            Описание:
                        </label>
                        <textarea
                            id="description"
                            value={newTask.description}
                            onChange={(e) =>
                                setNewTask({ ...newTask, description: e.target.value })
                            }
                            className="form-textarea"
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="deadline" className="form-label">
                            Дедлайн:
                        </label>
                        <input
                            type="date"
                            id="deadline"
                            value={newTask.deadline}
                            onChange={(e) =>
                                setNewTask({ ...newTask, deadline: e.target.value })
                            }
                            required
                            className="form-input"
                        />
                    </div>

                    <button type="submit" className="submit-button">
                        Добавить
                    </button>
                </form>
            )}
        </div>
    );
};

export default AddTaskButton;
