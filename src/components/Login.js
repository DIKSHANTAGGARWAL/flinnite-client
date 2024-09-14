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
            `http://localhost:5000/login`,
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
        <div className='signup-container'>
            <input className="signup-input" id={error && !email && "input-error"}
                type="text" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value); }}
            />
            <input className="signup-input" id={error && !password && "input-error"}
                type="text" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value); }}
            />
            <a className="signup-btn" onClick={() => navigate("/signup")}>Signup</ a>
            <button onClick={loginToast} value="Sign Up" class="signup-btn" >
                Login
            </button>
        </div>
    )
}

export default Login
