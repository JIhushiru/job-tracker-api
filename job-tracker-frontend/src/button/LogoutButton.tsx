import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

export default function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    }
    return <button onClick={handleLogout}>Logout</button>
}