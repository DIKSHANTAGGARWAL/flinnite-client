import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import '../css/login.css'


function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState(false);

    useEffect(() => {
        const email = localStorage.getItem("userEmail");
        // if (email) {
        //     navigate("/");
        // }
    }, []);
    const Login = async () => {

        if (!email || !password) {
            setError(true);
            throw new Error("Enter Details");
        }

        let result = await fetch(
            `http://localhost:5000/auth/login`,
            {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        result = await result.json();
        if (result.status != 200) {
            throw new Error(result.error);
        } else {
            localStorage.setItem("userEmail", email)
            navigate('/')
        }
        return result;
    };

    const loginToast = () =>
        toast.promise(Login(), {
            loading: "Logging In",
            success: (result) => {
                return result.message;
            },
            error: (result) => {
                return result.message;
            },
        });

    const toSignup = () => {
        navigate("/signup");
    };
    return (
        <div className="login-page"> {/* Centering wrapper */}
            <div className='login-container'>
                <input 
                    className="login-input" 
                    id={error && !email && "input-error"}
                    type="text" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => { setEmail(e.target.value); setError(false); }}
                />
                <input 
                    className="login-input" 
                    id={error && !password && "input-error"}
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => { setPassword(e.target.value); setError(false); }}
                />
                <button onClick={loginToast} className="login-btn">
                    Login
                </button>
                <a className="signup-link" onClick={() => navigate("/signup")}>Signup</a> {/* Styled as a side text */}
            </div>
        </div>
    )
}

export default Login
