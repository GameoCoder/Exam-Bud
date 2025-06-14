import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Branch from './pages/Branch';
import Semester from './pages/Semester';
import Subject from './pages/Subject';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="p-4">
      {/* <nav className="mb-4">
        <Link to="/" className="mr-4">Home</Link>
        <Link to="/admin">Admin</Link>
      </nav> */}
      <Routes>
        <Route path='*' element={<NotFound/>}/>
        <Route path="/" element={<Home/>}/>
        <Route path="/branch/:branchId" element={<Branch/>}/>
        <Route path="/branch/:branchId/semester/:semesterId" element={<Semester/>}/>
        <Route path="/branch/:branchId/semester/:semesterId/subject/:subjectId" element={<Subject/>}/>
        <Route path="/admin" element={<AdminDashboard/>}/>
      </Routes>
    </div>
  );
}
