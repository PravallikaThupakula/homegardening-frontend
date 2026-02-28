import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";

const DashboardLayout = ({ children }) => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen theme-page transition-colors duration-300 w-full overflow-x-hidden">
      <aside className="hidden md:flex md:w-56 lg:w-64 md:min-w-[14rem] lg:min-w-[16rem] md:max-w-[16rem] theme-sidebar p-6 transition-colors duration-300 md:border-r border-[var(--border-color)] flex-col gap-6 shrink-0">
        <div className="flex items-center justify-between md:block">
          <h2 className="text-xl md:text-2xl font-bold md:mb-4 text-green-800 theme-sidebar-title">
            🌱 Garden
          </h2>
          <button
            onClick={toggleTheme}
            className="bg-green-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-xl hover:bg-green-700 transition text-sm md:text-base shrink-0"
            title={darkMode ? "Switch to light" : "Switch to dark"}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-1 md:gap-2">
          <Link to="/dashboard" className="block p-2 md:p-3 rounded-xl theme-sidebar transition text-sm md:text-base text-left">
            📊 Dashboard
          </Link>
          <Link to="/plants" className="block p-2 md:p-3 rounded-xl theme-sidebar transition text-sm md:text-base text-left">
            🌿 My Garden
          </Link>
          <Link to="/pests" className="block p-2 md:p-3 rounded-xl theme-sidebar transition text-sm md:text-base text-left">
            🐛 Pest ID
          </Link>
          <Link to="/forum" className="block p-2 md:p-3 rounded-xl theme-sidebar transition text-sm md:text-base text-left">
            👥 Forum
          </Link>
          <Link to="/journal" className="block p-2 md:p-3 rounded-xl theme-sidebar transition text-sm md:text-base text-left">
            📝 Journal
          </Link>
          <Link to="/challenges" className="block p-2 md:p-3 rounded-xl theme-sidebar transition text-sm md:text-base text-left">
            🏆 Challenges
          </Link>
          <Link to="/seasonal-tips" className="block p-2 md:p-3 rounded-xl theme-sidebar transition text-sm md:text-base text-left">
            🍂 Seasonal Tips
          </Link>
          <Link to="/shopping-list" className="block p-2 md:p-3 rounded-xl theme-sidebar transition text-sm md:text-base text-left">
            🛒 Shopping List
          </Link>
        </nav>

        {user && (
          <div className="flex flex-col md:block border-t border-[var(--border-color)] pt-3 md:pt-0 md:mt-2 shrink-0">
            <span className="text-xs md:text-sm block mb-1" style={{ color: "var(--text-muted)" }}>
              {user.user?.name || "User"}
            </span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-xl hover:bg-red-600 transition text-sm md:text-base w-full md:w-full text-center"
            >
              Logout
            </button>
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col min-w-0 w-full">
        <header className="theme-header backdrop-blur-md px-4 md:px-6 py-3 flex justify-between items-center border-b border-[var(--border-color)] transition-colors duration-300 shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl bg-green-600 text-white"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
            <h1 className="text-base md:text-lg font-semibold truncate" style={{ color: "var(--text-primary)" }}>
              Home Gardening Assistant
            </h1>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleTheme}
              className="bg-green-600 text-white px-3 py-2 rounded-xl hover:bg-green-700 transition text-sm"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        <main
          className="p-4 md:p-6 flex-1 animate-fadeIn overflow-x-hidden min-w-0"
          style={{ backgroundColor: "var(--bg-page)", color: "var(--text-primary)" }}
        >
          {children}
        </main>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setOpen(false)}
          />
          <div className={`fixed inset-y-0 left-0 w-64 theme-sidebar p-5 border-r border-[var(--border-color)] z-50 transform transition-transform duration-200 md:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-green-800">🌱 Garden</h2>
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-gray-800"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              <Link onClick={() => setOpen(false)} to="/dashboard" className="block p-3 rounded-xl theme-sidebar transition">📊 Dashboard</Link>
              <Link onClick={() => setOpen(false)} to="/plants" className="block p-3 rounded-xl theme-sidebar transition">🌿 My Garden</Link>
              <Link onClick={() => setOpen(false)} to="/pests" className="block p-3 rounded-xl theme-sidebar transition">🐛 Pest ID</Link>
              <Link onClick={() => setOpen(false)} to="/forum" className="block p-3 rounded-xl theme-sidebar transition">👥 Forum</Link>
              <Link onClick={() => setOpen(false)} to="/journal" className="block p-3 rounded-xl theme-sidebar transition">📝 Journal</Link>
              <Link onClick={() => setOpen(false)} to="/challenges" className="block p-3 rounded-xl theme-sidebar transition">🏆 Challenges</Link>
              <Link onClick={() => setOpen(false)} to="/seasonal-tips" className="block p-3 rounded-xl theme-sidebar transition">🍂 Seasonal Tips</Link>
              <Link onClick={() => setOpen(false)} to="/shopping-list" className="block p-3 rounded-xl theme-sidebar transition">🛒 Shopping List</Link>
            </nav>
            {user && (
              <div className="mt-4 border-t border-[var(--border-color)] pt-3">
                <div className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
                  {user.user?.name || "User"}
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardLayout;
