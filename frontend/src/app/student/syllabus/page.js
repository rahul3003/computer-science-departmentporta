'use client';

import { useState, useEffect } from 'react';

export default function Syllabus() {
  const [selectedSem, setSelectedSem] = useState('Semester 1');
  const [currentUser, setCurrentUser] = useState(null);
  const [subjectsList, setSubjectsList] = useState([]);
  const [syllabusResource, setSyllabusResource] = useState(null);

  const semesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'];

  useEffect(() => {
    let userSemester = 'Semester 1';
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCurrentUser(parsed);
          if (parsed.semester) {
            userSemester = parsed.semester;
            const matched = semesters.find(
              s => s.toLowerCase() === parsed.semester.toLowerCase()
            );
            if (matched) {
              setSelectedSem(matched);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    // Fetch dynamic subjects list from backend, filtered by student's own semester
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/subjects?semester=${encodeURIComponent(userSemester)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSubjectsList(data);
        }
      })
      .catch(err => console.error('Error loading subjects:', err));
  }, []);

  // Fetch dynamic syllabus resource for the selected semester
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/resources?category=SYLLABUS&semester=${encodeURIComponent(selectedSem)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSyllabusResource(data[0]);
        } else {
          setSyllabusResource(null);
        }
      })
      .catch(err => console.error('Error loading syllabus resource:', err));
  }, [selectedSem]);

  // Group fetched subjects by semester
  const group = {};
  semesters.forEach(sem => {
    group[sem] = { credits: 0, subjects: [] };
  });

  subjectsList.forEach(sub => {
    const semKey = semesters.find(s => s.toLowerCase() === sub.semester?.toLowerCase());
    if (semKey) {
      group[semKey].subjects.push({
        code: sub.code,
        name: sub.name,
        theory: sub.theory || '4 hrs/wk',
        practical: sub.practical || '0 hrs/wk',
        type: sub.type || 'Core Theory'
      });
      group[semKey].credits += sub.credits || 0;
    }
  });

  const activeSem = group[selectedSem] || { credits: 0, subjects: [] };

  return (
    <div className="bg-white text-slate-800 py-10 px-4 sm:px-6 lg:px-8 flex-grow">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* Header & Tabs Selector Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ede6dc]/60 pb-5">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#2d1b18] tracking-tight flex items-center space-x-2">
            <span className="w-2 h-5 bg-[#4a2c2a] rounded-full"></span>
            <span>Syllabus</span>
          </h1>


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

        {/* Credit Banner */}
        <div className="bg-white border border-[#ede6dc]/70 p-5 rounded-2xl flex items-center justify-between shadow-3xs">
          <div className="space-y-1">
            <h3 className="text-[#2d1b18] font-bold text-sm">{selectedSem} Structure</h3>
            <p className="text-slate-400 text-[10px] font-semibold">Based on current Sandur Polytechnic Academic Board Guidelines.</p>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-slate-450 uppercase tracking-wider block font-bold">Total Credits</span>
            <span className="text-2xl font-extrabold text-[#4a2c2a]">{activeSem.credits}</span>
          </div>
        </div>

        {/* Syllabus Table Grid */}
        <div className="bg-white border border-[#ede6dc]/70 rounded-2xl overflow-hidden shadow-xs max-w-5xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-[#faf7f2]/50 text-slate-550 border-b border-[#ede6dc] text-xs font-bold tracking-wider uppercase">
                  <th className="p-4 pl-6 w-32 text-[#4a2c2a]">Course Code</th>
                  <th className="p-4">Subject Name</th>
                  <th className="p-4 w-32">Category</th>
                  <th className="p-4 w-32 text-center">Theory Hours</th>
                  <th className="p-4 w-32 text-center">Lab Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ede6dc]/60 text-xs">
                {activeSem.subjects.map((sub) => (
                  <tr key={sub.code} className="hover:bg-[#faf7f2]/20 transition-colors duration-200">
                    <td className="p-4 pl-6 font-bold text-[#4a2c2a]">{sub.code}</td>
                    <td className="p-4 text-slate-900 font-semibold">{sub.name}</td>
                    <td className="p-4 text-slate-500">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        sub.type === 'Practical Lab'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : sub.type === 'Elective'
                          ? 'bg-pink-50 border-pink-200 text-pink-800'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}>
                        {sub.type}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700 text-center">{sub.theory}</td>
                    <td className="p-4 text-slate-700 text-center">{sub.practical}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center pt-2">
          {syllabusResource ? (
            <a
              href={syllabusResource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-primary-brown-light hover:bg-card-border text-primary-brown border border-card-border transition-all duration-300 cursor-pointer shadow-3xs"
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="font-bold text-xs">View Semester Syllabus Guide (PDF)</span>
            </a>
          ) : (
            <div className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#faf7f2]/50 text-slate-400 border border-dashed border-[#ede6dc] text-xs font-semibold">
              Syllabus Guide PDF not uploaded yet for this semester
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
