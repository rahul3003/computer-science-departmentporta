

'use client';

import { useState, useEffect } from 'react';

export default function LabManuals() {
  const [manuals, setManuals] = useState([]);
  const [selectedSem, setSelectedSem] = useState('ALL');
  const [selectedLab, setSelectedLab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  const semesters = ['ALL', 'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'];
  const labs = ['ALL', 'PC Hardware & Networking Lab', 'Software Centre', 'IT Skills Lab'];

  useEffect(() => {
    let userSemester = '';
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCurrentUser(parsed);
          if (parsed.semester) {
            userSemester = parsed.semester;
            const matched = semesters.find(s => s.toLowerCase() === parsed.semester.toLowerCase());
            if (matched) {
              setSelectedSem(matched);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    // Fetch dynamic lab manuals resources from backend filtered by student's own semester
    const url = userSemester 
      ? `http://localhost:5000/api/resources?category=LAB_MANUAL&semester=${encodeURIComponent(userSemester)}`
      : 'http://localhost:5000/api/resources?category=LAB_MANUAL';

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const formatted = data.map(item => ({
            id: item.id,
            title: item.title,
            code: item.courseCode || 'LAB-00',
            semester: item.semester,
            lab: item.description || 'Software Centre', // map S3 description as lab name
            fileUrl: item.fileUrl
          }));
          setManuals(formatted);
        }
      })
      .catch(err => console.error('Error loading manuals:', err));
  }, []);

  const filteredManuals = manuals.filter(item => {
    const matchesLab = selectedLab === 'ALL' || item.lab === selectedLab;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.code.toLowerCase().includes(search.toLowerCase());
    return matchesLab && matchesSearch;
  });

  return (
    <div className="bg-white text-slate-800 py-10 px-4 sm:px-6 lg:px-8 flex-grow">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* Header & Search Bar Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ede6dc]/60 pb-5">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#2d1b18] tracking-tight flex items-center space-x-2">
            <span className="w-2 h-5 bg-[#4a2c2a] rounded-full"></span>
            <span>Lab Manuals</span>
          </h1>

          {/* Search Input beside title */}
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#4a2c2a]/60">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search manuals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#faf7f2] border border-[#ede6dc] pl-9 pr-3 py-2 rounded-xl text-xs text-[#2d1b18] placeholder-slate-400 focus:outline-none focus:border-[#4a2c2a] shadow-sm transition-colors duration-200"
            />
          </div>
        </div>

        {/* Section Info Banner */}
        {currentUser && (
          <div className="bg-[#faf7f2] border border-[#ede6dc]/70 p-3.5 rounded-2xl flex items-center justify-between text-xs text-[#2d1b18]">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#4a2c2a] animate-pulse"></span>
              <span>Showing resources for your class: <strong>{currentUser.semester} ({currentUser.group || 'Group B'})</strong></span>
            </div>
            <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px]">Auto-Filtered</span>
          </div>
        )}

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">

          {/* Lab Selector */}
          <div className="flex bg-[#faf7f2] border border-[#ede6dc] p-1.5 rounded-2xl overflow-x-auto whitespace-nowrap scrollbar-none max-w-full">
            <div className="flex space-x-1">
              {labs.map((lab) => (
                <button
                  key={lab}
                  onClick={() => setSelectedLab(lab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all duration-205 ${
                    selectedLab === lab
                      ? 'bg-[#4a2c2a] text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 bg-transparent'
                  }`}
                >
                  {lab === 'ALL' ? 'All Labs' : lab.replace(' Lab', '')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredManuals.map((manual) => (
            <div 
              key={manual.id}
              className="bg-white border border-[#ede6dc]/70 p-5 rounded-2xl flex items-center justify-between hover:border-[#4a2c2a]/20 hover:shadow-xs transition-all duration-300"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold text-[#4a2c2a] bg-[#f3ede2] px-2 py-0.5 rounded border border-[#ede6dc]">
                    {manual.code}
                  </span>
                  <span className="text-slate-500 text-xs font-semibold">{manual.semester}</span>
                </div>
                <h3 className="text-[#2d1b18] font-bold text-sm leading-snug">{manual.title}</h3>
                <p className="text-slate-400 text-[10px] font-semibold">Facility: {manual.lab}</p>
              </div>

              <a
                href={manual.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-primary-brown hover:bg-primary-brown-hover text-white flex items-center justify-center shadow-md transition-all duration-205 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </a>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredManuals.length === 0 && (
          <div className="text-center py-16 bg-[#faf7f2] border border-[#ede6dc] rounded-2xl text-slate-500 max-w-md mx-auto">
            <svg className="w-12 h-12 mx-auto text-slate-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm">No manuals found matching your filters.</p>
          </div>
        )}

      </div>
    </div>
  );
}
