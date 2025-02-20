"use client";

import React from "react";
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

// Если пропсы не нужны, можно объявить так:
type PomodoroProps = Record<string, never>;

class PomodoroTimer extends React.Component<PomodoroProps, PomodoroState> {
    // Храним идентификатор таймера
    timer: number | null = null;

    // Инициализируем state сразу как свойство класса,
    // чтобы не хранить конструктор, если не используем props.
    state: PomodoroState = this.loadState();

    loadState(): PomodoroState {
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
    }

    componentDidMount() {
        this.startTimerIfNeeded();
    }

    componentDidUpdate(prevProps: PomodoroProps, prevState: PomodoroState) {
        // Сохраняем состояние в localStorage
        localStorage.setItem("pomodoroState", JSON.stringify(this.state));

        // Если изменилось состояние таймера или оставшееся время, перезапускаем интервал
        if (
            prevState.isActive !== this.state.isActive ||
            prevState.timeLeft !== this.state.timeLeft
        ) {
            this.clearTimer();
            this.startTimerIfNeeded();
        }
    }

    componentWillUnmount() {
        this.clearTimer();
    }

    clearTimer() {
        if (this.timer !== null) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    startTimerIfNeeded() {
        if (this.state.isActive && this.state.timeLeft > 0) {
            this.timer = window.setInterval(() => {
                this.tick();
            }, 1000);
        } else if (this.state.timeLeft === 0) {
            this.handleTimeEnd();
        }
    }

    tick() {
        if (this.state.timeLeft > 0) {
            this.setState((prevState) => ({
                timeLeft: prevState.timeLeft - 1,
            }));
        } else {
            this.handleTimeEnd();
        }
    }

    handleTimeEnd() {
        this.setState((prevState) => {
            const newIsWork = !prevState.isWork;
            const newTime = newIsWork
                ? prevState.selectedTime
                : prevState.completedSessions % 4 === 0
                    ? LONG_BREAK
                    : SHORT_BREAK;

            return {
                ...prevState,
                isWork: newIsWork,
                timeLeft: newTime,
                completedSessions: newIsWork
                    ? prevState.completedSessions + 1
                    : prevState.completedSessions,
            };
        });
    }

    toggleTimer = () => {
        this.setState((prevState) => ({
            ...prevState,
            isActive: !prevState.isActive,
        }));
    };

    resetTimer = () => {
        this.setState((prevState) => ({
            timeLeft: prevState.selectedTime,
            isActive: false,
            isWork: true,
            completedSessions: 0,
        }));
    };

    selectTime = (time: number) => {
        this.setState((prevState) => ({
            timeLeft: time,
            isActive: false,
            isWork: true,
            selectedTime: time,
            completedSessions: prevState.completedSessions,
        }));
    };

    render() {
        const { timeLeft, selectedTime, isActive, isWork, completedSessions } =
            this.state;

        return (
            <div className="pomodoro-card">
                <div className="pomodoro-title">Pomodoro Timer</div>
                <div className="pomodoro-progress-bar">
                    <div
                        className="pomodoro-progress"
                        style={{
                            width: `${(timeLeft / selectedTime) * 100}%`,
                        }}
                    ></div>
                </div>
                <div className="pomodoro-mode-buttons">
                    <button onClick={() => this.selectTime(WORK_TIME)} disabled={isActive}>
                        25 min
                    </button>
                    <button
                        onClick={() => this.selectTime(LONG_BREAK)}
                        disabled={isActive}
                    >
                        15 min
                    </button>
                    <button
                        onClick={() => this.selectTime(SHORT_BREAK)}
                        disabled={isActive}
                    >
                        5 min
                    </button>
                </div>
                <div className="pomodoro-timer">
                    {`${Math.floor(timeLeft / 60)
                        .toString()
                        .padStart(2, "0")}:${(timeLeft % 60).toString().padStart(2, "0")}`}
                </div>
                <div className="pomodoro-status">
                    {isWork ? "Work Time" : "Break Time"}
                </div>
                <div className="pomodoro-sessions">
                    Completed Sessions: {completedSessions}
                </div>
                <div className="pomodoro-buttons">
                    <button className="start-button" onClick={this.toggleTimer}>
                        {isActive ? "Pause" : "Start"}
                    </button>
                    <button className="reset-button" onClick={this.resetTimer}>
                        Reset
                    </button>
                </div>
            </div>
        );
    }
}

export default PomodoroTimer;
