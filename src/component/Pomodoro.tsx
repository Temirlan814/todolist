"use client";

import React, { useEffect, useState } from "react";
import "./Pomodoro.css";

const WORK_TIME = 25 * 60;
const LONG_BREAK = 15 * 60;
const SHORT_BREAK = 5 * 60;

interface PomodoroState {
    timeLeft: number;
    isActive: boolean;
    isWork: boolean;
    selectedTime: number;
    completedSessions: number;
}

const PomodoroTimer: React.FC = () => {
    const loadState = (): PomodoroState => {
        const savedState = localStorage.getItem("pomodoroState");
        return savedState
            ? JSON.parse(savedState)
            : {
                timeLeft: WORK_TIME,
                isActive: false,
                isWork: true,
                selectedTime: WORK_TIME,
                completedSessions: 0,
            };
    };

    const [pomodoro, setPomodoro] = useState<PomodoroState>(loadState);

    useEffect(() => {
        localStorage.setItem("pomodoroState", JSON.stringify(pomodoro));
    }, [pomodoro]);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (pomodoro.isActive && pomodoro.timeLeft > 0) {
            timer = setInterval(() => {
                setPomodoro((prev) => ({
                    ...prev,
                    timeLeft: prev.timeLeft - 1,
                }));
            }, 1000);
        } else if (pomodoro.timeLeft === 0) {
            setPomodoro((prev) => {
                const newIsWork = !prev.isWork;
                const newTime = newIsWork ? prev.selectedTime : prev.completedSessions % 4 === 0 ? LONG_BREAK : SHORT_BREAK;

                return {
                    ...prev,
                    isWork: newIsWork,
                    timeLeft: newTime,
                    completedSessions: newIsWork ? prev.completedSessions + 1 : prev.completedSessions,
                };
            });
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [pomodoro.isActive, pomodoro.timeLeft]);

    const toggleTimer = () => {
        setPomodoro((prev) => {
            const newState = { ...prev, isActive: !prev.isActive };
            localStorage.setItem("pomodoroState", JSON.stringify(newState));
            return newState;
        });
    };

    const resetTimer = () => {
        setPomodoro((prev) => {
            const newState = {
                ...prev,
                timeLeft: prev.selectedTime,
                isActive: false,
                isWork: true,
                completedSessions: 0,
            };

            localStorage.setItem("pomodoroState", JSON.stringify(newState)); // Сразу сохраняем
            return newState;
        });
    };


    const selectTime = (time: number) => {
        setPomodoro({
            timeLeft: time,
            isActive: false,
            isWork: true,
            selectedTime: time,
            completedSessions: pomodoro.completedSessions,
        });
        localStorage.setItem(
            "pomodoroState",
            JSON.stringify({
                timeLeft: time,
                isActive: false,
                isWork: true,
                selectedTime: time,
                completedSessions: pomodoro.completedSessions,
            })
        );
    };

    return (
        <div className="pomodoro-card">
            <div className="pomodoro-title">Pomodoro Timer</div>
            <div className="pomodoro-progress-bar">
                <div
                    className="pomodoro-progress"
                    style={{ width: `${(pomodoro.timeLeft / pomodoro.selectedTime) * 100}%` }}
                ></div>
            </div>
            <div className="pomodoro-mode-buttons">
                <button onClick={() => selectTime(WORK_TIME)} disabled={pomodoro.isActive}>
                    25 min
                </button>
                <button onClick={() => selectTime(LONG_BREAK)} disabled={pomodoro.isActive}>
                    15 min
                </button>
                <button onClick={() => selectTime(SHORT_BREAK)} disabled={pomodoro.isActive}>
                    5 min
                </button>
            </div>
            <div className="pomodoro-timer">{`${Math.floor(pomodoro.timeLeft / 60)
                .toString()
                .padStart(2, "0")}:${(pomodoro.timeLeft % 60).toString().padStart(2, "0")}`}</div>
            <div className="pomodoro-status">{pomodoro.isWork ? "Work Time" : "Break Time"}</div>
            <div className="pomodoro-sessions">Completed Sessions: {pomodoro.completedSessions}</div>
            <div className="pomodoro-buttons">
                <button className="start-button" onClick={toggleTimer}>
                    {pomodoro.isActive ? "Pause" : "Start"}
                </button>
                <button className="reset-button" onClick={resetTimer}>
                    Reset
                </button>
            </div>
        </div>
    );
};

export default PomodoroTimer;
