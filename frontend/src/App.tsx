import { Routes, Route } from 'react-router-dom';
import './App.css'
import LoginSignup from './pages/auth/LoginSignup';
import Dashboard from './pages/jobs/Dashboard';
import Home from './pages/Home';

function App() {
  return (
    <Routes>
      <Route path="/" element= {<Home />}/>
      <Route path="/login" element={<LoginSignup />} />
      <Route path="/jobs" element={<Dashboard />} />
    </Routes>
  );
}


export default App
