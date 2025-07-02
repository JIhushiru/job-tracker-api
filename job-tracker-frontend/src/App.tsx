import { Routes, Route } from 'react-router-dom';
import './App.css'
import LoginSignup from './pages/auth/LoginSignUp';
import Dashboard from './pages/jobs/Dashboard';
import AddJobForm from './pages/jobs/AddJobForm';
import Home from './pages/Home';

function App() {
  return (
    <Routes>
      <Route path="/" element= {<Home />}/>
      <Route path="/login" element={<LoginSignup />} />
      <Route path="/jobs" element={<Dashboard />} />
      <Route path="/add-job" element={<AddJobForm />} />
    </Routes>
  );
}


export default App
