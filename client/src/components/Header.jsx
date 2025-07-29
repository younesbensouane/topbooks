import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from '../assets/logo.svg';

export default function Header() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggleTheme() {
    const root = document.documentElement;
    const next = !isDark;
    setIsDark(next);
    if (next) {
      root.classList.add('dark'); localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark'); localStorage.setItem('theme', 'light');
    }
  }

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b dark:border-gray-800">
      <div className="container flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="TopBooks" className="h-8 w-8" />
          <span className="text-xl font-semibold">TopBooks</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-3">
          <NavLink to="/" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Home</NavLink>
          <NavLink to="/new" className="btn btn-ghost text-gray-700 dark:text-gray-300">+ New Post</NavLink>
          <button onClick={toggleTheme} className="btn btn-ghost" aria-label="Toggle dark mode">
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </nav>

        <div className="sm:hidden flex items-center gap-2">
          <button onClick={toggleTheme} className="btn btn-ghost" aria-label="Toggle dark mode">
            {isDark ? '☀️' : '🌙'}
          </button>
          <Link to="/new" className="btn btn-ghost">+ New</Link>
        </div>
      </div>
    </header>
  );
}
