'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FaLock, FaUser, FaCheckCircle, FaTimes, FaSignOutAlt, FaBell, FaSun, FaMoon, FaPalette, FaUndo, FaCog } from 'react-icons/fa';
import { getThemeSettings, setThemeSettings, applyCustomStyles } from '@/lib/theme';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('light');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);

  useEffect(() => {
    const handleOpenSettings = () => setIsSettingsOpen(true);
    window.addEventListener('open-theme-settings', handleOpenSettings);
    return () => window.removeEventListener('open-theme-settings', handleOpenSettings);
  }, []);

  useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true);
    window.addEventListener('open-login-modal', handleOpenModal);
    return () => window.removeEventListener('open-login-modal', handleOpenModal);
  }, []);

  // Sync current user based on path changes (login/logout/nav)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (e) {
          console.error(e);
        }
      } else {
        setCurrentUser(null);
      }
    }
  }, [pathname]);

  // Sync theme configurations
  useEffect(() => {
    const handleThemeChange = () => {
      const settings = getThemeSettings();
      setCurrentTheme(settings.theme || 'light');
      applyCustomStyles(settings);
    };
    handleThemeChange();
    window.addEventListener('theme-settings-changed', handleThemeChange);
    return () => window.removeEventListener('theme-settings-changed', handleThemeChange);
  }, []);
  
  // Login Form State
  const [loginRole, setLoginRole] = useState('STUDENT'); // 'STUDENT', 'FACULTY', 'ADMIN'
  const [email, setEmail] = useState('student@sandur.edu');
  const [password, setPassword] = useState('password123');
  const [loginStatus, setLoginStatus] = useState(null); // 'loading', 'success', 'error'
  const [loginError, setLoginError] = useState('');

  const handleRoleTab = (role) => {
    setLoginRole(role);
    setLoginError('');
    if (role === 'STUDENT') {
      setEmail('student@sandur.edu');
      setPassword('password123');
    } else if (role === 'FACULTY') {
      setEmail('rekha.patil@sandur.edu');
      setPassword('faculty123password');
    } else {
      setEmail('admin@sandur.edu');
      setPassword('adminpassword123');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginStatus('loading');
    setLoginError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginStatus('error');
        setLoginError(data.error || 'Invalid credentials. Please try again.');
        return;
      }

      // Save user + token to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      setLoginStatus('success');

      setTimeout(() => {
        setIsModalOpen(false);
        setLoginStatus(null);
        setLoginError('');

        const role = data.user?.role;
        if (role === 'STUDENT') {
          router.push('/student/feed');
        } else {
          // ADMIN and FACULTY both go to /admin
          router.push('/admin');
        }
      }, 1000);

    } catch (err) {
      console.error('Login error:', err);
      setLoginStatus('error');
      setLoginError('Network error. Please check if the server is running.');
    }
  };

  const handleExitConsole = (e) => {
    const confirmExit = window.confirm("Are you sure you want to exit the student console?");
    if (!confirmExit) {
      e.preventDefault();
      return;
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  const handleThemeToggle = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setThemeSettings({ theme: newTheme });
  };

  return (
    <>
      <nav className={`top-0 left-0 w-full z-50 py-3.5 transition-all duration-300 ${
        pathname === '/' 
          ? 'absolute bg-transparent border-b-0 shadow-none' 
          : 'sticky bg-card-bg border-b border-card-border shadow-sm'
      }`}>
        <div className="w-full px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Title */}
            <Link 
              href="/" 
              className={`flex items-center space-x-4 group transition-all duration-300 ${
                pathname === '/' 
                  ? 'bg-white/75 backdrop-blur-md border border-white/25 px-4 py-2 rounded-2xl shadow-md animate-slide-fade' 
                  : ''
              }`}
            >
              <div className={`w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 shadow-sm transition-transform duration-300 group-hover:scale-105 ${
                pathname === '/' ? 'border-slate-200' : 'border-card-border'
              }`}>
                <img 
                  src="/sandur_logo.png" 
                  alt="Sandur Polytechnic Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className={`text-lg font-extrabold tracking-tight transition-colors duration-300 leading-tight ${
                  pathname === '/' ? 'text-slate-950' : 'text-foreground'
                }`}>
                  Sandur Polytechnic
                </span>
                <span className={`text-[10px] font-bold tracking-wider uppercase mt-1 transition-colors duration-300 ${
                  pathname === '/' ? 'text-slate-800' : 'text-foreground/60'
                }`}>
                  Computer Science & Engineering Department
                </span>
              </div>
            </Link>

            {/* Portal Console Status / Login/Theme Buttons */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle (Not available on Landing Page) */}
              {pathname !== '/' && (
                <button
                  type="button"
                  title="Toggle Theme"
                  className="p-2.5 text-primary-brown hover:bg-primary-brown-light rounded-xl border border-card-border transition-colors duration-200 cursor-pointer flex items-center justify-center animate-in fade-in"
                  onClick={handleThemeToggle}
                >
                  {currentTheme === 'dark' ? (
                    <FaSun className="w-4 h-4 text-amber-500" />
                  ) : (
                    <FaMoon className="w-4 h-4 text-primary-brown" />
                  )}
                </button>
              )}

              {pathname.startsWith('/student') || pathname.startsWith('/admin') ? (
                <>
                  {/* Welcome Card & Avatar */}
                  <div 
                    onClick={() => setIsProfileModalOpen(true)}
                    className="flex items-center space-x-2 bg-card-bg border border-card-border rounded-xl p-1.5 pr-3 shadow-sm select-none hover:bg-primary-brown-light transition-colors duration-200 cursor-pointer"
                    title="View Profile"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary-brown to-accent-brown flex items-center justify-center font-bold text-white text-[10px] shrink-0 shadow-sm">
                      {currentUser?.name ? currentUser.name.split(' ').filter(n => !n.includes('.')).map(n => n[0]).join('').slice(0, 2).toUpperCase() : (currentUser?.role === 'ADMIN' ? 'AD' : 'FA')}
                    </div>
                    <div className="hidden sm:block text-left leading-none">
                      <span className="block text-[8px] text-foreground/50 font-bold uppercase tracking-wider">Welcome</span>
                      <span className="block text-xs font-extrabold text-foreground">{currentUser?.name || 'User'}</span>
                    </div>
                  </div>

                  {/* Notification Bell Icon */}
                  <button 
                    type="button"
                    className="relative p-2.5 text-primary-brown hover:bg-primary-brown-light rounded-xl border border-card-border transition-colors duration-200 cursor-pointer"
                    onClick={() => alert("You have no new notifications.")}
                  >
                    <FaBell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white"></span>
                  </button>

                  {/* Exit Console (Icon Only) */}
                  <button
                    onClick={() => setExitConfirmOpen(true)}
                    title="Exit Console"
                    className="p-2.5 rounded-xl font-bold bg-primary-brown-light hover:bg-card-border border border-card-border text-primary-brown transition-all duration-300 flex items-center justify-center cursor-pointer"
                  >
                    <FaSignOutAlt className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl font-bold bg-primary-brown hover:bg-primary-brown-hover text-white text-xs tracking-wide shadow-md active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center space-x-2 border border-white/10"
                >
                  <FaLock className="w-3.5 h-3.5 text-white" />
                  <span>Login</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card-bg border border-card-border rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-4 right-4 z-10 text-foreground/60 hover:text-foreground bg-primary-brown-light hover:bg-card-border p-2.5 rounded-xl border border-card-border transition-all duration-200 cursor-pointer"
            >
              <FaTimes className="w-3.5 h-3.5" />
            </button>

            {/* Landscape Split View */}
            <div className="flex flex-col md:flex-row">
              {/* Left Column: Summary & Avatar Card */}
              <div className="md:w-2/5 bg-gradient-to-br from-primary-brown to-primary-brown-hover text-white p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-extrabold text-white text-3xl shadow-lg">
                  {currentUser?.name ? currentUser.name.split(' ').filter(n => !n.includes('.')).map(n => n[0]).join('').slice(0, 2).toUpperCase() : (currentUser?.role === 'ADMIN' ? 'AD' : 'FA')}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold tracking-tight">{currentUser?.name || 'User'}</h3>
                  <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/15 rounded-full text-[10px] font-bold uppercase tracking-wider text-amber-200">
                    {currentUser?.role || 'User'}
                  </span>
                </div>
                <div className="pt-2 text-[10px] text-white/70 font-semibold uppercase tracking-widest leading-relaxed">
                  Computer Science & Eng.
                  <br />
                  Sandur Polytechnic
                </div>
              </div>

              {/* Right Column: Detailed Grid */}
              <div className="flex-1 p-8 bg-background space-y-6">
                <div>
                  <h4 className="text-sm font-extrabold text-foreground uppercase tracking-wider border-b border-card-border pb-2">
                    Profile Information
                  </h4>
                </div>

                {currentUser?.role === 'STUDENT' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-foreground/60 font-bold uppercase tracking-wider">Enrollment ID (USN)</span>
                      <p className="text-xs font-bold text-foreground">{currentUser?.enrollmentId || 'SP-2024-CSE-048'}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-foreground/60 font-bold uppercase tracking-wider">Email Address</span>
                      <p className="text-xs font-bold text-foreground truncate">{currentUser?.email || 'student@sandur.edu'}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-foreground/60 font-bold uppercase tracking-wider">Current Semester</span>
                      <p className="text-xs font-bold text-foreground">{currentUser?.semester || 'Semester 5'}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-foreground/60 font-bold uppercase tracking-wider">Class Section</span>
                      <p className="text-xs font-bold text-foreground">{currentUser?.group || 'Group B'}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-foreground/60 font-bold uppercase tracking-wider">Department</span>
                      <p className="text-xs font-bold text-foreground">Computer Science & Eng.</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-foreground/60 font-bold uppercase tracking-wider">Gender</span>
                      <p className="text-xs font-bold text-foreground capitalize">{currentUser?.gender?.toLowerCase() || 'Male'}</p>
                    </div>
                  </div>
                ) : currentUser?.role === 'FACULTY' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-foreground/60 font-bold uppercase tracking-wider">Official Email</span>
                      <p className="text-xs font-bold text-foreground truncate">{currentUser?.email}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-foreground/60 font-bold uppercase tracking-wider">Designation</span>
                      <p className="text-xs font-bold text-foreground">Faculty Member</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-foreground/60 font-bold uppercase tracking-wider">Department</span>
                      <p className="text-xs font-bold text-foreground">Computer Science & Eng.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-foreground/60 font-bold uppercase tracking-wider">Official Email</span>
                      <p className="text-xs font-bold text-foreground truncate">{currentUser?.email}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-foreground/60 font-bold uppercase tracking-wider">Role</span>
                      <p className="text-xs font-bold text-foreground">Administrator</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-foreground/60 font-bold uppercase tracking-wider">Department</span>
                      <p className="text-xs font-bold text-foreground">CSE Department Portal</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-card-border/60 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setIsProfileModalOpen(false);
                      setIsSettingsOpen(true);
                    }}
                    className="flex-1 px-4 py-2 bg-primary-brown hover:bg-primary-brown-hover text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer shadow"
                  >
                    <FaCog className="w-3.5 h-3.5" />
                    <span>Console Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileModalOpen(false);
                      setExitConfirmOpen(true);
                    }}
                    className="flex-1 px-4 py-2 border border-card-border text-primary-brown hover:bg-primary-brown-light rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <FaSignOutAlt className="w-3.5 h-3.5" />
                    <span>Exit Console</span>
                  </button>
                </div>

                <div className="pt-2 text-[10px] text-foreground/60 border-t border-card-border/60">
                  Authorized Console &bull; Sandur Polytechnic Portal
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Console Design Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card-bg border border-card-border rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-brown to-primary-brown-hover text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <FaPalette className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="text-base font-extrabold text-white">Console Customization</h3>
                  <p className="text-[10px] text-white/70">Design and personalize your portal workspace</p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-white/85 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl border border-white/10 transition-colors duration-200 cursor-pointer"
              >
                <FaTimes className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content Body (Scrollable) */}
            <div className="p-6 bg-background max-h-[70vh] overflow-y-auto space-y-6 text-foreground">
              {/* Presets */}
              <div className="space-y-2.5">
                <label className="text-[10px] text-foreground/60 font-bold uppercase tracking-wider block">Quick Presets</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => setThemeSettings({ theme: 'light' })}
                    className={`p-2 rounded-xl text-left border text-xs font-bold transition-all duration-200 cursor-pointer ${currentTheme === 'light' ? 'bg-primary-brown text-white border-transparent' : 'bg-card-bg border-card-border text-primary-brown hover:bg-primary-brown-light'}`}
                  >
                    Original Cream
                  </button>
                  <button
                    onClick={() => setThemeSettings({ theme: 'dark' })}
                    className={`p-2 rounded-xl text-left border text-xs font-bold transition-all duration-200 cursor-pointer ${currentTheme === 'dark' ? 'bg-primary-brown text-white border-transparent' : 'bg-card-bg border-card-border text-primary-brown hover:bg-primary-brown-light'}`}
                  >
                    Premium Dark
                  </button>
                  <button
                    onClick={() => setThemeSettings({ theme: 'sepia' })}
                    className={`p-2 rounded-xl text-left border text-xs font-bold transition-all duration-200 cursor-pointer ${currentTheme === 'sepia' ? 'bg-primary-brown text-white border-transparent' : 'bg-card-bg border-card-border text-primary-brown hover:bg-primary-brown-light'}`}
                  >
                    Sepia Warm
                  </button>
                  <button
                    onClick={() => setThemeSettings({ theme: 'forest' })}
                    className={`p-2 rounded-xl text-left border text-xs font-bold transition-all duration-200 cursor-pointer ${currentTheme === 'forest' ? 'bg-primary-brown text-white border-transparent' : 'bg-card-bg border-card-border text-primary-brown hover:bg-primary-brown-light'}`}
                  >
                    Forest Green
                  </button>
                  <button
                    onClick={() => setThemeSettings({ theme: 'custom', bgColor: '#0f172a', textColor: '#f8fafc', cardBg: '#1e293b', cardBorder: '#334155', primaryColor: '#38bdf8', primaryColorHover: '#0ea5e9', primaryColorLight: '#1e293b' })}
                    className={`p-2 rounded-xl text-left border text-xs font-bold transition-all duration-200 cursor-pointer ${currentTheme === 'custom' ? 'bg-primary-brown text-white border-transparent shadow-sm' : 'bg-card-bg border-card-border text-primary-brown hover:bg-primary-brown-light'}`}
                  >
                    Midnight Slate
                  </button>
                </div>
              </div>

              {/* Font Selector */}
              <div className="space-y-2.5">
                <label className="text-[10px] text-foreground/60 font-bold uppercase tracking-wider block">Typography Font</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: '', name: 'Default (Geist)' },
                    { id: 'Inter', name: 'Inter' },
                    { id: 'Outfit', name: 'Outfit' },
                    { id: 'Georgia', name: 'Georgia' },
                    { id: 'Fira Code', name: 'Fira Code' },
                    { id: 'Playfair Display', name: 'Playfair' }
                  ].map(font => (
                    <button
                      key={font.id}
                      onClick={() => {
                        setThemeSettings({
                          ...getThemeSettings(),
                          fontFamily: font.id ? `'${font.id}', sans-serif` : ''
                        });
                      }}
                      style={font.id ? { fontFamily: font.id } : {}}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer bg-card-bg border-card-border text-foreground/80 hover:bg-primary-brown-light`}
                    >
                      {font.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Settings */}
              <div className="space-y-4 border-t border-card-border/60 pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-foreground/60 font-bold uppercase tracking-wider">Custom Color Workspace</label>
                  <button
                    onClick={() => setThemeSettings({ theme: 'custom', bgColor: '#ffffff', textColor: '#2d1b18', cardBg: '#faf7f2', cardBorder: '#ede6dc', primaryColor: '#4a2c2a', primaryColorHover: '#5d3a37', primaryColorLight: '#f3ede2' })}
                    className="text-[10px] font-bold text-primary-brown hover:underline cursor-pointer"
                  >
                    Reset Colors
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Background Color */}
                  <div className="flex items-center justify-between bg-card-bg border border-card-border p-3 rounded-2xl">
                    <span className="text-xs font-bold text-foreground/80">Workspace BG</span>
                    <input
                      type="color"
                      value={getThemeSettings().bgColor || '#ffffff'}
                      onChange={(e) => {
                        setThemeSettings({
                          ...getThemeSettings(),
                          theme: 'custom',
                          bgColor: e.target.value
                        });
                      }}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                    />
                  </div>

                  {/* Text Color */}
                  <div className="flex items-center justify-between bg-card-bg border border-card-border p-3 rounded-2xl">
                    <span className="text-xs font-bold text-foreground/80">Text Color</span>
                    <input
                      type="color"
                      value={getThemeSettings().textColor || '#2d1b18'}
                      onChange={(e) => {
                        setThemeSettings({
                          ...getThemeSettings(),
                          theme: 'custom',
                          textColor: e.target.value
                        });
                      }}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                    />
                  </div>

                  {/* Card Background */}
                  <div className="flex items-center justify-between bg-card-bg border border-card-border p-3 rounded-2xl">
                    <span className="text-xs font-bold text-foreground/80">Sidebar / Card BG</span>
                    <input
                      type="color"
                      value={getThemeSettings().cardBg || '#faf7f2'}
                      onChange={(e) => {
                        setThemeSettings({
                          ...getThemeSettings(),
                          theme: 'custom',
                          cardBg: e.target.value
                        });
                      }}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                    />
                  </div>

                  {/* Card Border */}
                  <div className="flex items-center justify-between bg-card-bg border border-card-border p-3 rounded-2xl">
                    <span className="text-xs font-bold text-foreground/80">Card Borders</span>
                    <input
                      type="color"
                      value={getThemeSettings().cardBorder || '#ede6dc'}
                      onChange={(e) => {
                        setThemeSettings({
                          ...getThemeSettings(),
                          theme: 'custom',
                          cardBorder: e.target.value
                        });
                      }}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                    />
                  </div>

                  {/* Primary Color */}
                  <div className="flex items-center justify-between bg-card-bg border border-card-border p-3 rounded-2xl sm:col-span-2">
                    <span className="text-xs font-bold text-foreground/80">Primary Accent Color</span>
                    <input
                      type="color"
                      value={getThemeSettings().primaryColor || '#4a2c2a'}
                      onChange={(e) => {
                        const val = e.target.value;
                        setThemeSettings({
                          ...getThemeSettings(),
                          theme: 'custom',
                          primaryColor: val,
                          primaryColorHover: val,
                          primaryColorLight: val + '15'
                        });
                      }}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-card-bg border-t border-card-border p-4 flex justify-between">
              <button
                onClick={() => {
                  setThemeSettings({ theme: 'light' });
                  setIsSettingsOpen(false);
                }}
                className="px-4 py-2 border border-card-border hover:bg-primary-brown-light text-primary-brown text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer"
              >
                <FaUndo className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-5 py-2.5 bg-primary-brown hover:bg-primary-brown-hover text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Apply & Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Exit Confirmation Modal */}
      {exitConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-2xl w-full max-w-sm relative animate-in zoom-in-95 duration-200 text-foreground">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground">Exit Portal Console?</h3>
            <p className="text-xs text-foreground/70 mt-2 leading-relaxed">
              Are you sure you want to end your current session and exit the console? Any unsaved work will be lost.
            </p>
            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={() => setExitConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-card-border bg-white text-foreground hover:bg-primary-brown-light text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setExitConfirmOpen(false);
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    window.location.href = '/';
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-md shadow-rose-600/10"
              >
                Exit Console
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Login Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card-bg border border-card-border p-8 rounded-3xl shadow-2xl w-full max-w-md relative animate-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => {
                if (loginStatus !== 'loading') {
                  setIsModalOpen(false);
                  setLoginError('');
                  setLoginStatus(null);
                }
              }}
              className="absolute top-4 right-4 text-foreground/60 hover:text-foreground bg-primary-brown-light p-2.5 rounded-xl border border-card-border hover:scale-105 transition-all duration-200"
            >
              <FaTimes className="w-3.5 h-3.5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              {/* Logo in Login Box */}
              <div className="w-18 h-18 rounded-full overflow-hidden border-2 border-card-border shadow-md flex-shrink-0">
                <img 
                  src="/sandur_logo.png" 
                  alt="Sandur Polytechnic Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-foreground">Sandur Polytechnic Portal</h2>
                <p className="text-foreground/60 text-xs font-bold uppercase tracking-wider">Computer Science & Engineering</p>
              </div>
            </div>

            <div className="space-y-2 text-center border-t border-card-border/60 pt-4 mt-4">
              <h3 className="text-sm font-bold text-foreground flex items-center justify-center space-x-2">
                <FaLock className="w-3.5 h-3.5 text-primary-brown" />
                <span>Secure Portal Gateway</span>
              </h3>
              <p className="text-foreground/60 text-[10px]">Enter your authorization credentials to access resources.</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              {/* Role Tabs */}
              <div className="flex bg-primary-brown-light p-0.5 rounded-lg border border-card-border">
                <button
                  type="button"
                  onClick={() => handleRoleTab('STUDENT')}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-md transition-all duration-200 cursor-pointer flex items-center justify-center space-x-1 ${loginRole === 'STUDENT' ? 'bg-primary-brown text-white shadow-sm' : 'text-primary-brown/70 hover:text-primary-brown'}`}
                >
                  <FaUser className="w-2.5 h-2.5" />
                  <span>Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleTab('FACULTY')}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-md transition-all duration-200 cursor-pointer flex items-center justify-center space-x-1 ${loginRole === 'FACULTY' ? 'bg-primary-brown text-white shadow-sm' : 'text-primary-brown/70 hover:text-primary-brown'}`}
                >
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span>Faculty</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleTab('ADMIN')}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-md transition-all duration-200 cursor-pointer flex items-center justify-center space-x-1 ${loginRole === 'ADMIN' ? 'bg-primary-brown text-white shadow-sm' : 'text-primary-brown/70 hover:text-primary-brown'}`}
                >
                  <FaLock className="w-2.5 h-2.5" />
                  <span>Admin</span>
                </button>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-foreground/70 text-[10px] uppercase tracking-wider font-bold">
                    {loginRole === 'STUDENT' ? 'Student Email' : loginRole === 'FACULTY' ? 'Faculty Email' : 'Admin Email'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background border border-card-border px-4 py-2.5 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary-brown"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-foreground/70 text-[10px] uppercase tracking-wider font-bold">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background border border-card-border px-4 py-2.5 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary-brown"
                  />
                </div>
              </div>

              {/* Error message */}
              {loginStatus === 'error' && loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl font-medium">
                  ✗ {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginStatus === 'loading'}
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-primary-brown hover:bg-primary-brown-hover transition-all duration-250 cursor-pointer shadow-md flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                <FaLock className="w-3.5 h-3.5" />
                <span>{loginStatus === 'loading' ? 'Authenticating...' : 'Enter Portal Console'}</span>
              </button>
            </form>

            {/* Success status */}
            {loginStatus === 'success' && (
              <div className="mt-4 bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-emerald-800 text-xs flex items-center space-x-2">
                <FaCheckCircle className="w-4 h-4 text-emerald-500 animate-bounce animate-pulse" />
                <span>Authorized! Redirecting to your console...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
