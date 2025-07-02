import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div>
            <h1> Welcome to Job Tracker</h1>
            <p>Track your job applications with ease</p>
            <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link>
        </div>
    )
}