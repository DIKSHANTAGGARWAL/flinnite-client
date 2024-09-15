import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import '../css/login.css';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState(false);

    useEffect(() => {
        const email = localStorage.getItem("userEmail");
        if (email) {
            navigate("/");
        }
    }, []);

    const Login = async () => {
        if (!email || !password) {
            setError(true);
            throw new Error("Please enter both email and password.");
        }

        let result = await fetch(
            `${process.env.REACT_APP_server_url}/auth/login`,
            {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        result = await result.json();
        console.log(result)
        if (result.status !=  200) {
            throw new Error(result.error);
        } else {
            localStorage.setItem("userEmail", result.email);
            navigate('/');
        }
        return result;
    };

    const loginToast = () =>
        toast.promise(Login(), {
            loading: "Logging In...",
            success: (result) => result.message,
            error: (result) => result.message,
        });

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Login</h2>
                <input
                    className={`login-input ${error && !email ? 'input-error' : ''}`}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(false); }}
                />
                <input
                    className={`login-input ${error && !password ? 'input-error' : ''}`}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(false); }}
                />
                <button onClick={loginToast} className="login-btn">Login</button>
                <p className="signup-text">Don't have an account? <span className="signup-link" onClick={() => navigate("/signup")}>Sign Up</span></p>
            </div>
        </div>
    );
}

export default Login;
