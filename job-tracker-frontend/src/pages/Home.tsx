import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
    return (
        <>
        <div className="home-container">
            <h1 className="home-title">Welcome to Job Tracker</h1>
            <p className="home-description">Track your job applications with ease</p>
            <div className="home-links">
                <Link to="/login" className="home-link">Login</Link>
                <span> | </span>
                <Link to="/signup" className="home-link">Sign Up</Link>
            </div>
        </div>
        
        <div className="social-accounts">
            <a href="https://github.com/JihuShiru" target="_blank">
            <img src="icons/github.svg" alt="GitHub" className="social-icon github" />
            </a>
            <a href="https://facebook.com/jihushiru" target="_blank">
            <img src="/icons/facebook.svg" alt="Facebook" className="social-icon facebook" />
            </a>
            <a href="https://linkedin.com/in/jhra" target="_blank">
            <img src="/icons/linkedin.svg" alt="LinkedIn" className="social-icon linkedin" />
            </a>
        </div>
        </>
    )
}