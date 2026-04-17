import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import ProjectsPage from './pages/ProjectsPage';
import CompanyPage from './pages/CompanyPage';
import BlogPage from './pages/BlogPage';
import AdminPage from './pages/AdminPage';
import './styles.css';
import './styles/subpage.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/engineering/projects" element={<ProjectsPage section="engineering" />} />
        <Route path="/engineering/company"  element={<CompanyPage />} />
        <Route path="/engineering/blog"     element={<BlogPage type="blog" />} />
        <Route path="/design/projects"      element={<ProjectsPage section="design" />} />
        <Route path="/design/essay"         element={<BlogPage type="essay" />} />
        <Route path="/design/article"       element={<BlogPage type="article" />} />
        <Route path="/admin"               element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
