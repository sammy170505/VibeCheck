import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'frontend/App.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (username && password) {
            navigate('/home')
        } else {
            alert('Please enter a valid username and password');
        }
    };

    return (
        <div className="login-container">
            <h1> Welcome to VibeCheck!</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
    );
};
export default Login;