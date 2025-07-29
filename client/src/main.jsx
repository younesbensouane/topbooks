import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import BookDetail from './pages/BookDetail.jsx';
import CreatePost from './pages/CreatePost.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/new" element={<CreatePost />} />
      <Route path="/post/:slug" element={<BookDetail />} />
    </Routes>
  </BrowserRouter>
);
