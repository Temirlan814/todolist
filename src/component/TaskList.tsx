"use client";

import React from "react";
import TaskItem from "./TaskItem";
import {Task} from "../types/task.ts";

interface TaskListProps {
    tasks: Task[];
    onToggleCompletion: (id: number) => void;
    onUpdateTask: (updatedTask: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({
                                               tasks,
                                               onToggleCompletion,
                                               onUpdateTask,
                                           }) => {
    return (
        <div className="task-list">
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggleCompletion={onToggleCompletion}
                    onUpdateTask={onUpdateTask}
                />
            ))}
        </div>
    );
};

export default TaskList;
