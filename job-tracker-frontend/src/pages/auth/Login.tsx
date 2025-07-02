import { useState } from 'react';
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom"; 

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate("/jobs");
        } catch (err:any) {
            setError(err.reponse?.data?.detail || "Login failed");
        }
    }

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <br />
                <input
                    type="password"
                    placeholder="Passsword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br />
                <button type="submit">Login</button>
                <span style={{ margin: "0 8px" }}></span>
                <button type="button" onClick={() => navigate("/")}>Back</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    )
}