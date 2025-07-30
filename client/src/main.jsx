import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import BookDetail from './pages/BookDetail.jsx';
import CreatePost from './pages/CreatePost.jsx';
import EditPost from './pages/EditPost.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="post/:slug" element={<BookDetail />} />
        <Route path="post/:slug/edit" element={<EditPost />} />
        <Route path="new" element={<CreatePost />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
