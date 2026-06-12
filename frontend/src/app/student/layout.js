'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaRss, 
  FaBookOpen, 
  FaFlask, 
  FaCalendarAlt, 
  FaFileAlt, 
  FaFileInvoice, 
  FaChevronRight,
  FaUserGraduate,
  FaUserCheck,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { getThemeSettings, setThemeSettings } from '@/lib/theme';

const navItems = [
  { href: '/student/feed', label: 'Feed', icon: FaRss },
  { href: '/student/attendance', label: 'My Attendance', icon: FaUserCheck },
  { href: '/student/notes', label: 'Study Notes', icon: FaBookOpen },
  { href: '/student/lab-manuals', label: 'Lab Manuals', icon: FaFlask },
  { href: '/student/timetable', label: 'Academic Timetable', icon: FaCalendarAlt },
  { href: '/student/syllabus', label: 'Syllabus Guide', icon: FaFileAlt },
  { href: '/student/question-papers', label: 'Question Papers', icon: FaFileInvoice },
];

export default function StudentLayout({ children }) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState(null);
  const [themeSettings, setThemeSettingsState] = useState({ theme: 'light' });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Close sidebar drawer on navigation change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  // Load student profile details
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Sync theme changes in local state
  useEffect(() => {
    const syncSettings = () => {
      const current = getThemeSettings();
      setThemeSettingsState(current);
    };
    syncSettings();
    window.addEventListener('theme-settings-changed', syncSettings);
    return () => window.removeEventListener('theme-settings-changed', syncSettings);
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Mobile Sidebar Toggle Header */}
      <div className="md:hidden bg-card-bg border-b border-card-border px-6 py-3.5 sticky top-[72px] z-30 flex items-center justify-between transition-colors duration-300 shadow-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2.5 rounded-xl bg-primary-brown text-white hover:bg-primary-brown/95 transition-all duration-200 cursor-pointer shadow-sm"
            aria-label="Toggle Navigation"
          >
            {isMobileSidebarOpen ? <FaTimes className="w-4 h-4" /> : <FaBars className="w-4 h-4" />}
          </button>
          <span className="font-extrabold text-xs tracking-wider uppercase text-foreground">Student Console</span>
        </div>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 top-[128px] z-30 bg-[#2d1b18]/45 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`fixed md:sticky top-[128px] md:top-[72px] left-0 z-40 h-[calc(100vh-128px)] md:h-[calc(100vh-72px)] w-64 bg-card-bg border-r border-card-border shrink-0 p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 overflow-y-auto ${
        isMobileSidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="space-y-6">
          <div className="flex items-center px-2">
            <button
              onClick={() => {}}
              className="p-2.5 rounded-xl bg-primary-brown text-white hover:bg-primary-brown/95 transition-all duration-200 cursor-default shadow-sm"
              aria-label="Sidebar Menu Indicator"
            >
              <FaBars className="w-4 h-4" />
            </button>
          </div>

          <nav className="space-y-1.5 pt-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-primary-brown text-white shadow-md shadow-primary-brown/10'
                      : 'text-foreground/85 hover:text-primary-brown hover:bg-primary-brown-light/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4.5 h-4.5 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <FaChevronRight className="w-2.5 h-2.5" />}
                </Link>
              );
            })}


          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col min-w-0">
        {children}
      </main>
    </div>
  );
}

