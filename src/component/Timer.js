import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Timer.css';
import { URL } from '../utils/constant';

function Timer() {
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [repoName, setRepoName] = useState(null);
    const [intervalId, setIntervalId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await axios.get(`${URL}/status`);
                if (response.data) {
                    setRepoName(response.data.repo_name);
                    setStartTime(new Date(response.data.assessment_start_time));
                    setEndTime(response.data.assessment_end_time ? new Date(response.data.assessment_end_time) : null);
                }
            } catch (err) {
                console.error('Error fetching status:', err);
                setError('Failed to fetch status. Please try again later.');
            }
        };
        fetchStatus();
    }, []);

    useEffect(() => {
        if (startTime && !endTime) {
            const id = setInterval(() => {
                setStartTime((prev) => new Date(prev));
            }, 1000);
            setIntervalId(id);
        }
        return () => clearInterval(intervalId);
    }, [startTime, endTime]);

    const start = async () => {
        try {
            const response = await axios.post(`${URL}/start`);
            setStartTime(new Date(response.data.assessment_start_time));
        } catch (err) {
            console.error('Error starting the timer:', err);
            setError('Failed to start the timer. Please try again.');
        }
    };

    const complete = async () => {
        try {
            const response = await axios.post(`${URL}/complete`);
            setEndTime(new Date(response.data.assessment_end_time));
            clearInterval(intervalId);
        } catch (err) {
            console.error('Error completing the timer:', err);
            setError('Failed to complete the timer. Please try again.');
        }
    };

    const formatTime = (time) => {
        return time ? time.toISOString().replace('T', ' ').substring(0, 19) : 'N/A';
    };

    const elapsed = () => {
        if (!startTime) return 'N/A';
        const end = endTime || new Date();
        const diff = end - startTime;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <div className="timer-container">
            <h1>Build Your Own Timer Challenge 🕒</h1>
            {error && <p className="error-message">{error}</p>}
            <h3> Repo : {repoName}</h3>
            <p>Start Time: {formatTime(startTime)}</p>
            <p>End Time: {formatTime(endTime)}</p>
            <p>Elapsed Time: {elapsed()}</p>
            <button onClick={start} disabled={!!startTime}>Start</button>
            <button onClick={complete} disabled={!startTime || !!endTime}>Complete</button>
        </div>
    );
}

export default Timer;
