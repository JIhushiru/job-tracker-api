import { useState } from "react";
import { signup } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSucess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signup(username,password);
            setSucess("Signup successful");
            setTimeout(() => navigate("/login"), 1500);
        } catch(err:any) {
            setError(err.response?.data?.detail || "Signup failed")
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                    required
                />
                <br />
                <input
                    type="text"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    required
                />
                <br />
                <button type="submit">Submit</button>
                <span style={{ margin: "0 8px" }}></span>
                <button type="button" onClick={() => navigate("/")}>Back</button>
            </form>
            {success && <p>{success}</p>}
            {error && <p>{error}</p>}
        </div>
    )
}