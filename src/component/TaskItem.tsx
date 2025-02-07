"use client";

import React, { useState } from "react";
import { X, Edit } from "lucide-react";
import "./TaskItem.css";
import {Task} from "../types/task.ts";


interface TaskItemProps {
    task: Task;
    onToggleCompletion: (id: number) => void;
    onUpdateTask: (updatedTask: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
                                               task,
                                               onToggleCompletion,
                                               onUpdateTask,
                                           }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState<Task>({ ...task });

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setEditedTask({ ...task });
    };

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        onUpdateTask(editedTask);
        setIsEditing(false);
        closeModal();
    };

    return (
        <>
            <div
                className={`task-item ${task.completed ? "completed" : ""}`}
                onClick={openModal}
            >
                <div className="task-item-header">
                    <h3 className={`task-item-title ${task.completed ? "completed" : ""}`}>
                        {task.title}
                    </h3>
                    <div className="task-item-controls">
                        <span className="task-deadline">{task.deadline}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleCompletion(task.id);
                            }}
                            className={`toggle-button ${task.completed ? "cancel" : "complete"}`}
                        >
                            {task.completed ? "Отменить" : "Завершить"}
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {isEditing ? "Редактирование задачи" : task.title}
                            </h2>
                            <div className="modal-icons">
                                {!isEditing && (
                                    <button onClick={handleEdit} className="icon-button">
                                        <Edit size={20} />
                                    </button>
                                )}
                                <button onClick={closeModal} className="icon-button">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {isEditing ? (
                            <div className="modal-body">
                                <input
                                    type="text"
                                    value={editedTask.title}
                                    onChange={(e) =>
                                        setEditedTask({ ...editedTask, title: e.target.value })
                                    }
                                    className="modal-input"
                                />
                                <textarea
                                    value={editedTask.description}
                                    onChange={(e) =>
                                        setEditedTask({ ...editedTask, description: e.target.value })
                                    }
                                    className="modal-textarea"
                                />
                                <input
                                    type="date"
                                    value={editedTask.deadline}
                                    onChange={(e) =>
                                        setEditedTask({ ...editedTask, deadline: e.target.value })
                                    }
                                    className="modal-input"
                                />
                                <div className="modal-footer">
                                    <button onClick={handleSave} className="save-button">
                                        Сохранить
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="modal-body">
                                    <p>{task.description}</p>
                                    <p>{task.deadline}</p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        onClick={() => {
                                            onToggleCompletion(task.id);
                                            closeModal();
                                        }}
                                        className={`toggle-button ${
                                            task.completed ? "cancel" : "complete"
                                        }`}
                                    >
                                        {task.completed
                                            ? "Отменить выполнение"
                                            : "Отметить как выполненное"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default TaskItem;
