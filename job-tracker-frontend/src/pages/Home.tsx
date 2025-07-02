import LoginSignup from "./auth/LoginSignup";
import "./Home.css";
import SocialAccount from "./social/SocialAccount";


export default function Home() {
    return (
        <>
        <div className="home-container">
            <h1 className="home-title">Welcome to Job Tracker</h1>
            <p className="home-description">Track your job applications with ease</p>
            <LoginSignup />
        </div>
        <SocialAccount />
        </>
    )
}