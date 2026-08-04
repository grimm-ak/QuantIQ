import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen text-white p-5">

      <nav className="flex flex-col gap-5">

        <Link to="/dashboard">🏠 Dashboard</Link>

        <Link to="/search">📈 Search</Link>

        <Link to="/portfolio">💼 Portfolio</Link>

        <Link to="/watchlist">⭐ Watchlist</Link>

        <Link to="/compare">⚖ Compare</Link>

      </nav>

    </aside>
  );
}

export default Sidebar;