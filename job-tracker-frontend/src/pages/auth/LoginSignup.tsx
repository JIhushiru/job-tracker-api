import { useEffect, useState } from 'react';
import { login, signup } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import "./login.css";
 
export default function LoginSignup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect (() => {
        if (error) {
            const timer = setTimeout(()=> setError(""), 3000)
            return () => clearTimeout(timer);
        }
    },[error])
    
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            setError("Username and password are required");
            return;
        }
        try {
            await login(username, password);
            navigate("/jobs");
        } catch (err: any) {
            setError(err.response?.data?.detail || "Login failed");
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            setError("Username and password are required");
            return;
        }
        try {
            await signup(username, password);
            setError(""); // Clear error on success
        } catch (err: any) {
            setError(err.response?.data?.detail || "Signup failed");
        }
    };

    return (
        <div>
            <form>
                <input
                    className="accountInput"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <br />
                <div className="accountForm">
                    <input
                        className="accountInput"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        className="password"
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        <img
                            className = "passwordIcon"
                            src={showPassword ? "/icons/hiddenpassword.svg" : "/icons/showpassword.svg"}
                            alt={showPassword ? "Hide password" : "Show password"}
                        />
                    </button>
                </div>
                <br />
                <button type="submit" onClick={handleLogin} className="Loginbtn">Login</button>
                <span style={{ margin: "0 8px" }}></span>
                <button type="button" onClick={handleSignup} className="SignUpbtn">SignUp</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
}