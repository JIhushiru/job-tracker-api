import { Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/jobs/Dashboard';
import AddJobForm from './pages/jobs/AddJobForm';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/jobs" element={<Dashboard />} />
      <Route path="/add-job" element={<AddJobForm />} />
    </Routes>
  );
}


export default App
