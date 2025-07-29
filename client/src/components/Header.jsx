import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
      <div className="container flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold">TB</span>
          <span className="text-xl font-semibold">TopBooks</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-4">
          <NavLink to="/" className="text-sm text-gray-700 hover:text-gray-900">Home</NavLink>
          <NavLink to="/new" className="btn btn-ghost text-gray-700">+ New Post</NavLink>
        </nav>

        <Link to="/new" className="sm:hidden btn btn-ghost">+ New</Link>
      </div>
    </header>
  );
}
