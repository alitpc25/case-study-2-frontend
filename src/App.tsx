import React from 'react';
import NewsPage from './pages/NewsPage';
import { useAppSelector } from './redux/hooks';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import AnnouncementsPage from './pages/AnnouncementsPage';
import AdminLoginPage from './pages/AdminLoginPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css"

function App() {

  const admin = useAppSelector(state => state.admin)

  if(!admin.jwtToken) {
    return (
      <BrowserRouter>
      <div className="App">
        <ToastContainer />
          <Routes>
            <Route path="/news" element={<NewsPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/*" element={<NewsPage />} />
          </Routes>
      </div>
      </BrowserRouter>
    )
  }

  return (
      <BrowserRouter>
      <div className="App">
        <ToastContainer />
          <Routes>
            <Route path="/news" element={<NewsPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/*" element={<NewsPage />} />
          </Routes>
      </div>
      </BrowserRouter>
  );
}

export default App;
