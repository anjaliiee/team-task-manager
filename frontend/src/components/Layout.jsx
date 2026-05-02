import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Folder, LogOut } from 'lucide-react';

const Layout = ({ children }) => {
  const { logout, user } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex min-h-screen bg-[#0F1117] text-white">

      {/* 🔥 SIDEBAR */}
      <div className="w-[56px] bg-[#151821] border-r border-[#2A2D3A] flex flex-col items-center py-4 gap-4">

        {/* DASHBOARD */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `w-10 h-10 flex items-center justify-center rounded-lg transition
             ${
               isActive
                 ? 'bg-[#6C56EB] shadow-[0_0_12px_rgba(108,86,235,0.5)]'
                 : 'text-[#5A5E72] hover:bg-[#1A1D27] hover:shadow-[0_0_10px_rgba(108,86,235,0.3)]'
             }`
          }
        >
          <Home size={18} />
        </NavLink>

        {/* PROJECTS */}
        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `w-10 h-10 flex items-center justify-center rounded-lg transition
             ${
               isActive
                 ? 'bg-[#6C56EB] shadow-[0_0_12px_rgba(108,86,235,0.5)]'
                 : 'text-[#5A5E72] hover:bg-[#1A1D27] hover:shadow-[0_0_10px_rgba(108,86,235,0.3)]'
             }`
          }
        >
          <Folder size={18} />
        </NavLink>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-[#5A5E72] hover:bg-[#1A1D27] hover:shadow-[0_0_10px_rgba(108,86,235,0.3)] mt-auto"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* 🔥 MAIN */}
      <div className="flex-1">

        {/* 🔥 TOPBAR (INCREASED HEIGHT) */}
        <div className="h-[72px] px-8 flex items-center justify-between border-b border-[#2A2D3A] bg-[#0F1117]">

          {/* LEFT: BRAND */}
          <div className="flex items-center gap-4">

            {/* LOGO */}
            <div className="w-10 h-10 rounded-xl bg-[#6C56EB] flex items-center justify-center font-bold text-sm shadow-[0_0_16px_rgba(108,86,235,0.5)]">
              TF
            </div>

            {/* NAME */}
            <div className="flex flex-col leading-tight">
              <span className="text-[18px] font-semibold tracking-wide">
                TaskFlow
              </span>
              <span className="text-[12px] text-[#5A5E72]">
                Project workspace
              </span>
            </div>

          </div>

          {/* RIGHT: USER */}
          <div className="flex items-center gap-4">

            <span className="text-[#8B8FA8] text-[14px]">
              Welcome, {user?.name}
            </span>

            <div className="w-11 h-11 rounded-full bg-[#6C56EB] flex items-center justify-center font-semibold shadow-[0_0_12px_rgba(108,86,235,0.4)]">
              {getInitials(user?.name)}
            </div>

          </div>
        </div>

        {/* 🔥 CONTENT */}
        <div className="p-6">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Layout;