"use client";

import React from "react";
import "./Pomodoro.css";

const WORK_TIME = 25 * 60;
const LONG_BREAK = 15 * 60;
const SHORT_BREAK = 5 * 60;

interface PomodoroTimerProps {
    activeTaskId?: number | null;
    onTimerComplete: () => void;
}

interface PomodoroTimerState {
    timeLeft: number;
    isActive: boolean;
    isWork: boolean;
    selectedTime: number;
    completedSessions: number;
}

class PomodoroTimer extends React.Component<PomodoroTimerProps, PomodoroTimerState> {
    interval: NodeJS.Timeout | null = null;

    constructor(props: PomodoroTimerProps) {
        super(props);
        this.state = {
            timeLeft: WORK_TIME,
            isActive: false,
            isWork: true,
            selectedTime: WORK_TIME,
            completedSessions: 0,
        };
    }

    componentDidMount() {
        // Автоматический запуск таймера при монтировании
        this.toggleTimer();
    }

    componentDidUpdate(_prevProps: PomodoroTimerProps, prevState: PomodoroTimerState) {
        const { timeLeft, isActive, isWork, selectedTime } = this.state;
        const { onTimerComplete } = this.props;

        if (isActive && timeLeft > 0 && !prevState.isActive) {
            this.interval = setInterval(() => {
                this.setState((prevState) => ({ timeLeft: prevState.timeLeft - 1 }));
            }, 1000);
        } else if (timeLeft === 0 && prevState.timeLeft !== 0) {
            this.setState({ isWork: !isWork });
            this.setState({ timeLeft: isWork ? LONG_BREAK : selectedTime });
            if (isWork) {
                this.setState((prevState) => ({ completedSessions: prevState.completedSessions + 1 }));
            }
            if (!isWork) onTimerComplete();
        }

        if (!isActive && prevState.isActive && this.interval) {
            clearInterval(this.interval);
        }
    }

    componentWillUnmount() {
        if (this.interval) clearInterval(this.interval);
    }

    selectTime = (time: number) => {
        this.setState({
            selectedTime: time,
            timeLeft: time,
            isActive: false,
            isWork: true,
        });
    };

    toggleTimer = () => {
        this.setState((prevState) => ({ isActive: !prevState.isActive }));
    };

    resetTimer = () => {
        this.selectTime(this.state.selectedTime);
        this.setState({ completedSessions: 0 });
    };

    formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
        const secs = (seconds % 60).toString().padStart(2, "0");
        return `${mins}:${secs}`;
    };

    render() {
        const { timeLeft, isActive, isWork, selectedTime, completedSessions } = this.state;
        const { activeTaskId } = this.props;

        return (
            <div className="pomodoro-card">
                <div className="pomodoro-title">Pomodoro Timer</div>
                {/* Прогресс-бар */}
                <div className="pomodoro-progress-bar">
                    <div
                        className="pomodoro-progress"
                        style={{ width: `${((selectedTime - timeLeft) / selectedTime) * 100}%` }}
                    ></div>
                </div>
                <div className="pomodoro-mode-buttons">
                    <button onClick={() => this.selectTime(WORK_TIME)}>25 min</button>
                    <button onClick={() => this.selectTime(LONG_BREAK)}>15 min</button>
                    <button onClick={() => this.selectTime(SHORT_BREAK)}>5 min</button>
                </div>
                <div className="pomodoro-timer">{this.formatTime(timeLeft)}</div>
                <div className="pomodoro-status">{isWork ? "Work Time" : "Break Time"}</div>
                <div className="pomodoro-sessions">Completed Sessions: {completedSessions}</div>
                <div className="pomodoro-buttons">
                    <button className="start-button" onClick={this.toggleTimer}>
                        {isActive ? "Pause" : "Start"}
                    </button>
                    <button className="reset-button" onClick={this.resetTimer}>
                        Reset
                    </button>
                </div>
                {activeTaskId !== null && (
                    <div className="pomodoro-active-task">Active Task ID: {activeTaskId}</div>
                )}
            </div>
        );
    }
}

export default PomodoroTimer;