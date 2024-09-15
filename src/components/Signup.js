import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import '../css/signup.css';

function Signup() {
    const navigate = useNavigate();
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState(false);

    useEffect(() => {
        const email = localStorage.getItem("userEmail");
        if (email) {
            navigate("/");
        }
    }, [navigate]);

    const Signup = async () => {
        if (!name || !email || !password) {
            setError(true);
            throw new Error("Enter Details");
        }

        let result = await fetch(`http://localhost:5000/auth/register`, {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        result = await result.json();
        if (result.status != 200) {
            throw new Error(result.message);
        } else {
            localStorage.setItem("userEmail", email);
            navigate('/');
        }
        return result;
    };

    const signUpToast = () =>
        toast.promise(Signup(), {
            loading: "Signing Up",
            success: (result) => result.message,
            error: (result) => result.message,
        });

    const toLogin = () => {
        navigate("/login");
    };

    return (
        <div className="signup-page">
            <div className='signup-container'>
                <h2>Sign Up</h2>
                <input 
                    className="signup-input" 
                    id={error && !name ? "input-error" : ""}
                    type="text" 
                    placeholder="Name" 
                    value={name} 
                    onChange={(e) => { setName(e.target.value); setError(false); }}
                />
                <input 
                    className="signup-input" 
                    id={error && !email ? "input-error" : ""}
                    type="text" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => { setEmail(e.target.value); setError(false); }}
                />
                <input 
                    className="signup-input" 
                    id={error && !password ? "input-error" : ""}
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => { setPassword(e.target.value); setError(false); }}
                />
                <div className="signup-already-have-an-acc">
                    Already have an account? <a onClick={toLogin}>Login</a>
                </div>
                <button onClick={signUpToast} className="signup-btn">
                    Sign Up
                </button>
            </div>
        </div>
    );
}

export default Signup;
